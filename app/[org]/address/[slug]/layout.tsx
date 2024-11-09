import PalmTreeBackground from "@/components/ui/music/PalmTreeBackground";
import TopNavigation from "@/components/ui/TopNavigation";
export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { org: string };
}>) {
  return (
    <PalmTreeBackground bgOpacity={0.5}>
      <div className="min-h-screen flex flex-col">
        <TopNavigation profile />
        <main className="flex-grow ">
          {children}
        </main>
      </div>
    </PalmTreeBackground>
  );
}
