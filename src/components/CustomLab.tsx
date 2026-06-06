import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Target, Contrast, RotateCcw, BoxSelect, Maximize, Orbit, Palette, Zap, Activity, Sun, SunDim, Save, Download, Upload, Shuffle } from 'lucide-react';
import { playMetallicClick, playSwoosh } from '../utils/audio';



interface Preset {
  name: string;
  baseColor: string;
  pebbleColor: string;
  specColor: string;
  seamColor: string;
  lipColor: string;
  bumpScale: number;
  roughness: number;
  autoSpinY: number;
}

const PRESETS: Preset[] = [
  {
    name: 'Wilson Classic',
    baseColor: '#c84400',
    pebbleColor: '#df5504',
    specColor: 'rgba(255, 200, 150, 0.55)',
    seamColor: '#1c1c1c',
    lipColor: '#ff964f',
    bumpScale: 0.065,
    roughness: 0.65,
    autoSpinY: 0.002
  },
  {
    name: 'Lunar Carbon',
    baseColor: '#1a1a1a',
    pebbleColor: '#09090b',
    specColor: 'rgba(50, 200, 255, 0.35)',
    seamColor: '#9c9c9c',
    lipColor: '#3a3a3c',
    bumpScale: 0.095,
    roughness: 0.85,
    autoSpinY: 0.001
  },
  {
    name: 'Vapor Neon',
    baseColor: '#431407',
    pebbleColor: '#311005',
    specColor: 'rgba(244, 63, 94, 0.8)',
    seamColor: '#06b6d4',
    lipColor: '#d946ef',
    bumpScale: 0.075,
    roughness: 0.32,
    autoSpinY: 0.003
  },
  {
    name: 'Sunset Gold',
    baseColor: '#451a03',
    pebbleColor: '#78350f',
    specColor: 'rgba(253, 224, 71, 0.75)',
    seamColor: '#d97706',
    lipColor: '#facc15',
    bumpScale: 0.08,
    roughness: 0.45,
    autoSpinY: 0.002
  },
  {
    name: 'Stealth Black',
    baseColor: '#0f0f0f',
    pebbleColor: '#1c1c1e',
    specColor: 'rgba(255, 255, 255, 0.15)',
    seamColor: '#2c2c2e',
    lipColor: '#141414',
    bumpScale: 0.05,
    roughness: 0.95,
    autoSpinY: 0.0015
  }
];

interface TactilityPreset {
  name: string;
  roughness: number;
  bumpScale: number;
  metalness: number;
  desc: string;
}

const TACTILITY_PRESETS: TactilityPreset[] = [
  { name: 'Genuine Full-Grain Leather', roughness: 0.72, bumpScale: 0.08, metalness: 0.02, desc: 'Maximum grip natural fiber feel' },
  { name: 'Indoor Playoff Composite', roughness: 0.58, bumpScale: 0.058, metalness: 0.05, desc: 'Soft moisture-wicking synthetic surface' },
  { name: 'Asphalt Hardcourt Rubber', roughness: 0.88, bumpScale: 0.12, metalness: 0.02, desc: 'Durable compound, heavy friction ridges' },
  { name: 'Liquid Cyber Chrome', roughness: 0.18, bumpScale: 0.02, metalness: 0.90, desc: 'Reflective experimental polished shell' }
];

export default function CustomLab() {
  const [selectedPreset, setSelectedPreset] = useState('Wilson Classic');
  const [selectedTactility, setSelectedTactility] = useState('Genuine Full-Grain Leather');
  const [baseColor, setBaseColor] = useState('#c84400');
  const [pebbleColor, setPebbleColor] = useState('#df5504');
  const [seamColor, setSeamColor] = useState('#1c1c1c');
  const [lipColor, setLipColor] = useState('#ff964f');
  const [bumpScale, setBumpScale] = useState(0.065);
  const [roughness, setRoughness] = useState(0.65);
  const [metalness, setMetalness] = useState(0.08);
  const [autoSpinY, setAutoSpinY] = useState(0.002);
  const [ballScaleMultiplier, setBallScaleMultiplier] = useState(1.0);

  const [dirLight1Enabled, setDirLight1Enabled] = useState(true);
  const [dirLight1Intensity, setDirLight1Intensity] = useState(1.6);
  const [dirLight2Enabled, setDirLight2Enabled] = useState(true);
  const [dirLight2Intensity, setDirLight2Intensity] = useState(0.35);
  const [ambientLightIntensity, setAmbientLightIntensity] = useState(0.55);

  const SIGNATURE_SPINS = ['The Corkscrew', 'Reverse Backspin', 'Top Rock Wobble', 'Gravity Drop'];
  const [spinIdx, setSpinIdx] = useState(0);

  const updateLighting = useCallback((config: {
    dirLight1Enabled?: boolean;
    dirLight1Intensity?: number;
    dirLight2Enabled?: boolean;
    dirLight2Intensity?: number;
    ambientLightIntensity?: number;
  }) => {
    const eventDetail = {
      dirLight1Enabled,
      dirLight1Intensity,
      dirLight2Enabled,
      dirLight2Intensity,
      ambientLightIntensity,
      ...config
    };
    window.dispatchEvent(new CustomEvent('basketball-lights-update', { detail: eventDetail }));
  }, [ambientLightIntensity, dirLight1Enabled, dirLight1Intensity, dirLight2Enabled, dirLight2Intensity]);

  // For performance/accessibility: stable label id used by aria-describedby.
  const liveHudIdRef = useRef(`custom-lab-livehud-${Math.random().toString(16).slice(2)}`);

  const handleResetLab = () => {
    handleApplyPreset(PRESETS[0]);
    setBallScaleMultiplier(1.0);
    setMetalness(0.08);
    setSelectedTactility('Genuine Full-Grain Leather');
    setDirLight1Enabled(true);
    setDirLight1Intensity(1.6);
    setDirLight2Enabled(true);
    setDirLight2Intensity(0.35);
    setAmbientLightIntensity(0.55);
    window.dispatchEvent(new CustomEvent('basketball-lights-update', {
      detail: {
        dirLight1Enabled: true,
        dirLight1Intensity: 1.6,
        dirLight2Enabled: true,
        dirLight2Intensity: 0.35,
        ambientLightIntensity: 0.55
      }
    }));
  };

  const dispatchCustomize = useCallback((config: Partial<Preset> & { ballScaleMultiplier?: number; metalness?: number }) => {
    const defaultData = {
      baseColor,
      pebbleColor,
      seamColor,
      lipColor,
      bumpScale,
      roughness,
      metalness,
      autoSpinY,
      ballScaleMultiplier
    };

    const combined = { ...defaultData, ...config };
    window.dispatchEvent(new CustomEvent('basketball-customize', { detail: combined }));
  }, [ambientLightIntensity, autoSpinY, baseColor, ballScaleMultiplier, bumpScale, lipColor, metalness, pebbleColor, roughness, seamColor]);

  // Throttle customization dispatch to avoid event spam while dragging sliders.
  const customizeRafRef = useRef<number | null>(null);
  const pendingCustomizeRef = useRef<typeof dispatchCustomize extends (a: infer A) => any ? A : any>(null);

  const updateCustomization = (config: Partial<Preset> & { ballScaleMultiplier?: number; metalness?: number }) => {
    pendingCustomizeRef.current = config;

    if (customizeRafRef.current != null) return;

    customizeRafRef.current = window.requestAnimationFrame(() => {
      customizeRafRef.current = null;
      if (pendingCustomizeRef.current) {
        dispatchCustomize(pendingCustomizeRef.current);
        pendingCustomizeRef.current = null;
      }
    });
  };


  const handleApplyPreset = (p: Preset) => {
    playSwoosh();
    setSelectedPreset(p.name);
    setBaseColor(p.baseColor);
    setPebbleColor(p.pebbleColor);
    setSeamColor(p.seamColor);
    setLipColor(p.lipColor);
    setBumpScale(p.bumpScale);
    setRoughness(p.roughness);
    setAutoSpinY(p.autoSpinY);
    setBallScaleMultiplier(1.0);
    updateCustomization({ ...p, ballScaleMultiplier: 1.0, metalness });
  };

  const handleColorChange = (key: 'baseColor' | 'pebbleColor' | 'seamColor' | 'lipColor', value: string) => {
    setSelectedPreset('Custom');
    if (key === 'baseColor') setBaseColor(value);
    if (key === 'pebbleColor') setPebbleColor(value);
    if (key === 'seamColor') setSeamColor(value);
    if (key === 'lipColor') setLipColor(value);
    updateCustomization({ [key]: value, metalness });
  };

  const handleSliderChange = (key: 'bumpScale' | 'roughness' | 'autoSpinY' | 'ballScaleMultiplier' | 'metalness', value: number) => {
    setSelectedPreset('Custom');
    if (key === 'bumpScale') setBumpScale(value);
    if (key === 'roughness') setRoughness(value);
    if (key === 'autoSpinY') setAutoSpinY(value);
    if (key === 'ballScaleMultiplier') setBallScaleMultiplier(value);
    if (key === 'metalness') setMetalness(value);
    updateCustomization({ [key]: value, metalness: key === 'metalness' ? value : metalness });
  };

  const handleApplyTactility = (tact: TactilityPreset) => {
    playSwoosh();
    setSelectedTactility(tact.name);
    setRoughness(tact.roughness);
    setBumpScale(tact.bumpScale);
    setMetalness(tact.metalness);
    updateCustomization({
      roughness: tact.roughness,
      bumpScale: tact.bumpScale,
      metalness: tact.metalness
    });
  };

  return (
    <div id="custom-lab-interactive-root" className="w-full flex flex-col md:flex-row gap-8 items-stretch pt-4 pb-20 pointer-events-none z-20 relative">
      
      {/* LEFT COLUMN: Controls */}
      <div className="w-full md:w-[400px] flex-shrink-0 space-y-6 pointer-events-auto">
        
        {/* Presets Panel */}
        <div className="bg-gradient-to-br from-neutral-900/90 to-[#0e0e0f]/90 backdrop-blur-xl border border-white/[0.08] p-6 rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <BoxSelect size={18} className="text-orange-500" />
              <h3 className="font-display text-white text-base font-bold uppercase tracking-widest">Base Presets</h3>
            </div>
            <button
              onClick={handleResetLab}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-[9.5px] font-bold uppercase tracking-wider text-zinc-400 hover:text-white hover:bg-orange-500/10 hover:border-orange-500/20 hover:scale-105 active:scale-95 cursor-pointer pointer-events-auto transition-all duration-200"
              title="Reset Lab to Wilson Classic"
            >
              <RotateCcw size={10} className="text-orange-500" />
              Reset Lab
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {PRESETS.map((p) => (
              <button
                key={p.name}
                onClick={() => handleApplyPreset(p)}
                className={`py-3 px-4 rounded-2xl text-left border text-[11px] font-bold uppercase tracking-wide transition-all duration-300 ${
                  selectedPreset === p.name
                    ? 'bg-orange-500/10 text-orange-400 border-orange-500/30 shadow-[0_0_15px_rgba(234,88,12,0.15)]'
                    : 'bg-black/40 border-white/[0.06] text-zinc-400 hover:bg-white/[0.04] hover:text-white hover:-translate-y-0.5'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Material Tactility Series Panel */}
        <div className="bg-gradient-to-br from-neutral-900/90 to-[#0e0e0f]/90 backdrop-blur-xl border border-white/[0.08] p-6 rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/[0.06]">
            <Zap size={18} className="text-orange-500 animate-[pulse_2s_infinite]" />
            <h3 className="font-display text-white text-base font-bold uppercase tracking-widest">Tactility Series</h3>
          </div>
          
          <div className="space-y-3">
             {TACTILITY_PRESETS.map((tact) => (
                <button
                  key={tact.name}
                  onClick={() => handleApplyTactility(tact)}
                  className={`w-full p-4 rounded-2xl text-left border flex flex-col gap-1 transition-all duration-300 pointer-events-auto cursor-pointer ${
                    selectedTactility === tact.name
                      ? 'bg-orange-500/10 text-orange-400 border-orange-500/30 shadow-[0_0_15px_rgba(234,88,12,0.15)]'
                      : 'bg-black/40 border-white/[0.06] text-zinc-400 hover:bg-white/[0.04] hover:text-white hover:-translate-y-0.5'
                  }`}
                >
                  <span className="text-[11.5px] font-black uppercase tracking-wider">{tact.name}</span>
                  <p className="text-[9.5px] text-zinc-400 font-sans tracking-tight leading-normal font-medium">{tact.desc}</p>
                </button>
             ))}
          </div>
        </div>

        {/* Color Tuning Panel */}
        <div className="bg-gradient-to-br from-neutral-900/90 to-neutral-950/90 backdrop-blur-xl border border-white/[0.08] p-6 rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/[0.06]">
            <Palette size={18} className="text-orange-500" />
            <h3 className="font-display text-white text-base font-bold uppercase tracking-widest">Pigment Mapping</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 bg-black/40 border border-white/[0.04] rounded-2xl">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Base Leather</span>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] text-zinc-500 uppercase">{baseColor}</span>
                <input
                  type="color"
                  value={baseColor}
                  onChange={(e) => handleColorChange('baseColor', e.target.value)}
                  className="w-8 h-8 rounded-full bg-transparent border-none appearance-none cursor-pointer outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-black/40 border border-white/[0.04] rounded-2xl">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Pebble Core</span>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] text-zinc-500 uppercase">{pebbleColor}</span>
                <input
                  type="color"
                  value={pebbleColor}
                  onChange={(e) => handleColorChange('pebbleColor', e.target.value)}
                  className="w-8 h-8 rounded-full bg-transparent border-none appearance-none cursor-pointer outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-black/40 border border-white/[0.04] rounded-2xl">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Rubber Seams</span>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] text-zinc-500 uppercase">{seamColor}</span>
                <input
                  type="color"
                  value={seamColor}
                  onChange={(e) => handleColorChange('seamColor', e.target.value)}
                  className="w-8 h-8 rounded-full bg-transparent border-none appearance-none cursor-pointer outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-black/40 border border-white/[0.04] rounded-2xl">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Seam Bevels</span>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] text-zinc-500 uppercase">{lipColor}</span>
                <input
                  type="color"
                  value={lipColor}
                  onChange={(e) => handleColorChange('lipColor', e.target.value)}
                  className="w-8 h-8 rounded-full bg-transparent border-none appearance-none cursor-pointer outline-none"
                />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* MIDDLE SPACER FOR 3D CANVAS */}
      <div className="flex-grow min-h-[450px] md:min-h-full flex flex-col items-center justify-end relative pointer-events-none px-4 py-8">

        {/* Real-time Material HUD Overlay */}
        <div
          className="bg-gradient-to-t from-black/80 to-black/40 backdrop-blur-md border border-white/[0.08] rounded-[2rem] p-5 w-full max-w-sm mx-auto flex flex-col gap-4 shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
          role="region"
          aria-label="Live Material HUD"
          aria-describedby={liveHudIdRef.current}
        >
           <div className="flex justify-between items-center pb-3 border-b border-white/[0.06]">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5"><Activity size={12} className="text-orange-500" /> Live Material HUD</span>
              <span className="text-[9px] text-zinc-500 font-mono font-bold">{selectedPreset}</span>
           </div>
           <p id={liveHudIdRef.current} className="sr-only">Updates as you change colors and sliders.</p>
           
           <div className="space-y-4 pt-1">
             <div className="flex flex-col gap-2">
               <div className="flex justify-between text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                 <span>Surface Roughness Index</span>
                 <span className="font-mono text-white">{roughness.toFixed(2)}</span>
               </div>
               <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden">
                 <div className="bg-orange-500 h-full rounded-full transition-all duration-300" style={{ width: `${(roughness / 0.95) * 100}%` }}></div>
               </div>
             </div>
             
             <div className="flex flex-col gap-2">
               <div className="flex justify-between text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                 <span>Metalness Reflectivity</span>
                <span className="font-mono text-white">{(metalness * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full transition-all duration-300" style={{ width: `${metalness * 100}%` }}></div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                <span>Pebble Relief Intensity</span>
                 <span className="font-mono text-white">{(bumpScale * 1000).toFixed(0)}µm</span>
               </div>
               <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden">
                 <div className="bg-cyan-500 h-full rounded-full transition-all duration-300" style={{ width: `${(bumpScale / 0.18) * 100}%` }}></div>
               </div>
             </div>
           </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Sliders */}
      <div className="w-full md:w-[400px] flex-shrink-0 space-y-6 pointer-events-auto">
        
        <div className="bg-gradient-to-bl from-neutral-900/90 to-neutral-950/90 backdrop-blur-xl border border-white/[0.08] p-6 rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.5)] min-h-[300px]">
          <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/[0.06]">
            <Maximize size={18} className="text-orange-500" />
            <h3 className="font-display text-white text-base font-bold uppercase tracking-widest">Physicality Modifiers</h3>
          </div>

          <div className="space-y-6 pt-2">
            
            {/* Pebble Intensity */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                <span className="flex items-center gap-2"><Target size={14} className="text-zinc-500" /> Pebble Relief</span>
                <span className="font-mono text-orange-400">{(bumpScale * 1000).toFixed(0)}</span>
              </div>
              <input
                type="range"
                min="0.01"
                max="0.18"
                step="0.005"
                value={bumpScale}
                onChange={(e) => handleSliderChange('bumpScale', parseFloat(e.target.value))}
                onClick={playMetallicClick}
                className="w-full accent-orange-500 appearance-none h-[4px] bg-neutral-800 rounded-full cursor-pointer outline-none shadow-inner mt-2 pointer-events-auto"
              />
            </div>

            {/* Leather Roughness */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                <span className="flex items-center gap-2"><Contrast size={14} className="text-zinc-500" /> Gloss / Sheen</span>
                <span className="font-mono text-orange-400">{roughness.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.15"
                max="0.95"
                step="0.05"
                value={roughness}
                onChange={(e) => handleSliderChange('roughness', parseFloat(e.target.value))}
                onClick={playMetallicClick}
                className="w-full accent-orange-500 appearance-none h-[4px] bg-neutral-800 rounded-full cursor-pointer outline-none shadow-inner mt-2 pointer-events-auto"
              />
            </div>

            {/* Specular Metalness */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                <span className="flex items-center gap-2"><Orbit size={14} className="text-zinc-500" /> Metalness / Reflectivity</span>
                <span className="font-mono text-orange-400">{metalness.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.02"
                value={metalness}
                onChange={(e) => handleSliderChange('metalness', parseFloat(e.target.value))}
                onClick={playMetallicClick}
                className="w-full accent-orange-500 appearance-none h-[4px] bg-neutral-800 rounded-full cursor-pointer outline-none shadow-inner mt-2 pointer-events-auto"
              />
            </div>

            {/* Orbit Velocity */}
            <div className="space-y-3 pt-2 pb-2 border-b border-white/[0.04]">
              <div className="flex justify-between items-center text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                <span className="flex items-center gap-2"><RotateCcw size={14} className="text-zinc-500" /> Orbit Velocity</span>
                <span className="font-mono text-orange-400">{(autoSpinY * 1000).toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="0.008"
                step="0.0005"
                value={autoSpinY}
                onChange={(e) => handleSliderChange('autoSpinY', parseFloat(e.target.value))}
                onClick={playMetallicClick}
                className="w-full accent-orange-500 appearance-none h-[4px] bg-neutral-800 rounded-full cursor-pointer outline-none shadow-inner mt-2 pointer-events-auto"
              />
            </div>

            {/* Model Scale Dimension Slider */}
            <div className="space-y-3 pt-2 pb-2 border-b border-white/[0.04]">
              <div className="flex justify-between items-center text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                <span className="flex items-center gap-2"><Maximize size={14} className="text-zinc-500" /> Ball Dimension Scale</span>
                <span className="font-mono text-orange-400">{(ballScaleMultiplier * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.4"
                max="2.2"
                step="0.05"
                value={ballScaleMultiplier}
                onChange={(e) => handleSliderChange('ballScaleMultiplier', parseFloat(e.target.value))}
                onClick={playMetallicClick}
                className="w-full accent-orange-500 appearance-none h-[4px] bg-neutral-800 rounded-full cursor-pointer outline-none shadow-inner mt-2 pointer-events-auto"
              />
            </div>

            <div className="text-center pt-2 pb-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 flex items-center justify-center gap-2 mb-4">
                <Orbit size={13} className="animate-spin-slow" />
                Real-time WebGL synchronization active
              </span>

              <button 
                onClick={() => {
                  const nextIdx = (spinIdx + 1) % SIGNATURE_SPINS.length;
                  setSpinIdx(nextIdx);
                  window.dispatchEvent(new CustomEvent('basketball-signature-spin', { detail: { type: SIGNATURE_SPINS[nextIdx] } }));
                  playSwoosh();
                }}
                className="w-full relative group overflow-hidden bg-white/[0.04] border border-white/[0.08] hover:border-orange-500/50 hover:bg-orange-500/10 transition-all duration-300 rounded-2xl p-4 cursor-pointer outline-none pointer-events-auto"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[150%] skew-x-[-30deg] group-hover:animate-sweep"></div>
                <div className="flex flex-col items-center gap-2 relative z-10">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-orange-500/80">Trigger Signature Spin</span>
                  <div className="flex items-center justify-center gap-2 w-full">
                    <Orbit size={18} className="text-orange-400 group-hover:rotate-180 transition-transform duration-700" />
                    <span className="text-[13px] font-black uppercase tracking-wider text-white select-none">{SIGNATURE_SPINS[spinIdx]}</span>
                  </div>
                </div>
              </button>
            </div>

          </div>
        </div>

        {/* Stage Lighting Panel */}
        <div className="bg-gradient-to-br from-neutral-900/90 to-neutral-950/90 backdrop-blur-xl border border-white/[0.08] p-6 rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/[0.06]">
            <Sun size={18} className="text-orange-500 animate-pulse" />
            <h3 className="font-display text-white text-base font-bold uppercase tracking-widest">Stage Lumens</h3>
          </div>

          <div className="space-y-4">
            {/* Primary Key light */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                <span className="flex items-center gap-2">
                  <Sun size={14} className={dirLight1Enabled ? "text-orange-400" : "text-zinc-600"} />
                  Key Light (Front-Left)
                </span>
                <span className="font-mono text-orange-400">{dirLight1Enabled ? `${dirLight1Intensity.toFixed(1)}x` : 'OFF'}</span>
              </div>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => {
                    const next = !dirLight1Enabled;
                    setDirLight1Enabled(next);
                    updateLighting({ dirLight1Enabled: next });
                    playSwoosh();
                  }}
                  className={`px-3 py-1.5 rounded-xl border text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer select-none pointer-events-auto ${
                    dirLight1Enabled 
                      ? 'bg-orange-500/10 border-orange-500/30 text-orange-400 font-bold' 
                      : 'bg-black/40 border-white/[0.06] text-zinc-500 font-bold'
                  }`}
                >
                  {dirLight1Enabled ? 'Active' : 'Muted'}
                </button>
                <input
                  type="range"
                  min="0.0"
                  max="4.0"
                  step="0.1"
                  disabled={!dirLight1Enabled}
                  value={dirLight1Intensity}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setDirLight1Intensity(val);
                    updateLighting({ dirLight1Intensity: val });
                  }}
                  onClick={playMetallicClick}
                  className="flex-grow accent-orange-500 appearance-none h-[4px] bg-neutral-800 rounded-full cursor-pointer outline-none shadow-inner pointer-events-auto disabled:opacity-30 disabled:pointer-events-none"
                />
              </div>
            </div>

            {/* Background Fill light */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                <span className="flex items-center gap-2">
                  <SunDim size={14} className={dirLight2Enabled ? "text-orange-400" : "text-zinc-600"} />
                  Rear Fill (Back-Right)
                </span>
                <span className="font-mono text-orange-400">{dirLight2Enabled ? `${dirLight2Intensity.toFixed(2)}x` : 'OFF'}</span>
              </div>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => {
                    const next = !dirLight2Enabled;
                    setDirLight2Enabled(next);
                    updateLighting({ dirLight2Enabled: next });
                    playSwoosh();
                  }}
                  className={`px-3 py-1.5 rounded-xl border text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer select-none pointer-events-auto ${
                    dirLight2Enabled 
                      ? 'bg-orange-500/10 border-orange-500/30 text-orange-400 font-bold' 
                      : 'bg-black/40 border-white/[0.06] text-zinc-500 font-bold'
                  }`}
                >
                  {dirLight2Enabled ? 'Active' : 'Muted'}
                </button>
                <input
                  type="range"
                  min="0.0"
                  max="2.0"
                  step="0.05"
                  disabled={!dirLight2Enabled}
                  value={dirLight2Intensity}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setDirLight2Intensity(val);
                    updateLighting({ dirLight2Intensity: val });
                  }}
                  onClick={playMetallicClick}
                  className="flex-grow accent-orange-500 appearance-none h-[4px] bg-neutral-800 rounded-full cursor-pointer outline-none shadow-inner pointer-events-auto disabled:opacity-30 disabled:pointer-events-none"
                />
              </div>
            </div>

            {/* Ambient base */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                <span className="flex items-center gap-2">
                  <Activity size={12} className="text-zinc-500" />
                  Background Ambient Base
                </span>
                <span className="font-mono text-orange-400">{ambientLightIntensity.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.5"
                step="0.05"
                value={ambientLightIntensity}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setAmbientLightIntensity(val);
                  updateLighting({ ambientLightIntensity: val });
                }}
                onClick={playMetallicClick}
                className="w-full accent-orange-500 appearance-none h-[4px] bg-neutral-800 rounded-full cursor-pointer outline-none shadow-inner pointer-events-auto"
              />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
