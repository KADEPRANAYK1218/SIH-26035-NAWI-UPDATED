import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Settings as SettingsIcon,
  User,
  Lock,
  Bell,
  FileText,
  Info,
  ShieldCheck,
  Check
} from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();
  const [savedNotice, setSavedNotice] = useState('');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Preferences
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [autoCalculate, setAutoCalculate] = useState(true);
  const [defaultUnit, setDefaultUnit] = useState('kg');

  const handleSavePreferences = (e) => {
    e.preventDefault();
    setSavedNotice('Preferences saved successfully.');
    setTimeout(() => setSavedNotice(''), 3000);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('New password and confirm password do not match.');
      return;
    }
    setSavedNotice('Password changed successfully.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setSavedNotice(''), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight m-0">
          System Settings & Laboratory Preferences
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1 m-0">
          Officer profile, verification preferences, rule baseline, and prototype system metadata
        </p>
      </div>

      {savedNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <Check size={16} />
          <span>{savedNotice}</span>
        </div>
      )}

      {/* 1. Officer Profile */}
      <div className="form-card">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <User size={16} className="text-blue-600" />
          <span>Officer Profile Details</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block mb-1">Full Name</span>
            <input
              type="text"
              readOnly
              value={user?.name || ''}
              className="form-input bg-slate-50 font-semibold"
            />
          </div>

          <div>
            <span className="text-slate-400 block mb-1">Email Address</span>
            <input
              type="email"
              readOnly
              value={user?.email || ''}
              className="form-input bg-slate-50 font-mono"
            />
          </div>

          <div>
            <span className="text-slate-400 block mb-1">Designated Role</span>
            <input
              type="text"
              readOnly
              value={user?.role || ''}
              className="form-input bg-slate-50 font-semibold text-blue-800"
            />
          </div>

          <div>
            <span className="text-slate-400 block mb-1">Department / Station</span>
            <input
              type="text"
              readOnly
              value={user?.department || 'Directorate of Legal Metrology'}
              className="form-input bg-slate-50"
            />
          </div>
        </div>
      </div>

      {/* 2. Change Password */}
      <div className="form-card">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Lock size={16} className="text-blue-600" />
          <span>Change Password</span>
        </h3>

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          <div>
            <label className="form-label">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="form-input"
              placeholder="Enter current password"
            />
          </div>

          <div>
            <label className="form-label">New Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="form-input"
              placeholder="At least 6 characters"
            />
          </div>

          <div>
            <label className="form-label">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-input"
              placeholder="Confirm new password"
            />
          </div>

          <button type="submit" className="btn-primary py-2 px-4 text-xs">
            Update Password
          </button>
        </form>
      </div>

      {/* 3. Report & Notification Preferences */}
      <div className="form-card">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <FileText size={16} className="text-blue-600" />
          <span>Report & Calculation Preferences</span>
        </h3>

        <form onSubmit={handleSavePreferences} className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="autoCalc"
              checked={autoCalculate}
              onChange={(e) => setAutoCalculate(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <label htmlFor="autoCalc" className="text-xs text-slate-800 font-medium cursor-pointer">
              Enable real-time automatic error calculations on observation keystroke
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="emailNotif"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <label htmlFor="emailNotif" className="text-xs text-slate-800 font-medium cursor-pointer">
              Send reviewer notification when new test report is submitted for approval
            </label>
          </div>

          <div className="max-w-xs">
            <label className="form-label">Default Metrology Mass Unit</label>
            <select
              value={defaultUnit}
              onChange={(e) => setDefaultUnit(e.target.value)}
              className="form-select text-xs"
            >
              <option value="kg">Kilogram (kg)</option>
              <option value="g">Gram (g)</option>
              <option value="t">Tonne / Ton (t)</option>
            </select>
          </div>

          <button type="submit" className="btn-primary py-2 px-4 text-xs">
            Save Preferences
          </button>
        </form>
      </div>

      {/* 4. Application Metadata & Rule Version */}
      <div className="form-card bg-slate-50 border-slate-300">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Info size={16} className="text-blue-600" />
          <span>Application Information & Regulatory Baseline</span>
        </h3>

        <div className="space-y-2 text-xs text-slate-700">
          <div className="flex justify-between py-1 border-b border-slate-200">
            <span className="font-semibold text-slate-500">Application Title:</span>
            <span className="font-bold text-slate-900">NAWI Test Report System</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200">
            <span className="font-semibold text-slate-500">Application Classification:</span>
            <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Prototype / Demonstration
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200">
            <span className="font-semibold text-slate-500">System Software Version:</span>
            <span className="font-mono font-bold text-slate-900">v1.0.0 (Release 2026)</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200">
            <span className="font-semibold text-slate-500">International Reference Standard:</span>
            <span className="font-bold text-blue-900">OIML Recommendation R 76-1: 2006 (E)</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200">
            <span className="font-semibold text-slate-500">Indian Statutory Baseline:</span>
            <span className="font-bold text-blue-900">Legal Metrology (General) Rules, 2011 (Eighth Schedule)</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="font-semibold text-slate-500">Parent Ministry:</span>
            <span className="text-slate-800">Ministry of Consumer Affairs, Food & Public Distribution, Govt. of India</span>
          </div>
        </div>
      </div>
    </div>
  );
}
