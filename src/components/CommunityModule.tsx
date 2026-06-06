import React, { useState, useEffect, useMemo } from 'react';
import { User, MessageSquare, Heart, Video, Plus, ShieldCheck, Share2, Users, Search, Target, ThumbsUp, Send, Check, Bookmark, Bell, Eye, MapPin, Calendar, Award, Trophy, Activity, Sparkles, TrendingUp, X, Flame, Map } from 'lucide-react';
import { playMetallicClick, playSwoosh } from '../utils/audio';

interface PlayerProfile {
  name: string;
  position: string;
  style: string;
  height: string;
  level: 'Rookie' | 'Street King' | 'Pro Legend';
  favoriteCourt: string;
  xp: number;
  achievements: string[];
}

interface FeedPost {
  id: string;
  user: string;
  avatar: string;
  time: string;
  text: string;
  mediaUrl?: string;
  likes: number;
  liked: boolean;
  comments: { user: string; text: string; time: string }[];
  category: 'highlight' | 'status' | 'notice';
}

interface CourtHotspot {
  id: string;
  name: string;
  location: string;
  activeCount: number;
}

interface PickupRun {
  id: string;
  court: string;
  time: string;
  gameType: string;
  host: string;
  joinedPlayers: string[];
  maxPlayers: number;
}

const INITIAL_HOTSPOTS: CourtHotspot[] = [
  { id: 'h-1', name: 'Bandra Dome Arena', location: 'Bandra West', activeCount: 24 },
  { id: 'h-2', name: 'Carter Road Cage', location: 'Carter Road', activeCount: 18 },
  { id: 'h-3', name: 'Bandra East Playground', location: 'Bandra East', activeCount: 7 },
  { id: 'h-4', name: 'Cyber-Turf Downtown', location: 'Mumbai Main', activeCount: 32 }
];

const INITIAL_PICKUP_RUNS: PickupRun[] = [
  { id: 'run-1', court: 'Bandra Dome Arena', time: 'Today, 7:30 PM', gameType: '3v3 Halfcourt', host: 'Kenji_Krossover', joinedPlayers: ['Kenji_Krossover', 'Soma_T'], maxPlayers: 6 },
  { id: 'run-2', court: 'Carter Road Cage', time: 'Tomorrow, 6:00 PM', gameType: '5v5 Fullcourt', host: 'Yuki_Midrange', joinedPlayers: ['Yuki_Midrange', 'ReboundMonster', 'Hana_Handles'], maxPlayers: 10 }
];

const INITIAL_POSTS: FeedPost[] = [
  {
    id: 'p-1',
    user: 'Kenji_Krossover',
    avatar: '⚡',
    time: '2 hours ago',
    text: 'Check this ankle-breaker three at the Kamo cage! Unbelievable court friction today.',
    mediaUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&q=80',
    likes: 42,
    liked: false,
    category: 'highlight',
    comments: [
      { user: 'Soma_T', text: 'Clean crossover man, that handle was absolutely lethal!', time: '1 hour ago' }
    ]
  },
  {
    id: 'p-2',
    user: 'Coop_Championship',
    avatar: '🏀',
    time: '4 hours ago',
    text: 'Tournament organizers meeting scheduled for 8:00 PM at Sakura Court East pavilion. Be there!',
    likes: 12,
    liked: false,
    category: 'notice',
    comments: []
  },
  {
    id: 'p-3',
    user: 'Yuki_Midrange',
    avatar: '🔥',
    time: '1 day ago',
    text: 'Looking for 2 rebounders for casual 3v3 pickups at Bandra Dome tomorrow at 6 PM. All skill levels welcome!',
    likes: 8,
    liked: false,
    category: 'status',
    comments: [
      { user: 'ReboundMonster', text: 'I am down. Count me in for physical rebounds.', time: '12 hours ago' }
    ]
  }
];

const LOCAL_GROUPS = [
  { id: 'g-1', name: 'Bandra Downtown Dunkers', players: 142, level: 'All Levels', desc: 'Active pickup crew traversing central indoor gyms.' },
  { id: 'g-2', name: 'Bandra Hoop Rebels', players: 89, level: 'Competitive', desc: 'Late-night streetball runners fighting at Carter Road.' },
  { id: 'g-3', name: 'Carter Road Co-op', players: 230, level: 'Casual / Halfcourt', desc: 'Chill twilight halfcourt loop gatherers.' }
];

const MATCHMAKING_PLAYERS = [
  { id: 'm-1', name: 'Koji_RimProtector', level: 'Pro Legend', position: 'Center (C)', height: '202 cm', style: 'Defensive Anchor', following: false },
  { id: 'm-2', name: 'Ryu_Skywalker', level: 'Street King', position: 'Small Forward (SF)', height: '188 cm', style: 'High Flier / Dunker', following: false },
  { id: 'm-3', name: 'Hana_Handles', level: 'Street King', position: 'Point Guard (PG)', height: '172 cm', style: 'Playmaker', following: false },
  { id: 'm-4', name: 'Masa_Shooter', level: 'Rookie', position: 'Shooting Guard (SG)', height: '180 cm', style: 'Catch & Shoot', following: false }
];

export default function CommunityModule() {
  // Feed persistence
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [groupsJoined, setGroupsJoined] = useState<string[]>([]);
  const [followingPlayers, setFollowingPlayers] = useState<string[]>([]);
  
  // Custom Recruit Requests
  const [recruitRequests, setRecruitRequests] = useState<{ id: string; name: string; position: string; level: string; status: 'incoming' | 'outgoing_pending' | 'accepted' }[]>([
    { id: 'rec-1', name: 'Koji_RimProtector', position: 'Center (C)', level: 'Pro Legend', status: 'incoming' }
  ]);

  const handleSendRecruit = (player: any) => {
    playSwoosh();
    if (recruitRequests.some(r => r.name === player.name)) return;
    
    const newReq = {
      id: `rec-${Date.now()}`,
      name: player.name,
      position: player.position,
      level: player.level,
      status: 'outgoing_pending' as const
    };
    setRecruitRequests(prev => [...prev, newReq]);
    
    // Simulate teammate accepting your squad invites after 2 seconds
    setTimeout(() => {
      setRecruitRequests(prev => prev.map(r => r.name === player.name ? { ...r, status: 'accepted' as const } : r));
      playMetallicClick();
    }, 2000);
  };

  const handleAcceptRecruit = (id: string) => {
    playSwoosh();
    setRecruitRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'accepted' as const } : r));
  };

  const handleDeclineRecruit = (id: string) => {
    playMetallicClick();
    setRecruitRequests(prev => prev.filter(r => r.id !== id));
  };
  
  // Create profile state
  const [profile, setProfile] = useState<PlayerProfile>({
    name: 'StreetBallerHH',
    position: 'Point Guard (PG)',
    style: 'Playmaker',
    height: '182 cm',
    level: 'Street King',
    favoriteCourt: 'Bandra Dome Sports Arena',
    xp: 2450,
    achievements: ['Crossover King', 'Ankle Breaker', 'Double-Double Club']
  });
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [tempProfile, setTempProfile] = useState<PlayerProfile>({ ...profile });

  // Post generation fields
  const [newPostText, setNewPostText] = useState<string>('');
  const [newPostCategory, setNewPostCategory] = useState<'highlight' | 'status'>('status');
  const [newPostMedia, setNewPostMedia] = useState<string>('');
  
  // Comment tracker
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState<string>('');

  // Hotspots and check-in
  const [hotspots, setHotspots] = useState<CourtHotspot[]>(INITIAL_HOTSPOTS);
  const [checkedInCourtId, setCheckedInCourtId] = useState<string | null>(null);

  // Active Pickups scheduler
  const [pickupRuns, setPickupRuns] = useState<PickupRun[]>([]);
  const [isCreatingRun, setIsCreatingRun] = useState<boolean>(false);
  const [newRunCourt, setNewRunCourt] = useState<string>('Bandra Dome Arena');
  const [newRunTime, setNewRunTime] = useState<string>('Today, 8:00 PM');
  const [newRunType, setNewRunType] = useState<string>('3v3 Halfcourt');
  const [newRunMaxPlayers, setNewRunMaxPlayers] = useState<number>(6);

  // Feed search and filter
  const [feedSearch, setFeedSearch] = useState<string>('');
  const [feedCategoryFilter, setFeedCategoryFilter] = useState<'all' | 'status' | 'highlight' | 'notice'>('all');

  // Success Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Loaded from storage
  useEffect(() => {
    try {
      const storedPosts = localStorage.getItem('y68_community_posts');
      if (storedPosts) {
        setPosts(JSON.parse(storedPosts));
      } else {
        setPosts(INITIAL_POSTS);
        localStorage.setItem('y68_community_posts', JSON.stringify(INITIAL_POSTS));
      }

      const storedGroups = localStorage.getItem('y68_community_groups');
      if (storedGroups) setGroupsJoined(JSON.parse(storedGroups));

      const storedFollowing = localStorage.getItem('y68_community_following');
      if (storedFollowing) setFollowingPlayers(JSON.parse(storedFollowing));

      const storedProfile = localStorage.getItem('y68_player_profile');
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
        setTempProfile(JSON.parse(storedProfile));
      }

      const storedHotspots = localStorage.getItem('y68_court_hotspots');
      if (storedHotspots) {
        setHotspots(JSON.parse(storedHotspots));
      } else {
        localStorage.setItem('y68_court_hotspots', JSON.stringify(INITIAL_HOTSPOTS));
      }

      const storedCheckIn = localStorage.getItem('y68_court_check_in');
      if (storedCheckIn) {
        setCheckedInCourtId(JSON.parse(storedCheckIn));
      }

      const storedRuns = localStorage.getItem('y68_pickup_runs');
      if (storedRuns) {
        setPickupRuns(JSON.parse(storedRuns));
      } else {
        setPickupRuns(INITIAL_PICKUP_RUNS);
        localStorage.setItem('y68_pickup_runs', JSON.stringify(INITIAL_PICKUP_RUNS));
      }
    } catch (e) {
      console.warn("Local storage loading error inside CommunityModule", e);
    }
  }, []);

  const savePosts = (updated: FeedPost[]) => {
    setPosts(updated);
    localStorage.setItem('y68_community_posts', JSON.stringify(updated));
  };

  const savePickupRuns = (updated: PickupRun[]) => {
    setPickupRuns(updated);
    localStorage.setItem('y68_pickup_runs', JSON.stringify(updated));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    playSwoosh();
    setProfile(tempProfile);
    localStorage.setItem('y68_player_profile', JSON.stringify(tempProfile));
    setIsEditingProfile(false);
    showToast("Profile badge updated successfully!");
  };

  const handleCheckInToggle = (courtId: string) => {
    playSwoosh();
    let updatedHotspots = [...hotspots];
    let nextCheckInId: string | null = null;

    if (checkedInCourtId === courtId) {
      // Check out
      updatedHotspots = updatedHotspots.map(h => 
        h.id === courtId ? { ...h, activeCount: Math.max(0, h.activeCount - 1) } : h
      );
      nextCheckInId = null;
      showToast("Checked out from court.");
    } else {
      // Check in (and check out of current if any)
      updatedHotspots = updatedHotspots.map(h => {
        if (h.id === courtId) {
          return { ...h, activeCount: h.activeCount + 1 };
        } else if (h.id === checkedInCourtId) {
          return { ...h, activeCount: Math.max(0, h.activeCount - 1) };
        }
        return h;
      });
      nextCheckInId = courtId;
      const courtName = hotspots.find(h => h.id === courtId)?.name || "Court";
      showToast(`Successfully checked in at ${courtName}!`);
    }

    setHotspots(updatedHotspots);
    setCheckedInCourtId(nextCheckInId);
    localStorage.setItem('y68_court_hotspots', JSON.stringify(updatedHotspots));
    localStorage.setItem('y68_court_check_in', JSON.stringify(nextCheckInId));
  };

  const handleJoinLeavePickupRun = (runId: string) => {
    playMetallicClick();
    const updated = pickupRuns.map(run => {
      if (run.id === runId) {
        const isJoined = run.joinedPlayers.includes(profile.name);
        const nextJoined = isJoined
          ? run.joinedPlayers.filter(p => p !== profile.name)
          : [...run.joinedPlayers, profile.name];
        
        if (nextJoined.length > run.maxPlayers) {
          alert("⚠️ This run is fully stacked!");
          return run;
        }

        showToast(isJoined ? "Left the pickup run roster." : "Joined the pickup run roster!");
        return { ...run, joinedPlayers: nextJoined };
      }
      return run;
    });

    savePickupRuns(updated);
  };

  const handleCreatePickupRun = (e: React.FormEvent) => {
    e.preventDefault();
    playSwoosh();

    const newRun: PickupRun = {
      id: `run-${Date.now()}`,
      court: newRunCourt,
      time: newRunTime,
      gameType: newRunType,
      host: profile.name,
      joinedPlayers: [profile.name],
      maxPlayers: newRunMaxPlayers
    };

    const updated = [...pickupRuns, newRun];
    savePickupRuns(updated);
    setIsCreatingRun(false);
    showToast(`Scheduled pickup run at ${newRunCourt}!`);

    // publish a post automatic notification
    const autoPost: FeedPost = {
      id: `post-auto-${Date.now()}`,
      user: profile.name,
      avatar: '🌟',
      time: 'Just now',
      text: `🔥 New pickup run scheduled at ${newRunCourt} for ${newRunTime} (${newRunType}). Join up!`,
      likes: 1,
      liked: true,
      category: 'notice',
      comments: []
    };
    savePosts([autoPost, ...posts]);
  };

  const filteredPosts = useMemo(() => {
    const s = feedSearch.trim().toLowerCase();
    return posts.filter(post => {
      const matchesSearch = !s || post.user.toLowerCase().includes(s) || post.text.toLowerCase().includes(s);
      const matchesCategory = feedCategoryFilter === 'all' || post.category === feedCategoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [posts, feedSearch, feedCategoryFilter]);

  const handleLikePost = (postId: string) => {
    playMetallicClick();
    const updated = posts.map(pst => {
      if (pst.id === postId) {
        return {
          ...pst,
          likes: pst.liked ? pst.likes - 1 : pst.likes + 1,
          liked: !pst.liked
        };
      }
      return pst;
    });
    savePosts(updated);
  };

  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    playSwoosh();
    const mockPost: FeedPost = {
      id: `post-${Date.now()}`,
      user: profile.name,
      avatar: '🌟',
      time: 'Just now',
      text: newPostText,
      likes: 0,
      liked: false,
      category: newPostCategory,
      mediaUrl: newPostCategory === 'highlight' ? (newPostMedia.trim() || 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&q=80') : undefined,
      comments: []
    };

    const updated = [mockPost, ...posts];
    savePosts(updated);
    
    // reset elements
    setNewPostText('');
    setNewPostMedia('');
    setNewPostCategory('status');
  };

  const handleAddComment = (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    playMetallicClick();
    const updated = posts.map(pst => {
      if (pst.id === postId) {
        return {
          ...pst,
          comments: [...pst.comments, {
            user: profile.name,
            text: newCommentText.trim(),
            time: 'Just now'
          }]
        };
      }
      return pst;
    });

    savePosts(updated);
    setNewCommentText('');
    setActiveCommentPostId(null);
  };

  const handleJoinToggleGroup = (groupId: string) => {
    playMetallicClick();
    let updated;
    if (groupsJoined.includes(groupId)) {
      updated = groupsJoined.filter(id => id !== groupId);
    } else {
      updated = [...groupsJoined, groupId];
    }
    setGroupsJoined(updated);
    localStorage.setItem('y68_community_groups', JSON.stringify(updated));
  };

  const handleFollowTogglePlayer = (playerName: string) => {
    playMetallicClick();
    let updated;
    if (followingPlayers.includes(playerName)) {
      updated = followingPlayers.filter(name => name !== playerName);
    } else {
      updated = [...followingPlayers, playerName];
    }
    setFollowingPlayers(updated);
    localStorage.setItem('y68_community_following', JSON.stringify(updated));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left" id="community-module-root">
      
      {/* LEFT COLUMN: ACTIVE PLAYER PROFILE CREATOR AND MATCHMAKER (4 COLS) */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* PLAYER PROFILE CARD */}
        <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-white/[0.08] rounded-3xl p-6 relative overflow-hidden shadow-[0_15px_30px_rgba(0,0,0,0.5)]">
          
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/5 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between pb-3.5 border-b border-white/5 mb-4">
            <span className="text-[9.5px] font-bold text-orange-400 flex items-center gap-1.5 uppercase tracking-widest leading-none font-mono">
              <User size={12} /> PROFILE ATHLETE BADGE
            </span>
            {!isEditingProfile && (
              <button 
                onClick={() => { playMetallicClick(); setIsEditingProfile(true); }}
                className="text-[9.5px] font-bold text-neutral-400 hover:text-white uppercase tracking-wider bg-white/5 border border-white/15 px-2.5 py-1 rounded-lg cursor-pointer"
              >
                Tinker
              </button>
            )}
          </div>

          {!isEditingProfile ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 bg-orange-600/10 border border-orange-500/20 text-orange-400 rounded-2xl flex items-center justify-center font-display text-xl font-bold">
                  {profile.name[0]?.toUpperCase()}
                </div>
                <div className="space-y-1 flex-grow">
                  <div className="flex items-center gap-1">
                    <h4 className="font-display font-bold uppercase tracking-wider text-base text-white">{profile.name}</h4>
                    <Sparkles size={12} className="text-orange-500 animate-pulse" />
                  </div>
                  <div className="flex items-center justify-between text-[9px] font-bold text-zinc-500 uppercase font-mono">
                    <span>Rank: <strong className="text-orange-400">{profile.level}</strong></span>
                    <span className="text-zinc-400 font-bold">{profile.xp || 2450} XP</span>
                  </div>
                </div>
              </div>

              {/* XP LEVEL PROGRESS BAR */}
              <div className="space-y-1">
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-orange-600 to-amber-400" style={{ width: '68%' }} />
                </div>
                <div className="flex justify-between text-[8px] text-zinc-600 font-mono">
                  <span>LEVEL 12</span>
                  <span>780 XP to LEVEL 13</span>
                </div>
              </div>

              {/* Profile stats breakdown matrices */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-neutral-900 border border-white/5 rounded-xl space-y-0.5">
                  <span className="text-[8px] text-zinc-500 uppercase font-mono block">Court Position</span>
                  <span className="text-white font-bold">{profile.position}</span>
                </div>
                <div className="p-2.5 bg-neutral-900 border border-white/5 rounded-xl space-y-0.5">
                  <span className="text-[8px] text-zinc-500 uppercase font-mono block">Play Style</span>
                  <span className="text-white font-bold">{profile.style}</span>
                </div>
                <div className="p-2.5 bg-neutral-900 border border-white/5 rounded-xl space-y-0.5">
                  <span className="text-[8px] text-zinc-500 uppercase font-mono block">Physical Height</span>
                  <span className="text-white font-bold font-mono">{profile.height}</span>
                </div>
                <div className="p-2.5 bg-neutral-900 border border-white/5 rounded-xl space-y-0.5">
                  <span className="text-[8px] text-zinc-500 uppercase font-mono block">Favorite Hub Court</span>
                  <span className="text-orange-400 font-bold truncate block">{profile.favoriteCourt.replace('Bandra ', '').replace('Mumbai ', '')}</span>
                </div>
              </div>

              {/* ACHIEVEMENTS / UNLOCKED BADGES */}
              <div className="space-y-1.5">
                <span className="text-[8px] font-bold text-zinc-400 font-mono uppercase tracking-widest block">Unlocked Play Badges</span>
                <div className="flex flex-wrap gap-1">
                  {(profile.achievements || ['Crossover King', 'Ankle Breaker', 'Double-Double Club']).map((ach, idx) => (
                    <span key={idx} className="px-2 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[8.5px] font-bold font-mono uppercase flex items-center gap-1">
                      <Award size={9} /> {ach}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center bg-[#070707] p-2.5 rounded-lg border border-white/[0.03] text-[9.5px] font-mono leading-none text-zinc-500">
                <span>Following: {followingPlayers.length} ballers</span>
                <span>•</span>
                <span>Groups: {groupsJoined.length} active</span>
              </div>

              {/* SQUAD CO-OP ACTIVE ROSTER LIST */}
              <div className="mt-4 pt-3.5 border-t border-white/5 space-y-2">
                <span className="text-[8px] font-bold text-zinc-400 font-mono uppercase tracking-widest block">Active Squad co-op Roster</span>
                <div className="space-y-1.5 font-sans">
                  <div className="flex items-center justify-between p-2 bg-[#090909] border border-white/[0.02] rounded-xl text-xs">
                    <span className="font-bold text-white uppercase truncate">{profile.name} (You)</span>
                    <span className="text-[7.5px] font-bold text-orange-400 bg-orange-500/10 border border-orange-500/10 px-1.5 py-0.5 rounded uppercase font-mono">{profile.position}</span>
                  </div>
                  {recruitRequests.filter(r => r.status === 'accepted').map(member => (
                    <div key={member.id} className="flex items-center justify-between p-2 bg-[#090909] border border-white/[0.02] rounded-xl text-xs">
                      <span className="font-bold text-zinc-300 uppercase truncate">@{member.name}</span>
                      <span className="text-[7.5px] font-bold text-zinc-400 bg-neutral-900 border border-white/5 px-1.5 py-0.5 rounded uppercase font-mono">{member.position}</span>
                    </div>
                  ))}
                  {recruitRequests.filter(r => r.status === 'accepted').length === 0 && (
                    <p className="text-[8.5px] text-zinc-650 leading-relaxed italic text-center font-mono">Squad is empty. Recruit matchmaker ballers below!</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSaveProfile} className="space-y-3.5 text-left text-xs">
              
              <div className="flex flex-col gap-1">
                <label className="text-[8.5px] font-bold text-zinc-400 uppercase tracking-widest">Athlete Handle</label>
                <input 
                  type="text" 
                  required
                  placeholder="StreetBallerHH"
                  value={tempProfile.name}
                  onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                  className="bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-xs text-white outline-none w-full font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[8.5px] font-bold text-zinc-400 uppercase tracking-widest">Anatomy Height</label>
                  <input 
                    type="text" 
                    required
                    placeholder="185 cm"
                    value={tempProfile.height}
                    onChange={(e) => setTempProfile({ ...tempProfile, height: e.target.value })}
                    className="bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-xs text-white outline-none w-full font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[8.5px] font-bold text-zinc-400 uppercase tracking-widest">Skill Standing</label>
                  <select 
                    value={tempProfile.level}
                    onChange={(e) => setTempProfile({ ...tempProfile, level: e.target.value as any })}
                    className="bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-xs text-white outline-none cursor-pointer font-bold"
                  >
                    <option value="Rookie">Rookie Cadet</option>
                    <option value="Street King">Street King Aura</option>
                    <option value="Pro Legend">Pro Legend Class</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[8.5px] font-bold text-zinc-400 uppercase tracking-widest">Court Position</label>
                  <select 
                    value={tempProfile.position}
                    onChange={(e) => setTempProfile({ ...tempProfile, position: e.target.value })}
                    className="bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-xs text-white outline-none cursor-pointer font-medium"
                  >
                    <option value="Point Guard (PG)">Point Guard (PG)</option>
                    <option value="Shooting Guard (SG)">Shooting Guard (SG)</option>
                    <option value="Small Forward (SF)">Small Forward (SF)</option>
                    <option value="Power Forward (PF)">Power Forward (PF)</option>
                    <option value="Center (C)">Center (C)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[8.5px] font-bold text-zinc-400 uppercase tracking-widest">Attack Style</label>
                  <select 
                    value={tempProfile.style}
                    onChange={(e) => setTempProfile({ ...tempProfile, style: e.target.value })}
                    className="bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-xs text-white outline-none cursor-pointer font-medium"
                  >
                    <option value="Playmaker">Slam Playmaker</option>
                    <option value="Catch & Shoot">Cath & Sniper</option>
                    <option value="Slash Penetrator">Slash Penetrator</option>
                    <option value="Defensive Anchor">Defensive Anchor</option>
                    <option value="Bounce Master">Bounce Master</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[8.5px] font-bold text-zinc-400 uppercase tracking-widest">Favorite Court Bound</label>
                <select 
                  value={tempProfile.favoriteCourt}
                  onChange={(e) => setTempProfile({ ...tempProfile, favoriteCourt: e.target.value })}
                  className="bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-xs text-white outline-none cursor-pointer font-medium"
                >
                  <option value="Bandra Dome Sports Arena">Bandra Dome Sports Arena</option>
                  <option value="Carter Road Basketball Cage">Carter Road Basketball Cage</option>
                  <option value="Bandra East Playground">Bandra East Playground</option>
                  <option value="Mumbai Downtown Cyber-Turf">Mumbai Downtown Cyber-Turf</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsEditingProfile(false)}
                  className="py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-zinc-400 font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold uppercase"
                >
                  Save Active
                </button>
              </div>

            </form>
          )}

        </div>

        {/* LIVE COURT HOTSPOTS & CHECK-INS */}
        <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-white/[0.08] rounded-3xl p-6 text-left space-y-4 shadow-[0_15px_30px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <span className="text-[9.5px] font-bold text-zinc-400 flex items-center gap-1.5 uppercase tracking-widest leading-none font-mono">
              <MapPin size={12} className="text-orange-500 animate-pulse" /> Live Court Check-Ins
            </span>
            <span className="text-[8.5px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/10">
              Active Now
            </span>
          </div>
          <p className="text-[9.5px] text-zinc-500 leading-normal font-sans font-normal">
            Broadcast your playground presence. Check into a regional court hotspot to let local teammates know you are running pickups!
          </p>

          <div className="space-y-2.5">
            {hotspots.map(court => {
              const isCheckedIn = checkedInCourtId === court.id;
              return (
                <div key={court.id} className={`p-3 rounded-xl border transition-all duration-300 flex items-center justify-between gap-3 ${
                  isCheckedIn 
                    ? 'bg-orange-500/5 border-orange-500/30' 
                    : 'bg-[#090909] border-white/[0.03] hover:border-white/10'
                }`}>
                  <div className="space-y-0.5 flex-grow min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white uppercase text-xs truncate">{court.name}</span>
                      {isCheckedIn && (
                        <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[7px] font-bold font-mono uppercase">
                          Here!
                        </span>
                      )}
                    </div>
                    <span className="text-[9px] text-zinc-500 font-mono block">{court.location}</span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[11px] font-mono font-black text-orange-400 bg-orange-500/5 border border-orange-500/5 px-2 py-0.5 rounded">
                      👤 {court.activeCount}
                    </span>
                    <button
                      onClick={() => handleCheckInToggle(court.id)}
                      className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest cursor-pointer transition-colors ${
                        isCheckedIn
                          ? 'bg-orange-600 text-white'
                          : 'bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10'
                      }`}
                    >
                      {isCheckedIn ? 'Out' : 'In'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* DIRECT REC INBOX */}
        {recruitRequests.some(r => r.status === 'incoming' || r.status === 'outgoing_pending') && (
          <div className="bg-neutral-950 border border-white/[0.06] rounded-3xl p-6 text-left space-y-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <span className="text-[9px] font-bold text-orange-400 flex items-center gap-1.5 uppercase tracking-widest leading-none font-mono">
                <Bell size={11} className="text-orange-500 animate-pulse" /> SQUAD RECRUIT INBOX
              </span>
              <span className="text-[8px] font-mono bg-white/[0.04] text-zinc-400 px-2 py-0.5 rounded-full border border-white/5">
                {recruitRequests.filter(r => r.status === 'incoming' || r.status === 'outgoing_pending').length} Actions
              </span>
            </div>

            <div className="space-y-2">
              {recruitRequests.filter(r => r.status === 'incoming' || r.status === 'outgoing_pending').map(req => {
                const isIncoming = req.status === 'incoming';
                return (
                  <div key={req.id} className="p-2.5 bg-[#080808] border border-white/5 rounded-xl space-y-1.5 text-xs">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-white uppercase block leading-none">@{req.name}</span>
                        <span className="text-[8.5px] text-zinc-500 font-mono block mt-0.5">{req.position} • {req.level}</span>
                      </div>
                      <span className={`text-[7px] font-bold px-1.5 py-0.2 rounded font-mono uppercase ${isIncoming ? 'bg-[#1e1308] text-orange-400' : 'bg-neutral-900 border border-white/5 text-zinc-400'}`}>
                        {isIncoming ? 'Incoming' : 'Outbound Proposals'}
                      </span>
                    </div>

                    {isIncoming ? (
                      <div className="grid grid-cols-2 gap-2 pt-1 animate-pulse">
                        <button
                          onClick={() => handleDeclineRecruit(req.id)}
                          className="py-1 rounded bg-[#1f0f0f] border border-red-950 text-red-400 text-[9px] uppercase font-bold cursor-pointer hover:bg-red-950/20"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => handleAcceptRecruit(req.id)}
                          className="py-1 rounded bg-white text-black text-[9px] uppercase font-extrabold cursor-pointer hover:bg-neutral-200"
                        >
                          Accept
                        </button>
                      </div>
                    ) : (
                      <span className="text-[8.5px] text-zinc-500 italic block text-left font-mono">Invite dispatched • awaiting signature...</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TEAMMATE MATCHMAKER ROSTER BOARD */}
        <div className="bg-[#0c0c0c] border border-white/[0.06] rounded-3xl p-6 text-left shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-1.5 pb-3 border-b border-white/5 mb-3.5">
            <Target size={12} className="text-orange-500 animate-spin-slow" />
            <span className="text-[9.5px] font-bold text-zinc-400 uppercase tracking-widest block font-mono">DUSK MATCHMAKER</span>
          </div>

          <p className="text-[9.5px] text-zinc-500 leading-normal mb-4 font-sans font-normal">
            Real players active right now in the Kamo-Sakyo region. Squad recruit them or follow their highlight feed!
          </p>

          <div className="space-y-3">
            {MATCHMAKING_PLAYERS.map(player => {
              const isfollowing = followingPlayers.includes(player.name);
              return (
                <div key={player.id} className="p-3 bg-neutral-900 border border-white/5 rounded-xl flex items-center justify-between gap-2.5 text-xs">
                  <div className="space-y-0.5 flex-grow">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white uppercase tracking-wide leading-tight">{player.name}</span>
                      <span className="text-[7.5px] font-bold bg-orange-500/10 text-orange-400 px-1.5 py-0.2 rounded-full font-mono">{player.level}</span>
                    </div>
                    <div className="text-[9.5px] text-zinc-400 font-mono">
                      <span>{player.position}</span>
                      <span className="mx-1">•</span>
                      <span>{player.style}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => handleFollowTogglePlayer(player.name)}
                      className={`px-2 py-1 cursor-pointer rounded-lg text-[9px] font-bold uppercase tracking-wide transition-colors ${
                        isfollowing 
                          ? 'bg-orange-950/40 text-orange-400 border border-orange-900/40' 
                          : 'bg-white hover:bg-zinc-200 text-black'
                      }`}
                    >
                      {isfollowing ? 'Followed' : 'Follow'}
                    </button>
                    <button 
                      onClick={() => handleSendRecruit(player)}
                      className={`p-1 px-1.5 rounded-lg text-[10px] cursor-pointer transition-all border ${
                        recruitRequests.some(r => r.name === player.name && r.status === 'accepted')
                          ? 'border-emerald-500/20 bg-emerald-950/20 text-emerald-400'
                          : recruitRequests.some(r => r.name === player.name && r.status === 'outgoing_pending')
                          ? 'border-yellow-500/25 bg-yellow-950/25 text-yellow-400'
                          : 'bg-neutral-950 text-orange-500 border-orange-500/10 hover:border-orange-500/30'
                      }`}
                      title="Send Squad Invitation"
                      disabled={recruitRequests.some(r => r.name === player.name)}
                    >
                      {recruitRequests.some(r => r.name === player.name && r.status === 'accepted')
                        ? '✓ Signed'
                        : recruitRequests.some(r => r.name === player.name && r.status === 'outgoing_pending')
                        ? 'Pending'
                        : '+ Recruit'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: BULLETIN FEED & COMMUNAL HIGHLIGHT BOARDS (8 COLS) */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* CREATE POST BULLETIN FORM */}
        <div className="bg-gradient-to-r from-neutral-900 to-[#0e0e0e] border border-white/[0.08] rounded-3xl p-6 text-left shadow-[0_15px_30px_rgba(0,0,0,0.5)]">
          <form onSubmit={handleAddPost} className="space-y-4">
            <span className="text-[9.5px] font-bold text-zinc-400 uppercase tracking-widest block font-mono">BULLETIN TRANSMISSION BOUND</span>
            
            <textarea 
              required
              rows={2}
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              placeholder="Post picked rosters, court highlight descriptions, or matchmaking calls..."
              className="w-full bg-[#070707] border border-white/[0.06] hover:border-zinc-700/80 rounded-2xl p-4 text-xs text-white outline-none resize-none font-normal focus:border-orange-500/40 transition-colors shadow-inner"
            />

            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              
              <div className="flex flex-wrap gap-2 text-xs">
                {/* Category selectors */}
                <button 
                  type="button"
                  onClick={() => { playMetallicClick(); setNewPostCategory('status'); }}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase cursor-pointer ${
                    newPostCategory === 'status' ? 'bg-orange-600 text-white' : 'bg-neutral-905 bg-neutral-900 text-zinc-400 hover:text-white'
                  }`}
                >
                  💬 Post Status
                </button>
                <button 
                  type="button"
                  onClick={() => { playMetallicClick(); setNewPostCategory('highlight'); }}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase cursor-pointer flex items-center gap-1 ${
                    newPostCategory === 'highlight' ? 'bg-indigo-600 text-white' : 'bg-neutral-900 text-zinc-400 hover:text-white'
                  }`}
                >
                  <Video size={11} /> Link Highlight Video
                </button>
              </div>

              <div className="flex gap-2 w-full sm:w-auto justify-end">
                {newPostCategory === 'highlight' && (
                  <input 
                    type="url"
                    placeholder="Unsplash custom image url..."
                    value={newPostMedia}
                    onChange={(e) => setNewPostMedia(e.target.value)}
                    className="bg-neutral-950 border border-neutral-800 rounded-lg p-1.5 text-[9.5px] text-zinc-400 outline-none w-1/2 sm:w-[150px]"
                  />
                )}
                <button 
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black text-[10.5px] font-bold uppercase transition-transform cursor-pointer"
                >
                  Broadcast +
                </button>
              </div>

            </div>
          </form>
        </div>

        {/* FEED BULLETIN TIMELINE CARDS */}
        <div className="space-y-4">
          <span className="text-[10px] text-zinc-400 font-extrabold tracking-widest block font-mono uppercase bg-white/[0.01] p-2 rounded-lg border border-white/5">
            📰 PLAYGROUND DISPATCH FEED ({posts.length})
          </span>

          {posts.length === 0 ? (
            <div className="p-12 text-center text-zinc-500 font-medium text-xs border border-white/5 bg-neutral-950 rounded-2xl">
              No bulletins active on local channel currently. Be first to transmit!
            </div>
          ) : (
            posts.map(post => {
              return (
                <div 
                  key={post.id}
                  className="bg-[#0c0c0c] border border-white/[0.06] hover:border-neutral-700/80 rounded-3xl p-5 space-y-4 text-left transition-all hover:-translate-y-0.5 shadow-[0_10px_25px_rgba(0,0,0,0.4)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.6)]"
                >
                  {/* Poster header column */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-white/5 flex items-center justify-center text-md select-none">
                        {post.avatar}
                      </div>

                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-bold text-white uppercase tracking-wide text-xs">{post.user}</span>
                          <span className="text-[7.5px] font-bold px-2 rounded-full uppercase tracking-wider font-mono bg-white/[0.04] text-zinc-400">
                            {post.category}
                          </span>
                        </div>
                        <span className="text-[9px] text-zinc-500 font-mono">{post.time}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleFollowTogglePlayer(post.user)}
                      className={`px-2 py-0.5 rounded text-[8.5px] uppercase font-bold tracking-wide transition-colors ${
                        followingPlayers.includes(post.user)
                          ? 'text-orange-400 bg-orange-950/20' 
                          : 'text-zinc-400 bg-white/5 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {followingPlayers.includes(post.user) ? 'Mutuals' : '+ Follow'}
                    </button>
                  </div>

                  {/* Body text content */}
                  <p className="text-xs text-zinc-200 leading-relaxed font-normal font-sans">
                    {post.text}
                  </p>

                  {/* Highlights image preview */}
                  {post.mediaUrl && (
                    <div className="aspect-[16/9] w-full rounded-xl overflow-hidden bg-[#070707] border border-white/5 relative group">
                      <img 
                        src={post.mediaUrl} 
                        alt="Highlight play"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 transition-all duration-500"
                      />
                      <span className="absolute bottom-3 left-3 bg-indigo-600 text-white font-mono text-[8px] font-extrabold px-1.5 py-0.5 rounded tracking-widest uppercase flex items-center gap-1.5 shadow-lg">
                        <Video size={10} className="animate-pulse" /> PLAY HIGHLIGHT CAPTURE
                      </span>
                    </div>
                  )}

                  {/* Interactivity counters */}
                  <div className="flex gap-4 pt-2 border-t border-white/[0.03] text-[10px] font-bold text-zinc-400">
                    <button 
                      onClick={() => handleLikePost(post.id)}
                      className={`flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors ${
                        post.liked ? 'text-red-500' : ''
                      }`}
                    >
                      <ThumbsUp size={12} className={post.liked ? 'fill-red-600 text-red-600' : ''} />
                      <span>{post.likes} Likes</span>
                    </button>

                    <button 
                      onClick={() => {
                        playMetallicClick();
                        setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id);
                      }}
                      className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
                    >
                      <MessageSquare size={12} className="text-zinc-500" />
                      <span>{post.comments.length} Comments</span>
                    </button>

                    <button 
                      onClick={() => { playSwoosh(); alert("📋 Highlight Link copied to workspace clipboard!"); }}
                      className="flex items-center gap-1.5 hover:text-white transition-colors ml-auto cursor-pointer"
                    >
                      <Share2 size={11} /> Share
                    </button>
                  </div>

                  {/* Comment input drawers */}
                  {(activeCommentPostId === post.id || post.comments.length > 0) && (
                    <div className="pt-2 space-y-3 border-t border-white/[0.03] pl-2 sm:pl-4">
                      
                      {/* Comments listed */}
                      {post.comments.map((comm, cIndex) => (
                        <div key={cIndex} className="text-xs pb-2 border-b border-white/[0.02] last:border-0 last:pb-0">
                          <div className="flex justify-between items-center text-[10px] font-bold">
                            <span className="text-zinc-300">@{comm.user}</span>
                            <span className="text-zinc-500 font-mono font-normal">{comm.time}</span>
                          </div>
                          <p className="text-[10px] text-zinc-400 font-sans mt-0.5">{comm.text}</p>
                        </div>
                      ))}

                      {/* Comment Input */}
                      <form onSubmit={(e) => handleAddComment(e, post.id)} className="flex gap-2">
                        <input 
                          type="text"
                          required
                          value={newCommentText}
                          onChange={(e) => setNewCommentText(e.target.value)}
                          placeholder="Write reply bullet..."
                          className="flex-grow bg-neutral-900 border border-white/5 rounded-lg p-1.5 text-[10.5px] text-white outline-none w-full"
                        />
                        <button 
                          type="submit"
                          className="px-3 bg-white text-black hover:bg-zinc-200 transition-colors font-bold text-[9px] uppercase rounded-lg cursor-pointer"
                        >
                          Send
                        </button>
                      </form>

                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>

        {/* REGIONAL BASKETBALL GROUPS PORTAL */}
        <div className="bg-[#0c0c0c] border border-white/[0.06] rounded-3xl p-6 text-left space-y-5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
            <Users size={14} className="text-orange-500" />
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block font-mono">REGIONAL STREETBALL GROUPS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {LOCAL_GROUPS.map(grp => {
              const joined = groupsJoined.includes(grp.id);
              return (
                <div key={grp.id} className="p-3 bg-neutral-900 border border-white/5 rounded-xl flex flex-col justify-between space-y-2 text-xs text-left">
                  <div className="space-y-1">
                    <h5 className="font-bold text-white uppercase tracking-wider line-clamp-1">{grp.name}</h5>
                    <div className="flex justify-between text-[8px] font-bold font-mono text-zinc-500 uppercase leading-none pb-1 border-b border-white/[0.04]">
                      <span>👥 {grp.players} Riders</span>
                      <span>Level: {grp.level}</span>
                    </div>
                    <p className="text-[10px] text-zinc-400 leading-normal line-clamp-2 pt-1 font-normal font-sans">
                      {grp.desc}
                    </p>
                  </div>

                  <button
                    onClick={() => handleJoinToggleGroup(grp.id)}
                    className={`w-full py-1.5 cursor-pointer rounded-lg text-[9.5px] font-bold uppercase transition-all ${
                      joined 
                        ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/40 font-extrabold' 
                        : 'bg-white hover:bg-zinc-200 text-black'
                    }`}
                  >
                    {joined ? '✓ In Group' : 'Join Squad'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
