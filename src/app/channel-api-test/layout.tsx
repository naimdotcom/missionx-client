import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Channel API Tester",
  description:
    "Test Meta/Instagram connections, subscriptions, and channel management",
};

export default function ChannelAPILayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
