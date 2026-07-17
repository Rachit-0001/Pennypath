import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

/**
 * Shared shell for all authenticated pages: sidebar navigation + top navbar.
 * Renders the active page via <Outlet /> from react-router.
 */
const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
