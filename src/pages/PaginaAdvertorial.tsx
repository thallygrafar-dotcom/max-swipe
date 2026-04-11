import { useState } from "react";
import SwipeHeader from "@/components/SwipeHeader";
import SwipeFooter from "@/components/SwipeFooter";
import { AdvertorialProvider } from "@/contexts/adv/AdvertorialContext";
import AdvertorialPreview from "@/components/adv/preview/AdvertorialPreview";
import EditorTabs from "@/components/adv/editor/EditorTabs";

const PaginaAdvertorialInner = () => {
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">(
    "desktop"
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SwipeHeader />

      <div className="flex-1 w-full">
        <div className="mx-auto w-full max-w-[1440px] px-6 py-6">
          <div className="flex h-[calc(100vh-3.5rem-48px)] overflow-hidden rounded-[22px] border border-border bg-card">
            <aside className="w-[400px] border-r border-border bg-card shrink-0 flex min-h-0 flex-col">
              <div className="border-b border-border px-3 py-3 bg-gradient-to-r from-[#2a0f0f] via-[#1a1212] to-transparent">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2b0f0f] border border-[#3a1a1a]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 text-[#ff3b1a]"
                    >
                      <rect x="3" y="4" width="18" height="6" rx="1" />
                      <rect x="3" y="14" width="8" height="6" rx="1" />
                      <rect x="13" y="14" width="8" height="6" rx="1" />
                    </svg>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-white">
                      Advertorial Builder
                    </p>
                    <p className="mt-0.5 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      Construtor de advertorial
                    </p>
                  </div>
                </div>
              </div>

              <EditorTabs />
            </aside>

            <main className="flex-1 flex flex-col overflow-hidden">
              <header className="border-b border-border px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <span className="text-sm text-muted-foreground">Preview</span>

                  <div className="flex items-center rounded-lg border border-border overflow-hidden">
                    <button
                      onClick={() => setPreviewMode("desktop")}
                      className={`px-4 py-2 text-sm ${
                        previewMode === "desktop"
                          ? "bg-background text-white"
                          : "text-muted-foreground"
                      }`}
                    >
                      Desktop
                    </button>

                    <button
                      onClick={() => setPreviewMode("mobile")}
                      className={`px-4 py-2 text-sm border-l border-border ${
                        previewMode === "mobile"
                          ? "bg-background text-white"
                          : "text-muted-foreground"
                      }`}
                    >
                      Mobile
                    </button>
                  </div>
                </div>
              </header>

              <div className="flex-1 overflow-auto bg-[#efefef] p-6">
                <AdvertorialPreview previewMode={previewMode} />
              </div>
            </main>
          </div>
        </div>
      </div>

      <SwipeFooter />
    </div>
  );
};

const PaginaAdvertorial = () => {
  return (
    <AdvertorialProvider>
      <PaginaAdvertorialInner />
    </AdvertorialProvider>
  );
};

export default PaginaAdvertorial;