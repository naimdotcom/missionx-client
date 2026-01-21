import { redirect } from 'next/navigation';

export async function GET() {
  const fbAppId = process.env.FACEBOOK_APP_ID;
  const redirectUri = process.env.FACEBOOK_REDIRECT_URI || 'http://localhost:3000/api/auth/callback/facebook';
  
  if (!fbAppId) {
    throw new Error('FACEBOOK_APP_ID not configured');
  }

  // Required scopes for Facebook Pages and Instagram messaging
  const scopes = [
    'pages_messaging',
    'pages_manage_metadata',
    'instagram_basic',
    'instagram_manage_messages',
  ].join(',');

  const authUrl = new URL('https://www.facebook.com/v18.0/dialog/oauth');
  authUrl.searchParams.append('client_id', fbAppId);
  authUrl.searchParams.append('redirect_uri', redirectUri);
  authUrl.searchParams.append('scope', scopes);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('state', generateState());

  redirect(authUrl.toString());
}

function generateState(): string {
  // Generate a random state parameter for CSRF protection
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
