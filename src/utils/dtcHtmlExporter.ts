import { BuilderState } from "@/types/dtc-builder";

function adjustColor(color: string, amount: number): string {
  const hex = color.replace('#', '');
  const num = parseInt(hex, 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
  return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
}

// Helper function to convert line breaks to <br> tags
function nl2br(text: string): string {
  return text.replace(/\n/g, '<br>');
}

export function generateHTML(state: BuilderState): string {
  const { branding, stock, plans, plansStyle, guarantee, testimonials, faq, faqEnabled, bonuses, cta, footer, export: exportConfig, customSections, sectionVisibility } = state;

  // Helper to generate custom section HTML
  const generateCustomSectionHTML = (position: string) => {
    return customSections.items
      .filter(s => s.enabled && (s.position || 'after-bonuses') === position)
      .map(section => {
        const padding = section.sectionPadding || 32;
        const titleSize = section.titleFontSize || 20;
        const textSize = section.textFontSize || 16;
        const imgWidth = section.imageWidth || 40;
        const isVertical = section.imagePosition === 'top' || section.imagePosition === 'bottom';
        
        return `
        <div class="dtc-custom-section" style="background-color: ${section.backgroundColor}; padding: ${padding}px 1rem;">
          <div class="dtc-custom-section-content" style="max-width: 900px; margin: 0 auto; display: flex; gap: 1.5rem; align-items: center; flex-wrap: wrap; ${
            section.imagePosition === 'top' ? 'flex-direction: column;' :
            section.imagePosition === 'bottom' ? 'flex-direction: column-reverse;' :
            section.imagePosition === 'right' ? 'flex-direction: row-reverse;' : 'flex-direction: row;'
          }">
            ${section.imageUrl ? `
              <div class="dtc-custom-section-image" style="flex-shrink: 0; ${isVertical ? 'width: 100%; text-align: center;' : `width: ${imgWidth}%; max-width: ${imgWidth}%;`}">
                <img src="${section.imageUrl}" alt="${section.title}" style="${isVertical ? `max-width: ${imgWidth}%;` : 'width: 100%;'} height: auto; border-radius: ${branding.borderRadius}px;">
              </div>
            ` : ''}
            <div class="dtc-custom-section-text" style="flex: 1; min-width: 200px;">
              <h3 style="color: ${section.titleColor}; font-size: ${titleSize}px; font-weight: 700; margin-bottom: 0.75rem;">${section.title}</h3>
              <p style="color: ${section.textColor}; font-size: ${textSize}px; line-height: 1.6;">${nl2br(section.text)}</p>
            </div>
          </div>
        </div>
      `;
      }).join('');
  };

  // Build wrapper attributes correctly - avoid duplicate class attributes
  const wrapperAttr = exportConfig.wrapperType === 'id' 
    ? `id="${exportConfig.wrapperName}"` 
    : ''; // We'll add the custom class to the existing class attribute
  
  const wrapperClass = exportConfig.wrapperType === 'class' 
    ? `dtc-wrapper ${exportConfig.wrapperName}` 
    : 'dtc-wrapper';
  
  const hiddenStyle = exportConfig.startHidden ? ' style="display:none;"' : '';

  // Order plans: 1 bottle, featured (6), 3 bottles
  const orderedPlans = [
    plans.find(p => p.bottles === 1) || plans[0],
    plans.find(p => p.isFeatured) || plans[1],
    plans.find(p => p.bottles === 3 && !p.isFeatured) || plans[2],
  ].filter(Boolean);

  const plansHTML = orderedPlans.map(plan => {
    const badgeHTML = plan.badgeType !== 'none' ? `
      <div class="dtc-badge" style="background-color: ${
        plan.badgeType === 'best' ? branding.primaryColor : 
        plan.badgeType === 'popular' ? plansStyle.buttonColor : '#6b7280'
      };">${plan.badge}</div>` : '';

    const bulletsHTML = plan.bullets.map(b => `
      <li class="dtc-bullet">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${plansStyle.buttonColor}" stroke-width="3">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span style="color: ${b.color}; font-weight: ${b.isBold ? 'bold' : 'normal'};">${b.text}</span>
      </li>`).join('');

    const imageHTML = plan.imageUrl 
      ? `<img src="${plan.imageUrl}" alt="${plan.title}" style="width: 100%; height: 100%; object-fit: contain;">`
      : `<div class="dtc-bottle" style="background: linear-gradient(180deg, ${branding.primaryColor} 0%, ${adjustColor(branding.primaryColor, -30)} 100%);"></div>
         <span class="dtc-bottle-count">${plan.bottles}x</span>`;

    const checkoutImageHTML = plan.checkoutImageUrl 
      ? `<div class="dtc-checkout-image"><img src="${plan.checkoutImageUrl}" alt="Payment methods" style="height: 32px; object-fit: contain;"></div>` 
      : '';

    return `
    <div class="dtc-card ${plan.isFeatured ? 'dtc-card-featured' : ''}"${plan.isFeatured ? ' id="dtc-best-value-plan"' : ''}>
      ${badgeHTML}
      <div class="dtc-card-content" ${plan.badgeType !== 'none' ? 'style="padding-top: 48px;"' : ''}>
        <div class="dtc-plan-title-container" ${plan.showTitleBackground ? `style="background-color: ${plan.titleBackgroundColor}; padding: 8px; border-radius: 8px;"` : ''}>
          <h3 class="dtc-plan-title" style="font-size: ${plansStyle.titleFontSize}px; color: #000000;">${plan.title}</h3>
        </div>
        <p class="dtc-plan-supply" style="margin-top: ${plansStyle.daySupplySpacingTop}px;">${plan.daysSupply} DAY SUPPLY</p>
        
        <div class="dtc-product-image" style="width: ${128 * (plansStyle.imageScale / 100)}px; height: ${160 * (plansStyle.imageScale / 100)}px; margin-top: ${plansStyle.imageSpacingTop}px; margin-bottom: ${plansStyle.imageSpacingBottom}px;">
          ${imageHTML}
        </div>
        
        <div class="dtc-price-container">
          <span class="dtc-price" style="font-size: ${plansStyle.priceFontSize}px;">$${plan.pricePerBottle}</span>
          <span class="dtc-price-label">per bottle</span>
        </div>
        
        <ul class="dtc-bullets">${bulletsHTML}</ul>
        
        <a href="${plan.buttonLink || '#'}" target="_blank" rel="noopener noreferrer" class="dtc-btn" style="background: linear-gradient(135deg, ${plan.useCustomButtonColor ? plan.buttonColor : plansStyle.buttonColor} 0%, ${adjustColor(plan.useCustomButtonColor ? plan.buttonColor : plansStyle.buttonColor, -15)} 100%); box-shadow: 0 4px 14px 0 ${plan.useCustomButtonColor ? plan.buttonColor : plansStyle.buttonColor}66; color: ${plan.useCustomButtonColor ? plan.buttonTextColor : plansStyle.buttonTextColor};">
          ${plan.buttonText}
        </a>
        
        ${checkoutImageHTML}
        
        <div class="dtc-total">
          <p>Total: <span class="dtc-strikethrough">$${plan.originalPrice}</span> <strong>$${plan.totalPrice}</strong></p>
          <p class="${plan.shipping.includes('FREE') ? 'dtc-free-shipping' : ''}">${plan.shipping}</p>
        </div>
      </div>
    </div>`;
  }).join('');

  // FAQ always open - no accordion behavior
  const faqHTML = faq.filter(item => item.enabled !== false).map((item) => `
    <div class="dtc-faq-item dtc-faq-open">
      <div class="dtc-faq-question-static">
        <span>${item.question}</span>
      </div>
      <div class="dtc-faq-answer-static">
        <p>${nl2br(item.answer)}</p>
      </div>
    </div>`).join('');

  const bonusesHTML = bonuses.length > 0 ? `
    <div class="dtc-section dtc-bonuses-section">
      <h2 class="dtc-section-title">EXCLUSIVE BONUSES</h2>
      <div class="dtc-bonuses-grid">
        ${bonuses.map((bonus, index) => `
        <div class="dtc-bonus-card">
          ${bonus.showImage !== false ? (bonus.imageUrl 
            ? `<img src="${bonus.imageUrl}" alt="${bonus.title}" class="dtc-bonus-image-img" style="width: 96px; height: 128px; object-fit: contain;">`
            : `<div class="dtc-bonus-image"><span>#${index + 1}</span></div>`
          ) : ''}
          <div class="dtc-bonus-content">
            <h3 style="color: #000000;">${bonus.title}</h3>
            <p>${nl2br(bonus.description)}</p>
            <span class="dtc-bonus-value" style="color: ${branding.buttonColor};">Value: ${bonus.value}</span>
          </div>
        </div>`).join('')}
      </div>
    </div>` : '';

  // Generate testimonials HTML based on display mode
  const generateTestimonialsHTML = () => {
    if (testimonials.items.length === 0) return '';
    
    const generateSingleTestimonial = (item: typeof testimonials.items[0]) => {
      const stars = [...Array(item.stars)].map(() => `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#FBBF24" stroke="#FBBF24">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>`).join('');
      
      return `
        <div class="dtc-testimonial-slide" data-testimonial>
          <div class="dtc-stars">${stars}</div>
          <blockquote>"${nl2br(item.text)}"</blockquote>
          <div class="dtc-testimonial-author">
            <div class="dtc-author-avatar">
              ${item.photoUrl 
                ? `<img src="${item.photoUrl}" alt="${item.name}">`
                : item.name.charAt(0)
              }
            </div>
            <div class="dtc-author-info">
              <p class="dtc-author-name">${item.name}</p>
              <p class="dtc-author-location">${item.location}</p>
            </div>
          </div>
        </div>`;
    };

    // Always grid mode
    return `<div class="dtc-testimonials-grid">${testimonials.items.map(item => generateSingleTestimonial(item)).join('')}</div>`;
  };

  const testimonialsContent = generateTestimonialsHTML();

  const guaranteeBottomImageHTML = guarantee.bottomImageUrl 
    ? `<div class="dtc-guarantee-bottom-image"><img src="${guarantee.bottomImageUrl}" alt="Guarantee" style="max-height: ${96 * (guarantee.bottomImageScale / 100)}px; object-fit: contain;"></div>` 
    : '';

  // WIDGET ID for scoping - uses user-configured wrapper name/type
  const widgetId = exportConfig.wrapperType === 'id' ? exportConfig.wrapperName : 'dtc-widget';
  const widgetClass = exportConfig.wrapperType === 'class' ? exportConfig.wrapperName : '';
  const scope = exportConfig.wrapperType === 'id' ? `#${widgetId}` : `.${widgetClass}`;
  
  // Hidden style if needed
  const hiddenAttr = exportConfig.startHidden ? ' style="display:none;"' : '';
  
  const wrapperOpen = exportConfig.wrapperType === 'id' 
    ? `<div id="${widgetId}"${hiddenAttr}>`
    : `<div class="${widgetClass}"${hiddenAttr}>`;

  return `${wrapperOpen}
<style>
/* ========== DTC WIDGET - SCOPED CSS ========== */
/* Font import via @import (works in VTurb) */
@import url('https://fonts.googleapis.com/css2?family=${branding.fontFamily.replace(' ', '+')}:wght@400;500;600;700;800&display=swap');

/* Reset only inside widget */
${scope} * { margin: 0; padding: 0; box-sizing: border-box; }
${scope} { 
  font-family: '${branding.fontFamily}', system-ui, sans-serif;
  line-height: 1.6;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  background-color: ${branding.backgroundColor};
  ${branding.showContainerBorder ? `
  background-color: #ffffff;
  padding: ${branding.containerPadding}px;
  border-radius: ${branding.containerBorderRadius}px;
  ` : ''}
}
${scope} img { max-width: 100%; height: auto; display: block; }

/* Inner wrapper */
${scope} .dtc-inner {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  background-color: ${branding.backgroundColor};
  ${branding.showContainerBorder ? `border-radius: ${Math.max(0, branding.containerBorderRadius - 2)}px;` : ''}
  overflow: hidden;
}

/* HEADER */
${scope} .dtc-header {
  width: 100%;
  padding: 2rem 1rem;
  text-align: center;
  color: white;
  background: linear-gradient(135deg, ${branding.primaryColor} 0%, ${adjustColor(branding.primaryColor, -20)} 100%);
}
${scope} .dtc-header h1 { 
  font-size: 2.5rem; 
  font-weight: 700; 
  margin-bottom: 0.5rem;
  word-wrap: break-word;
}
${scope} .dtc-header p { font-size: 1.125rem; opacity: 0.9; }

@media screen and (max-width: 767px) {
  ${scope} .dtc-header { padding: 1.5rem 1rem; }
  ${scope} .dtc-header h1 { font-size: 1.25rem; line-height: 1.3; }
  ${scope} .dtc-header p { font-size: 0.9rem; }
}

/* URGENCY/STOCK */
${scope} .dtc-urgency {
  width: 100%;
  padding: 0.75rem 1rem;
  text-align: center;
  font-size: ${stock.fontSize}px;
}
${scope} .dtc-urgency-number { font-weight: 700; color: ${stock.numberColor}; }
${scope} .dtc-urgency-text { color: ${stock.textColor}; }
@keyframes dtc-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
${stock.animation === 'pulse' ? `${scope} .dtc-urgency { animation: dtc-pulse 2s ease-in-out infinite; }` : ''}

@media screen and (max-width: 767px) {
  ${scope} .dtc-urgency { font-size: ${Math.max(12, stock.fontSize - 2)}px; padding: 0.5rem; }
}

/* PLANS GRID */
${scope} .dtc-plans {
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: stretch;
  gap: 24px;
  width: 100%;
  padding: 32px 16px;
}

${scope} .dtc-card {
  background: white;
  border-radius: ${branding.borderRadius}px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.1);
  overflow: hidden;
  position: relative;
  flex: 0 0 340px;
  max-width: 340px;
}

${scope} .dtc-card-featured { 
  flex: 0 0 380px;
  max-width: 380px;
  box-shadow: 0 0 0 4px ${branding.primaryColor}, 0 10px 40px rgba(0,0,0,0.15);
}

@media screen and (max-width: 1024px) {
  ${scope} .dtc-plans { flex-wrap: wrap; gap: 16px; }
  ${scope} .dtc-card { flex: 0 0 calc(50% - 12px); max-width: calc(50% - 12px); }
  ${scope} .dtc-card-featured { flex: 0 0 calc(50% - 12px); max-width: calc(50% - 12px); }
}

@media screen and (max-width: 767px) {
  ${scope} .dtc-plans {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    gap: 16px !important;
    padding: 16px !important;
  }
  ${scope} .dtc-card {
    flex: none !important;
    width: 100% !important;
    max-width: 100% !important;
    order: 2 !important;
  }
  ${scope} .dtc-card-featured { 
    flex: none !important;
    width: 100% !important;
    max-width: 100% !important;
    order: 0 !important;
  }
  ${scope} .dtc-card:nth-child(3) { order: 1 !important; }
}

/* BADGE */
${scope} .dtc-badge {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 0.5rem;
  text-align: center;
  color: white;
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
}

@media screen and (max-width: 767px) {
  ${scope} .dtc-badge { font-size: 0.75rem; padding: 0.375rem; }
}

/* CARD CONTENT */
${scope} .dtc-card-content { padding: 1.5rem; }

@media screen and (max-width: 767px) {
  ${scope} .dtc-card-content { padding: 1rem; }
}

${scope} .dtc-plan-title-container { text-align: center; margin-bottom: 0.5rem; }
${scope} .dtc-plan-title { font-weight: 700; text-align: center; }
${scope} .dtc-plan-supply { font-size: 0.875rem; color: #6b7280; text-align: center; margin-bottom: 1rem; }

${scope} .dtc-product-image {
  margin: 0 auto 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 100%;
}
${scope} .dtc-bottle {
  width: 4rem;
  height: 5rem;
  border-radius: 0.25rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
${scope} .dtc-bottle-count { font-size: 0.75rem; color: #9ca3af; margin-top: 0.5rem; }

${scope} .dtc-price-container { text-align: center; margin-bottom: 1rem; }
${scope} .dtc-price { font-weight: 800; display: block; color: #000000; }
${scope} .dtc-price-label { color: #6b7280; font-size: 0.875rem; text-transform: uppercase; }

${scope} .dtc-bullets { list-style: none; margin-bottom: 1rem; padding: 0; }
${scope} .dtc-bullet { 
  display: flex; 
  align-items: flex-start; 
  gap: 0.5rem; 
  font-size: 0.875rem; 
  margin-bottom: 0.5rem; 
}
${scope} .dtc-bullet svg { flex-shrink: 0; margin-top: 2px; }
${scope} .dtc-bullet span { word-wrap: break-word; }

/* BUTTON */
${scope} .dtc-btn {
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: ${branding.borderRadius}px;
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: white;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.2s;
}
${scope} .dtc-btn:hover { transform: translateY(-2px); }

@media screen and (max-width: 767px) {
  ${scope} .dtc-btn { font-size: 0.875rem; padding: 0.75rem; }
  ${scope} .dtc-btn:hover { transform: none; }
}

${scope} .dtc-checkout-image { margin-top: 0.75rem; display: flex; justify-content: center; }
${scope} .dtc-checkout-image img { max-width: 100%; height: auto; }

${scope} .dtc-total { margin-top: 1rem; text-align: center; font-size: 0.875rem; color: #4b5563; }
${scope} .dtc-strikethrough { text-decoration: line-through; }
${scope} .dtc-free-shipping { color: #10b981; font-weight: 600; }

/* SECTIONS */
${scope} .dtc-section { 
  max-width: 900px; 
  margin: 0 auto; 
  padding: 2rem 1rem;
  width: 100%;
}
${scope} .dtc-section-title { 
  font-size: 1.5rem; 
  font-weight: 700; 
  text-align: center; 
  margin-bottom: 2rem;
  color: #000000;
}

@media screen and (max-width: 767px) {
  ${scope} .dtc-section { padding: 1.5rem 1rem; }
  ${scope} .dtc-section-title { font-size: 1.125rem; margin-bottom: 1.5rem; }
}

/* GUARANTEE */
${scope} .dtc-guarantee {
  background: white;
  border-radius: ${branding.borderRadius}px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  text-align: center;
}

@media screen and (min-width: 768px) { 
  ${scope} .dtc-guarantee { flex-direction: row; text-align: left; } 
}

@media screen and (max-width: 767px) {
  ${scope} .dtc-guarantee { padding: 1rem; gap: 1rem; flex-direction: column !important; }
}

${scope} .dtc-guarantee-icon {
  width: ${96 * (guarantee.iconScale / 100)}px;
  height: ${96 * (guarantee.iconScale / 100)}px;
  flex-shrink: 0;
  border-radius: 50%;
  background: linear-gradient(135deg, #fbbf24, #d97706);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

@media screen and (max-width: 767px) {
  ${scope} .dtc-guarantee-icon {
    width: ${Math.min(80, 96 * (guarantee.iconScale / 100))}px;
    height: ${Math.min(80, 96 * (guarantee.iconScale / 100))}px;
  }
}

${scope} .dtc-guarantee-icon img { width: 100%; height: 100%; object-fit: contain; border-radius: 0; }
${scope} .dtc-guarantee h3 { 
  font-size: ${guarantee.titleFontSize}px; 
  font-weight: 700; 
  margin-bottom: 0.5rem; 
  color: ${guarantee.titleColor};
}
${scope} .dtc-guarantee p { 
  color: ${guarantee.textColor}; 
  font-size: ${guarantee.textFontSize}px;
}
${scope} .dtc-guarantee-bottom-image { margin-top: 1rem; }

@media screen and (max-width: 767px) {
  ${scope} .dtc-guarantee h3 { font-size: ${Math.max(16, guarantee.titleFontSize - 4)}px; }
  ${scope} .dtc-guarantee p { font-size: ${Math.max(14, guarantee.textFontSize - 2)}px; }
}

/* TESTIMONIAL */
${scope} .dtc-testimonial {
  padding: 3rem 1rem;
  text-align: center;
  color: white;
  background: linear-gradient(135deg, ${branding.primaryColor} 0%, ${adjustColor(branding.primaryColor, -25)} 100%);
}
${scope} .dtc-testimonial-slide { padding: 1rem 0; }
${scope} .dtc-stars { display: flex; justify-content: center; gap: 0.25rem; margin-bottom: 1rem; flex-wrap: wrap; }
${scope} .dtc-testimonial h3 { font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; }
${scope} .dtc-testimonial blockquote { 
  font-size: 1.125rem; 
  opacity: 0.9; 
  margin-bottom: 1.5rem; 
  max-width: 700px; 
  margin-left: auto; 
  margin-right: auto;
}
${scope} .dtc-testimonial-author { display: flex; align-items: center; justify-content: center; gap: 0.75rem; flex-wrap: wrap; }
${scope} .dtc-author-avatar { 
  width: 3rem; 
  height: 3rem; 
  border-radius: 50%; 
  background: rgba(255,255,255,0.2); 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  font-size: 1.25rem; 
  font-weight: 700; 
  overflow: hidden;
  flex-shrink: 0;
}
${scope} .dtc-author-avatar img { width: 100%; height: 100%; object-fit: cover; }
${scope} .dtc-author-info { text-align: left; }
${scope} .dtc-author-name { font-weight: 600; }
${scope} .dtc-author-location { font-size: 0.875rem; opacity: 0.75; }

/* Testimonials Grid */
${scope} .dtc-testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  max-width: 1000px;
  margin: 0 auto;
}

/* Testimonials Carousel */
${scope} .dtc-testimonials-carousel { position: relative; overflow: hidden; }
${scope} .dtc-carousel-track { position: relative; }
${scope} .dtc-carousel-slide { display: none; }
${scope} .dtc-carousel-slide.active { display: block; }
${scope} .dtc-carousel-dots { display: flex; justify-content: center; gap: 0.5rem; margin-top: 1rem; }
${scope} .dtc-carousel-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255,255,255,0.4);
  border: none;
  cursor: pointer;
  padding: 0;
  transition: background 0.3s;
}
${scope} .dtc-carousel-dot.active { background: white; }
${scope} .dtc-carousel-dot:hover { background: rgba(255,255,255,0.7); }

@media screen and (max-width: 767px) {
  ${scope} .dtc-testimonial { padding: 1.5rem 1rem; }
  ${scope} .dtc-testimonial h3 { font-size: 1rem; }
  ${scope} .dtc-testimonial blockquote { font-size: 0.9rem; }
  ${scope} .dtc-stars svg { width: 18px; height: 18px; }
  ${scope} .dtc-testimonials-grid { grid-template-columns: 1fr; gap: 1rem; }
}

/* FAQ - Always Open */
${scope} .dtc-faq-item { 
  border: 1px solid #e5e7eb; 
  border-radius: ${branding.borderRadius}px; 
  overflow: hidden; 
  margin-bottom: 0.75rem;
  background: white;
}
${scope} .dtc-faq-question-static {
  width: 100%;
  padding: 1rem;
  background: ${branding.primaryColor};
  color: white;
  text-align: left;
  font-size: 1rem;
  font-weight: 600;
}
${scope} .dtc-faq-question-static span { word-wrap: break-word; }
${scope} .dtc-faq-answer-static { 
  display: block; 
  padding: 1rem; 
  background: #f9fafb; 
  border-top: 1px solid #e5e7eb; 
}
${scope} .dtc-faq-answer-static p { color: #4b5563; line-height: 1.6; }

@media screen and (max-width: 767px) {
  ${scope} .dtc-faq-question-static { padding: 0.75rem; font-size: 0.875rem; }
  ${scope} .dtc-faq-answer-static { padding: 0.75rem; }
  ${scope} .dtc-faq-answer-static p { font-size: 0.875rem; }
}

/* BONUSES */
${scope} .dtc-bonuses-section { 
  background: #f3f4f6; 
  padding: 3rem 1rem;
  width: 100%;
}
${scope} .dtc-bonuses-grid { 
  display: grid; 
  grid-template-columns: repeat(2, 1fr); 
  gap: 1.5rem; 
  max-width: 1000px; 
  margin: 0 auto; 
}
${scope} .dtc-bonus-card { 
  background: white; 
  border-radius: ${branding.borderRadius}px; 
  padding: 1.5rem; 
  box-shadow: 0 4px 20px rgba(0,0,0,0.08); 
  display: flex; 
  gap: 1rem;
}
${scope} .dtc-bonus-image { 
  width: 5rem; 
  height: 6rem; 
  flex-shrink: 0; 
  background: linear-gradient(to bottom, #e5e7eb, #d1d5db); 
  border-radius: 0.5rem; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  font-size: 1.5rem; 
  font-weight: 700; 
  color: #9ca3af; 
}
${scope} .dtc-bonus-image-img { width: 5rem; height: 6rem; object-fit: contain; flex-shrink: 0; }
${scope} .dtc-bonus-content { flex: 1; min-width: 0; }
${scope} .dtc-bonus-content h3 { font-weight: 700; margin-bottom: 0.25rem; }
${scope} .dtc-bonus-content p { font-size: 0.875rem; color: #4b5563; margin-bottom: 0.5rem; }
${scope} .dtc-bonus-value { font-size: 0.875rem; font-weight: 700; }

@media screen and (max-width: 767px) {
  ${scope} .dtc-bonuses-section { padding: 1.5rem 1rem; }
  ${scope} .dtc-bonuses-grid { grid-template-columns: 1fr; gap: 1rem; }
  ${scope} .dtc-bonus-card { flex-direction: column; text-align: center; align-items: center; padding: 1rem; }
  ${scope} .dtc-bonus-image { margin: 0 auto; width: 4rem; height: 5rem; }
  ${scope} .dtc-bonus-image-img { width: 4rem; height: 5rem; }
}

/* FINAL CTA */
${scope} .dtc-final-cta {
  padding: 3rem 1rem;
  text-align: center;
  background: linear-gradient(135deg, ${branding.secondaryColor}22 0%, ${branding.secondaryColor}11 100%);
}
${scope} .dtc-final-cta h2 { 
  font-size: 1.5rem; 
  font-weight: 700; 
  color: ${branding.primaryColor}; 
  margin-bottom: 0.5rem;
}
${scope} .dtc-final-cta > p { 
  font-size: 1.125rem; 
  color: #374151; 
  margin-bottom: 1.5rem;
}
${scope} .dtc-final-cta .dtc-note { margin-top: 1.5rem; font-size: 0.875rem; color: #4b5563; }

/* CTA Plans (duplicated) */
${scope} .dtc-cta-plans {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  justify-content: center;
  align-items: stretch;
  max-width: 1152px;
  margin: 0 auto;
  padding: 0 1rem;
  width: 100%;
}

@media screen and (max-width: 767px) {
  ${scope} .dtc-final-cta { padding: 1.5rem 1rem; }
  ${scope} .dtc-final-cta h2 { font-size: 1.125rem; }
  ${scope} .dtc-final-cta > p { font-size: 0.9rem; margin-bottom: 1rem; }
  ${scope} .dtc-cta-plans { 
    flex-direction: column !important; 
    gap: 1rem !important;
    padding: 0 !important;
  }
  ${scope} .dtc-cta-plans .dtc-card {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    order: 0 !important;
  }
  ${scope} .dtc-cta-plans .dtc-card.dtc-featured { order: -1 !important; }
}

/* CUSTOM SECTIONS */
${scope} .dtc-custom-section { width: 100%; }
${scope} .dtc-custom-section-content { width: 100%; }

@media screen and (max-width: 767px) {
  ${scope} .dtc-custom-section { padding: 1.5rem 1rem !important; }
  ${scope} .dtc-custom-section-content { 
    flex-direction: column !important; 
    gap: 1rem !important;
    text-align: center !important;
  }
  ${scope} .dtc-custom-section-image { width: 100% !important; text-align: center !important; }
  ${scope} .dtc-custom-section-image img { max-width: 80% !important; margin: 0 auto !important; }
  ${scope} .dtc-custom-section-text { width: 100% !important; text-align: center !important; }
  ${scope} .dtc-custom-section-text h3 { font-size: 1rem !important; }
  ${scope} .dtc-custom-section-text p { font-size: 0.875rem !important; }
}

/* FOOTER */
${scope} .dtc-footer {
  padding: 1.5rem 1rem;
  text-align: center;
  color: white;
  font-size: 0.875rem;
  background-color: ${branding.primaryColor};
}
${scope} .dtc-footer-links { margin-bottom: 0.5rem; }
${scope} .dtc-footer-disclaimer { opacity: 0.75; }

@media screen and (max-width: 767px) {
  ${scope} .dtc-footer { padding: 1rem; font-size: 0.75rem; }
}
</style>

<!-- WIDGET CONTENT -->
<div class="dtc-inner">
  <div class="dtc-header">
    <h1>${nl2br(branding.headline)}</h1>
    <p>${nl2br(branding.subheadline)}</p>
  </div>
  
  ${sectionVisibility.stockEnabled ? `<div class="dtc-urgency">
    <span class="dtc-urgency-number" id="dtc-stock-counter">${stock.quantity}</span>
    <span class="dtc-urgency-text"> ${stock.text}</span>
  </div>` : ''}
  
  ${generateCustomSectionHTML('after-header')}
  
  ${sectionVisibility.plansEnabled ? `<div class="dtc-plans">${plansHTML}</div>` : ''}
  
  ${generateCustomSectionHTML('after-plans')}
  
  ${sectionVisibility.guaranteeEnabled ? `<div class="dtc-section">
    <div class="dtc-guarantee">
      ${guarantee.iconUrl 
        ? `<div class="dtc-guarantee-icon"><img src="${guarantee.iconUrl}" alt="Guarantee"></div>`
        : `<div class="dtc-guarantee-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>`
      }
      <div>
        <h3>${guarantee.title}</h3>
        <p>${nl2br(guarantee.text)}</p>
        ${guaranteeBottomImageHTML}
      </div>
    </div>
  </div>` : ''}
  
  ${generateCustomSectionHTML('after-guarantee')}
  
  ${sectionVisibility.testimonialsEnabled ? `<div class="dtc-testimonial">
    ${testimonialsContent}
  </div>` : ''}
  
  ${generateCustomSectionHTML('after-testimonials')}
  
   ${sectionVisibility.faqEnabled ? `<div class="dtc-section">
    <h2 class="dtc-section-title">Frequently Asked Questions</h2>
    ${faqHTML}
  </div>` : ''}
  
  ${generateCustomSectionHTML('after-faq')}
  
  ${sectionVisibility.bonusesEnabled ? bonusesHTML : ''}
  
  ${generateCustomSectionHTML('after-bonuses')}
  
  ${generateCustomSectionHTML('before-footer')}
  
  ${sectionVisibility.ctaEnabled ? `<div class="dtc-final-cta">
    <h2>${nl2br(cta.headline)}</h2>
    <p>${nl2br(cta.subheadline)}</p>
    <div class="dtc-cta-plans">${plansHTML}</div>
    <p class="dtc-note">${nl2br(cta.note)}</p>
  </div>` : ''}
  
  ${sectionVisibility.footerEnabled ? `<div class="dtc-footer">
    <p class="dtc-footer-links">${nl2br(footer.links)}</p>
    <p class="dtc-footer-disclaimer">${nl2br(footer.disclaimer)}</p>
  </div>` : ''}
</div>

<script>
(function() {
  var widget = ${exportConfig.wrapperType === 'id' ? `document.getElementById('${widgetId}')` : `document.querySelector('.${widgetClass}')`};
  if (!widget) return;
  
  function initDTCWidget() {
    
    // Testimonial Carousel
    ${testimonials.displayMode === 'carousel' && testimonials.items.length > 1 ? `
    var slides = widget.querySelectorAll('.dtc-carousel-slide');
    var dots = widget.querySelectorAll('.dtc-carousel-dot');
    var currentSlide = 0;
    var totalSlides = ${testimonials.items.length};
    
    function showSlide(index) {
      if (index < 0) index = totalSlides - 1;
      if (index >= totalSlides) index = 0;
      currentSlide = index;
      
      for (var i = 0; i < slides.length; i++) {
        slides[i].classList.remove('active');
        slides[i].style.display = 'none';
        if (dots[i]) dots[i].classList.remove('active');
      }
      
      if (slides[currentSlide]) {
        slides[currentSlide].classList.add('active');
        slides[currentSlide].style.display = 'block';
      }
      if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    }
    
    for (var d = 0; d < dots.length; d++) {
      (function(dot, index) {
        dot.onclick = function(e) {
          if (e) e.preventDefault();
          showSlide(index);
          return false;
        };
      })(dots[d], d);
    }
    
    ${testimonials.autoPlay ? `
    setInterval(function() { showSlide(currentSlide + 1); }, ${testimonials.autoPlayInterval * 1000});
    ` : ''}
    
    showSlide(0);
    ` : ''}
    
    // Stock countdown
    ${stock.countdown ? `
    var stockCounter = widget.querySelector('#dtc-stock-counter');
    var currentStock = ${stock.quantity};
    if (stockCounter) {
      setInterval(function() {
        if (currentStock > 0) {
          currentStock--;
          stockCounter.textContent = currentStock;
        }
      }, ${stock.countdownInterval * 1000});
    }
    ` : ''}
  }
  
  // Multiple initialization attempts for VTurb compatibility
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initDTCWidget, 100);
  } else {
    document.addEventListener('DOMContentLoaded', function() { setTimeout(initDTCWidget, 100); });
  }
  window.addEventListener('load', function() { setTimeout(initDTCWidget, 200); });
})();
</script>
</div>`;
}