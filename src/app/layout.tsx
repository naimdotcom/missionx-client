import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import StoreProvider from "@/components/StoreProvider";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Brainchat ",
  description:
    "Brainchat - AI-powered messaging agents for social media and messaging platforms",
  icons: {
    icon: "/icons/logo.svg",
  },
};

import AuthGuard from "@/components/auth-guard";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <StoreProvider>
          <AuthGuard>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              {children}{" "}
            </ThemeProvider>
          </AuthGuard>
          <Toaster position="top-right" />
        </StoreProvider>
      </body>
    </html>
  );
}
