"use client";

import { Suspense, lazy } from "react";
import {
  ArrowRight,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
import { SidebarAd } from "@/components/ads/SidebarAd";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";

const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`} />
);

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  moduleLinkMap: Record<string, { url: string; title: string } | null>;
  locale: string;
}

export default function HomePageClient({ latestArticles, locale }: HomePageClientProps) {
  const t = useMessages() as any;
  const mobileBannerAd = getPreferredMobileBannerSelection();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://wizardalchemy.wiki";

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Wizard Alchemy Wiki",
        description:
          "Complete Wizard Alchemy Wiki covering Roblox codes, potion recipes, races, materials, wands, monsters, and gear progression guides.",
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Wizard Alchemy Wiki",
        url: siteUrl,
        sameAs: [
          "https://www.roblox.com/games/118821269826806/Wizard-Alchemy",
          "https://discord.com/invite/8z84cEsu",
          "https://www.roblox.com/communities/509055872/Muggle-Academy",
          "https://www.youtube.com/watch?v=1WqLnUZm2J0",
        ],
      },
    ],
  };

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <aside className="hidden xl:block fixed top-20 w-40 z-10" style={{ left: "calc((100vw - 896px) / 2 - 180px)" }}>
        <SidebarAd type="sidebar-160x300" adKey={process.env.NEXT_PUBLIC_AD_SIDEBAR_160X300} />
      </aside>
      <aside className="hidden xl:block fixed top-20 w-40 z-10" style={{ right: "calc((100vw - 896px) / 2 - 180px)" }}>
        <SidebarAd type="sidebar-160x600" adKey={process.env.NEXT_PUBLIC_AD_SIDEBAR_160X600} />
      </aside>

      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4 md:mb-6">
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">{t.hero.badge}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-[1.05]">{t.hero.title}</h1>
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">{t.hero.description}</p>
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <button
                onClick={() => scrollToSection("wizard-alchemy-codes")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4 bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)] text-white rounded-lg font-semibold text-base md:text-lg transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href="https://www.roblox.com/games/118821269826806/Wizard-Alchemy"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4 border border-border hover:bg-white/10 rounded-lg font-semibold text-base md:text-lg transition-colors"
              >
                {t.hero.playOnRobloxCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      <section className="px-4 py-10 md:py-12">
        <div className="scroll-reveal container mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature videoId="1WqLnUZm2J0" title="Wizard Alchemy Guide" posterImage="/images/hero.webp" />
          </div>
        </div>
      </section>

      <LatestGuidesAccordion articles={latestArticles} locale={locale} max={12} />

      <section className="px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">{t.tools.title} <span className="text-[hsl(var(--nav-theme-light))]">{t.tools.titleHighlight}</span></h2>
            <p className="text-base md:text-lg text-muted-foreground">{t.tools.subtitle}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
            <a href="#wizard-alchemy-codes" onClick={(e) => { e.preventDefault(); scrollToSection("wizard-alchemy-codes"); }} className="scroll-reveal group rounded-xl border border-border p-4 md:p-6 bg-card hover:border-[hsl(var(--nav-theme)/0.5)] transition-all duration-300 cursor-pointer text-left hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]">
              <div className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12 bg-[hsl(var(--nav-theme)/0.1)] flex items-center justify-center group-hover:bg-[hsl(var(--nav-theme)/0.2)] transition-colors"><DynamicIcon name={t.tools.cards[0].icon} className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]" /></div><h3 className="mb-1.5 text-sm md:text-base font-semibold">{t.tools.cards[0].title}</h3><p className="text-sm text-muted-foreground">{t.tools.cards[0].description}</p>
            </a>
            <a href="#wizard-alchemy-beginner-guide" onClick={(e) => { e.preventDefault(); scrollToSection("wizard-alchemy-beginner-guide"); }} className="scroll-reveal group rounded-xl border border-border p-4 md:p-6 bg-card hover:border-[hsl(var(--nav-theme)/0.5)] transition-all duration-300 cursor-pointer text-left hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]">
              <div className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12 bg-[hsl(var(--nav-theme)/0.1)] flex items-center justify-center group-hover:bg-[hsl(var(--nav-theme)/0.2)] transition-colors"><DynamicIcon name={t.tools.cards[1].icon} className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]" /></div><h3 className="mb-1.5 text-sm md:text-base font-semibold">{t.tools.cards[1].title}</h3><p className="text-sm text-muted-foreground">{t.tools.cards[1].description}</p>
            </a>
            <a href="#wizard-alchemy-race-tier-list" onClick={(e) => { e.preventDefault(); scrollToSection("wizard-alchemy-race-tier-list"); }} className="scroll-reveal group rounded-xl border border-border p-4 md:p-6 bg-card hover:border-[hsl(var(--nav-theme)/0.5)] transition-all duration-300 cursor-pointer text-left hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]">
              <div className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12 bg-[hsl(var(--nav-theme)/0.1)] flex items-center justify-center group-hover:bg-[hsl(var(--nav-theme)/0.2)] transition-colors"><DynamicIcon name={t.tools.cards[2].icon} className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]" /></div><h3 className="mb-1.5 text-sm md:text-base font-semibold">{t.tools.cards[2].title}</h3><p className="text-sm text-muted-foreground">{t.tools.cards[2].description}</p>
            </a>
            <a href="#wizard-alchemy-potions-guide" onClick={(e) => { e.preventDefault(); scrollToSection("wizard-alchemy-potions-guide"); }} className="scroll-reveal group rounded-xl border border-border p-4 md:p-6 bg-card hover:border-[hsl(var(--nav-theme)/0.5)] transition-all duration-300 cursor-pointer text-left hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]">
              <div className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12 bg-[hsl(var(--nav-theme)/0.1)] flex items-center justify-center group-hover:bg-[hsl(var(--nav-theme)/0.2)] transition-colors"><DynamicIcon name={t.tools.cards[3].icon} className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]" /></div><h3 className="mb-1.5 text-sm md:text-base font-semibold">{t.tools.cards[3].title}</h3><p className="text-sm text-muted-foreground">{t.tools.cards[3].description}</p>
            </a>
            <a href="#wizard-alchemy-materials-farming-guide" onClick={(e) => { e.preventDefault(); scrollToSection("wizard-alchemy-materials-farming-guide"); }} className="scroll-reveal group rounded-xl border border-border p-4 md:p-6 bg-card hover:border-[hsl(var(--nav-theme)/0.5)] transition-all duration-300 cursor-pointer text-left hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]">
              <div className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12 bg-[hsl(var(--nav-theme)/0.1)] flex items-center justify-center group-hover:bg-[hsl(var(--nav-theme)/0.2)] transition-colors"><DynamicIcon name={t.tools.cards[4].icon} className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]" /></div><h3 className="mb-1.5 text-sm md:text-base font-semibold">{t.tools.cards[4].title}</h3><p className="text-sm text-muted-foreground">{t.tools.cards[4].description}</p>
            </a>
            <a href="#wizard-alchemy-wands-guide" onClick={(e) => { e.preventDefault(); scrollToSection("wizard-alchemy-wands-guide"); }} className="scroll-reveal group rounded-xl border border-border p-4 md:p-6 bg-card hover:border-[hsl(var(--nav-theme)/0.5)] transition-all duration-300 cursor-pointer text-left hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]">
              <div className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12 bg-[hsl(var(--nav-theme)/0.1)] flex items-center justify-center group-hover:bg-[hsl(var(--nav-theme)/0.2)] transition-colors"><DynamicIcon name={t.tools.cards[5].icon} className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]" /></div><h3 className="mb-1.5 text-sm md:text-base font-semibold">{t.tools.cards[5].title}</h3><p className="text-sm text-muted-foreground">{t.tools.cards[5].description}</p>
            </a>
            <a href="#wizard-alchemy-monsters-boss-drops-guide" onClick={(e) => { e.preventDefault(); scrollToSection("wizard-alchemy-monsters-boss-drops-guide"); }} className="scroll-reveal group rounded-xl border border-border p-4 md:p-6 bg-card hover:border-[hsl(var(--nav-theme)/0.5)] transition-all duration-300 cursor-pointer text-left hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]">
              <div className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12 bg-[hsl(var(--nav-theme)/0.1)] flex items-center justify-center group-hover:bg-[hsl(var(--nav-theme)/0.2)] transition-colors"><DynamicIcon name={t.tools.cards[6].icon} className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]" /></div><h3 className="mb-1.5 text-sm md:text-base font-semibold">{t.tools.cards[6].title}</h3><p className="text-sm text-muted-foreground">{t.tools.cards[6].description}</p>
            </a>
            <a href="#wizard-alchemy-equipment-guide" onClick={(e) => { e.preventDefault(); scrollToSection("wizard-alchemy-equipment-guide"); }} className="scroll-reveal group rounded-xl border border-border p-4 md:p-6 bg-card hover:border-[hsl(var(--nav-theme)/0.5)] transition-all duration-300 cursor-pointer text-left hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]">
              <div className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12 bg-[hsl(var(--nav-theme)/0.1)] flex items-center justify-center group-hover:bg-[hsl(var(--nav-theme)/0.2)] transition-colors"><DynamicIcon name={t.tools.cards[7].icon} className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]" /></div><h3 className="mb-1.5 text-sm md:text-base font-semibold">{t.tools.cards[7].title}</h3><p className="text-sm text-muted-foreground">{t.tools.cards[7].description}</p>
            </a>
          </div>
        </div>
      </section>

      <AdBanner type="banner-300x250" adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250} className="md:hidden" />
      <AdBanner type="banner-728x90" adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90} className="hidden md:flex" />

      <section id="wizard-alchemy-codes" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">{t.modules.wizardAlchemyCodes.title}</h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">{t.modules.wizardAlchemyCodes.intro}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.wizardAlchemyCodes.cards.map((card: any, idx: number) => (
              <div key={idx} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <h3 className="font-bold text-lg mb-2 text-[hsl(var(--nav-theme-light))]">{card.name}</h3>
                <p className="text-muted-foreground text-sm">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="wizard-alchemy-beginner-guide" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">{t.modules.wizardAlchemyBeginnerGuide.title}</h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">{t.modules.wizardAlchemyBeginnerGuide.intro}</p>
          </div>
          <div className="space-y-3 md:space-y-4">
            {t.modules.wizardAlchemyBeginnerGuide.steps.map((step: any, i: number) => (
              <div key={i} className="flex gap-3 md:gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                  <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">{i + 1}</span>
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">{step.title}</h3>
                  <p className="text-sm md:text-base text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="wizard-alchemy-race-tier-list" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.modules.wizardAlchemyRaceTierList.title}</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.wizardAlchemyRaceTierList.intro}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.wizardAlchemyRaceTierList.tiers.map((tier: any, i: number) => (
              <div key={i} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <h3 className="font-bold text-lg mb-2 text-[hsl(var(--nav-theme-light))]">{tier.name}</h3>
                <p className="text-muted-foreground text-sm">{tier.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="wizard-alchemy-potions-guide" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.modules.wizardAlchemyPotionsGuide.title}</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.wizardAlchemyPotionsGuide.intro}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.wizardAlchemyPotionsGuide.cards.map((card: any, i: number) => (
              <div key={i} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <h3 className="font-bold text-lg mb-2 text-[hsl(var(--nav-theme-light))]">{card.name}</h3>
                <p className="text-muted-foreground text-sm">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="wizard-alchemy-materials-farming-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.modules.wizardAlchemyMaterialsFarmingGuide.title}</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.wizardAlchemyMaterialsFarmingGuide.intro}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.wizardAlchemyMaterialsFarmingGuide.cards.map((card: any, i: number) => (
              <div key={i} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <h3 className="font-bold text-lg mb-2 text-[hsl(var(--nav-theme-light))]">{card.name}</h3>
                <p className="text-muted-foreground text-sm">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="wizard-alchemy-wands-guide" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.modules.wizardAlchemyWandsGuide.title}</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.wizardAlchemyWandsGuide.intro}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.wizardAlchemyWandsGuide.cards.map((card: any, i: number) => (
              <div key={i} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <h3 className="font-bold text-lg mb-2 text-[hsl(var(--nav-theme-light))]">{card.name}</h3>
                <p className="text-muted-foreground text-sm">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="wizard-alchemy-monsters-boss-drops-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.modules.wizardAlchemyMonstersAndBossDropsGuide.title}</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.wizardAlchemyMonstersAndBossDropsGuide.intro}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.wizardAlchemyMonstersAndBossDropsGuide.cards.map((card: any, i: number) => (
              <div key={i} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <h3 className="font-bold text-lg mb-2 text-[hsl(var(--nav-theme-light))]">{card.name}</h3>
                <p className="text-muted-foreground text-sm">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="wizard-alchemy-equipment-guide" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.modules.wizardAlchemyEquipmentGuide.title}</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.wizardAlchemyEquipmentGuide.intro}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.wizardAlchemyEquipmentGuide.cards.map((card: any, i: number) => (
              <div key={i} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <h3 className="font-bold text-lg mb-2 text-[hsl(var(--nav-theme-light))]">{card.name}</h3>
                <p className="text-muted-foreground text-sm">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Suspense fallback={<LoadingPlaceholder height="h-96" />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      <Suspense fallback={<LoadingPlaceholder height="h-80" />}>
        <CTASection title={t.cta.title} description={t.cta.description} joinCommunityText={t.cta.joinCommunity} joinGameText={t.cta.joinGame} />
      </Suspense>

      <AdBanner
        type={mobileBannerAd.type}
        adKey={mobileBannerAd.adKey}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />
    </div>
  );
}
