import type { Metadata } from "next";
import MainNavigation from "@/components/ui/MainNavigation";

export const metadata: Metadata = {
  title: "Social Stereo",
  description: "Social Stereo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow bg-custom-purple">
        {children}
      </main>
      <MainNavigation />
    </div>
  );
}
