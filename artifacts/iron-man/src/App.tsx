import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';
import { Navbar } from '@/components/ui/Navbar';
import { Hero } from '@/components/sections/Hero';
import { CinematicReveal } from '@/components/sections/CinematicReveal';
import { SynthSection } from '@/components/sections/SynthSection';
import { SystemsNominal } from '@/components/sections/SystemsNominal';
import { Footer } from '@/components/sections/Footer';
import { GlobalLoader } from '@/components/loaders/GlobalLoader';
import { LoaderProvider, useLoader } from '@/components/loaders/LoaderProvider';
import { PremiumCursor } from '@/components/cursor/PremiumCursor';
import { PageTransition } from '@/components/transitions/PageTransition';
import { AmbientEngine } from '@/components/ambient/AmbientEngine';
import { GlobalHUD } from '@/components/hud/GlobalHUD';
import { CommandPalette } from '@/components/command/CommandPalette';
import { PlatformExperience } from '@/components/platform/PlatformExperience';

function AppContent() {
  const { isAppReady } = useLoader();

  return (
    <SmoothScrollProvider>
      <div
        className={`app-shell relative min-h-full bg-background text-foreground grain ${
          isAppReady ? "app-shell--ready" : ""
        }`}
      >
        <AmbientEngine />
        <GlobalHUD />
        <Navbar />
        <main>
          <Hero />
          <CinematicReveal />
          <SynthSection />
          <SystemsNominal />
          <PlatformExperience />
        </main>
        <Footer />
      </div>
    </SmoothScrollProvider>
  );
}

function App() {
  return (
    <LoaderProvider>
      <GlobalLoader />
      <PremiumCursor />
      <PageTransition>
        <AppContent />
      </PageTransition>
      <CommandPalette />
    </LoaderProvider>
  );
}

export default App;
