type AdvertorialConfigLike = {
  siteName?: string;
  domain?: string;
};

const pageShell = (title: string, siteName: string, body: string) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} | ${siteName}</title>
  <style>
    body {
      margin: 0;
      font-family: Arial, Helvetica, sans-serif;
      background: #f7f7f7;
      color: #222;
    }
    .wrap {
      max-width: 900px;
      margin: 40px auto;
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 32px;
      box-shadow: 0 8px 28px rgba(15,23,42,0.06);
    }
    h1 {
      margin-top: 0;
      font-size: 32px;
    }
    h2 {
      margin-top: 28px;
      font-size: 20px;
    }
    p, li {
      line-height: 1.7;
      color: #4b5563;
    }
  </style>
</head>
<body>
  <div class="wrap">
    <h1>${title}</h1>
    ${body}
  </div>
</body>
</html>`;

export const buildLegalPages = (config: AdvertorialConfigLike) => {
  const siteName = config.siteName || "Advertorial Site";
  const domain = config.domain || "";

  return {
    terms: pageShell(
      "Terms of Use",
      siteName,
      `
      <p>By accessing this website, you agree to use it for lawful purposes only.</p>
      <h2>Use of Content</h2>
      <p>All content is provided for informational purposes only and may be updated without notice.</p>
      <h2>No Guarantees</h2>
      <p>We make no guarantees about specific outcomes from using the information on this website.</p>
      <h2>Contact</h2>
      <p>Website: ${domain || siteName}</p>
      `
    ),
    privacy: pageShell(
      "Privacy Policy",
      siteName,
      `
      <p>Your privacy matters to us. This page explains how information may be collected and used.</p>
      <h2>Information Collected</h2>
      <p>We may collect standard analytics, browser, and device information to improve the website experience.</p>
      <h2>How Information Is Used</h2>
      <p>Information may be used for performance, optimization, support, and communication purposes.</p>
      <h2>Contact</h2>
      <p>Website: ${domain || siteName}</p>
      `
    ),
    disclaimer: pageShell(
      "Disclaimer",
      siteName,
      `
      <p>The information on this website is provided for general informational purposes only.</p>
      <h2>No Medical Advice</h2>
      <p>Content on this website is not intended to diagnose, treat, cure, or prevent any disease and should not replace professional advice.</p>
      <h2>Results May Vary</h2>
      <p>Any examples or testimonials shown are illustrative and individual experiences may vary.</p>
      <h2>Contact</h2>
      <p>Website: ${domain || siteName}</p>
      `
    ),
  };
};