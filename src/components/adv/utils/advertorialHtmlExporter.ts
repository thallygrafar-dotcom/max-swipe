type AdvertorialImageLike = {
  url?: string;
};

type LinkItem = {
  label?: string;
  url?: string;
};

type RelatedArticleItem = {
  title?: string;
  meta?: string;
  url?: string;
};

type CommentItem = {
  name?: string;
  text?: string;
  likes?: string;
  comments?: string;
  image?: AdvertorialImageLike;
};

type AdvertorialConfigLike = {
  brandName?: string;
  brandSubtext?: string;
  menuItems?: LinkItem[];
  headerBgColor?: string;
  headerTextColor?: string;

  headline?: string;
  subheadline?: string;
  author?: string;

  ctaText?: string;
  ctaButtonColor?: string;
  ctaButtonTextColor?: string;

  symptomsTitle?: string;
  symptomsIntro?: string;
  symptomsLead?: string;
  symptomsList?: string[];

  warningBox1?: string;
  warningBox1Color?: string;
  crisisTitle?: string;
  crisisText?: string;
  warningBox2?: string;
  warningBox2Color?: string;
  postWarningText?: string;
  postWarningCtaText?: string;

  storyTitle?: string;
  storyName?: string;
  storyRole?: string;
  storyQuote?: string;
  storyText1?: string;
  storyHighlight?: string;
  storyHighlightColor?: string;
  storyText2?: string;
  storyNote?: string;

  secondSectionTitle?: string;
  secondSectionText?: string;
  secondSectionBold?: string;

  commentsTitle?: string;
  comments?: CommentItem[];

  featuredTitle?: string;
  featuredArticles?: LinkItem[];
  relatedTitle?: string;
  relatedArticles?: RelatedArticleItem[];

  sidebarCtaTitle?: string;
  sidebarCtaText?: string;
  sidebarCtaButton?: string;
  sidebarCtaButtonUrl?: string;
  sidebarBgColor?: string;
  sidebarTextColor?: string;
  sidebarButtonColor?: string;
  sidebarButtonTextColor?: string;

  footerBrandMain?: string;
  footerBrandSub?: string;
  footerText?: string;
  footerLinks?: LinkItem[];
  footerCopyright?: string;
  footerBgColor?: string;
  footerTextColor?: string;

  heroImage?: AdvertorialImageLike;
  secondaryImage?: AdvertorialImageLike;
  sidebarImage?: AdvertorialImageLike;
  storyImage?: AdvertorialImageLike;
};

const safe = (value?: string) => value || "";

const getInitials = (name?: string) =>
  (name || "?")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const imageOrPlaceholder = (
  image: AdvertorialImageLike | undefined,
  alt: string,
  height: number,
  placeholder: string
) => {
  if (image?.url) {
    return `<img src="${image.url}" alt="${alt}" style="display:block;width:100%;height:${height}px;object-fit:cover;" />`;
  }

  return `<div style="height:${height}px;display:flex;align-items:center;justify-content:center;text-align:center;color:#6b7280;background:linear-gradient(135deg,#e5e7eb,#f3f4f6);font-size:14px;">${placeholder}</div>`;
};

export const buildAdvertorialHtml = (config: AdvertorialConfigLike) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${safe(config.headline)}</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: Arial, Helvetica, sans-serif;
      background: #f7f7f7;
      color: #222;
    }
    a { color: inherit; text-decoration: none; }
    .page {
      max-width: 1080px;
      margin: 0 auto;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      background: ${safe(config.headerBgColor) || "#0f172a"};
      color: ${safe(config.headerTextColor) || "#ffffff"};
    }
    .brand-title { font-size: 22px; font-weight: 700; line-height: 1; }
    .brand-sub { margin-top: 6px; font-size: 11px; opacity: .8; }
    .menu {
      display: flex;
      gap: 24px;
      font-size: 13px;
      opacity: .85;
    }
    .layout {
      display: grid;
      grid-template-columns: minmax(0,1fr) 290px;
      gap: 24px;
      padding: 20px;
    }
    .card {
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(15,23,42,.03);
    }
    .main {
      padding: 20px;
    }
    .sidebar-col {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    h1 {
      margin: 0;
      max-width: 620px;
      font-size: 42px;
      line-height: 1.12;
      letter-spacing: -.02em;
    }
    h2 {
      margin: 32px 0 0;
      font-size: 22px;
      line-height: 1.2;
    }
    h3 {
      margin: 0;
      font-size: 20px;
    }
    .subheadline {
      margin-top: 20px;
      max-width: 620px;
      font-size: 16px;
      line-height: 2;
      color: #6a6a6a;
    }
    .author {
      margin-top: 20px;
      font-size: 13px;
      color: #7d7d7d;
    }
    .cta {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      margin-top: 20px;
      padding: 14px 28px;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 700;
      background: ${safe(config.ctaButtonColor) || "#ef2b2d"};
      color: ${safe(config.ctaButtonTextColor) || "#ffffff"};
      box-shadow: 0 8px 20px ${safe(config.ctaButtonColor) || "#ef2b2d"}33;
    }
    .text {
      margin-top: 16px;
      font-size: 15px;
      line-height: 1.85;
      color: #5f5f5f;
    }
    .text-strong {
      margin-top: 16px;
      font-size: 15px;
      line-height: 1.85;
      color: #333;
      font-weight: 700;
    }
    .warning {
      margin-top: 24px;
      padding: 16px;
      border-radius: 2px;
      font-size: 14px;
      line-height: 2;
      box-shadow: 0 1px 3px rgba(15,23,42,.03);
    }
    .story-card, .comment-card, .side-card {
      padding: 20px;
    }
    .story-head {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .avatar {
      width: 48px;
      height: 48px;
      border-radius: 999px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #d9a46b;
      color: #fff;
      font-size: 14px;
      font-weight: 700;
      flex-shrink: 0;
    }
    .story-quote {
      margin-top: 20px;
      font-size: 22px;
      line-height: 1.7;
      font-style: italic;
      color: #434343;
    }
    .story-note {
      margin-top: 16px;
      font-size: 13px;
      color: #8a8a8a;
    }
    .comments {
      margin-top: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .comment-row {
      display: flex;
      gap: 12px;
      align-items: flex-start;
    }
    .comment-avatar {
      width: 40px;
      height: 40px;
      border-radius: 999px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #d8d8d8;
      color: #555;
      font-size: 12px;
      font-weight: 700;
      flex-shrink: 0;
    }
    .comment-meta {
      margin-top: 16px;
      padding-top: 12px;
      border-top: 1px solid #ededed;
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: #8a8a8a;
    }
    .featured-list, .related-list {
      margin-top: 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .featured-link:hover, .related-link:hover {
      text-decoration: underline;
    }
    .sidebar-cta {
      overflow: hidden;
      border-radius: 16px;
      box-shadow: 0 8px 22px rgba(21,33,95,.16);
      background: ${safe(config.sidebarBgColor) || "#15215f"};
    }
    .sidebar-cta-inner {
      padding: 20px;
      text-align: center;
    }
    .sidebar-cta-title {
      font-size: 26px;
      line-height: 1.2;
      font-weight: 700;
      color: ${safe(config.sidebarTextColor) || "#ffffff"};
    }
    .sidebar-cta-text {
      margin-top: 12px;
      font-size: 14px;
      line-height: 1.7;
      color: ${safe(config.sidebarTextColor) || "#ffffff"}CC;
    }
    .sidebar-cta-btn {
      display: inline-flex;
      margin-top: 20px;
      padding: 12px 20px;
      border-radius: 999px;
      font-size: 14px;
      font-weight: 700;
      background: ${safe(config.sidebarButtonColor) || "#ef2b2d"};
      color: ${safe(config.sidebarButtonTextColor) || "#ffffff"};
      box-shadow: 0 8px 20px ${safe(config.sidebarButtonColor) || "#ef2b2d"}33;
    }
    .footer {
      margin-top: 0;
      padding: 56px 24px;
      text-align: center;
      background: ${safe(config.footerBgColor) || "#18256b"};
      color: ${safe(config.footerTextColor) || "#ffffff"};
    }
    .footer-brand-main {
      font-size: 20px;
      font-weight: 700;
      color: #fff;
    }
    .footer-brand-sub {
      margin-top: 4px;
      font-size: 12px;
      color: rgba(255,255,255,.7);
    }
    .footer-text {
      max-width: 640px;
      margin: 28px auto 0;
      font-size: 14px;
      line-height: 1.7;
      color: rgba(255,255,255,.72);
    }
    .footer-links {
      margin-top: 28px;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 12px;
      font-size: 13px;
      color: rgba(255,255,255,.78);
    }
    .footer-copy {
      margin-top: 24px;
      font-size: 11px;
      color: rgba(255,255,255,.5);
    }
    @media (max-width: 980px) {
      .layout {
        grid-template-columns: 1fr;
      }
      .menu {
        display: none;
      }
      h1 {
        font-size: 34px;
      }
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div>
        <div class="brand-title">${safe(config.brandName)}</div>
        <div class="brand-sub">${safe(config.brandSubtext)}</div>
      </div>

      <div class="menu">
        ${(config.menuItems || [])
          .filter((item) => safe(item.label).trim() !== "")
          .map(
            (item) =>
              `<a href="${safe(item.url) || "#"}">${safe(item.label)}</a>`
          )
          .join("")}
      </div>

      <div>⌕</div>
    </div>

    <div class="layout">
      <div class="card main">
        <h1>${safe(config.headline)}</h1>
        <div class="subheadline">${safe(config.subheadline)}</div>
        <div class="author">${safe(config.author)}</div>

        <div style="margin-top:24px;overflow:hidden;border-radius:8px;border:1px solid #d8d8d8;">
          ${imageOrPlaceholder(
            config.heroImage,
            "Hero",
            320,
            "Imagem principal do advertorial"
          )}
        </div>

        <a class="cta" href="#">▶ ${safe(config.ctaText)}</a>

        <h2>${safe(config.symptomsTitle)}</h2>
        <div class="text">${safe(config.symptomsIntro)}</div>
        <div class="text-strong">${safe(config.symptomsLead)}</div>

        <ul class="text" style="padding-left:18px;">
          ${(config.symptomsList || [])
            .map((item) => `<li>✕ ${safe(item)}</li>`)
            .join("")}
        </ul>

        <div class="warning" style="background:${safe(
          config.warningBox1Color
        )};color:#5c5336;">
          ${safe(config.warningBox1)}
        </div>

        <h2>${safe(config.crisisTitle)}</h2>
        <div class="text">${safe(config.crisisText)}</div>

        <div class="warning" style="background:${safe(
          config.warningBox2Color
        )};color:#4e472f;">
          ${safe(config.warningBox2)}
        </div>

        <div class="text">${safe(config.postWarningText)}</div>
        <a class="cta" href="#">▶ ${safe(config.postWarningCtaText)}</a>

        <h2>${safe(config.storyTitle)}</h2>

        <div class="card story-card" style="margin-top:24px;">
          <div class="story-head">
            <div class="avatar">
              ${
                config.storyImage?.url
                  ? `<img src="${config.storyImage.url}" alt="${safe(
                      config.storyName
                    )}" style="width:100%;height:100%;object-fit:cover;" />`
                  : getInitials(config.storyName)
              }
            </div>

            <div>
              <div style="font-size:15px;font-weight:700;color:#333;">${safe(
                config.storyName
              )}</div>
              <div style="font-size:13px;color:#888;">${safe(
                config.storyRole
              )}</div>
            </div>
          </div>

          <div class="story-quote">"${safe(config.storyQuote)}"</div>
          <div class="text">${safe(config.storyText1)}</div>

          <div class="warning" style="background:${safe(
            config.storyHighlightColor
          )};color:#4e472f;">
            ${safe(config.storyHighlight)}
          </div>

          <div class="text">${safe(config.storyText2)}</div>
        </div>

        <a class="cta" href="#">▶ ${safe(config.ctaText)}</a>
        <div class="story-note">${safe(config.storyNote)}</div>

        <div style="margin-top:24px;overflow:hidden;border-radius:8px;border:1px solid #d8d8d8;">
          ${imageOrPlaceholder(
            config.secondaryImage,
            "Secondary",
            270,
            "Imagem secundária do advertorial"
          )}
        </div>

        <h2>${safe(config.secondSectionTitle)}</h2>
        <div class="text">${safe(config.secondSectionText)}</div>
        <div class="text-strong">${safe(config.secondSectionBold)}</div>

        <h2>${safe(config.commentsTitle)}</h2>

        <div class="comments">
          ${(config.comments || [])
            .map(
              (item) => `
            <div class="card comment-card">
              <div class="comment-row">
                <div class="comment-avatar">
                  ${
                    item.image?.url
                      ? `<img src="${item.image.url}" alt="${safe(
                          item.name
                        )}" style="width:100%;height:100%;object-fit:cover;" />`
                      : getInitials(item.name)
                  }
                </div>

                <div style="flex:1;">
                  <div style="font-size:14px;font-weight:700;color:#333;">${safe(
                    item.name
                  )}</div>
                  <div style="margin-top:8px;font-size:14px;line-height:1.6;color:#555;">${safe(
                    item.text
                  )}</div>

                  <div class="comment-meta">
                    <div style="display:flex;gap:16px;">
                      <span>${safe(item.likes)} likes</span>
                      <span>${safe(item.comments)}</span>
                    </div>
                    <span style="color:#b0b0b0;">2 hours ago</span>
                  </div>
                </div>
              </div>
            </div>`
            )
            .join("")}
        </div>
      </div>

      <div class="sidebar-col">
        <div class="card side-card">
          <h3>${safe(config.featuredTitle)}</h3>
          <div class="featured-list">
            ${(config.featuredArticles || [])
              .map(
                (item) =>
                  `<a class="featured-link" href="${safe(item.url) || "#"}">+ ${safe(
                    item.label
                  )}</a>`
              )
              .join("")}
          </div>
        </div>

        <div class="card side-card">
          <h3>${safe(config.relatedTitle)}</h3>
          <div class="related-list">
            ${(config.relatedArticles || [])
              .map(
                (item) => `
                  <a class="related-link" href="${safe(item.url) || "#"}">
                    <div style="font-size:15px;font-weight:700;line-height:1.5;color:#313131;">${safe(
                      item.title
                    )}</div>
                    <div style="margin-top:4px;font-size:12px;color:#8b8b8b;">${safe(
                      item.meta
                    )}</div>
                  </a>
                `
              )
              .join("")}
          </div>
        </div>

        <div class="sidebar-cta">
          ${imageOrPlaceholder(
            config.sidebarImage,
            "Sidebar",
            180,
            "Imagem CTA lateral"
          )}

          <div class="sidebar-cta-inner">
            <div class="sidebar-cta-title">${safe(config.sidebarCtaTitle)}</div>
            <div class="sidebar-cta-text">${safe(config.sidebarCtaText)}</div>
            <a class="sidebar-cta-btn" href="${safe(
              config.sidebarCtaButtonUrl
            ) || "#"}">
              ▶ ${safe(config.sidebarCtaButton)}
            </a>
          </div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="footer-brand-main">${safe(config.footerBrandMain)}</div>
      <div class="footer-brand-sub">${safe(config.footerBrandSub)}</div>
      <div class="footer-text">${safe(config.footerText)}</div>

      <div class="footer-links">
        ${(config.footerLinks || [])
          .map(
            (item, index, arr) =>
              `<span>${safe(item.label)}${
                index < arr.length - 1 ? " |" : ""
              }</span>`
          )
          .join("")}
      </div>

      <div class="footer-copy">${safe(config.footerCopyright)}</div>
    </div>
  </div>
</body>
</html>`;
};