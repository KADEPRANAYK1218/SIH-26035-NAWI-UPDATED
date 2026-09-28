import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import Loading from '../components/Loading.jsx';
import Modal from '../components/Modal.jsx';
import {
  Users,
  ShieldAlert,
  UserCheck,
  KeyRound,
  Ban,
  CheckCircle,
  FileSpreadsheet,
  Clock,
  UserPlus
} from 'lucide-react';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMode, setModalMode] = useState(''); // 'edit', 'password', or 'create'
  const [newRole, setNewRole] = useState('TEST_ENGINEER');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  // New user registration state
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: 'test123',
    role: 'TEST_ENGINEER',
    department: 'Regional Reference Standards Laboratory (RRSL Bangalore)'
  });

  const fetchUsersAndLogs = async () => {
    setLoading(true);
    try {
      const [uRes, logRes] = await Promise.all([
        api.get('/users'),
        api.get('/users/audit-logs')
      ]);
      if (uRes.success) setUsers(uRes.data);
      if (logRes.success) setAuditLogs(logRes.data);
    } catch (err) {
      console.error('Failed to load users or audit logs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersAndLogs();
  }, []);

  const handleEditRole = (u) => {
    setSelectedUser(u);
    setNewRole(u.role);
    setModalMode('edit');
    setMessage('');
  };

  const handleResetPassword = (u) => {
    setSelectedUser(u);
    setNewPassword('test123');
    setModalMode('password');
    setMessage('');
  };

  const handleSaveRole = async () => {
    if (!selectedUser) return;
    try {
      const res = await api.put(`/users/${selectedUser.id}`, { role: newRole });
      if (res.success) {
        setMessage('Role updated successfully.');
        setTimeout(() => {
          setModalMode('');
          fetchUsersAndLogs();
        }, 800);
      }
    } catch (err) {
      setMessage(err.message || 'Failed to update role.');
    }
  };

  const handleSavePassword = async () => {
    if (!selectedUser || !newPassword) return;
    try {
      const res = await api.post(`/users/${selectedUser.id}/reset-password`, { newPassword });
      if (res.success) {
        setMessage('Password reset successfully to: ' + newPassword);
        setTimeout(() => {
          setModalMode('');
        }, 1200);
      }
    } catch (err) {
      setMessage(err.message || 'Failed to reset password.');
    }
  };

  const handleToggleStatus = async (u) => {
    const nextStatus = u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await api.put(`/users/${u.id}`, { status: nextStatus });
      fetchUsersAndLogs();
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  const handleOpenCreateUser = () => {
    setNewUser({
      name: '',
      email: '',
      password: 'test123',
      role: 'TEST_ENGINEER',
      department: 'Regional Reference Standards Laboratory (RRSL Bangalore)'
    });
    setMessage('');
    setModalMode('create');
  };

  const handleRegisterNewUser = async (e) => {
    e.preventDefault();
    if (!newUser.name.trim() || !newUser.email.trim() || !newUser.password) {
      setMessage('Name, email, and password are required.');
      return;
    }
    try {
      const res = await api.post('/auth/register', {
        name: newUser.name.trim(),
        email: newUser.email.trim().toLowerCase(),
        password: newUser.password,
        role: newUser.role,
        department: newUser.department
      });
      if (res.success) {
        setMessage('User registered successfully in database!');
        setTimeout(() => {
          setModalMode('');
          fetchUsersAndLogs();
        }, 900);
      } else {
        setMessage(res.message || 'Failed to register user.');
      }
    } catch (err) {
      setMessage(err.message || 'Failed to register user.');
    }
  };

  if (loading) {
    return <Loading message="Loading legal metrology officers and user roles..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight m-0">
            User Management & Metrology Access Control
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1 m-0">
            Role-Based Access Control (RBAC) for Test Engineers, Reviewing Officers, and Administrators
          </p>
        </div>
        <button
          onClick={handleOpenCreateUser}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm transition self-start sm:self-auto cursor-pointer"
        >
          <UserPlus size={15} />
          <span>Register New User</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Officer / User Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>System Role</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="font-bold text-slate-900">{u.name}</td>
                <td className="text-slate-600 font-mono text-xs">{u.email}</td>
                <td className="text-xs text-slate-500">{u.department || 'Legal Metrology Lab'}</td>
                <td>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-900">
                    {u.role}
                  </span>
                </td>
                <td>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    u.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {u.status || 'ACTIVE'}
                  </span>
                </td>
                <td>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEditRole(u)}
                      className="px-2 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition"
                      title="Edit Role"
                    >
                      Role
                    </button>

                    <button
                      onClick={() => handleResetPassword(u)}
                      className="px-2 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 transition"
                      title="Reset Password"
                    >
                      Reset Key
                    </button>

                    <button
                      onClick={() => handleToggleStatus(u)}
                      className={`px-2 py-1 text-xs font-semibold rounded border transition ${
                        u.status === 'ACTIVE'
                          ? 'text-red-700 bg-red-50 hover:bg-red-100 border-red-200'
                          : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-200'
                      }`}
                      title="Toggle Status"
                    >
                      {u.status === 'ACTIVE' ? 'Disable' : 'Activate'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Audit Logs Section */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Clock size={16} className="text-blue-600" />
          <span>System Audit Logs (Recent 50 Activities)</span>
        </h3>

        <div className="max-h-60 overflow-y-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 font-semibold text-slate-600">
              <tr>
                <th className="p-2">Timestamp</th>
                <th className="p-2">User / Email</th>
                <th className="p-2">Action</th>
                <th className="p-2">Entity</th>
                <th className="p-2">Audit Details</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log) => (
                <tr key={log.id} className="border-b border-slate-100">
                  <td className="p-2 text-slate-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="p-2 font-mono text-[11px] text-blue-900 font-semibold">
                    {log.userEmail}
                  </td>
                  <td className="p-2 font-bold text-slate-800">{log.action}</td>
                  <td className="p-2 text-slate-500">{log.entity}</td>
                  <td className="p-2 text-slate-700">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Role / Reset Password / Register User Modal */}
      <Modal
        isOpen={Boolean(modalMode)}
        onClose={() => setModalMode('')}
        title={
          modalMode === 'create'
            ? 'Register New Legal Metrology User'
            : modalMode === 'edit'
            ? `Edit User Role: ${selectedUser?.name}`
            : `Reset Password: ${selectedUser?.name}`
        }
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          {message && (
            <div className={`p-3 rounded-lg text-xs font-semibold ${
              message.includes('success') ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-blue-50 text-blue-900'
            }`}>
              {message}
            </div>
          )}

          {modalMode === 'create' && (
            <form onSubmit={handleRegisterNewUser} className="space-y-3">
              <div>
                <label className="form-label">Full Name & Title *</label>
                <input
                  type="text"
                  required
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="form-input"
                  placeholder="e.g. Dr. Satish Nair"
                />
              </div>

              <div>
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="form-input"
                  placeholder="e.g. satish.nair@metrology.gov.in"
                />
              </div>

              <div>
                <label className="form-label">Initial Password *</label>
                <input
                  type="text"
                  required
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="form-input font-mono"
                  placeholder="Enter initial password (min 6 chars)"
                />
              </div>

              <div>
                <label className="form-label">System Role *</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="form-select"
                >
                  <option value="TEST_ENGINEER">Test Engineer — Data Entry & Observations</option>
                  <option value="REVIEWER">Reviewer — Certificate Approval & Digital Sign</option>
                  <option value="LABORATORY_OFFICER">Laboratory Officer — Lab Ops & Standards</option>
                  <option value="ADMIN">Admin — Full System Authority</option>
                  <option value="VIEWER">Viewer — Read-Only</option>
                </select>
              </div>

              <div>
                <label className="form-label">Department / Laboratory *</label>
                <input
                  type="text"
                  required
                  value={newUser.department}
                  onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                  className="form-input"
                  placeholder="e.g. RRSL Bangalore"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setModalMode('')} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex items-center gap-1.5">
                  <UserPlus size={14} />
                  <span>Register User</span>
                </button>
              </div>
            </form>
          )}

          {modalMode === 'edit' && selectedUser && (
            <div>
              <label className="form-label">Assign Role</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="form-select"
              >
                <option value="TEST_ENGINEER">Test Engineer</option>
                <option value="REVIEWER">Reviewer</option>
                <option value="LABORATORY_OFFICER">Laboratory Officer</option>
                <option value="ADMIN">Admin</option>
                <option value="VIEWER">Viewer</option>
              </select>
              <p className="text-[11px] text-slate-500 mt-2">
                Admins have full operational authority; Reviewers can approve and sign test reports.
              </p>

              <div className="flex justify-end gap-2 mt-6">
                <button onClick={() => setModalMode('')} className="btn-secondary">
                  Cancel
                </button>
                <button onClick={handleSaveRole} className="btn-primary">
                  Update Role
                </button>
              </div>
            </div>
          )}

          {modalMode === 'password' && selectedUser && (
            <div>
              <label className="form-label">New Password</label>
              <input
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="form-input font-mono"
                placeholder="Enter new password"
              />
              <p className="text-[11px] text-slate-500 mt-2">
                Password must be at least 6 characters. Will be encrypted with bcrypt.
              </p>

              <div className="flex justify-end gap-2 mt-6">
                <button onClick={() => setModalMode('')} className="btn-secondary">
                  Cancel
                </button>
                <button onClick={handleSavePassword} className="btn-primary">
                  Reset Password
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
