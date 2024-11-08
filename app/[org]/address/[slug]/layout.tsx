import PalmTreeBackground from "@/components/ui/music/PalmTreeBackground";
import TopNavigationWithoutProfile from "@/components/profile/TopNavigationWithoutProfile";
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
        <TopNavigationWithoutProfile params={{ org: params.org }} />
        <main className="flex-grow ">
          {children}
        </main>
      </div>
    </PalmTreeBackground>
  );
}
