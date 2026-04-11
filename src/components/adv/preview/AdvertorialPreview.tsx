import { Image as ImageIcon, Search } from "lucide-react";
import { useAdvertorial } from "@/contexts/adv/AdvertorialContext";

const getImageSrc = (image: {
  mode: "url" | "upload";
  url: string;
  preview: string;
}) => {
  if (image.mode === "upload" && image.preview) return image.preview;
  if (image.mode === "url" && image.url) return image.url;
  return "";
};

const renderHTML = (text: string) => {
  return { __html: text || "" };
};

const AdvertorialPreview = ({
  previewMode = "desktop",
}: {
  previewMode?: "desktop" | "mobile";
}) => {
  const { config } = useAdvertorial();

  const heroSrc = getImageSrc(config.heroImage);
  const secondarySrc = getImageSrc(config.secondaryImage);
  const sidebarSrc = getImageSrc(config.sidebarImage);

  return (
    <div
      className={`mx-auto ${
        previewMode === "mobile" ? "max-w-[390px]" : "max-w-[1080px]"
      }`}
    >
      <div className="overflow-hidden rounded-xl border border-[#dcdfe5] bg-[#f7f7f7] shadow-[0_8px_28px_rgba(15,23,42,0.06)]">
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{
            backgroundColor: config.headerBgColor,
            color: config.headerTextColor,
          }}
        >
          <div>
            <div className="text-[22px] font-bold leading-none">
              <span dangerouslySetInnerHTML={renderHTML(config.brandName)} />
            </div>

            {previewMode === "desktop" && (
              <div
                className="mt-1 text-[11px]"
                style={{ color: config.headerTextColor + "CC" }}
              >
                <span
                  dangerouslySetInnerHTML={renderHTML(config.brandSubtext)}
                />
              </div>
            )}
          </div>

          {previewMode === "desktop" && (
            <div
              className="hidden items-center gap-6 text-[13px] lg:flex"
              style={{ color: config.headerTextColor + "D9" }}
            >
              {config.menuItems
                .filter((item) => item.label.trim() !== "")
                .map((item) => (
                  <span
                    key={`${item.label}-${item.url}`}
                    dangerouslySetInnerHTML={renderHTML(item.label)}
                  />
                ))}
            </div>
          )}

          <div
            className="flex items-center gap-3 text-sm"
            style={{ color: config.headerTextColor + "E6" }}
          >
            <Search className="h-5 w-5" />
          </div>
        </div>

        <div
          className={`grid gap-6 p-5 ${
            previewMode === "mobile"
              ? "grid-cols-1"
              : "grid-cols-1 lg:grid-cols-[minmax(0,1fr)_290px]"
          }`}
        >
          <div className="rounded-lg border border-[#e3e4e8] bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.03)]">
            <h1
              className="max-w-[620px] text-[34px] font-bold leading-[1.12] tracking-[-0.02em] text-[#222] md:text-[42px]"
              dangerouslySetInnerHTML={renderHTML(config.headline)}
            />

            <p
              className="mt-5 max-w-[620px] text-[16px] leading-8 text-[#6a6a6a]"
              dangerouslySetInnerHTML={renderHTML(config.subheadline)}
            />

            <p
              className="mt-5 text-[13px] text-[#7d7d7d]"
              dangerouslySetInnerHTML={renderHTML(config.author)}
            />

            <div className="mt-6 overflow-hidden rounded-md border border-[#d8d8d8] bg-gradient-to-br from-slate-200 to-slate-100 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
              {heroSrc ? (
                <img
                  src={heroSrc}
                  alt="Hero"
                  className="block h-[320px] w-full object-cover"
                />
              ) : (
                <div className="flex h-[320px] items-center justify-center text-center text-sm text-slate-500">
                  <div className="flex flex-col items-center gap-2">
                    <ImageIcon className="h-6 w-6" />
                    Imagem principal do advertorial
                  </div>
                </div>
              )}
            </div>

            <button
              className="mt-5 w-full flex items-center justify-center rounded-lg px-7 py-3 text-[14px] font-semibold transition-all duration-200 hover:-translate-y-[1px]"
              style={{
                backgroundColor: config.ctaButtonColor,
                color: config.ctaButtonTextColor,
                boxShadow: `0 8px 20px ${config.ctaButtonColor}33`,
              }}
            >
              ▶ {config.ctaText}
            </button>

            <h2 className="mt-8 text-[20px] font-bold leading-tight text-[#2a2a2a] md:text-[22px]">
              <span dangerouslySetInnerHTML={renderHTML(config.symptomsTitle)} />
            </h2>

            <p className="mt-4 text-[15px] leading-7 text-[#5f5f5f]">
              <span dangerouslySetInnerHTML={renderHTML(config.symptomsIntro)} />
            </p>

            <p className="mt-4 text-[15px] font-semibold text-[#333]">
              <span dangerouslySetInnerHTML={renderHTML(config.symptomsLead)} />
            </p>

            <ul className="mt-4 space-y-3 text-[15px] text-[#5a5a5a]">
              {config.symptomsList.map((item, index) => (
                <li key={index}>
                  ✕ <span dangerouslySetInnerHTML={renderHTML(item)} />
                </li>
              ))}
            </ul>

            <div
              className="mt-6 rounded-sm px-4 py-4 text-[14px] leading-8 shadow-[0_1px_3px_rgba(15,23,42,0.03)]"
              style={{
                backgroundColor: config.warningBox1Color,
                color: "#5c5336",
              }}
            >
              <span dangerouslySetInnerHTML={renderHTML(config.warningBox1)} />
            </div>

            <h2 className="mt-8 text-[20px] font-bold leading-tight text-[#2a2a2a] md:text-[22px]">
              <span dangerouslySetInnerHTML={renderHTML(config.crisisTitle)} />
            </h2>

            <p className="mt-4 text-[15px] leading-7 text-[#5f5f5f]">
              <span dangerouslySetInnerHTML={renderHTML(config.crisisText)} />
            </p>

            <div
              className="mt-6 rounded-sm px-4 py-4 text-[14px] leading-8 shadow-[0_1px_3px_rgba(15,23,42,0.03)]"
              style={{
                backgroundColor: config.warningBox2Color,
                color: "#4e472f",
              }}
            >
              <span dangerouslySetInnerHTML={renderHTML(config.warningBox2)} />
            </div>

            <p className="mt-5 text-[15px] leading-7 text-[#5f5f5f]">
              <span
                dangerouslySetInnerHTML={renderHTML(config.postWarningText)}
              />
            </p>

            <button
              className="mt-5 w-full flex items-center justify-center rounded-lg px-7 py-3 text-[14px] font-semibold transition-all duration-200 hover:-translate-y-[1px]"
              style={{
                backgroundColor: config.ctaButtonColor,
                color: config.ctaButtonTextColor,
                boxShadow: `0 8px 20px ${config.ctaButtonColor}33`,
              }}
            >
              ▶ {config.postWarningCtaText}
            </button>

            <h2 className="mt-10 text-[20px] font-bold leading-tight text-[#2a2a2a] md:text-[22px]">
              <span dangerouslySetInnerHTML={renderHTML(config.storyTitle)} />
            </h2>

            <div className="mt-6 rounded-lg border border-[#ececec] bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.03)]">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-[#d9a46b] text-sm font-bold text-white">
                  {getImageSrc(config.storyImage) ? (
                    <img
                      src={getImageSrc(config.storyImage)}
                      alt={config.storyName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    config.storyName.charAt(0)
                  )}
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-[#333]">
                    <span
                      dangerouslySetInnerHTML={renderHTML(config.storyName)}
                    />
                  </p>
                  <p className="text-[13px] text-[#888]">
                    <span
                      dangerouslySetInnerHTML={renderHTML(config.storyRole)}
                    />
                  </p>
                </div>
              </div>

              <p className="mt-5 text-[22px] italic leading-9 text-[#434343]">
                "<span dangerouslySetInnerHTML={renderHTML(config.storyQuote)} />
                "
              </p>

              <p className="mt-5 text-[15px] leading-7 text-[#5f5f5f]">
                <span
                  dangerouslySetInnerHTML={renderHTML(config.storyText1)}
                />
              </p>

              <div
                className="mt-5 rounded-sm px-4 py-4 text-[14px] leading-8 text-[#4e472f] shadow-[0_1px_3px_rgba(15,23,42,0.03)]"
                style={{
                  backgroundColor: config.storyHighlightColor,
                }}
              >
                <span
                  dangerouslySetInnerHTML={renderHTML(config.storyHighlight)}
                />
              </div>

              <p className="mt-5 text-[15px] leading-7 text-[#5f5f5f]">
                <span
                  dangerouslySetInnerHTML={renderHTML(config.storyText2)}
                />
              </p>
            </div>

            <button
              className="mt-5 w-full flex items-center justify-center rounded-lg px-7 py-3 text-[14px] font-semibold transition-all duration-200 hover:-translate-y-[1px]"
              style={{
                backgroundColor: config.ctaButtonColor,
                color: config.ctaButtonTextColor,
                boxShadow: `0 8px 20px ${config.ctaButtonColor}33`,
              }}
            >
              ▶ {config.ctaText}
            </button>

            <p className="mt-4 text-[13px] text-[#8a8a8a]">
              <span dangerouslySetInnerHTML={renderHTML(config.storyNote)} />
            </p>

            <div className="mt-6 overflow-hidden rounded-md border border-[#d8d8d8] bg-gradient-to-br from-amber-100 to-orange-50 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
              {secondarySrc ? (
                <img
                  src={secondarySrc}
                  alt="Secondary"
                  className="block h-[270px] w-full object-cover"
                />
              ) : (
                <div className="flex h-[270px] items-center justify-center text-center text-sm text-amber-700">
                  <div className="flex flex-col items-center gap-2">
                    <ImageIcon className="h-6 w-6" />
                    Imagem secundária do advertorial
                  </div>
                </div>
              )}
            </div>

            <h2 className="mt-8 text-[20px] font-bold leading-tight text-[#2a2a2a] md:text-[22px]">
              <span
                dangerouslySetInnerHTML={renderHTML(config.secondSectionTitle)}
              />
            </h2>

            <p className="mt-4 text-[15px] leading-7 text-[#5f5f5f]">
              <span
                dangerouslySetInnerHTML={renderHTML(config.secondSectionText)}
              />
            </p>

            <p className="mt-4 text-[15px] font-semibold leading-7 text-[#333]">
              <span
                dangerouslySetInnerHTML={renderHTML(config.secondSectionBold)}
              />
            </p>

            <h2 className="mt-10 text-[20px] font-bold leading-tight text-[#2a2a2a] md:text-[22px]">
              <span
                dangerouslySetInnerHTML={renderHTML(config.commentsTitle)}
              />
            </h2>

            <div className="mt-5 space-y-4">
              {config.comments.map((item) => {
                const commentSrc = getImageSrc(item.image);

                return (
                  <div
                    key={item.id}
                    className="rounded-lg border border-[#ececec] bg-white p-4 shadow-[0_2px_8px_rgba(15,23,42,0.02)]"
                  >
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#d8d8d8] text-xs font-bold text-[#555]">
                        {commentSrc ? (
                          <img
                            src={commentSrc}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          item.name
                            .split(" ")
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join("")
                        )}
                      </div>

                      <div className="flex-1">
                        <p className="text-[14px] font-semibold text-[#333]">
                          {item.name}
                        </p>

                        <p className="mt-2 text-[14px] leading-6 text-[#555]">
                          {item.text}
                        </p>

                        <div className="mt-4 flex items-center justify-between border-t border-[#ededed] pt-3 text-[12px] text-[#8a8a8a]">
                          <div className="flex items-center gap-4">
                            <span>{item.likes} likes</span>
                            <span>{item.comments}</span>
                          </div>

                          <span className="text-[#b0b0b0]">2 hours ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {previewMode === "desktop" && (
            <div className="space-y-5">
              <div className="rounded-lg border border-[#e3e4e8] bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.03)]">
                <h3 className="text-[20px] font-bold text-[#2f2f2f]">
                  {config.featuredTitle}
                </h3>

                <ul className="mt-4 space-y-4 text-[15px] leading-6 text-[#505050]">
                  {config.featuredArticles.map((item, index) => (
                    <li key={index}>
                      <a href={item.url || "#"} className="hover:underline">
                        + {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg border border-[#e3e4e8] bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.03)]">
                <h3 className="text-[20px] font-bold text-[#2f2f2f]">
                  {config.relatedTitle}
                </h3>

                <div className="mt-4 space-y-4">
                  {config.relatedArticles.map((item, index) => (
                    <a
                      key={index}
                      href={item.url || "#"}
                      className="block hover:opacity-90"
                    >
                      <p className="text-[15px] font-semibold leading-6 text-[#313131]">
                        {item.title}
                      </p>
                      <p className="mt-1 text-[12px] text-[#8b8b8b]">
                        {item.meta}
                      </p>
                    </a>
                  ))}
                </div>
              </div>

              <div
                className="overflow-hidden rounded-xl shadow-[0_8px_22px_rgba(21,33,95,0.16)]"
                style={{ backgroundColor: config.sidebarBgColor }}
              >
                <div className="overflow-hidden flex h-[180px] items-center justify-center text-center text-sm">
                  {sidebarSrc ? (
                    <img
                      src={sidebarSrc}
                      alt="Sidebar"
                      className="block h-full w-full object-cover"
                    />
                  ) : (
                    <div
                      className="flex flex-col items-center gap-2"
                      style={{ color: config.sidebarTextColor + "B3" }}
                    >
                      <ImageIcon className="h-6 w-6" />
                      Imagem CTA lateral
                    </div>
                  )}
                </div>

                <div className="px-5 py-6 text-center">
                  <p
                    className="text-[26px] font-bold leading-tight"
                    style={{ color: config.sidebarTextColor }}
                  >
                    {config.sidebarCtaTitle}
                  </p>

                  <p
                    className="mt-3 text-[14px] leading-6"
                    style={{ color: config.sidebarTextColor + "CC" }}
                  >
                    {config.sidebarCtaText}
                  </p>

                  <a
                    href={config.sidebarCtaButtonUrl || "#"}
                    className="mt-5 inline-flex rounded-full px-5 py-3 text-[14px] font-semibold transition-all duration-200 hover:-translate-y-[1px]"
                    style={{
                      backgroundColor: config.sidebarButtonColor,
                      color: config.sidebarButtonTextColor,
                      boxShadow: `0 8px 20px ${config.sidebarButtonColor}33`,
                    }}
                  >
                    ▶ {config.sidebarCtaButton}
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        <div
          className="relative overflow-hidden px-6 py-14 text-center"
          style={{
            backgroundColor: config.footerBgColor,
            color: config.footerTextColor,
          }}
        >
          <div className="mx-auto flex max-w-[260px] items-center justify-center gap-3">
            <div className="text-center leading-none">
              <div className="text-[20px] font-bold text-white">
                {config.footerBrandMain}
              </div>

              <div className="mt-1 text-[12px] text-white/70">
                {config.footerBrandSub}
              </div>
            </div>
          </div>

          <p className="mx-auto mt-7 max-w-[640px] text-[14px] leading-6 text-white/72">
            {config.footerText}
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3 text-[13px] text-white/78">
            {config.footerLinks.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <span>{item.label}</span>
                {index < config.footerLinks.length - 1 && <span>|</span>}
              </div>
            ))}
          </div>

          <div className="mt-6 text-[11px] text-white/50">
            {config.footerCopyright}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvertorialPreview;