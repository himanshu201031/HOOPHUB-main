import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import MapModal from './MapModal';
import { playMetallicClick, playSwoosh } from '../utils/audio';
import { ShoppingBag, Calendar, Users, MapPin, Check, Plus, ShoppingCart, Trash2, ArrowRight, X, Sparkles } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  desc: string;
  category: 'ball' | 'gear';
  image: string;
}

interface Court {
  id: string;
  name: string;
  location: string;
  price: string;
  difficulty: string;
}

interface Teammate {
  id: string;
  name: string;
  pos: string;
  level: string;
  status: string;
  invited?: boolean;
}

const PRODUCTS: Product[] = [
  { id: '1', name: 'Wilson Classic', price: 2499, desc: 'Authentic micro-groove composite leather streetball.', category: 'ball', image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=200&q=80' },
  { id: '2', name: 'Lunar Carbon 3D', price: 4999, desc: 'High-density matte bounce tech with cybernetic grip.', category: 'ball', image: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a27?auto=format&fit=crop&w=200&q=80' },
  { id: '3', name: 'Vapor Neon Glow', price: 3499, desc: 'Fluorescent nylon thread seams for twilight matches.', category: 'ball', image: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&w=200&q=80' },
  { id: '4', name: 'Stealth Matte Black', price: 3999, desc: 'Championship grade black leather with anti-slip channel.', category: 'ball', image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=200&q=80' },
  { id: '5', name: 'Ultra-Grip Traction Gel', price: 699, desc: 'Premium anti-perspirant court grip enhancer.', category: 'gear', image: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a27?auto=format&fit=crop&w=200&q=80' },
  { id: '6', name: 'Titanium Air Pump', price: 1199, desc: 'High-capacity pressure-gauge hand pump.', category: 'gear', image: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&w=200&q=80' }
];

const COURTS: Court[] = [
  { id: 'c1', name: 'Madison Square Garden', location: 'New York, USA', price: '₹1200 / hr', difficulty: 'Elite' },
  { id: 'c2', name: 'Bandra Court Yard', location: '123 Carter Road, Bandra West, Mumbai', price: 'Free', difficulty: 'Elite' },
  { id: 'c3', name: 'Mumbai Sky Pitch', location: 'Hiranandani Gardens, Powai, Mumbai', price: '₹400 / hr', difficulty: 'Intermediate' },
  { id: 'c4', name: 'Bengaluru Warehouse Court', location: 'Indiranagar Core Complex, Bengaluru', price: '₹600 / hr', difficulty: 'Hardcore' }
];

const INITIAL_TEAMMATES: Teammate[] = [
  { id: 't1', name: 'Kenji S.', pos: 'SF', level: 'A-', status: '1.2km away' },
  { id: 't2', name: 'Sarah L.', pos: 'PG', level: 'S', status: '300m away' },
  { id: 't3', name: 'Marcus V.', pos: 'C', level: 'A+', status: '2.5km away' },
  { id: 't4', name: 'Haru Y.', pos: 'SG', level: 'B+', status: '800m away' }
];

export default function HeroSection() {
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'shop' | 'booking' | 'match'>('shop');
  
  // Cart, Teammates, Booking persistence state
  const [teammates, setTeammates] = useState<Teammate[]>(INITIAL_TEAMMATES);
  const [bookings, setBookings] = useState<{ id: string; courtName: string; date: string; time: string; duration: string }[]>([]);
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'shipping' | 'success'>('cart');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Form states
  const [newTeammateName, setNewTeammateName] = useState('');
  const [newTeammatePos, setNewTeammatePos] = useState('PG');
  const [newTeammateLevel, setNewTeammateLevel] = useState('A');
  
  const [selectedCourtId, setSelectedCourtId] = useState('c1');
  const [bookingDate, setBookingDate] = useState('Today');
  const [bookingTime, setBookingTime] = useState('06:00 PM');
  const [bookingDuration, setBookingDuration] = useState('2 Hours');

  const [shippingName, setShippingName] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');

  const cardRef1 = useRef<HTMLDivElement>(null);
  const cardRef2 = useRef<HTMLDivElement>(null);
  const cardRef3 = useRef<HTMLDivElement>(null);
  const upcomingCardRef = useRef<HTMLDivElement>(null);
  const hooplyContainerRef = useRef<HTMLDivElement>(null);

  // Sync state from LocalStorage
  useEffect(() => {
    try {
      const storedBookings = localStorage.getItem('y68_bookings');
      if (storedBookings) setBookings(JSON.parse(storedBookings));
      
      const storedTeammates = localStorage.getItem('y68_teammates');
      if (storedTeammates) setTeammates(JSON.parse(storedTeammates));
    } catch (e) {
      console.warn("Storage syncing not supported", e);
    }
  }, []);

  const saveBookings = (updatedBookings: typeof bookings) => {
    setBookings(updatedBookings);
    localStorage.setItem('y68_bookings', JSON.stringify(updatedBookings));
  };

  const saveTeammates = (updatedTeammates: typeof teammates) => {
    setTeammates(updatedTeammates);
    localStorage.setItem('y68_teammates', JSON.stringify(updatedTeammates));
  };

  // Add Item to Cart
  const addToCart = (product: Product) => {
    playSwoosh();
    setCart((prev) => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (pId: string) => {
    playMetallicClick();
    setCart(prev => prev.filter(item => item.product.id !== pId));
  };

  const calculateTotal = () => {
    return cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingName || !shippingAddress) return;
    playSwoosh();
    setCheckoutStep('success');
    setTimeout(() => {
      setCart([]);
    }, 1500);
  };

  const handleBookCourt = () => {
    const selectedCourt = COURTS.find(c => c.id === selectedCourtId) || COURTS[0];
    const newBooking = {
      id: 'book_' + Date.now(),
      courtName: selectedCourt.name,
      date: bookingDate,
      time: bookingTime,
      duration: bookingDuration
    };
    const updated = [newBooking, ...bookings];
    saveBookings(updated);
    playSwoosh();
  };

  const handleCancelBooking = (bId: string) => {
    playMetallicClick();
    const filtered = bookings.filter(b => b.id !== bId);
    saveBookings(filtered);
  };

  const handleAddTeammate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeammateName.trim()) return;
    
    const newMember: Teammate = {
      id: 'team_' + Date.now(),
      name: newTeammateName.trim(),
      pos: newTeammatePos,
      level: newTeammateLevel,
      status: 'Active Now'
    };

    const updated = [newMember, ...teammates];
    saveTeammates(updated);
    setNewTeammateName('');
    playSwoosh();
  };

  const handleInviteTeammate = (id: string) => {
    playMetallicClick();
    setTeammates(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, invited: true };
      }
      return t;
    }));
  };

  useEffect(() => {
    // Elegant entrance animation matching the high contrast design mockup
    const tl = gsap.timeline();
    tl.fromTo('.hero-title-char', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.05, ease: 'power4.out' });
  }, []);

  return (
    <section 
      id="hero-section" 
      className="relative min-h-screen w-full flex flex-col justify-between pt-32 pb-12 px-6 md:px-12 overflow-hidden bg-transparent select-none pointer-events-none *:pointer-events-auto"
    >
      {/* BACKGROUND ATMOSPHERIC GRID & OCCASIONAL CYBERNETIC NEON GLOWS */}
      <div className="absolute inset-0 z-0 opacity-15 pointer-events-none bg-[radial-gradient(#1e1e1e_1.5px,transparent_1.5px)] [background-size:24px_24px]" />

      {/* GIANT HOOPLY DISPLAY TITLE SCREEN LAYER (Z: 20) */}
      <div 
        ref={hooplyContainerRef}
        className="absolute inset-x-0 top-[48%] -translate-y-1/2 z-10 pointer-events-none flex items-center justify-center w-full"
      >
        <h1 className="flex font-black font-sans leading-none tracking-tight text-[11.5vw] md:text-[13vw] uppercase select-none w-full justify-center items-center">
          <span className="text-white hero-title-char">H</span>
          <span className="text-white hero-title-char">O</span>
          
          {/* Outlined O: The center point coincides with the centered 3D basketball! */}
          <span 
            className="text-transparent hero-title-char relative mx-1"
            style={{ 
              WebkitTextStroke: '1.2px rgba(255,255,255,0.7)', 
              textStroke: '1.2px rgba(255,255,255,0.7)' 
            }}
          >
            O
          </span>
          
          {/* Outlined P */}
          <span 
            className="text-transparent hero-title-char relative mr-1"
            style={{ 
              WebkitTextStroke: '1.2px rgba(255,255,255,0.7)', 
              textStroke: '1.2px rgba(255,255,255,0.7)' 
            }}
          >
            P
          </span>
          <span className="text-white hero-title-char">L</span>
          <span className="text-white hero-title-char">Y</span>
        </h1>
      </div>



      {/* STYLISH ORANGE BACKLIGHT SHADOW FOR 3D SENSATION */}
      <div className="absolute top-[48%] left-[50%] -translate-x-[50%] -translate-y-[50%] w-[50vh] h-[50vh] rounded-full bg-orange-600/10 z-0 pointer-events-none blur-[95px]" />

      {/* BRIGHT GLOWING SILHOUETTE REMOVED AT USER REQUEST FOR CENTERED 3D VIEW */}




      {/* FLOAT INTERACTIVE SLIDING CONTROL DRAWER FOR APP CAPABILITIES */}
      {isPanelOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-[9990] flex items-center justify-start anim-fade-in pointer-events-auto">
          <div className="w-full max-w-lg h-full bg-[#0d0d0e] border-r border-white/[0.08] shadow-2xl p-6 md:p-8 flex flex-col justify-between space-y-6 relative overflow-y-auto">
            {/* Close button */}
            <button 
              onClick={() => { playMetallicClick(); setIsPanelOpen(false); }}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-neutral-900 hover:bg-neutral-800 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors shadow"
            >
              <X size={18} />
            </button>

            {/* Drawer Heading details */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[8.5px] font-mono tracking-widest text-[#d4f82a] font-black uppercase">
                <Sparkles size={11} /> Kyoto Metropolitan Hub
              </div>
              <h2 className="font-display text-white text-2xl font-black uppercase tracking-wider">
                Court Command Center
              </h2>
              <p className="text-xs text-zinc-400 font-normal leading-relaxed">
                Unlock active court reservations, equipment purchase bins, and matching street teammates near Carter Road.
              </p>
            </div>

            {/* Inner Tabs navigation */}
            <div className="grid grid-cols-3 bg-neutral-900/60 p-1 rounded-xl border border-white/5 relative z-10">
              <button
                onClick={() => { playMetallicClick(); setActiveTab('shop'); }}
                className={`py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all duration-150 ${
                  activeTab === 'shop' 
                    ? 'bg-white text-black font-extrabold shadow' 
                    : 'text-zinc-500 hover:text-white'
                }`}
              >
                Shop Gear
              </button>
              <button
                onClick={() => { playMetallicClick(); setActiveTab('booking'); }}
                className={`py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all duration-150 ${
                  activeTab === 'booking' 
                    ? 'bg-white text-black font-extrabold shadow' 
                    : 'text-zinc-500 hover:text-white'
                }`}
              >
                Book Court
              </button>
              <button
                onClick={() => { playMetallicClick(); setActiveTab('match'); }}
                className={`py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all duration-150 ${
                  activeTab === 'match' 
                    ? 'bg-white text-black font-extrabold shadow' 
                    : 'text-zinc-500 hover:text-white'
                }`}
              >
                Teammates
              </button>
            </div>

            {/* Dynamic tab contents (Shop Gear) */}
            <div className="flex-1 overflow-y-auto pr-1">
              {activeTab === 'shop' && (
                <div className="space-y-4 text-left">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider leading-none">EQUIPMENT PRO VAULT</h3>
                      <p className="text-[9.5px] text-zinc-500 font-semibold mt-1">Acquire elite signature leather basketballs</p>
                    </div>

                    <button 
                      onClick={() => { playMetallicClick(); setIsCheckoutOpen(true); setCheckoutStep('cart'); }}
                      className="px-3 py-1.5 rounded-lg bg-orange-600/10 border border-orange-500/20 text-orange-400 text-[10px] font-bold tracking-widest uppercase hover:bg-orange-600/20 transition-all flex items-center gap-1.5 cursor-pointer relative"
                    >
                      <ShoppingCart size={11} />
                      <span>Bag ({cart.reduce((ac, it) => ac + it.quantity, 0)})</span>
                      {cart.length > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 bg-red-600 text-[9px] font-bold rounded-full flex items-center justify-center text-white font-mono">
                          {cart.reduce((ac, it) => ac + it.quantity, 0)}
                        </span>
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
                    {PRODUCTS.map(product => (
                      <div key={product.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 flex flex-col justify-between gap-3 transition-colors">
                        <div className="flex items-center gap-3">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 object-cover rounded-lg border border-white/5 grayscale group-hover:grayscale-0 transition-all"
                          />
                          <div className="flex flex-col text-left">
                            <span className="text-[11px] font-bold text-white uppercase tracking-wide">{product.name}</span>
                            <span className="text-[9px] text-zinc-400 font-medium leading-normal line-clamp-1">{product.desc}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-white/[0.02]">
                          <span className="font-mono text-xs font-bold text-orange-400">${product.price}</span>
                          <button 
                            onClick={() => addToCart(product)}
                            className="px-3 py-1 text-[9px] font-bold uppercase rounded-lg bg-white hover:bg-zinc-200 text-black cursor-pointer flex items-center gap-1 transition-all"
                          >
                            <Plus size={10} /> Buy
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dynamic tab contents (Book Court) */}
              {activeTab === 'booking' && (
                <div className="space-y-4 text-left">
                  <div className="pb-2 border-b border-white/5">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider leading-none">CENTER COURT SCHEDULER</h3>
                    <p className="text-[9.5px] text-zinc-500 font-semibold mt-1">Reserve private hours in top-tiered stadium complexes</p>
                  </div>

                  <div className="space-y-3.5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Select Location Court</label>
                      <select 
                        value={selectedCourtId}
                        onChange={(e) => setSelectedCourtId(e.target.value)}
                        className="bg-neutral-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-white outline-none font-bold cursor-pointer"
                      >
                        {COURTS.map(court => (
                          <option key={court.id} value={court.id} className="bg-neutral-950 text-white">
                            {court.name} ({court.price}) - {court.location}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Appointment Day</label>
                        <select 
                          value={bookingDate}
                          onChange={(e) => setBookingDate(e.target.value)}
                          className="bg-neutral-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-white outline-none font-bold cursor-pointer"
                        >
                          <option value="Today">Today (May 30)</option>
                          <option value="Tomorrow">Tomorrow (May 31)</option>
                          <option value="This Saturday">This Saturday</option>
                          <option value="Next Monday">Next Monday</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Time Window</label>
                        <select 
                          value={bookingTime}
                          onChange={(e) => setBookingTime(e.target.value)}
                          className="bg-neutral-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-white outline-none font-bold cursor-pointer"
                        >
                          <option value="08:00 AM">08:00 AM (Early Rush)</option>
                          <option value="01:00 PM">01:00 PM</option>
                          <option value="04:00 PM">04:00 PM</option>
                          <option value="06:00 PM">06:00 PM (Prime Time)</option>
                          <option value="08:30 PM">08:30 PM (Under Lights)</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Game Duration</label>
                      <select 
                        value={bookingDuration}
                        onChange={(e) => setBookingDuration(e.target.value)}
                        className="bg-neutral-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-white outline-none font-bold cursor-pointer"
                      >
                        <option value="1 Hour">1 Hour (Slam Shootout)</option>
                        <option value="2 Hours">2 Hours (Standard Fullcourt)</option>
                        <option value="Half Day">Half Day Squad Lockout (COD / terminal)</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button 
                        onClick={() => setIsMapOpen(true)}
                        className="px-4 py-3 rounded-xl border border-white/15 hover:bg-white/5 text-[10.5px] font-bold text-zinc-200 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <MapPin size={12} className="text-orange-500" /> Interactive Map Center
                      </button>
                      
                      <button 
                        onClick={handleBookCourt}
                        className="px-4 py-3 rounded-xl bg-[#d4f82a] hover:bg-[#c2e425] text-black text-[10.5px] font-black uppercase tracking-widest transition-all cursor-pointer text-center font-sans shadow"
                      >
                        Register Court Booking
                      </button>
                    </div>

                    {bookings.length > 0 && (
                      <div className="pt-3 border-t border-white/5 space-y-2">
                        <span className="text-[8.5px] font-bold text-zinc-500 uppercase tracking-widest">Active reservation slots:</span>
                        <div className="max-h-[110px] overflow-y-auto space-y-1.5 pr-1">
                          {bookings.map(b => (
                            <div key={b.id} className="p-2.5 rounded-xl bg-orange-600/5 border border-orange-500/10 flex items-center justify-between text-xs text-orange-200">
                              <span className="font-bold">{b.courtName} ({b.date} - {b.time})</span>
                              <button 
                                onClick={() => handleCancelBooking(b.id)}
                                className="text-zinc-500 hover:text-red-400 text-[10px] font-bold underline px-1.5 cursor-pointer"
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

              {/* Dynamic tab contents (Teammates matching) */}
              {activeTab === 'match' && (
                <div className="space-y-4 text-left">
                  <div className="pb-2 border-b border-white/5">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider leading-none">TEAMMATES PICKUP QUEUE</h3>
                    <p className="text-[9.5px] text-zinc-500 font-semibold mt-1">Acquire invitations of active high-XP local athletes</p>
                  </div>

                  <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                    {teammates.map(t => (
                      <div key={t.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 flex items-center justify-between transition-colors">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-zinc-900 text-white font-black text-2xs flex items-center justify-center uppercase border border-white/10">
                            {t.name.substring(0, 2)}
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2 font-sans">
                              <span className="text-xs font-black text-white">{t.name}</span>
                              <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-[7px] text-orange-400 font-black tracking-widest">{t.pos}</span>
                              <span className="text-[8px] text-emerald-400 font-black font-mono">{t.level}</span>
                            </div>
                            <span className="text-[9px] text-zinc-500 mt-0.5">{t.status}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleInviteTeammate(t.id)}
                          disabled={t.invited}
                          className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all tracking-wider ${
                            t.invited 
                              ? 'bg-emerald-950/30 text-emerald-400 border border-emerald-800/10' 
                              : 'bg-white text-black hover:bg-zinc-200 cursor-pointer'
                          }`}
                        >
                          {t.invited ? '✓ Team Invited' : 'Send Invite'}
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add yourself to matchmaking form */}
                  <form onSubmit={handleAddTeammate} className="pt-3 border-t border-white/5 space-y-2.5">
                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Enroll in Local Matchmaking matchmaking</span>
                    <div className="grid grid-cols-[1.5fr_1fr_1fr_0.6fr] gap-2">
                      <input 
                        type="text"
                        required
                        placeholder="Your athlete name"
                        value={newTeammateName}
                        onChange={(e) => setNewTeammateName(e.target.value)}
                        className="bg-neutral-900 border border-white/5 rounded-xl px-3 py-2 text-xs text-white outline-none w-full"
                      />
                      <select 
                        value={newTeammatePos}
                        onChange={(e) => setNewTeammatePos(e.target.value)}
                        className="bg-neutral-900 border border-white/5 rounded-xl px-2 py-2 text-xs text-white outline-none cursor-pointer"
                      >
                        <option value="PG">PG (Guard)</option>
                        <option value="SG">SG (Guard)</option>
                        <option value="SF">SF (Forward)</option>
                        <option value="PF">PF (Forward)</option>
                        <option value="C">C (Center)</option>
                      </select>
                      <select 
                        value={newTeammateLevel}
                        onChange={(e) => setNewTeammateLevel(e.target.value)}
                        className="bg-neutral-900 border border-white/5 rounded-xl px-2 py-2 text-xs text-white outline-none cursor-pointer"
                      >
                        <option value="A">Lv. A</option>
                        <option value="S">Lv. S (Elite)</option>
                        <option value="B">Lv. B</option>
                        <option value="C">Lv. C</option>
                      </select>
                      <button 
                        type="submit"
                        className="rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold cursor-pointer h-full text-xs flex items-center justify-center transition-all active:scale-95"
                      >
                        +
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Panel footer details */}
            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[8.5px] font-mono text-zinc-600 uppercase font-black">
              <span>Bandra Tokyo Division Hub</span>
              <span>EXPERIMENTAL COURT SERVICE V1.0.8</span>
            </div>
          </div>
        </div>
      )}

      {/* MODAL SEARCH ELEMENT: INTERACTIVE MAP VIEWER */}
      <MapModal isOpen={isMapOpen} onClose={() => setIsMapOpen(false)} />

      {/* CHECKOUT CART MODAL OVERLAY (REPLACING THE PORTABLE SIDEDRAWER FROM OLD DESIGN) */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[10000] flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-neutral-950 border border-white/[0.08] rounded-2xl p-6 relative shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <h3 className="font-display text-white text-md font-bold tracking-wider uppercase">Order Basket checkout</h3>
              <button 
                onClick={() => setIsCheckoutOpen(false)} 
                className="w-7 h-7 rounded-full bg-neutral-900 hover:bg-neutral-800 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer text-sm font-bold"
              >
                ×
              </button>
            </div>

            {checkoutStep === 'cart' && (
              <div className="space-y-4 text-left">
                {cart.length === 0 ? (
                  <div className="text-center py-6 text-zinc-500 font-bold text-xs">
                    <p>Your equipment checkout bag is empty.</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                      {cart.map(item => (
                        <div key={item.product.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] flex justify-between items-center text-xs">
                          <div className="flex flex-col">
                            <span className="font-bold text-white uppercase">{item.product.name}</span>
                            <span className="text-[10px] text-orange-400 font-mono">${item.product.price} x {item.quantity}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-white">${item.product.price * item.quantity}</span>
                            <button 
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-zinc-500 hover:text-red-500 cursor-pointer p-1"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 rounded-xl bg-neutral-900 border border-white/5 flex justify-between items-center text-xs font-bold text-white">
                      <span>Total Amount:</span>
                      <span className="text-[#d4f82a] font-mono">${calculateTotal()}</span>
                    </div>

                    <button 
                      onClick={() => setCheckoutStep('shipping')}
                      className="w-full py-2 bg-white hover:bg-zinc-200 text-black font-bold text-xs uppercase tracking-wide rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    >
                      Process Shipping <ArrowRight size={12} />
                    </button>
                  </>
                )}
              </div>
            )}

            {checkoutStep === 'shipping' && (
              <form onSubmit={handleCheckoutSubmit} className="space-y-4 text-left">
                <div className="space-y-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Full Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Jane Doe"
                      value={shippingName}
                      onChange={(e) => setShippingName(e.target.value)}
                      className="bg-neutral-900 border border-white/5 rounded-xl p-3 text-xs text-white outline-none w-full"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Delivery Address</label>
                    <textarea 
                      required
                      rows={2}
                      placeholder="Carter Road, Bandra East, Mumbai - 400050"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      className="bg-neutral-900 border border-white/5 rounded-xl p-3 text-xs text-white outline-none w-full resize-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
                  <button 
                    type="button"
                    onClick={() => setCheckoutStep('cart')}
                    className="py-2 rounded-xl border border-white/10 hover:bg-white/5 text-zinc-300 font-bold text-2xs uppercase tracking-wider"
                  >
                    Back to Bag
                  </button>
                  <button 
                    type="submit"
                    className="py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-2xs uppercase tracking-wider"
                  >
                    Place Order
                  </button>
                </div>
              </form>
            )}

            {checkoutStep === 'success' && (
              <div className="text-center py-6 space-y-3">
                <div className="w-10 h-10 rounded-full bg-emerald-950 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-md mx-auto">
                  ✓
                </div>
                <div>
                  <h4 className="font-display text-white text-xs font-black uppercase">Order Registered!</h4>
                  <p className="text-[10px] text-zinc-400 mt-1">
                    Order was successfully saved to Slam India databases. Average delivery to <em>{shippingAddress}</em> is 24 hours.
                  </p>
                </div>
                <button
                  onClick={() => setIsCheckoutOpen(false)}
                  className="px-5 py-2 rounded-xl bg-white text-black text-[10px] font-black uppercase cursor-pointer hover:bg-zinc-200 transition-all font-mono"
                >
                  Return to Hub
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </section>
  );
}
