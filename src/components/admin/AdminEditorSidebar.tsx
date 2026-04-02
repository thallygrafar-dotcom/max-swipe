import { useState } from "react";
import { useContent } from "@/contexts/adv/ContentContext";
import { buildFullPageSchema } from "@/lib/generateSchema";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plus, Trash2, Type, Layout, MessageSquare, AlertTriangle, Quote,
  ThumbsUp, PanelBottom, Columns, FileText, Link as LinkIcon, Users, Code, Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import AllowedEmailsManager from "@/components/admin/AllowedEmailsManager";
import ImageUploadField from "@/components/ImageUploadField";

const sections = [
  { id: "header", label: "Header", icon: Layout },
  { id: "hero", label: "Hero", icon: Type },
  { id: "symptoms", label: "Sintomas", icon: AlertTriangle },
  { id: "epidemic", label: "Epidemia", icon: FileText },
  { id: "testimonial", label: "Depoimento", icon: Quote },
  { id: "final", label: "Final", icon: MessageSquare },
  { id: "fbTestimonials", label: "FB Depoimentos", icon: ThumbsUp },
  { id: "sidebar", label: "Sidebar", icon: Columns },
  { id: "footer", label: "Footer", icon: PanelBottom },
  { id: "accessControl", label: "Acessos", icon: Users },
  { id: "tracking", label: "Rastreamento", icon: Code },
  { id: "seo", label: "SEO / Schema", icon: Search },
];

const AdminEditorSidebar = () => {
  const { content, updateContent } = useContent();
  const [activeSection, setActiveSection] = useState("header");

  const addArrayItem = (section: string, field: string, defaultValue: string | object) => {
    const sectionData = content[section as keyof typeof content] as any;
    const newArray = [...sectionData[field], defaultValue];
    updateContent(section as keyof typeof content, { [field]: newArray });
  };

  const removeArrayItem = (section: string, field: string, index: number) => {
    const sectionData = content[section as keyof typeof content] as any;
    const newArray = sectionData[field].filter((_: any, i: number) => i !== index);
    updateContent(section as keyof typeof content, { [field]: newArray });
  };

  const handleSimpleArrayUpdate = (section: string, field: string, index: number, value: string) => {
    const sectionData = content[section as keyof typeof content] as any;
    const newArray = [...sectionData[field]];
    newArray[index] = value;
    updateContent(section as keyof typeof content, { [field]: newArray });
  };

  const renderSection = () => {
    switch (activeSection) {
      case "header":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Logo Icon</Label>
              <Input value={content.header.logoIcon} onChange={e => updateContent('header', { logoIcon: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Logo Title</Label>
              <Input value={content.header.logoTitle} onChange={e => updateContent('header', { logoTitle: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Logo Subtitle</Label>
              <Input value={content.header.logoSubtitle} onChange={e => updateContent('header', { logoSubtitle: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">Itens de Navega\u00E7\u00E3o</Label>
              {content.header.navItems.map((item, index) => (
                <div key={index} className="rounded-lg border bg-card p-3 mb-2 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-muted-foreground">Item #{index + 1}</span>
                    <Button variant="ghost" size="sm" className="h-7 text-destructive hover:text-destructive" onClick={() => {
                      const newItems = content.header.navItems.filter((_, i) => i !== index);
                      updateContent('header', { navItems: newItems });
                    }}><Trash2 className="w-3.5 h-3.5" /></Button>
                  </div>
                  <div>
                    <Label className="text-[10px] text-muted-foreground">Texto</Label>
                    <Input value={item.label} className="text-sm" onChange={e => {
                      const newItems = [...content.header.navItems];
                      newItems[index] = { ...item, label: e.target.value };
                      updateContent('header', { navItems: newItems });
                    }} />
                  </div>
                  <div>
                    <Label className="text-[10px] text-muted-foreground flex items-center gap-1"><LinkIcon className="w-3 h-3" /> URL</Label>
                    <Input value={item.url} className="text-sm" placeholder="https://..." onChange={e => {
                      const newItems = [...content.header.navItems];
                      newItems[index] = { ...item, url: e.target.value };
                      updateContent('header', { navItems: newItems });
                    }} />
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full mt-1" onClick={() => {
                updateContent('header', { navItems: [...content.header.navItems, { label: 'Novo Item', url: '#' }] });
              }}><Plus className="w-3.5 h-3.5 mr-1.5" /> Adicionar Item</Button>
            </div>
          </div>
        );

      case "hero":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">T\u00EDtulo</Label>
              <Textarea value={content.hero.headline} onChange={e => updateContent('hero', { headline: e.target.value })} className="mt-1" rows={2} />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Texto de Abertura</Label>
              <Textarea value={content.hero.leadText} onChange={e => updateContent('hero', { leadText: e.target.value })} className="mt-1" rows={3} />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Autor</Label>
              <Input value={content.hero.byline} onChange={e => updateContent('hero', { byline: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Texto do Bot\u00E3o CTA</Label>
              <Input value={content.hero.ctaText} onChange={e => updateContent('hero', { ctaText: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Link do CTA</Label>
              <Input value={content.hero.ctaLink || ""} onChange={e => updateContent('hero', { ctaLink: e.target.value })} className="mt-1" placeholder="https://..." />
            </div>
            <ImageUploadField
              label="Imagem Principal"
              value={content.hero.mainImageUrl}
              onChange={(url) => updateContent('hero', { mainImageUrl: url })}
            />
          </div>
        );

      case "symptoms":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">T\u00EDtulo da Se\u00E7\u00E3o</Label>
              <Input value={content.symptoms.sectionTitle} onChange={e => updateContent('symptoms', { sectionTitle: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Texto Introdut\u00F3rio</Label>
              <Textarea value={content.symptoms.introText} onChange={e => updateContent('symptoms', { introText: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Introdu\u00E7\u00E3o dos Sintomas</Label>
              <Input value={content.symptoms.symptomIntro} onChange={e => updateContent('symptoms', { symptomIntro: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">Lista de Sintomas</Label>
              {content.symptoms.symptoms.map((item, index) => (
                <div key={index} className="flex gap-1.5 mb-1.5">
                  <Input value={item} onChange={e => handleSimpleArrayUpdate('symptoms', 'symptoms', index, e.target.value)} className="text-sm" />
                  <Button variant="ghost" size="icon" className="shrink-0 h-9 w-9 text-destructive hover:text-destructive" onClick={() => removeArrayItem('symptoms', 'symptoms', index)}><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full mt-1" onClick={() => addArrayItem('symptoms', 'symptoms', 'Novo sintoma')}><Plus className="w-3.5 h-3.5 mr-1.5" /> Adicionar</Button>
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Texto Destaque</Label>
              <Textarea value={content.symptoms.highlightText} onChange={e => updateContent('symptoms', { highlightText: e.target.value })} className="mt-1" />
            </div>
          </div>
        );

      case "epidemic":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">T\u00EDtulo</Label>
              <Input value={content.epidemic.title} onChange={e => updateContent('epidemic', { title: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Par\u00E1grafo</Label>
              <Textarea value={content.epidemic.paragraph} onChange={e => updateContent('epidemic', { paragraph: e.target.value })} className="mt-1" rows={3} />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Texto Destaque (Negrito)</Label>
              <Input value={content.epidemic.highlightStrong} onChange={e => updateContent('epidemic', { highlightStrong: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Texto Destaque</Label>
              <Textarea value={content.epidemic.highlightText} onChange={e => updateContent('epidemic', { highlightText: e.target.value })} className="mt-1" rows={3} />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Intro do CTA</Label>
              <Textarea value={content.epidemic.ctaIntro} onChange={e => updateContent('epidemic', { ctaIntro: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Texto do CTA</Label>
              <Input value={content.epidemic.ctaText} onChange={e => updateContent('epidemic', { ctaText: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Link do CTA</Label>
              <Input value={content.epidemic.ctaLink || ""} onChange={e => updateContent('epidemic', { ctaLink: e.target.value })} className="mt-1" placeholder="https://..." />
            </div>
          </div>
        );

      case "testimonial":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">T\u00EDtulo da Se\u00E7\u00E3o</Label>
              <Input value={content.testimonial.sectionTitle} onChange={e => updateContent('testimonial', { sectionTitle: e.target.value })} className="mt-1" />
            </div>
            <ImageUploadField
              label="📷 Imagem do Depoimento"
              value={content.images.testimonialImageUrl}
              onChange={(url) => updateContent('images', { testimonialImageUrl: url })}
            />
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Cita\u00E7\u00E3o</Label>
              <Textarea value={content.testimonial.quote} onChange={e => updateContent('testimonial', { quote: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Autor</Label>
              <Input value={content.testimonial.author} onChange={e => updateContent('testimonial', { author: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Detalhes</Label>
              <Input value={content.testimonial.details} onChange={e => updateContent('testimonial', { details: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Hist\u00F3ria Parte 1</Label>
              <Textarea value={content.testimonial.story1} onChange={e => updateContent('testimonial', { story1: e.target.value })} className="mt-1" rows={3} />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Hist\u00F3ria Parte 2</Label>
              <Textarea value={content.testimonial.story2} onChange={e => updateContent('testimonial', { story2: e.target.value })} className="mt-1" rows={3} />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Texto Destaque</Label>
              <Textarea value={content.testimonial.highlightText} onChange={e => updateContent('testimonial', { highlightText: e.target.value })} className="mt-1" rows={3} />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Resolu\u00E7\u00E3o</Label>
              <Textarea value={content.testimonial.resolution} onChange={e => updateContent('testimonial', { resolution: e.target.value })} className="mt-1" rows={3} />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Texto CTA</Label>
              <Input value={content.testimonial.ctaText} onChange={e => updateContent('testimonial', { ctaText: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Link CTA</Label>
              <Input value={content.testimonial.ctaLink || ""} onChange={e => updateContent('testimonial', { ctaLink: e.target.value })} className="mt-1" placeholder="https://..." />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Subtexto CTA</Label>
              <Input value={content.testimonial.ctaSubtext} onChange={e => updateContent('testimonial', { ctaSubtext: e.target.value })} className="mt-1" />
            </div>
          </div>
        );

      case "fbTestimonials":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">T\u00EDtulo da Se\u00E7\u00E3o</Label>
              <Input value={content.facebookTestimonials?.sectionTitle || ""} onChange={e => updateContent('facebookTestimonials', { sectionTitle: e.target.value })} className="mt-1" />
            </div>
            <div className="space-y-3">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block">Depoimentos</Label>
              {content.facebookTestimonials?.testimonials?.map((testimonial, index) => (
                <div key={testimonial.id} className="rounded-lg border bg-card p-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-muted-foreground">#{index + 1}</span>
                    <Button variant="ghost" size="sm" className="h-7 text-destructive hover:text-destructive" onClick={() => {
                      const newTestimonials = content.facebookTestimonials.testimonials.filter((_, i) => i !== index);
                      updateContent('facebookTestimonials', { testimonials: newTestimonials });
                    }}><Trash2 className="w-3.5 h-3.5" /></Button>
                  </div>
                  <Input placeholder="Nome" value={testimonial.name} className="text-sm" onChange={e => {
                    const t = [...content.facebookTestimonials.testimonials];
                    t[index] = { ...testimonial, name: e.target.value };
                    updateContent('facebookTestimonials', { testimonials: t });
                  }} />
                  <Input placeholder="Data" value={testimonial.date} className="text-sm" onChange={e => {
                    const t = [...content.facebookTestimonials.testimonials];
                    t[index] = { ...testimonial, date: e.target.value };
                    updateContent('facebookTestimonials', { testimonials: t });
                  }} />
                  <ImageUploadField
                    label="Foto do Perfil"
                    value={testimonial.imageUrl}
                    onChange={(url) => {
                      const t = [...content.facebookTestimonials.testimonials];
                      t[index] = { ...testimonial, imageUrl: url };
                      updateContent('facebookTestimonials', { testimonials: t });
                    }}
                  />
                  <Textarea placeholder="Texto" value={testimonial.text} className="text-sm" rows={2} onChange={e => {
                    const t = [...content.facebookTestimonials.testimonials];
                    t[index] = { ...testimonial, text: e.target.value };
                    updateContent('facebookTestimonials', { testimonials: t });
                  }} />
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Label className="text-[10px] text-muted-foreground">Likes</Label>
                      <Input type="number" value={testimonial.likes} className="text-sm" onChange={e => {
                        const t = [...content.facebookTestimonials.testimonials];
                        t[index] = { ...testimonial, likes: parseInt(e.target.value) || 0 };
                        updateContent('facebookTestimonials', { testimonials: t });
                      }} />
                    </div>
                    <div className="flex-1">
                      <Label className="text-[10px] text-muted-foreground">Coment\u00E1rios</Label>
                      <Input type="number" value={testimonial.comments} className="text-sm" onChange={e => {
                        const t = [...content.facebookTestimonials.testimonials];
                        t[index] = { ...testimonial, comments: parseInt(e.target.value) || 0 };
                        updateContent('facebookTestimonials', { testimonials: t });
                      }} />
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full" onClick={() => {
                const newTestimonial = {
                  id: Date.now().toString(),
                  name: "Nova Pessoa",
                  date: new Date().toLocaleDateString('pt-BR', { month: 'long', day: 'numeric', year: 'numeric' }),
                  text: "Escreva o depoimento aqui...",
                  imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
                  likes: 0,
                  comments: 0,
                };
                updateContent('facebookTestimonials', { testimonials: [...(content.facebookTestimonials?.testimonials || []), newTestimonial] });
              }}><Plus className="w-3.5 h-3.5 mr-1.5" /> Adicionar Depoimento</Button>
            </div>
          </div>
        );

      case "final":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">T\u00EDtulo</Label>
              <Input value={content.final.title} onChange={e => updateContent('final', { title: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Par\u00E1grafo 1</Label>
              <Textarea value={content.final.paragraph1} onChange={e => updateContent('final', { paragraph1: e.target.value })} className="mt-1" rows={3} />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Par\u00E1grafo 2</Label>
              <Textarea value={content.final.paragraph2} onChange={e => updateContent('final', { paragraph2: e.target.value })} className="mt-1" rows={2} />
            </div>
            <ImageUploadField
              label="📷 Imagem Secundária do Artigo"
              value={content.images.honeyCinnamonImageUrl}
              onChange={(url) => updateContent('images', { honeyCinnamonImageUrl: url })}
            />
          </div>
        );

      case "sidebar":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">T\u00EDtulo Artigos Destaque</Label>
              <Input value={content.sidebar.featuredTitle} onChange={e => updateContent('sidebar', { featuredTitle: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">Artigos em Destaque</Label>
              {content.sidebar.featuredArticles.map((item, index) => (
                <div key={index} className="rounded-lg border bg-card p-3 mb-2 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-muted-foreground">#{index + 1}</span>
                    <Button variant="ghost" size="sm" className="h-7 text-destructive" onClick={() => removeArrayItem('sidebar', 'featuredArticles', index)}><Trash2 className="w-3.5 h-3.5" /></Button>
                  </div>
                  <div>
                    <Label className="text-[10px] text-muted-foreground">T\u00EDtulo</Label>
                    <Input value={item.title} className="text-sm" onChange={e => {
                      const a = [...content.sidebar.featuredArticles];
                      a[index] = { ...item, title: e.target.value };
                      updateContent('sidebar', { featuredArticles: a });
                    }} />
                  </div>
                  <div>
                    <Label className="text-[10px] text-muted-foreground flex items-center gap-1"><LinkIcon className="w-3 h-3" /> URL</Label>
                    <Input value={item.url} className="text-sm" placeholder="https://..." onChange={e => {
                      const a = [...content.sidebar.featuredArticles];
                      a[index] = { ...item, url: e.target.value };
                      updateContent('sidebar', { featuredArticles: a });
                    }} />
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full mt-1" onClick={() => addArrayItem('sidebar', 'featuredArticles', { title: 'Novo Artigo', url: '#' })}><Plus className="w-3.5 h-3.5 mr-1.5" /> Adicionar</Button>
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">T\u00EDtulo Artigos Relacionados</Label>
              <Input value={content.sidebar.relatedTitle} onChange={e => updateContent('sidebar', { relatedTitle: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">Artigos Relacionados</Label>
              {content.sidebar.relatedArticles.map((article, index) => (
                <div key={index} className="rounded-lg border bg-card p-3 mb-2 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-muted-foreground">#{index + 1}</span>
                    <Button variant="ghost" size="sm" className="h-7 text-destructive" onClick={() => removeArrayItem('sidebar', 'relatedArticles', index)}><Trash2 className="w-3.5 h-3.5" /></Button>
                  </div>
                  <Input placeholder="T\u00EDtulo" value={article.title} className="text-sm" onChange={e => {
                    const a = [...content.sidebar.relatedArticles];
                    a[index] = { ...article, title: e.target.value };
                    updateContent('sidebar', { relatedArticles: a });
                  }} />
                  <div>
                    <Label className="text-[10px] text-muted-foreground flex items-center gap-1"><LinkIcon className="w-3 h-3" /> URL</Label>
                    <Input placeholder="https://..." value={article.url || ""} className="text-sm" onChange={e => {
                      const a = [...content.sidebar.relatedArticles];
                      a[index] = { ...article, url: e.target.value };
                      updateContent('sidebar', { relatedArticles: a });
                    }} />
                  </div>
                  <div className="flex gap-2">
                    <Input placeholder="Autor" value={article.author} className="text-sm" onChange={e => {
                      const a = [...content.sidebar.relatedArticles];
                      a[index] = { ...article, author: e.target.value };
                      updateContent('sidebar', { relatedArticles: a });
                    }} />
                    <Input placeholder="Data" value={article.date} className="text-sm" onChange={e => {
                      const a = [...content.sidebar.relatedArticles];
                      a[index] = { ...article, date: e.target.value };
                      updateContent('sidebar', { relatedArticles: a });
                    }} />
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full mt-1" onClick={() => addArrayItem('sidebar', 'relatedArticles', { title: 'Novo Artigo', author: 'Autor', date: 'Janeiro 1, 2026', url: '#' })}><Plus className="w-3.5 h-3.5 mr-1.5" /> Adicionar</Button>
            </div>

            <div className="border-t pt-4 mt-4">
              <Label className="text-xs font-bold text-foreground uppercase tracking-wider mb-3 block">Bloco Promocional</Label>
              <ImageUploadField
                label="📷 Imagem do Promo"
                value={content.images.sidebarPromoImageUrl}
                onChange={(url) => updateContent('images', { sidebarPromoImageUrl: url })}
              />
              <div>
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">T\u00EDtulo Promo</Label>
                <Input value={content.sidebar.promoTitle} onChange={e => updateContent('sidebar', { promoTitle: e.target.value })} className="mt-1" />
              </div>
              <div className="mt-3">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Texto Promo</Label>
                <Textarea value={content.sidebar.promoText} onChange={e => updateContent('sidebar', { promoText: e.target.value })} className="mt-1" />
              </div>
              <div className="mt-3">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Texto CTA Promo</Label>
                <Input value={content.sidebar.promoCtaText} onChange={e => updateContent('sidebar', { promoCtaText: e.target.value })} className="mt-1" />
              </div>
              <div className="mt-3">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Link CTA Promo</Label>
                <Input value={content.sidebar.promoCtaLink || ""} onChange={e => updateContent('sidebar', { promoCtaLink: e.target.value })} className="mt-1" placeholder="https://..." />
              </div>
            </div>
          </div>
        );

      case "footer":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Logo Title</Label>
              <Input value={content.footer.logoTitle} onChange={e => updateContent('footer', { logoTitle: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Logo Subtitle</Label>
              <Input value={content.footer.logoSubtitle} onChange={e => updateContent('footer', { logoSubtitle: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tagline</Label>
              <Input value={content.footer.tagline} onChange={e => updateContent('footer', { tagline: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">Links do Footer</Label>
              {content.footer.links.map((link, index) => (
                <div key={index} className="rounded-lg border bg-card p-3 mb-2 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-muted-foreground">#{index + 1}</span>
                    <Button variant="ghost" size="sm" className="h-7 text-destructive" onClick={() => removeArrayItem('footer', 'links', index)}><Trash2 className="w-3.5 h-3.5" /></Button>
                  </div>
                  <div>
                    <Label className="text-[10px] text-muted-foreground">Texto</Label>
                    <Input value={link.label} className="text-sm" onChange={e => {
                      const newLinks = [...content.footer.links];
                      newLinks[index] = { ...link, label: e.target.value };
                      updateContent('footer', { links: newLinks });
                    }} />
                  </div>
                  <div>
                    <Label className="text-[10px] text-muted-foreground flex items-center gap-1"><LinkIcon className="w-3 h-3" /> URL</Label>
                    <Input value={link.url} className="text-sm" placeholder="https://..." onChange={e => {
                      const newLinks = [...content.footer.links];
                      newLinks[index] = { ...link, url: e.target.value };
                      updateContent('footer', { links: newLinks });
                    }} />
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full mt-1" onClick={() => addArrayItem('footer', 'links', { label: 'Novo Link', url: '#' })}><Plus className="w-3.5 h-3.5 mr-1.5" /> Adicionar</Button>
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Copyright</Label>
              <Input value={content.footer.copyright} onChange={e => updateContent('footer', { copyright: e.target.value })} className="mt-1" />
            </div>
          </div>
        );

      case "accessControl":
        return (
          <div className="space-y-4">
            <AllowedEmailsManager />
          </div>
        );

      case "tracking":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Microsoft Clarity ID</Label>
              <p className="text-[11px] text-muted-foreground mt-1 mb-2">Cole apenas o ID do Clarity (ex: abc123xyz).</p>
              <Input
                value={content.tracking?.clarityId || ""}
                onChange={e => updateContent('tracking', { clarityId: e.target.value })}
                className="mt-1 font-mono text-xs"
                placeholder="abc123xyz"
              />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Scripts Adicionais (Head)</Label>
              <p className="text-[11px] text-muted-foreground mt-1 mb-2">Cole aqui outros scripts (ex: Google Analytics, Facebook Pixel, etc).</p>
              <Textarea
                value={content.tracking?.headScript || ""}
                onChange={e => updateContent('tracking', { headScript: e.target.value })}
                className="mt-1 font-mono text-xs"
                rows={10}
                placeholder={'<script>\n  // Seu script aqui\n</script>'}
              />
            </div>
          </div>
        );

      case "seo": {
        const {
          schema: previewSchemaObj,
          effectiveTitle, effectiveDesc, effectiveImage,
          autoTitle, autoDesc, autoAuthor, autoPublisher, autoImage,
        } = buildFullPageSchema(content);

        const previewSchema = JSON.stringify(previewSchemaObj, null, 2);

        return (
          <div className="space-y-4">
            <p className="text-[11px] text-muted-foreground">Campos em branco usam valores autom\u00E1ticos da copy.</p>

            <div className="rounded-lg border border-dashed p-3 space-y-3">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Meta Tags</h4>
              <div>
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">T\u00EDtulo (meta title)</Label>
                <Input value={content.seo?.metaTitle || ""} onChange={e => updateContent('seo', { metaTitle: e.target.value })} className="mt-1 text-sm" placeholder={autoTitle} />
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Descri\u00E7\u00E3o (meta description)</Label>
                <Textarea value={content.seo?.metaDescription || ""} onChange={e => updateContent('seo', { metaDescription: e.target.value })} className="mt-1 text-sm" rows={3} placeholder={autoDesc} />
                <p className="text-[10px] text-muted-foreground mt-1">{(content.seo?.metaDescription || autoDesc).length}/160 caracteres</p>
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">URL Can\u00F4nica</Label>
                <Input value={content.seo?.canonicalUrl || ""} onChange={e => updateContent('seo', { canonicalUrl: e.target.value })} className="mt-1 text-sm" placeholder="https://seusite.com/pagina" />
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Imagem OG / Twitter</Label>
                <Input value={content.seo?.ogImage || ""} onChange={e => updateContent('seo', { ogImage: e.target.value })} className="mt-1 text-sm" placeholder={autoImage || "https://..."} />
                {(content.seo?.ogImage || autoImage) && <img src={content.seo?.ogImage || autoImage} alt="OG Preview" className="mt-2 max-h-20 rounded border" />}
              </div>
            </div>

            <div className="rounded-lg border border-dashed p-3 space-y-3">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Schema JSON-LD</h4>
              <div>
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tipo</Label>
                <Input value={content.seo?.schemaType || ""} onChange={e => updateContent('seo', { schemaType: e.target.value })} className="mt-1 text-sm" placeholder="Article" />
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Autor</Label>
                <Input value={content.seo?.schemaAuthor || ""} onChange={e => updateContent('seo', { schemaAuthor: e.target.value })} className="mt-1 text-sm" placeholder={autoAuthor} />
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Publicador</Label>
                <Input value={content.seo?.schemaPublisher || ""} onChange={e => updateContent('seo', { schemaPublisher: e.target.value })} className="mt-1 text-sm" placeholder={autoPublisher} />
              </div>
            </div>

            <div className="rounded-lg border bg-muted/30 p-3">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-2">{"📋"} Preview do Schema Gerado</h4>
              <pre className="text-[10px] font-mono text-muted-foreground whitespace-pre-wrap break-all bg-background rounded p-2 border max-h-48 overflow-auto">
                {previewSchema}
              </pre>
            </div>

            <div className="rounded-lg border bg-muted/30 p-3">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-2">{"📋"} Preview das Meta Tags</h4>
              <div className="text-[10px] font-mono text-muted-foreground space-y-1 bg-background rounded p-2 border">
                <p>&lt;title&gt;{effectiveTitle}&lt;/title&gt;</p>
                <p>&lt;meta name="description" content="{effectiveDesc}"&gt;</p>
                <p>&lt;link rel="canonical" href="{content.seo?.canonicalUrl || ''}"&gt;</p>
                <p>&lt;meta property="og:title" content="{effectiveTitle}"&gt;</p>
                <p>&lt;meta property="og:description" content="{effectiveDesc}"&gt;</p>
                <p>&lt;meta property="og:image" content="{effectiveImage}"&gt;</p>
              </div>
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b bg-card/50 px-2 py-2">
        <ScrollArea className="w-full">
          <div className="flex flex-wrap gap-1">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "flex items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
                    activeSection === section.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {section.label}
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="pb-8">
          {renderSection()}
        </div>
      </ScrollArea>
    </div>
  );
};

export default AdminEditorSidebar;
