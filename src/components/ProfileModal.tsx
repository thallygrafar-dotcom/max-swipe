import { useEffect } from 'react';
import { X, User, Lock, Crown, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
  user: any;
  plan: string;
}

const ProfileModal = ({ open, onClose, user, plan }: ProfileModalProps) => {
  if (!open) return null;

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'Usuário';

  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleSendResetPassword = async () => {
    if (!user?.email) {
      alert('E-mail do usuário não encontrado.');
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      alert('Erro ao enviar e-mail de redefinição.');
      console.error(error);
      return;
    }

    alert('Enviamos o e-mail de redefinição de senha.');
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-[720px] rounded-[28px] border border-white/10 bg-[#050816] shadow-[0_40px_120px_rgba(0,0,0,0.8)]">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <p className="text-[20px] font-semibold text-white">Meu Perfil</p>
            <p className="text-sm text-zinc-400">
              Gerencie suas informações pessoais
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 transition hover:bg-white/10"
          >
            <X size={20} className="text-zinc-300" />
          </button>
        </div>

        <div className="max-h-[80vh] overflow-y-auto p-6 space-y-6 custom-scroll">
          {/* AVATAR */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#ff3b1f] text-xl font-bold text-white">
              {initials}
            </div>

            <button className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10">
              <Upload size={16} />
              Alterar foto
            </button>

            <p className="text-xs text-zinc-500">
              Imagem otimizada automaticamente para 200×200px
            </p>
          </div>

          {/* PLANO */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ff4b4b]/10 text-[#ff4b4b]">
                <Crown size={18} />
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-zinc-500">
                  Plano atual
                </p>
                <p className="text-lg font-semibold text-white">{plan}</p>
              </div>
            </div>
          </div>

          {/* INFO */}
          <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="flex items-center gap-2 font-semibold text-white">
              <User size={18} />
              Informações Pessoais
            </p>

            <div className="space-y-3">
              <input
                value={displayName}
                disabled
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
              />

              <input
                value={user?.email || ''}
                disabled
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white opacity-70 outline-none"
              />
            </div>
          </div>

          {/* SENHA */}
          <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="flex items-center gap-2 font-semibold text-white">
              <Lock size={18} />
              Alterar Senha
            </p>

            <p className="text-sm leading-6 text-zinc-400">
              Para sua segurança, enviaremos um e-mail de redefinição para sua conta.
            </p>

            <button
              type="button"
              onClick={handleSendResetPassword}
              className="mt-2 w-full rounded-xl bg-[#ff3b1f] py-3 font-semibold text-white shadow-[0_0_20px_rgba(255,59,31,0.25)] transition-all duration-200 hover:shadow-[0_0_30px_rgba(255,59,31,0.35)]"
            >
              Receber e-mail de redefinição
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;