import { baseApi } from "./baseApi";

interface MetaAccount {
  id: string;
  page_id: string;
  instagram_business_account_id: string | null;
  platform: string;
  page_name: string;
  instagram_username: string | null;
  is_active: boolean;
  connected_at: string;
}

interface OAuthInitiateResponse {
  authorization_url: string;
}

interface OAuthCallbackResponse {
  accounts_added: number;
}

interface AccountsResponse {
  accounts: MetaAccount[];
}

export const instagramApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Get all connected Instagram accounts
    getInstagramAccounts: build.query<AccountsResponse, void>({
      query: () => ({
        url: "/api/v1/auth/instagram/accounts",
        service: "auth",
      }),
      providesTags: ["InstagramAccounts"],
    }),

    // Initiate OAuth flow
    initiateInstagramOAuth: build.mutation<OAuthInitiateResponse, void>({
      query: () => ({
        url: "/api/v1/auth/instagram/oauth/initiate",
        method: "POST",
        service: "auth",
      }),
    }),

    // Handle OAuth callback
    handleInstagramOAuthCallback: build.mutation<
      OAuthCallbackResponse,
      { code: string; state: string }
    >({
      query: ({ code, state }) => ({
        url: `/api/v1/auth/instagram/oauth/callback?code=${code}&state=${state}`,
        method: "GET",
        service: "auth",
      }),
      invalidatesTags: ["InstagramAccounts"],
    }),

    // Disconnect Instagram account
    disconnectInstagramAccount: build.mutation<void, string>({
      query: (accountId) => ({
        url: `/api/v1/auth/instagram/accounts/${accountId}`,
        method: "DELETE",
        service: "auth",
      }),
      invalidatesTags: ["InstagramAccounts"],
    }),
  }),
});

export const {
  useGetInstagramAccountsQuery,
  useInitiateInstagramOAuthMutation,
  useHandleInstagramOAuthCallbackMutation,
  useDisconnectInstagramAccountMutation,
} = instagramApi;
