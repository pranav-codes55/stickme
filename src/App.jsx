import { useEffect, useState } from "react";
import Benefits from "./components/Benefits";
import CTA from "./components/CTA";
import FAQ from "./components/FAQ";
import Features from "./components/Features";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Pricing from "./components/Pricing";
import Showcase from "./components/Showcase";
import SocialProof from "./components/SocialProof";
import Studio from "./components/Studio";
import Testimonials from "./components/Testimonials";

export const STUDIO_HASH = "#/studio";

export function useRoute() {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const onChange = () => {
      setHash(window.location.hash);
      window.scrollTo({ top: 0 });
    };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return hash.startsWith(STUDIO_HASH) ? "studio" : "home";
}

export default function App() {
  const route = useRoute();

  if (route === "studio") {
    return (
      <div className="min-h-screen bg-[#080a12] text-slate-50">
        <Navbar />
        <main id="main">
          <Studio />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080a12] text-slate-50">
      <Navbar />
      <main id="main">
        <Hero />
        <SocialProof />
        <Features />
        <Showcase />
        <Benefits />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
