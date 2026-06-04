import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { playMetallicClick, playSwoosh } from '../utils/audio';
import { MessageSquare, Calendar, UserCheck, Star, Users, Award, Compass } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Coach {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  availableSlot: string;
}

interface CommunityPost {
  id: string;
  sender: string;
  text: string;
  timeSec: string;
  topic: string;
}

const COACHES: Coach[] = [
  { id: 'h1', name: 'Coach Kenji Miller', specialty: 'Elite Shooting & Fundamentals', experience: '12 Yrs / Ex-Pro', price: 65, rating: 4.9, reviews: 84, image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=150&q=80', availableSlot: '05:00 PM Tonight' },
  { id: 'h2', name: 'Trainer Sarah Lin', specialty: 'Court Vision & Handling Speed', experience: '8 Yrs / D1 Guard', price: 55, rating: 4.8, reviews: 112, image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=150&q=80', availableSlot: '04:30 PM Tomorrow' },
  { id: 'h3', name: 'Coach Marcus Vance', specialty: 'Vertical Jump & Defensive IQ', experience: '15 Yrs / FIBA Trainer', price: 75, rating: 5.0, reviews: 42, image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=150&q=80', availableSlot: '02:00 PM This Sat' }
];

const INITIAL_POSTS: CommunityPost[] = [
  { id: 'p1', sender: 'Matt_H', text: 'Running 3v3s at Sakura Court yard around 6 PM tonight. Need a center or forward to close out our squad. Just show up!', timeSec: '5 min ago', topic: 'Looking for Group' },
  { id: 'p2', sender: 'TakaSora', text: 'Selling a slightly used Wilson NCAA Replica standard ball (Size 7). Good grip, holding air perfect. Only ¥4,000, pick up tonight.', timeSec: '25 min ago', topic: 'Buy/Sell' },
  { id: 'p3', sender: 'SenseiShooter', text: 'Shallow elbow mechanics tip: make sure your index/middle fingers form a clear V shape at your release channel for better rotation!', timeSec: '1 hr ago', topic: 'Tips & Drills' }
];

export default function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'coaching' | 'community'>('coaching');

  // Interactive Coaching State
  const [scheduledCoaches, setScheduledCoaches] = useState<{ coachId: string; coachName: string; time: string }[]>([]);
  const [trainingDate, setTrainingDate] = useState('Today');
  const [trainingTime, setTrainingTime] = useState('05:00 PM');
  const [selectedCoachId, setSelectedCoachId] = useState('h1');

  // Interactive Community state
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_POSTS);
  const [chatName, setChatName] = useState('');
  const [chatText, setChatText] = useState('');
  const [chatTopic, setChatTopic] = useState('Looking for Group');

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Staggered contents entrance configuration
    const targets = el.querySelectorAll('.how-reveal');

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 75%',
      onEnter: () => {
        gsap.to(targets, {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 1.1,
          ease: 'power4.out',
          overwrite: 'auto'
        });
      },
      onLeaveBack: () => {
        gsap.set(targets, {
          opacity: 0,
          y: 35
        });
      }
    });

    return () => {
      trigger.kill();
    };
  }, []);

  // Sync loaded states
  useEffect(() => {
    try {
      const storedScheduled = localStorage.getItem('y68_scheduled_coaches');
      if (storedScheduled) setScheduledCoaches(JSON.parse(storedScheduled));

      const storedPosts = localStorage.getItem('y68_posts');
      if (storedPosts) setPosts(JSON.parse(storedPosts));
    } catch(e) {
      console.warn('Storage syncing failed', e);
    }
  }, []);

  const saveScheduled = (updated: typeof scheduledCoaches) => {
    setScheduledCoaches(updated);
    localStorage.setItem('y68_scheduled_coaches', JSON.stringify(updated));
  };

  const savePosts = (updated: CommunityPost[]) => {
    setPosts(updated);
    localStorage.setItem('y68_posts', JSON.stringify(updated));
  };

  // Schedule Coach Handler
  const handleScheduleCoach = () => {
    const coach = COACHES.find(c => c.id === selectedCoachId) || COACHES[0];
    const newSchedule = {
      coachId: coach.id,
      coachName: coach.name,
      time: `${trainingDate} at ${trainingTime}`
    };

    const updated = [newSchedule, ...scheduledCoaches];
    saveScheduled(updated);
    playSwoosh();

    // Confirmation banner popup
    const alertBox = document.createElement('div');
    alertBox.className = 'fixed bottom-6 left-6 z-[1000] glass-card border border-orange-500/30 p-4 rounded-2xl flex items-center gap-3 text-white pointer-events-auto shadow-2xl';
    alertBox.innerHTML = `
      <div class="w-8 h-8 rounded-full bg-orange-950 flex items-center justify-center text-orange-400">📅</div>
      <div>
        <h4 class="font-bold text-xs uppercase">Coach Scheduled!</h4>
        <p class="text-[10px] text-zinc-400 font-normal">Your workout slot with ${coach.name} is booked.</p>
      </div>
    `;
    document.body.appendChild(alertBox);
    gsap.fromTo(alertBox, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.4, ease: 'back.out' });
    setTimeout(() => {
      gsap.to(alertBox, { opacity: 0, y: -20, duration: 0.3, onComplete: () => alertBox.remove() });
    }, 4000);
  };

  const handleCancelCoach = (cId: string) => {
    playMetallicClick();
    const filtered = scheduledCoaches.filter(item => item.coachId !== cId);
    saveScheduled(filtered);
  };

  // Add Community Notice Blackboard Post
  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatName.trim() || !chatText.trim()) return;

    const newPost: CommunityPost = {
      id: 'post_' + Date.now(),
      sender: chatName.trim(),
      text: chatText.trim(),
      timeSec: 'Active now',
      topic: chatTopic
    };

    const updated = [newPost, ...posts];
    savePosts(updated);
    setChatText('');
    setChatName('');
    playSwoosh();
  };

  const handleClearPosts = () => {
    playMetallicClick();
    if (window.confirm('Reset community blackboard notices?')) {
      savePosts([]);
    }
  };

  return (
    <section 
      id="how-section" 
      ref={containerRef} 
      className="relative min-h-screen w-full flex flex-col md:flex-row items-center justify-end px-6 md:px-16 py-24 md:py-36 bg-transparent overflow-hidden"
    >
      {/* BACKGROUND WATERMARK */}
      <div className="absolute top-1/2 -right-6 -translate-y-1/2 font-display text-[clamp(10rem,22vw,18rem)] font-bold text-[rgba(255,255,255,0.015)] leading-none select-none pointer-events-none uppercase">
        HUD
      </div>

      {/* LEFT COLUMN: DESCRIPTIONS & SUBHEADER (FLIPPED LAYOUT ACCORDING TO HERO ROTATING TENDENCY OR HOW-IT-WORKS REAR CONTEXT) */}
      <div className="w-full md:max-w-[40%] space-y-4 z-10 text-left order-2 md:order-1 md:ml-6 mt-12 md:mt-0">
        <span className="section-eyebrow text-orange-500 block how-reveal opacity-0 translate-y-6">
          CAMPUS & SOCIAL
        </span>
        <h2 className="font-display font-medium text-[clamp(2.6rem,5vw,4.8rem)] leading-[0.92] uppercase text-[var(--ink)] how-reveal opacity-0 translate-y-6">
          HIRE COACHING &<br />POST NOTICES.
        </h2>
        <p className="font-sans text-[13px] leading-relaxed text-zinc-400 max-w-sm font-normal how-reveal opacity-0 translate-y-6">
          Refine your mechanics with elite municipal shooting trainers or chat directly with local players on our playground chalkboard.
        </p>

        {/* Feature listings checkmarks */}
        <div className="space-y-2 pt-2 text-[11px] text-zinc-500 font-medium how-reveal opacity-0 translate-y-6">
          <div className="flex items-center gap-2">
            <span className="text-orange-500 font-bold animate-[pulse_2s_infinite]">●</span>
            <span>Connect with FIBA-certified shooting & ball trainers in Bandra</span>
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-orange-500 font-bold animate-[pulse_2s_infinite]">●</span>
            <span>Post and filter notices for pickup squads, equipment sale, or drills</span>
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-orange-500 font-bold animate-[pulse_2s_infinite]">●</span>
            <span>Real-time blackboard keeps you synced with active park runs</span>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: CORE INTERACTIVE PANEL (DASHBOARD FOR ACTIONS) */}
      <div className="w-full md:max-w-[55%] bg-[#0e0e0e] border border-white/10 rounded-3xl p-6 shadow-2xl z-10 how-reveal opacity-0 translate-y-8 order-1 md:order-2">
        
        {/* Toggle Nav Header tabs */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] mb-5">
          <div className="flex gap-4">
            <button
              onClick={() => { playMetallicClick(); setActiveTab('coaching'); }}
              className={`text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'coaching' ? 'text-white border-b-2 border-orange-500 pb-1' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              🏅 Hire certified Coaches
            </button>
            <button
              onClick={() => { playMetallicClick(); setActiveTab('community'); }}
              className={`text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'community' ? 'text-white border-b-2 border-orange-500 pb-1' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              💬 Community Notice blackboard
            </button>
          </div>
          
          <span className="text-[9px] font-mono font-bold text-zinc-600 tracking-wider">KYOTO SECURE</span>
        </div>

        {/* TAB 1: COACHING ACADEMY HUB */}
        {activeTab === 'coaching' && (
          <div className="space-y-4 text-left">
            <div>
              <h3 className="font-display text-white uppercase text-md tracking-wider font-semibold leading-none">PROFESSIONAL COURT TRAINERS</h3>
              <p className="text-[9px] text-zinc-400 font-medium leading-relaxed mt-0.5">Book dedicated street and court training workouts.</p>
            </div>

            {/* Profile cards scrolling block */}
            <div className="space-y-2 max-h-[195px] overflow-y-auto pr-1">
              {COACHES.map(coach => (
                <div key={coach.id} className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] flex items-center justify-between gap-3 transition-all">
                  <div className="flex items-center gap-3">
                    <img 
                      src={coach.image} 
                      alt={coach.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 object-cover rounded-lg border border-white/10 grayscale brightness-90"
                    />
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[11.5px] font-bold text-white uppercase tracking-wide">{coach.name}</span>
                        <span className="text-[8.5px] text-orange-400 bg-orange-500/10 border border-orange-500/15 px-1 py-0.2 rounded font-extrabold">{coach.experience}</span>
                      </div>
                      <p className="text-[9.5px] text-zinc-400 font-medium leading-tight">{coach.specialty}</p>
                      
                      <div className="flex items-center gap-1.5 text-[8.5px] text-zinc-500 font-bold">
                        <span className="text-yellow-500 flex items-center gap-0.5">★ {coach.rating}</span>
                        <span>({coach.reviews} Ratings)</span>
                        <span className="text-orange-500/80">Available slot: {coach.availableSlot}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right leading-none flex-shrink-0">
                    <span className="font-mono text-xs font-bold text-white tracking-tight">${coach.price} / hr</span>
                    <button 
                      onClick={() => { playMetallicClick(); setSelectedCoachId(coach.id); }}
                      className={`block px-3 py-1 text-[8.5px] font-bold uppercase rounded-lg border mt-1.5 transition-all cursor-pointer ${
                        selectedCoachId === coach.id 
                          ? 'bg-white text-black border-white' 
                          : 'bg-transparent border-white/20 text-white hover:bg-white/5'
                      }`}
                    >
                      Select
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Schedular workout form block */}
            <div className="p-3.5 rounded-2xl bg-neutral-900/60 border border-white/5 space-y-3.5">
              <span className="text-[9px] font-bold uppercase text-orange-400 tracking-wider block">Confirm Training Session Workout</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-[1.5fr_1fr_1fr] gap-2 items-end">
                <div className="flex flex-col gap-1">
                  <label className="text-[8px] font-bold uppercase text-zinc-400">Workout Date</label>
                  <select 
                    value={trainingDate}
                    onChange={(e) => setTrainingDate(e.target.value)}
                    className="bg-neutral-950 border border-white/10 rounded-lg p-2 text-xs text-white outline-none cursor-pointer"
                  >
                    <option value="Today">Today (May 28)</option>
                    <option value="Tomorrow">Tomorrow (May 29)</option>
                    <option value="This Saturday">This Saturday</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[8px] font-bold uppercase text-zinc-400">Workout Time</label>
                  <select 
                    value={trainingTime}
                    onChange={(e) => setTrainingTime(e.target.value)}
                    className="bg-neutral-950 border border-white/10 rounded-lg p-2 text-xs text-white outline-none cursor-pointer"
                  >
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="02:30 PM">02:30 PM</option>
                    <option value="05:00 PM">05:00 PM</option>
                    <option value="07:30 PM">07:30 PM</option>
                  </select>
                </div>

                <button 
                  onClick={handleScheduleCoach}
                  className="rounded-lg bg-white hover:bg-zinc-200 text-black py-2 text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer h-[36px]"
                >
                  Schedule Coach
                </button>
              </div>

              {/* Training sessions scheduled lists */}
              {scheduledCoaches.length > 0 && (
                <div className="pt-2 border-t border-white/[0.05] space-y-1.5">
                  <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider block">Upcoming workout scheduled:</span>
                  <div className="max-h-[65px] overflow-y-auto space-y-1">
                    {scheduledCoaches.map(item => (
                      <div key={item.coachId} className="p-1 px-2 rounded bg-orange-600/5 border border-orange-500/10 flex items-center justify-between text-[8px] text-orange-200 font-medium">
                        <span>Workout with {item.coachName} - {item.time}</span>
                        <button 
                          onClick={() => handleCancelCoach(item.coachId)}
                          className="text-zinc-500 hover:text-red-400 underline cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: PLAYGROUND COMMUNITY BLACKBOARD */}
        {activeTab === 'community' && (
          <div className="space-y-4 text-left">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-white uppercase text-md tracking-wider font-semibold leading-none">PLAYGROUND BLACKBOARD</h3>
                <p className="text-[9px] text-zinc-400 font-medium leading-relaxed mt-0.5">Post game requests, tips, equipment listings securely.</p>
              </div>
              {posts.length > 0 && (
                <button 
                  onClick={handleClearPosts}
                  className="text-[9px] text-zinc-500 hover:text-red-400 underline font-semibold cursor-pointer"
                >
                  Wipe Board
                </button>
              )}
            </div>

            {/* Chat board styling mimics standard chalk notice board */}
            <div className="rounded-2xl border border-white/5 bg-[#050505] p-4 font-mono text-[10.5px] text-neutral-400 space-y-3 max-h-[195px] overflow-y-auto scrollbar-thin">
              {posts.length === 0 ? (
                <div className="py-12 text-center text-zinc-600 italic">
                  Chalkboard is dry. Write a new notice below to pin it!
                </div>
              ) : (
                posts.map(p => (
                  <div key={p.id} className="pb-3 border-b border-white/[0.03] space-y-1 text-zinc-300 last:border-b-0 last:pb-0">
                    <div className="flex items-center justify-between text-[8.5px] font-bold">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[#FF6154]">@{p.sender}</span>
                        <span className="px-1.5 py-0.2 bg-zinc-900 border border-zinc-800 rounded font-normal text-zinc-500">{p.topic}</span>
                      </div>
                      <span className="text-zinc-600 tracking-tight">{p.timeSec}</span>
                    </div>
                    <p className="font-normal text-zinc-300 leading-relaxed font-sans">{p.text}</p>
                  </div>
                ))
              )}
            </div>

            {/* Form to submit custom notice */}
            <form onSubmit={handleAddPost} className="p-3.5 rounded-2xl bg-neutral-900/60 border border-white/5 space-y-3">
              <span className="text-[9px] font-bold uppercase text-orange-400 tracking-wider block">Write a Chalk Notice on Blackboard</span>
              
              <div className="grid grid-cols-2 md:grid-cols-[1.2fr_1.1fr_1.5fr] gap-2 items-center">
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[7.5px] font-bold uppercase text-zinc-500">Your Gamer handle</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. MumbaiCrossover"
                    value={chatName}
                    onChange={(e) => setChatName(e.target.value)}
                    className="bg-neutral-950 border border-white/10 rounded-lg p-1.5 text-[10px] text-white outline-none w-full"
                  />
                </div>

                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[7.5px] font-bold uppercase text-zinc-500">Notice Topic Category</label>
                  <select 
                    value={chatTopic}
                    onChange={(e) => setChatTopic(e.target.value)}
                    className="bg-neutral-950 border border-white/10 rounded-lg p-1.5 text-[10px] text-white outline-none cursor-pointer w-full font-semibold"
                  >
                    <option value="Looking for Group">Looking for Group</option>
                    <option value="Buy/Sell">Buy/Sell</option>
                    <option value="Tips & Drills">Tips & Drills</option>
                    <option value="Slam Discussion">Slam Discussion</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1 text-left col-span-2 md:col-span-1">
                  <label className="text-[7.5px] font-bold uppercase text-zinc-500">Post details description</label>
                  <div className="flex gap-1.5 items-center">
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Need 1 guard for court runs now."
                      value={chatText}
                      onChange={(e) => setChatText(e.target.value)}
                      className="bg-neutral-950 border border-white/10 rounded-lg p-1.5 text-[10px] text-white outline-none w-full"
                    />
                    <button 
                      type="submit"
                      className="px-4 py-1.5 bg-orange-600 hover:bg-orange-500 text-white font-sans text-[10px] font-extrabold uppercase rounded-lg cursor-pointer transition-all flex-shrink-0"
                    >
                      Post Notice
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}

      </div>
    </section>
  );
}
