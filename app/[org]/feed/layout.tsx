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
    <PalmTreeBackground bgOpacity={0.5}>
      <div className="flex flex-grow h-screen flex-col">
        <div className="flex flex-col flex-grow overflow-auto">
          <TopNavigation params={{ org: params.org }} />
          <main className="flex-grow">
            {children}
          </main>
        </div>
        <MainNavigation org={params.org} />
      </div>
    </PalmTreeBackground>
  );
}