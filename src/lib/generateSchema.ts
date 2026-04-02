import type { PageContent } from '@/contexts/adv/ContentContext';

export function buildFullPageSchema(content: PageContent) {
  const autoTitle = content.hero.headline;
  const autoDesc = content.hero.leadText.substring(0, 160);
  const autoAuthor = content.hero.byline.replace(/^By\s+/i, '').replace(/\s*[—–-]\s*.+$/, '');
  const autoPublisher = `${content.header.logoTitle} ${content.header.logoSubtitle}`.trim();
  const autoImage = content.hero.mainImageUrl || '';

  const effectiveTitle = content.seo?.metaTitle || autoTitle;
  const effectiveDesc = content.seo?.metaDescription || autoDesc;
  const effectiveAuthor = content.seo?.schemaAuthor || autoAuthor;
  const effectivePublisher = content.seo?.schemaPublisher || autoPublisher;
  const effectiveImage = content.seo?.ogImage || autoImage;
  const effectiveType = content.seo?.schemaType || 'Article';

  const articleBodyParts = [
    content.hero.leadText, content.symptoms.sectionTitle, content.symptoms.introText,
    content.symptoms.symptomIntro, ...content.symptoms.symptoms, content.symptoms.highlightText,
    content.epidemic.title, content.epidemic.paragraph,
    `${content.epidemic.highlightStrong} ${content.epidemic.highlightText}`,
    content.epidemic.ctaIntro, content.testimonial.sectionTitle, content.testimonial.quote,
    content.testimonial.story1, content.testimonial.story2, content.testimonial.highlightText,
    content.testimonial.resolution, content.final.title, content.final.paragraph1, content.final.paragraph2,
  ].filter(Boolean).join(' ');

  const articleSections = [
    content.symptoms.sectionTitle, content.epidemic.title,
    content.testimonial.sectionTitle, content.final.title,
  ].filter(Boolean);

  const reviews = content.facebookTestimonials?.testimonials?.map(t => ({
    "@type": "Review", "author": { "@type": "Person", "name": t.name },
    "datePublished": t.date, "reviewBody": t.text,
  })) || [];

  const schema: Record<string, any> = {
    "@context": "https://schema.org", "@type": effectiveType,
    "headline": effectiveTitle, "description": effectiveDesc,
    "image": effectiveImage ? [effectiveImage] : undefined,
    "author": { "@type": "Person", "name": effectiveAuthor },
    "publisher": { "@type": "Organization", "name": effectivePublisher },
    "mainEntityOfPage": { "@type": "WebPage", ...(content.seo?.canonicalUrl ? { "@id": content.seo.canonicalUrl } : {}) },
    "articleBody": articleBodyParts, "articleSection": articleSections,
  };

  if (content.testimonial.quote && content.testimonial.author) {
    schema["review"] = { "@type": "Review", "author": { "@type": "Person", "name": content.testimonial.author }, "reviewBody": content.testimonial.quote };
  }
  if (reviews.length > 0) schema["comment"] = reviews;
  Object.keys(schema).forEach(key => { if (schema[key] === undefined) delete schema[key]; });

  return { schema, effectiveTitle, effectiveDesc, effectiveAuthor, effectivePublisher, effectiveImage, effectiveType, autoTitle, autoDesc, autoAuthor, autoPublisher, autoImage };
}
