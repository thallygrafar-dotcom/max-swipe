import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { BuilderState, defaultBuilderState, TestimonialConfig, CustomSectionsConfig, PlansStyleConfig, SectionVisibility } from '@/types/dtc-builder';

type BuilderAction =
  | { type: 'SET_STATE'; payload: BuilderState }
  | { type: 'UPDATE_BRANDING'; payload: Partial<BuilderState['branding']> }
  | { type: 'UPDATE_STOCK'; payload: Partial<BuilderState['stock']> }
  | { type: 'UPDATE_PAYMENT_BADGES'; payload: Partial<BuilderState['paymentBadges']> }
  | { type: 'UPDATE_PLANS_STYLE'; payload: Partial<PlansStyleConfig> }
  | { type: 'UPDATE_PLANS'; payload: BuilderState['plans'] }
  | { type: 'UPDATE_PLAN'; payload: { id: string; updates: Partial<BuilderState['plans'][0]> } }
  | { type: 'UPDATE_GUARANTEE'; payload: Partial<BuilderState['guarantee']> }
  | { type: 'UPDATE_TESTIMONIALS'; payload: Partial<TestimonialConfig> }
  | { type: 'UPDATE_FAQ'; payload: BuilderState['faq'] }
  | { type: 'UPDATE_BONUSES'; payload: BuilderState['bonuses'] }
  | { type: 'UPDATE_CTA'; payload: Partial<BuilderState['cta']> }
  | { type: 'UPDATE_FOOTER'; payload: Partial<BuilderState['footer']> }
  | { type: 'UPDATE_EXPORT'; payload: Partial<BuilderState['export']> }
  | { type: 'UPDATE_CUSTOM_SECTIONS'; payload: Partial<CustomSectionsConfig> }
  | { type: 'UPDATE_SECTION_VISIBILITY'; payload: Partial<SectionVisibility> }
  | { type: 'RESET' };

function builderReducer(state: BuilderState, action: BuilderAction): BuilderState {
  switch (action.type) {
    case 'SET_STATE': return action.payload;
    case 'UPDATE_BRANDING': return { ...state, branding: { ...state.branding, ...action.payload } };
    case 'UPDATE_STOCK': return { ...state, stock: { ...state.stock, ...action.payload } };
    case 'UPDATE_PAYMENT_BADGES': return { ...state, paymentBadges: { ...state.paymentBadges, ...action.payload } };
    case 'UPDATE_PLANS_STYLE': return { ...state, plansStyle: { ...state.plansStyle, ...action.payload } };
    case 'UPDATE_PLANS': return { ...state, plans: action.payload };
    case 'UPDATE_PLAN': return { ...state, plans: state.plans.map((plan) => plan.id === action.payload.id ? { ...plan, ...action.payload.updates } : plan) };
    case 'UPDATE_GUARANTEE': return { ...state, guarantee: { ...state.guarantee, ...action.payload } };
    case 'UPDATE_TESTIMONIALS': return { ...state, testimonials: { ...state.testimonials, ...action.payload } };
    case 'UPDATE_FAQ': return { ...state, faq: action.payload };
    case 'UPDATE_BONUSES': return { ...state, bonuses: action.payload };
    case 'UPDATE_CTA': return { ...state, cta: { ...state.cta, ...action.payload } };
    case 'UPDATE_FOOTER': return { ...state, footer: { ...state.footer, ...action.payload } };
    case 'UPDATE_EXPORT': return { ...state, export: { ...state.export, ...action.payload } };
    case 'UPDATE_CUSTOM_SECTIONS': return { ...state, customSections: { ...state.customSections, ...action.payload } };
    case 'UPDATE_SECTION_VISIBILITY': return { ...state, sectionVisibility: { ...state.sectionVisibility, ...action.payload } };
    case 'RESET': return defaultBuilderState;
    default: return state;
  }
}

export function migrateState(parsed: any): BuilderState {
  const migrated = { ...defaultBuilderState };
  if (parsed.branding) migrated.branding = { ...defaultBuilderState.branding, ...parsed.branding, buttonTextColor: parsed.branding.buttonTextColor ?? '#ffffff', sectionSpacing: parsed.branding.sectionSpacing ?? 32 };
  if (parsed.cta) migrated.cta = { ...defaultBuilderState.cta, ...parsed.cta };
  if (parsed.footer) migrated.footer = { ...defaultBuilderState.footer, ...parsed.footer };
  if (parsed.export) migrated.export = { ...defaultBuilderState.export, ...parsed.export };
  if (parsed.faq) migrated.faq = parsed.faq.map((f: any) => ({ ...f, enabled: f.enabled ?? true }));
  migrated.faqEnabled = parsed.faqEnabled ?? true;
  if (parsed.bonuses) migrated.bonuses = parsed.bonuses.map((b: any) => ({ ...b, showImage: b.showImage ?? true }));
  if (parsed.paymentBadges) migrated.paymentBadges = { ...defaultBuilderState.paymentBadges, ...parsed.paymentBadges };
  if (parsed.customSections) migrated.customSections = { ...defaultBuilderState.customSections, ...parsed.customSections, items: (parsed.customSections.items || []).map((item: any) => ({ ...item, position: item.position || 'after-bonuses', titleFontSize: item.titleFontSize ?? 20, textFontSize: item.textFontSize ?? 16, imageWidth: item.imageWidth ?? 40, sectionPadding: item.sectionPadding ?? 32 })) };
  if (parsed.plansStyle) migrated.plansStyle = { ...defaultBuilderState.plansStyle, ...parsed.plansStyle };
  if (parsed.stock) migrated.stock = { ...defaultBuilderState.stock, ...parsed.stock, countdown: parsed.stock.countdown ?? true, countdownInterval: parsed.stock.countdownInterval ?? 5, fontSize: parsed.stock.fontSize ?? 24, textColor: parsed.stock.textColor ?? '#374151', numberColor: parsed.stock.numberColor ?? '#dc2626' };
  if (parsed.guarantee) migrated.guarantee = { ...defaultBuilderState.guarantee, ...parsed.guarantee, iconScale: parsed.guarantee.iconScale ?? 100, titleColor: parsed.guarantee.titleColor ?? '#1f2937', titleFontSize: parsed.guarantee.titleFontSize ?? 20, textColor: parsed.guarantee.textColor ?? '#4b5563', textFontSize: parsed.guarantee.textFontSize ?? 16, bottomImageUrl: parsed.guarantee.bottomImageUrl ?? '', bottomImageScale: parsed.guarantee.bottomImageScale ?? 100 };
  if (parsed.testimonial && !parsed.testimonials) migrated.testimonials = { items: [{ id: 'testimonial-1', text: parsed.testimonial.text || '', name: parsed.testimonial.name || '', location: parsed.testimonial.location || '', stars: parsed.testimonial.stars || 5, photoUrl: parsed.testimonial.photoUrl || '' }], displayMode: 'single', autoPlay: true, autoPlayInterval: 5 };
  else if (parsed.testimonials) migrated.testimonials = { ...defaultBuilderState.testimonials, ...parsed.testimonials };
  if (parsed.plans) migrated.plans = parsed.plans.map((plan: any, index: number) => ({ ...defaultBuilderState.plans[index] || defaultBuilderState.plans[0], ...plan, imageScale: plan.imageScale ?? 100, imageSpacingTop: plan.imageSpacingTop ?? 8, imageSpacingBottom: plan.imageSpacingBottom ?? 8, showImageBackground: plan.showImageBackground ?? false, titleFontSize: plan.titleFontSize ?? 28, titleBackgroundColor: plan.titleBackgroundColor ?? '#f3f4f6', showTitleBackground: plan.showTitleBackground ?? false, priceFontSize: plan.priceFontSize ?? 40, buttonColor: plan.buttonColor ?? '#28a745', buttonTextColor: plan.buttonTextColor ?? '#ffffff', checkoutImageUrl: plan.checkoutImageUrl ?? '', bullets: plan.bullets?.map((b: any) => ({ id: b.id, text: b.text, color: b.color ?? '#374151', isBold: b.isBold ?? false })) ?? [] }));
  if (parsed.sectionVisibility) migrated.sectionVisibility = { ...defaultBuilderState.sectionVisibility, ...parsed.sectionVisibility };
  if (parsed.faqEnabled !== undefined && !parsed.sectionVisibility) migrated.sectionVisibility.faqEnabled = parsed.faqEnabled !== false;
  migrated.faqEnabled = migrated.sectionVisibility.faqEnabled;
  return migrated;
}

interface BuilderContextType {
  state: BuilderState;
  dispatch: React.Dispatch<BuilderAction>;
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);
const STORAGE_KEY = 'dtc-builder-state';

export function BuilderProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(builderReducer, defaultBuilderState);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const migrated = migrateState(parsed);
        dispatch({ type: 'SET_STATE', payload: migrated });
      } catch (e) {
        console.error('Failed to parse stored state:', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return (
    <BuilderContext.Provider value={{ state, dispatch }}>
      {children}
    </BuilderContext.Provider>
  );
}

export function useBuilder() {
  const context = useContext(BuilderContext);
  if (!context) throw new Error('useBuilder must be used within a BuilderProvider');
  return context;
}
