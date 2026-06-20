import React from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useLocation } from 'react-router-dom';

export const AppLayout = ({ children }) => {
  const location = useLocation();

  const getPageTitle = (path) => {
    switch (path) {
      case '/dashboard':
        return 'Sustainability Dashboard';
      case '/coach':
        return 'AI Sustainability Coach';
      case '/simulator':
        return 'Eco Impact Simulator';
      case '/achievements':
        return 'Achievements & Challenges';
      case '/profile':
        return 'Profile Settings';
      default:
        return 'EcoWise AI';
    }
  };

  const title = getPageTitle(location.pathname);

  return (
    <div className="flex min-h-screen bg-bg-primary">
      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <Navbar title={title} />

        {/* Content Wrapper */}
        <main aria-label={title} id="main-content" className="flex-1 overflow-y-auto p-8 no-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
};
export default AppLayout;
