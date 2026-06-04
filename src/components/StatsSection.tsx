import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { playMetallicClick, playSwoosh } from '../utils/audio';
import { Trophy, Award, Flame, Star, Activity, Plus, TrendingUp } from 'lucide-react';
import BorderGlow from './BorderGlow';

gsap.registerPlugin(ScrollTrigger);

interface MatchLog {
  id: string;
  opponent: string;
  points: number;
  assists: number;
  rebounds: number;
  result: 'W' | 'L';
  date: string;
}

interface Tournament {
  id: string;
  name: string;
  prizePool: string;
  entryFee: string;
  registeredTeams: number;
  maxTeams: number;
  date: string;
  joined?: boolean;
}

const INITIAL_MATCHES: MatchLog[] = [
  { id: 'm1', opponent: 'Mumbai Dragons', points: 18, assists: 4, rebounds: 6, result: 'W', date: 'May 25' },
  { id: 'm2', opponent: 'Shibuya Shadows', points: 22, assists: 6, rebounds: 5, result: 'W', date: 'May 21' },
  { id: 'm3', opponent: 'Delhi Samurai', points: 15, assists: 3, rebounds: 8, result: 'L', date: 'May 18' }
];

const INITIAL_TOURNAMENTS: Tournament[] = [
  { id: 'tour1', name: 'Mumbai 3x3 Autumn Street Slam', prizePool: '₹2,00,000', entryFee: '₹4,000', registeredTeams: 12, maxTeams: 16, date: 'June 15' },
  { id: 'tour2', name: 'Bandra Twilight All-Stars', prizePool: '₹4,00,000 + Custom Gear', entryFee: 'Free (Invite)', registeredTeams: 6, maxTeams: 8, date: 'June 28' },
  { id: 'tour3', name: 'Delhi Underground Bracket', prizePool: '₹75,000', entryFee: '₹1,500', registeredTeams: 24, maxTeams: 32, date: 'July 10' }
];

export default function StatsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'track' | 'tournaments'>('track');
  
  // Game tracker states
  const [matches, setMatches] = useState<MatchLog[]>(INITIAL_MATCHES);
  const [oppTeam, setOppTeam] = useState('');
  const [pts, setPts] = useState(16);
  const [ast, setAst] = useState(5);
  const [reb, setReb] = useState(6);
  const [matchResult, setMatchResult] = useState<'W' | 'L'>('W');

  // Tournaments state
  const [tournaments, setTournaments] = useState<Tournament[]>(INITIAL_TOURNAMENTS);
  const [regTeamName, setRegTeamName] = useState('');
  const [selectedTourId, setSelectedTourId] = useState('tour1');

  useEffect(() => {
    // Scroll trigger entrance standard
    const el = containerRef.current;
    if (!el) return;

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 75%',
      onEnter: () => {
        gsap.to(el.querySelectorAll('.animate-fade'), {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.8,
          ease: 'expo.out',
          overwrite: 'auto'
        });
      },
      onLeaveBack: () => {
        gsap.set(el.querySelectorAll('.animate-fade'), {
          opacity: 0,
          y: 20
        });
      }
    });

    return () => {
      trigger.kill();
    };
  }, []);

  // Sync loaded states from storage
  useEffect(() => {
    try {
      const storedMatches = localStorage.getItem('y68_matches');
      if (storedMatches) setMatches(JSON.parse(storedMatches));

      const storedTours = localStorage.getItem('y68_tours');
      if (storedTours) setTournaments(JSON.parse(storedTours));
    } catch (e) {
      console.warn('Storage syncing failed', e);
    }
  }, []);

  const saveMatches = (updated: MatchLog[]) => {
    setMatches(updated);
    localStorage.setItem('y68_matches', JSON.stringify(updated));
  };

  const saveTours = (updated: Tournament[]) => {
    setTournaments(updated);
    localStorage.setItem('y68_tours', JSON.stringify(updated));
  };

  // Stats Calculations
  const calculateAverages = () => {
    if (matches.length === 0) return { ppg: 0, apg: 0, rpg: 0, winRate: 0 };
    const totalPts = matches.reduce((acc, m) => acc + m.points, 0);
    const totalAst = matches.reduce((acc, m) => acc + m.assists, 0);
    const totalReb = matches.reduce((acc, m) => acc + m.rebounds, 0);
    const wins = matches.filter(m => m.result === 'W').length;
    
    return {
      ppg: (totalPts / matches.length).toFixed(1),
      apg: (totalAst / matches.length).toFixed(1),
      rpg: (totalReb / matches.length).toFixed(1),
      winRate: Math.round((wins / matches.length) * 100)
    };
  };

  const currentStats = calculateAverages();

  // Add Match Game Log
  const handleRecordMatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oppTeam.trim()) return;

    const newMatch: MatchLog = {
      id: 'match_' + Date.now(),
      opponent: oppTeam.trim(),
      points: Number(pts),
      assists: Number(ast),
      rebounds: Number(reb),
      result: matchResult,
      date: 'May ' + new Date().getDate()
    };

    const updated = [newMatch, ...matches];
    saveMatches(updated);
    setOppTeam('');
    playSwoosh();

    // Trigger local rep scores highlight animation (simple effect)
    gsap.fromTo('#cumulative-tracker-panel', { scale: 0.98, opacity: 0.8 }, { scale: 1, opacity: 1, duration: 0.45, ease: 'elastic.out' });
  };

  const handleClearMatches = () => {
    playMetallicClick();
    if (window.confirm('Delete all game tracking history?')) {
      saveMatches([]);
    }
  };

  // Join Tournament
  const handleRegisterTournament = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regTeamName.trim()) return;

    const updated = tournaments.map(tour => {
      if (tour.id === selectedTourId) {
        return {
          ...tour,
          registeredTeams: Math.min(tour.registeredTeams + 1, tour.maxTeams),
          joined: true
        };
      }
      return tour;
    });

    saveTours(updated);
    setRegTeamName('');
    playSwoosh();

    // Spawn celebration banner
    const alertBox = document.createElement('div');
    alertBox.className = 'fixed bottom-6 left-6 z-[1000] glass-card border border-amber-500/30 p-4 rounded-2xl flex items-center gap-3 text-white pointer-events-auto shadow-2xl';
    alertBox.innerHTML = `
      <div class="w-8 h-8 rounded-full bg-amber-950 flex items-center justify-center text-amber-400 font-bold">🏆</div>
      <div>
        <h4 class="font-bold text-xs uppercase">Tournament Registered!</h4>
        <p class="text-[10px] text-zinc-400 font-normal">Team scheduled into brackets successfully.</p>
      </div>
    `;
    document.body.appendChild(alertBox);
    gsap.fromTo(alertBox, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.4, ease: 'back.out' });
    setTimeout(() => {
      gsap.to(alertBox, { opacity: 0, y: -20, duration: 0.3, onComplete: () => alertBox.remove() });
    }, 4500);
  };

  return (
    <section 
      id="stats-section" 
      ref={containerRef} 
      className="relative min-h-screen w-full flex flex-col md:flex-row items-center justify-between gap-12 px-6 md:px-16 py-24 md:py-36 bg-transparent overflow-hidden"
    >
      {/* BACKGROUND WATERMARK */}
      <div className="absolute -bottom-10 -left-6 font-display text-[clamp(10rem,22vw,17rem)] font-bold text-[rgba(255,255,255,0.015)] leading-none select-none pointer-events-none uppercase">
        ARENA
      </div>

      {/* LEFT COLUMN: DESCRIPTION HEADERS */}
      <div className="w-full md:max-w-[40%] space-y-4 z-10 text-left">
        <span className="section-eyebrow text-orange-500">
          REP DEVELOPMENT
        </span>
        <h2 className="font-display font-medium text-[clamp(2.6rem,5vw,4.8rem)] leading-[0.92] uppercase text-[var(--ink)]">
          TRACK STATS &<br />RULE THE SLAMS.
        </h2>
        <p className="font-sans text-[13px] leading-relaxed text-zinc-400 max-w-sm font-normal">
          Every bucket logged improves your standing in active streetball metrics. Join high-stakes tournament brackets near Mumbai or track your pickup averages live.
        </p>
        
        {/* Simple features specs labels checklist */}
        <div className="space-y-2 pt-2 text-[11px] text-zinc-500 font-medium">
          <div className="flex items-center gap-2">
            <span className="text-emerald-500 font-bold">✓</span>
            <span>Real-time individual street performance calculations</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-500 font-bold">✓</span>
            <span>Verified regional Mumbai & Delhi brackets & prize payouts</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-500 font-bold">✓</span>
            <span>Unlocks scouting profiles for local team recruitments</span>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: INTERACTIVE TABS WRAPPER (STATS ENGINE & TOURNAMENT BOARD) */}
      <div className="w-full md:max-w-[55%] bg-gradient-to-bl from-zinc-900 to-neutral-950 border border-white/[0.08] rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] z-10 animate-fade opacity-0 translate-y-5">
        
        {/* Toggle tabs headings */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] mb-5">
          <div className="flex gap-4">
            <button
              onClick={() => { playMetallicClick(); setActiveTab('track'); }}
              className={`text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'track' ? 'text-white border-b-2 border-orange-500 pb-1' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              📊 Live Stats Tracker
            </button>
            <button
              onClick={() => { playMetallicClick(); setActiveTab('tournaments'); }}
              className={`text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'tournaments' ? 'text-white border-b-2 border-orange-500 pb-1' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              🏆 Matches & Tournaments
            </button>
          </div>
          
          <span className="text-[9px] font-mono font-bold text-zinc-600 tracking-wider">SECURE LINK</span>
        </div>

        {/* TAB 1: DYNAMIC STATS TRACKER ENGINE */}
        {activeTab === 'track' && (
          <div className="space-y-5 text-left">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#FF6154] flex items-center gap-1.5 leading-none">
                <Flame size={12} className="animate-pulse" /> Your Real-Time Career Standing
              </span>
              {matches.length > 0 && (
                <button 
                  onClick={handleClearMatches}
                  className="text-[9px] text-zinc-500 hover:text-red-400 underline font-medium cursor-pointer"
                >
                  Reset History
                </button>
              )}
            </div>

            {/* Display Averages Bento Box */}
            <div 
              id="cumulative-tracker-panel" 
              className="grid grid-cols-4 gap-2 text-center"
            >
              <BorderGlow
                backgroundColor="#0b0b0d"
                borderRadius={16}
                glowRadius={24}
                glowIntensity={1.3}
                edgeSensitivity={30}
                coneSpread={28}
                colors={['#06b6d4', '#8b5cf6', '#3b82f6']}
                glowColor="190 95 60"
                animated={true}
              >
                <div className="p-3 w-full h-full flex flex-col justify-center">
                  <span className="block text-[8px] uppercase tracking-wider text-zinc-500 font-bold font-sans">Points/G</span>
                  <span className="block font-display text-[1.8rem] font-bold text-white tracking-widest mt-1">{currentStats.ppg}</span>
                </div>
              </BorderGlow>

              <BorderGlow
                backgroundColor="#0b0b0d"
                borderRadius={16}
                glowRadius={24}
                glowIntensity={1.3}
                edgeSensitivity={30}
                coneSpread={28}
                colors={['#10b981', '#14b8a6', '#06b6d4']}
                glowColor="160 85 50"
                animated={true}
              >
                <div className="p-3 w-full h-full flex flex-col justify-center">
                  <span className="block text-[8px] uppercase tracking-wider text-zinc-500 font-bold font-sans">Assists/G</span>
                  <span className="block font-display text-[1.8rem] font-bold text-white tracking-widest mt-1">{currentStats.apg}</span>
                </div>
              </BorderGlow>

              <BorderGlow
                backgroundColor="#0b0b0d"
                borderRadius={16}
                glowRadius={24}
                glowIntensity={1.3}
                edgeSensitivity={30}
                coneSpread={28}
                colors={['#8b5cf6', '#6366f1', '#ec4899']}
                glowColor="260 90 60"
                animated={true}
              >
                <div className="p-3 w-full h-full flex flex-col justify-center">
                  <span className="block text-[8px] uppercase tracking-wider text-zinc-500 font-bold font-sans">Rebounds/G</span>
                  <span className="block font-display text-[1.8rem] font-bold text-white tracking-widest mt-1">{currentStats.rpg}</span>
                </div>
              </BorderGlow>

              <BorderGlow
                backgroundColor="#1b120c"
                borderRadius={16}
                glowRadius={24}
                glowIntensity={1.3}
                edgeSensitivity={25}
                coneSpread={30}
                colors={['#f97316', '#ef4444', '#f59e0b']}
                glowColor="24 95 55"
                animated={true}
              >
                <div className="p-3 w-full h-full flex flex-col justify-center">
                  <span className="block text-[8px] uppercase tracking-wider text-orange-400 font-extrabold font-sans">Win Rate</span>
                  <span className="block font-display text-[1.8rem] font-bold text-orange-400 tracking-widest mt-1">{currentStats.winRate}%</span>
                </div>
              </BorderGlow>
            </div>

            {/* Input game logs form section */}
            <form onSubmit={handleRecordMatch} className="p-5 rounded-3xl bg-neutral-950 border border-white/[0.06] space-y-4 shadow-[0_10px_25px_rgba(0,0,0,0.4)]">
              <span className="text-[9px] font-bold uppercase text-zinc-400 tracking-wider block">Record Match Game Stats</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-[1.5fr_1fr_1fr_1fr_1fr] gap-2.5 items-end">
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[7.5px] font-bold uppercase text-zinc-500">Opponent Team</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Mumbai Tigers"
                    value={oppTeam}
                    onChange={(e) => setOppTeam(e.target.value)}
                    className="bg-[#0a0a0a] border border-white/[0.06] hover:border-zinc-700/80 focus:border-orange-500/40 rounded-xl p-2.5 text-[10px] text-white outline-none w-full font-medium transition-colors shadow-inner"
                  />
                </div>

                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[7.5px] font-bold uppercase text-zinc-500">Points</label>
                  <input 
                    type="number" 
                    min="0" 
                    max="100"
                    placeholder="18"
                    value={pts}
                    onChange={(e) => setPts(Math.max(0, Number(e.target.value)))}
                    className="bg-[#0a0a0a] border border-white/[0.06] hover:border-zinc-700/80 focus:border-orange-500/40 rounded-xl p-2.5 text-[10px] text-white outline-none w-full text-center font-mono font-bold transition-colors shadow-inner"
                  />
                </div>

                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[7.5px] font-bold uppercase text-zinc-500">Assists</label>
                  <input 
                    type="number" 
                    min="0" 
                    max="50"
                    placeholder="5"
                    value={ast}
                    onChange={(e) => setAst(Math.max(0, Number(e.target.value)))}
                    className="bg-[#0a0a0a] border border-white/[0.06] hover:border-zinc-700/80 focus:border-orange-500/40 rounded-xl p-2.5 text-[10px] text-white outline-none w-full text-center font-mono font-bold transition-colors shadow-inner"
                  />
                </div>

                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[7.5px] font-bold uppercase text-zinc-500">Rebounds</label>
                  <input 
                    type="number" 
                    min="0" 
                    max="50"
                    placeholder="6"
                    value={reb}
                    onChange={(e) => setReb(Math.max(0, Number(e.target.value)))}
                    className="bg-[#0a0a0a] border border-white/[0.06] hover:border-zinc-700/80 focus:border-orange-500/40 rounded-xl p-2.5 text-[10px] text-white outline-none w-full text-center font-mono font-bold transition-colors shadow-inner"
                  />
                </div>

                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[7.5px] font-bold uppercase text-zinc-500">Result</label>
                  <div className="grid grid-cols-2 bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-1 select-none font-extrabold text-[10px] shadow-inner">
                    <button 
                      type="button" 
                      onClick={() => setMatchResult('W')}
                      className={`rounded-md p-1 transition-all cursor-pointer ${matchResult === 'W' ? 'bg-emerald-600 text-white font-extrabold' : 'text-zinc-500'}`}
                    >
                      W
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setMatchResult('L')}
                      className={`rounded-md p-1 transition-all cursor-pointer ${matchResult === 'L' ? 'bg-red-600 text-white font-extrabold' : 'text-zinc-500'}`}
                    >
                      L
                    </button>
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-2 bg-orange-600 hover:bg-orange-500 text-white font-sans text-[10.5px] font-extrabold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus size={11} /> Save & Calculate rep score
              </button>
            </form>

            {/* Match History logs stack */}
            <div className="space-y-1.5">
              <span className="text-[8.5px] font-bold text-zinc-500 uppercase tracking-wider">Stored Match logs ({matches.length})</span>
              <div className="max-h-[140px] overflow-y-auto space-y-1 pr-1 scrollbar-thin">
                {matches.length === 0 ? (
                  <p className="text-[9.5px] text-zinc-600 italic">No games logged yet. Run pickups and record statistics!</p>
                ) : (
                  matches.map(m => (
                    <div key={m.id} className="p-2 rounded-xl bg-white/[0.01] border border-white/5 flex items-center justify-between text-[11px] hover:bg-white/[0.03] transition-all">
                      <div className="flex items-center gap-3">
                        <span className={`w-5.5 h-5.5 rounded-full flex items-center justify-center text-[9px] font-extrabold ${m.result === 'W' ? 'bg-emerald-950/60 text-emerald-400' : 'bg-red-950/60 text-red-400'}`}>
                          {m.result}
                        </span>
                        <div className="flex flex-col text-left">
                          <span className="font-bold text-white uppercase">{m.opponent}</span>
                          <span className="text-[8px] text-zinc-400">Date Logged: {m.date}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-300 font-semibold">
                        <span>PTS: <strong>{m.points}</strong></span>
                        <span className="opacity-30">·</span>
                        <span>AST: <strong>{m.assists}</strong></span>
                        <span className="opacity-30">·</span>
                        <span>REB: <strong>{m.rebounds}</strong></span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ACTIVE MATCH REGISTRATION BOARD */}
        {activeTab === 'tournaments' && (
          <div className="space-y-4 text-left">
            <div>
              <h3 className="font-display text-white uppercase text-md tracking-wider font-semibold leading-none">REGIONAL SLAM REGISTRATION</h3>
              <p className="text-[9px] text-zinc-400 font-medium leading-relaxed mt-0.5">Register team slots into verified municipal cash slams.</p>
            </div>

            {/* List Brackets */}
            <div className="space-y-3 max-h-[190px] overflow-y-auto pr-1">
              {tournaments.map(tour => (
                <div key={tour.id} className="p-4 rounded-2xl bg-neutral-950 border border-white/[0.06] hover:border-zinc-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all shadow-[0_8px_20px_rgba(0,0,0,0.3)]">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[11.5px] font-bold text-white uppercase tracking-wide">{tour.name}</span>
                      {tour.joined && (
                        <span className="px-2 py-0.2 bg-emerald-950 text-emerald-400 text-[8px] rounded border border-emerald-800/10 font-bold uppercase tracking-wide">
                          Registered
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[9px] text-zinc-400 font-medium">
                      <span>Prize: <strong className="text-orange-400">{tour.prizePool}</strong></span>
                      <span className="text-zinc-600">|</span>
                      <span>Fee: <strong>{tour.entryFee}</strong></span>
                      <span className="text-zinc-600">|</span>
                      <span>Starts: <strong>{tour.date}</strong></span>
                    </div>
                  </div>

                  {/* Registered headcount meter */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right leading-none">
                      <span className="font-mono text-[10.5px] font-bold text-white">{tour.registeredTeams} / {tour.maxTeams}</span>
                      <span className="block text-[7.5px] text-zinc-500 uppercase font-bold mt-1">Teams Signed</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick checkout bracket submission form */}
            <form onSubmit={handleRegisterTournament} className="p-5 rounded-3xl bg-neutral-950 border border-white/[0.06] space-y-4 shadow-[0_10px_25px_rgba(0,0,0,0.5)]">
              <span className="text-[9px] font-bold uppercase text-orange-400 tracking-wider block">Join a Tournament Slam Bracket</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-[1.5fr_1fr_0.6fr] gap-3 items-end">
                <div className="flex flex-col gap-1">
                  <label className="text-[8px] font-bold uppercase text-zinc-400">Your Team / Crew Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Mumbai Ronins"
                    value={regTeamName}
                    onChange={(e) => setRegTeamName(e.target.value)}
                    className="bg-[#0a0a0a] border border-white/[0.06] hover:border-zinc-700/80 focus:border-orange-500/40 rounded-xl p-2.5 text-xs text-white outline-none w-full font-medium transition-colors shadow-inner"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[8px] font-bold uppercase text-zinc-400">Select Tournament</label>
                  <select 
                    value={selectedTourId}
                    onChange={(e) => setSelectedTourId(e.target.value)}
                    className="bg-[#0a0a0a] border border-white/[0.06] hover:border-zinc-700/80 focus:border-orange-500/40 rounded-xl p-2.5 text-xs text-white outline-none cursor-pointer transition-colors shadow-inner"
                  >
                    {tournaments.map(tour => (
                      <option key={tour.id} value={tour.id} disabled={tour.joined} className="bg-neutral-950 text-white">
                        {tour.joined ? '✓ ' + tour.name.substring(0, 15) + '...' : tour.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button 
                  type="submit"
                  className="rounded-lg bg-orange-600 hover:bg-orange-500 text-white py-2 px-3 text-[11px] font-extrabold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer h-[36px]"
                >
                  Join
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </section>
  );
}
