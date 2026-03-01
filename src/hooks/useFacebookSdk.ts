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
  useEffect(() => {
    // 1. Initialize the SDK
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: "33654498497496886", // Get this from your Meta Developer Dashboard
        cookie: true,
        xfbml: true,
        version: "v19.0", // Use the latest API version
      });
    };

    // 2. Load the SDK script asynchronously
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
  }, []);
}
