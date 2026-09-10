import React, { useState } from 'react';
import { ScreenType } from '../types';
import { loginWithEmail, resetPassword } from '../services/auth';

interface LoginScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onLoginSuccess: (user: unknown) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onNavigate, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true); setError(null); setMessage(null);
    try {
      const result = await loginWithEmail(email, password, remember);
      onLoginSuccess(result.profile);
      onNavigate('home');
    } catch (err: any) {
      setError(err?.code === 'auth/invalid-credential' || err?.code === 'auth/user-not-found' || err?.code === 'auth/wrong-password'
        ? 'Invalid email or password.'
        : err?.message || 'Unable to sign in.');
    } finally { setLoading(false); }
  };

  const forgotPassword = async () => {
    if (!email.trim()) { setError('Enter your email address first.'); return; }
    setLoading(true); setError(null); setMessage(null);
    try { await resetPassword(email); setMessage('Password reset email sent. Check your inbox.'); }
    catch (err: any) { setError(err?.message || 'Unable to send password reset email.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="w-full flex-1 flex items-center justify-center py-10 px-4 sm:px-8 relative">
      <div className="w-full max-w-md bg-[#241D30] border-[3px] border-[#050505] brutal-shadow-lg rounded-sm p-6 sm:p-8 relative">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-5 py-1 bg-[#ffd166] text-[#050505] border-2 border-[#050505] font-label-code-sm text-[10px] font-bold">CAMPUS QUEST</div>
        <div className="mb-6 mt-2">
          <p className="font-label-code-sm text-[11px] text-[#ffd166] tracking-widest">RETURNING QUESTOR</p>
          <h1 className="font-headline-lg text-3xl sm:text-4xl text-[#fff2dc] uppercase font-bold mt-1">Continue Your Quest</h1>
          <p className="font-body-md text-sm text-[#d1c5b1] mt-2">Sign in with the Firebase account you created for Campus Quest.</p>
        </div>
        {message && <div className="mb-4 p-3 border-2 border-[#83D39A] text-[#83D39A] font-label-code-sm text-xs">{message}</div>}
        {error && <div className="mb-4 p-3 border-2 border-[#FF746E] text-[#FF746E] font-label-code-sm text-xs">{error}</div>}
        <form onSubmit={submit} className="space-y-4">
          <label className="block font-label-code-sm text-xs uppercase text-[#e7dff0]">01. Email<input value={email} onChange={e => setEmail(e.target.value)} type="email" required autoComplete="email" placeholder="you@college.edu" className="mt-1 w-full bg-[#15121D] text-[#fff2dc] px-3 py-3 border-[2.5px] border-[#050505] focus:outline-none focus:border-[#ffd166]" /></label>
          <label className="block font-label-code-sm text-xs uppercase text-[#e7dff0]">02. Password<div className="relative mt-1"><input value={password} onChange={e => setPassword(e.target.value)} type={showPassword ? 'text' : 'password'} required autoComplete="current-password" placeholder="Your password" className="w-full bg-[#15121D] text-[#fff2dc] px-3 py-3 pr-20 border-[2.5px] border-[#050505] focus:outline-none focus:border-[#ffd166]" /><button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-2 top-2 px-2 py-1 text-[#ffd166] font-label-code-sm text-[10px]">{showPassword ? 'HIDE' : 'SHOW'}</button></div></label>
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-[#d1c5b1]"><input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} /> Remember me</label>
            <button type="button" onClick={forgotPassword} className="text-[#ffd166] font-label-code-sm uppercase">Forgot password?</button>
          </div>
          <button disabled={loading} className="w-full bg-[#ffd166] text-[#050505] py-3 border-[2.5px] border-[#050505] brutal-shadow-button font-headline-sm uppercase font-bold disabled:opacity-60">{loading ? 'CONNECTING...' : 'LOGIN'}</button>
        </form>
        <div className="mt-6 pt-5 border-t-2 border-[#050505] text-center text-sm text-[#d1c5b1]">New to Campus Quest? <button onClick={() => onNavigate('register')} className="text-[#ffd166] font-bold uppercase">Register</button></div>
      </div>
    </div>
  );
};
