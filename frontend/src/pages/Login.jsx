import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import heroBg from '../assets/images/nawi_login_bg.jpg';
import emblemLogo from '../assets/images/india_emblem_logo.jpg';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ChevronDown,
  ArrowRight,
  Scale,
  ShieldCheck,
  FileText,
  Users,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  CheckCircle,
  Zap,
  UserPlus,
  Building2,
  Mail
} from 'lucide-react';

const DEMO_ACCOUNTS = [
  {
    id: 'engineer',
    role: 'TEST_ENGINEER',
    roleLabel: 'Test Engineer',
    name: 'Sunita Verma',
    email: 'engineer@example.com',
    password: 'test123',
    department: 'RRSL Metrology Lab',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100',
    activeBadgeColor: 'bg-emerald-600 text-white border-emerald-600 shadow-xs',
    tag: 'Testing & Entry'
  },
  {
    id: 'admin',
    role: 'ADMIN',
    roleLabel: 'Administrator',
    name: 'Dr. Ramesh Sharma',
    email: 'admin@example.com',
    password: 'test123',
    department: 'Central Legal Metrology',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-300 hover:bg-purple-100',
    activeBadgeColor: 'bg-purple-700 text-white border-purple-700 shadow-xs',
    tag: 'Full Access'
  },
  {
    id: 'reviewer',
    role: 'REVIEWER',
    roleLabel: 'Reviewer',
    name: 'Anand Kulkarni',
    email: 'reviewer@example.com',
    password: 'test123',
    department: 'Directorate Metrology',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100',
    activeBadgeColor: 'bg-blue-600 text-white border-blue-600 shadow-xs',
    tag: 'Review & Sign'
  },
  {
    id: 'officer',
    role: 'LABORATORY_OFFICER',
    roleLabel: 'Lab Officer',
    name: 'Pooja Iyer',
    email: 'officer@example.com',
    password: 'test123',
    department: 'State Verification Lab',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100',
    activeBadgeColor: 'bg-amber-600 text-white border-amber-600 shadow-xs',
    tag: 'Lab Oversight'
  },
  {
    id: 'viewer',
    role: 'VIEWER',
    roleLabel: 'Viewer',
    name: 'Vikramjit Singh',
    email: 'viewer@example.com',
    password: 'test123',
    department: 'Audit Cell',
    badgeColor: 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200',
    activeBadgeColor: 'bg-slate-700 text-white border-slate-700 shadow-xs',
    tag: 'Read-Only'
  }
];

export default function Login() {
  const navigate = useNavigate();
  const { user, login, register } = useAuth();

  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'

  // Login states
  const [email, setEmail] = useState('engineer@example.com');
  const [password, setPassword] = useState('test123');
  const [role, setRole] = useState('TEST_ENGINEER');
  const [selectedDemoId, setSelectedDemoId] = useState('engineer');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState(false);

  // Registration states
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regRole, setRegRole] = useState('TEST_ENGINEER');
  const [regDepartment, setRegDepartment] = useState('Regional Reference Standards Laboratory (RRSL Bangalore)');
  const [regCustomDepartment, setRegCustomDepartment] = useState('');
  const [regAutoLogin, setRegAutoLogin] = useState(true);
  const [showRegPassword, setShowRegPassword] = useState(false);

  const selectDemoAccount = (demo) => {
    setEmail(demo.email);
    setPassword(demo.password);
    setRole(demo.role);
    setSelectedDemoId(demo.id);
    setError('');
    setSuccessMsg('');
  };

  const handleQuickLogin = async (demo) => {
    selectDemoAccount(demo);
    setError('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const res = await login(demo.email, demo.password, demo.role);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.message || 'Login failed. Please check credentials.');
      }
    } catch (err) {
      setError(err.message || 'Unable to connect to authentication service.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await login(email, password, role);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.message || 'Login failed. Please check credentials.');
      }
    } catch (err) {
      setError(err.message || 'Unable to connect to authentication service.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillSampleReg = () => {
    const timestamp = Date.now().toString().slice(-4);
    setRegName('Er. Ananya Sharma');
    setRegEmail(`ananya.metrology${timestamp}@gov.in`);
    setRegPassword('pass1234');
    setRegConfirmPassword('pass1234');
    setRegRole('TEST_ENGINEER');
    setRegDepartment('Regional Reference Standards Laboratory (RRSL Bangalore)');
    setError('');
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!regName.trim() || !regEmail.trim() || !regPassword) {
      setError('Please provide officer name, official email, and password.');
      return;
    }

    if (regPassword.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match. Please verify your confirmation password.');
      return;
    }

    const dept = regDepartment === 'OTHER'
      ? (regCustomDepartment.trim() || 'Regional Legal Metrology Laboratory')
      : regDepartment;

    setLoading(true);
    try {
      const res = await register(
        {
          name: regName.trim(),
          email: regEmail.trim().toLowerCase(),
          password: regPassword,
          role: regRole,
          department: dept
        },
        regAutoLogin
      );

      if (res.success) {
        if (regAutoLogin) {
          navigate('/dashboard');
        } else {
          setSuccessMsg(`Registration successful for ${regName}! You can now sign in.`);
          setEmail(regEmail.trim().toLowerCase());
          setPassword(regPassword);
          setRole(regRole);
          setSelectedDemoId('');
          setAuthMode('login');
          setLoading(false);
        }
      } else {
        setError(res.message || 'Registration was unsuccessful.');
        setLoading(false);
      }
    } catch (err) {
      setError(err.message || 'Server error occurred during user registration.');
      setLoading(false);
    }
  };

  const currentDemo = DEMO_ACCOUNTS.find(
    (d) => d.email.toLowerCase() === email.toLowerCase() && d.role === role
  );

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center lg:justify-between px-4 sm:px-10 md:px-14 lg:px-20 py-6 bg-slate-100 overflow-hidden select-none">
      {/* Background Image: Precision Weighing Scale, Calibration Weights, India Map, and Tricolor */}
      <div
        className="absolute inset-0 bg-cover"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundPosition: 'center right',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover'
        }}
      />

      {/* Gentle readability gradient wash on the left to keep login text sharp while leaving the right side artwork crisp */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to right, rgba(255, 255, 255, 0.82) 0%, rgba(255, 255, 255, 0.5) 38%, rgba(255, 255, 255, 0.1) 70%, rgba(255, 255, 255, 0) 100%)'
        }}
      />

      {/* ========================================================= */}
      {/* LEFT SIDE — LOGIN CARD                                    */}
      {/* ========================================================= */}
      <div className="w-full max-w-[415px] bg-white/95 backdrop-blur-sm rounded-2xl shadow-[0_18px_45px_rgba(0,0,0,0.12)] p-5 border border-slate-200/90 z-20 my-auto no-scrollbar overflow-y-auto max-h-[98vh] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* Government Emblem Area */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center mb-1">
            <img
              src={emblemLogo}
              alt="Government of India Emblem"
              className="h-12 sm:h-13 w-auto object-contain mix-blend-multiply drop-shadow-xs select-none"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Department Hierarchy */}
          <h2 className="text-[11px] font-bold text-[#0f2444] tracking-wide uppercase m-0 leading-tight">
            Government of India
          </h2>
          <p className="text-[10px] font-semibold text-slate-700 m-0 mt-0.5">
            Department of Consumer Affairs
          </p>
          <p className="text-[10px] font-semibold text-slate-600 m-0">
            Legal Metrology
          </p>

          {/* Title */}
          <div className="mt-1.5">
            <h1 className="text-base sm:text-lg font-black text-[#0f2444] tracking-tight m-0">
              NAWI Test Report System
            </h1>
            <p className="text-[11px] font-semibold text-slate-700 mt-0.5 m-0">
              Non-Automatic Weighing Instruments
            </p>
            <p className="text-[10px] font-medium text-slate-500 m-0">
              Type Evaluation & Test Report (OIML R 76)
            </p>
          </div>
        </div>

        {/* Tab Switcher: Sign In vs Register New User */}
        <div className="mt-2.5 flex rounded-xl bg-slate-100 p-0.5 border border-slate-200">
          <button
            type="button"
            onClick={() => {
              setAuthMode('login');
              setError('');
            }}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              authMode === 'login'
                ? 'bg-white text-[#0f2444] shadow-xs border border-slate-200/80'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <User size={13} />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('register');
              setError('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              authMode === 'register'
                ? 'bg-[#1976d2] text-white shadow-xs'
                : 'text-slate-600 hover:text-blue-700'
            }`}
          >
            <UserPlus size={13} />
            <span>Register New User</span>
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-start gap-2 animate-in fade-in">
            <AlertCircle size={14} className="flex-shrink-0 mt-0.5 text-red-600" />
            <span className="leading-snug">{error}</span>
          </div>
        )}

        {/* Success Notification */}
        {successMsg && (
          <div className="mt-2 p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-start gap-2 animate-in fade-in">
            <CheckCircle2 size={14} className="flex-shrink-0 mt-0.5 text-emerald-600" />
            <span className="leading-snug">{successMsg}</span>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 1: SIGN IN FORM + DEMO ACCOUNTS                      */}
        {/* ========================================================= */}
        {authMode === 'login' ? (
          <>
            {/* DEMO ACCOUNTS QUICK-PICKER BAR */}
            <div className="mt-2.5 p-2.5 bg-gradient-to-br from-blue-50/90 via-indigo-50/60 to-slate-50 border border-blue-200/80 rounded-xl shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-[#0f2444] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={13} className="text-amber-500 fill-amber-400" />
                  Demo Accounts
                </span>
                <span className="text-[10px] text-blue-700 font-medium">Click to select role</span>
              </div>

              {/* Account Chips */}
              <div className="grid grid-cols-3 gap-1.5 mb-2">
                {DEMO_ACCOUNTS.slice(0, 3).map((demo) => {
                  const isSelected = selectedDemoId === demo.id;
                  return (
                    <button
                      key={demo.id}
                      type="button"
                      onClick={() => selectDemoAccount(demo)}
                      className={`px-2 py-1.5 rounded-lg border text-left transition text-[11px] font-semibold flex flex-col cursor-pointer ${
                        isSelected ? demo.activeBadgeColor : demo.badgeColor
                      }`}
                      title={`${demo.name} (${demo.roleLabel})`}
                    >
                      <span className="truncate leading-tight">{demo.roleLabel}</span>
                      <span className={`text-[9px] font-normal truncate opacity-85 ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                        {demo.tag}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-2 gap-1.5 mb-2.5">
                {DEMO_ACCOUNTS.slice(3, 5).map((demo) => {
                  const isSelected = selectedDemoId === demo.id;
                  return (
                    <button
                      key={demo.id}
                      type="button"
                      onClick={() => selectDemoAccount(demo)}
                      className={`px-2 py-1.5 rounded-lg border text-left transition text-[11px] font-semibold flex flex-col cursor-pointer ${
                        isSelected ? demo.activeBadgeColor : demo.badgeColor
                      }`}
                      title={`${demo.name} (${demo.roleLabel})`}
                    >
                      <span className="truncate leading-tight">{demo.roleLabel}</span>
                      <span className={`text-[9px] font-normal truncate opacity-85 ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                        {demo.tag}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Quick 1-Click Login Action for Selected Demo Profile */}
              {currentDemo && (
                <div className="pt-2 border-t border-blue-200/60 flex items-center justify-between text-[11px]">
                  <div className="truncate mr-2">
                    <span className="text-slate-600 block text-[10px] leading-tight">Selected profile:</span>
                    <span className="font-semibold text-slate-800 truncate block">
                      {currentDemo.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => handleQuickLogin(currentDemo)}
                    className="flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-md shadow-xs transition cursor-pointer text-[11px] disabled:opacity-60"
                  >
                    <Zap size={11} className="fill-white" />
                    <span>1-Click Login</span>
                  </button>
                </div>
              )}
            </div>

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} className="mt-2.5 space-y-2.5">
              {/* FIELD 1: Email / Username */}
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">
                  Email / Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User size={15} />
                  </div>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setSelectedDemoId('');
                    }}
                    placeholder="Email / Username"
                    required
                    className="w-full pl-8.5 pr-3 py-1.5 bg-slate-50/70 border border-slate-300 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition"
                  />
                </div>
              </div>

              {/* FIELD 2: Password */}
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock size={15} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className="w-full pl-8.5 pr-8.5 py-1.5 bg-slate-50/70 border border-slate-300 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* ROLE: Select Role */}
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">
                  Assigned Role
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User size={15} />
                  </div>
                  <select
                    value={role}
                    onChange={(e) => {
                      setRole(e.target.value);
                      const matched = DEMO_ACCOUNTS.find((d) => d.role === e.target.value);
                      if (matched && matched.email === email) {
                        setSelectedDemoId(matched.id);
                      } else {
                        setSelectedDemoId('');
                      }
                    }}
                    className="w-full pl-8.5 pr-8.5 py-1.5 bg-slate-50/70 border border-slate-300 rounded-lg text-xs text-slate-800 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none appearance-none transition cursor-pointer font-medium"
                  >
                    <option value="TEST_ENGINEER">Test Engineer (Sunita Verma)</option>
                    <option value="ADMIN">Administrator (Dr. Ramesh Sharma)</option>
                    <option value="REVIEWER">Reviewer (Anand Kulkarni)</option>
                    <option value="LABORATORY_OFFICER">Laboratory Officer (Pooja Iyer)</option>
                    <option value="VIEWER">Viewer (Vikramjit Singh)</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                    <ChevronDown size={14} />
                  </div>
                </div>
              </div>

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-1 py-2 px-4 bg-[#1976d2] hover:bg-[#1565c0] active:bg-[#0d47a1] text-white font-bold text-xs sm:text-sm rounded-lg shadow-sm flex items-center justify-center gap-2 transition active:scale-[0.99] disabled:opacity-70 cursor-pointer"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
                <ArrowRight size={15} />
              </button>
            </form>

            {/* Quick Link to Register */}
            <div className="mt-2.5 p-2 bg-blue-50/60 border border-blue-200/70 rounded-xl flex items-center justify-between text-xs">
              <span className="text-[11px] font-medium text-slate-700 flex items-center gap-1.5">
                <UserPlus size={13} className="text-blue-600" />
                Need a new user account?
              </span>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setError('');
                  setSuccessMsg('');
                }}
                className="text-[11px] font-bold text-blue-700 hover:text-blue-900 underline cursor-pointer"
              >
                Register Here →
              </button>
            </div>

            {/* FORGOT PASSWORD */}
            <div className="text-center mt-2">
              <button
                type="button"
                onClick={() => setForgotMsg(!forgotMsg)}
                className="text-[11px] text-blue-600 hover:text-blue-800 hover:underline transition font-medium cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>

            {forgotMsg && (
              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg text-center text-[11px] text-blue-800 animate-in fade-in">
                Demo password for all accounts is <span className="font-mono font-bold">test123</span>. For password reset, contact system admin at <span className="font-mono font-medium">admin@example.com</span>.
              </div>
            )}
          </>
        ) : (
          /* ========================================================= */
          /* VIEW 2: REGISTER NEW USER FORM                            */
          /* ========================================================= */
          <div className="mt-3 animate-in fade-in duration-200">
            {/* Quick sample filler bar */}
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <UserPlus size={13} className="text-blue-600" />
                New User Registration
              </span>
              <button
                type="button"
                onClick={handleFillSampleReg}
                className="text-[10px] font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2 py-0.5 rounded cursor-pointer transition"
                title="Populate test officer data for quick registration"
              >
                ⚡ Fill Sample Data
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              {/* FIELD 1: Full Name */}
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Full Name & Designation *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User size={16} />
                  </div>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Er. Ananya Sharma"
                    required
                    className="w-full pl-9 pr-3.5 py-2 bg-slate-50/70 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition"
                  />
                </div>
              </div>

              {/* FIELD 2: Email Address */}
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Official Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="e.g. ananya.sharma@metrology.gov.in"
                    required
                    className="w-full pl-9 pr-3.5 py-2 bg-slate-50/70 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition"
                  />
                </div>
              </div>

              {/* FIELD 3 & 4: Password & Confirm Password */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                      <Lock size={14} />
                    </div>
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min 6 chars"
                      required
                      className="w-full pl-8 pr-7 py-2 bg-slate-50/70 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute inset-y-0 right-0 pr-2 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showRegPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                      <Lock size={14} />
                    </div>
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Re-type password"
                      required
                      className="w-full pl-8 pr-3 py-2 bg-slate-50/70 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition"
                    />
                  </div>
                </div>
              </div>

              {/* FIELD 5: Role Selection */}
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Designated System Role *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <ShieldCheck size={16} />
                  </div>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value)}
                    className="w-full pl-9 pr-9 py-2 bg-slate-50/70 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-800 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none appearance-none transition cursor-pointer font-medium"
                  >
                    <option value="TEST_ENGINEER">Test Engineer — Log evaluations & test data</option>
                    <option value="REVIEWER">Reviewer — Verify, approve & digitally sign reports</option>
                    <option value="LABORATORY_OFFICER">Laboratory Officer — Lab operations & equipment oversight</option>
                    <option value="ADMIN">Administrator — Full administrative authority & RBAC</option>
                    <option value="VIEWER">Viewer — Read-only access to published reports</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                    <ChevronDown size={15} />
                  </div>
                </div>
              </div>

              {/* FIELD 6: Laboratory / Department */}
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Laboratory / Department *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Building2 size={16} />
                  </div>
                  <select
                    value={regDepartment}
                    onChange={(e) => setRegDepartment(e.target.value)}
                    className="w-full pl-9 pr-9 py-2 bg-slate-50/70 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-800 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none appearance-none transition cursor-pointer font-medium"
                  >
                    <option value="Regional Reference Standards Laboratory (RRSL Bangalore)">
                      RRSL Bangalore
                    </option>
                    <option value="Regional Reference Standards Laboratory (RRSL Faridabad)">
                      RRSL Faridabad
                    </option>
                    <option value="Regional Reference Standards Laboratory (RRSL Ahmedabad)">
                      RRSL Ahmedabad
                    </option>
                    <option value="Regional Reference Standards Laboratory (RRSL Bhubaneswar)">
                      RRSL Bhubaneswar
                    </option>
                    <option value="Directorate of Legal Metrology (HQ New Delhi)">
                      Directorate of Legal Metrology (HQ New Delhi)
                    </option>
                    <option value="National Physical Laboratory (CSIR-NPL New Delhi)">
                      CSIR - National Physical Laboratory (NPL)
                    </option>
                    <option value="State Legal Metrology Verification Wing">
                      State Legal Metrology Verification Wing
                    </option>
                    <option value="OTHER">Other / Custom Laboratory</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                    <ChevronDown size={15} />
                  </div>
                </div>

                {regDepartment === 'OTHER' && (
                  <div className="mt-2">
                    <input
                      type="text"
                      value={regCustomDepartment}
                      onChange={(e) => setRegCustomDepartment(e.target.value)}
                      placeholder="Enter custom lab or agency name"
                      required
                      className="w-full px-3 py-1.5 bg-slate-50/70 border border-slate-300 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Auto-login preference */}
              <div className="pt-1 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="regAutoLogin"
                  checked={regAutoLogin}
                  onChange={(e) => setRegAutoLogin(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 cursor-pointer"
                />
                <label htmlFor="regAutoLogin" className="text-xs text-slate-600 select-none cursor-pointer">
                  Sign in automatically upon registration
                </label>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm rounded-lg shadow-sm flex items-center justify-center gap-2 transition active:scale-[0.99] disabled:opacity-70 cursor-pointer"
              >
                <UserPlus size={16} />
                <span>{loading ? 'Creating Account...' : 'Register User & Enter Portal'}</span>
              </button>
            </form>

            {/* Back to Login link */}
            <div className="text-center mt-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setError('');
                }}
                className="text-xs text-slate-600 hover:text-blue-700 hover:underline transition font-medium cursor-pointer"
              >
                Already have an account? <span className="font-bold text-blue-700">Sign In</span>
              </button>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-500 font-medium">
          <ShieldCheck size={13} className="text-emerald-600 flex-shrink-0" />
          <span>OIML R 76 Standard</span>
          <span className="text-slate-300">•</span>
          <span>Role RBAC Active</span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* RIGHT SIDE — MOTTO & CORE PILLARS                         */}
      {/* ========================================================= */}
      <div className="hidden lg:flex flex-col justify-start pl-8 xl:pl-16 pr-4 max-w-lg z-20 self-start mt-2">
        <div className="backdrop-blur-sm bg-white/70 p-6 rounded-2xl border border-white/80 shadow-[0_8px_25px_rgba(15,36,68,0.06)]">
          {/* Motto Headline */}
          <h1 className="text-3xl xl:text-[34px] font-black text-[#0f2444] tracking-tight leading-tight m-0 font-serif">
            “Accurate Weights
            <br />
            for a Fair Tomorrow”
          </h1>

          {/* Tricolor Accent: ORANGE - WHITE - GREEN */}
          <div className="flex items-center gap-2 my-3.5">
            <div className="h-1.5 w-8 rounded-full bg-[#ff9933] shadow-xs" />
            <div className="h-1.5 w-8 rounded-full bg-white border border-slate-300 shadow-xs" />
            <div className="h-1.5 w-8 rounded-full bg-[#138808] shadow-xs" />
          </div>

          <p className="text-slate-700 text-xs font-medium mb-3.5 leading-relaxed">
            National Legal Metrology Portal for evaluation and verification of Non-Automatic Weighing Instruments according to OIML R 76-1 & R 76-2 standards.
          </p>

          {/* FOUR ICONS */}
          <div className="grid grid-cols-4 gap-2.5 pt-3 border-t border-slate-200/70">
            {/* Accuracy */}
            <div className="flex flex-col items-center text-center">
              <div className="w-11 h-11 rounded-full bg-blue-100/90 border border-blue-200 text-[#1976d2] flex items-center justify-center shadow-xs">
                <Scale size={20} strokeWidth={1.8} />
              </div>
              <span className="text-[11px] font-bold text-[#0f2444] mt-1.5">
                Accuracy
              </span>
            </div>

            {/* Compliance */}
            <div className="flex flex-col items-center text-center">
              <div className="w-11 h-11 rounded-full bg-blue-100/90 border border-blue-200 text-[#1976d2] flex items-center justify-center shadow-xs">
                <ShieldCheck size={20} strokeWidth={1.8} />
              </div>
              <span className="text-[11px] font-bold text-[#0f2444] mt-1.5">
                Compliance
              </span>
            </div>

            {/* Transparency */}
            <div className="flex flex-col items-center text-center">
              <div className="w-11 h-11 rounded-full bg-blue-100/90 border border-blue-200 text-[#1976d2] flex items-center justify-center shadow-xs">
                <FileText size={20} strokeWidth={1.8} />
              </div>
              <span className="text-[11px] font-bold text-[#0f2444] mt-1.5">
                Transparency
              </span>
            </div>

            {/* Consumer Protection */}
            <div className="flex flex-col items-center text-center">
              <div className="w-11 h-11 rounded-full bg-blue-100/90 border border-blue-200 text-[#1976d2] flex items-center justify-center shadow-xs">
                <Users size={20} strokeWidth={1.8} />
              </div>
              <span className="text-[11px] font-bold text-[#0f2444] mt-1.5">
                Protection
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
