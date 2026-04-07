"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSession, signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { SocialProof } from "@/components/social-proof";
import { GenerationOutput } from "@/components/generation-output";
import { PipelineSection } from "@/components/pipeline-section";
import { FeaturesSection } from "@/components/features-section";
import { PricingSection } from "@/components/pricing-section";
import { FAQSection } from "@/components/faq-section";
import { SupportSection } from "@/components/support-section";
import { Footer } from "@/components/footer";
import { useGeneration } from "@/hooks/use-generation";
import { useSettings } from "@/hooks/use-settings";
import { useHistory } from "@/hooks/use-history";
import type { OutputLanguage } from "@/types";

export default function Home() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const searchParams = useSearchParams();
  const [url, setUrl] = useState("");
  const { apiKey, loaded: settingsLoaded } = useSettings();
  const [localApiKey, setLocalApiKey] = useState("");
  const { data: session } = useSession();
  const { status, step, stepLabel, result, error, analyzedEndpoints, analyze, generate, reset } = useGeneration();
  const { addEntry } = useHistory();
  const outputRef = useRef<HTMLDivElement>(null);
  const savedRef = useRef(false);
  const urlParamLoaded = useRef(false);

  // Load URL from query parameter (from gallery links)
  useEffect(() => {
    if (!urlParamLoaded.current) {
      const urlParam = searchParams.get("url");
      if (urlParam) {
        setUrl(urlParam);
      }
      urlParamLoaded.current = true;
    }
  }, [searchParams]);

  // Sync localStorage key into local state on load
  useEffect(() => {
    if (settingsLoaded && apiKey) {
      setLocalApiKey(apiKey);
    }
  }, [settingsLoaded, apiKey]);

  // Save to history when generation completes
  useEffect(() => {
    if (status === "complete" && result && !savedRef.current) {
      savedRef.current = true;
      addEntry({
        url,
        apiName: result.metadata.name,
        toolsCount: result.metadata.tools_count,
        authType: result.metadata.auth_type,
      }, result);
    }
    if (status !== "complete") {
      savedRef.current = false;
    }
  }, [status, result, url, addEntry]);

  const handleGenerate = () => {
    if (!url.trim() || status === "generating") return;
    if (!session) {
      signIn("github");
      return;
    }
    // Phase 1: Analyze docs and detect endpoints
    analyze(url, localApiKey || undefined);
    setTimeout(() => {
      outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  };

  const handleGenerateWithSelection = (selectedEndpoints: string[], language: OutputLanguage) => {
    // Phase 2: Generate with selected endpoints and language
    generate(url, localApiKey || undefined, language, selectedEndpoints);
    setTimeout(() => {
      outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  };

  return (
    <div className="relative min-h-screen">
      <Nav />
      <Hero
        url={url}
        onUrlChange={setUrl}
        onGenerate={handleGenerate}
        generating={status === "generating"}
        apiKey={localApiKey}
        onApiKeyChange={setLocalApiKey}
      />
      <SocialProof />
      <div ref={outputRef}>
        <GenerationOutput
          step={step}
          status={status}
          stepLabel={stepLabel}
          result={result}
          error={error}
          analyzedEndpoints={analyzedEndpoints}
          onGenerateWithSelection={handleGenerateWithSelection}
          onReset={() => {
            reset();
            setUrl("");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      </div>
      <PipelineSection />
      <FeaturesSection />
      <PricingSection />
      <FAQSection />
      <SupportSection />
      <Footer />
    </div>
  );
}
