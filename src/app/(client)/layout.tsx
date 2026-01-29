import { Navbar } from "@/components/navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="container mx-auto">
        <Navbar />
      </div>
      {children}
    </>
  );
}
