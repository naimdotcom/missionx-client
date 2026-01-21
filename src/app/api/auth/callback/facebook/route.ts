import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { channelConnections } from '@/db/schema';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  if (error) {
    console.error('OAuth error:', error, errorDescription);
    return NextResponse.redirect(new URL(`/?error=${error}`, request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL('/?error=no_code', request.url));
  }

  try {
    // Exchange code for access token
    const tokenResponse = await exchangeCodeForToken(code);
    
    if (!tokenResponse.access_token) {
      throw new Error('No access token received');
    }

    // Fetch long-lived token
    const longLivedToken = await getLongLivedToken(tokenResponse.access_token);

    // Get user's pages
    const pages = await fetchUserPages(longLivedToken.access_token);

    // Get user's Instagram business accounts
    const igAccounts = await fetchInstagramAccounts(longLivedToken.access_token, pages);

    // Store channel connections in database
    // TODO: Get organizationId from authenticated user session
    // In production, implement proper authentication (e.g., NextAuth.js)
    const organizationId = 'default-org-id';

    for (const page of pages) {
      await db.insert(channelConnections).values({
        organizationId,
        type: 'facebook_page',
        platformId: page.id,
        platformName: page.name,
        accessToken: page.access_token,
        isActive: true,
        metadata: { category: page.category },
      }).onConflictDoUpdate({
        target: [channelConnections.platformId],
        set: {
          accessToken: page.access_token,
          platformName: page.name,
          isActive: true,
          updatedAt: new Date(),
        },
      });
    }

    for (const igAccount of igAccounts) {
      await db.insert(channelConnections).values({
        organizationId,
        type: 'instagram_business',
        platformId: igAccount.id,
        platformName: igAccount.username,
        accessToken: igAccount.access_token,
        isActive: true,
        metadata: { profile_picture_url: igAccount.profile_picture_url },
      }).onConflictDoUpdate({
        target: [channelConnections.platformId],
        set: {
          accessToken: igAccount.access_token,
          platformName: igAccount.username,
          isActive: true,
          updatedAt: new Date(),
        },
      });
    }

    return NextResponse.redirect(new URL('/inbox?success=true', request.url));
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(new URL('/?error=auth_failed', request.url));
  }
}

async function exchangeCodeForToken(code: string) {
  const fbAppId = process.env.FACEBOOK_APP_ID;
  const fbAppSecret = process.env.FACEBOOK_APP_SECRET;
  const redirectUri = process.env.FACEBOOK_REDIRECT_URI || 'http://localhost:3000/api/auth/callback/facebook';

  const url = new URL('https://graph.facebook.com/v18.0/oauth/access_token');
  url.searchParams.append('client_id', fbAppId!);
  url.searchParams.append('client_secret', fbAppSecret!);
  url.searchParams.append('redirect_uri', redirectUri);
  url.searchParams.append('code', code);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Failed to exchange code: ${response.statusText}`);
  }

  return await response.json();
}

async function getLongLivedToken(shortLivedToken: string) {
  const fbAppId = process.env.FACEBOOK_APP_ID;
  const fbAppSecret = process.env.FACEBOOK_APP_SECRET;

  const url = new URL('https://graph.facebook.com/v18.0/oauth/access_token');
  url.searchParams.append('grant_type', 'fb_exchange_token');
  url.searchParams.append('client_id', fbAppId!);
  url.searchParams.append('client_secret', fbAppSecret!);
  url.searchParams.append('fb_exchange_token', shortLivedToken);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Failed to get long-lived token: ${response.statusText}`);
  }

  return await response.json();
}

async function fetchUserPages(accessToken: string) {
  const url = new URL('https://graph.facebook.com/v18.0/me/accounts');
  url.searchParams.append('access_token', accessToken);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Failed to fetch pages: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data || [];
}

async function fetchInstagramAccounts(accessToken: string, pages: any[]) {
  const igAccounts = [];

  for (const page of pages) {
    try {
      const url = new URL(`https://graph.facebook.com/v18.0/${page.id}`);
      url.searchParams.append('fields', 'instagram_business_account');
      url.searchParams.append('access_token', page.access_token);

      const response = await fetch(url.toString());
      if (!response.ok) continue;

      const data = await response.json();
      if (data.instagram_business_account) {
        // Fetch IG account details
        const igUrl = new URL(`https://graph.facebook.com/v18.0/${data.instagram_business_account.id}`);
        igUrl.searchParams.append('fields', 'username,profile_picture_url');
        igUrl.searchParams.append('access_token', page.access_token);

        const igResponse = await fetch(igUrl.toString());
        if (igResponse.ok) {
          const igData = await igResponse.json();
          igAccounts.push({
            ...igData,
            access_token: page.access_token,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching Instagram account:', error);
    }
  }

  return igAccounts;
}
