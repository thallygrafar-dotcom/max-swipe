import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import GlobalHeader from '@/components/GlobalHeader';
import GlobalFooter from '@/components/GlobalFooter';
import FloatingMenu from '@/components/FloatingMenu';

const DashboardLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      
      <GlobalHeader
        sidebarOpen={menuOpen}
        onToggleSidebar={() => setMenuOpen(!menuOpen)}
        showSidebarToggle
      />

      <FloatingMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <div className="flex flex-1">
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>

      <GlobalFooter />
    </div>
  );
};

export default DashboardLayout;