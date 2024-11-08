import type { Metadata } from "next";
import MainNavigation from "@/components/ui/MainNavigation";
import PalmTreeBackground from "@/components/ui/music/PalmTreeBackground";
import TopNavigation from "@/components/ui/TopNavigation";

export const metadata: Metadata = {
  title: "Social Stereo",
  description: "Social Stereo",
};

interface LayoutProps {
  children: React.ReactNode;
  params: {
    org: string;
  };
}

export default function RootLayout({
  children,
  params,
}: LayoutProps) {
  return (
    <PalmTreeBackground>
      <div className="min-h-screen flex flex-col">
        <TopNavigation params={{ org: params.org }} />
        <main className="flex-grow">
          {children}
        </main>
        <MainNavigation org={params.org} />
      </div>
    </PalmTreeBackground>
  );
}