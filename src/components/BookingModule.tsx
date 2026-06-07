import React, { useState, useEffect, useMemo } from 'react';
import { MapPin, ShieldAlert, Sun, CloudRain, Thermometer, Users, Calendar, Clock, IndianRupee, CheckCircle, Navigation, QrCode, Sparkles, Tag, Star, Activity, Info, AlertCircle, Check, X, MessageSquare, Trash, Ticket, HelpCircle } from 'lucide-react';
import { playMetallicClick, playSwoosh } from '../utils/audio';

export interface Court {
  id: string;
  name: string;
  location: string;
  type: 'indoor' | 'outdoor';
  turf: 'hardwood' | 'acrylic' | 'concrete' | 'smart-turf';
  hasAC: boolean;
  hasLighting: boolean;
  rating: number;
  basePrice: number;
  peakPrice: number;
  image: string;
  desc: string;
  hasParking?: boolean;
  hasShowers?: boolean;
  hasLockers?: boolean;
}

interface CourtReview {
  id: string;
  courtId: string;
  user: string;
  rating: number;
  text: string;
  time: string;
}

const COURTS_DATA: Court[] = [
  {
    id: 'c-shoten',
    name: 'Mumbai Bandra Dome',
    location: 'Bandra Reclamation, West Mumbai',
    type: 'indoor',
    turf: 'hardwood',
    hasAC: true,
    hasLighting: true,
    rating: 4.9,
    basePrice: 2500,
    peakPrice: 3200,
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&q=80',
    desc: 'Meticulously maintained double-polished North American Maple hardwood. Electronic scoreboard and spectator deck.',
    hasParking: true,
    hasShowers: true,
    hasLockers: true
  },
  {
    id: 'c-kamo',
    name: 'Chennai Marina Beach Cage',
    location: 'Marina Beach Boulevard, Chennai',
    type: 'outdoor',
    turf: 'acrylic',
    hasAC: false,
    hasLighting: true,
    rating: 4.7,
    basePrice: 1200,
    peakPrice: 1800,
    image: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a27?w=600&q=80',
    desc: 'High-friction polymer acrylic coating. Atmospheric ocean breezes with powerful night floodlight setup.',
    hasParking: true,
    hasShowers: false,
    hasLockers: false
  },
  {
    id: 'c-sakura',
    name: 'Delhi Saket Arena',
    location: 'Saket Sports Complex, New Delhi',
    type: 'outdoor',
    turf: 'concrete',
    hasAC: false,
    hasLighting: false,
    rating: 4.4,
    basePrice: 800,
    peakPrice: 1100,
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&q=80',
    desc: 'Rugged classic urban concrete court surrounded by gorgeous local park walkways. Best for pure streetball grit.',
    hasParking: false,
    hasShowers: false,
    hasLockers: false
  },
  {
    id: 'c-cyber',
    name: 'Bengaluru Cyber-Turf',
    location: 'Terrace Roof, Indiranagar Tech Hub',
    type: 'indoor',
    turf: 'smart-turf',
    hasAC: true,
    hasLighting: true,
    rating: 4.8,
    basePrice: 3000,
    peakPrice: 3800,
    image: 'https://images.unsplash.com/photo-1544698310-74ea9d1c8258?w=600&q=80',
    desc: 'Futuristic shock-absorbing composite rubber turf with animated floor markings, full AC, and customized high-tempo playback.',
    hasParking: true,
    hasShowers: true,
    hasLockers: true
  }
];

const INITIAL_REVIEWS: CourtReview[] = [
  { id: 'r-1', courtId: 'c-shoten', user: 'Rohan_PG', rating: 5, text: 'The Maple wood has an incredible grip! Best court in town.', time: '2 days ago' },
  { id: 'r-2', courtId: 'c-shoten', user: 'Karan_C', rating: 4, text: 'AC is chilling, worth every rupee.', time: '1 week ago' },
  { id: 'r-3', courtId: 'c-kamo', user: 'StreetKing_M', rating: 5, text: 'Night sessions under the floodlights with ocean breeze are pure magic.', time: '3 days ago' },
  { id: 'r-4', courtId: 'c-cyber', user: 'TechBaller', rating: 5, text: 'Smart-turf animations are insane! Felt like playing in 2050.', time: '4 days ago' }
];

type WeatherState = 'perfect' | 'rainy' | 'heatwave';

export default function BookingModule() {
  const [selectedCourt, setSelectedCourt] = useState<Court>(COURTS_DATA[0]);
  const [filterType, setFilterType] = useState<'all' | 'indoor' | 'outdoor'>('all');
  const [filterTurf, setFilterTurf] = useState<string>('all');
  
  // Custom Weather simulations affecting pricing and availability
  const [weather, setWeather] = useState<WeatherState>('perfect');
  
  const [selectedDate, setSelectedDate] = useState<string>('2026-05-29');
  const [selectedHour, setSelectedHour] = useState<number>(18); // default 6 PM
  const [splitCount, setSplitCount] = useState<number>(1); // number of friends to division cost
  const [isBookedSuccess, setIsBookedSuccess] = useState<boolean>(false);
  const [bookingPassId, setBookingPassId] = useState<string>('');

  const [searchQuery, setSearchQuery] = useState<string>('');

  // Enhanced states
  const [reviews, setReviews] = useState<CourtReview[]>([]);
  const [newReviewUser, setNewReviewUser] = useState<string>('');
  const [newReviewText, setNewReviewText] = useState<string>('');
  const [newReviewRating, setNewReviewRating] = useState<number>(5);

  const [promoCodeInput, setPromoCodeInput] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [promoError, setPromoError] = useState<string | null>(null);

  // Amenity filters
  const [filterParking, setFilterParking] = useState<boolean>(false);
  const [filterShowers, setFilterShowers] = useState<boolean>(false);
  const [filterLockers, setFilterLockers] = useState<boolean>(false);

  // Load reviews from localStorage
  useEffect(() => {
    try {
      const storedReviews = localStorage.getItem('y68_court_reviews');
      if (storedReviews) {
        setReviews(JSON.parse(storedReviews));
      } else {
        setReviews(INITIAL_REVIEWS);
        localStorage.setItem('y68_court_reviews', JSON.stringify(INITIAL_REVIEWS));
      }
    } catch (e) {
      console.warn("Error loading reviews", e);
    }
  }, []);

  const handleSelectCourt = (court: Court) => {
    playMetallicClick();
    setSelectedCourt(court);
  };

  // Cost calculator based on weather modifiers + peak hour indicators
  const getCalculatedPrice = (court: Court, hour: number) => {
    const isPeak = hour >= 16 && hour <= 21; // 4 PM to 9 PM is peak hour
    let price = isPeak ? court.peakPrice : court.basePrice;

    if (weather === 'rainy' && court.type === 'outdoor') {
      // Outdoor courts locked or 50% discount if crazy people play
      price = Math.round(price * 0.5);
    }
    if (weather === 'heatwave' && court.type === 'indoor' && court.hasAC) {
      // High AC fee
      price = Math.round(price * 1.15);
    }

    if (discountPercent > 0) {
      price = Math.round(price * (1 - discountPercent / 100));
    }

    return price;
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    playMetallicClick();
    const code = promoCodeInput.trim().toUpperCase();
    if (code === 'HOOPHUB20') {
      setDiscountPercent(20);
      setAppliedPromo(code);
      setPromoError(null);
    } else if (code === 'STREET30') {
      setDiscountPercent(30);
      setAppliedPromo(code);
      setPromoError(null);
    } else if (code === 'MONSOON50') {
      setDiscountPercent(50);
      setAppliedPromo(code);
      setPromoError(null);
    } else {
      setPromoError("Invalid discount coupon.");
    }
    setPromoCodeInput('');
  };

  const handleRemovePromo = () => {
    playMetallicClick();
    setDiscountPercent(0);
    setAppliedPromo(null);
    setPromoError(null);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim() || !newReviewUser.trim()) return;
    playSwoosh();

    const newRev: CourtReview = {
      id: `rev-${Date.now()}`,
      courtId: selectedCourt.id,
      user: newReviewUser.trim(),
      rating: newReviewRating,
      text: newReviewText.trim(),
      time: 'Just now'
    };

    const updated = [newRev, ...reviews];
    setReviews(updated);
    localStorage.setItem('y68_court_reviews', JSON.stringify(updated));

    // Clear form
    setNewReviewUser('');
    setNewReviewText('');
    setNewReviewRating(5);
  };

  const handleBookSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (weather === 'rainy' && selectedCourt.type === 'outdoor') {
      alert("⚠️ Weather Alert: Outdoor court cannot be booked under severe rain storms.");
      return;
    }

    playSwoosh();
    const passCode = `HHUB-BK-${Math.floor(1000 + Math.random() * 9000)}`;
    setBookingPassId(passCode);
    setIsBookedSuccess(true);
  };

  // Hours Matrix
  const hours = [8, 10, 12, 14, 16, 18, 20, 22];

  const filteredCourts = COURTS_DATA.filter(court => {
    const matchesType = filterType === 'all' ? true : court.type === filterType;
    const matchesTurf = filterTurf === 'all' ? true : court.turf === filterTurf;
    const matchesSearch = court.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          court.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          court.turf.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesParking = !filterParking || !!court.hasParking;
    const matchesShowers = !filterShowers || !!court.hasShowers;
    const matchesLockers = !filterLockers || !!court.hasLockers;
    return matchesType && matchesTurf && matchesSearch && matchesParking && matchesShowers && matchesLockers;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left" id="booking-module-root">
      
      {/* LEFT COLUMN: COURT DIRECTORY AND SEARCH filters (7 Cols) */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Dynamic Weather Modifier Control Bar */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-neutral-900 to-neutral-950 border border-white/[0.08] space-y-4 shadow-[0_15px_30px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest flex items-center gap-1.5 leading-none">
              <Activity size={12} className="text-orange-500" /> METEOROLOGICAL LIVE SIMULATION
            </span>
            <span className="text-[9px] font-mono font-bold bg-[#0f0f0f] text-orange-400 px-2.5 py-0.5 rounded-full border border-orange-500/10">
              {weather === 'perfect' ? '☀️ Perfect Dusk 26°C' : weather === 'rainy' ? '🌧️ Monsoon Storm 21°C' : '🔥 Indian Heatwave 42°C'}
            </span>
          </div>

          <p className="text-[10px] text-zinc-400 leading-relaxed font-normal font-sans">
            Weather changes local demand. Extreme Heat increases indoor AC surge rates (+15%). Heavy rain disables or slashes outdoor bookings by 50%.
          </p>

          <div className="grid grid-cols-3 gap-2">
            {(['perfect', 'rainy', 'heatwave'] as WeatherState[]).map(wState => (
              <button
                key={wState}
                onClick={() => { playMetallicClick(); setWeather(wState); }}
                className={`py-2 px-1 text-[9.5px] font-bold uppercase rounded-xl transition-all border cursor-pointer ${
                  weather === wState
                    ? 'bg-orange-600 text-white border-orange-500 shadow-lg'
                    : 'bg-neutral-900/40 text-zinc-400 border-neutral-800 hover:text-white'
                }`}
              >
                {wState === 'perfect' ? '☀️ 26°C Clear' : wState === 'rainy' ? '🌧️ Monsoon Storm' : '🔥 42°C Heatwave'}
              </button>
            ))}
          </div>
        </div>

        {/* Discovery Filter and Search Bar */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="text"
              placeholder="Search by court name, turf type, or ward..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow bg-neutral-950 border border-white/[0.06] rounded-xl p-3.5 text-xs text-white outline-none w-full focus:border-orange-500/40 transition-colors shadow-inner"
            />
            
            <div className="flex gap-2.5">
              <select 
                value={filterType}
                onChange={(e) => { playMetallicClick(); setFilterType(e.target.value as any); }}
                className="bg-neutral-950 border border-white/[0.06] rounded-xl px-3 py-3 text-xs text-white outline-none cursor-pointer font-bold focus:border-orange-500/40 transition-colors shadow-inner"
              >
                <option value="all">All Arenas</option>
                <option value="indoor">Indoor AC</option>
                <option value="outdoor">Outdoor Cages</option>
              </select>

              <select 
                value={filterTurf}
                onChange={(e) => { playMetallicClick(); setFilterTurf(e.target.value); }}
                className="bg-neutral-950 border border-white/[0.06] rounded-xl px-3 py-3 text-xs text-white outline-none cursor-pointer font-bold focus:border-orange-500/40 transition-colors shadow-inner"
              >
                <option value="all">All Turfs</option>
                <option value="hardwood">Hardwood Maple</option>
                <option value="acrylic">Acrylic Cushion</option>
                <option value="concrete">Concrete Asphalt</option>
                <option value="smart-turf">Cyber-Rubber</option>
              </select>
            </div>
          </div>

          {/* Court cards vertical listings */}
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 select-none scrollbar-thin">
            {filteredCourts.map(court => {
              const isSelected = selectedCourt.id === court.id;
              const computedRate = getCalculatedPrice(court, selectedHour);
              const isClosed = weather === 'rainy' && court.type === 'outdoor';

              return (
                <div 
                  key={court.id}
                  onClick={() => handleSelectCourt(court)}
                  className={`p-4 bg-[#0a0a0a] border rounded-2xl flex flex-col sm:flex-row gap-5 cursor-pointer transition-all duration-300 ${
                    isSelected 
                      ? 'border-orange-500 shadow-[0_10px_25px_rgba(234,88,12,0.15)] -translate-y-1' 
                      : 'border-white/[0.06] hover:border-white/20 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-white/[0.02]'
                  } ${isClosed ? 'opacity-50 blur-[0.5px] pointer-events-none' : ''}`}
                >
                  <div className="sm:w-1/3 aspect-[4/3] rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 relative">
                    <img 
                      src={court.image} 
                      alt={court.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover grayscale brightness-95 group-hover:grayscale-0 transition-all"
                    />
                    {isClosed ? (
                      <span className="absolute inset-0 bg-black/80 backdrop-blur-xs flex flex-col items-center justify-center text-red-500 font-extrabold text-[10px] uppercase gap-1">
                        <AlertCircle size={14} /> WATERLOGGED / CLOSED
                      </span>
                    ) : (
                      <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/80 text-[8px] text-zinc-300 font-bold uppercase tracking-widest border border-white/5">
                        {court.type}
                      </span>
                    )}
                  </div>

                  <div className="flex-grow flex flex-col justify-between text-left space-y-1">
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="font-display font-medium text-white text-[13.5px] uppercase tracking-wider">{court.name}</h4>
                        <div className="flex items-center text-yellow-500 text-[10px] font-bold">
                          ★ {court.rating}
                        </div>
                      </div>
                      <p className="text-[9.5px] text-zinc-500 font-mono flex items-center gap-1">
                        <MapPin size={9} /> {court.location}
                      </p>
                      <p className="text-[10px] text-zinc-400 font-sans leading-relaxed line-clamp-2 mt-1">
                        {court.desc}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/[0.04] mt-2">
                      <div className="flex flex-wrap gap-1.5 text-[8.5px] font-bold uppercase font-mono">
                        <span className="bg-neutral-900 px-2 py-0.5 rounded text-zinc-400">Turf: {court.turf}</span>
                        {court.hasAC && <span className="bg-cyan-950/40 px-2 py-0.5 rounded text-cyan-400 border border-cyan-900/30">✓ A/C Fitted</span>}
                        {court.hasLighting && <span className="bg-amber-950/40 px-2 py-0.5 rounded text-amber-400 border border-amber-900/30">✓ Illumination LEDs</span>}
                      </div>

                      <div className="text-right flex flex-col leading-none">
                        <span className="text-[11px] font-extrabold text-orange-400 font-mono">₹{computedRate.toLocaleString()}/hr</span>
                        <span className="text-[7.5px] text-zinc-500 uppercase font-mono mt-0.5">Surge Active</span>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: BOOKING SCHEDULER & COST DIVISION CARD (5 Cols) */}
      <div className="lg:col-span-5">
        <div className="bg-gradient-to-b from-neutral-900 to-neutral-950 border border-white/[0.08] rounded-3xl p-6 space-y-6 sticky top-24 shadow-[0_20px_40px_rgba(0,0,0,0.55)]">
          
          <div className="pb-4 border-b border-white/[0.08] text-left">
            <span className="text-[8px] font-bold text-orange-500 uppercase tracking-widest block font-mono">SELECTED HUB SPOT</span>
            <h3 className="font-display text-white text-base font-bold uppercase tracking-wider mt-0.5 leading-tight">{selectedCourt.name}</h3>
            <span className="text-[9.5px] text-zinc-400 font-mono block mt-1">Dynamic billing rate: <strong>₹{getCalculatedPrice(selectedCourt, selectedHour).toLocaleString()}/hour</strong></span>
          </div>

          {/* INTERACTIVE COURT MAP VISUALIZER */}
          <div className="relative h-[115px] w-full rounded-2xl bg-black border border-white/10 overflow-hidden flex flex-col justify-between p-2.5">
            
            {/* Stars if outdoor */}
            {selectedCourt.type === 'outdoor' && (
              <div className="absolute inset-0 pointer-events-none opacity-40">
                <div className="absolute top-2 left-[10%] w-0.5 h-0.5 bg-white rounded-full animate-ping" />
                <div className="absolute top-4 left-[40%] w-0.5 h-0.5 bg-white rounded-full animate-pulse" />
                <div className="absolute top-1 left-[75%] w-0.5 h-0.5 bg-white rounded-full animate-pulse" />
                <div className="absolute top-6 left-[80%] w-0.5 h-0.5 bg-white rounded-full animate-ping" />
              </div>
            )}

            {/* Falling rain streams if rainy + outdoor */}
            {selectedCourt.type === 'outdoor' && weather === 'rainy' && (
              <div className="absolute inset-0 pointer-events-none opacity-60 overflow-hidden z-20">
                <svg className="w-full h-full text-cyan-400">
                  <line x1="20" y1="-10" x2="10" y2="110" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
                  <line x1="60" y1="-10" x2="50" y2="110" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" className="animate-pulse" />
                  <line x1="110" y1="-10" x2="100" y2="110" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
                  <line x1="150" y1="-10" x2="140" y2="110" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" className="animate-pulse" />
                  <line x1="190" y1="-10" x2="180" y2="110" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
                </svg>
              </div>
            )}

            {/* Heat radiation or AC Streams */}
            {selectedCourt.type === 'indoor' && selectedCourt.hasAC && weather === 'heatwave' && (
              <div className="absolute inset-x-0 top-0 h-4.5 bg-cyan-500/10 border-b border-cyan-500/10 text-[7px] text-cyan-400 font-mono flex items-center justify-between px-2 z-10">
                <span>🌬️ AC CLIMATE LOCK</span>
                <span className="animate-pulse">ACTIVE FLOW 18°C</span>
              </div>
            )}

            <svg viewBox="0 0 200 100" className="w-full h-[85px] self-center">
              {/* Floor wood or composite rubber styling */}
              <rect x="0" y="0" width="200" height="100" rx="8" fill={selectedCourt.turf === 'hardwood' ? '#1c150c' : selectedCourt.turf === 'smart-turf' ? '#08141f' : '#141414'} />
              
              {/* Outer boundary lines */}
              <rect x="5" y="5" width="190" height="90" rx="4" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.75" />
              
              {/* Center boundary lines */}
              <line x1="100" y1="5" x2="100" y2="95" stroke="rgba(255,255,255,0.15)" strokeWidth="0.75" />
              <circle cx="100" cy="50" r="15" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.75" />
              
              {/* Left rim */}
              <rect x="5" y="32" width="25" height="36" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.75" />
              <circle cx="15" cy="50" r="3" fill="#ea580c" /> 

              {/* Right rim */}
              <rect x="170" y="32" width="25" height="36" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.75" />
              <circle cx="185" cy="50" r="3" fill="#ea580c" /> 
              
              {/* Selected court indicator ring pulse */}
              <circle cx="100" cy="50" r="4" fill="#f97316" className="animate-ping" />
              <circle cx="100" cy="50" r="2.5" fill="#f97316" />
            </svg>
            
            <div className="flex justify-between items-center text-[7.5px] font-mono text-zinc-500 px-1 leading-none">
              <span>EST. STABILITY INDEX: {selectedCourt.turf === 'hardwood' ? '98% (MAX RIGIDITY)' : selectedCourt.turf === 'smart-turf' ? '95% SHOCK ABS' : '88% PITCH'}</span>
              <span className="text-orange-400 uppercase font-bold tracking-wider">{selectedCourt.turf} Surface</span>
            </div>
          </div>

          {!isBookedSuccess ? (
            <form onSubmit={handleBookSlot} className="space-y-4 text-left">
              
              {/* Pick Day and time matrix */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest leading-none flex items-center gap-1">
                    <Calendar size={10} className="text-orange-500" /> Book Date
                  </label>
                  <input 
                    type="date"
                    required
                    value={selectedDate}
                    onChange={(e) => { playMetallicClick(); setSelectedDate(e.target.value); }}
                    className="bg-[#0c0c0c] border border-white/[0.08] rounded-xl p-3 text-xs text-white outline-none w-full font-semibold font-mono focus:border-orange-500/40 transition-colors shadow-inner"
                  />
                </div>

                <div className="flex flex-col gap-1.5 font-mono">
                  <label className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest leading-none flex items-center gap-1">
                    <Clock size={10} className="text-orange-500" /> Hourly Slot (surges apply)
                  </label>
                  <select
                    value={selectedHour}
                    onChange={(e) => { playMetallicClick(); setSelectedHour(parseInt(e.target.value)); }}
                    className="bg-[#0c0c0c] border border-white/[0.08] rounded-xl p-3 text-xs text-white outline-none cursor-pointer font-bold focus:border-orange-500/40 transition-colors shadow-inner"
                  >
                    {hours.map(hr => {
                      const computedPrice = getCalculatedPrice(selectedCourt, hr);
                      const isPeak = hr >= 16 && hr <= 21;
                      const timeLabel = hr >= 12 ? `${hr === 12 ? 12 : hr - 12} PM` : `${hr} AM`;
                      return (
                        <option key={hr} value={hr}>
                          {timeLabel} (₹{computedPrice.toLocaleString()}/hr {isPeak ? '⚡ Peak' : ''})
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              {/* Group booking split divisions */}
              <div className="p-4 bg-black/40 border border-white/[0.08] rounded-2xl space-y-4 shadow-inner">
                <div className="flex justify-between items-center text-[9.5px] font-bold text-zinc-400 uppercase tracking-wide">
                  <span className="flex items-center gap-1">
                    <Users size={11} className="text-orange-500" /> Split pay with friends
                  </span>
                  <span className="font-mono text-white text-xs">Division: {splitCount} Player(s)</span>
                </div>

                <input 
                  type="range"
                  min="1"
                  max="6"
                  step="1"
                  value={splitCount}
                  onChange={(e) => { playMetallicClick(); setSplitCount(parseInt(e.target.value)); }}
                  className="w-full accent-orange-500 appearance-none h-[4px] bg-neutral-800 rounded-full cursor-pointer outline-none"
                />

                {/* Calculator box */}
                <div className="grid grid-cols-2 gap-2 text-[10px] pt-1 leading-tight font-mono">
                  <div className="flex flex-col p-2 bg-neutral-950 rounded-lg border border-white/[0.03]">
                    <span className="text-[7.5px] text-zinc-500 uppercase tracking-wider block">Est. Hourly Rent</span>
                    <span className="text-white font-extrabold text-sm mt-0.5">₹{getCalculatedPrice(selectedCourt, selectedHour).toLocaleString()}</span>
                  </div>

                  <div className="flex flex-col p-2 bg-neutral-950 rounded-lg border border-white/[0.03]">
                    <span className="text-[7.5px] text-zinc-500 uppercase tracking-wider block">Your Split (1/{splitCount})</span>
                    <span className="text-orange-400 font-extrabold text-sm mt-0.5">
                      ₹{Math.round(getCalculatedPrice(selectedCourt, selectedHour) / splitCount).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Dynamically display input indicators for split-pay friend entries */}
                {splitCount > 1 && (
                  <div className="space-y-1.5 pt-2 border-t border-white/[0.04] text-left">
                    <span className="text-[8px] text-zinc-400 font-mono uppercase font-bold block">Invite colleagues to split bill via SMS / Email:</span>
                    <div className="grid grid-cols-2 gap-1.5">
                       {Array.from({ length: splitCount - 1 }).map((_, i) => (
                         <input 
                           key={i}
                           type="text"
                           placeholder={`Teammate @handle #${i + 1}`}
                           className="bg-neutral-950 border border-neutral-800 text-[9.5px] text-zinc-300 px-2 py-1.5 rounded-lg placeholder-zinc-700 outline-none font-mono focus:border-orange-500/30 transition-colors"
                         />
                       ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Info Warnings */}
              <div className="flex gap-2 p-2.5 bg-orange-600/5 rounded-xl border border-orange-500/10 text-[9.5px] text-orange-200/80 leading-normal">
                <Info size={12} className="text-orange-400 flex-shrink-0 mt-0.5" />
                <p>
                  {selectedCourt.type === 'outdoor' && weather === 'rainy' ? (
                    <span className="text-red-400 font-bold">❌ Storm Alert prevents booking outdoor cages now. Please select indoor.</span>
                  ) : (
                    <span>Reservations locked inside our server immediately. No-show without 2-hour cancellation forfeits court clearance.</span>
                  )}
                </p>
              </div>

              <button
                type="submit"
                disabled={selectedCourt.type === 'outdoor' && weather === 'rainy'}
                className={`w-full py-3 rounded-xl font-display font-medium text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                  selectedCourt.type === 'outdoor' && weather === 'rainy' 
                    ? 'bg-neutral-800 text-zinc-500 cursor-not-allowed border border-neutral-700' 
                    : 'bg-orange-600 hover:bg-orange-500 hover:text-black text-white cursor-pointer shadow-xl'
                }`}
              >
                Secure Booking Pass
              </button>

            </form>
          ) : (
            
            /* SUCCESS PASS DISPLAY WITH VALID QR GRAPHICS */
            <div className="space-y-4 text-center">
              
              <div className="w-10 h-10 rounded-full bg-emerald-950 border border-emerald-500/20 text-emerald-400 text-base flex items-center justify-center mx-auto animate-bounce">
                ✓
              </div>

              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[8px] text-emerald-400 font-bold uppercase tracking-widest">
                  ACCESS TICKET ACTIVE
                </span>
                <h4 className="font-display text-white text-base uppercase font-bold tracking-wider pt-2">INDIA COURT ALLOCATION</h4>
                <p className="text-[10.5px] text-zinc-400">
                  Confirmed: <strong>{selectedCourt.name}</strong> on <em>{selectedDate}</em> at {selectedHour >= 12 ? `${selectedHour === 12 ? 12 : selectedHour - 12} PM` : `${selectedHour} AM`}.
                </p>
              </div>

              {/* QR ACCESS GRID BLOCK */}
              <div className="p-4 bg-white rounded-2xl max-w-[130px] mx-auto shadow-xl border border-white/5 relative">
                <svg viewBox="0 0 100 100" className="w-full h-full text-black">
                  <rect x="5" y="5" width="22" height="22" fill="black" />
                  <rect x="9" y="9" width="14" height="14" fill="white" />
                  <rect x="12" y="12" width="8" height="8" fill="black" />
                  
                  <rect x="73" y="5" width="22" height="22" fill="black" />
                  <rect x="77" y="9" width="14" height="14" fill="white" />
                  <rect x="80" y="12" width="8" height="8" fill="black" />

                  <rect x="5" y="73" width="22" height="22" fill="black" />
                  <rect x="9" y="77" width="14" height="14" fill="white" />
                  <rect x="12" y="80" width="8" height="8" fill="black" />

                  {/* Booking code matrix */}
                  <path d="M 32 5 L 40 5 L 40 32 L 32 32 Z M 50 15 L 60 15 L 60 25 L 50 25 Z" fill="black" />
                  <path d="M 32 40 L 52 40 L 52 52 L 32 52 Z M 60 40 L 70 40 L 70 60 L 60 60 Z" fill="black" />
                  <path d="M 5 32 L 20 32 L 20 45 L 5 45 Z" fill="black" />
                  <path d="M 32 75 L 62 75 L 62 82 L 32 82 Z M 73 32 L 95 32 L 95 50 L 73 50 Z" fill="black" />
                  <circle cx="50" cy="50" r="5" fill="black" />
                </svg>
              </div>

              <div className="space-y-1 bg-[#0f0f0f] p-2 rounded-xl border border-white/5 font-mono">
                <span className="text-[8px] text-zinc-500 uppercase">ACCESS CODE</span>
                <p className="text-sm font-extrabold text-white tracking-widest">{bookingPassId}</p>
              </div>

              <p className="text-[9.5px] text-zinc-500 leading-normal max-w-[240px] mx-auto">
                Scan this QR at the terminal cage gateway upon arrivals. Split payments with your friends is configured; they will receive invite messages instantly!
              </p>

              <button
                type="button"
                onClick={() => { playMetallicClick(); setIsBookedSuccess(false); }}
                className="px-4 py-1.5 bg-neutral-900 hover:bg-[#1a1a1a] text-zinc-300 rounded-lg text-[9px] uppercase font-bold tracking-wider cursor-pointer transition-colors border border-white/5"
              >
                Book another slot
              </button>

            </div>
          )}

        </div>
      </div>

    </div>
  );
}
