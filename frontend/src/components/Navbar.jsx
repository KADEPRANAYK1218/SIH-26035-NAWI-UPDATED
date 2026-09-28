import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { User, ChevronDown, LogOut } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown.jsx';
import emblemLogo from '../assets/images/india_emblem_logo.jpg';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const roleFormatted = user?.role
    ? user.role
        .toLowerCase()
        .split('_')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
    : 'Test Engineer';

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      {/* Left: Emblem & Department Info */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <img
            src={emblemLogo}
            alt="State Emblem of India"
            className="w-7 h-9 object-contain select-none"
          />
          <div className="hidden md:block">
            <span className="text-xs font-bold text-slate-800 leading-tight block">
              Directorate of Legal Metrology
            </span>
            <span className="text-[10px] text-slate-500 leading-tight block">
              Government of India
            </span>
          </div>
        </div>
      </div>

      {/* Right: Notifications & User Role Pill */}
      <div className="flex items-center gap-4">
        {/* Working Notification Bell Dropdown */}
        <NotificationDropdown />

        {/* User Role Capsule Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            type="button"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-200 bg-slate-50/80 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors shadow-2xs"
          >
            <User size={16} className="text-slate-500" />
            <span>{roleFormatted}</span>
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900 truncate m-0">
                  {user?.name || 'Laboratory User'}
                </p>
                <p className="text-[11px] text-slate-500 truncate m-0">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  logout();
                }}
                className="w-full text-left px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
              >
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
