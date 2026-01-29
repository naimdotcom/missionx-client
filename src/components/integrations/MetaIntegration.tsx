/**
 * Meta Integration Component
 * 
 * Handles Facebook/Instagram account connection via Facebook Login for Business.
 * This component provides UI for initiating the OAuth flow and displaying connected accounts.
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Facebook, 
  Instagram, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  ExternalLink,
  Power,
  PowerOff
} from 'lucide-react';

interface MetaAccount {
  id: string;
  customer_id: number;
  page_id: string;
  page_name: string;
  instagram_business_account_id?: string;
  instagram_username?: string;
  platform: 'facebook' | 'instagram' | 'both';
  is_active: boolean;
  is_messaging_enabled: boolean;
  granted_permissions: string[];
  created_at: string;
}

interface MetaIntegrationProps {
  customerId: number;
  authToken: string;
  apiBaseUrl?: string;
}

export function MetaIntegration({ 
  customerId, 
  authToken,
  apiBaseUrl = process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:8000'
}: MetaIntegrationProps) {
  const [accounts, setAccounts] = useState<MetaAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch connected accounts on component mount
  useEffect(() => {
    fetchAccounts();
  }, [customerId]);

  const fetchAccounts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${apiBaseUrl}/api/v1/meta/accounts/${customerId}`,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch Meta accounts');
      }

      const data = await response.json();
      setAccounts(data);
    } catch (err) {
      console.error('Error fetching Meta accounts:', err);
      setError('Failed to load connected accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleConnectAccount = async () => {
    setConnecting(true);
    setError(null);

    try {
      // Step 1: Initiate OAuth flow
      const response = await fetch(`${apiBaseUrl}/api/v1/meta/initiate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_id: customerId,
          redirect_uri: window.location.origin + '/integrations/meta/callback',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to initiate OAuth flow');
      }

      const { authorization_url } = await response.json();

      // Step 2: Redirect to Meta authorization page
      window.location.href = authorization_url;
    } catch (err) {
      console.error('Error connecting Meta account:', err);
      setError('Failed to connect account. Please try again.');
      setConnecting(false);
    }
  };

  const handleDeactivateAccount = async (accountId: string) => {
    if (!confirm('Are you sure you want to deactivate this account?')) {
      return;
    }

    try {
      const response = await fetch(
        `${apiBaseUrl}/api/v1/meta/accounts/${accountId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to deactivate account');
      }

      // Refresh accounts list
      await fetchAccounts();
    } catch (err) {
      console.error('Error deactivating account:', err);
      setError('Failed to deactivate account');
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return <Facebook className="h-5 w-5 text-blue-600" />;
      case 'instagram':
        return <Instagram className="h-5 w-5 text-pink-600" />;
      case 'both':
        return (
          <div className="flex gap-1">
            <Facebook className="h-5 w-5 text-blue-600" />
            <Instagram className="h-5 w-5 text-pink-600" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Facebook className="h-6 w-6 text-blue-600" />
                Facebook & Instagram Integration
              </CardTitle>
              <CardDescription>
                Connect your Facebook Pages and Instagram Business Accounts to manage messages
              </CardDescription>
            </div>
            <Button 
              onClick={handleConnectAccount} 
              disabled={connecting}
              className="flex items-center gap-2"
            >
              {connecting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <ExternalLink className="h-4 w-4" />
                  Connect Account
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : accounts.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Facebook className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No accounts connected
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Connect your Facebook Pages and Instagram Business Accounts to start managing messages
              </p>
              <Button onClick={handleConnectAccount} disabled={connecting}>
                {connecting ? 'Connecting...' : 'Connect Your First Account'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {accounts.map((account) => (
                <Card key={account.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {getPlatformIcon(account.platform)}
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900">
                              {account.page_name}
                            </h4>
                            {account.is_active ? (
                              <Badge variant="default" className="flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                Active
                              </Badge>
                            ) : (
                              <Badge variant="destructive" className="flex items-center gap-1">
                                <XCircle className="h-3 w-3" />
                                Inactive
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mb-2">
                            Page ID: {account.page_id}
                          </p>
                          
                          {account.instagram_username && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Instagram className="h-4 w-4 text-pink-600" />
                              <span>@{account.instagram_username}</span>
                            </div>
                          )}

                          <div className="flex flex-wrap gap-1 mt-2">
                            {account.granted_permissions.map((permission) => (
                              <Badge key={permission} variant="outline" className="text-xs">
                                {permission}
                              </Badge>
                            ))}
                          </div>

                          <p className="text-xs text-gray-400 mt-2">
                            Connected {new Date(account.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeactivateAccount(account.id)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <PowerOff className="h-4 w-4" />
                        Deactivate
                      </Button>
                    </div>

                    {!account.is_messaging_enabled && (
                      <Alert variant="default" className="mt-3">
                        <AlertDescription>
                          Messaging is currently disabled for this account
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">How it works</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-600 space-y-2">
          <ol className="list-decimal list-inside space-y-2">
            <li>Click "Connect Account" to authorize with Facebook</li>
            <li>Select which Facebook Pages and Instagram accounts to connect</li>
            <li>Grant the required permissions for messaging</li>
            <li>Your accounts will appear here and be ready to receive and send messages</li>
          </ol>
          <p className="mt-4 text-xs text-gray-500">
            <strong>Note:</strong> You can only send messages to users within 24 hours of their last message 
            unless you use Message Tags or have special permissions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default MetaIntegration;
