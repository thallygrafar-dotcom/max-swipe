import { useBuilder } from "@/contexts/dtc/BuilderContext";
import { Star, Check, Shield, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { SectionPosition, CustomSectionItem } from "@/types/dtc-builder";

// Helper function to render text with line breaks
function renderWithLineBreaks(text: string) {
  return text.split('\n').map((line, index, array) => (
    <span key={index}>
      {line}
      {index < array.length - 1 && <br />}
    </span>
  ));
}

export function OfferPreview({ isMobile = false }: { isMobile?: boolean }) {
  const { state } = useBuilder();
  const { branding, stock, plans, plansStyle, guarantee, testimonials, faq, faqEnabled, bonuses, cta, footer, customSections, sectionVisibility } = state;
  const [currentStockQuantity, setCurrentStockQuantity] = useState(stock.quantity);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  // Helper to filter custom sections by position
  const getCustomSectionsForPosition = (position: SectionPosition) => {
    return customSections.items.filter(s => s.enabled && (s.position || 'after-bonuses') === position);
  };

  // Render a custom section
  const renderCustomSection = (section: CustomSectionItem) => {
    const padding = section.sectionPadding || 32;
    const titleSize = section.titleFontSize || 20;
    const textSize = section.textFontSize || 16;
    const imgWidth = section.imageWidth || 40;
    const isVertical = section.imagePosition === 'top' || section.imagePosition === 'bottom';
    
    return (
      <div 
        key={section.id}
        className="w-full"
        style={{ 
          backgroundColor: section.backgroundColor,
          padding: `${padding}px 1rem`,
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div 
            className={`flex gap-6 items-center ${isMobile ? 'flex-col text-center' : ''}`}
            style={{
              flexDirection: isMobile ? 'column' :
                section.imagePosition === 'top' ? 'column' :
                section.imagePosition === 'bottom' ? 'column-reverse' :
                section.imagePosition === 'right' ? 'row-reverse' : 'row',
            }}
          >
            {section.imageUrl && (
              <div 
                className="flex-shrink-0"
                style={{ 
                  width: isMobile ? '100%' : isVertical ? '100%' : `${imgWidth}%`,
                  textAlign: 'center',
                }}
              >
                <img 
                  src={section.imageUrl} 
                  alt={section.title}
                  style={{ 
                    width: isMobile ? '80%' : isVertical ? `${imgWidth}%` : '100%',
                    height: 'auto',
                    borderRadius: `${branding.borderRadius}px`,
                    margin: isMobile ? '0 auto' : undefined,
                  }}
                />
              </div>
            )}
            <div className="flex-1" style={{ minWidth: '200px' }}>
              <h3 
                className="font-bold mb-3"
                style={{ color: section.titleColor, fontSize: `${titleSize}px` }}
              >
                {section.title}
              </h3>
              <p style={{ color: section.textColor, fontSize: `${textSize}px`, lineHeight: 1.6 }}>
                {renderWithLineBreaks(section.text)}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Stock countdown effect
  useEffect(() => {
    setCurrentStockQuantity(stock.quantity);
  }, [stock.quantity]);

  useEffect(() => {
    if (!stock.countdown) return;
    
    const interval = setInterval(() => {
      setCurrentStockQuantity(prev => Math.max(0, prev - 1));
    }, stock.countdownInterval * 1000);
    
    return () => clearInterval(interval);
  }, [stock.countdown, stock.countdownInterval]);

  // Testimonial carousel auto-play
  useEffect(() => {
    if (testimonials.displayMode !== 'carousel' || !testimonials.autoPlay || testimonials.items.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentTestimonialIndex(prev => (prev + 1) % testimonials.items.length);
    }, testimonials.autoPlayInterval * 1000);
    
    return () => clearInterval(interval);
  }, [testimonials.displayMode, testimonials.autoPlay, testimonials.autoPlayInterval, testimonials.items.length]);

  // Order plans: 1 bottle, featured (6), 3 bottles
  const orderedPlans = [
    plans.find(p => p.bottles === 1) || plans[0],
    plans.find(p => p.isFeatured) || plans[1],
    plans.find(p => p.bottles === 3 && !p.isFeatured) || plans[2],
  ].filter(Boolean);

  const getShadowStyle = () => {
    switch (branding.shadowIntensity) {
      case 'none': return 'none';
      case 'light': return '0 4px 15px rgba(0,0,0,0.08)';
      case 'medium': return '0 10px 40px rgba(0,0,0,0.12)';
      case 'strong': return '0 20px 60px rgba(0,0,0,0.2)';
      default: return '0 10px 40px rgba(0,0,0,0.12)';
    }
  };

  const getButtonAnimationClass = () => {
    switch (branding.buttonAnimation) {
      case 'pulse': return 'animate-pulse';
      case 'bounce': return 'animate-bounce';
      case 'glow': return '';
      default: return '';
    }
  };

  const getButtonGlowStyle = () => {
    if (branding.buttonAnimation === 'glow') {
      return {
        animation: 'glow 2s ease-in-out infinite',
      };
    }
    return {};
  };

  const getCardPadding = () => {
    switch (branding.cardSpacing) {
      case 'compact': return '1rem';
      case 'normal': return '1.5rem';
      case 'spacious': return '2rem';
      default: return '1.5rem';
    }
  };

  const getStockAnimationClass = () => {
    switch (stock.animation) {
      case 'pulse': return 'animate-pulse';
      case 'blink': return 'animate-ping';
      default: return '';
    }
  };

  const containerStyle = isMobile ? { maxWidth: '375px', margin: '0 auto' } : {};

  const renderTestimonialItem = (item: typeof testimonials.items[0]) => (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-center gap-1 mb-4">
        {[...Array(item.stars)].map((_, i) => (
          <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
      <p className="text-lg opacity-90 mb-6">"{renderWithLineBreaks(item.text)}"</p>
      <div className="flex items-center justify-center gap-3">
        {item.photoUrl ? (
          <img src={item.photoUrl} alt={item.name} className="w-12 h-12 rounded-full object-cover" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-lg font-bold">{item.name.charAt(0)}</span>
          </div>
        )}
        <div className="text-left">
          <p className="font-semibold">{item.name}</p>
          <p className="text-sm opacity-75">{item.location}</p>
        </div>
      </div>
    </div>
  );

  // Container wrapper style
  const wrapperStyle = branding.showContainerBorder ? {
    backgroundColor: '#ffffff',
    padding: `${branding.containerPadding}px`,
    borderRadius: `${branding.containerBorderRadius}px`,
  } : {};

  return (
    <div style={wrapperStyle}>
      <div 
        className="min-h-full overflow-hidden"
        style={{ 
          backgroundColor: branding.backgroundColor,
          fontFamily: `'${branding.fontFamily}', system-ui, sans-serif`,
          borderRadius: branding.showContainerBorder ? `${branding.containerBorderRadius - 2}px` : '0',
          ...containerStyle
        }}
      >
        {/* Custom animations */}
        <style>{`
          @keyframes glow {
            0%, 100% { box-shadow: 0 0 5px ${branding.buttonColor}, 0 0 10px ${branding.buttonColor}, 0 0 15px ${branding.buttonColor}; }
            50% { box-shadow: 0 0 10px ${branding.buttonColor}, 0 0 20px ${branding.buttonColor}, 0 0 30px ${branding.buttonColor}; }
          }
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>

      {/* Header Section */}
      <div 
        className="py-8 px-4 text-center text-white"
        style={{ 
          background: `linear-gradient(135deg, ${branding.primaryColor} 0%, ${adjustColor(branding.primaryColor, -20)} 100%)`
        }}
      >
        <h1 className={`${isMobile ? 'text-xl' : 'text-2xl md:text-4xl'} font-bold mb-2`}>{renderWithLineBreaks(branding.headline)}</h1>
        <p className="text-lg opacity-90">{renderWithLineBreaks(branding.subheadline)}</p>
      </div>

      {/* Stock Urgency */}
      {sectionVisibility.stockEnabled && (
      <div className={`py-3 text-center ${getStockAnimationClass()}`}>
        <span style={{ fontSize: `${stock.fontSize}px` }}>
          <span className="font-bold" style={{ color: stock.numberColor }}>
            {currentStockQuantity}
          </span>
          {' '}
          <span style={{ color: stock.textColor }}>
            {stock.text}
          </span>
        </span>
      </div>
      )}

      {/* Custom Sections - After Header */}
      {getCustomSectionsForPosition('after-header').map(renderCustomSection)}

      {/* Pricing Cards */}
      {sectionVisibility.plansEnabled && (
      <div id="plans-section" className="max-w-6xl mx-auto px-4" style={{ paddingTop: `${branding.sectionSpacing}px`, paddingBottom: `${branding.sectionSpacing}px` }}>
        <div className={`grid ${isMobile ? 'grid-cols-1' : 'md:grid-cols-3'} gap-6`}>
          {orderedPlans.map((plan, index) => (
            <div 
              key={plan.id}
              data-featured-plan={plan.isFeatured ? "true" : undefined}
              className={`relative bg-white overflow-hidden transition-transform hover:scale-[1.02] ${
                plan.isFeatured && !isMobile ? 'md:-mt-4 md:mb-4' : ''
              }`}
              style={{ 
                borderRadius: `${branding.borderRadius}px`,
                boxShadow: plan.isFeatured 
                  ? `0 0 0 4px ${branding.primaryColor}, ${getShadowStyle()}` 
                  : getShadowStyle(),
                order: isMobile ? (plan.isFeatured ? 0 : index === 2 ? 1 : 2) : undefined
              }}
            >
              {/* Badge */}
              {plan.badgeType !== 'none' && (
                <div 
                  className="absolute top-0 left-0 right-0 py-2 text-center text-white text-sm font-bold uppercase"
                  style={{ 
                    backgroundColor: plan.badgeType === 'best' 
                      ? branding.primaryColor 
                      : plan.badgeType === 'popular' 
                        ? branding.buttonColor 
                        : '#6b7280'
                  }}
                >
                  {plan.badge}
                </div>
              )}

              <div style={{ padding: getCardPadding(), paddingTop: plan.badgeType !== 'none' ? '48px' : getCardPadding() }}>
                {/* Title with optional background */}
                <div 
                  className="text-center mb-2 py-2"
                  style={{ 
                    backgroundColor: plan.showTitleBackground ? plan.titleBackgroundColor : 'transparent',
                    borderRadius: plan.showTitleBackground ? '8px' : '0',
                  }}
                >
                  <h3 
                    className="font-bold"
                    style={{ fontSize: `${plansStyle.titleFontSize}px`, color: '#000000' }}
                  >
                    {plan.title}
                  </h3>
                </div>
                <p 
                  className="text-sm text-black/60 text-center"
                  style={{ marginTop: `${plansStyle.daySupplySpacingTop}px` }}
                >
                  {plan.daysSupply} DAY SUPPLY
                </p>

                {/* Product Image */}
                <div 
                  className="mx-auto flex items-center justify-center overflow-hidden"
                  style={{ 
                    width: `${128 * (plansStyle.imageScale / 100)}px`,
                    height: `${160 * (plansStyle.imageScale / 100)}px`,
                    marginTop: `${plansStyle.imageSpacingTop}px`,
                    marginBottom: `${plansStyle.imageSpacingBottom}px`,
                  }}
                >
                  {plan.imageUrl ? (
                    <img 
                      src={plan.imageUrl} 
                      alt={plan.title} 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-center">
                      <div 
                        className="w-16 h-20 mx-auto rounded-md shadow-lg" 
                        style={{ background: `linear-gradient(180deg, ${branding.primaryColor} 0%, ${adjustColor(branding.primaryColor, -30)} 100%)` }}
                      />
                      <span className="text-xs text-black/50 mt-2 block">{plan.bottles}x</span>
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="text-center mb-3">
                  <span 
                    className="font-extrabold block leading-none"
                    style={{ fontSize: `${plansStyle.priceFontSize}px`, color: '#000000' }}
                  >
                    ${plan.pricePerBottle}
                  </span>
                  <span className="text-black/60 text-sm uppercase mt-1 block">per bottle</span>
                </div>

                {/* Bullets */}
                <ul className="space-y-2 mb-4">
                  {plan.bullets.map((bullet) => (
                    <li key={bullet.id} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 flex-shrink-0" style={{ color: branding.buttonColor }} />
                      <span 
                        style={{ 
                          color: bullet.color,
                          fontWeight: bullet.isBold ? 'bold' : 'normal'
                        }}
                      >
                        {bullet.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <a
                  href={plan.buttonLink || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block w-full py-3 px-6 font-bold text-lg uppercase tracking-wide text-center transition-all hover:-translate-y-0.5 ${getButtonAnimationClass()}`}
                  style={{ 
                    background: `linear-gradient(135deg, ${plan.useCustomButtonColor ? plan.buttonColor : plansStyle.buttonColor} 0%, ${adjustColor(plan.useCustomButtonColor ? plan.buttonColor : plansStyle.buttonColor, -15)} 100%)`,
                    color: plan.useCustomButtonColor ? plan.buttonTextColor : plansStyle.buttonTextColor,
                    boxShadow: `0 4px 14px 0 ${plan.useCustomButtonColor ? plan.buttonColor : plansStyle.buttonColor}66`,
                    borderRadius: `${branding.borderRadius}px`,
                    ...getButtonGlowStyle()
                  }}
                >
                  {plan.buttonText}
                </a>

                {/* Checkout Image (below button) */}
                {plan.checkoutImageUrl && (
                  <div className="mt-3 flex justify-center">
                    <img 
                      src={plan.checkoutImageUrl} 
                      alt="Payment methods" 
                      className="h-8 object-contain"
                    />
                  </div>
                )}

                {/* Total & Shipping */}
                <div className="mt-4 text-center text-sm text-black/70">
                  <p>Total: <span className="line-through">${plan.originalPrice}</span> <strong>${plan.totalPrice}</strong></p>
                  <p className={plan.shipping.includes('FREE') ? 'text-green-600 font-semibold' : ''}>
                    {plan.shipping}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* Custom Sections - After Plans */}
      {getCustomSectionsForPosition('after-plans').map(renderCustomSection)}

      {/* Guarantee Section */}
      {sectionVisibility.guaranteeEnabled && (
      <div className="max-w-4xl mx-auto px-4" style={{ paddingTop: `${branding.sectionSpacing}px`, paddingBottom: `${branding.sectionSpacing}px` }}>
        <div
          className={`bg-white p-6 flex ${isMobile ? 'flex-col' : 'flex-col md:flex-row'} items-center gap-6`}
          style={{ borderRadius: `${branding.borderRadius}px`, boxShadow: getShadowStyle() }}
        >
          {guarantee.iconUrl ? (
            <img 
              src={guarantee.iconUrl} 
              alt="Guarantee" 
              className="object-contain flex-shrink-0"
              style={{ 
                width: `${96 * (guarantee.iconScale / 100)}px`,
                height: `${96 * (guarantee.iconScale / 100)}px`
              }}
            />
          ) : (
            <div className="w-24 h-24 flex-shrink-0 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white">
              <Shield className="w-12 h-12" />
            </div>
          )}
          <div className="flex-1">
            <h3 
              className="font-bold mb-2"
              style={{ 
                color: guarantee.titleColor,
                fontSize: `${guarantee.titleFontSize}px`
              }}
            >
              {guarantee.title}
            </h3>
            <p 
              style={{ 
                color: guarantee.textColor,
                fontSize: `${guarantee.textFontSize}px`
              }}
            >
              {renderWithLineBreaks(guarantee.text)}
            </p>
            {guarantee.bottomImageUrl && (
              <div className="mt-4">
                <img 
                  src={guarantee.bottomImageUrl} 
                  alt="Guarantee" 
                  className="object-contain"
                  style={{ 
                    maxHeight: `${96 * (guarantee.bottomImageScale / 100)}px`
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      )}
      {/* Custom Sections - After Guarantee */}
      {getCustomSectionsForPosition('after-guarantee').map(renderCustomSection)}

      {/* Testimonial Section */}
      {sectionVisibility.testimonialsEnabled && (
      <div 
        className="py-12 px-4 text-center text-white"
        style={{ 
          background: `linear-gradient(135deg, ${branding.primaryColor} 0%, ${adjustColor(branding.primaryColor, -25)} 100%)`
        }}
      >
        <div className={`grid ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-3'} gap-6 max-w-6xl mx-auto`}>
          {testimonials.items.map((item) => (
            <div key={item.id} className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <div className="flex justify-center gap-1 mb-3">
                {[...Array(item.stars)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm opacity-90 mb-4">"{renderWithLineBreaks(item.text)}"</p>
              <div className="flex items-center justify-center gap-2">
                {item.photoUrl ? (
                  <img src={item.photoUrl} alt={item.name} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-sm font-bold">{item.name.charAt(0)}</span>
                  </div>
                )}
                <div className="text-left">
                  <p className="text-sm font-semibold">{item.name}</p>
                  <p className="text-xs opacity-75">{item.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* Custom Sections - After Testimonials */}
      {getCustomSectionsForPosition('after-testimonials').map(renderCustomSection)}

       {/* FAQ Section - Always Open (matches exported HTML) */}
       {sectionVisibility.faqEnabled && (
       <div className="max-w-3xl mx-auto px-4" style={{ paddingTop: `${branding.sectionSpacing}px`, paddingBottom: `${branding.sectionSpacing}px` }}>
         <h2 className="text-2xl font-bold text-center mb-8" style={{ color: '#000000' }}>Frequently Asked Questions</h2>
         <div className="space-y-3">
           {faq.filter(item => item.enabled !== false).map((item) => (
             <div 
               key={item.id} 
               className="overflow-hidden bg-white"
               style={{ borderRadius: `${branding.borderRadius}px`, border: '1px solid #e5e7eb' }}
             >
               <div
                 className="w-full p-4 text-left font-semibold text-white"
                 style={{ backgroundColor: branding.primaryColor }}
               >
                 <span>{item.question}</span>
               </div>
               <div className="p-4 bg-white border-t border-black/10">
                 <p className="text-black/70 leading-relaxed">{renderWithLineBreaks(item.answer)}</p>
               </div>
             </div>
           ))}
          </div>
        </div>
       )}

      {/* Custom Sections - After FAQ */}
      {getCustomSectionsForPosition('after-faq').map(renderCustomSection)}

      {/* Bonuses Section */}
      {sectionVisibility.bonusesEnabled && bonuses.length > 0 && (
        <div className="bg-black/5 px-4" style={{ paddingTop: `${branding.sectionSpacing}px`, paddingBottom: `${branding.sectionSpacing}px` }}>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">EXCLUSIVE BONUSES</h2>
            <div className={`grid ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2'} gap-6`}>
              {bonuses.map((bonus, index) => (
                <div 
                  key={bonus.id} 
                  className="bg-white p-6 flex gap-4"
                  style={{ borderRadius: `${branding.borderRadius}px`, boxShadow: getShadowStyle() }}
                >
                  {bonus.showImage !== false && (
                    bonus.imageUrl ? (
                      <img src={bonus.imageUrl} alt={bonus.title} className="w-24 h-32 object-contain flex-shrink-0" />
                    ) : (
                      <div className="w-24 h-32 flex-shrink-0 bg-gradient-to-b from-black/10 to-black/20 rounded-lg flex items-center justify-center">
                        <span className="text-2xl font-bold text-black/40">#{index + 1}</span>
                      </div>
                    )
                  )}
                  <div>
                    <h3 className="font-bold mb-1" style={{ color: '#000000' }}>{bonus.title}</h3>
                    <p className="text-sm text-black/60 mb-2">{renderWithLineBreaks(bonus.description)}</p>
                    <span 
                      className="text-sm font-bold"
                      style={{ color: branding.buttonColor }}
                    >
                      Value: {bonus.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Custom Sections - After Bonuses */}
      {getCustomSectionsForPosition('after-bonuses').map(renderCustomSection)}

      {/* Custom Sections - Before Footer */}
      {getCustomSectionsForPosition('before-footer').map(renderCustomSection)}

      {/* Final CTA Section */}
      {sectionVisibility.ctaEnabled && (
      <div 
        className="px-4 text-center"
        style={{ 
          background: `linear-gradient(135deg, ${branding.secondaryColor}22 0%, ${branding.secondaryColor}11 100%)`,
          paddingTop: `${branding.sectionSpacing}px`, 
          paddingBottom: `${branding.sectionSpacing}px` 
        }}
      >
        <div className="w-full">
          <h2 
            className={`${isMobile ? 'text-lg' : 'text-xl md:text-2xl'} font-bold mb-2 text-center`}
            style={{ color: branding.primaryColor }}
          >
            {cta.headline}
          </h2>
          <p className="text-lg text-black/80 mb-6 text-center">{cta.subheadline}</p>
          
          {/* Repeat Plans Section */}
          <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-4 justify-center items-stretch max-w-6xl mx-auto`}>
            {orderedPlans.map((plan, index) => (
              <div 
                key={plan.id}
                className={`relative bg-white overflow-hidden transition-all duration-300 ${
                  plan.isFeatured ? 'ring-2 scale-105' : ''
                }`}
                style={{ 
                  flex: isMobile ? 'none' : '1',
                  maxWidth: isMobile ? '100%' : '380px',
                  order: isMobile && plan.isFeatured ? -1 : index,
                  borderRadius: `${branding.borderRadius}px`,
                  boxShadow: getShadowStyle(),
                  borderColor: plan.isFeatured ? branding.buttonColor : 'transparent'
                }}
              >
                {/* Badge - solid colors like exported HTML */}
                {plan.badgeType !== 'none' && (
                  <div 
                    className="absolute top-0 left-0 right-0 py-2 text-center text-white text-sm font-bold uppercase"
                    style={{ 
                      backgroundColor: plan.badgeType === 'best' 
                        ? branding.primaryColor 
                        : plan.badgeType === 'popular' 
                          ? plansStyle.buttonColor 
                          : '#6b7280'
                    }}
                  >
                    {plan.badge}
                  </div>
                )}

                <div style={{ padding: getCardPadding(), paddingTop: plan.badgeType !== 'none' ? '48px' : getCardPadding() }}>
                  {/* Title */}
                  <div 
                    className="text-center mb-2 py-2"
                    style={{ 
                      backgroundColor: plan.showTitleBackground ? plan.titleBackgroundColor : 'transparent',
                      borderRadius: plan.showTitleBackground ? '8px' : '0',
                    }}
                  >
                    <h3 className="font-bold" style={{ fontSize: `${plansStyle.titleFontSize}px`, color: '#000000' }}>
                      {plan.title}
                    </h3>
                  </div>
                  <p className="text-sm text-black/60 text-center" style={{ marginTop: `${plansStyle.daySupplySpacingTop}px` }}>
                    {plan.daysSupply} DAY SUPPLY
                  </p>

                  {/* Product Image */}
                  <div 
                    className="mx-auto flex items-center justify-center overflow-hidden"
                    style={{ 
                      width: `${128 * (plansStyle.imageScale / 100)}px`,
                      height: `${160 * (plansStyle.imageScale / 100)}px`,
                      marginTop: `${plansStyle.imageSpacingTop}px`,
                      marginBottom: `${plansStyle.imageSpacingBottom}px`,
                    }}
                  >
                    {plan.imageUrl ? (
                      <img src={plan.imageUrl} alt={plan.title} className="w-full h-full object-contain" />
                    ) : (
                      <div className="text-center">
                        <div 
                          className="w-16 h-20 mx-auto rounded-md shadow-lg" 
                          style={{ background: `linear-gradient(180deg, ${branding.primaryColor} 0%, ${adjustColor(branding.primaryColor, -30)} 100%)` }}
                        />
                        <span className="text-xs text-black/50 mt-2 block">{plan.bottles}x</span>
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  <div className="text-center mb-3">
                    <span className="font-extrabold block leading-none" style={{ fontSize: `${plansStyle.priceFontSize}px`, color: '#000000' }}>
                      ${plan.pricePerBottle}
                    </span>
                    <span className="text-black/60 text-sm uppercase mt-1 block">per bottle</span>
                  </div>

                  {/* Bullets */}
                  <ul className="space-y-2 mb-4">
                    {plan.bullets.map((bullet) => (
                      <li key={bullet.id} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 flex-shrink-0" style={{ color: branding.buttonColor }} />
                        <span style={{ color: bullet.color, fontWeight: bullet.isBold ? 'bold' : 'normal' }}>
                          {bullet.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <a
                    href={plan.buttonLink || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block w-full py-3 px-6 font-bold text-lg uppercase tracking-wide text-center transition-all hover:-translate-y-0.5 ${getButtonAnimationClass()}`}
                    style={{ 
                      background: `linear-gradient(135deg, ${plan.useCustomButtonColor ? plan.buttonColor : plansStyle.buttonColor} 0%, ${adjustColor(plan.useCustomButtonColor ? plan.buttonColor : plansStyle.buttonColor, -15)} 100%)`,
                      color: plan.useCustomButtonColor ? plan.buttonTextColor : plansStyle.buttonTextColor,
                      boxShadow: `0 4px 14px 0 ${plan.useCustomButtonColor ? plan.buttonColor : plansStyle.buttonColor}66`,
                      borderRadius: `${branding.borderRadius}px`,
                      ...getButtonGlowStyle()
                    }}
                  >
                    {plan.buttonText}
                  </a>

                  {/* Checkout Image */}
                  {plan.checkoutImageUrl && (
                    <div className="mt-3 flex justify-center">
                      <img src={plan.checkoutImageUrl} alt="Payment methods" className="h-8 object-contain" />
                    </div>
                  )}

                  {/* Total & Shipping */}
                  <div className="mt-4 text-center text-sm text-black/70">
                    <p>Total: <span className="line-through">${plan.originalPrice}</span> <strong>${plan.totalPrice}</strong></p>
                    <p className={plan.shipping.includes('FREE') ? 'text-green-600 font-semibold' : ''}>
                      {plan.shipping}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <p className="mt-6 text-sm text-black/60 text-center">{cta.note}</p>
        </div>
      </div>
      )}

      {/* Footer */}
      {sectionVisibility.footerEnabled && (
      <div 
        className="py-6 px-4 text-center text-white text-sm"
        style={{ backgroundColor: branding.primaryColor }}
      >
        <p className="mb-2">{renderWithLineBreaks(footer.links)}</p>
        <p className="opacity-75">{renderWithLineBreaks(footer.disclaimer)}</p>
      </div>
      )}
      </div>
    </div>
  );
}

// Helper function to adjust color brightness
function adjustColor(color: string, amount: number): string {
  const hex = color.replace('#', '');
  const num = parseInt(hex, 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
  return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
}