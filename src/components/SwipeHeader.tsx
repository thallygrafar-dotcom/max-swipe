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
  email?: string | null;
  created_at?: string | null;
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

  const authEmail = user?.email ?? '';
  const trimmedEmail = authEmail.trim();
  const loweredEmail = trimmedEmail.toLowerCase();

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    trimmedEmail.split('@')[0] ||
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

    const emailName = trimmedEmail.split('@')[0] || 'US';
    return emailName.slice(0, 2).toUpperCase();
  }, [user, trimmedEmail]);

  const formattedPlan = useMemo(() => {
    if (userPlan === 'annual') return 'Plano Anual';
    if (userPlan === 'monthly') return 'Plano Mensal';
    return 'Sem plano ativo';
  }, [userPlan]);

  useEffect(() => {
    const normalizePlan = (value?: string | null): UserPlan => {
      const plan = String(value || '')
        .trim()
        .toLowerCase();

      if (plan === 'annual') return 'annual';
      if (plan === 'monthly') return 'monthly';
      return null;
    };

    const fetchUserPlan = async () => {
      if (!trimmedEmail) {
        setUserPlan(null);
        setLoadingPlan(false);
        return;
      }

      try {
        setLoadingPlan(true);

        const sb = supabase as any;
        let rows: SubscriptionRow[] = [];

        // tentativa 1: email exato
        const exactResult = await sb
          .from('swipemax_subscriptions')
          .select('email, plan_type, created_at')
          .eq('email', trimmedEmail)
          .order('created_at', { ascending: false });

        if (exactResult?.error) {
          console.error('Erro busca exata:', exactResult.error);
        }

        if (Array.isArray(exactResult?.data) && exactResult.data.length > 0) {
          rows = exactResult.data;
        }

        // tentativa 2: lowercase
        if (rows.length === 0 && loweredEmail !== trimmedEmail) {
          const lowerResult = await sb
            .from('swipemax_subscriptions')
            .select('email, plan_type, created_at')
            .eq('email', loweredEmail)
            .order('created_at', { ascending: false });

          if (lowerResult?.error) {
            console.error('Erro busca lowercase:', lowerResult.error);
          }

          if (Array.isArray(lowerResult?.data) && lowerResult.data.length > 0) {
            rows = lowerResult.data;
          }
        }

        // tentativa 3: ilike
        if (rows.length === 0) {
          const ilikeResult = await sb
            .from('swipemax_subscriptions')
            .select('email, plan_type, created_at')
            .ilike('email', loweredEmail)
            .order('created_at', { ascending: false });

          if (ilikeResult?.error) {
            console.error('Erro busca ilike:', ilikeResult.error);
          }

          if (Array.isArray(ilikeResult?.data) && ilikeResult.data.length > 0) {
            rows = ilikeResult.data;
          }
        }

        const chosenRow =
          rows.find((row) => normalizePlan(row.plan_type) !== null) ?? null;

        console.log('Auth email:', trimmedEmail);
        console.log('Rows encontradas:', rows);
        console.log('Row escolhida:', chosenRow);

        if (!chosenRow) {
          setUserPlan(null);
          return;
        }

        setUserPlan(normalizePlan(chosenRow.plan_type));
      } catch (err) {
        console.error('Erro inesperado ao buscar plano:', err);
        setUserPlan(null);
      } finally {
        setLoadingPlan(false);
      }
    };

    fetchUserPlan();
  }, [trimmedEmail, loweredEmail]);

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
    <header className="sticky top-0 z-50 h-[78px] border-b border-white/10 bg-[#050816]">
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
                className="group flex h-11 w-11 items-center justify-center rounded-[20px] border border-white/10 bg-[#0B1020] text-zinc-300 shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition-all duration-200 hover:border-white/15 hover:bg-[#11182C] hover:text-white"
              >
                <Menu
                  size={20}
                  className="transition-transform duration-200 group-hover:scale-110"
                />
              </button>
            )}

            {hamburgerMenuOpen && (
              <div className="absolute left-0 top-[calc(100%+12px)] z-[80] w-[320px] overflow-hidden rounded-[28px] border border-white/10 bg-[rgba(7,10,22,0.97)] shadow-[0_30px_90px_rgba(0,0,0,0.60)] backdrop-blur-[34px]">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,70,70,0.09),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_35%)]" />

                <div className="relative border-b border-white/10 px-5 py-4">
                  <div className="mb-1 flex items-center gap-2">
                    <Sparkles size={15} className="text-[#ff4b4b]" />
                    <p className="text-[15px] font-semibold text-white">
                      Acesso rápido
                    </p>
                  </div>
                  <p className="text-sm text-zinc-400">
                    SwipeMAX
                  </p>
                </div>

                <div className="relative p-2">
                  <button
                    type="button"
                    onClick={() => handleComingSoon('DTC Builder')}
                    className="group flex w-full items-center justify-between rounded-[22px] px-3 py-3 text-left transition-all duration-200 hover:bg-white/[0.05]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-[16px] border border-white/10 bg-white/[0.04] text-zinc-100">
                        <WalletCards size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          DTC Builder
                        </p>
                  
                      </div>
                    </div>

                   
                  </button>

                  <button
                    type="button"
                    onClick={() => handleComingSoon('VSL Builder')}
                    className="group flex w-full items-center justify-between rounded-[22px] px-3 py-3 text-left transition-all duration-200 hover:bg-white/[0.05]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-[16px] border border-white/10 bg-white/[0.04] text-zinc-100">
                        <FileText size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          VSL Builder
                        </p>
                      </div>
                    </div>

                    
                  </button>

                  <button
                    type="button"
                    onClick={() => handleComingSoon('Solicitar CPA de $180')}
                    className="group flex w-full items-center justify-between rounded-[22px] px-3 py-3 text-left transition-all duration-200 hover:bg-white/[0.05]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-[16px] border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                        <CircleDollarSign size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          Solicitar CPA de $180
                        </p>
                        
                      </div>
                    </div>

                    
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
            className="select-none text-[30px] font-black leading-none tracking-[-0.05em] sm:text-[36px]"
          >
            <span className="text-white">Swipe</span>
            <span className="text-[#ff4b4b]">MAX</span>
          </button>
        </div>

        {/* RIGHT */}
        <div className="ml-auto flex items-center gap-3">
          <div className="hidden h-11 items-center rounded-[20px] border border-red-500/20 bg-[rgba(32,10,18,0.92)] px-4 text-sm text-zinc-100 shadow-[0_0_30px_rgba(255,75,75,0.10)] backdrop-blur-[20px] md:flex">
            <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(74,222,128,0.95)]" />
            {loadingPlan ? 'Carregando plano...' : formattedPlan}
          </div>

          <div className="relative" ref={userMenuRef}>
            <button
              type="button"
              onClick={() => setUserMenuOpen((prev) => !prev)}
              className="group flex items-center justify-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ff3b1f] text-sm font-bold text-white shadow-[0_0_24px_rgba(255,59,31,0.30)] transition-all duration-200 group-hover:scale-[1.04]">
                {initials}
              </div>
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 top-[calc(100%+12px)] z-[80] w-[300px] overflow-hidden rounded-[28px] border border-white/10 bg-[rgba(7,10,22,0.98)] shadow-[0_30px_90px_rgba(0,0,0,0.62)] backdrop-blur-[38px]">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,70,70,0.10),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.10),transparent_34%)]" />

                <div className="relative border-b border-white/10 px-5 py-5">
                  <p className="truncate text-[16px] font-semibold text-white">
                    {displayName}
                  </p>
                  <p className="truncate text-sm text-zinc-400">{trimmedEmail}</p>
                </div>

                <div className="relative border-b border-white/10 px-5 py-4">
                  <div className="flex items-center gap-3 rounded-[22px] border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-4 backdrop-blur-[18px]">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-[rgba(255,75,75,0.12)] text-[#ff4b4b]">
                      <Crown size={20} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">
                        Seu plano
                      </p>
                      <p className="truncate text-[17px] font-semibold text-white">
                        {loadingPlan ? 'Carregando...' : formattedPlan}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative p-2">
                  <button
                    type="button"
                    onClick={handleProfileClick}
                    className="flex w-full items-center justify-between rounded-[22px] px-4 py-4 text-left text-white transition-all duration-200 hover:bg-white/[0.05]"
                  >
                    <div className="flex items-center gap-3">
                      <User size={20} />
                      <span className="text-[16px]">Perfil</span>
                    </div>

                    
                  </button>
                </div>

                <div className="relative border-t border-white/10 p-2">
                  <button
                    type="button"
                    onClick={signOut}
                    className="flex w-full items-center gap-3 rounded-[22px] px-4 py-4 text-left text-white transition-all duration-200 hover:bg-red-500/10 hover:text-red-400"
                  >
                    <LogOut size={20} />
                    <span className="text-[16px]">Sair</span>
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