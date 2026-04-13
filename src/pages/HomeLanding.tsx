import React, { memo, useMemo, useState } from "react";
import { User } from "lucide-react";
import { motion } from "framer-motion";
import RadarMaxWidget from "@/components/RadarMaxWidget";
import {
  ArrowUpRight,
  BadgeDollarSign,
  Check,
  CirclePlay,
  Crown,
  Play,
  ShieldCheck,
  Sparkles,
  Wand2,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";


const MOTION_GPU_STYLE: React.CSSProperties = {
  willChange: "transform, opacity",
  transform: "translate3d(0,0,0)",
  backfaceVisibility: "hidden",
  WebkitBackfaceVisibility: "hidden",
  perspective: 1000,
};

const TRANSFORM_GPU_STYLE: React.CSSProperties = {
  willChange: "transform",
  transform: "translate3d(0,0,0)",
  backfaceVisibility: "hidden",
  WebkitBackfaceVisibility: "hidden",
};

const PAINT_CONTAIN_STYLE: React.CSSProperties = {
  contain: "layout paint style",
};

const fakeCards = [
  {
    title: "Reverse Nerve Damage Fast",
    niche: "Neuropatia",
    product: "Nerve Recovery",
    status: "Escalando",
    style: "Black",
    format: "VSL",
    image:
      "https://ppbcrkvuxbfqapseocvp.supabase.co/storage/v1/object/public/swipe-thumbnails/1775164533782-35.jpg",
  },
  {
    title: "Fix Your Eyes in 3 Minutes a Day",
    niche: "Visão",
    product: "Visium Max",
    status: "Escalando",
    style: "Black",
    format: "VSL",
    image:
      "https://ppbcrkvuxbfqapseocvp.supabase.co/storage/v1/object/public/swipe-thumbnails/1775163875200-34.jpg",
  },
  {
    title: "Tomate Sauce Trick",
    niche: "Próstata",
    product: "Uroflow",
    status: "Escalando",
    style: "Black",
    format: "VSL",
    image:
      "https://ppbcrkvuxbfqapseocvp.supabase.co/storage/v1/object/public/swipe-thumbnails/1775162780544-32.jpg",
  },
  {
    title: "Sciatic Pain Secret",
    niche: "Neuropatia",
    product: "SciatiEase",
    status: "Escalando",
    style: "Black",
    format: "VSL",
    image:
      "https://ppbcrkvuxbfqapseocvp.supabase.co/storage/v1/object/public/swipe-thumbnails/1775165265164-36.jpg",
  },
  {
    title: "Red Root Hack",
    niche: "Visão",
    product: "RetinaClear",
    status: "Escalando",
    style: "Black",
    format: "VSL",
    image:
      "https://ppbcrkvuxbfqapseocvp.supabase.co/storage/v1/object/public/swipe-thumbnails/1774719863851-18.jpg",
  },
];

const previewItems = [
  {
    icon: <BadgeDollarSign className="h-4 w-4" />,
    title: "VSL Escaladas",
    desc: "VSLs que já estão rodando e performando.",
  },
  {
    icon: <BadgeDollarSign className="h-4 w-4" />,
    title: "CPA diferenciado",
    desc: "Acesso exclusivo a ofertas com CPA de mais de $180 por venda.",
  },
  {
    icon: <CirclePlay className="h-4 w-4" />,
    title: "Transcrição completa",
    desc: "Transcrição de cada VSL para otimizar tempo.",
  },
  {
    icon: <Wand2 className="h-4 w-4" />,
    title: "Atualização diária",
    desc: "Novas VSLs sendo adicionadas com frequência.",
  },
  {
    icon: <Crown className="h-4 w-4" />,
    title: "Ferramentas Premium",
    desc: "Ferramentas exclusivas para criar páginas com mais agilidade e estratégia.",
  },
  {
    icon: <Sparkles className="h-4 w-4" />,
    title: "Estrutura Invisível",
    desc: "Estrutura de copy, ângulos explorados e clusters onde a VSL pode ser trabalhada.",
  },
];

const monthlyItems = [
  { label: "Biblioteca de VSLs escaladas", included: true },
  { label: "Atualizações frequentes", included: true },
  { label: "Transcrições completas", included: true },
  { label: "Estrutura Invisível da VSL", included: false },
  { label: "Ferramentas Premium", included: false },
  { label: "RadarPage", included: false },
  { label: "Ofertas CPA de Elite ($180+)", included: false },
  { label: "Suporte VIP", included: false },
];

const annualItems = [
  { label: "Biblioteca de VSLs escaladas", included: true },
  { label: "Atualizações frequentes", included: true },
  { label: "Transcrições completas", included: true },
  { label: "Estrutura Invisível da VSL", included: true },
  { label: "Ferramentas Premium", included: true },
  { label: "RadarPage", included: true },
  { label: "Ofertas CPA de Elite ($180+)", included: true },
  { label: "Suporte VIP", included: true },
];

const legalContent = {
  termos: {
    title: "Termos de Uso",
    body: `Ao acessar e utilizar a plataforma SwipeMAX, o usuário declara estar ciente e de acordo com os presentes Termos de Uso.

1. FINALIDADE DA PLATAFORMA
A SwipeMAX é uma plataforma de caráter educacional e informativo, voltada ao estudo, análise e organização de VSLs e vídeos encontrados publicamente na internet.

2. ORIGEM DOS MATERIAIS
Os materiais exibidos na plataforma, incluindo VSLs, vídeos, trechos, estruturas, abordagens e elementos visuais, não são de propriedade da SwipeMAX, salvo quando houver indicação expressa em sentido contrário.
Esses conteúdos são localizados em fontes públicas e disponibilizados dentro da plataforma exclusivamente para fins de estudo, referência e análise de mercado.

3. AUSÊNCIA DE AFILIAÇÃO
A SwipeMAX não possui afiliação, parceria, autorização, representação, endosso ou vínculo oficial com produtores, marcas, especialistas, celebridades, médicos, figuras públicas ou empresas eventualmente mencionados ou exibidos nos materiais analisados.

4. PROPRIEDADE INTELECTUAL
Os direitos sobre marcas, nomes, imagens, vídeos, roteiros, elementos visuais, vozes, promessas, argumentos comerciais e demais conteúdos de terceiros permanecem pertencendo aos seus respectivos titulares.
A SwipeMAX não reivindica autoria nem titularidade sobre VSLs e vídeos de terceiros apenas por organizá-los, indexá-los ou exibi-los para estudo dentro da plataforma.

5. LIMITES DE USO
O acesso à plataforma é pessoal. O usuário compromete-se a não utilizar o ambiente para fins ilícitos, para violação de direitos de terceiros, para redistribuição indevida de conteúdo, ou para qualquer uso que extrapole a finalidade educacional da SwipeMAX.

6. CONTEÚDO DE TERCEIROS
Determinados materiais podem conter declarações comerciais, promessas de resultado, alegações de performance, referências a cura, melhora de saúde, transformação física, ganho financeiro ou outros apelos sensíveis.
Tais declarações pertencem aos criadores originais dos materiais e não representam promessa, garantia, opinião, validação ou responsabilidade da SwipeMAX.

7. RESPONSABILIDADE DO USUÁRIO
Toda interpretação, aplicação, adaptação ou uso prático das informações acessadas na plataforma é de responsabilidade exclusiva do usuário.
A SwipeMAX não se responsabiliza por decisões comerciais, jurídicas, estratégicas, publicitárias ou operacionais tomadas com base nos materiais consultados.

8. LIMITAÇÃO DE RESPONSABILIDADE
Na máxima extensão permitida pela legislação aplicável, a SwipeMAX não responde por perdas, danos, prejuízos, bloqueios de conta, remoções de conteúdo, autuações, suspensões, desativações, reclamações de terceiros ou quaisquer consequências decorrentes do uso, interpretação ou reutilização dos materiais visualizados na plataforma.

9. ALTERAÇÕES
A SwipeMAX poderá atualizar estes Termos de Uso a qualquer momento, sempre que necessário para adequação operacional, contratual ou legal.

10. LEGISLAÇÃO APLICÁVEL
Estes termos devem ser interpretados em conformidade com a legislação brasileira aplicável, incluindo, quando cabível, o Marco Civil da Internet, a Lei Geral de Proteção de Dados, o Código de Defesa do Consumidor e normas relacionadas à oferta de serviços em ambiente digital.`,
  },

  privacidade: {
    title: "Política de Privacidade",
    body: `A SwipeMAX trata dados pessoais de forma compatível com a legislação brasileira aplicável, especialmente a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018).

1. DADOS COLETADOS
Podemos coletar dados como nome, e-mail, informações de acesso, dados técnicos de navegação, registros de uso da plataforma e interações realizadas dentro do ambiente.

2. FINALIDADE DO TRATAMENTO
Os dados são utilizados para autenticação, segurança, prevenção a fraudes, suporte, melhoria da experiência do usuário, organização do acesso à plataforma e funcionamento regular do serviço.

3. COMPARTILHAMENTO
A SwipeMAX não comercializa dados pessoais.
O compartilhamento poderá ocorrer apenas quando necessário à operação da plataforma, ao cumprimento de obrigação legal, à proteção de direitos, à prevenção de fraude ou mediante requisição legítima de autoridade competente.

4. ARMAZENAMENTO E SEGURANÇA
Adotamos medidas técnicas e organizacionais razoáveis para proteger os dados contra acesso não autorizado, perda, uso indevido, alteração ou divulgação indevida, observadas as limitações naturais de qualquer ambiente digital.

5. DIREITOS DO TITULAR
Nos termos da legislação aplicável, o titular poderá solicitar informações sobre tratamento de dados, correção de dados incompletos, atualização, exclusão quando cabível e outras medidas legalmente previstas.

6. RETENÇÃO
Os dados poderão ser mantidos pelo período necessário para execução do serviço, cumprimento de obrigações legais, exercício regular de direitos e auditoria de segurança.

7. BASE LEGAL
O tratamento de dados poderá ocorrer com fundamento em execução contratual, legítimo interesse, cumprimento de obrigação legal e demais hipóteses autorizadas pela legislação aplicável.`,
  },

  cookies: {
    title: "Política de Cookies",
    body: `A SwipeMAX poderá utilizar cookies e tecnologias semelhantes para garantir o funcionamento da plataforma, melhorar a navegação, entender padrões de uso e reforçar a segurança do ambiente.

1. O QUE SÃO COOKIES
Cookies são pequenos arquivos armazenados no navegador ou dispositivo do usuário para lembrar preferências, reconhecer sessões e auxiliar no desempenho do serviço.

2. COMO UTILIZAMOS
Os cookies podem ser utilizados para manter login ativo, lembrar preferências, medir desempenho, identificar falhas técnicas, reforçar segurança e compreender como a plataforma está sendo utilizada.

3. CONTROLE PELO USUÁRIO
O usuário pode, em muitos casos, bloquear ou remover cookies diretamente nas configurações do navegador. No entanto, essa escolha pode afetar o funcionamento correto de algumas áreas da plataforma.

4. CONSENTIMENTO E CONTINUIDADE DE USO
Ao continuar navegando e utilizando a SwipeMAX, o usuário reconhece e concorda com o uso de cookies e tecnologias semelhantes, nos termos desta política, ressalvadas as escolhas que puder configurar em seu navegador.`,
  },

  aviso: {
    title: "Aviso Legal",
    body: `A SwipeMAX é uma plataforma de estudo e referência, destinada à análise de VSLs e vídeos disponíveis publicamente na internet.

1. NATUREZA DO CONTEÚDO
Os materiais exibidos na plataforma têm finalidade exclusivamente educacional, analítica e informativa.
Nada do que é mostrado deve ser interpretado como aconselhamento jurídico, médico, publicitário, financeiro ou regulatório.

2. CONTEÚDO DE TERCEIROS
A SwipeMAX não cria, aprova, valida ou endossa automaticamente as alegações presentes nas VSLs e vídeos disponibilizados para análise.
Declarações sobre cura, melhora de saúde, resultados extraordinários, promessas comerciais, ganhos, performance, depoimentos, autoridade técnica ou respaldo científico pertencem aos autores originais dos respectivos materiais.

3. FIGURAS PÚBLICAS, CELEBRIDADES E ESPECIALISTAS
Alguns vídeos podem conter imagem, voz, nome, personagem, autoridade aparente ou referência a figuras públicas, especialistas, médicos, celebridades ou marcas conhecidas.
A SwipeMAX não afirma qualquer vínculo oficial com essas pessoas ou entidades, nem garante a autenticidade, autorização, legitimidade ou atualidade dessas referências.

4. AUSÊNCIA DE GARANTIA
A SwipeMAX não garante veracidade integral, licitude material, adequação regulatória, disponibilidade contínua, resultado comercial, desempenho de campanha, conformidade publicitária ou precisão técnica dos conteúdos de terceiros exibidos na plataforma.

5. USO POR CONTA E RISCO DO USUÁRIO
O usuário reconhece que qualquer utilização prática, adaptação, reprodução, interpretação estratégica ou reaproveitamento dos materiais é feita por sua conta e risco, assumindo integral responsabilidade por seus atos e decisões.

6. RESERVA DE DIREITOS
A SwipeMAX poderá remover, restringir, editar, reorganizar ou descontinuar conteúdos, acessos, funcionalidades ou referências sempre que entender necessário para proteção da plataforma, adequação operacional ou atendimento legal.`,
  },
};

type LegalKey = keyof typeof legalContent;

export default function HomeLanding() {
  const carouselItems = useMemo(() => [...fakeCards, ...fakeCards], []);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<LegalKey | null>(null);

  const openModal = (key: LegalKey) => {
    setSelected(key);
    setOpen(true);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050505] text-white">
      <style>{`
        html {
          scroll-behavior: smooth;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }

        body {
          overflow-x: hidden;
        }

        img {
          image-rendering: auto;
          -webkit-user-drag: none;
        }

        * {
          box-sizing: border-box;
          scrollbar-width: thin;
          scrollbar-color: #dc2626 #0a0a0a;
        }

        *::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }

        *::-webkit-scrollbar-track {
          background: #0a0a0a;
        }

        *::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #ef4444 0%, #b91c1c 100%);
          border-radius: 999px;
          border: 2px solid #0a0a0a;
        }

        *::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #f87171 0%, #dc2626 100%);
        }
      `}</style>

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" style={PAINT_CONTAIN_STYLE}>
        <div className="absolute inset-0 bg-[#050505]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:320px_100%] opacity-[0.10]" />
        <motion.div
          className="absolute left-1/2 top-[6%] h-[24rem] w-[24rem] -translate-x-1/2 rounded-full bg-red-600/8 blur-[140px]"
          style={MOTION_GPU_STYLE}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <header className="fixed inset-x-0 top-0 z-50">
        <div className="border-b border-white/8 bg-black/50 backdrop-blur-2xl">
          <div className="mx-auto flex h-[78px] w-full max-w-[1320px] items-center justify-between px-4 sm:px-6">
            <Link to="/" className="group flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-red-600/30 blur-xl transition duration-300 group-hover:bg-red-600/45" />
                <div
                  className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-red-400/20 bg-red-600 font-bold text-white shadow-[0_12px_28px_rgba(239,68,68,0.34)]"
                  style={TRANSFORM_GPU_STYLE}
                >
                  S
                </div>
              </div>

              <Brand className="text-[18px] font-extrabold tracking-[-0.05em] sm:text-[20px]" />
            </Link>

            <nav className="hidden items-center gap-9 text-[14px] font-medium text-zinc-300 lg:flex">
              <HeaderLink href="#beneficios">Benefícios</HeaderLink>
              <HeaderLink href="#planos">Planos</HeaderLink>
              <HeaderLink href="#bonus">Bônus</HeaderLink>
              <HeaderLink href="#garantia">Garantia</HeaderLink>
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/login"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white sm:w-auto sm:px-5"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Entrar</span>
              </Link>

              <a
                href="#planos"
                className="group relative inline-flex h-10 items-center justify-center rounded-full border border-red-500/70 bg-red-600 px-4 text-[13px] font-semibold text-white shadow-[0_8px_24px_rgba(0,0,0,0.22)] transition-colors duration-200 hover:border-[#fafafa] hover:bg-[#fafafa] hover:text-black sm:px-5 sm:text-[14px]"
              >
                <span className="absolute inset-[1px] rounded-full border border-white/10 opacity-60" />
                <span className="relative z-10 flex items-center gap-2 tracking-[-0.01em]">
                  Assinar agora
                  <span
                    className="transition-transform duration-200 ease-out group-hover:translate-x-[2px]"
                    style={TRANSFORM_GPU_STYLE}
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="h-[78px]" />

      <section className="relative pt-8 pb-6 sm:pt-14 sm:pb-10 xl:pt-16">
        
        <div className="mx-auto flex w-full max-w-[1240px] flex-col items-center justify-center px-4 text-center sm:px-6">
         

          <motion.h1
  initial={{ opacity: 0, y: 14 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.55 }}
  style={MOTION_GPU_STYLE}
  className="mx-auto max-w-[1180px] text-center font-extrabold leading-[1.05] tracking-[-0.04em]"
>
  <span className="mt-3 block text-[34px] sm:text-[48px] lg:text-[60px] xl:text-[70px] font-black bg-gradient-to-r from-[#7a0c0c] via-[#DC2626] to-[#7a0c0c] bg-clip-text text-transparent">
    Acesse as VSLs que estão mais escaladas atualmente
  </span>

  <span className="mt-4 block text-[22px] sm:text-[30px] lg:text-[38px] xl:text-[44px] text-white/60">
    organizadas em uma única plataforma
  </span>
</motion.h1>

<motion.p
  initial={{ opacity: 0, y: 14 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.1 }}
  style={MOTION_GPU_STYLE}
  className="mt-5 max-w-[680px] text-[15px] leading-[1.6] text-zinc-400 sm:text-[18px]"
>
  Cada VSL com transcrição completa e análise da estrutura de copy, mostrando como cada parte é construída para converter.
</motion.p>

<motion.div
  initial={{ opacity: 0, y: 14 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.15 }}
  className="mt-6"
>

  
  <a
    href="#planos"
    className="
      group inline-flex h-14 items-center justify-center
      rounded-full px-8 text-[16px] font-semibold text-white
      bg-gradient-to-r from-[#7a0c0c] via-[#DC2626] to-[#7a0c0c]
      shadow-[0_10px_25px_rgba(220,38,38,0.35)]
      transition-all duration-300
      hover:scale-[1.04] hover:shadow-[0_15px_35px_rgba(220,38,38,0.5)]
      active:scale-[0.98]
    "
  >
    <span className="flex items-center gap-2">
      Acessar VSLs agora
      <span className="transition-transform duration-300 group-hover:translate-x-1">
        →
      </span>
    </span>
  </a>
</motion.div>

        </div>
      </section>

      <section className="relative overflow-hidden py-6" style={PAINT_CONTAIN_STYLE}>
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#050505] to-transparent sm:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#050505] to-transparent sm:w-28" />

        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          style={MOTION_GPU_STYLE}
          className="flex w-[max-content] gap-4 px-4 sm:px-6"
        >
          {carouselItems.map((offer, index) => (
            <div
              key={`${offer.title}-${index}`}
              className="shrink-0"
              style={TRANSFORM_GPU_STYLE}
            >
              <VslCard
                title={offer.title}
                niche={offer.niche}
                product={offer.product}
                status={offer.status}
                style={offer.style}
                format={offer.format}
                image={offer.image}
              />
            </div>
          ))}
        </motion.div>
      </section>

      <section id="beneficios" className="py-8 sm:py-12 xl:py-16">
        <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-6">
          <SectionHeader
            eyebrow="Benefícios"
            title="O que você vai encontrar dentro do SwipeMAX"
            maxWidth="max-w-[980px]"
          />

          <div className="relative mx-auto mt-12 max-w-[1180px] sm:mt-14">
            <div className="absolute left-1/2 top-1/2 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/7 blur-[140px]" />

            <motion.div
              aria-hidden
              className="pointer-events-none absolute left-[6%] top-[18%] h-24 w-24 rounded-full bg-red-500/8 blur-3xl"
              style={MOTION_GPU_STYLE}
              animate={{ y: [0, -18, 0], x: [0, 10, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))] p-3 shadow-[0_24px_70px_rgba(0,0,0,0.30)] backdrop-blur-2xl sm:rounded-[36px] sm:p-4">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_35%)]" />

              <div className="relative grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {previewItems.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.45, delay: index * 0.06 }}
                    whileHover={{ y: -6 }}
                    style={MOTION_GPU_STYLE}
                    className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.025))] p-[1px] shadow-[0_10px_30px_rgba(0,0,0,0.16)] sm:rounded-[26px]"
                  >
                    <div className="relative h-full rounded-[23px] bg-black/40 p-5 backdrop-blur-xl sm:rounded-[25px]">
                      <div className="absolute inset-0 rounded-[23px] bg-[radial-gradient(circle_at_top_left,rgba(239,68,68,0.08),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.02),transparent_30%)] opacity-80 sm:rounded-[25px]" />

                      <motion.div
                        aria-hidden
                        className="absolute -left-10 top-0 h-full w-14 rotate-[12deg] bg-red-300/8 blur-xl"
                        style={MOTION_GPU_STYLE}
                        animate={{ x: ["-140%", "360%"] }}
                        transition={{
                          duration: 5,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.28,
                        }}
                      />

                      <div className="relative flex items-start gap-4">
                        <motion.div
                          whileHover={{ rotate: -6, scale: 1.06 }}
                          style={MOTION_GPU_STYLE}
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-red-500/16 bg-red-500/10 text-red-300 shadow-[0_8px_24px_rgba(239,68,68,0.12)]"
                        >
                          {item.icon}
                        </motion.div>

                        <div>
                          <h3 className="text-[18px] font-semibold tracking-[-0.03em] text-white">
                            {item.title}
                          </h3>
                          <p className="mt-2 text-[14px] leading-7 text-zinc-400">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="planos" className="py-8 sm:py-12 xl:py-16">
        <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-6">
          <SectionHeader
            eyebrow="Planos"
            title="Escolha o plano ideal para acessar o SwipeMAX"
            maxWidth="max-w-[920px]"
          />

          <div className="mx-auto mt-12 grid max-w-[1020px] gap-6 sm:mt-14 lg:grid-cols-2">
            <PlanCard
              title="Mensal"
              price="R$ 147"
              subtitle="por mês"
              items={monthlyItems}
              buttonLabel="Assinar Mensal"
            />

            <PlanCard
              title="Anual"
              price="R$ 1.497"
              subtitle="ou em até 12x"
              featured
              items={annualItems}
              buttonLabel="Assinar Anual"
            />
          </div>
        </div>
      </section>

      <section id="bonus" className="py-8 sm:py-12 xl:py-16">
        <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-6">
          <SectionHeader
            eyebrow="Bônus"
            title="Ao assinar o SwipeMAX, você desbloqueia bônus valiosos"
            maxWidth="max-w-[1200px]"
          />

          <div className="mx-auto mt-12 grid max-w-[1100px] gap-5 md:grid-cols-3">
            <BonusCard
              icon={<Crown className="h-5 w-5" />}
              title="Ferramentas Premium"
              desc="Recursos extras para aprofundar sua análise e acelerar execução."
            />
            <BonusCard
              icon={<BadgeDollarSign className="h-5 w-5" />}
              title="CPA de Elite ($180+)"
              desc="Acesso exclusivo a ofertas com maior potencial por venda."
            />
            <BonusCard
              icon={<Sparkles className="h-5 w-5" />}
              title="RadarPage"
              desc="Páginas reais que estão rodando para inspiração de estrutura e copy"
            />
          </div>
        </div>
      </section>

      <section id="garantia" className="py-8 sm:py-12 xl:py-16">
        <div className="mx-auto grid w-full max-w-[1240px] items-center gap-12 px-4 sm:px-6 lg:grid-cols-[460px_1fr]">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45 }}
            style={MOTION_GPU_STYLE}
            className="mx-auto"
          >
            <GuaranteeSeal />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45 }}
            style={MOTION_GPU_STYLE}
            className="max-w-[720px] text-center lg:text-left"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-red-300">
              Garantia
            </p>

            <h2 className="mt-5 text-[34px] font-extrabold leading-[0.94] tracking-[-0.06em] text-white sm:text-[52px] xl:text-[72px]">
              Risco Zero.
              <br />
              Garantia de 7 Dias.
            </h2>

            <p className="mt-7 max-w-[760px] text-[16px] leading-8 text-zinc-400 sm:text-[17px] sm:leading-9">
              Explore todo o conteúdo sem restrições. Se em 7 dias você decidir
              que o Swipe<b>MAX</b> não é para você, devolvemos 100% do seu
              investimento. Sem perguntas, sem burocracia.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
              <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-[13px] font-semibold text-red-200">
                <ShieldCheck className="h-4 w-4" />
                Garantia incondicional
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[13px] font-semibold text-white">
                100% do valor de volta
              </div>
            </div>
          </motion.div>
        </div>
      </section>

            <footer className="border-t border-white/8 bg-black/40">
        <div className="mx-auto flex w-full max-w-[1240px] flex-col items-center justify-between gap-5 px-4 py-8 text-center sm:px-6">
          <div className="flex items-center gap-3">
            <div
              className="relative flex h-9 w-9 items-center justify-center rounded-2xl border border-red-400/20 bg-red-600 font-bold text-white shadow-[0_10px_24px_rgba(239,68,68,0.24)]"
              style={TRANSFORM_GPU_STYLE}
            >
              S
            </div>
            <Brand className="text-[18px] font-extrabold tracking-[-0.05em]" />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[14px] text-zinc-400">
            <button
              type="button"
              onClick={() => openModal("termos")}
              className="transition hover:text-white"
            >
              Termos de Uso
            </button>

            <button
              type="button"
              onClick={() => openModal("privacidade")}
              className="transition hover:text-white"
            >
              Política de Privacidade
            </button>

            <button
              type="button"
              onClick={() => openModal("cookies")}
              className="transition hover:text-white"
            >
              Cookies
            </button>

            <button
              type="button"
              onClick={() => openModal("aviso")}
              className="transition hover:text-white"
            >
              Aviso Legal
            </button>
          </div>

          <div className="text-[13px] text-zinc-500">
            © 2026 SwipeMAX. Todos os direitos reservados.
          </div>
        </div>
      </footer>
                      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="border border-white/10 bg-[#111111] text-white sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selected ? legalContent[selected].title : ""}
            </DialogTitle>
          </DialogHeader>

          <div
            className="
              max-h-[60vh]
              overflow-y-auto
              whitespace-pre-line
              pr-3
              text-sm
              leading-6
              text-white/70
              [scrollbar-width:thin]
              [scrollbar-color:#4b5563_#18181b]
              [&::-webkit-scrollbar]:w-2
              [&::-webkit-scrollbar-track]:bg-[#18181b]
              [&::-webkit-scrollbar-thumb]:rounded-full
              [&::-webkit-scrollbar-thumb]:bg-[#4b5563]
              [&::-webkit-scrollbar-thumb:hover]:bg-[#6b7280]
            "
          >
            {selected ? legalContent[selected].body : ""}
          </div>
        </DialogContent>
      </Dialog>
      <RadarMaxWidget />
    </div>
  );
}

function Brand({
  className = "",
  inline = false,
}: {
  className?: string;
  inline?: boolean;
}) {
  if (inline) {
    return (
      <span className={className}>
        Swipe<span className="text-red-500">MAX</span>
      </span>
    );
  }

  return (
    <div className={className}>
      Swipe<span className="text-red-500">MAX</span>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
  maxWidth = "max-w-[900px]",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  maxWidth?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45 }}
      style={MOTION_GPU_STYLE}
      className={`mx-auto text-center ${maxWidth}`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-red-300">
        {eyebrow}
      </p>

      <h2 className="mt-6 text-[34px] font-extrabold leading-[1.02] tracking-[-0.065em] text-white sm:text-[52px] xl:text-[72px]">
        {title}
      </h2>

    <p className="mx-auto mt-6 max-w-[760px] text-[16px] leading-8 text-zinc-400 sm:text-[17px]">
  {description}
</p>



    </motion.div>
  );
}

function HeaderLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="relative transition hover:text-white after:absolute after:bottom-[-7px] after:left-0 after:h-px after:w-0 after:bg-red-400 after:transition-all hover:after:w-full"
    >
      {children}
    </a>
  );
}

function BlurProduct({ value }: { value: string }) {
  return <span className="inline-block blur-[4px] opacity-90">{value}</span>;
}

function PlanCard({
  title,
  price,
  subtitle,
  items,
  buttonLabel,
  featured = false,
}: {
  title: string;
  price: string;
  subtitle: string;
  items: { label: string; included: boolean }[];
  buttonLabel: string;
  featured?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45 }}
      whileHover={{ y: -6 }}
      style={MOTION_GPU_STYLE}
      className="relative"
    >
      <div
        className={[
          "relative h-full overflow-hidden rounded-[28px] border p-6 shadow-[0_18px_40px_rgba(0,0,0,0.22)] transition sm:rounded-[32px] sm:p-7",
          featured
            ? "border-red-500/20 bg-[linear-gradient(180deg,rgba(120,18,18,0.42),rgba(255,255,255,0.03))]"
            : "border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.018))]",
        ].join(" ")}
        style={PAINT_CONTAIN_STYLE}
      >
        {featured && (
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.10),transparent_38%)]" />
        )}

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
          style={MOTION_GPU_STYLE}
          className="relative text-center"
        >
          <h3 className="text-[32px] font-extrabold tracking-[-0.06em] text-white sm:text-[34px]">
            {title}
          </h3>

          <div className="mt-5 flex flex-col items-center justify-center">
            <div className="text-[52px] font-extrabold leading-none tracking-[-0.08em] text-white sm:text-[62px]">
              {price}
            </div>
            <div className="mt-2 text-[15px] text-zinc-400 sm:text-[16px]">
              {subtitle}
            </div>
          </div>
        </motion.div>

        <div className="mt-7 h-px bg-white/8" />

        <div className="mt-7 space-y-4">
          {items.map((item) => (
            <div key={item.label} className="flex items-start gap-3">
              <span
                className={[
                  "mt-[2px] inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                  item.included
                    ? "border-emerald-400/30 bg-emerald-500/15 text-emerald-300"
                    : "border-red-400/20 bg-red-500/10 text-red-300",
                ].join(" ")}
              >
                {item.included ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <X className="h-3.5 w-3.5" />
                )}
              </span>

              <span
                className={[
                  "text-[15px] leading-7",
                  item.included ? "text-zinc-300" : "text-red-300/90",
                ].join(" ")}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <a
          href={
            featured
              ? "https://pay.kiwify.com.br/re3AP8o"
              : "https://pay.kiwify.com.br/JYKhhPI"
          }
          target="_blank"
          rel="noreferrer"
          className={[
            "mt-8 inline-flex h-12 w-full items-center justify-center rounded-full border text-[15px] font-semibold transition",
            featured
              ? "border-red-500/70 bg-red-600 text-white hover:border-white hover:bg-white hover:text-black"
              : "border-white/10 bg-white/[0.04] text-white hover:border-white/20 hover:bg-white/[0.08]",
          ].join(" ")}
        >
          {buttonLabel}
        </a>
      </div>
    </motion.div>
  );
}

function BonusCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45 }}
      whileHover={{ y: -6 }}
      style={MOTION_GPU_STYLE}
      className="group relative overflow-hidden rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.018))] p-6 shadow-[0_18px_40px_rgba(0,0,0,0.20)] sm:rounded-[28px]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(239,68,68,0.08),transparent_34%)] opacity-80" />
      <div className="relative">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-red-500/16 bg-red-500/10 text-red-300 shadow-[0_8px_24px_rgba(239,68,68,0.12)]"
          style={TRANSFORM_GPU_STYLE}
        >
          {icon}
        </div>
        <h3 className="mt-5 text-[24px] font-extrabold tracking-[-0.04em] text-white sm:text-[26px]">
          {title}
        </h3>
        <p className="mt-3 text-[15px] leading-7 text-zinc-400">{desc}</p>
      </div>
    </motion.div>
  );
}

function GuaranteeSeal() {
  const marks = useMemo(() => Array.from({ length: 48 }), []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6 }}
      whileHover={{ scale: 1.04 }}
      style={MOTION_GPU_STYLE}
      className="group relative flex h-[340px] w-[340px] items-center justify-center sm:h-[420px] sm:w-[420px]"
    >
      <motion.div
        className="absolute h-[300px] w-[300px] sm:h-[360px] sm:w-[360px]"
        style={MOTION_GPU_STYLE}
        animate={{ rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      >
        {marks.map((_, i) => {
          const angle = (360 / marks.length) * i;
          return (
            <div
              key={i}
              className="absolute left-1/2 top-1/2"
              style={{
                ...TRANSFORM_GPU_STYLE,
                transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-130px)`,
              }}
            >
              <div className="h-6 w-[3px] rounded-full bg-red-500 opacity-90 transition-all duration-300 group-hover:bg-red-400 sm:h-8" />
            </div>
          );
        })}
      </motion.div>

      <motion.div
        className="absolute h-[160px] w-[160px] rounded-full bg-red-600/20 blur-[60px] sm:h-[220px] sm:w-[220px]"
        style={MOTION_GPU_STYLE}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        animate={{
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={MOTION_GPU_STYLE}
        className="relative flex h-[150px] w-[150px] items-center justify-center rounded-full bg-[#0a0a0a] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)] sm:h-[190px] sm:w-[190px]"
      >
        <div className="text-[90px] font-extrabold leading-none tracking-[-0.08em] text-white sm:text-[120px]">
          7
        </div>
      </motion.div>
    </motion.div>
  );
}

const VslCard = memo(function VslCard({
  title,
  niche,
  product,
  status,
  style,
  format,
  image,
}: {
  title: string;
  niche: string;
  product: string;
  status: string;
  style: string;
  format: string;
  image: string;
}) {
  const hasImage = image && !image.startsWith("COLOCAR_IMAGEM_AQUI");

  return (
    <motion.article
      whileHover={{ y: -4 }}
      style={{
        ...MOTION_GPU_STYLE,
        ...PAINT_CONTAIN_STYLE,
      }}
      className="group relative w-[260px] overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(18,18,24,0.96)_0%,rgba(10,10,14,0.98)_100%)] shadow-[0_16px_34px_rgba(0,0,0,0.22)] sm:w-[310px] sm:rounded-[26px]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.04),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(239,68,68,0.05),transparent_22%)] opacity-70" />

      <div className="relative h-[170px] overflow-hidden sm:h-[190px]">
        {hasImage ? (
          <img
            src={image}
            alt={title}
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            draggable={false}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
            style={TRANSFORM_GPU_STYLE}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#0c0c10] text-zinc-500">
            COLOCAR IMAGEM AQUI
          </div>
        )}

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.06)_0%,rgba(0,0,0,0.18)_45%,rgba(0,0,0,0.74)_100%)]" />

        <div className="absolute left-3 top-3 rounded-full border border-emerald-400/20 bg-emerald-400/[0.10] px-2.5 py-1 text-[10px] font-semibold text-emerald-300 backdrop-blur sm:text-[11px]">
          ● {status}
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              boxShadow: [
                "0 0 0 0 rgba(239,68,68,0.20)",
                "0 0 0 12px rgba(239,68,68,0)",
                "0 0 0 0 rgba(239,68,68,0)",
              ],
            }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
            style={MOTION_GPU_STYLE}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white shadow-[0_16px_32px_rgba(239,68,68,0.30)] sm:h-14 sm:w-14"
          >
            <Play className="ml-0.5 h-4 w-4 fill-current sm:h-5 sm:w-5" />
          </motion.div>
        </div>
      </div>

      <div className="relative p-4">
        <h3 className="line-clamp-2 text-[16px] font-semibold leading-[1.12] tracking-[-0.04em] text-white sm:text-[18px]">
          {title}
        </h3>

        <p className="mt-3 text-[12px] text-zinc-400 sm:text-[13px]">
          Nicho: <span className="text-zinc-200">{niche}</span>
        </p>

        <p className="mt-1 text-[12px] text-zinc-400 sm:text-[13px]">
          Produto:{" "}
          <span className="text-zinc-200">
            <BlurProduct value={product} />
          </span>
        </p>

        <div className="mt-3 flex gap-2">
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-white/90 sm:text-[12px]">
            {style}
          </span>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-white/90 sm:text-[12px]">
            {format}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="flex h-[40px] items-center justify-center rounded-[14px] border border-red-500/30 bg-red-500/10 px-2 text-[12px] font-semibold text-white sm:h-[44px] sm:rounded-[16px] sm:px-3 sm:text-[13px]">
            Baixar VSL
          </div>

          <div className="flex h-[40px] items-center justify-center rounded-[14px] border border-red-500/30 bg-red-500/10 px-2 text-[12px] font-semibold text-white sm:h-[44px] sm:rounded-[16px] sm:px-3 sm:text-[13px]">
            Transcrição
          </div>
        </div>

        <div className="mt-2 flex h-[40px] items-center justify-center rounded-[14px] border border-white/10 bg-white/[0.03] px-3 text-[12px] font-medium text-zinc-200 sm:h-[42px] sm:rounded-[16px] sm:text-[13px]">
          Estrutura Invisível
        </div>
      </div>
    </motion.article>
  );
});