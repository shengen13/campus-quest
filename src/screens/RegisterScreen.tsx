import React, { useState } from 'react';
import { ScreenType } from '../types';
import { registerWithEmail } from '../services/auth';

interface RegisterScreenProps { onNavigate: (screen: ScreenType) => void; onRegisterSuccess: (user: unknown) => void; onOpenHonorCode: () => void; }

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ onNavigate, onRegisterSuccess, onOpenHonorCode }) => {
  const [name, setName] = useState('');
  const [callsign, setCallsign] = useState('');
  const [email, setEmail] = useState('');
  const [college, setCollege] = useState('');
  const [guild, setGuild] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setError(null);
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (password.length < 6) { setError('Firebase requires a password of at least 6 characters.'); return; }
    if (!agree) { setError('Please accept the Campus Quest honor code.'); return; }
    setLoading(true);
    try {
      const result = await registerWithEmail(email, password, name, callsign, college, guild);
      onRegisterSuccess(result.profile); onNavigate('home');
    } catch (err: any) {
      setError(err?.code === 'auth/email-already-in-use' ? 'This email is already registered. Please log in.' : err?.message || 'Registration failed.');
    } finally { setLoading(false); }
  };

  return (
    <div className="w-full flex-1 flex items-center justify-center py-8 px-4 sm:px-8">
      <div className="w-full max-w-3xl bg-[#241D30] border-[3px] border-[#050505] brutal-shadow-lg rounded-sm p-5 sm:p-8 relative">
        <div className="absolute -top-3 left-8 px-4 py-1 bg-[#83D39A] text-[#050505] border-2 border-[#050505] font-label-code-sm text-[10px] font-bold">NEW QUESTOR</div>
        <div className="mb-6 mt-2"><p className="font-label-code-sm text-xs text-[#ffd166] tracking-widest">REGISTRATION DOSSIER</p><h1 className="font-headline-lg text-3xl sm:text-4xl text-[#fff2dc] uppercase font-bold">Start Your Quest</h1><p className="font-body-md text-sm text-[#d1c5b1] mt-2">Create a real Firebase account. Your profile and progress will be stored under your unique Firebase UID.</p></div>
        {error && <div className="mb-5 p-3 border-2 border-[#FF746E] text-[#FF746E] font-label-code-sm text-xs">{error}</div>}
        <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="01. Full name" value={name} setValue={setName} placeholder="Your full name" auto="name" />
          <Field label="02. Questor ID" value={callsign} setValue={setCallsign} placeholder="your_questor_id" auto="username" />
          <Field label="03. College email" value={email} setValue={setEmail} placeholder="you@college.edu" type="email" auto="email" />
          <Field label="04. College / University" value={college} setValue={setCollege} placeholder="Your college" />
          <Field label="05. Guild / Discipline" value={guild} setValue={setGuild} placeholder="Computer Science" />
          <Field label="06. Password" value={password} setValue={setPassword} placeholder="At least 6 characters" type="password" auto="new-password" />
          <div className="sm:col-span-2"><Field label="07. Confirm password" value={confirm} setValue={setConfirm} placeholder="Re-enter password" type="password" auto="new-password" /></div>
          <div className="sm:col-span-2 flex items-start gap-2 text-sm text-[#d1c5b1]"><input id="honor" type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} className="mt-1" /><label htmlFor="honor">I agree to the <button type="button" onClick={onOpenHonorCode} className="text-[#ffd166] underline">Campus Quest Honor Code</button>.</label></div>
          <button disabled={loading} className="sm:col-span-2 bg-[#ffd166] text-[#050505] py-3 border-[2.5px] border-[#050505] brutal-shadow-button font-headline-sm uppercase font-bold disabled:opacity-60">{loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}</button>
        </form>
        <div className="mt-6 pt-5 border-t-2 border-[#050505] text-center text-sm text-[#d1c5b1]">Already registered? <button onClick={() => onNavigate('login')} className="text-[#ffd166] font-bold uppercase">Login</button></div>
      </div>
    </div>
  );
};

function Field({ label, value, setValue, placeholder, type = 'text', auto }: { label: string; value: string; setValue: (v: string) => void; placeholder: string; type?: string; auto?: string }) {
  return <label className="block font-label-code-sm text-xs uppercase text-[#e7dff0]">{label}<input value={value} onChange={e => setValue(e.target.value)} type={type} required autoComplete={auto} placeholder={placeholder} className="mt-1 w-full bg-[#15121D] text-[#fff2dc] px-3 py-3 border-[2.5px] border-[#050505] focus:outline-none focus:border-[#ffd166]" /></label>;
}
