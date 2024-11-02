import PalmTreeBackground from "@/components/ui/music/PalmTreeBackground";
import TopNavigation from "@/components/ui/TopNavigation";

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
      </div>
    </PalmTreeBackground>
  );
}
