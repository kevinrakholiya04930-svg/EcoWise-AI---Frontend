import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, MessageSquare, Sliders, Trophy, User, LogOut } from 'lucide-react';

export const Sidebar = () => {
  const { logout, user } = useAuth();

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/coach', label: 'AI Coach', icon: MessageSquare },
    { to: '/simulator', label: 'Eco Simulator', icon: Sliders },
    { to: '/achievements', label: 'Achievements', icon: Trophy },
    { to: '/profile', label: 'Profile Settings', icon: User },
  ];

  return (
    <aside className="w-64 bg-bg-surface border-r border-green-500/10 flex flex-col h-screen sticky top-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-green-500/10 flex items-center gap-3">
        <span className="text-3xl">🌿</span>
        <div>
          <h1 className="font-extrabold text-lg text-text-primary tracking-wide">EcoWise AI</h1>
          <span className="text-xs text-text-muted/60 font-semibold tracking-wider uppercase">Sustainability Companion</span>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-4 py-6 flex flex-col gap-2">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-accent-green text-bg-primary shadow-lg shadow-green-500/10'
                    : 'text-text-muted hover:bg-bg-elevated hover:text-text-primary'
                }`
              }
            >
              <Icon size={20} />
              {link.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer / User info */}
      <div className="p-4 border-t border-green-500/10 flex flex-col gap-3">
        {user && (
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-green/20 to-accent-lime/20 flex items-center justify-center font-bold text-accent-green text-xs">
              {user.name[0].toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-text-primary truncate">{user.name}</p>
              <p className="text-xs text-text-muted/60 truncate">Lvl {user.gamification?.level || 1} • {user.persona}</p>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-medium text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
};
export default Sidebar;
