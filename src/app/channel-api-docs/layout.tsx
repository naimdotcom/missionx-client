import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Channel API Documentation",
  description:
    "Complete guide to Channel API OAuth flows, endpoints, and workflows",
};

export default function ChannelAPIDocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
