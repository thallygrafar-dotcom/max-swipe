import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const legalContent: Record<string, { title: string; body: string }> = {
  termos: {
    title: 'Termos de Uso',
    body: `Ao utilizar a plataforma MAX, você concorda com os seguintes termos e condições:

1. ACEITAÇÃO DOS TERMOS
Ao acessar e utilizar este serviço, você aceita e concorda em cumprir os termos e condições aqui estabelecidos.

2. USO DO SERVIÇO
O serviço MAX é fornecido "como está". Você concorda em utilizá-lo apenas para fins lícitos e de acordo com todas as leis aplicáveis.

3. CONTA DO USUÁRIO
Você é responsável por manter a confidencialidade de sua conta e senha. Todas as atividades realizadas sob sua conta são de sua responsabilidade.

4. PROPRIEDADE INTELECTUAL
Todo o conteúdo, funcionalidades e tecnologia disponíveis na plataforma são de propriedade exclusiva do MAX e protegidos por leis de direitos autorais.

5. LIMITAÇÃO DE RESPONSABILIDADE
O MAX não será responsável por quaisquer danos indiretos, incidentais, especiais ou consequenciais resultantes do uso ou da incapacidade de uso do serviço.

6. MODIFICAÇÕES
Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entram em vigor imediatamente após a publicação.

7. RESCISÃO
Podemos encerrar ou suspender sua conta a qualquer momento, sem aviso prévio, por qualquer motivo.

8. CONTATO
Para dúvidas sobre estes termos, entre em contato através dos canais disponíveis na plataforma.`,
  },
  privacidade: {
    title: 'Política de Privacidade',
    body: `A sua privacidade é importante para nós. Esta política descreve como coletamos, usamos e protegemos suas informações.

1. COLETA DE INFORMAÇÕES
Coletamos informações que você nos fornece diretamente, como nome, e-mail e dados de uso da plataforma.

2. USO DAS INFORMAÇÕES
Utilizamos suas informações para:
- Fornecer e manter nossos serviços
- Melhorar a experiência do usuário
- Enviar comunicações relevantes
- Garantir a segurança da plataforma

3. COMPARTILHAMENTO
Não vendemos ou compartilhamos suas informações pessoais com terceiros, exceto quando necessário para a prestação do serviço ou exigido por lei.

4. SEGURANÇA
Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações contra acesso não autorizado.

5. COOKIES
Utilizamos cookies para melhorar sua experiência. Você pode gerenciar suas preferências de cookies nas configurações do navegador.

6. SEUS DIREITOS
Você tem o direito de acessar, corrigir ou excluir suas informações pessoais a qualquer momento.

7. ALTERAÇÕES
Esta política pode ser atualizada periodicamente. Notificaremos sobre mudanças significativas.`,
  },
  cookies: {
    title: 'Política de Cookies',
    body: `Esta política explica como utilizamos cookies e tecnologias semelhantes.

1. O QUE SÃO COOKIES
Cookies são pequenos arquivos de texto armazenados no seu dispositivo quando você visita nosso site.

2. TIPOS DE COOKIES UTILIZADOS

Cookies Essenciais: Necessários para o funcionamento básico da plataforma, como autenticação e segurança.

Cookies de Desempenho: Coletam informações sobre como você utiliza a plataforma para melhorias.

Cookies de Funcionalidade: Permitem que a plataforma lembre suas preferências.

3. GERENCIAMENTO
Você pode controlar e gerenciar cookies através das configurações do seu navegador. A desativação de alguns cookies pode afetar a funcionalidade da plataforma.

4. CONSENTIMENTO
Ao continuar utilizando nossa plataforma, você consente com o uso de cookies conforme descrito nesta política.

5. ATUALIZAÇÕES
Esta política pode ser atualizada periodicamente para refletir mudanças nas práticas de cookies.`,
  },
};

const GlobalFooter = () => {
  const [openModal, setOpenModal] = useState<string | null>(null);
  const current = openModal ? legalContent[openModal] : null;

  return (
    <>
      <footer className="border-t border-border bg-background py-4 px-4 sm:px-6 shrink-0">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>© MAX - Todos os direitos reservados</span>
          <div className="flex items-center gap-4">
            {[
              { key: 'termos', label: 'Termos de Uso' },
              { key: 'privacidade', label: 'Política de Privacidade' },
              { key: 'cookies', label: 'Política de Cookies' },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setOpenModal(item.key)}
                className="hover:text-foreground transition-colors underline-offset-2 hover:underline"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </footer>

      <Dialog open={!!openModal} onOpenChange={() => setOpenModal(null)}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{current?.title}</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
            {current?.body}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GlobalFooter;
