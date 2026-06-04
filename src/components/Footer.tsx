import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Mail, 
  MapPin, 
  Globe, 
  Activity, 
  Flame, 
  CheckCircle2, 
  Instagram, 
  Twitter, 
  Linkedin, 
  ChevronRight,
  Award,
  Users
} from 'lucide-react';
import { playMetallicClick } from '../utils/audio';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [onlinePlayers, setOnlinePlayers] = useState(3420);
  const [activeTab, setActiveTab] = useState<'ticker' | 'stats'>('ticker');

  // Simulate floating/fluctuating player count for ambient dynamism
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlinePlayers(prev => {
        const delta = Math.floor(Math.random() * 9) - 4;
        return Math.max(3400, prev + delta);
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    playMetallicClick();
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
    }, 2000);
  };

  return (
    <footer 
      id="site-footer" 
      className="relative min-h-[90vh] bg-transparent text-[rgba(255,255,255,0.7)] pt-28 pb-10 px-6 sm:px-12 md:px-24 overflow-hidden flex flex-col justify-between"
    >
      {/* GLOWING AMBIENT FIELD ORANGE GLOW IN FOOTER BACKGROUND */}
      <div 
        className="absolute bottom-[-150px] left-[10%] w-[350px] md:w-[600px] h-[350px] md:h-[600px] rounded-full pointer-events-none select-none z-0 opacity-40 blur-[80px]"
        style={{
          background: 'radial-gradient(circle, rgba(234,88,12,0.06) 0%, transparent 75%)'
        }}
      />
      <div 
        className="absolute top-[20%] right-[-100px] w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-full pointer-events-none select-none z-0 opacity-20 blur-[60px]"
        style={{
          background: 'radial-gradient(circle, rgba(212,248,42,0.04) 0%, transparent 75%)'
        }}
      />

      {/* FOOTER BRACING GRID ROW */}
      <div className="w-full max-w-7xl mx-auto z-10 flex-grow grid grid-cols-1 lg:grid-cols-[1.3fr_1.7fr_1.1fr] gap-12 lg:gap-16 items-start">
        
        {/* COLUMN 1: PREMIUM COMPONENT IDENTIFICATION */}
        <div className="space-y-6 text-left">
          <div className="flex flex-col gap-1.5 selection:bg-orange-500/30">
            <div className="flex items-center gap-2.5">
              <span className="w-6.5 h-6.5 rounded-full bg-gradient-to-tr from-orange-600 to-orange-400 flex items-center justify-center text-black font-black text-[11px] tracking-tighter select-none shadow-[0_0_15px_rgba(249,115,22,0.4)]">
                HH
              </span>
              <span className="font-display text-white text-3xl font-black tracking-[1.5px] select-none hover:text-[#d4f82a] transition-all duration-300">
                HOOPHUB
              </span>
            </div>
            <p className="font-mono text-[9px] uppercase tracking-[3px] text-[#d4f82a] font-bold flex items-center gap-1.5 pt-1.5 animate-pulse">
              <Activity size={10} /> {onlinePlayers.toLocaleString()} Athletes globally active
            </p>
          </div>

          <p className="font-sans text-[12.5px] leading-relaxed max-w-sm text-zinc-400 font-medium">
            The world's premium interactive digital basketball canvas. Direct court matching, real-time stats integration, and handcrafted gear customized for high performance.
          </p>

          {/* SERVER METADATA LABELS */}
          <div className="grid grid-cols-2 gap-3 max-w-xs pt-1">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] flex flex-col text-left">
              <span className="text-[8px] font-mono text-zinc-500 uppercase font-black">Region Node</span>
              <span className="text-[11px] font-sans text-white font-extrabold flex items-center gap-1 mt-1">
                <Globe size={11} className="text-orange-500" /> Tokyo & NYC
              </span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] flex flex-col text-left">
              <span className="text-[8px] font-mono text-zinc-500 uppercase font-black">Lobby Ping</span>
              <span className="text-[11px] font-sans text-[#d4f82a] font-extrabold flex items-center gap-1 mt-1">
                <Flame size={11} /> 12ms Stable
              </span>
            </div>
          </div>

          {/* SOCIAL MEDIA PILLS WITH INTEGRATED ICON PACKS */}
          <div className="flex flex-wrap gap-2 pt-2">
            <a 
              href="#twitter" 
              onClick={playMetallicClick}
              className="group flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] hover:border-white/15 text-[10px] uppercase tracking-wider font-extrabold text-zinc-300 hover:text-black hover:bg-white transition-all duration-300 cursor-pointer"
            >
              <Twitter size={10} className="group-hover:scale-110 transition-transform" /> Twitter
            </a>
            <a 
              href="#instagram" 
              onClick={playMetallicClick}
              className="group flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] hover:border-white/15 text-[10px] uppercase tracking-wider font-extrabold text-zinc-300 hover:text-black hover:bg-[#d4f82a] transition-all duration-300 cursor-pointer"
            >
              <Instagram size={10} className="group-hover:scale-110 transition-transform" /> Instagram
            </a>
            <a 
              href="#linkedin" 
              onClick={playMetallicClick}
              className="group flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] hover:border-white/15 text-[10px] uppercase tracking-wider font-extrabold text-zinc-300 hover:text-black hover:bg-white transition-all duration-300 cursor-pointer"
            >
              <Linkedin size={10} className="group-hover:scale-110 transition-transform" /> LinkedIn
            </a>
          </div>
        </div>

        {/* COLUMN 2: SITE NAVIGATION LINKS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-left pt-2">
          
          {/* PRODUCT GROUP */}
          <div className="space-y-4">
            <span className="text-[9.5px] uppercase tracking-[3px] font-black text-zinc-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4f82a]" /> Product
            </span>
            <ul className="space-y-2 text-[12px] font-bold">
              <li>
                <a href="#hero-section" onClick={playMetallicClick} className="text-zinc-400 hover:text-white transition-all hover:translate-x-1 flex items-center gap-1 group">
                  <ChevronRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#d4f82a]" /> Custom Shop
                </a>
              </li>
              <li>
                <a href="#hero-section" onClick={playMetallicClick} className="text-zinc-400 hover:text-white transition-all hover:translate-x-1 flex items-center gap-1 group">
                  <ChevronRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#d4f82a]" /> Book Courts <span className="text-[7.5px] bg-orange-500/10 text-orange-500 px-1 rounded-sm ml-1 py-0.5">Live</span>
                </a>
              </li>
              <li>
                <a href="#stats-section" onClick={playMetallicClick} className="text-zinc-400 hover:text-white transition-all hover:translate-x-1 flex items-center gap-1 group">
                  <ChevronRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#d4f82a]" /> Track Metrics
                </a>
              </li>
              <li>
                <a href="#how-section" onClick={playMetallicClick} className="text-zinc-400 hover:text-[#d4f82a] transition-all hover:translate-x-1 flex items-center gap-1 group">
                  <ChevronRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#d4f82a]" /> Private Coaching
                </a>
              </li>
            </ul>
          </div>

          {/* COMMUNITY GROUP */}
          <div className="space-y-4">
            <span className="text-[9.5px] uppercase tracking-[3px] font-black text-zinc-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" /> Leagues
            </span>
            <ul className="space-y-2 text-[12px] font-bold">
              <li>
                <a href="#players" onClick={playMetallicClick} className="text-zinc-400 hover:text-white transition-all hover:translate-x-1 flex items-center gap-1 group">
                  <ChevronRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#d4f82a]" /> Athletes Node
                </a>
              </li>
              <li>
                <a href="#teams" onClick={playMetallicClick} className="text-zinc-400 hover:text-white transition-all hover:translate-x-1 flex items-center gap-1 group">
                  <ChevronRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#d4f82a]" /> Squad Registry
                </a>
              </li>
              <li>
                <a href="#tournaments" onClick={playMetallicClick} className="text-zinc-400 hover:text-white transition-all hover:translate-x-1 flex items-center gap-1 group">
                  <ChevronRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#d4f82a]" /> Tournament Grid <span className="text-[7.5px] bg-[#d4f82a]/10 text-[#d4f82a] px-1 rounded-sm ml-1 py-0.5">Hot</span>
                </a>
              </li>
              <li>
                <a href="#ranking" onClick={playMetallicClick} className="text-zinc-400 hover:text-[#d4f82a] transition-all hover:translate-x-1 flex items-center gap-1 group">
                  <ChevronRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#d4f82a]" /> Local Rankings
                </a>
              </li>
            </ul>
          </div>

          {/* PARTNERS GROUP */}
          <div className="space-y-4 col-span-2 sm:col-span-1">
            <span className="text-[9.5px] uppercase tracking-[3px] font-black text-zinc-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white" /> System
            </span>
            <ul className="space-y-2 text-[12px] font-bold">
              <li>
                <a href="#about" onClick={playMetallicClick} className="text-zinc-400 hover:text-white transition-all hover:translate-x-1 flex items-center gap-1 group">
                  <ChevronRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#d4f82a]" /> The Platform
                </a>
              </li>
              <li>
                <a href="#blog" onClick={playMetallicClick} className="text-zinc-400 hover:text-white transition-all hover:translate-x-1 flex items-center gap-1 group">
                  <ChevronRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#d4f82a]" /> Courtside Blog
                </a>
              </li>
              <li>
                <a href="#press" onClick={playMetallicClick} className="text-zinc-400 hover:text-white transition-all hover:translate-x-1 flex items-center gap-1 group">
                  <ChevronRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#d4f82a]" /> Media & Press
                </a>
              </li>
              <li>
                <a href="#contact" onClick={playMetallicClick} className="text-zinc-400 hover:text-[#d4f82a] transition-all hover:translate-x-1 flex items-center gap-1 group">
                  <ChevronRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#d4f82a]" /> Developer API
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* COLUMN 3: DEEP NEWSLETTER CARD AND LIVE COURT RADAR */}
        <div className="space-y-4">
          <div 
            className="rounded-2xl p-6 space-y-4 text-left border border-white/[0.06] bg-neutral-950/70 shadow-2xl backdrop-blur-md relative overflow-hidden group"
          >
            {/* Soft decorative visual net line */}
            <div className="absolute right-0 top-0 w-24 h-24 bg-orange-600/5 rounded-full blur-xl group-hover:bg-orange-600/10 transition-colors" />

            <div className="flex items-center gap-2">
              <Mail size={14} className="text-orange-500 animate-[bounce_3s_infinite]" />
              <span className="text-[12.5px] font-extrabold text-white tracking-wide block uppercase font-display">
                COURTSIDE BULLETINS
              </span>
            </div>
            
            <p className="font-sans text-[11.5px] leading-relaxed text-zinc-400 font-medium">
              Drop your email address to receive immediate SMS & digital alerts when premium park reservations open in your coordinates.
            </p>

            {/* Newsletter form status indicator */}
            {!subscribed ? (
              <form 
                onSubmit={handleSubscribe} 
                className="flex items-center gap-1.5 bg-neutral-900/90 border border-white/[0.07] hover:border-white/10 rounded-xl p-1 transition-all focus-within:border-orange-500/50"
              >
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email coordinates" 
                  required
                  className="flex-grow bg-transparent border-0 outline-0 px-3 py-2 text-[11px] text-white placeholder-zinc-500 w-full font-bold"
                />
                <button 
                  type="submit" 
                  aria-label="Submit email address"
                  className="w-9 h-9 rounded-lg bg-white text-black hover:bg-[#d4f82a] transition-all font-black text-[13px] flex items-center justify-center cursor-pointer flex-shrink-0 shadow"
                >
                  <ArrowRight size={13} />
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-orange-600/10 border border-orange-500/30 text-white animate-fadeIn">
                <CheckCircle2 size={16} className="text-[#d4f82a] flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-wider">Access Granted</span>
                  <span className="text-[9.5px] text-zinc-300 font-medium leading-none mt-0.5">Coordinates queued for notifications.</span>
                </div>
              </div>
            )}
            
            {/* micro mini-alert */}
            <div className="flex items-center gap-2 pt-1 border-t border-white/[0.04] text-[9.5px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4f82a] animate-ping" />
              <span className="text-zinc-500 font-bold uppercase tracking-wider">NEXT RESERVATION LOT CHECKS IN: <span className="text-white">14m</span></span>
            </div>
          </div>
        </div>

      </div>

      {/* FOOTER BOTTOM SECTION BAR */}
      <div className="w-full max-w-7xl mx-auto pt-12 mt-16 border-t border-white/[0.06] z-10 flex flex-col gap-8 select-none">
        
        {/* ROW 1: FOOTER BOTTOM ITEMS WITH THE RE-FASHIONED PRODUCT HUNT BADGE */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-[11px] text-zinc-500 font-medium">
            <span>© {currentYear} HoopHub International Inc. All rights reserved.</span>
            <span className="hidden sm:inline text-zinc-800">·</span>
            <div className="flex items-center gap-4">
              <a href="#privacy" onClick={playMetallicClick} className="hover:text-white transition-colors duration-200">Privacy Policy</a>
              <a href="#terms" onClick={playMetallicClick} className="hover:text-white transition-colors duration-200">Terms of Play</a>
              <a href="#cookies" onClick={playMetallicClick} className="hover:text-white transition-colors duration-200">Cookies</a>
            </div>
          </div>

          {/* STUNNING FLOURISHED PRODUCT HUNT BADGE WITH GLOW EFFECT */}
          <div 
            onClick={playMetallicClick}
            className="flex items-center gap-3.5 py-2 px-4 rounded-xl bg-neutral-950 border border-white/[0.07] text-white font-sans shadow-lg cursor-pointer hover:border-orange-500/30 transition-all group"
          >
            <span className="w-6 h-6 rounded-full bg-[#FF6154] text-white font-black text-[10px] flex items-center justify-center shadow-[0_0_10px_rgba(255,97,84,0.4)] group-hover:scale-115 transition-transform duration-300">P</span>
            <div className="flex flex-col text-left">
              <span className="text-[8px] uppercase tracking-[1.5px] text-zinc-500 font-extrabold leading-none">PREMIUM SELECTION</span>
              <span className="text-[10px] font-black tracking-tight text-white group-hover:text-[#d4f82a] transition-colors leading-none mt-1">#1 Product of the Day</span>
            </div>
          </div>

        </div>

        {/* HIGHLY IMMERSIVE TOURNAMENT MATCHBOARD SCORES TICKER */}
        <div className="w-full relative overflow-hidden bg-white/[0.01] border-t border-b border-white/[0.03] py-3.5 select-none rounded-lg backdrop-blur-xs">
          <div className="cities-ticker">
            <span className="font-display text-white/20 hover:text-[#d4f82a]/50 transition-colors text-[10.5px] tracking-[4px] uppercase pr-8 select-none font-bold">
              🏀 [LIVE STATUS: Q4] BRONX JETS 104 - 101 BROOKLYN BALLERS · 🏀 [LIVE STATUS: Q2] TOKYO SHARKS 64 - 58 KYOTO DRAGONS · 🏀 [LIVE STATUS: FINAL] PARIS EAGLES 92 - 90 LONDON REBELS · 🏀 [UPCOMING] SEOUL TIGERS VS DUBAI COBRAS
            </span>
            <span className="font-display text-white/20 hover:text-[#d4f82a]/50 transition-colors text-[10.5px] tracking-[4px] uppercase pr-8 select-none font-bold">
              🏀 [LIVE STATUS: Q4] BRONX JETS 104 - 101 BROOKLYN BALLERS · 🏀 [LIVE STATUS: Q2] TOKYO SHARKS 64 - 58 KYOTO DRAGONS · 🏀 [LIVE STATUS: FINAL] PARIS EAGLES 92 - 90 LONDON REBELS · 🏀 [UPCOMING] SEOUL TIGERS VS DUBAI COBRAS
            </span>
          </div>
        </div>

      </div>

    </footer>
  );
}
