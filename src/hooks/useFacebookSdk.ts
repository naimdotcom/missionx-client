import { env } from "@/lib/env";
import { useEffect } from "react";

interface FacebookLoginResponse {
  authResponse?: {
    accessToken: string;
    expiresIn: number;
    signedRequest: string;
    userID: string;
  };
  status: string;
}

declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: {
      init: (options: {
        appId: string;
        cookie: boolean;
        xfbml: boolean;
        version: string;
      }) => void;
      login: (
        callback: (response: FacebookLoginResponse) => void,
        options: {
          scope: string;
        },
      ) => void;
    };
  }
}

export function useFacebookSdk() {
  const metaAppId = env.metaAppId;

  useEffect(() => {
    if (!metaAppId) return;

    const initSdk = () => {
      window.FB.init({
        appId: metaAppId,
        cookie: true,
        xfbml: true,
        version: "v22.0",
      });
    };

    // If the SDK is already loaded, re-initialize with the correct appId
    if (window.FB) {
      initSdk();
      return;
    }

    // 1. Set the async init callback for first-time load
    window.fbAsyncInit = initSdk;

    // 2. Load the SDK script asynchronously (only once)
    (function (d, s, id) {
      const fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      const js = d.createElement(s) as HTMLScriptElement;
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs?.parentNode?.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  }, [metaAppId]);
}
