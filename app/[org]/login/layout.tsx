import type { Metadata } from "next";
import PalmTreeBackground from "@/components/ui/music/PalmTreeBackground";

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
    <PalmTreeBackground bgOpacity={0.5}>
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow ">
          {children}
        </main>
      </div>
    </PalmTreeBackground>
  );
}
