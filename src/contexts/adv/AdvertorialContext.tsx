import { createContext, useContext, useMemo, useState, ReactNode } from "react";

export type ImageMode = "url" | "upload";

export interface AdvertorialImage {
  mode: ImageMode;
  url: string;
  preview: string;
  fileName: string;
  fileData: string;
}

export interface LinkItem {
  label: string;
  url: string;
}

export interface RelatedArticleItem {
  title: string;
  meta: string;
  url: string;
}

export interface CommentItem {
  id: string;
  name: string;
  text: string;
  likes: string;
  comments: string;
  image: AdvertorialImage;
}

export interface AdvertorialConfig {
  siteName: string;
  domain: string;

  scripts: {
    clarityEnabled: boolean;
    clarityProjectId: string;
    headScripts: string;
    bodyStartScripts: string;
    bodyEndScripts: string;
  };

  warningBox1Color: string;
  warningBox2Color: string;

  brandName: string;
  brandSubtext: string;
  menuItems: LinkItem[];
  headerBgColor: string;
  headerTextColor: string;
  footerBgColor: string;
  footerTextColor: string;

  headline: string;
  subheadline: string;
  author: string;
  ctaText: string;
  ctaButtonColor: string;
  ctaButtonTextColor: string;

  symptomsTitle: string;
  symptomsIntro: string;
  symptomsLead: string;
  symptomsList: string[];

  warningBox1: string;
  crisisTitle: string;
  crisisText: string;
  warningBox2: string;
  postWarningText: string;
  postWarningCtaText: string;

  storyTitle: string;
  storyName: string;
  storyRole: string;
  storyQuote: string;
  storyText1: string;
  storyHighlight: string;
  storyText2: string;
  storyNote: string;
  secondSectionTitle: string;
  secondSectionText: string;
  secondSectionBold: string;
  storyImage: AdvertorialImage;
  storyHighlightColor: string;

  featuredTitle: string;
  featuredArticles: LinkItem[];

  relatedTitle: string;
  relatedArticles: RelatedArticleItem[];

  sidebarCtaTitle: string;
  sidebarCtaText: string;
  sidebarCtaButton: string;
  sidebarCtaButtonUrl: string;

  sidebarBgColor: string;
  sidebarTextColor: string;
  sidebarButtonColor: string;
  sidebarButtonTextColor: string;

  footerBrandMain: string;
  footerBrandSub: string;
  footerText: string;
  footerLinks: LinkItem[];
  footerCopyright: string;

  commentsTitle: string;
  comments: CommentItem[];

  heroImage: AdvertorialImage;
  secondaryImage: AdvertorialImage;
  sidebarImage: AdvertorialImage;
}

interface AdvertorialContextType {
  config: AdvertorialConfig;
  currentProjectId: string | null;
  updateConfig: (updates: Partial<AdvertorialConfig>) => void;
  resetConfig: () => void;
  setFullConfig: (newConfig: AdvertorialConfig) => void;
  setCurrentProjectId: (id: string | null) => void;
}

export const emptyImage = (): AdvertorialImage => ({
  mode: "url",
  url: "",
  preview: "",
  fileName: "",
  fileData: "",
});

export const uid = () => Math.random().toString(36).slice(2, 10);

export const defaultAdvertorialConfig: AdvertorialConfig = {
  siteName: "Vision Eye Health",
  domain: "https://visioneyehealth.com",

  scripts: {
    clarityEnabled: false,
    clarityProjectId: "",
    headScripts: "",
    bodyStartScripts: "",
    bodyEndScripts: "",
  },

  brandName: "Vision Eye Health",
  brandSubtext: "Eye Health",
  menuItems: [
    { label: "Eye Research", url: "#" },
    { label: "Vision Health", url: "#" },
    { label: "Prevention", url: "#" },
    { label: "Real Stories", url: "#" },
  ],

  headerBgColor: "#0f172a",
  headerTextColor: "#ffffff",

  warningBox1Color: "#f5e9bc",
  warningBox2Color: "#f5e9bc",

  headline:
    "The 15-Second Morning Ritual That Restores Crystal-Clear Vision Naturally",
  subheadline:
    "Because the blurry vision you blame on aging may actually be a warning sign of something far more serious — and most doctors never test for it.",
  author: "By Dr. Sarah Mitchell, MD — Ophthalmology Specialist",
  ctaText: "Watch Video - See How the 15-Second Ritual Works",
  ctaButtonColor: "#ef2b2d",
  ctaButtonTextColor: "#ffffff",

  symptomsTitle:
    "Do your eyes feel dry, tired, or blurry by the end of the day?",
  symptomsIntro:
    "That’s not just “screen fatigue.” It could be the first sign of a hidden condition silently damaging your vision from the inside.",
  symptomsLead:
    "If you notice 3 or more of these symptoms, pay close attention:",
  symptomsList: [
    "Blurry vision that comes and goes",
    "Frequent headaches behind the eyes",
    "Difficulty seeing at night or in low light",
    "Dry, itchy, or watery eyes",
    "Seeing halos around lights",
  ],

  warningBox1:
    "Millions of adults experience these warning signs daily — but few realize how quickly vision can deteriorate when the real cause goes untreated.",
  crisisTitle:
    "The Silent Crisis Stealing Your Sight... And the Discovery Eye Doctors Overlook",
  crisisText:
    "Nearly 1 in 3 adults over 40 show early signs of macular degeneration, and over 80 million people worldwide suffer from glaucoma — often without knowing it.",
  warningBox2:
    "The shocking truth? Vision loss doesn’t start in your eyes — it starts when chronic inflammation and oxidative stress begin to damage the delicate cells in your retina and optic nerve.",
  postWarningText:
    "In the video below, discover the 15-second morning ritual that protects your retinal cells and restores natural clarity.",
  postWarningCtaText: "Watch Video - See How the 15-Second Ritual Works",

  storyTitle: "From Losing Her Sight to Seeing Life Again",
  storyName: "Margaret, 67 years old",
  storyRole: "Retired Teacher and Grandmother",
  storyQuote:
    "I was terrified I would go blind before seeing my grandchildren grow up.",
  storyText1:
    "Every morning I woke up to blurrier vision. Reading became impossible without a magnifying glass. Driving at night was terrifying — the headlights turned into blinding halos.",
  storyHighlight:
    "Then I discovered the real cause. It wasn’t aging or genetics. The problem was that years of oxidative stress and blue light exposure had been silently destroying my retinal cells.",
  storyHighlightColor: "#f5e9bc",
  storyText2:
    "When I tried the 15-second morning ritual, everything changed. Within weeks, the blurriness started clearing.",
  storyNote:
    "Discover how this simple ritual protects your retina and restores natural vision",
  secondSectionTitle: "Blurry Vision Is Just the First Warning Sign",
  secondSectionText:
    "Margaret’s story is just one among thousands proving that what starts with slightly blurry vision can progress to serious conditions — macular degeneration, glaucoma, and even permanent vision loss.",
  secondSectionBold:
    "But the 15-second ritual is the breakthrough that can stop this before it’s too late.",

  featuredTitle: "Featured Articles",
  featuredArticles: [
    { label: "7 Early Warning Signs of Macular Degeneration", url: "#" },
    { label: "How Blue Light Damages Your Retina", url: "#" },
    { label: "Vision Loss Prevention: What Really Works", url: "#" },
    { label: "The Link Between Inflammation and Eye Disease", url: "#" },
    { label: "New Natural Approach to Restore Eye Health", url: "#" },
  ],

  relatedTitle: "Related Articles",
  relatedArticles: [
    {
      title: "5 Hidden Signs Your Vision Is Deteriorating Faster Than Normal",
      meta: "Dr. Emily Chen - January 24, 2026",
      url: "#",
    },
    {
      title: "Why 1 in 3 Adults Over 40 Are at Risk of Vision Loss",
      meta: "Dr. James Parker - January 21, 2026",
      url: "#",
    },
    {
      title: "The 15-Second Ritual Eye Doctors Don’t Want You to Know About",
      meta: "Dr. Lisa Monroe - January 20, 2026",
      url: "#",
    },
  ],

  sidebarCtaTitle: 'Blurry Vision Is Never "Normal"',
  sidebarCtaText:
    "Those visual disturbances aren't harmless — they're your eyes crying for help.",
  sidebarCtaButton: "See How to Protect Your Vision",
  sidebarCtaButtonUrl: "#",

  sidebarBgColor: "#15215f",
  sidebarTextColor: "#ffffff",
  sidebarButtonColor: "#ef2b2d",
  sidebarButtonTextColor: "#ffffff",

  footerBrandMain: "Vision Eye Health",
  footerBgColor: "#18256b",
  footerTextColor: "#ffffff",
  footerBrandSub: "Eye Health",
  footerText:
    "Your trusted portal for eye health and vision wellness information.",
  footerLinks: [
    { label: "Terms of Use", url: "/terms.html" },
    { label: "Disclaimer", url: "/disclaimer.html" },
    { label: "Privacy Policy", url: "/privacy.html" },
  ],
  footerCopyright: "© 2026 Vision Eye Health. All rights reserved.",

  commentsTitle: "What People Are Saying",
  comments: [
    {
      id: uid(),
      name: "Susan Taylor",
      text: "I can’t believe the difference. After months of worsening blurry vision, I tried this ritual and within 3 weeks I could read without squinting again.",
      likes: "234",
      comments: "45 comments",
      image: emptyImage(),
    },
    {
      id: uid(),
      name: "David Thompson",
      text: "Night driving used to terrify me — the halos around headlights were getting worse every month. Now I can drive confidently again.",
      likes: "189",
      comments: "32 comments",
      image: emptyImage(),
    },
    {
      id: uid(),
      name: "Linda Martinez",
      text: "After years of dry, tired eyes and constant headaches, I finally found something that actually works.",
      likes: "312",
      comments: "67 comments",
      image: emptyImage(),
    },
  ],

  storyImage: emptyImage(),
  heroImage: emptyImage(),
  secondaryImage: emptyImage(),
  sidebarImage: emptyImage(),
};

const AdvertorialContext = createContext<AdvertorialContextType | undefined>(
  undefined
);

export const AdvertorialProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [config, setConfig] = useState<AdvertorialConfig>(
    defaultAdvertorialConfig
  );
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);

  const updateConfig = (updates: Partial<AdvertorialConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const resetConfig = () => {
    setConfig(defaultAdvertorialConfig);
    setCurrentProjectId(null);
  };

  const setFullConfig = (newConfig: AdvertorialConfig) => {
    setConfig(newConfig);
  };

  const value = useMemo(
    () => ({
      config,
      currentProjectId,
      updateConfig,
      resetConfig,
      setFullConfig,
      setCurrentProjectId,
    }),
    [config, currentProjectId]
  );

  return (
    <AdvertorialContext.Provider value={value}>
      {children}
    </AdvertorialContext.Provider>
  );
};

export const useAdvertorial = () => {
  const context = useContext(AdvertorialContext);

  if (!context) {
    throw new Error("useAdvertorial must be used within AdvertorialProvider");
  }

  return context;
};