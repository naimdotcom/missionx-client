import type { Metadata } from "next";
import "./globals.css";
import { ReactQueryProvider } from "@/components/providers/ReactQueryProvider";

export const metadata: Metadata = {
  title: "MissionX CX Omnichannel Inbox",
  description: "Unified inbox for Facebook and Instagram messages",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
