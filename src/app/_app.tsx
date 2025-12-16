// pages/_app.tsx
import type { AppProps } from "next/app";
import { wrapper } from "@/store/store";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

// Wrap your app with the store wrapper
export default wrapper.withRedux(MyApp);
