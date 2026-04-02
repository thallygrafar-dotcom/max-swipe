import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface NavItem {
  label: string;
  url: string;
}

export interface HeaderContent {
  logoIcon: string;
  logoTitle: string;
  logoSubtitle: string;
  navItems: NavItem[];
}

export interface HeroContent {
  headline: string;
  leadText: string;
  byline: string;
  ctaText: string;
  ctaLink: string;
  mainImageUrl: string;
}

export interface ImagesContent {
  testimonialImageUrl: string;
  honeyCinnamonImageUrl: string;
  sidebarPromoImageUrl: string;
}

export interface SymptomsContent {
  sectionTitle: string;
  introText: string;
  symptomIntro: string;
  symptoms: string[];
  highlightText: string;
}

export interface EpidemicContent {
  title: string;
  paragraph: string;
  highlightStrong: string;
  highlightText: string;
  ctaIntro: string;
  ctaText: string;
  ctaLink: string;
}

export interface TestimonialContent {
  sectionTitle: string;
  quote: string;
  author: string;
  details: string;
  story1: string;
  story2: string;
  highlightText: string;
  resolution: string;
  ctaText: string;
  ctaLink: string;
  ctaSubtext: string;
}

export interface FinalContent {
  title: string;
  paragraph1: string;
  paragraph2: string;
}

export interface FeaturedArticle {
  title: string;
  url: string;
}

export interface RelatedArticle {
  title: string;
  author: string;
  date: string;
  url: string;
}

export interface SidebarContent {
  featuredTitle: string;
  featuredArticles: FeaturedArticle[];
  relatedTitle: string;
  relatedArticles: RelatedArticle[];
  promoTitle: string;
  promoText: string;
  promoCtaText: string;
  promoCtaLink: string;
}

export interface FooterLink {
  label: string;
  url: string;
}

export interface FooterContent {
  logoTitle: string;
  logoSubtitle: string;
  tagline: string;
  links: FooterLink[];
  copyright: string;
}

export interface SettingsContent {
  ctaLinkUrl: string;
}

export interface TrackingContent {
  headScript: string;
  clarityId: string;
}

export interface SeoContent {
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  ogImage: string;
  schemaType: string;
  schemaAuthor: string;
  schemaPublisher: string;
}

export interface FacebookTestimonialItem {
  id: string;
  name: string;
  date: string;
  text: string;
  imageUrl: string;
  likes: number;
  comments: number;
}

export interface FacebookTestimonialsContent {
  sectionTitle: string;
  ctaLink: string;
  testimonials: FacebookTestimonialItem[];
}

export interface PageContent {
  header: HeaderContent;
  hero: HeroContent;
  symptoms: SymptomsContent;
  epidemic: EpidemicContent;
  testimonial: TestimonialContent;
  final: FinalContent;
  sidebar: SidebarContent;
  footer: FooterContent;
  images: ImagesContent;
  settings: SettingsContent;
  facebookTestimonials: FacebookTestimonialsContent;
  tracking: TrackingContent;
  seo: SeoContent;
}

const defaultContent: PageContent = {
  header: {
    logoIcon: "\u{1F441}",
    logoTitle: "Vision",
    logoSubtitle: "\u2022 Eye Health",
    navItems: [
      { label: "Eye Research", url: "#" },
      { label: "Vision Health", url: "#" },
      { label: "Prevention", url: "#" },
      { label: "Real Stories", url: "#" },
    ],
  },
  hero: {
    headline: "The 15-Second Morning Ritual That Restores Crystal-Clear Vision Naturally",
    leadText: "Because the blurry vision you blame on aging may actually be a warning sign of something far more serious \u2014 and most doctors never test for it.",
    byline: "By Dr. Sarah Mitchell, MD \u2014 Ophthalmology Specialist",
    ctaText: "Watch Video - See How the 15-Second Ritual Works",
    ctaLink: "#",
    mainImageUrl: "",
  },
  images: {
    testimonialImageUrl: "",
    honeyCinnamonImageUrl: "",
    sidebarPromoImageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop",
  },
  symptoms: {
    sectionTitle: "Do your eyes feel dry, tired, or blurry by the end of the day?",
    introText: "That\u2019s not just \"screen fatigue.\" It could be the first sign of a hidden condition silently damaging your vision from the inside.",
    symptomIntro: "If you notice 3 or more of these symptoms, pay close attention:",
    symptoms: [
      "Blurry vision that comes and goes",
      "Frequent headaches behind the eyes",
      "Difficulty seeing at night or in low light",
      "Dry, itchy, or watery eyes",
      "Seeing halos around lights",
    ],
    highlightText: "Millions of adults experience these warning signs daily \u2014 but few realize how quickly vision can deteriorate when the real cause goes untreated.",
  },
  epidemic: {
    title: "The Silent Crisis Stealing Your Sight... And the Discovery Eye Doctors Overlook",
    paragraph: "Nearly 1 in 3 adults over 40 show early signs of macular degeneration, and over 80 million people worldwide suffer from glaucoma \u2014 often without knowing it.",
    highlightStrong: "The shocking truth?",
    highlightText: "Vision loss doesn\u2019t start in your eyes \u2014 it starts when chronic inflammation and oxidative stress destroy the delicate cells in your retina and optic nerve.",
    ctaIntro: "In the video below, discover the 15-second morning ritual that protects your retinal cells and restores natural clarity.",
    ctaText: "Watch Video - See How the 15-Second Ritual Works",
    ctaLink: "#",
  },
  testimonial: {
    sectionTitle: "From Losing Her Sight to Seeing Life Again",
    quote: "I was terrified I would go blind before seeing my grandchildren grow up.",
    author: "Margaret, 67 years old",
    details: "Retired Teacher and Grandmother",
    story1: "Every morning I woke up to blurrier vision. Reading became impossible without a magnifying glass. Driving at night was terrifying.",
    story2: "My doctor said it was just aging and handed me a stronger prescription. But deep down I knew something was wrong.",
    highlightText: "Then I discovered the real cause. It wasn\u2019t aging or genetics. The problem was years of oxidative stress silently destroying my retinal cells.",
    resolution: "When I tried the 15-second morning ritual, everything changed. Within weeks, the blurriness started clearing. I could read again without straining.",
    ctaText: "Watch Video - See How the 15-Second Ritual Works",
    ctaLink: "#",
    ctaSubtext: "Discover how this simple ritual protects your retina and restores natural vision",
  },
  final: {
    title: "Blurry Vision Is Just the First Warning Sign",
    paragraph1: "Margaret\u2019s story is just one among thousands proving that what starts with slightly blurry vision can progress to serious conditions.",
    paragraph2: "But the 15-second ritual is the breakthrough that can stop this before it\u2019s too late.",
  },
  sidebar: {
    featuredTitle: "Featured Articles",
    featuredArticles: [
      { title: "7 Early Warning Signs of Macular Degeneration", url: "#" },
      { title: "How Blue Light Damages Your Retina", url: "#" },
      { title: "Vision Loss Prevention: What Really Works", url: "#" },
      { title: "The Link Between Inflammation and Eye Disease", url: "#" },
      { title: "New Natural Approach to Restore Eye Health", url: "#" },
    ],
    relatedTitle: "Related Articles",
    relatedArticles: [
      { title: "5 Hidden Signs Your Vision Is Deteriorating", author: "Dr. Emily Chen", date: "January 26, 2026", url: "#" },
      { title: "Why 1 in 3 Adults Over 40 Are at Risk", author: "Dr. James Parker", date: "January 21, 2026", url: "#" },
      { title: "The Ritual Eye Doctors Don\u2019t Mention", author: "Dr. Lisa Monroe", date: "January 26, 2026", url: "#" },
    ],
    promoTitle: "Blurry Vision Is Never \"Normal\"",
    promoText: "Those visual disturbances aren\u2019t harmless \u2014 they\u2019re your eyes crying for help.",
    promoCtaText: "See How to Protect Your Vision",
    promoCtaLink: "#",
  },
  footer: {
    logoTitle: "Vision",
    logoSubtitle: "\u2022 Eye Health",
    tagline: "Your trusted portal for eye health and vision wellness information.",
    links: [
      { label: "Contact", url: "#" },
      { label: "References", url: "#" },
      { label: "Terms of Use", url: "#" },
      { label: "Disclaimer", url: "#" },
      { label: "Privacy Policy", url: "#" },
    ],
    copyright: "\u00A9 2026 Vision Eye Health. All rights reserved.",
  },
  settings: {
    ctaLinkUrl: "#",
  },
  tracking: {
    headScript: "",
    clarityId: "",
  },
  seo: {
    metaTitle: "",
    metaDescription: "",
    canonicalUrl: "",
    ogImage: "",
    schemaType: "Article",
    schemaAuthor: "",
    schemaPublisher: "",
  },
  facebookTestimonials: {
    sectionTitle: "What People Are Saying",
    ctaLink: "#",
    testimonials: [
      {
        id: "1",
        name: "Susan Taylor",
        date: "January 28, 2026",
        text: "I can\u2019t believe the difference! After months of worsening blurry vision, I tried this ritual and within 3 weeks I could read without squinting again. \u{1F64C}",
        imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
        likes: 234,
        comments: 45,
      },
      {
        id: "2",
        name: "David Thompson",
        date: "January 25, 2026",
        text: "Night driving used to terrify me \u2014 the halos around headlights were getting worse every month. Now I can drive confidently again. \u2764\uFE0F",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        likes: 189,
        comments: 32,
      },
      {
        id: "3",
        name: "Linda Martinez",
        date: "January 22, 2026",
        text: "After years of dry, tired eyes and constant headaches, I finally found something that actually works. \u{1F4AA}",
        imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
        likes: 312,
        comments: 67,
      },
    ],
  },
};

const migrateNavItems = (navItems: any[]): NavItem[] => {
  if (!navItems || navItems.length === 0) return defaultContent.header.navItems;
  if (typeof navItems[0] === 'string') return navItems.map((item: string) => ({ label: item, url: '#' }));
  return navItems;
};

const migrateFeaturedArticles = (articles: any[]): FeaturedArticle[] => {
  if (!articles || articles.length === 0) return defaultContent.sidebar.featuredArticles;
  if (typeof articles[0] === 'string') return articles.map((item: string) => ({ title: item, url: '#' }));
  return articles;
};

const migrateRelatedArticles = (articles: any[]): RelatedArticle[] => {
  if (!articles || articles.length === 0) return defaultContent.sidebar.relatedArticles;
  return articles.map((a: any) => ({ title: a.title || '', author: a.author || '', date: a.date || '', url: a.url || '#' }));
};

const migrateFooterLinks = (links: any[]): FooterLink[] => {
  if (!links || links.length === 0) return defaultContent.footer.links;
  if (typeof links[0] === 'string') return links.map((item: string) => ({ label: item, url: '#' }));
  return links;
};

export interface SavedVersion {
  name: string;
  date: string;
  content: PageContent;
}

interface ContentContextType {
  content: PageContent;
  updateContent: (section: keyof PageContent, data: any) => void;
  resetContent: () => void;
  savedVersions: SavedVersion[];
  saveVersion: (name: string) => void;
  loadVersion: (index: number) => void;
  deleteVersion: (index: number) => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

const STORAGE_KEY = 'advertorial-content';
const VERSIONS_KEY = 'advertorial-saved-versions';

export const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<PageContent>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          header: { ...defaultContent.header, ...parsed.header, navItems: migrateNavItems(parsed.header?.navItems) },
          hero: { ...defaultContent.hero, ...parsed.hero },
          symptoms: { ...defaultContent.symptoms, ...parsed.symptoms },
          epidemic: { ...defaultContent.epidemic, ...parsed.epidemic },
          testimonial: { ...defaultContent.testimonial, ...parsed.testimonial },
          final: { ...defaultContent.final, ...parsed.final },
          sidebar: {
            ...defaultContent.sidebar,
            ...parsed.sidebar,
            featuredArticles: migrateFeaturedArticles(parsed.sidebar?.featuredArticles),
            relatedArticles: migrateRelatedArticles(parsed.sidebar?.relatedArticles),
          },
          footer: { ...defaultContent.footer, ...parsed.footer, links: migrateFooterLinks(parsed.footer?.links) },
          images: { ...defaultContent.images, ...parsed.images },
          settings: { ...defaultContent.settings, ...parsed.settings },
          facebookTestimonials: { ...defaultContent.facebookTestimonials, ...parsed.facebookTestimonials },
          tracking: { ...defaultContent.tracking, ...parsed.tracking },
          seo: { ...defaultContent.seo, ...parsed.seo },
        };
      } catch {
        return defaultContent;
      }
    }
    return defaultContent;
  });

  const [savedVersions, setSavedVersions] = useState<SavedVersion[]>(() => {
    try {
      const saved = localStorage.getItem(VERSIONS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  }, [content]);

  useEffect(() => {
    localStorage.setItem(VERSIONS_KEY, JSON.stringify(savedVersions));
  }, [savedVersions]);

  const updateContent = (section: keyof PageContent, data: any) => {
    setContent(prev => ({ ...prev, [section]: { ...prev[section], ...data } }));
  };

  const resetContent = () => {
    setContent(defaultContent);
    localStorage.removeItem(STORAGE_KEY);
  };

  const saveVersion = (name: string) => {
    setSavedVersions(prev => [...prev, { name, date: new Date().toLocaleString('pt-BR'), content: JSON.parse(JSON.stringify(content)) }]);
  };

  const loadVersion = (index: number) => {
    const version = savedVersions[index];
    if (version) setContent(version.content);
  };

  const deleteVersion = (index: number) => {
    setSavedVersions(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <ContentContext.Provider value={{ content, updateContent, resetContent, savedVersions, saveVersion, loadVersion, deleteVersion }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) throw new Error('useContent must be used within ContentProvider');
  return context;
};

export { defaultContent };
