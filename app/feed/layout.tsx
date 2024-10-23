import type { Metadata } from "next";
import MainNavigation from "@/components/ui/MainNavigation";
import PalmTreeBackground from "@/components/ui/music/PalmTreeBackground";
import TopNavigation from "@/components/ui/TopNavigation";

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
    <PalmTreeBackground>
      <div className="min-h-screen flex flex-col">
        <TopNavigation />
        <main className="flex-grow ">
          {children}
        </main>
        <MainNavigation />
      </div>
    </PalmTreeBackground>
  );
}
