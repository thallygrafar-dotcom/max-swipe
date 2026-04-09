import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

export default function SwipeFooter() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<LegalKey | null>(null);

  const openModal = (key: LegalKey) => {
    setSelected(key);
    setOpen(true);
  };

  return (
    <>
      <footer className="w-full border-t border-white/10 bg-[#0b0b0b] px-6 py-6 text-sm text-white/70">
        <div className="mx-auto w-full max-w-[1440px] flex flex-col gap-2 px-2 md:flex-row md:items-center md:justify-between">
          <div className="text-center md:text-left">
            <p className="font-medium text-white">© 2026 SwipeMAX</p>
            <p className="text-white/50">Todos os direitos reservados.</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 md:justify-end">
            <button
              onClick={() => openModal("termos")}
              className="transition hover:text-white"
            >
              Termos de Uso
            </button>

            <button
              onClick={() => openModal("privacidade")}
              className="transition hover:text-white"
            >
              Política de Privacidade
            </button>

            <button
              onClick={() => openModal("cookies")}
              className="transition hover:text-white"
            >
              Cookies
            </button>

            <button
              onClick={() => openModal("aviso")}
              className="transition hover:text-white"
            >
              Aviso Legal
            </button>
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
    </>
  );
}