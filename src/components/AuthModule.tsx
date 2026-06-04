import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, ShieldCheck, Trophy, Dumbbell, Sparkles, LogIn, ArrowRight, UserPlus, Fingerprint, Eye, EyeOff } from 'lucide-react';
import { playMetallicClick, playSwoosh } from '../utils/audio';

interface CurrentUser {
  email: string;
  name: string;
  jerseyNumber: string;
  position: string;
  xp: number;
}

interface AuthModuleProps {
  onAuthSuccess: (user: CurrentUser) => void;
  initialMode?: 'signin' | 'signup';
}

export default function AuthModule({ onAuthSuccess, initialMode = 'signin' }: AuthModuleProps) {
  const [isLoginView, setIsLoginView] = useState(initialMode === 'signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Custom Registration Fields
  const [athleteName, setAthleteName] = useState('');
  const [jerseyNumber, setJerseyNumber] = useState('23');
  const [position, setPosition] = useState('Guard');
  
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successAnimation, setSuccessAnimation] = useState(false);

  useEffect(() => {
    // Clear state on view transition
    setEmail('');
    setPassword('');
    setAthleteName('');
    setErrorMessage('');
    setSuccessAnimation(false);
  }, [isLoginView]);

  const handleToggleView = () => {
    playSwoosh();
    setIsLoginView(!isLoginView);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);
    playMetallicClick();

    if (!email || !password) {
      setErrorMessage('Please fill in all security fields.');
      setIsSubmitting(false);
      return;
    }

    if (!isLoginView && !athleteName) {
      setErrorMessage('Please declare your athlete credentials.');
      setIsSubmitting(false);
      return;
    }

    setTimeout(() => {
      try {
        const storedUsers = JSON.parse(localStorage.getItem('y68_athletes') || '[]');
        
        if (isLoginView) {
          // Login Flow
          const user = storedUsers.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
          if (!user || user.password !== password) {
            setErrorMessage('Invalid athlete credentials. Please check password or register.');
            setIsSubmitting(false);
            return;
          }
          
          setSuccessAnimation(true);
          setTimeout(() => {
            const loggedUser: CurrentUser = {
              email: user.email,
              name: user.name,
              jerseyNumber: user.jerseyNumber || '00',
              position: user.position || 'Street',
              xp: user.xp || 1200
            };
            localStorage.setItem('y68_current_user', JSON.stringify(loggedUser));
            onAuthSuccess(loggedUser);
            setIsSubmitting(false);
          }, 1200);

        } else {
          // Register Flow
          const userExists = storedUsers.some((u: any) => u.email.toLowerCase() === email.toLowerCase());
          if (userExists) {
            setErrorMessage('Athlete account with this Email already registered.');
            setIsSubmitting(false);
            return;
          }

          const newUser = {
            email,
            password,
            name: athleteName,
            jerseyNumber,
            position,
            xp: 1000 // Starter Athlete Level
          };

          storedUsers.push(newUser);
          localStorage.setItem('y68_athletes', JSON.stringify(storedUsers));
          
          setSuccessAnimation(true);
          setTimeout(() => {
            const loggedUser: CurrentUser = {
              email: newUser.email,
              name: newUser.name,
              jerseyNumber: newUser.jerseyNumber,
              position: newUser.position,
              xp: newUser.xp
            };
            localStorage.setItem('y68_current_user', JSON.stringify(loggedUser));
            onAuthSuccess(loggedUser);
            setIsSubmitting(false);
          }, 1200);
        }
      } catch (err) {
        setErrorMessage('Database error. Restructuring state cache...');
        setIsSubmitting(false);
      }
    }, 1000);
  };

  return (
    <div id="auth-interactive-panel" className="w-full max-w-lg mx-auto pointer-events-auto z-40 relative px-4">
      
      {/* Visual Success Ring Reveal */}
      {successAnimation && (
        <div className="absolute inset-0 bg-neutral-950/90 backdrop-blur-2xl rounded-3xl border border-orange-500/30 flex flex-col items-center justify-center space-y-4 z-50 animate-fade-in">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-orange-500/15 border-2 border-orange-500 flex items-center justify-center animate-pulse">
              <ShieldCheck size={32} className="text-orange-400" />
            </div>
            <span className="absolute -inset-1 rounded-full border border-orange-500/40 animate-ping" />
          </div>
          <p className="text-xs uppercase font-bold tracking-widest text-zinc-400 font-mono">Syncing Court Signature...</p>
          <h3 className="font-display text-white text-lg font-bold uppercase tracking-wider">ATHLETE SESSION LOCKED</h3>
        </div>
      )}

      {/* Main Glass Form Frame */}
      <div className="bg-gradient-to-br from-neutral-900/90 to-neutral-950/90 backdrop-blur-xl border border-white/[0.08] p-8 rounded-[2.5rem] shadow-[0_25px_50px_rgba(0,0,0,0.6)] relative overflow-hidden">
        
        {/* Glow Decorator */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-orange-600/10 rounded-full filter blur-[80px]" />
        
        {/* Form Header */}
        <div className="text-center space-y-2 mb-8 relative z-10">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-3">
            {isLoginView ? (
              <Fingerprint className="text-orange-500 animate-pulse" size={24} />
            ) : (
              <Trophy className="text-orange-500 animate-pulse" size={24} />
            )}
          </div>
          <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest font-mono block">HoopHub Athletic Outpost</span>
          <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-white">
            {isLoginView ? 'Verify Athlete Badge' : 'Draft New Player'}
          </h2>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            {isLoginView 
              ? 'Enter your tactical signature key to log back into court modules.' 
              : 'Register your athlete identity cards, draft jersey, and assign court role.'}
          </p>
        </div>

        {/* Action Form */}
        <form onSubmit={handleFormSubmit} className="space-y-5 relative z-10 select-none">
          
          {errorMessage && (
            <div className="p-3 bg-red-950/40 border border-red-500/30 text-red-400 rounded-xl text-[10px] font-bold uppercase tracking-wider text-center font-mono">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Player Name Field (Register Mode Only) */}
          {!isLoginView && (
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 font-mono pl-1">Athlete Handle</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  placeholder="e.g. HIMANSHU BISAI"
                  value={athleteName}
                  onChange={(e) => setAthleteName(e.target.value)}
                  className="w-full bg-black/40 border border-white/[0.08] focus:border-orange-500/60 transition-all rounded-2xl py-3.5 pl-11 pr-4 text-xs text-white placeholder-zinc-600 font-medium outline-none"
                  required
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-1.5 text-left">
            <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 font-mono pl-1">Email Terminal</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                <Mail size={16} />
              </span>
              <input
                type="email"
                placeholder="athlete@hoophub.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/40 border border-white/[0.08] focus:border-orange-500/60 transition-all rounded-2xl py-3.5 pl-11 pr-4 text-xs text-white placeholder-zinc-600 font-medium outline-none"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5 text-left">
            <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 font-mono pl-1">Signatory Key</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                <Lock size={16} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/40 border border-white/[0.08] focus:border-orange-500/60 transition-all rounded-2xl py-3.5 pl-11 pr-12 text-xs text-white placeholder-zinc-600 font-medium outline-none"
                required
              />
              <button
                type="button"
                onClick={() => {
                  setShowPassword(!showPassword);
                  playMetallicClick();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Player Customizer Block (Register Mode Only) */}
          {!isLoginView && (
            <div className="space-y-4 pt-2 border-t border-white/[0.04] text-left">
              <span className="text-[10px] uppercase font-bold tracking-widest text-orange-500 font-mono block mb-2">Configure Court Preset</span>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Position Select */}
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase font-bold tracking-widest text-zinc-500 font-mono pl-1">Tactical Role</label>
                  <select
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full bg-black/40 border border-white/[0.08] focus:border-orange-500/60 transition-all rounded-2xl py-3 px-4 text-xs text-white outline-none cursor-pointer"
                  >
                    <option value="Guard" className="bg-neutral-900">Point Guard</option>
                    <option value="Forward" className="bg-neutral-900">Forward</option>
                    <option value="Center" className="bg-neutral-900">Center Core</option>
                    <option value="Coach" className="bg-neutral-900">Staff / Coach</option>
                  </select>
                </div>

                {/* Jersey Number Field */}
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase font-bold tracking-widest text-zinc-500 font-mono pl-1">Jersey Number</label>
                  <input
                    type="number"
                    min="0"
                    max="99"
                    value={jerseyNumber}
                    onChange={(e) => setJerseyNumber(e.target.value)}
                    className="w-full bg-black/40 border border-white/[0.08] focus:border-orange-500/60 transition-all rounded-2xl py-3 px-4 text-xs text-white placeholder-zinc-600 outline-none"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full relative group overflow-hidden bg-orange-600 hover:bg-orange-500 disabled:bg-orange-850 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest text-white shadow-lg cursor-pointer transition-all duration-300 transform active:scale-[0.98] disabled:opacity-50"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[150%] skew-x-[-30deg] group-hover:animate-sweep"></div>
            <div className="flex items-center justify-center gap-2 relative z-10 select-none">
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
                  <span>Transmitting...</span>
                </>
              ) : (
                <>
                  {isLoginView ? (
                    <>
                      <span>Authorize Vault Access</span>
                      <LogIn size={15} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  ) : (
                    <>
                      <span>Construct Athlete Profile</span>
                      <UserPlus size={15} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </>
              )}
            </div>
          </button>

          {/* Switch link */}
          <div className="text-center pt-3">
            <button
              type="button"
              onClick={handleToggleView}
              className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 hover:text-orange-400 cursor-pointer outline-none transition-colors border-b border-dashed border-zinc-700/50 hover:border-orange-500/30 pb-0.5"
            >
              {isLoginView 
                ? "Don't have an athlete card? Register Now" 
                : 'Already drafted? Sign in with Signature'}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
