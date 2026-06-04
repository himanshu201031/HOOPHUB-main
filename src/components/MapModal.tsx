import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, X, ZoomIn, ZoomOut, Navigation, Compass, Layers, Copy, Check, HelpCircle, Footprints, Info } from 'lucide-react';

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type MapStyle = 'blueprint' | 'streets' | 'satellite';
type StartPoint = 'home' | 'station' | 'hotel';

export default function MapModal({ isOpen, onClose }: MapModalProps) {
  const [zoom, setZoom] = useState<number>(1.2);
  const [mapStyle, setMapStyle] = useState<MapStyle>('streets');
  const [startPoint, setStartPoint] = useState<StartPoint>('home');
  const [copied, setCopied] = useState<boolean>(false);
  const [selectedPoi, setSelectedPoi] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Reset view on open
  useEffect(() => {
    if (isOpen) {
      setZoom(1.2);
      setMapCenter({ x: 0, y: 0 });
      setSelectedPoi(null);
    }
  }, [isOpen]);

  const handleZoom = (direction: 'in' | 'out') => {
    setZoom((prev) => {
      const next = direction === 'in' ? prev + 0.2 : prev - 0.2;
      return Math.min(Math.max(next, 0.8), 2.5);
    });
  };

  const copyCoordinates = () => {
    navigator.clipboard.writeText('35.0264, 135.7809');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Dragging to pan the map
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - mapCenter.x, y: e.clientY - mapCenter.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setMapCenter({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Map settings and calculations based on start points
  const routeDetails = {
    home: {
      name: 'Your Bandra Lodging',
      distance: '1.1 km',
      time: '12 min walk',
      desc: 'An easy, scenic walk heading east along the northern canal and through the local residential lanes.',
      coords: { x: 120, y: 480 },
    },
    station: {
      name: 'Bandra Bus Terminal',
      distance: '1.9 km',
      time: '24 min walk / 6 min bike',
      desc: 'Follow the main tree-lined boulevard, turn past the library, and enter through Sakura Park west gate.',
      coords: { x: 740, y: 520 },
    },
    hotel: {
      name: 'Carter Road Riverside Inn',
      distance: '0.6 km',
      time: '7 min walk',
      desc: 'A straight shot past the bridge and riverside paths, slipping into the rear gates of the Shōten compound.',
      coords: { x: 340, y: 150 },
    },
  };

  // Seam/Court coords (The goal)
  const courtCoords = { x: 520, y: 310 };

  // Calculate coordinates for the selected route path
  const getRoutePath = () => {
    if (startPoint === 'home') {
      // Home is bottom-left
      return `M ${routeDetails.home.coords.x} ${routeDetails.home.coords.y} 
              L 280 480 
              L 280 340 
              L ${courtCoords.x} 340 
              L ${courtCoords.x} ${courtCoords.y}`;
    } else if (startPoint === 'station') {
      // Station is bottom-right
      return `M ${routeDetails.station.coords.x} ${routeDetails.station.coords.y} 
              L 740 400 
              L 580 400 
              L ${courtCoords.x} 340 
              L ${courtCoords.x} ${courtCoords.y}`;
    } else {
      // Hotel is top-left
      return `M ${routeDetails.hotel.coords.x} ${routeDetails.hotel.coords.y} 
              L 340 220 
              L 440 220 
              L ${courtCoords.x} 220 
              L ${courtCoords.x} ${courtCoords.y}`;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-hidden font-sans"
        >
          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative w-full max-w-5xl h-[88vh] md:h-[80vh] flex flex-col md:flex-row rounded-3xl overflow-hidden bg-[#0D0D0D] border border-white/10 shadow-2xl select-none"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* LEFT COLUMN: INTERACTIVE MAP VIEWER */}
            <div className="relative flex-grow h-[50%] md:h-full overflow-hidden bg-[#080808] border-b md:border-b-0 md:border-r border-white/10">
              
              {/* Floating Map Controls Overlay */}
              <div className="absolute top-4 left-4 z-50 flex flex-col gap-2 pointer-events-auto">
                <div className="flex bg-black/75 backdrop-blur-md rounded-xl p-1 border border-white/10 shadow-lg">
                  <button
                    onClick={() => handleZoom('in')}
                    className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn size={16} />
                  </button>
                  <button
                    onClick={() => handleZoom('out')}
                    className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setZoom(1.2);
                      setMapCenter({ x: 0, y: 0 });
                    }}
                    className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer text-[10px] font-bold"
                    title="Recenter"
                  >
                    Reset
                  </button>
                </div>

                {/* Map style selection overlay */}
                <div className="flex bg-black/75 backdrop-blur-md rounded-xl p-1 border border-white/10 shadow-lg">
                  {(['streets', 'blueprint', 'satellite'] as MapStyle[]).map((style) => (
                    <button
                      key={style}
                      onClick={() => setMapStyle(style)}
                      className={`px-2.5 py-1 text-[9px] font-bold tracking-wider uppercase rounded-lg transition-all cursor-pointer ${
                        mapStyle === style
                          ? 'bg-white text-black font-extrabold'
                          : 'text-white/50 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Compass Indicator */}
              <div className="absolute top-4 right-4 z-50 pointer-events-none select-none">
                <div className="w-10 h-10 rounded-full bg-black/75 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 shadow-lg">
                  <Compass size={18} className="animate-spin-slow" />
                </div>
              </div>

              {/* MAP DRAGGABLE COMPONENT CANVAS */}
              <div
                className={`w-full h-full relative cursor-grab active:cursor-grabbing overflow-hidden`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUpOrLeave}
                onMouseLeave={handleMouseUpOrLeave}
              >
                <div
                  className="w-full h-full transition-transform duration-75 origin-center select-none"
                  style={{
                    transform: `translate(${mapCenter.x}px, ${mapCenter.y}px) scale(${zoom})`,
                  }}
                >
                  {/* BEAUTIFUL VECTOR CANVAS MAP */}
                  <svg
                    viewBox="0 0 900 600"
                    className="w-full h-full select-none"
                    style={{ minWidth: '900px', minHeight: '600px' }}
                  >
                    {/* Definitions for textures and gradients */}
                    <defs>
                      {/* Grid pattern */}
                      <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                        <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                      </pattern>
                      {/* Blueprint grid pattern */}
                      <pattern id="bp-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0,102,255,0.08)" strokeWidth="0.5" />
                      </pattern>
                      {/* River water gradient */}
                      <linearGradient id="river-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={mapStyle === 'blueprint' ? '#002b5c' : '#0e1c26'} />
                        <stop offset="100%" stopColor={mapStyle === 'blueprint' ? '#001a3c' : '#142a38'} />
                      </linearGradient>
                      {/* Park area texture */}
                      <pattern id="dots" width="10" height="10" patternUnits="userSpaceOnUse">
                        <circle cx="5" cy="5" r="1.2" fill="rgba(255,255,255,0.07)" />
                      </pattern>
                    </defs>

                    {/* MAP STYLE INDEPENDENT BASE LAYER */}
                    {mapStyle === 'blueprint' ? (
                      <rect width="900" height="600" fill="#00122e" />
                    ) : mapStyle === 'satellite' ? (
                      <rect width="900" height="600" fill="#0c0d0f" />
                    ) : (
                      <rect width="900" height="600" fill="#080808" />
                    )}

                    {/* Grids */}
                    {mapStyle === 'blueprint' ? (
                      <rect width="900" height="600" fill="url(#bp-grid)" />
                    ) : (
                      <rect width="900" height="600" fill="url(#grid)" />
                    )}

                    {/* RIVER (KAMO RIVER) - Curved sweeping path */}
                    <path
                      d="M -50 100 C 300 150, 450 350, 950 480 L 950 600 L -50 600 Z"
                      fill="url(#river-grad)"
                      opacity="0.85"
                    />
                    
                    {/* River border accent */}
                    <path
                      d="M -50 100 C 300 150, 450 350, 950 480"
                      fill="none"
                      stroke={mapStyle === 'blueprint' ? '#0066cc' : 'rgba(100, 180, 220, 0.22)'}
                      strokeWidth="2.5"
                    />

                    {/* SAKURA PARK (Green Zone) */}
                    <rect
                      x="420"
                      y="160"
                      width="350"
                      height="200"
                      rx="24"
                      fill={mapStyle === 'blueprint' ? 'rgba(0,120,255,0.08)' : 'rgba(34, 50, 38, 0.45)'}
                      stroke={mapStyle === 'blueprint' ? 'rgba(0,102,255,0.3)' : 'rgba(74, 110, 84, 0.2)'}
                      strokeWidth="2"
                    />
                    <rect x="420" y="160" width="350" height="200" rx="24" fill="url(#dots)" />

                    <text
                      x="595"
                      y="265"
                      fill={mapStyle === 'blueprint' ? '#0099ff' : 'rgba(120, 160, 130, 0.7)'}
                      fontSize="11"
                      className="font-sans font-bold uppercase tracking-[4px]"
                      textAnchor="middle"
                    >
                      Sakura Park
                    </text>

                    {/* MAIN ROADS / STREET NETWORKS */}
                    {/* Sakyo Boulevard */}
                    <line
                      x1="0"
                      y1="220"
                      x2="900"
                      y2="220"
                      stroke={mapStyle === 'blueprint' ? '#004c9e' : 'rgba(255, 255, 255, 0.05)'}
                      strokeWidth="16"
                    />
                    <line
                      x1="0"
                      y1="220"
                      x2="900"
                      y2="220"
                      stroke={mapStyle === 'blueprint' ? '#00122e' : '#080808'}
                      strokeWidth="0.8"
                      strokeDasharray="8 8"
                    />

                    {/* 2nd Ave Meridian */}
                    <line
                      x1="340"
                      y1="0"
                      x2="340"
                      y2="600"
                      stroke={mapStyle === 'blueprint' ? '#004c9e' : 'rgba(255, 255, 255, 0.05)'}
                      strokeWidth="14"
                    />
                    <line
                      x1="340"
                      y1="0"
                      x2="340"
                      y2="600"
                      stroke={mapStyle === 'blueprint' ? '#00122e' : '#080808'}
                      strokeWidth="0.8"
                      strokeDasharray="8 8"
                    />

                    {/* 3rd Ave (Court Access Road) */}
                    <line
                      x1="520"
                      y1="0"
                      x2="520"
                      y2="600"
                      stroke={mapStyle === 'blueprint' ? '#004c9e' : 'rgba(255, 255, 255, 0.05)'}
                      strokeWidth="14"
                    />
                    <line
                      x1="520"
                      y1="0"
                      x2="520"
                      y2="600"
                      stroke={mapStyle === 'blueprint' ? '#00122e' : '#080808'}
                      strokeWidth="0.8"
                      strokeDasharray="6 6"
                    />

                    {/* Canal Loop road */}
                    <line
                      x1="0"
                      y1="480"
                      x2="900"
                      y2="480"
                      stroke={mapStyle === 'blueprint' ? '#004c9e' : 'rgba(255, 255, 255, 0.05)'}
                      strokeWidth="12"
                    />

                    {/* Transit Bypass Boulevard */}
                    <line
                      x1="740"
                      y1="0"
                      x2="740"
                      y2="600"
                      stroke={mapStyle === 'blueprint' ? '#004c9e' : 'rgba(255, 255, 255, 0.05)'}
                      strokeWidth="20"
                    />
                    <line
                      x1="740"
                      y1="0"
                      x2="740"
                      y2="600"
                      stroke={mapStyle === 'blueprint' ? '#d0ff00' : 'rgba(100, 100, 100, 0.1)'}
                      strokeWidth="1"
                    />

                    {/* STREET LABLES */}
                    <text
                      x="140"
                      y="214"
                      fill="rgba(255,255,255,0.22)"
                      fontSize="7.5"
                      className="font-mono tracking-widest uppercase font-bold"
                    >
                      Sakyo Ave
                    </text>
                    <text
                      x="410"
                      y="474"
                      fill="rgba(255,255,255,0.22)"
                      fontSize="7.5"
                      className="font-mono tracking-widest uppercase font-bold"
                    >
                      Canal Walk Dr
                    </text>

                    {/* OTHER DECORATIVE BUILDINGS (For Satellite/Streets view) */}
                    {mapStyle !== 'blueprint' && (
                      <>
                        {/* Shōten Pavilion Building complex */}
                        <path
                          d="M 450 280 L 490 280 L 490 340 L 450 340 Z"
                          fill="rgba(255, 255, 255, 0.035)"
                          stroke="rgba(255, 255, 255, 0.08)"
                          strokeWidth="1.5"
                        />
                        <text
                          x="470"
                          y="315"
                          fill="rgba(255,255,255,0.18)"
                          fontSize="7"
                          className="font-sans font-semibold text-center uppercase"
                          textAnchor="middle"
                        >
                          Shrine
                        </text>

                        {/* Local Library Block */}
                        <rect
                          x="580"
                          y="100"
                          width="60"
                          height="40"
                          fill="rgba(255,255,255,0.02)"
                          stroke="rgba(255,255,255,0.06)"
                          strokeWidth="1"
                        />
                        <text
                          x="610"
                          y="124"
                          fill="rgba(255,255,255,0.18)"
                          fontSize="7.5"
                          className="font-sans text-center"
                          textAnchor="middle"
                        >
                          Library
                        </text>
                      </>
                    )}

                    {/* DYNAMIC DRAWING DOTTED ACTIVE NAVIGATION PATH */}
                    <path
                      d={getRoutePath()}
                      fill="none"
                      stroke={mapStyle === 'blueprint' ? '#00ffff' : 'var(--accent, #FF6B00)'}
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="animate-dash stroke-dash-route"
                      style={{
                        strokeDasharray: '12, 8',
                        animation: 'dash-run 35s linear infinite',
                      }}
                    />

                    {/* ROUTE STARTING PINS & ICONS */}
                    {/* 1. HOME LOCATION */}
                    <circle
                      cx={routeDetails.home.coords.x}
                      cy={routeDetails.home.coords.y}
                      r="20"
                      fill={startPoint === 'home' ? 'rgba(255,255,255,0.1)' : 'transparent'}
                      className="transition-all duration-300"
                    />
                    <circle
                      cx={routeDetails.home.coords.x}
                      cy={routeDetails.home.coords.y}
                      r="6"
                      fill={startPoint === 'home' ? 'var(--accent, #FF6B00)' : '#888888'}
                      stroke="white"
                      strokeWidth="1.5"
                      className="cursor-pointer transition-colors duration-300 hover:scale-125"
                      onClick={() => setStartPoint('home')}
                    />
                    <text
                      x={routeDetails.home.coords.x}
                      y={routeDetails.home.coords.y - 12}
                      fill={startPoint === 'home' ? 'white' : '#737373'}
                      fontSize="9"
                      className="font-sans font-bold uppercase tracking-wider text-center"
                      textAnchor="middle"
                    >
                      Lodging
                    </text>

                    {/* 2. STATION LOCATION */}
                    <circle
                      cx={routeDetails.station.coords.x}
                      cy={routeDetails.station.coords.y}
                      r="20"
                      fill={startPoint === 'station' ? 'rgba(255,255,255,0.1)' : 'transparent'}
                      className="transition-all duration-300"
                    />
                    <circle
                      cx={routeDetails.station.coords.x}
                      cy={routeDetails.station.coords.y}
                      r="6"
                      fill={startPoint === 'station' ? 'var(--accent, #FF6B00)' : '#888888'}
                      stroke="white"
                      strokeWidth="1.5"
                      className="cursor-pointer transition-colors duration-300 hover:scale-125"
                      onClick={() => setStartPoint('station')}
                    />
                    <text
                      x={routeDetails.station.coords.x}
                      y={routeDetails.station.coords.y - 12}
                      fill={startPoint === 'station' ? 'white' : '#737373'}
                      fontSize="9"
                      className="font-sans font-bold uppercase tracking-wider text-center"
                      textAnchor="middle"
                    >
                      Bus Terminal
                    </text>

                    {/* 3. HOTEL LOCATION */}
                    <circle
                      cx={routeDetails.hotel.coords.x}
                      cy={routeDetails.hotel.coords.y}
                      r="20"
                      fill={startPoint === 'hotel' ? 'rgba(255,255,255,0.1)' : 'transparent'}
                      className="transition-all duration-300"
                    />
                    <circle
                      cx={routeDetails.hotel.coords.x}
                      cy={routeDetails.hotel.coords.y}
                      r="6"
                      fill={startPoint === 'hotel' ? 'var(--accent, #FF6B00)' : '#888888'}
                      stroke="white"
                      strokeWidth="1.5"
                      className="cursor-pointer transition-colors duration-300 hover:scale-125"
                      onClick={() => setStartPoint('hotel')}
                    />
                    <text
                      x={routeDetails.hotel.coords.x}
                      y={routeDetails.hotel.coords.y - 12}
                      fill={startPoint === 'hotel' ? 'white' : '#737373'}
                      fontSize="9"
                      className="font-sans font-bold uppercase tracking-wider text-center"
                      textAnchor="middle"
                    >
                      Inn
                    </text>

                    {/* TARGET PIN (SHŌTEN COURT YARD) - BIG RIPPLE */}
                    {/* Ring Outer Ripple */}
                    <circle
                      cx={courtCoords.x}
                      cy={courtCoords.y}
                      r="24"
                      className="animate-ping origin-center text-orange-500"
                      fill="rgba(255, 107, 0, 0.12)"
                      stroke="rgba(255, 107, 0, 0.4)"
                      strokeWidth="1"
                    />
                    {/* Ring Inner halo */}
                    <circle
                      cx={courtCoords.x}
                      cy={courtCoords.y}
                      r="12"
                      fill="rgba(255, 107, 0, 0.28)"
                    />

                    {/* PIN ICON GROUP */}
                    <g
                      transform={`translate(${courtCoords.x - 12}, ${courtCoords.y - 30})`}
                      className="cursor-pointer select-none"
                      onClick={() => setSelectedPoi('court')}
                    >
                      {/* Dark pin shadow drop */}
                      <ellipse cx="12" cy="30" rx="3.5" ry="1.2" fill="rgba(0,0,0,0.58)" />
                      {/* Pin Body */}
                      <path
                        d="M 12 30 C 22 17, 24 14, 24 12 C 24 5.37, 18.63 0, 12 0 C 5.37 0, 0 5.37, 0 12 C 0 14, 2 17, 12 30 Z"
                        fill="var(--accent, #FF6B00)"
                        stroke="white"
                        strokeWidth="1.5"
                      />
                      {/* Innermost circle dot */}
                      <circle cx="12" cy="11.5" r="4.2" fill="white" />
                    </g>

                    {/* Label */}
                    <rect
                      x={courtCoords.x - 65}
                      y={courtCoords.y + 12}
                      width="130"
                      height="18"
                      rx="4"
                      fill="#000000"
                      stroke="rgba(255,255,255,0.15)"
                      strokeWidth="1"
                    />
                    <text
                      x={courtCoords.x}
                      y={courtCoords.y + 24}
                      fill="white"
                      fontSize="8.5"
                      className="font-sans font-extrabold uppercase tracking-widest text-center"
                      textAnchor="middle"
                    >
                      Shōten court yard
                    </text>
                  </svg>
                </div>
              </div>

              {/* Bottom Drag hint overlay wrapper */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none select-none z-10 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/5 text-[9px] text-white/50 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                <span>↔ Drag map to pan</span>
              </div>
            </div>

            {/* RIGHT COLUMN: INFORMATION PANEL & ROUTE SELECTOR */}
            <div className="w-full md:w-[360px] flex-shrink-0 flex flex-col justify-between bg-[#0e0e0e] p-6 overflow-y-auto h-[50%] md:h-full">
              
              {/* Header section with Close button */}
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-orange-500 font-bold uppercase tracking-[1.5px] mb-0.5">Court Location</span>
                    <h2 className="font-display text-2xl font-bold tracking-wide text-white leading-tight uppercase">
                      Shōten court yard
                    </h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-1 px-1.5 h-8 w-8 text-white/40 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer flex items-center justify-center border border-white/15"
                    aria-label="Close Map Modal"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Glass Details card widget */}
                  <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-4 space-y-3">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-[var(--ink-faint)] uppercase tracking-wider mb-0.5">Full Address</span>
                      <span className="text-[11px] text-[var(--ink-soft)] font-medium">123 Carter Road, Bandra West, Mumbai, India</span>
                    </div>

                    <div className="flex items-center justify-between gap-4 pt-2 border-t border-white/[0.05]">
                      <div className="flex flex-col">
                        <span className="text-[9px] text-[var(--ink-faint)] uppercase tracking-wider mb-0.5">Coordinates</span>
                        <span className="font-mono text-[10.5px] font-semibold text-white">19.0596° N, 72.8295° E</span>
                      </div>
                      <button
                        onClick={copyCoordinates}
                        className="p-2 transition-all hover:bg-white/10 text-white/50 hover:text-white rounded-xl border border-white/10 cursor-pointer flex items-center gap-1.5 text-[9.5px] font-bold"
                      >
                        {copied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                        <span>{copied ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Route planning title */}
                  <div className="pt-2">
                    <div className="flex items-center gap-1.5 mb-2.5">
                      <Navigation size={12} className="text-orange-500 uppercase" />
                      <span className="text-[10px] text-white/70 font-semibold uppercase tracking-wider">
                        Plan your route from:
                      </span>
                    </div>

                    {/* Navigation Starting Points selectors */}
                    <div className="grid grid-cols-3 gap-2">
                      {(['home', 'station', 'hotel'] as StartPoint[]).map((point) => (
                        <button
                          key={point}
                          onClick={() => setStartPoint(point)}
                          className={`py-2 px-1 text-[9.5px] font-bold uppercase rounded-xl transition-all border cursor-pointer flex flex-col items-center gap-0.5 ${
                            startPoint === point
                              ? 'bg-white text-black border-white'
                              : 'bg-white/[0.01] text-white/60 border-white/10 hover:text-white hover:bg-white/[0.04]'
                          }`}
                        >
                          <span className="capitalize">{point}</span>
                          <span className="text-[7.5px] opacity-70">
                            {point === 'home' ? '1.1 km' : point === 'station' ? '1.9 km' : '0.6 km'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dynamic Route Info based on selections */}
                  <div className="rounded-2xl bg-orange-500/[0.03] border border-orange-500/10 p-4 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-extrabold text-white">
                      <span>{routeDetails[startPoint].name}</span>
                      <span className="text-[10px] text-orange-400 bg-orange-500/10 border border-orange-500/15 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Footprints size={10} />
                        {routeDetails[startPoint].time}
                      </span>
                    </div>
                    <p className="text-[10.5px] text-white/60 leading-relaxed font-normal">
                      {routeDetails[startPoint].desc}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action and Disclaimer Bottom column */}
              <div className="pt-4 border-t border-white/[0.06] space-y-3">
                <div className="flex items-start gap-2.5 bg-white/[0.01] p-3 rounded-xl border border-white/5">
                  <Info size={13} className="text-white/40 mt-0.5 flex-shrink-0" />
                  <span className="text-[9px] text-[var(--ink-faint)] leading-normal font-normal">
                    The court is free, public-access, and operates of a "first-come, first-served" sign-up chalkboard system. Lights remain on until 10:30 PM.
                  </span>
                </div>

                <a
                  href={`https://maps.google.com/?q=${courtCoords.y},${courtCoords.x}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-white text-black hover:bg-white/90 text-center text-xs font-bold transition-all block cursor-pointer"
                >
                  Get Directions (External App)
                </a>
              </div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
