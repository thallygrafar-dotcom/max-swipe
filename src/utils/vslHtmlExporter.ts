import { VSLConfig } from "@/types/vsl";

export function generateVSLHTML(config: VSLConfig): string {
  const commentsHTML = config.comments.map(comment => `
        <div class="comment-card">
          <div class="comment-header">
            <img src="${comment.avatar}" alt="${comment.name}" class="comment-avatar">
            <div class="comment-info">
              <span class="comment-name">${comment.name}</span>
              <span class="comment-time">${comment.time}</span>
            </div>
          </div>
          <p class="comment-text">${comment.text}</p>
          <div class="comment-actions">
            <span class="comment-like">👍 ${comment.likes}</span>
            <span class="comment-reply">Reply</span>
          </div>
          ${comment.replies ? comment.replies.map(reply => `
          <div class="comment-reply-card">
            <div class="comment-header">
              <img src="${reply.avatar}" alt="${reply.name}" class="comment-avatar comment-avatar-small">
              <div class="comment-info">
                <span class="comment-name">${reply.name}</span>
                <span class="comment-time">${reply.time}</span>
              </div>
            </div>
            <p class="comment-text">${reply.text}</p>
            <div class="comment-actions">
              <span class="comment-like">👍 ${reply.likes}</span>
            </div>
          </div>
          `).join("") : ""}
        </div>`).join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VSL Landing Page</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', sans-serif;
      background: linear-gradient(180deg, ${config.colors.gradientStart} 0%, ${config.colors.gradientEnd} 100%);
      min-height: 100vh;
    }
    .urgency-banner {
      background: ${config.colors.urgencyBg};
      color: ${config.colors.urgencyText};
      padding: 12px 16px;
      text-align: center;
      font-weight: 600;
      font-size: 14px;
    }
    .urgency-banner span.badge {
      background: ${config.colors.urgencyText};
      color: ${config.colors.urgencyBg};
      padding: 2px 8px;
      border-radius: 4px;
      font-weight: 800;
      margin-right: 8px;
    }
    .urgency-banner .date-text { text-decoration: underline; }
    .video-section {
      padding: 32px 16px;
      max-width: 896px;
      margin: 0 auto;
      text-align: center;
    }
    .headline {
      color: ${config.colors.headlineColor};
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 4px;
    }
    .subheadline {
      display: inline-block;
      background: ${config.colors.subheadlineColor};
      color: #ffffff;
      padding: 4px 8px;
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 24px;
    }
    .video-container { border-radius: 0; overflow: visible; box-shadow: none; }
    .comments-section {
      padding: 32px 16px;
      max-width: 672px;
      margin: 0 auto;
    }
    .comment-card {
      background: ${config.colors.commentBg};
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    .comment-header { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
    .comment-avatar { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; }
    .comment-avatar-small { width: 32px; height: 32px; }
    .comment-info { display: flex; flex-direction: column; }
    .comment-name { color: ${config.colors.commentNameColor}; font-weight: 600; font-size: 14px; }
    .comment-time { color: #9ca3af; font-size: 12px; }
    .comment-text { color: ${config.colors.commentText}; font-size: 14px; line-height: 1.5; margin-bottom: 8px; }
    .comment-actions { display: flex; gap: 16px; font-size: 13px; }
    .comment-like { color: ${config.colors.facebookBlue}; font-weight: 500; }
    .comment-reply { color: #6b7280; cursor: pointer; }
    .comment-reply-card { margin-left: 48px; margin-top: 12px; padding: 12px; background: #f9fafb; border-radius: 8px; }
    .live-badge {
      position: fixed;
      bottom: 24px;
      left: 24px;
      background: ${config.colors.liveBadgeBg};
      color: ${config.colors.liveBadgeText};
      padding: 12px 16px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: pulse 2s infinite;
    }
    .live-dot { width: 8px; height: 8px; background: white; border-radius: 50%; animation: blink 1s infinite; }
    @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02); } }
    @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
    .footer {
      background: ${config.colors.footerBg};
      color: ${config.colors.footerText};
      padding: 24px 16px;
      text-align: center;
    }
    .footer-text { font-size: 12px; margin-bottom: 8px; }
    .footer-country { font-size: 11px; opacity: 0.8; }
    @media (max-width: 768px) {
      .headline { font-size: 1rem; }
      .subheadline { font-size: 1rem; }
      .live-badge { left: 16px; bottom: 16px; padding: 8px 12px; font-size: 12px; }
    }
  </style>
</head>
<body>
  <div class="urgency-banner">
    <span class="badge">${config.urgencyText}</span>
    <span class="date-text">${config.urgencyDatePrefix} <span id="urgency-date"></span></span>
  </div>

  <div class="video-section">
    <h1 class="headline">${config.headline}</h1>
    <h2 class="subheadline">${config.subheadline}</h2>
    <div class="video-container">
      ${config.vturbEmbedCode || "<!-- Paste your Vturb embed here -->"}
    </div>
  </div>

  <div class="comments-section">
    ${commentsHTML}
  </div>

  <div class="live-badge">
    <span class="live-dot"></span>
    🔴 <span id="viewer-count">${config.viewerCount.toLocaleString()}</span> ${config.liveBadgeText1} ${config.liveBadgeText2}
  </div>

  <footer class="footer">
    <p class="footer-text">${config.footerText}</p>
    <p class="footer-country">${config.footerCountry}</p>
  </footer>

  <script>
    (function() {
      var today = new Date();
      var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      var el = document.getElementById('urgency-date');
      if (el) el.textContent = today.toLocaleDateString('en-US', options);
    })();
    (function() {
      var base = ${config.viewerCount};
      var el = document.getElementById('viewer-count');
      if (!el) return;
      setInterval(function() {
        var min = Math.floor(base * 0.8);
        var max = Math.floor(base * 1.2);
        var count = Math.floor(Math.random() * (max - min + 1)) + min;
        el.textContent = count.toLocaleString();
      }, 3000);
    })();
  </script>
</body>
</html>`;
}
