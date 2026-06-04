import React, { useState, useEffect } from 'react';
import { Award, Trophy, Users, ShieldAlert, ArrowRight, Play, RefreshCw, Calendar, Flame, Dribbble, Target, Star, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { playMetallicClick, playSwoosh } from '../utils/audio';

interface Match {
  id: string;
  round: 'quarters' | 'semis' | 'finals';
  team1: string;
  score1: number;
  team2: string;
  score2: number;
  completed: boolean;
  winner?: string;
  timeSlot: string;
}

interface TeamRegister {
  name: string;
  captain: string;
  playersCount: number;
  seed: number;
}

const INITIAL_TEAMS: TeamRegister[] = [
  { name: 'Mumbai Ronins', captain: 'Kenji_S', playersCount: 5, seed: 1 },
  { name: 'Bandra Samurais', captain: 'Yuki_M', playersCount: 5, seed: 2 },
  { name: 'Bengaluru Shoguns', captain: 'Takeshi_O', playersCount: 6, seed: 3 },
  { name: 'Riverside Raptors', captain: 'Soma_T', playersCount: 5, seed: 4 },
  { name: 'Downtown Dragons', captain: 'Kai_R', playersCount: 5, seed: 5 },
  { name: 'Ninja Slashing 5', captain: 'Ryu_S', playersCount: 5, seed: 6 },
  { name: 'Delhi Krosses', captain: 'Hana_H', playersCount: 5, seed: 7 },
  { name: 'Gion Geishas Elite', captain: 'Sayuri_I', playersCount: 5, seed: 8 }
];

const INITIAL_MATCHES: Match[] = [
  // Quarters
  { id: 'q-1', round: 'quarters', team1: 'Mumbai Ronins', score1: 0, team2: 'Gion Geishas Elite', score2: 0, completed: false, timeSlot: '10:00 AM' },
  { id: 'q-2', round: 'quarters', team1: 'Riverside Raptors', score1: 0, team2: 'Downtown Dragons', score2: 0, completed: false, timeSlot: '11:15 AM' },
  { id: 'q-3', round: 'quarters', team1: 'Sakyo Samurais', score1: 0, team2: 'Kamo Krosses', score2: 0, completed: false, timeSlot: '12:30 PM' },
  { id: 'q-4', round: 'quarters', team1: 'Osaka Shoguns', score1: 0, team2: 'Ninja Slashing 5', score2: 0, completed: false, timeSlot: '01:45 PM' },
  
  // Semis (will load winners recursively)
  { id: 's-1', round: 'semis', team1: 'Winner QF1', score1: 0, team2: 'Winner QF2', score2: 0, completed: false, timeSlot: '03:15 PM' },
  { id: 's-2', round: 'semis', team1: 'Winner QF3', score1: 0, team2: 'Winner QF4', score2: 0, completed: false, timeSlot: '04:30 PM' },
  
  // Finals
  { id: 'f-1', round: 'finals', team1: 'Winner SF1', score1: 0, team2: 'Winner SF2', score2: 0, completed: false, timeSlot: '06:00 PM' }
];

export default function TournamentModule() {
  const [teams, setTeams] = useState<TeamRegister[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  
  // Real-time Play-By-Play Live Log
  const [liveLog, setLiveLog] = useState<string[]>([
    "📍 Tip-off preparations complete. Ready for asphalt heat!",
    "🏆 Winner takes home ₹1,20,000 Cash Purse and the golden Championship Ring."
  ]);
  
  // Organizer Form State
  const [tourneyName, setTourneyName] = useState<string>('Bandra Asphalt Summer Showdown');
  const [tourneyPrize, setTourneyPrize] = useState<string>('₹1,20,000 Cash Purse');
  const [tourneyDate, setTourneyDate] = useState<string>('2026-06-15');
  const [tourneyMaxTeams, setTourneyMaxTeams] = useState<number>(8);
  const [isOrganizerOpen, setIsOrganizerOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'bracket' | 'teams' | 'leaderboard'>('bracket');

  // Submit squad simulation
  const [newTeamName, setNewTeamName] = useState<string>('');
  const [captainName, setCaptainName] = useState<string>('');
  const [playersQty, setPlayersQty] = useState<number>(5);

  // Load persistence
  useEffect(() => {
    try {
      const storedTeams = localStorage.getItem('y68_tourney_teams');
      if (storedTeams) {
        setTeams(JSON.parse(storedTeams));
      } else {
        setTeams(INITIAL_TEAMS);
        localStorage.setItem('y68_tourney_teams', JSON.stringify(INITIAL_TEAMS));
      }

      const storedMatches = localStorage.getItem('y68_tourney_matches');
      if (storedMatches) {
        setMatches(JSON.parse(storedMatches));
      } else {
        setMatches(INITIAL_MATCHES);
        localStorage.setItem('y68_tourney_matches', JSON.stringify(INITIAL_MATCHES));
      }
    } catch (e) {
      console.warn("Local storage loading error on TournamentModule", e);
    }
  }, []);

  const saveTeams = (updated: TeamRegister[]) => {
    setTeams(updated);
    localStorage.setItem('y68_tourney_teams', JSON.stringify(updated));
  };

  const saveMatches = (updated: Match[]) => {
    setMatches(updated);
    localStorage.setItem('y68_tourney_matches', JSON.stringify(updated));
  };

  const handleRegisterTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim() || !captainName.trim()) return;

    if (teams.length >= tourneyMaxTeams) {
      alert(`⚠️ Registration Full! Max limit of ${tourneyMaxTeams} teams exceeded.`);
      return;
    }

    playSwoosh();
    const newTeam: TeamRegister = {
      name: newTeamName.trim(),
      captain: captainName.trim(),
      playersCount: playersQty,
      seed: teams.length + 1
    };

    const updated = [...teams, newTeam];
    saveTeams(updated);
    
    // reset form
    setNewTeamName('');
    setCaptainName('');
    setPlayersQty(5);
  };

  const handleResetTournament = () => {
    playMetallicClick();
    if (confirm("Are you sure you want to reset all bracket scores and restore initial teams registry?")) {
      saveTeams(INITIAL_TEAMS);
      saveMatches(INITIAL_MATCHES);
    }
  };

  // Simulates a single match score in real time and progresses winners automatically
  const handleSimulateMatch = (matchId: string) => {
    playSwoosh();
    const updated = [...matches];
    const matchIndex = updated.findIndex(m => m.id === matchId);
    if (matchIndex === -1) return;

    const match = updated[matchIndex];
    if (match.completed) return;

    // Simulate score
    let s1 = Math.floor(65 + Math.random() * 35);
    let s2 = Math.floor(65 + Math.random() * 35);
    while (s1 === s2) {
      s2 = Math.floor(65 + Math.random() * 35);
    }

    match.score1 = s1;
    match.score2 = s2;
    match.completed = true;
    const winner = s1 > s2 ? match.team1 : match.team2;
    const loser = s1 > s2 ? match.team2 : match.team1;
    match.winner = winner;

    // Narrative generation logs
    const scoreDiff = Math.abs(s1 - s2);
    let randomActionLog = "";
    if (scoreDiff <= 4) {
      randomActionLog = `⚡ CLUTCH CHOKE! @${winner[0]} slams a baseline mid-range jumper at the buzzer to secure ${winner}!`;
    } else if (scoreDiff > 15) {
      randomActionLog = `🔥 RUNAWAY BLOWOUT: ${winner} locks up ${loser} with aggressive transition press defense!`;
    } else {
      randomActionLog = `🏀 GAME POINT: ${winner} pulls off a beautiful pick-and-roll to break down ${loser}'s defense.`;
    }

    setLiveLog(prev => [
      `📢 [${match.round.toUpperCase()}] ${winner} defeats ${loser} (${Math.max(s1, s2)} - ${Math.min(s1, s2)})`,
      `  ↳ ${randomActionLog}`,
      ...prev
    ]);

    // Advance Round Logic
    if (match.id === 'q-1') {
      const sem = updated.find(m => m.id === 's-1');
      if (sem) sem.team1 = winner;
    } else if (match.id === 'q-2') {
      const sem = updated.find(m => m.id === 's-1');
      if (sem) sem.team2 = winner;
    } else if (match.id === 'q-3') {
      const sem = updated.find(m => m.id === 's-2');
      if (sem) sem.team1 = winner;
    } else if (match.id === 'q-4') {
      const sem = updated.find(m => m.id === 's-2');
      if (sem) sem.team2 = winner;
    } else if (match.id === 's-1') {
      const fin = updated.find(m => m.id === 'f-1');
      if (fin) fin.team1 = winner;
    } else if (match.id === 's-2') {
      const fin = updated.find(m => m.id === 'f-1');
      if (fin) fin.team2 = winner;
    }

    saveMatches(updated);
  };

  const handleSimulateAll = () => {
    playSwoosh();
    // Progress loop of elements
    const updated = [...matches];
    
    // Simulate Quarters
    updated.forEach(m => {
      if (m.round === 'quarters' && !m.completed) {
        m.score1 = Math.floor(70 + Math.random() * 30);
        m.score2 = Math.floor(70 + Math.random() * 30);
        if (m.score1 === m.score2) m.score2 += 2;
        m.completed = true;
        m.winner = m.score1 > m.score2 ? m.team1 : m.team2;
      }
    });

    // Sync Semis
    const q1Winner = updated.find(m => m.id === 'q-1')?.winner || 'Winner QF1';
    const q2Winner = updated.find(m => m.id === 'q-2')?.winner || 'Winner QF2';
    const q3Winner = updated.find(m => m.id === 'q-3')?.winner || 'Winner QF3';
    const q4Winner = updated.find(m => m.id === 'q-4')?.winner || 'Winner QF4';

    const s1 = updated.find(m => m.id === 's-1');
    if (s1) {
      s1.team1 = q1Winner;
      s1.team2 = q2Winner;
      if (!s1.completed) {
        s1.score1 = Math.floor(75 + Math.random() * 25);
        s1.score2 = Math.floor(75 + Math.random() * 25);
        if (s1.score1 === s1.score2) s1.score2 += 3;
        s1.completed = true;
        s1.winner = s1.score1 > s1.score2 ? s1.team1 : s1.team2;
      }
    }

    const s2 = updated.find(m => m.id === 's-2');
    if (s2) {
      s2.team1 = q3Winner;
      s2.team2 = q4Winner;
      if (!s2.completed) {
        s2.score1 = Math.floor(75 + Math.random() * 25);
        s2.score2 = Math.floor(75 + Math.random() * 25);
        if (s2.score1 === s2.score2) s2.score2 += 3;
        s2.completed = true;
        s2.winner = s2.score1 > s2.score2 ? s2.team1 : s2.team2;
      }
    }

    // Sync Finals
    const s1Winner = updated.find(m => m.id === 's-1')?.winner || 'Winner SF1';
    const s2Winner = updated.find(m => m.id === 's-2')?.winner || 'Winner SF2';
    
    const f1 = updated.find(m => m.id === 'f-1');
    if (f1) {
      f1.team1 = s1Winner;
      f1.team2 = s2Winner;
      if (!f1.completed) {
        f1.score1 = Math.floor(82 + Math.random() * 18);
        f1.score2 = Math.floor(82 + Math.random() * 18);
        if (f1.score1 === f1.score2) f1.score2 += 2;
        f1.completed = true;
        f1.winner = f1.score1 > f1.score2 ? f1.team1 : f1.team2;
      }
    }

    saveMatches(updated);

    const champ = f1?.winner || "Undecided";
    setLiveLog(prev => [
      `🏆 SPEED AUTO-SIMULATION COMPLETE: Bracket shootout finished!`,
      `👑 CHAMPION CROWNED: Congratulations to ${champ}!`,
      "⚡ All rounds locked. Tap reset setting to seed new contenders.",
      ...prev
    ]);
  };

  // MVP Data list
  const LEADERBOARD_STATS = [
    { rank: 1, player: 'Kenji_S', team: 'Mumbai Ronins', ppg: 28.5, apg: 7.2, rpg: 4.1 },
    { rank: 2, player: 'Takeshi_O', team: 'Bengaluru Shoguns', ppg: 24.1, apg: 1.8, rpg: 12.5 },
    { rank: 3, player: 'Yuki_M', team: 'Bandra Samurais', ppg: 22.8, apg: 8.9, rpg: 3.5 },
    { rank: 4, player: 'Soma_T', team: 'Riverside Raptors', ppg: 19.5, apg: 6.0, rpg: 8.2 },
    { rank: 5, player: 'Hana_H', team: 'Delhi Krosses', ppg: 18.2, apg: 10.4, rpg: 2.1 }
  ];

  return (
    <div className="space-y-6 text-left" id="tournament-module-root">
      
      {/* HEADER SPECTRUM CONTROL */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-2xl relative overflow-hidden">
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-600/10 border border-orange-500/20 flex items-center justify-center text-orange-400 select-none animate-bounce">
            <Trophy size={18} />
          </div>
          <div>
            <span className="text-[8.5px] font-bold text-zinc-500 uppercase tracking-widest block font-mono">FIXTURE CONTROL CENTER</span>
            <h3 className="font-display text-white text-base font-bold uppercase tracking-wider leading-none mt-0.5">{tourneyName}</h3>
            <span className="text-[10px] text-orange-400 font-mono font-medium block mt-1">Prize: {tourneyPrize} • Kickoff: {tourneyDate}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {(['bracket', 'teams', 'leaderboard'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => { playMetallicClick(); setActiveTab(tab); }}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider cursor-pointer ${
                activeTab === tab 
                  ? 'bg-orange-600 text-white shadow-xl' 
                  : 'bg-neutral-900/60 text-zinc-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              {tab === 'bracket' ? '🏆 Shootout Bracket' : tab === 'teams' ? '👥 Registrations' : '★ MVP stats'}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          {activeTab === 'bracket' && (
            <button
              onClick={handleSimulateAll}
              className="px-3 py-1.5 rounded-xl bg-white text-black hover:bg-zinc-200 text-[9.5px] font-extrabold uppercase tracking-wide cursor-pointer flex items-center gap-1.5 transition-transform"
            >
              <Play size={10} className="fill-black" /> Auto Simulate
            </button>
          )}

          <button 
            onClick={() => { playMetallicClick(); setIsOrganizerOpen(!isOrganizerOpen); }}
            className="p-1 px-2 rounded-xl bg-neutral-900/80 border border-white/10 hover:border-white/20 text-zinc-300 hover:text-white flex items-center gap-1.5 text-[9.5px] font-bold cursor-pointer"
          >
            ⚙ Organizer
          </button>
        </div>

      </div>

      {/* PLAY-BY-PLAY EVENT SIMULATION TICKER */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[8.5px] font-bold text-orange-400 font-mono uppercase tracking-widest flex items-center gap-1.5 leading-none">
            <Flame size={11} className="text-orange-500 animate-pulse" /> Live Play-by-Play Bulletin
          </span>
          <span className="text-[8px] font-mono bg-white/[0.04] text-zinc-500 px-2 py-0.5 rounded-full border border-white/5">
            Real-time Roster Feed
          </span>
        </div>

        <div className="bg-[#070707] rounded-xl p-3 border border-white/5 h-[80px] overflow-y-auto space-y-1 scrollbar-none select-text">
          {liveLog.map((log, lIdx) => (
            <div key={lIdx} className={`text-[9.5px] font-mono text-zinc-300 leading-relaxed border-b border-white/[0.02] pb-1 last:border-0 last:pb-0 flex items-start gap-1 ${lIdx === 0 ? 'text-orange-400 font-bold' : ''}`}>
              <span className="text-orange-500">»</span>
              <span>{log}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ORGANIZER DOCKET POPUP FORM */}
      {isOrganizerOpen && (
        <div className="p-4 bg-[#0a0a0a] border border-orange-500/10 rounded-2xl space-y-4">
          <span className="text-[9px] font-bold text-orange-400 uppercase tracking-widest block font-mono">SETTINGS: REDEFINE TOURNAMENT</span>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs leading-none">
            <div className="flex flex-col gap-1.5">
              <span className="text-[8px] text-zinc-500 uppercase tracking-wider font-mono">Tournament Logo Title</span>
              <input 
                type="text" 
                value={tourneyName}
                onChange={(e) => setTourneyName(e.target.value)}
                className="bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-white outline-none font-bold"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[8px] text-zinc-500 uppercase tracking-wider font-mono">Prize Purse Description</span>
              <input 
                type="text" 
                value={tourneyPrize}
                onChange={(e) => setTourneyPrize(e.target.value)}
                className="bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-white outline-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[8px] text-zinc-500 uppercase tracking-wider font-mono">Commence Date</span>
              <input 
                type="date" 
                value={tourneyDate}
                onChange={(e) => setTourneyDate(e.target.value)}
                className="bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-white outline-none font-mono font-medium"
              />
            </div>
            <div className="flex flex-col justify-end gap-1 font-mono">
              <button 
                onClick={handleResetTournament}
                className="py-2.5 rounded-lg bg-red-950/40 text-red-400 border border-red-900/40 hover:bg-red-950 text-[10px] uppercase font-bold"
              >
                Reset Scores
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: BRACKET VISUAL INTERACTIVES */}
      {activeTab === 'bracket' && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Target size={14} className="text-orange-500" />
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block font-mono">CHAMPIONSHIP TOURNEY SLAM BRACKET</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative select-none">
            
            {/* ROUND 1: QUARTERS */}
            <div className="space-y-4">
              <span className="px-3 py-2 bg-gradient-to-r from-neutral-900 to-neutral-950 border border-white/[0.08] text-[9.5px] text-zinc-300 font-bold uppercase tracking-widest block text-center rounded-xl shadow-lg">
                Quarter Finals (QF)
              </span>

              <div className="space-y-4">
                {matches.filter(m => m.round === 'quarters').map(m => {
                  return (
                    <div 
                      key={m.id}
                      className={`p-4 bg-neutral-950 border rounded-2xl space-y-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative transition-all duration-300 hover:-translate-y-1 ${
                        m.completed 
                          ? 'border-white/[0.06] hover:border-white/[0.15] hover:shadow-[0_12px_30px_rgba(255,255,255,0.02)]' 
                          : 'border-orange-500/20 hover:border-orange-500/40 hover:shadow-[0_12px_30px_rgba(234,88,12,0.05)]'
                      }`}
                    >
                      <div className="flex items-center justify-between pb-1">
                        <span className="text-[8px] font-mono font-bold bg-[#141414] text-zinc-500 border border-white/5 px-2 py-0.5 rounded uppercase">{m.id}</span>
                        <span className="text-[8.5px] text-zinc-500 font-mono font-bold">{m.timeSlot}</span>
                      </div>
                      
                      <div className="space-y-2 pr-2">
                        <div className={`flex justify-between items-center font-sans font-medium text-[12px] ${m.winner === m.team1 ? 'text-orange-500 font-bold' : 'text-zinc-300'}`}>
                          <span className="truncate">{m.team1}</span>
                          <span className="font-mono text-[13px] font-bold bg-white/[0.02] border border-white/5 px-2 py-0.5 rounded">{m.score1}</span>
                        </div>
                        <div className={`flex justify-between items-center font-sans font-medium text-[12px] ${m.winner === m.team2 ? 'text-orange-500 font-bold' : 'text-zinc-300'}`}>
                          <span className="truncate">{m.team2}</span>
                          <span className="font-mono text-[13px] font-bold bg-white/[0.02] border border-white/5 px-2 py-0.5 rounded">{m.score2}</span>
                        </div>
                      </div>

                      {!m.completed ? (
                        <button
                          onClick={() => handleSimulateMatch(m.id)}
                          className="w-full mt-2 py-2 bg-white hover:bg-neutral-200 text-black text-[9.5px] uppercase font-extrabold tracking-wider rounded-xl cursor-pointer transition-colors"
                        >
                          Sim Match
                        </button>
                      ) : (
                        <div className="text-[8.5px] text-emerald-400 font-mono font-bold uppercase tracking-widest text-center mt-2 pt-2 border-t border-white/[0.04] flex items-center justify-center gap-1">
                          <CheckCircle size={10} /> Finished (Winner: {m.winner?.replace('Winner ', '')})
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ROUND 2: SEMIS */}
            <div className="space-y-4">
              <span className="px-3 py-2 bg-gradient-to-r from-neutral-900 to-neutral-950 border border-white/[0.08] text-[9.5px] text-zinc-300 font-bold uppercase tracking-widest block text-center rounded-xl shadow-lg">
                Semi Finals (SF)
              </span>

              <div className="space-y-8 pt-4 md:pt-[52px]">
                {matches.filter(m => m.round === 'semis').map(m => {
                  return (
                    <div 
                      key={m.id}
                      className={`p-4 bg-neutral-950 border rounded-2xl space-y-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative transition-all duration-300 hover:-translate-y-1 ${
                        m.completed 
                          ? 'border-white/[0.06] hover:border-white/[0.15] hover:shadow-[0_12px_30px_rgba(255,255,255,0.02)]' 
                          : 'border-amber-500/20 hover:border-amber-500/40 hover:shadow-[0_12px_30px_rgba(217,119,6,0.05)]'
                      }`}
                    >
                      <div className="flex items-center justify-between pb-1">
                        <span className="text-[8px] font-mono font-bold bg-[#141414] text-zinc-500 border border-white/5 px-2 py-0.5 rounded uppercase">{m.id}</span>
                        <span className="text-[8.5px] text-zinc-500 font-mono font-bold">{m.timeSlot}</span>
                      </div>

                      <div className="space-y-2 pr-2">
                        <div className={`flex justify-between items-center font-sans font-medium text-[12px] ${m.winner === m.team1 ? 'text-orange-500 font-bold' : 'text-zinc-300'}`}>
                          <span className="truncate">{m.team1 || 'TBD'}</span>
                          <span className="font-mono text-[13px] font-bold bg-white/[0.02] border border-white/5 px-2 py-0.5 rounded">{m.score1}</span>
                        </div>
                        <div className={`flex justify-between items-center font-sans font-medium text-[12px] ${m.winner === m.team2 ? 'text-orange-500 font-bold' : 'text-zinc-300'}`}>
                          <span className="truncate">{m.team2 || 'TBD'}</span>
                          <span className="font-mono text-[13px] font-bold bg-white/[0.02] border border-white/5 px-2 py-0.5 rounded">{m.score2}</span>
                        </div>
                      </div>

                      {!m.completed && m.team1 !== 'Winner QF1' && m.team1 !== 'Winner QF3' && m.team2 !== 'Winner QF2' && m.team2 !== 'Winner QF4' ? (
                        <button
                          onClick={() => handleSimulateMatch(m.id)}
                          className="w-full mt-2 py-2 bg-white hover:bg-neutral-200 text-black text-[9.5px] uppercase font-extrabold tracking-wider rounded-xl cursor-pointer transition-colors"
                        >
                          Sim Semis
                        </button>
                      ) : m.completed ? (
                        <div className="text-[8.5px] text-amber-400 font-mono font-bold uppercase tracking-widest text-center mt-2 pt-2 border-t border-white/[0.04] flex items-center justify-center gap-1">
                          <CheckCircle size={10} /> Winner: {m.winner}
                        </div>
                      ) : (
                        <div className="text-[9px] text-zinc-500 font-normal text-center mt-2 pt-1 border-t border-white/[0.02] italic">
                          Awaiting match shootout
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ROUND 3: FINAL MATCH */}
            <div className="space-y-4">
              <span className="px-3 py-2 bg-gradient-to-r from-neutral-900 to-neutral-950 border border-white/[0.08] text-[9.5px] text-zinc-300 font-bold uppercase tracking-widest block text-center rounded-xl shadow-lg">
                Grand Finale
              </span>

              <div className="space-y-8 pt-4 md:pt-[130px]">
                {matches.filter(m => m.round === 'finals').map(m => {
                  const hasCompetitors = m.team1 !== 'Winner SF1' && m.team2 !== 'Winner SF2';
                  return (
                    <div 
                      key={m.id}
                      className={`p-5 bg-gradient-to-br from-neutral-950 to-[#120e09] border rounded-2xl space-y-3 shadow-[0_15px_40px_rgba(0,0,0,0.6)] relative transition-all duration-300 hover:-translate-y-1 ${
                        m.completed ? 'border-yellow-500 shadow-yellow-500/5' : 'border-yellow-500/30'
                      }`}
                    >
                      <span className="absolute top-2 right-3 text-[8px] text-yellow-500 font-mono uppercase font-extrabold animate-pulse tracking-widest bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">
                        Championship Game
                      </span>
                      
                      <div className="space-y-3 pr-2 pt-2">
                        <div className={`flex justify-between items-center font-display text-[13.5px] ${m.winner === m.team1 ? 'text-yellow-400 font-extrabold' : 'text-zinc-300'}`}>
                          <span className="truncate">{m.team1}</span>
                          <span className="font-mono text-[15px] font-bold bg-white/[0.02] border border-white/5 px-2.5 py-0.5 rounded text-white">{m.score1}</span>
                        </div>
                        <div className={`flex justify-between items-center font-display text-[13.5px] ${m.winner === m.team2 ? 'text-yellow-400 font-extrabold' : 'text-zinc-300'}`}>
                          <span className="truncate">{m.team2}</span>
                          <span className="font-mono text-[15px] font-bold bg-white/[0.02] border border-white/5 px-2.5 py-0.5 rounded text-white">{m.score2}</span>
                        </div>
                      </div>

                      {hasCompetitors && !m.completed ? (
                        <button
                          onClick={() => handleSimulateMatch(m.id)}
                          className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold text-[10.5px] uppercase tracking-wide rounded-xl cursor-pointer transition-all"
                        >
                          Sim Grand Finals
                        </button>
                      ) : m.completed ? (
                        <div className="relative mt-3 pt-3 border-t border-yellow-500/20 bg-yellow-500/5 p-1.5 rounded-lg flex items-center justify-center">
                          {/* Particle Explosion Effects */}
                          <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-visible z-0">
                            {[...Array(20)].map((_, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                                animate={{ 
                                  opacity: 0, 
                                  scale: Math.random() * 2 + 0.5, 
                                  x: (Math.random() - 0.5) * 250, 
                                  y: (Math.random() - 0.5) * 250 
                                }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="absolute w-1.5 h-1.5 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,1)]"
                              />
                            ))}
                            {[...Array(10)].map((_, i) => (
                              <motion.div
                                key={`star-${i}`}
                                initial={{ opacity: 1, scale: 0, x: 0, y: 0, rotate: 0 }}
                                animate={{ 
                                  opacity: 0, 
                                  scale: Math.random() * 2, 
                                  x: (Math.random() - 0.5) * 200, 
                                  y: (Math.random() - 0.5) * 200,
                                  rotate: Math.random() * 180
                                }}
                                transition={{ duration: 2, ease: "easeOut" }}
                                className="absolute w-2 h-2 text-yellow-500 flex items-center justify-center"
                              >
                                <Star size={8} fill="currentColor" />
                              </motion.div>
                            ))}
                          </div>
                          
                          <motion.div 
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 12 }}
                            className="text-[10px] text-yellow-400 font-extrabold uppercase tracking-widest flex items-center justify-center gap-1.5 animate-pulse z-10"
                          >
                            🏆 CHAMPION: {m.winner}
                          </motion.div>
                        </div>
                      ) : (
                        <div className="text-[9px] text-zinc-500 text-center mt-2 pt-1 border-t border-white/[0.02] italic">
                          Awaiting semifinal clearance
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: REGISTERED SQUADS / TEAMS GRID */}
      {activeTab === 'teams' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          <div className="md:col-span-8 space-y-4">
            <span className="text-[9.5px] font-bold text-zinc-500 uppercase tracking-widest block font-mono">REGISTERED SQUADS ({teams.length})</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {teams.map((tm, idx) => (
                <div key={idx} className="p-4 bg-neutral-950 border border-white/[0.06] hover:border-emerald-500/40 transition-all duration-300 hover:-translate-y-0.5 rounded-2xl flex flex-col justify-between text-xs space-y-3.5 shadow-xl">
                  <div className="space-y-2 text-left">
                    <div className="flex items-center justify-between">
                      <h4 className="font-display text-white text-[13.5px] font-bold uppercase tracking-wider">{tm.name}</h4>
                      <span className="text-[8.5px] font-mono bg-[#111] border border-white/5 px-2 py-0.5 rounded-full text-zinc-400 font-bold">Seed #0{tm.seed}</span>
                    </div>
                    <div className="text-[11px] leading-relaxed text-zinc-400 space-y-0.5">
                      <p className="flex items-center gap-1.5"><span className="text-zinc-600 font-mono">Captain:</span> <strong className="text-white">@{tm.captain}</strong></p>
                      <p className="flex items-center gap-1.5"><span className="text-zinc-600 font-mono">Roster Size:</span> <strong className="text-orange-400">{tm.playersCount} Players</strong></p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/[0.04] text-[8.5px] text-emerald-400 font-bold uppercase font-mono tracking-widest flex items-center gap-1.5">
                    <CheckCircle size={10} /> SQUAD PASSPORT VERIFIED
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* REGISTER SQUAD SUBMIT FORM */}
          <div className="md:col-span-4">
            <div className="p-5 bg-neutral-950 border border-white/[0.08] rounded-2xl space-y-4 sticky top-24 shadow-2xl">
              <span className="text-[9.5px] font-bold text-orange-500 uppercase tracking-widest block font-mono">REGISTRATION DESK FORM</span>
              <p className="text-[11px] text-zinc-400 leading-relaxed font-normal font-sans">
                Organizing a local squad ? Pay matching registration of $50 (COD or UPI simulated) to enter bracket schedules.
              </p>

              <form onSubmit={handleRegisterTeam} className="space-y-4 leading-none">
                <div className="flex flex-col gap-1.5 text-xs">
                  <label className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest font-mono">Team Name Label</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Kanbara Thunderbolts"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    className="bg-neutral-900 border border-white/5 text-white outline-none w-full font-bold p-3 rounded-xl focus:border-orange-500/40 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest font-mono">Captain Handle</label>
                    <input 
                      type="text" 
                      required
                      placeholder="@jane_doe"
                      value={captainName}
                      onChange={(e) => setCaptainName(e.target.value)}
                      className="bg-neutral-900 border border-white/5 text-white outline-none w-full font-mono p-3 rounded-xl focus:border-orange-500/40 transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest font-mono">Roster count</label>
                    <select 
                      value={playersQty}
                      onChange={(e) => setPlayersQty(parseInt(e.target.value))}
                      className="bg-neutral-900 border border-white/5 text-white outline-none cursor-pointer font-bold p-3 rounded-xl focus:border-orange-500/40 transition-colors"
                    >
                      <option value="5">5 Players</option>
                      <option value="6">6 Players (+Sub)</option>
                      <option value="7">7 Players (+Sub)</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-500 hover:text-black font-extrabold text-xs uppercase text-white tracking-wider cursor-pointer shadow-xl transition-all"
                >
                  Pay & Lock Squad Spot
                </button>
              </form>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: MVP LEADERBOARDS columns */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-4">
          <span className="text-[9.5px] font-bold text-zinc-500 uppercase tracking-widest block font-mono">ATHLETIC PERFORMANCES LEDGER</span>
          
          <div className="overflow-x-auto bg-[#0a0a0a] border border-white/[0.08] rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.6)]">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="text-[9px] uppercase bg-neutral-900/50 border-b border-white/[0.08] text-zinc-400 font-mono tracking-widest">
                <tr>
                  <th className="p-4 pl-6">Rank</th>
                  <th className="p-4">Athlete</th>
                  <th className="p-4">Squad</th>
                  <th className="p-4 text-center">Points (PPG)</th>
                  <th className="p-4 text-center">Assists (APG)</th>
                  <th className="p-4 text-center">Rebounds (RPG)</th>
                  <th className="p-4 text-right pr-6">Status Index</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {LEADERBOARD_STATS.map(stat => (
                  <tr key={stat.rank} className="last:border-0 hover:bg-white/[0.03] transition-colors leading-normal items-center">
                    <td className="p-4.5 pl-6 font-mono text-[13px] text-orange-500 font-black">#0{stat.rank}</td>
                    <td className="p-4.5 font-display font-semibold text-white uppercase tracking-wider text-[11.5px]">{stat.player}</td>
                    <td className="p-4.5 text-zinc-400 font-sans text-[11.5px]">{stat.team}</td>
                    <td className="p-4.5 text-center text-white font-mono font-black text-[13px]">{stat.ppg}</td>
                    <td className="p-4.5 text-center text-zinc-300 font-mono text-[12px]">{stat.apg}</td>
                    <td className="p-4.5 text-center text-zinc-300 font-mono text-[12px]">{stat.rpg}</td>
                    <td className="p-4.5 text-right pr-6">
                      <span className={`text-[8px] font-bold px-2.5 py-1 rounded-full font-mono uppercase border ${
                        stat.rank === 1 
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                          : 'bg-white/[0.02] text-zinc-400 border-white/5'
                      }`}>
                        {stat.rank === 1 ? '👑 POY Leader' : 'Slam Elite'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
