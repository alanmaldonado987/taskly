import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { TrustBar } from "@/components/trust-bar";
import { Benefits } from "@/components/benefits";
import { FeaturesTabs } from "@/components/features-tabs";
import { AdvancedPlanning } from "@/components/advanced-planning";
import { HowToMake } from "@/components/how-to-make";
import { TemplatesGrid } from "@/components/templates-grid";
import { Testimonial } from "@/components/testimonial";
import { Awards } from "@/components/awards";
import { Faq } from "@/components/faq";
import { FinalCta } from "@/components/final-cta";
import { SiteFooter } from "@/components/site-footer";
import { CookieBanner } from "@/components/cookie-banner";

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <Hero />
      <TrustBar />
      <Benefits />
      <FeaturesTabs />
      <AdvancedPlanning />
      <HowToMake />
      <TemplatesGrid />
      <Testimonial />
      <Awards />
      <Faq />
      <FinalCta />
      <SiteFooter />
      <CookieBanner />
    </main>
  );
}