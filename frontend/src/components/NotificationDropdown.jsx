import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  CheckCheck,
  Trash2,
  ExternalLink,
  X,
  FileText
} from 'lucide-react';

const DEFAULT_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Verification Report Completed',
    message: 'Report RPT-025 for Apex Weighing ABC-500 has completed full compliance evaluation with PASS verdict.',
    type: 'success',
    reportId: 'RPT-025',
    timestamp: '15 minutes ago',
    read: false
  },
  {
    id: 'notif-2',
    title: 'Reviewer Sign-off Requested',
    message: 'Report RPT-022 (Electronic Analytical Balance) is awaiting final administrative signature.',
    type: 'warning',
    reportId: 'RPT-022',
    timestamp: '1 hour ago',
    read: false
  },
  {
    id: 'notif-3',
    title: 'Tolerance Breach Warning',
    message: 'Report RPT-008 failed Eccentricity Test — maximum recorded error exceeded Class III MPE limits.',
    type: 'danger',
    reportId: 'RPT-008',
    timestamp: '3 hours ago',
    read: false
  },
  {
    id: 'notif-4',
    title: 'Annual Working Standards Due',
    message: 'RRSL Reference Standard Mass Set (Class E2/F1, 1mg-20kg) recalibration is due in 7 days.',
    type: 'info',
    timestamp: 'Yesterday',
    read: true
  },
  {
    id: 'notif-5',
    title: 'Regulatory Reference Updated',
    message: 'Updated legal reference clauses for Legal Metrology (General) Rules 2011 Sixth Schedule.',
    type: 'info',
    timestamp: '2 days ago',
    read: true
  }
];

export default function NotificationDropdown({ onViewReport }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('nawi_notifications');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading notifications', e);
    }
    return DEFAULT_NOTIFICATIONS;
  });
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'UNREAD'
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Save to localStorage whenever notifications change
  useEffect(() => {
    try {
      localStorage.setItem('nawi_notifications', JSON.stringify(notifications));
    } catch (e) {
      console.error('Error saving notifications', e);
    }
  }, [notifications]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const deleteNotification = (id, e) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const resetToDefault = () => {
    setNotifications(DEFAULT_NOTIFICATIONS);
  };

  const handleNotificationClick = (notif) => {
    markAsRead(notif.id);
    setIsOpen(false);
    if (notif.reportId) {
      navigate(`/report-repository?search=${notif.reportId}`);
    } else {
      navigate('/regulatory-references');
    }
  };

  const displayedNotifications = activeTab === 'UNREAD'
    ? notifications.filter(n => !n.read)
    : notifications;

  const renderIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={16} className="text-emerald-600" />;
      case 'warning':
        return <AlertTriangle size={16} className="text-amber-500" />;
      case 'danger':
        return <XCircle size={16} className="text-rose-600" />;
      case 'info':
      default:
        return <Info size={16} className="text-blue-600" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-full transition-colors ${
          isOpen
            ? 'bg-blue-50 text-blue-700'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
        }`}
        title={`Notifications (${unreadCount} unread)`}
        aria-label="Notifications"
        aria-expanded={isOpen}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600 ring-2 ring-white"></span>
          </span>
        )}
      </button>

      {/* Notifications Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell size={18} className="text-blue-400" />
              <h3 className="text-sm font-bold m-0 tracking-tight text-white">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-[11px] font-bold bg-red-500 text-white rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="text-xs text-blue-200 hover:text-white flex items-center gap-1 font-medium transition-colors"
                  title="Mark all as read"
                >
                  <CheckCheck size={14} />
                  <span>Mark all read</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded transition-colors"
                title="Close"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-200 text-xs">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('ALL')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                  activeTab === 'ALL'
                    ? 'bg-white text-blue-700 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('UNREAD')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                  activeTab === 'UNREAD'
                    ? 'bg-white text-blue-700 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Unread ({unreadCount})
              </button>
            </div>

            {notifications.length > 0 ? (
              <button
                type="button"
                onClick={clearAll}
                className="text-slate-400 hover:text-rose-600 text-[11px] font-medium flex items-center gap-1 transition-colors"
                title="Clear all"
              >
                <Trash2 size={12} />
                <span>Clear</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={resetToDefault}
                className="text-blue-600 hover:underline text-[11px] font-semibold"
              >
                Reset sample notifications
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
            {displayedNotifications.length === 0 ? (
              <div className="py-12 px-6 text-center text-slate-400">
                <Bell size={32} className="mx-auto text-slate-300 mb-2 opacity-50" />
                <p className="text-xs font-semibold text-slate-600 m-0">No notifications</p>
                <p className="text-[11px] text-slate-400 m-0 mt-1">
                  {activeTab === 'UNREAD' ? 'You have read all your notifications' : 'Your notification log is clear'}
                </p>
                {notifications.length === 0 && (
                  <button
                    onClick={resetToDefault}
                    className="mt-3 text-xs font-semibold text-blue-600 hover:underline"
                  >
                    Restore sample alerts
                  </button>
                )}
              </div>
            ) : (
              displayedNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex items-start gap-3 relative group ${
                    !notif.read ? 'bg-blue-50/40' : 'bg-white'
                  }`}
                >
                  <div className="mt-0.5 p-1.5 rounded-full bg-slate-100 flex-shrink-0">
                    {renderIcon(notif.type)}
                  </div>

                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900 m-0 truncate">
                        {notif.title}
                      </h4>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0"></span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 m-0 mt-0.5 leading-relaxed">
                      {notif.message}
                    </p>

                    <div className="flex items-center gap-2.5 mt-2">
                      <span className="text-[10px] text-slate-400 font-medium">
                        {notif.timestamp}
                      </span>
                      {notif.reportId && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 flex items-center gap-1">
                          <FileText size={10} />
                          {notif.reportId}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Delete Item Button */}
                  <button
                    type="button"
                    onClick={(e) => deleteNotification(notif.id, e)}
                    className="absolute right-2.5 top-3 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                    title="Dismiss notification"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                navigate('/report-repository');
              }}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center justify-center gap-1 w-full"
            >
              <span>View All Reports & Laboratory Logs</span>
              <ExternalLink size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
