import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import GlobalHeader from '@/components/GlobalHeader';
import GlobalFooter from '@/components/GlobalFooter';
import FloatingMenu from '@/components/FloatingMenu';

const AppLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <GlobalHeader
        sidebarOpen={menuOpen}
        onToggleSidebar={() => setMenuOpen((prev) => !prev)}
        showSidebarToggle
      />

      <FloatingMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <main className="flex-1 min-w-0">
        <Outlet />
      </main>

      <GlobalFooter />
    </div>
  );
};

export default AppLayout;