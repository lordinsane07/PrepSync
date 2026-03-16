import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/ai-room': 'AI Interview',
  '/peer-room': 'Peer Room',
  '/groups': 'Domain Groups',
  '/dms': 'Messages',
  '/history': 'Session History',
  '/settings': 'Settings',
};

export default function AppLayout() {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Auto-collapse sidebar on smaller screens
  useEffect(() => {
    function handleResize() {
      setSidebarCollapsed(window.innerWidth < 1200);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const pageTitle =
    PAGE_TITLES[location.pathname] ||
    Object.entries(PAGE_TITLES).find(([path]) =>
      location.pathname.startsWith(path),
    )?.[1] ||
    'PrepSync';

  return (
    <div className="min-h-screen bg-bg-base">
      <Sidebar
        userName="User"
        collapsed={sidebarCollapsed}
      />
      <div
        className="transition-all duration-200"
        style={{ marginLeft: sidebarCollapsed ? 64 : 240 }}
      >
        <TopBar title={pageTitle} userName="User" />
        <Outlet />
      </div>
    </div>
  );
}
