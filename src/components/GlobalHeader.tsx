import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Menu,
  User,
  LogOut,
  Crown,
  WalletCards,
  FileText,
  CircleDollarSign,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface GlobalHeaderProps {
  onToggleSidebar?: () => void;
  showSidebarToggle?: boolean;
}

type UserPlan = 'monthly' | 'annual' | null;

type SubscriptionRow = {
  plan_type?: string | null;
  status?: string | null;
};

const GlobalHeader = ({
  onToggleSidebar,
  showSidebarToggle = true,
}: GlobalHeaderProps) => {
  const { user, signOut } = useAuth();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [hamburgerMenuOpen, setHamburgerMenuOpen] = useState(false);
  const [userPlan, setUserPlan] = useState<UserPlan>(null);
  const [loadingPlan, setLoadingPlan] = useState(true);

  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const hamburgerMenuRef = useRef<HTMLDivElement | null>(null);

  const email = user?.email || '';

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    email.split('@')[0] ||
    'Usuário';

  const initials = useMemo(() => {
    const fullName =
      user?.user_metadata?.full_name ||
      user?.user_metadata?.name ||
      '';

    if (fullName.trim()) {
      const parts = fullName.trim().split(' ').filter(Boolean);

      if (parts.length === 1) {
        return parts[0].slice(0, 2).toUpperCase();
      }

      return `${parts[0]?.[0] ?? ''}${parts[1]?.[0] ?? ''}`.toUpperCase();
    }

    const emailName = email.split('@')[0] || 'US';
    return emailName.slice(0, 2).toUpperCase();
  }, [user, email]);

  const formattedPlan = useMemo(() => {
    if (userPlan === 'annual') return 'Plano Anual';
    if (userPlan === 'monthly') return 'Plano Mensal';
    return 'Sem plano ativo';
  }, [userPlan]);

  useEffect(() => {
    const fetchUserPlan = async () => {
      if (!user?.id) {
        setUserPlan(null);
        setLoadingPlan(false);
        return;
      }

      try {
        setLoadingPlan(true);

        // cast local para contornar types desatualizados do Supabase
        const sb = supabase as any;

        const { data, error }: { data: SubscriptionRow | null; error: any } =
          await sb
            .from('swipemax_subscriptions')
            .select('plan_type, status')
            .eq('user_id', user.id)
            .maybeSingle();

        if (error) {
          console.error('Erro ao buscar plano do usuário:', error);
          setUserPlan(null);
          return;
        }

        if (!data || data.status !== 'active') {
          setUserPlan(null);
          return;
        }

        const plan = data.plan_type;

        if (plan === 'annual' || plan === 'monthly') {
          setUserPlan(plan);
        } else {
          setUserPlan(null);
        }
      } catch (err) {
        console.error('Erro inesperado ao buscar plano:', err);
        setUserPlan(null);
      } finally {
        setLoadingPlan(false);
      }
    };

    fetchUserPlan();
  }, [user?.id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setUserMenuOpen(false);
      }

      if (
        hamburgerMenuRef.current &&
        !hamburgerMenuRef.current.contains(target)
      ) {
        setHamburgerMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setUserMenuOpen(false);
        setHamburgerMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleComingSoon = (label: string) => {
    alert(`${label} em breve 🚀`);
    setHamburgerMenuOpen(false);
  };

  const handleProfileClick = () => {
    alert('Perfil em breve 🚀');
    setUserMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 h-[78px] border-b border-white/10 bg-[#050816]/95 backdrop-blur-2xl">
      <div className="relative mx-auto flex h-full max-w-[1440px] items-center justify-between px-4 sm:px-6">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <div className="relative" ref={hamburgerMenuRef}>
            {showSidebarToggle && (
              <button
                type="button"
                onClick={() => {
                  setHamburgerMenuOpen((prev) => !prev);
                  onToggleSidebar?.();
                }}
                className="group flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-zinc-300 transition-all duration-200 hover:border-white/15 hover:bg-white/[0.06] hover:text-white"
              >
                <Menu
                  size={20}
                  className="transition-transform duration-200 group-hover:scale-110"
                />
              </button>
            )}

            {hamburgerMenuOpen && (
              <div className="absolute left-0 top-[calc(100%+10px)] w-[320px] overflow-hidden rounded-[22px] border border-white/10 bg-[#0A0F1D]/98 shadow-[0_20px_70px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
                <div className="border-b border-white/10 px-4 py-4">
                  <div className="mb-1 flex items-center gap-2">
                    <Sparkles size={15} className="text-primary" />
                    <p className="text-[15px] font-semibold text-white">
                      Acesso rápido
                    </p>
                  </div>
                  <p className="text-sm text-zinc-400">
                    Áreas premium em desenvolvimento
                  </p>
                </div>

                <div className="p-2">
                  <button
                    type="button"
                    onClick={() => handleComingSoon('DTC Builder')}
                    className="group flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left transition-all duration-200 hover:bg-white/[0.05]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-zinc-100 transition-all duration-200 group-hover:scale-105 group-hover:bg-white/[0.06]">
                        <WalletCards size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          DTC Builder
                        </p>
                        <p className="text-xs text-zinc-400">Em breve</p>
                      </div>
                    </div>

                    <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">
                      Soon
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleComingSoon('VSL Builder')}
                    className="group flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left transition-all duration-200 hover:bg-white/[0.05]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-zinc-100 transition-all duration-200 group-hover:scale-105 group-hover:bg-white/[0.06]">
                        <FileText size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          VSL Builder
                        </p>
                        <p className="text-xs text-zinc-400">Em breve</p>
                      </div>
                    </div>

                    <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">
                      Soon
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleComingSoon('Solicitar CPA de $180')}
                    className="group flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left transition-all duration-200 hover:bg-white/[0.05]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 transition-all duration-200 group-hover:scale-105 group-hover:bg-emerald-500/15">
                        <CircleDollarSign size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          Solicitar CPA de $180
                        </p>
                        <p className="text-xs text-zinc-400">
                          Acesso premium
                        </p>
                      </div>
                    </div>

                    <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-400">
                      VIP
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CENTER */}
        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2">
          <button
            type="button"
            className="select-none text-[30px] font-black tracking-[-0.08em] text-white transition hover:opacity-90 sm:text-[36px]"
          >
            SWIPE<span className="text-primary">MAX</span>
          </button>
        </div>

        {/* RIGHT */}
        <div className="ml-auto flex items-center gap-3">
          <div className="hidden h-11 items-center rounded-2xl border border-primary/15 bg-primary/10 px-4 text-sm text-zinc-100 shadow-[0_0_30px_rgba(59,130,246,0.10)] md:flex">
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,0.9)]" />
            {loadingPlan ? 'Carregando plano...' : formattedPlan}
          </div>

          <div className="relative" ref={userMenuRef}>
            <button
              type="button"
              onClick={() => setUserMenuOpen((prev) => !prev)}
              className="group flex items-center justify-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-sm font-bold text-white shadow-[0_0_24px_rgba(37,99,235,0.28)] transition-all duration-200 group-hover:scale-[1.04] group-hover:shadow-[0_0_30px_rgba(37,99,235,0.38)]">
                {initials}
              </div>
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 top-[calc(100%+10px)] w-[280px] overflow-hidden rounded-[22px] border border-white/10 bg-[#0A0F1D]/98 shadow-[0_20px_70px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
                <div className="border-b border-white/10 px-4 py-4">
                  <p className="truncate text-[16px] font-semibold text-white">
                    {displayName}
                  </p>
                  <p className="truncate text-sm text-zinc-400">{email}</p>
                </div>

                <div className="border-b border-white/10 px-4 py-3">
                  <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                      <Crown size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-[0.12em] text-zinc-500">
                        Seu plano
                      </p>
                      <p className="truncate text-sm font-medium text-white">
                        {loadingPlan ? 'Carregando...' : formattedPlan}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <button
                    type="button"
                    onClick={handleProfileClick}
                    className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-white transition-all duration-200 hover:bg-white/[0.05]"
                  >
                    <User size={18} />
                    Perfil
                  </button>
                </div>

                <div className="border-t border-white/10 p-2">
                  <button
                    type="button"
                    onClick={signOut}
                    className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-white transition-all duration-200 hover:bg-red-500/10 hover:text-red-400"
                  >
                    <LogOut size={18} />
                    Sair
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default GlobalHeader;