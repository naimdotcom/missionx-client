/**
 * Meta OAuth Callback Page
 * 
 * Handles the redirect from Facebook after OAuth authorization.
 * This page is automatically called by Meta with the authorization code.
 */

'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, XCircle, Facebook, Instagram } from 'lucide-react';

function MetaCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing authorization...');
  const [accountData, setAccountData] = useState<any>(null);

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    try {
      // Extract code and state from URL parameters
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      // Check for errors from Meta
      if (error) {
        throw new Error(errorDescription || 'Authorization was denied');
      }

      if (!code || !state) {
        throw new Error('Missing authorization code or state');
      }

      // Get auth token from localStorage or session
      const authToken = localStorage.getItem('auth_token');
      if (!authToken) {
        throw new Error('Not authenticated. Please log in again.');
      }

      const apiBaseUrl = process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:8000';

      // Call the backend callback endpoint
      const response = await fetch(
        `${apiBaseUrl}/api/v1/meta/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to complete authorization');
      }

      const result = await response.json();
      
      setAccountData(result.data);
      setStatus('success');
      setMessage(`Successfully connected ${result.data.saved_accounts.length} account(s)!`);

      // Redirect to integrations page after 3 seconds
      setTimeout(() => {
        router.push('/integrations');
      }, 3000);

    } catch (err: any) {
      console.error('Meta callback error:', err);
      setStatus('error');
      setMessage(err.message || 'Failed to complete authorization');
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Connecting your accounts...
            </h2>
            <p className="text-sm text-gray-500">
              Please wait while we complete the authorization process
            </p>
          </div>
        );

      case 'success':
        return (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-green-100 p-3 mb-4">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Accounts Connected Successfully!
            </h2>
            <p className="text-sm text-gray-500 mb-6 text-center max-w-md">
              {message}
            </p>

            {accountData && accountData.saved_accounts && (
              <div className="w-full max-w-md space-y-3 mb-6">
                {accountData.saved_accounts.map((account: any) => (
                  <Card key={account.id} className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        {account.platform === 'facebook' && (
                          <Facebook className="h-5 w-5 text-blue-600" />
                        )}
                        {account.platform === 'instagram' && (
                          <Instagram className="h-5 w-5 text-pink-600" />
                        )}
                        {account.platform === 'both' && (
                          <>
                            <Facebook className="h-5 w-5 text-blue-600" />
                            <Instagram className="h-5 w-5 text-pink-600" />
                          </>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{account.page_name}</p>
                          {account.instagram_username && (
                            <p className="text-sm text-gray-500">@{account.instagram_username}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <p className="text-xs text-gray-400 mb-4">
              Redirecting to integrations page in 3 seconds...
            </p>

            <Button onClick={() => router.push('/integrations')}>
              Go to Integrations
            </Button>
          </div>
        );

      case 'error':
        return (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-red-100 p-3 mb-4">
              <XCircle className="h-12 w-12 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Connection Failed
            </h2>
            <Alert variant="destructive" className="max-w-md mb-6">
              <AlertDescription>{message}</AlertDescription>
            </Alert>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => router.push('/integrations')}>
                Back to Integrations
              </Button>
              <Button onClick={handleCallback}>
                Try Again
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 justify-center">
            <Facebook className="h-6 w-6 text-blue-600" />
            <span>Facebook & Instagram Authorization</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
}

export default function MetaCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
            <p className="text-sm text-gray-500">Loading...</p>
          </CardContent>
        </Card>
      </div>
    }>
      <MetaCallbackContent />
    </Suspense>
  );
}
