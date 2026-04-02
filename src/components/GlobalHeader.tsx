import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  Menu,
  User,
  Settings,
  LogOut,
  BookOpen,
} from 'lucide-react';

interface GlobalHeaderProps {
  sidebarOpen?: boolean;
  onToggleSidebar?: () => void;
  showSidebarToggle?: boolean;
}

const GlobalHeader = ({
  onToggleSidebar,
  showSidebarToggle,
}: GlobalHeaderProps) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  const email = user?.email || '';

  const emailFirstName = user?.email?.split('@')[0] || 'Usuário';

  const initials =
    emailFirstName.length >= 2
      ? emailFirstName.slice(0, 2).toUpperCase()
      : emailFirstName.toUpperCase();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 h-[78px] border-b border-white/8 bg-[#0A0A0D]/95 backdrop-blur-2xl">
      <div className="relative mx-auto flex h-full max-w-[1440px] items-center justify-between px-4 sm:px-6">

        {/* LEFT */}
        <div className="flex items-center gap-3">
          {showSidebarToggle && onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.03] text-zinc-300 hover:bg-white/[0.06] hover:text-white"
            >
              <Menu size={19} />
            </button>
          )}
        </div>

        {/* CENTER */}
        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2">
          <button
            onClick={() => navigate('/swipe-max')}
            className="text-[38px] font-black tracking-[-0.09em] text-primary hover:opacity-90 sm:text-[46px]"
          >
            SWIPE
          </button>
        </div>

        {/* RIGHT */}
        <div className="ml-auto flex items-center gap-3">

          {/* USER MENU */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen((prev) => !prev)}
              className="flex items-center justify-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-base font-bold text-white">
                {initials}
              </div>
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 top-[calc(100%+8px)] w-[220px] rounded-[16px] border border-white/10 bg-[#0B0F1A] shadow-lg">

                <div className="border-b border-white/8 px-3 py-2">
                  <p className="truncate text-[13px] font-semibold text-white">
                    {emailFirstName}
                  </p>
                  <p className="text-sm text-zinc-400">{email}</p>
                </div>

                <div className="p-1">
                  <button className="flex w-full items-center gap-3 px-3 py-2 text-white hover:bg-white/[0.05]">
                    <User size={16} />
                    Perfil
                  </button>

                  <button className="flex w-full items-center gap-3 px-3 py-2 text-white hover:bg-white/[0.05]">
                    <Settings size={16} />
                    Configurações
                  </button>

                  <button className="flex w-full items-center gap-3 px-3 py-2 text-white hover:bg-white/[0.05]">
                    <BookOpen size={16} />
                    Ajuda
                  </button>
                </div>

                <div className="border-t border-white/8 p-1">
                  <button
                    onClick={signOut}
                    className="flex w-full items-center gap-3 px-3 py-2 text-white hover:bg-red-500/10 hover:text-red-400"
                  >
                    <LogOut size={16} />
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