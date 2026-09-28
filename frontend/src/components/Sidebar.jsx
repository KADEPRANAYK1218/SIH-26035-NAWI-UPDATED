import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import emblemLogo from '../assets/images/india_emblem_logo.jpg';
import {
  Home,
  FilePlus,
  Folder,
  BookOpen,
  Users,
  Settings,
  LogOut
} from 'lucide-react';

export default function Sidebar() {
  const { logout, isAdmin } = useAuth();

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150 ${
      isActive
        ? 'bg-[#1976d2] text-white shadow-sm font-semibold'
        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
    }`;

  return (
    <aside className="w-64 bg-[#0b192c] text-white flex-shrink-0 flex flex-col justify-between min-h-screen p-4 select-none border-r border-slate-800/80">
      {/* Brand Header */}
      <div>
        <div className="pt-2 pb-5 text-center border-b border-slate-800/80">
          <div className="w-16 h-18 mx-auto mb-2.5 rounded-xl bg-white p-1.5 shadow-md flex items-center justify-center">
            <img
              src={emblemLogo}
              alt="State Emblem of India"
              className="w-full h-full object-contain select-none"
            />
          </div>
          <h3 className="text-xs font-semibold text-slate-200 tracking-wide m-0">
            Government of India
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5 m-0">
            Department of Consumer Affairs
          </p>
          <p className="text-[11px] text-slate-400 m-0">
            Legal Metrology
          </p>
          <div className="mt-3.5 pt-2.5 border-t border-slate-800/50">
            <h2 className="text-sm font-bold text-white tracking-wider m-0">
              NAWI Test Report System
            </h2>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="mt-6 space-y-1.5">
          <NavLink to="/dashboard" className={navItemClass}>
            <Home size={18} className="flex-shrink-0" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/create-test-report" className={navItemClass}>
            <FilePlus size={18} className="flex-shrink-0" />
            <span>Create New Test Report</span>
          </NavLink>

          <NavLink to="/report-repository" className={navItemClass}>
            <Folder size={18} className="flex-shrink-0" />
            <span>Report Repository</span>
          </NavLink>

          <NavLink to="/regulatory-references" className={navItemClass}>
            <BookOpen size={18} className="flex-shrink-0" />
            <span>Regulatory References</span>
          </NavLink>

          {isAdmin && (
            <NavLink to="/user-management" className={navItemClass}>
              <Users size={18} className="flex-shrink-0" />
              <span>User Management</span>
            </NavLink>
          )}

          <NavLink to="/settings" className={navItemClass}>
            <Settings size={18} className="flex-shrink-0" />
            <span>Settings</span>
          </NavLink>
        </nav>
      </div>

      {/* Bottom Logout */}
      <div className="pt-4 border-t border-slate-800/80">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
