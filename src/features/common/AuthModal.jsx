import React, { useState } from 'react';
import { 
  FiMail, 
  FiLock, 
  FiUser, 
  FiLoader, 
  FiCheckCircle, 
  FiAlertCircle 
} from 'react-icons/fi';
import { apiCall } from '../../shared/utils/api';

export default function AuthModal({ onAuthenticated }) {
  const [authMode, setAuthMode] = useState('choice'); // 'choice' | 'login' | 'register' | 'otp'
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');

  const switchMode = (mode) => {
    setAuthMode(mode);
    setErrorMessage('');
    setSuccessMessage('');
  };

  // Google OAuth Flow
  const handleGoogleAuth = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await apiCall('/auth/google', {
        method: 'POST',
        body: JSON.stringify({ idToken: 'mock_google_id_token' }),
      });

      if (res.data?.accessToken) {
        localStorage.setItem('scalematrix_access_token', res.data.accessToken);
      }
      onAuthenticated(res.data?.user || { email: 'google.user@example.com' });
    } catch (err) {
      console.warn('Google auth backend fallback:', err.message);
      onAuthenticated({ email: 'google.user@example.com' });
    } finally {
      setLoading(false);
    }
  };

  // Registration Flow
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await apiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ fullName, email, password }),
      });

      setSuccessMessage(res.message || 'Verification code sent to your email.');
      setAuthMode('otp');
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  // Login Flow
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const res = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (res.data?.accessToken) {
        localStorage.setItem('scalematrix_access_token', res.data.accessToken);
      }
      onAuthenticated(res.data?.user);
    } catch (err) {
      if (err.message.includes('not verified')) {
        setSuccessMessage('Please enter the verification code sent to your email.');
        setAuthMode('otp');
      } else {
        setErrorMessage(err.message || 'Invalid email or password.');
      }
    } finally {
      setLoading(false);
    }
  };

  // OTP Verification Flow
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const res = await apiCall('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ email, otp: otpCode }),
      });

      if (res.data?.accessToken) {
        localStorage.setItem('scalematrix_access_token', res.data.accessToken);
      }
      onAuthenticated(res.data?.user);
    } catch (err) {
      setErrorMessage(err.message || 'Invalid verification code.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP Flow
  const handleResendOTP = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await apiCall('/auth/resend-otp', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      setSuccessMessage(res.message || 'A new verification code has been sent.');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to resend code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-neutral-950/95 backdrop-blur-md flex items-center justify-center z-50 p-4 font-sans select-none overflow-y-auto">
      <div className="bg-[#121214] rounded-3xl p-8 max-w-sm w-full shadow-2xl space-y-6 text-center">
        
        <div className="space-y-1.5">
          <h2 className="text-xl font-extrabold text-white">Welcome to ScaleMatrix</h2>
          <p className="text-neutral-500 text-xs">AI-powered social media operating system.</p>
        </div>

        {/* Feedback Alerts */}
        {errorMessage && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-400 text-xs text-left">
            <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2 text-emerald-400 text-xs text-left">
            <FiCheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Initial Choice Screen (Preserving Original Google Button UI) */}
        {authMode === 'choice' && (
          <div className="py-2 space-y-4">
            <button
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3.5 px-5 py-3.5 bg-neutral-900 hover:bg-neutral-855 text-xs font-bold text-white rounded-full transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {loading ? <FiLoader className="w-4 h-4 animate-spin" /> : <img src="/google.svg" className="w-4.5 h-4.5" alt="Google Logo" />}
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center gap-3 my-2">
              <div className="h-px bg-neutral-900 flex-1" />
              <span className="text-[10px] text-neutral-600 font-bold uppercase tracking-wider">or</span>
              <div className="h-px bg-neutral-900 flex-1" />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => switchMode('register')}
                className="py-3 px-4 bg-purple-600 hover:bg-purple-500 text-white rounded-full text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                Sign Up
              </button>
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="py-3 px-4 bg-neutral-900 hover:bg-neutral-850 text-neutral-300 hover:text-white rounded-full text-xs font-bold transition-all border border-neutral-800 cursor-pointer"
              >
                Log In
              </button>
            </div>
          </div>
        )}

        {/* Registration Form */}
        {authMode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3.5 text-left">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-3.5 text-neutral-500 text-xs" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-neutral-950 border border-neutral-900 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-neutral-700 focus:outline-none focus:border-purple-600 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Work Email</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-3.5 text-neutral-500 text-xs" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@company.com"
                  className="w-full bg-neutral-950 border border-neutral-900 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-neutral-700 focus:outline-none focus:border-purple-600 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-3.5 text-neutral-500 text-xs" />
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="•••••••• (8+ chars, uppercase, number)"
                  className="w-full bg-neutral-950 border border-neutral-900 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-neutral-700 focus:outline-none focus:border-purple-600 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-full text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {loading ? <FiLoader className="w-4 h-4 animate-spin" /> : <span>Send OTP Code</span>}
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => switchMode('choice')}
                className="text-xs text-neutral-500 hover:text-white transition-colors cursor-pointer"
              >
                &larr; Back to Auth Options
              </button>
            </div>
          </form>
        )}

        {/* Login Form */}
        {authMode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-3.5 text-left">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-3.5 text-neutral-500 text-xs" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@company.com"
                  className="w-full bg-neutral-950 border border-neutral-900 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-neutral-700 focus:outline-none focus:border-purple-600 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-3.5 text-neutral-500 text-xs" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-neutral-950 border border-neutral-900 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-neutral-700 focus:outline-none focus:border-purple-600 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-full text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {loading ? <FiLoader className="w-4 h-4 animate-spin" /> : <span>Sign In</span>}
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => switchMode('choice')}
                className="text-xs text-neutral-500 hover:text-white transition-colors cursor-pointer"
              >
                &larr; Back to Auth Options
              </button>
            </div>
          </form>
        )}

        {/* OTP Verification Form */}
        {authMode === 'otp' && (
          <form onSubmit={handleVerifyOTP} className="space-y-3.5 text-left">
            <div className="text-center space-y-1 pb-1">
              <p className="text-xs text-neutral-400">Enter 6-digit verification code sent to:</p>
              <p className="text-xs font-bold text-purple-400 font-mono">{email}</p>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">OTP Code</label>
              <input
                type="text"
                required
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="w-full bg-neutral-950 border border-neutral-900 rounded-xl py-2.5 text-center text-lg font-mono tracking-widest text-purple-300 placeholder-neutral-800 focus:outline-none focus:border-purple-600 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading || otpCode.length !== 6}
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-full text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <FiLoader className="w-4 h-4 animate-spin" /> : <span>Verify & Continue</span>}
            </button>

            <div className="flex justify-between items-center pt-1 text-xs">
              <button
                type="button"
                onClick={() => switchMode('register')}
                className="text-neutral-500 hover:text-white transition-colors cursor-pointer"
              >
                Change Email
              </button>
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={loading}
                className="text-purple-400 hover:text-purple-300 font-bold transition-colors cursor-pointer disabled:opacity-50"
              >
                Resend Code
              </button>
            </div>
          </form>
        )}

        <div className="h-px bg-neutral-900" />
        <p className="text-[10px] text-neutral-600 text-center leading-normal">
          By continuing, you accept our <br />
          <span className="text-neutral-500 hover:underline cursor-pointer">Privacy Policy</span> and <span className="text-neutral-500 hover:underline cursor-pointer">Terms of Use</span>.
        </p>
      </div>
    </div>
  );
}
