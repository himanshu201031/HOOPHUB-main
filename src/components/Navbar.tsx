import React, { useEffect, useState } from 'react';
import { User, LogOut, Award, ChevronDown, Mail, Send, Check, Menu, X, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { playSwoosh, playMetallicClick } from '../utils/audio';

interface CurrentUser {
  email: string;
  name: string;
  jerseyNumber: string;
  position: string;
  xp: number;
}

interface NavbarProps {
  currentUser: CurrentUser | null;
  onLogout: () => void;
}

export default function Navbar({ currentUser, onLogout }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [currentHash, setCurrentHash] = useState('#home');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredHash, setHoveredHash] = useState<string | null>(null);
  
  // Contact form state
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [contactSent, setContactSent] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    
    const handleHash = () => {
      setCurrentHash(window.location.hash || '#home');
      setShowDropdown(false);
      setIsMobileMenuOpen(false);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('hashchange', handleHash);
    
    handleScroll();
    handleHash();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('hashchange', handleHash);
    };
  }, []);

  const handleDropdownToggle = () => {
    playMetallicClick();
    setShowDropdown(!showDropdown);
  };

  const handleLogoutAction = () => {
    playSwoosh();
    setShowDropdown(false);
    onLogout();
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactEmail || !contactMsg) return;
    playSwoosh();
    setContactSent(true);
    setTimeout(() => {
      setContactEmail('');
      setContactMsg('');
      setContactSent(false);
      setIsContactOpen(false);
    }, 2200);
  };

  const navItems = [
    { label: 'Home', hash: '#home' },
    { label: 'Pro Shop', hash: '#shop' },
    { label: 'Court Booking', hash: '#booking' },
    { label: 'Community', hash: '#feed' },
    { label: 'Leagues', hash: '#tournaments' },
    { label: 'Custom Lab', hash: '#custom-lab' },
  ];

  const isActive = (hash: string) => {
    if (hash === '#home') return currentHash === '#home' || currentHash === '' || currentHash === '#';
    if (hash === '#feed') return currentHash === '#feed' || currentHash === '#community';
    if (hash === '#custom-lab') return currentHash === '#custom-lab' || currentHash === '#kinetics';
    return currentHash === hash;
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[500] w-full transition-all duration-500 ease-out pointer-events-none px-4 md:px-8 ${
          scrolled ? 'pt-3' : 'pt-0'
        }`}
      >
        <nav
          id="main-nav"
          className={`mx-auto w-full max-w-7xl flex items-center justify-between transition-all duration-500 pointer-events-auto select-none ${
            scrolled 
              ? 'bg-neutral-950/85 backdrop-blur-xl border border-white/[0.08] shadow-[0_24px_50px_-12px_rgba(0,0,0,0.9)] rounded-full px-6 md:px-10 py-3.5' 
              : 'bg-transparent border-b border-transparent px-6 md:px-10 py-6'
          }`}
        >
          {/* LEFT GROUP: BRAND LOGO WITH ANIMATED RODS */}
          <div className="flex items-center gap-4">
            <a 
              href="#home" 
              onClick={playSwoosh}
              className="flex items-center gap-3.5 group cursor-pointer"
            >
              <div className="flex items-center gap-[4.5px]">
                <motion.span 
                  animate={{ scaleY: [1, 1.25, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                  className="w-2.5 h-6.5 bg-gradient-to-b from-white to-zinc-400 rounded-full transform -skew-x-[20deg] block origin-bottom" 
                />
                <motion.span 
                  animate={{ scaleY: [1, 1.35, 1] }}
                  transition={{ duration: 1.5, delay: 0.2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                  className="w-2.5 h-6.5 bg-gradient-to-b from-[#d4f82a] to-lime-500 rounded-full transform -skew-x-[20deg] block origin-bottom" 
                />
                <motion.span 
                  animate={{ scaleY: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, delay: 0.4, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                  className="w-2.5 h-6.5 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full transform -skew-x-[20deg] block origin-bottom" 
                />
              </div>
              <span className="font-display text-white text-2xl font-black tracking-[1.5px] uppercase ml-1 transition-all group-hover:text-orange-500">
                HoopHub
              </span>
            </a>
          </div>

          {/* MIDDLE GROUP: MAIN NAVIGATION LINKS */}
          <div className="hidden lg:flex items-center gap-2 relative">
            {navItems.map((item) => {
              const active = isActive(item.hash);
              return (
                <a
                  key={item.hash}
                  href={item.hash}
                  onClick={playSwoosh}
                  onMouseEnter={() => setHoveredHash(item.hash)}
                  onMouseLeave={() => setHoveredHash(null)}
                  className={`relative px-4 py-2 rounded-full font-display text-[12.5px] uppercase tracking-[1.5px] transition-colors duration-300 font-extrabold cursor-none ${
                    active ? 'text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {/* Sliding glass pill hover background */}
                  <AnimatePresence>
                    {hoveredHash === item.hash && (
                      <motion.span
                        layoutId="navHoverPill"
                        className="absolute inset-0 bg-white/[0.04] border border-white/[0.03] rounded-full -z-10"
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                      />
                    )}
                  </AnimatePresence>

                  {/* Text Label */}
                  <span className="relative z-10">{item.label}</span>

                  {/* Elegant bottom accent bar for active item */}
                  {active && (
                    <motion.span
                      layoutId="navActiveLine"
                      className="absolute -bottom-1 left-4 right-4 h-[2px] bg-gradient-to-r from-orange-500 to-[#d4f82a] rounded-full shadow-[0_1px_8px_rgba(249,115,22,0.5)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </div>

          {/* RIGHT GROUP: NAV ACTIONS & USER PROFILE */}
          <div className="flex items-center gap-3.5">
            {/* User Session Avatar Badge overlay */}
            {currentUser && (
              <div className="relative">
                <button 
                  onClick={handleDropdownToggle}
                  className="flex items-center gap-2.5 p-1.5 pr-3.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white cursor-pointer transition-all select-none active:scale-95 duration-150"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center font-mono text-[9px] font-black text-black shadow-[0_0_10px_rgba(249,115,22,0.3)]">
                    #{currentUser.jerseyNumber}
                  </div>
                  <span className="text-[10.5px] font-extrabold uppercase tracking-wide max-w-[75px] truncate hidden sm:inline">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <ChevronDown size={11} className={`text-zinc-500 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {showDropdown && (
                    <motion.div 
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 15, scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-neutral-950 border border-white/10 rounded-2xl p-3.5 shadow-[0_20px_40px_rgba(0,0,0,0.85)] z-[600] text-left"
                    >
                      <div className="pb-2 border-b border-white/5 mb-2.5 flex items-center justify-between font-mono text-[8px] text-zinc-500 uppercase">
                        Rank Checkpoint: <span className="text-[#d4f82a] font-extrabold">{currentUser.xp.toLocaleString()} XP</span>
                      </div>
                      <a href="#feed" onClick={() => setShowDropdown(false)} className="block px-3 py-2 text-[10.5px] font-bold uppercase tracking-wider text-zinc-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors">Profile</a>
                      <a href="#custom-lab" onClick={() => setShowDropdown(false)} className="block px-3 py-2 text-[10.5px] font-bold uppercase tracking-wider text-zinc-400 hover:text-white rounded-xl hover:bg-white/5 font-mono transition-colors">Custom Lab</a>
                      <button onClick={handleLogoutAction} className="w-full text-left block px-3 py-2 mt-1.5 text-[10.5px] font-extrabold uppercase tracking-wider text-red-400 hover:text-red-300 rounded-xl hover:bg-red-500/10 cursor-pointer transition-colors">Log Out</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Contact button */}
            <motion.button 
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => { playMetallicClick(); setIsContactOpen(true); }}
              className="bg-white hover:bg-[#d4f82a] hover:shadow-[0_0_20px_rgba(212,248,42,0.35)] text-black font-display text-[12px] font-black tracking-widest px-5.5 py-2.5 rounded-full uppercase transition-all flex items-center gap-1.5 cursor-pointer"
            >
              Contact
            </motion.button>

            {/* Modern Mobile Interactive Toggle Button */}
            <button
              onClick={() => { playMetallicClick(); setIsMobileMenuOpen(!isMobileMenuOpen); }}
              className="flex items-center justify-center lg:hidden w-10 h-10 rounded-full bg-white/[0.04] border border-white/10 text-white cursor-pointer hover:bg-white/[0.08] active:scale-95 transition-all text-sm font-bold"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </header>

      {/* MOBILE HUD NAVIGATION MENU STAGGERED DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-[74px] left-4 right-4 z-[490] lg:hidden bg-neutral-950/95 border border-white/[0.08] rounded-3xl p-5 shadow-[0_24px_55px_rgba(0,0,0,0.95)] backdrop-blur-xl"
          >
            <div className="flex flex-col gap-1.5 text-left">
              <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest ml-3 pb-1 border-b border-white/5 mb-1.5">Navigation Coordinates</span>
              {navItems.map((item, index) => {
                const active = isActive(item.hash);
                return (
                  <motion.a
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04 }}
                    key={item.hash}
                    href={item.hash}
                    onClick={() => { playSwoosh(); setIsMobileMenuOpen(false); }}
                    className={`px-4.5 py-3 rounded-2xl font-display text-sm uppercase tracking-[2px] transition-all flex items-center justify-between ${
                      active 
                        ? 'bg-gradient-to-r from-orange-500/10 to-[#d4f82a]/5 text-white font-black border-l-2 border-orange-500' 
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{item.label}</span>
                    {active && <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />}
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SECURED DIALOG: CONTACT US FORM */}
      <AnimatePresence>
        {isContactOpen && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[10000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="w-full max-w-sm bg-neutral-950 border border-white/[0.08] rounded-3xl p-6.5 relative shadow-[0_30px_70px_rgba(0,0,0,0.95)] space-y-4"
            >
              
              <div className="flex items-center justify-between pb-3.5 border-b border-white/5">
                <h3 className="font-display text-white text-[15px] font-black tracking-widest uppercase flex items-center gap-1.5">
                  <Mail size={15} className="text-orange-500 animate-pulse" /> Get in touch
                </h3>
                <button 
                  onClick={() => setIsContactOpen(false)} 
                  className="w-7 h-7 rounded-full bg-white/[0.04] hover:bg-white/[0.1] text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer text-xs font-semibold"
                >
                  ×
                </button>
              </div>

              {contactSent ? (
                <div className="text-center py-6 space-y-3.5">
                  <div className="w-11 h-11 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                    <Check size={18} />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">Inquiry Registered</h4>
                    <p className="text-[10.5px] text-zinc-400 leading-normal mt-1.5">Our experimental staff in the Tokyo & NYC court hub will reply back shortly.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4 text-left">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[8px] font-extrabold text-zinc-500 uppercase tracking-widest pl-1">Email Address</label>
                    <input 
                      type="email" 
                      required
                      placeholder="you@domain.com"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="bg-neutral-900/60 border border-white/[0.07] focus:border-orange-500/50 rounded-xl p-3 text-xs text-white outline-none w-full transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[8px] font-extrabold text-zinc-500 uppercase tracking-widest pl-1">Message Details</label>
                    <textarea 
                      required
                      rows={3}
                      placeholder="Describe court inquiries, custom ball orders, or sponsorship pitches..."
                      value={contactMsg}
                      onChange={(e) => setContactMsg(e.target.value)}
                      className="bg-neutral-900/60 border border-white/[0.07] focus:border-danger rounded-xl p-3 text-xs text-white outline-none w-full resize-none transition-all focus:border-orange-500/50"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-orange-600 to-amber-500 hover:brightness-110 active:scale-98 text-white font-display text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 rounded-xl transition-all cursor-pointer"
                  >
                    <Send size={11} /> Send Message
                  </button>
                </form>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
