export interface BrandingConfig {
  productName: string;
  headline: string;
  subheadline: string;
  primaryColor: string;
  secondaryColor: string;
  buttonColor: string;
  buttonTextColor: string;
  backgroundColor: string;
  fontFamily: string;
  borderRadius: number;
  shadowIntensity: 'none' | 'light' | 'medium' | 'strong';
  buttonAnimation: 'none' | 'pulse' | 'bounce' | 'glow';
  cardSpacing: 'compact' | 'normal' | 'spacious';
  // Container styling
  containerPadding: number;
  containerBorderRadius: number;
  showContainerBorder: boolean;
  // Section spacing
  sectionSpacing: number;
}

// Global styling for all plans
export interface PlansStyleConfig {
  titleFontSize: number;
  priceFontSize: number;
  imageScale: number;
  imageSpacingTop: number;
  imageSpacingBottom: number;
  daySupplySpacingTop: number;
  buttonColor: string;
  buttonTextColor: string;
}

export interface StockConfig {
  text: string;
  quantity: number;
  urgencyText: string;
  animation: 'none' | 'pulse' | 'blink';
  countdown: boolean;
  countdownInterval: number; // seconds between decrements
  fontSize: number;
  textColor: string;
  numberColor: string;
}

export interface PaymentBadge {
  id: string;
  name: string;
  enabled: boolean;
}

export interface PaymentBadgesConfig {
  enabled: boolean;
  badges: PaymentBadge[];
}

export interface PlanBullet {
  id: string;
  text: string;
  color: string;
  isBold: boolean;
}

export interface Plan {
  id: string;
  title: string;
  badge: string;
  badgeType: 'best' | 'popular' | 'basic' | 'none';
  bottles: number;
  daysSupply: number;
  pricePerBottle: number;
  totalPrice: number;
  originalPrice: number;
  savings: number;
  shipping: string;
  buttonText: string;
  buttonLink: string;
  buttonColor: string; // individual button color
  buttonTextColor: string; // individual button text color
  useCustomButtonColor: boolean; // use individual button color instead of global
  bullets: PlanBullet[];
  isFeatured: boolean;
  imageUrl: string;
  imageScale: number; // percentage 50-200
  imageSpacingTop: number; // spacing above image
  imageSpacingBottom: number; // spacing below image
  titleFontSize: number;
  titleBackgroundColor: string;
  showTitleBackground: boolean;
  priceFontSize: number; // price font size
  checkoutImageUrl: string; // image below buy now button
}

export interface GuaranteeConfig {
  title: string;
  text: string;
  iconUrl: string;
  iconScale: number;
  titleColor: string;
  titleFontSize: number;
  textColor: string;
  textFontSize: number;
  bottomImageUrl: string;
  bottomImageScale: number;
}

export interface TestimonialItem {
  id: string;
  text: string;
  name: string;
  location: string;
  stars: number;
  photoUrl: string;
}

export interface TestimonialConfig {
  items: TestimonialItem[];
  displayMode: 'single' | 'carousel' | 'grid';
  autoPlay: boolean;
  autoPlayInterval: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  enabled: boolean;
}

export interface BonusItem {
  id: string;
  title: string;
  description: string;
  value: string;
  imageUrl: string;
  showImage: boolean;
}

export interface CTAConfig {
  headline: string;
  subheadline: string;
  buttonText: string;
  note: string;
}

export interface FooterConfig {
  links: string;
  disclaimer: string;
}

export interface ExportConfig {
  wrapperType: 'class' | 'id';
  wrapperName: string;
  startHidden: boolean;
}

export type SectionPosition = 
  | 'after-header' 
  | 'after-plans' 
  | 'after-guarantee' 
  | 'after-testimonials' 
  | 'after-faq' 
  | 'after-bonuses' 
  | 'before-footer';

export interface CustomSectionItem {
  id: string;
  title: string;
  text: string;
  imageUrl: string;
  imagePosition: 'left' | 'right' | 'top' | 'bottom';
  backgroundColor: string;
  textColor: string;
  titleColor: string;
  enabled: boolean;
  position: SectionPosition;
  // New styling options
  titleFontSize: number;
  textFontSize: number;
  imageWidth: number; // percentage 20-100
  sectionPadding: number; // px
}

export interface CustomSectionsConfig {
  items: CustomSectionItem[];
}

export interface SectionVisibility {
  stockEnabled: boolean;
  plansEnabled: boolean;
  guaranteeEnabled: boolean;
  testimonialsEnabled: boolean;
  faqEnabled: boolean;
  bonusesEnabled: boolean;
  ctaEnabled: boolean;
  footerEnabled: boolean;
}

export interface BuilderState {
  branding: BrandingConfig;
  stock: StockConfig;
  paymentBadges: PaymentBadgesConfig;
  plansStyle: PlansStyleConfig;
  plans: Plan[];
  guarantee: GuaranteeConfig;
  testimonials: TestimonialConfig;
  faq: FAQItem[];
  faqEnabled: boolean;
  bonuses: BonusItem[];
  cta: CTAConfig;
  footer: FooterConfig;
  export: ExportConfig;
  customSections: CustomSectionsConfig;
  sectionVisibility: SectionVisibility;
}

export const defaultBuilderState: BuilderState = {
  branding: {
    productName: "MindBoost Pro",
    headline: "Claim Your Discounted MindBoost Pro Now",
    subheadline: "While Supplies Last",
    primaryColor: "#3D2066",
    secondaryColor: "#E5A835",
    buttonColor: "#28a745",
    buttonTextColor: "#ffffff",
    backgroundColor: "#f5f5f7",
    fontFamily: "Poppins",
    borderRadius: 12,
    shadowIntensity: 'medium',
    buttonAnimation: 'bounce',
    cardSpacing: 'normal',
    containerPadding: 10,
    containerBorderRadius: 12,
    showContainerBorder: true,
    sectionSpacing: 32,
  },
  plansStyle: {
    titleFontSize: 28,
    priceFontSize: 40,
    imageScale: 100,
    imageSpacingTop: 8,
    imageSpacingBottom: 8,
    daySupplySpacingTop: 4,
    buttonColor: "#28a745",
    buttonTextColor: "#ffffff",
  },
  stock: {
    text: "Bottles in Stock",
    quantity: 165,
    urgencyText: "While supplies last",
    animation: 'pulse',
    countdown: true,
    countdownInterval: 5,
    fontSize: 24,
    textColor: "#374151",
    numberColor: "#dc2626",
  },
  paymentBadges: {
    enabled: false,
    badges: [
      { id: 'visa', name: 'Visa', enabled: false },
      { id: 'mastercard', name: 'Mastercard', enabled: false },
      { id: 'amex', name: 'Amex', enabled: false },
      { id: 'paypal', name: 'PayPal', enabled: false },
      { id: 'ssl', name: 'SSL Secure', enabled: false },
      { id: 'moneyback', name: '100% Money Back', enabled: false },
    ],
  },
  plans: [
    {
      id: "plan-1",
      title: "1 BOTTLE",
      badge: "Basic",
      badgeType: "basic",
      bottles: 1,
      daysSupply: 30,
      pricePerBottle: 79,
      totalPrice: 79,
      originalPrice: 99,
      savings: 0,
      shipping: "+$9.95 SHIPPING",
      buttonText: "BUY NOW",
      buttonLink: "https://checkout.example.com/1-bottle",
      buttonColor: "#28a745",
      buttonTextColor: "#ffffff",
      useCustomButtonColor: false,
      bullets: [
        { id: "b1-1", text: "30 Days Supply", color: "#374151", isBold: false },
        { id: "b1-2", text: "100% Money-Back Guarantee", color: "#374151", isBold: false },
      ],
      isFeatured: false,
      imageUrl: "",
      imageScale: 100,
      imageSpacingTop: 8,
      imageSpacingBottom: 8,
      titleFontSize: 28,
      titleBackgroundColor: "#f3f4f6",
      showTitleBackground: false,
      priceFontSize: 40,
      checkoutImageUrl: "",
    },
    {
      id: "plan-2",
      title: "6 BOTTLES",
      badge: "BEST VALUE!",
      badgeType: "best",
      bottles: 6,
      daysSupply: 180,
      pricePerBottle: 49,
      totalPrice: 294,
      originalPrice: 594,
      savings: 50,
      shipping: "FREE SHIPPING",
      buttonText: "BUY NOW",
      buttonLink: "https://checkout.example.com/6-bottles",
      buttonColor: "#28a745",
      buttonTextColor: "#ffffff",
      useCustomButtonColor: false,
      bullets: [
        { id: "b2-1", text: "180 Days Supply", color: "#374151", isBold: false },
        { id: "b2-2", text: "BIGGEST DISCOUNT!", color: "#dc2626", isBold: true },
        { id: "b2-3", text: "180 Days Guarantee", color: "#374151", isBold: false },
      ],
      isFeatured: true,
      imageUrl: "",
      imageScale: 100,
      imageSpacingTop: 8,
      imageSpacingBottom: 8,
      titleFontSize: 28,
      titleBackgroundColor: "#f3f4f6",
      showTitleBackground: false,
      priceFontSize: 40,
      checkoutImageUrl: "",
    },
    {
      id: "plan-3",
      title: "3 BOTTLES",
      badge: "Most Popular",
      badgeType: "popular",
      bottles: 3,
      daysSupply: 90,
      pricePerBottle: 69,
      totalPrice: 207,
      originalPrice: 297,
      savings: 30,
      shipping: "FREE SHIPPING",
      buttonText: "BUY NOW",
      buttonLink: "https://checkout.example.com/3-bottles",
      buttonColor: "#28a745",
      buttonTextColor: "#ffffff",
      useCustomButtonColor: false,
      bullets: [
        { id: "b3-1", text: "90 Days Supply", color: "#374151", isBold: false },
        { id: "b3-2", text: "90 Days Guarantee", color: "#374151", isBold: false },
      ],
      isFeatured: false,
      imageUrl: "",
      imageScale: 100,
      imageSpacingTop: 8,
      imageSpacingBottom: 8,
      titleFontSize: 28,
      titleBackgroundColor: "#f3f4f6",
      showTitleBackground: false,
      priceFontSize: 40,
      checkoutImageUrl: "",
    },
  ],
  guarantee: {
    title: "100% Money-Back Guarantee. Risk-Free 100-Day Return Policy",
    text: "Your order today is covered by our iron-clad 100-day 100% money-back guarantee. If you are not impressed with the results, then at any point in the next 100 days, simply send us an email and we'll gladly refund every single cent. No hassles, no questions asked.",
    iconUrl: "",
    iconScale: 100,
    titleColor: "#1f2937",
    titleFontSize: 20,
    textColor: "#4b5563",
    textFontSize: 16,
    bottomImageUrl: "",
    bottomImageScale: 100,
  },
  testimonials: {
    items: [
      {
        id: "testimonial-1",
        text: "I was skeptical at first, but after just 30 days of using MindBoost Pro, I noticed a significant improvement in my focus and memory. This product has truly changed my life!",
        name: "Emma S.",
        location: "California",
        stars: 5,
        photoUrl: "",
      },
      {
        id: "testimonial-2",
        text: "After trying dozens of supplements over the years, MindBoost Pro is the only one that actually delivered results. My energy levels are through the roof and I feel sharper than ever.",
        name: "James R.",
        location: "Texas",
        stars: 5,
        photoUrl: "",
      },
      {
        id: "testimonial-3",
        text: "I started taking MindBoost Pro three months ago and the difference is incredible. I can concentrate for hours without feeling drained. Highly recommend it to anyone!",
        name: "Sarah M.",
        location: "New York",
        stars: 5,
        photoUrl: "",
      },
    ],
    displayMode: 'grid',
    autoPlay: true,
    autoPlayInterval: 5,
  },
  faq: [
    { id: "faq-1", question: "Is MindBoost Pro a Genuine Product?", answer: "Yes, MindBoost Pro is manufactured in an FDA-registered, GMP-certified facility in the USA using the highest quality ingredients.", enabled: true },
    { id: "faq-2", question: "Can I Take MindBoost Pro with Other Supplements?", answer: "MindBoost Pro is made with natural ingredients. However, we always recommend consulting with your healthcare provider before starting any new supplement regimen.", enabled: true },
    { id: "faq-3", question: "How Many Bottles Should I Order?", answer: "For best results, we recommend ordering at least 3-6 bottles to ensure you complete the full regimen. Plus, you'll save more with our bundle deals!", enabled: true },
    { id: "faq-4", question: "What If It Doesn't Work for Me?", answer: "We offer a 100-day money-back guarantee. If you're not satisfied with the results, simply contact us for a full refund - no questions asked.", enabled: true },
  ],
  faqEnabled: true,
  bonuses: [
    { id: "bonus-1", title: "101 Herbal Cures: Nature's Forgotten Pharmacy", description: "A complete guide to natural remedies for over 100 common ailments.", value: "$97 FREE", imageUrl: "", showImage: true },
    { id: "bonus-2", title: "Super Gut Code: Activate the Hidden Healing Inside You", description: "Learn how to optimize your gut health for better brain function.", value: "$47 FREE", imageUrl: "", showImage: true },
  ],
  cta: {
    headline: "DON'T MISS THIS LIMITED-TIME OPPORTUNITY TO STOCK UP ON MindBoost Pro!",
    subheadline: "SUPPLIES ARE RUNNING LOW - ORDER NOW!",
    buttonText: "ORDER NOW",
    note: "Order 6 Bottles or 3 Bottles and Receive 2 FREE Bonuses",
  },
  footer: {
    links: "Contact | Privacy | Terms | Refund | Shipping | Disclaimer",
    disclaimer: "© 2024 MindBoost Pro. All rights reserved. The statements on this website have not been evaluated by the FDA.",
  },
  export: {
    wrapperType: "id",
    wrapperName: "dtc-offer-section",
    startHidden: false,
  },
  customSections: {
    items: [],
  },
  sectionVisibility: {
    stockEnabled: true,
    plansEnabled: true,
    guaranteeEnabled: true,
    testimonialsEnabled: true,
    faqEnabled: true,
    bonusesEnabled: true,
    ctaEnabled: true,
    footerEnabled: true,
  },
};