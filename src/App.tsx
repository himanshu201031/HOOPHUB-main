/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import ThreeCanvas from './components/ThreeCanvas';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import StatsSection from './components/StatsSection';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer';
import ScrollVelocityTicker from './components/ScrollVelocityTicker';

// Basketball interactive custom preloader & cursor overlays
import BasketballLoader from './components/BasketballLoader';
import BasketballCursor from './components/BasketballCursor';

// Interactive modules
import StoreModule from './components/StoreModule';
import BookingModule from './components/BookingModule';
import CommunityModule from './components/CommunityModule';
import TournamentModule from './components/TournamentModule';
import CustomLab from './components/CustomLab';
import AuthModule from './components/AuthModule';

interface CurrentUser {
  email: string;
  name: string;
  jerseyNumber: string;
  position: string;
  xp: number;
}

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('y68_current_user');
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Could not parse cached current user session", e);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('y68_current_user');
    setCurrentUser(null);
    window.location.hash = '#home';
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#shop') setCurrentView('shop');
      else if (hash === '#booking') setCurrentView('booking');
      else if (hash === '#feed' || hash === '#community') setCurrentView('community');
      else if (hash === '#tournaments') setCurrentView('tournaments');
      else if (hash === '#kinetics' || hash === '#custom-lab') setCurrentView('custom-lab');
      else if (hash === '#login') setCurrentView('login');
      else if (hash === '#register') setCurrentView('register');
      else {
        setCurrentView('home');
      }
      
      // Auto scroll to top of viewport on page swap for premium polished usability
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Run check on load

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div id="landing-app-root" className="relative w-full min-h-screen bg-[var(--cream)] selection:bg-[var(--white)] selection:text-[#0A0A0A]">
      
      {/* Basketball-themed creative preloader overlay */}
      <BasketballLoader />

      {/* Custom interactive mouse cursor trailing trail */}
      <BasketballCursor />

      {/* Cinematic Film-Grain Noise Overlay Override */}
      <div className="noise-overlay" aria-hidden="true" />

      {/* Floating Pill Interaction Navbar */}
      <Navbar currentUser={currentUser} onLogout={handleLogout} />

      {/* Fixed Interactive 3D Canvas in absolute background (z-index: 10 inside) */}
      <ThreeCanvas />

      {/* Main Scroll Content Stack (z-index: 10 to ensure it floats on top of WebGL appropriately) */}
      <main id="main-content-timeline" className="relative z-[50] w-full flex flex-col pointer-events-none *:pointer-events-auto">
        
        {currentView === 'home' && (
          <>
            {/* SECTION 1 - HERO CAPABILITIES & LIQUID CARD */}
            <HeroSection />

            {/* SCROLL VELOCITY TICKER - dynamic marquee between hero & stats */}
            <ScrollVelocityTicker className="pointer-events-none" />

            {/* SECTION 2 - STATISTICS INTERACTIVES */}
            <StatsSection />

            {/* SECTION 3 - HOW IT WORKS CARDS */}
            <HowItWorks />
          </>
        )}

        {currentView === 'shop' && (
          <section className="pt-32 pb-16 px-6 md:px-12 max-w-7xl mx-auto w-full space-y-10 animate-fade-in">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/5 pb-8">
              <div className="space-y-1 text-left">
                <div className="flex items-center gap-2">
                  <a href="#home" className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider font-mono hover:text-orange-400 transition-colors flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-white/5 border border-white/5">
                    ← BACK TO HOME
                  </a>
                  <span className="text-[10px] text-zinc-700 font-mono">•</span>
                  <span className="text-[10px] text-orange-500 font-extrabold tracking-widest font-mono uppercase bg-orange-600/5 px-3 py-1 rounded-full">
                    🛒 Pro Gear Vault Shop
                  </span>
                </div>
                <h1 className="font-display font-medium text-4xl text-white uppercase mt-4 leading-tight tracking-tight">
                  PRO VAULT EQUIPMENT OUTPOST
                </h1>
                <p className="text-xs text-zinc-400 font-sans mt-2 max-w-2xl">
                  Equip yourself with premium signature basketballs, official jerseys, tactical sleeves, cone arrays, water bottles, and smart trackers with COD + UPI payment checkout.
                </p>
              </div>
            </div>
            <StoreModule />
          </section>
        )}

        {currentView === 'booking' && (
          <section className="pt-32 pb-16 px-6 md:px-12 max-w-7xl mx-auto w-full space-y-10 animate-fade-in">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/5 pb-8">
              <div className="space-y-1 text-left">
                <div className="flex items-center gap-2">
                  <a href="#home" className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider font-mono hover:text-orange-400 transition-colors flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-white/5 border border-white/5">
                    ← BACK TO HOME
                  </a>
                  <span className="text-[10px] text-zinc-700 font-mono">•</span>
                  <span className="text-[10px] text-orange-500 font-extrabold tracking-widest font-mono uppercase bg-orange-600/5 px-3 py-1 rounded-full">
                    📅 Court Reservation System
                  </span>
                </div>
                <h1 className="font-display font-medium text-4xl text-white uppercase mt-4 leading-tight tracking-tight">
                  KYOTO COURT DESK & MAP
                </h1>
                <p className="text-xs text-zinc-400 font-sans mt-2 max-w-2xl">
                  Filter premium hardwood, asphalt, AC air filtration, and floodlighting availability with live weather multipliers. Split pricing with friends on booking completion.
                </p>
              </div>
            </div>
            <BookingModule />
          </section>
        )}

        {currentView === 'community' && (
          <section className="pt-32 pb-16 px-6 md:px-12 max-w-7xl mx-auto w-full space-y-10 animate-fade-in">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/5 pb-8">
              <div className="space-y-1 text-left">
                <div className="flex items-center gap-2">
                  <a href="#home" className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider font-mono hover:text-orange-400 transition-colors flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-white/5 border border-white/5">
                    ← BACK TO HOME
                  </a>
                  <span className="text-[10px] text-zinc-700 font-mono">•</span>
                  <span className="text-[10px] text-orange-500 font-extrabold tracking-widest font-mono uppercase bg-orange-600/5 px-3 py-1 rounded-full">
                    👥 Metropolitan Players Feed
                  </span>
                </div>
                <h1 className="font-display font-medium text-4xl text-white uppercase mt-4 leading-tight tracking-tight">
                  METROPOLITAN PLAYERS BOARD
                </h1>
                <p className="text-xs text-zinc-400 mt-2 max-w-2xl">
                  Construct your athlete profile handle, publish playground match updates, search local teammates queue, and follow the regional street group timelines.
                </p>
              </div>
            </div>
            <CommunityModule />
          </section>
        )}

        {currentView === 'tournaments' && (
          <section className="pt-32 pb-16 px-6 md:px-12 max-w-7xl mx-auto w-full space-y-10 animate-fade-in">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/5 pb-8">
              <div className="space-y-1 text-left">
                <div className="flex items-center gap-2">
                  <a href="#home" className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider font-mono hover:text-orange-400 transition-colors flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-white/5 border border-white/5">
                    ← BACK TO HOME
                  </a>
                  <span className="text-[10px] text-zinc-700 font-mono">•</span>
                  <span className="text-[10px] text-orange-500 font-extrabold tracking-widest font-mono uppercase bg-orange-600/5 px-3 py-1 rounded-full">
                    🏆 Brackets & Competitions
                  </span>
                </div>
                <h1 className="font-display font-medium text-4xl text-white uppercase mt-4 leading-tight tracking-tight">
                  CHAMPIONSHIPS & LIVE SCORING
                </h1>
                <p className="text-xs text-zinc-400 mt-2 max-w-2xl">
                  Organize tournaments, pay seed registration, simulate instant tournament progressions from Quarters up to Finals, and follow the real-time MVP leaderboard metric blocks.
                </p>
              </div>
            </div>
            <TournamentModule />
          </section>
        )}

        {currentView === 'custom-lab' && (
          <section className="pt-32 pb-16 px-6 md:px-12 max-w-7xl mx-auto w-full space-y-10 animate-fade-in pointer-events-none">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/5 pb-8 pointer-events-auto">
              <div className="space-y-1 text-left">
                <div className="flex items-center gap-2">
                  <a href="#home" className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider font-mono hover:text-orange-400 transition-colors flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-white/5 border border-white/5">
                    ← BACK TO HOME
                  </a>
                  <span className="text-[10px] text-zinc-700 font-mono">•</span>
                  <span className="text-[10px] text-orange-500 font-extrabold tracking-widest font-mono uppercase bg-orange-600/5 px-3 py-1 rounded-full">
                    🧪 Advanced Interactive Custom Laboratory
                  </span>
                </div>
                <h1 className="font-display font-medium text-4xl text-white uppercase mt-4 leading-tight tracking-tight">
                  HoopHub CUSTOM EXPERIMENTAL LAB
                </h1>
                <p className="text-xs text-zinc-400 mt-2 max-w-2xl">
                  Welcome to the ultimate basketball physics sandbox and regimen laboratory. Tweak gravity, velocity vectors, elbow release alignments, build personalized custom training modules, and visualize dynamic joint data overlays.
                </p>
              </div>
            </div>
            <CustomLab />
          </section>
        )}

        {(currentView === 'login' || currentView === 'register') && (
          <section className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full flex flex-col items-center justify-center min-h-[75vh] animate-fade-in pointer-events-none">
            <div className="pointer-events-auto w-full flex flex-col items-center">
              <AuthModule 
                initialMode={currentView === 'login' ? 'signin' : 'signup'} 
                onAuthSuccess={(user) => {
                  setCurrentUser(user);
                  window.location.hash = '#feed';
                }} 
              />
            </div>
          </section>
        )}

        {/* SECTION 4 - METROPOLITAN REGIONAL FOOTERS */}
        <Footer />
        
      </main>

    </div>
  );
}
