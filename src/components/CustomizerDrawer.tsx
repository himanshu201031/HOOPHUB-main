import React, { useState, useEffect } from 'react';

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

export default function CustomizerDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState('Wilson Classic');
  const [baseColor, setBaseColor] = useState('#c84400');
  const [pebbleColor, setPebbleColor] = useState('#df5504');
  const [seamColor, setSeamColor] = useState('#1c1c1c');
  const [lipColor, setLipColor] = useState('#ff964f');
  const [bumpScale, setBumpScale] = useState(0.065);
  const [roughness, setRoughness] = useState(0.65);
  const [autoSpinY, setAutoSpinY] = useState(0.002);

  // Trigger customization update to ThreeCanvas
  const updateCustomization = (config: Partial<Preset>) => {
    const defaultData = {
      baseColor,
      pebbleColor,
      seamColor,
      lipColor,
      bumpScale,
      roughness,
      autoSpinY
    };
    
    const combined = { ...defaultData, ...config };
    window.dispatchEvent(new CustomEvent('basketball-customize', { detail: combined }));
  };

  const handleApplyPreset = (p: Preset) => {
    setSelectedPreset(p.name);
    setBaseColor(p.baseColor);
    setPebbleColor(p.pebbleColor);
    setSeamColor(p.seamColor);
    setLipColor(p.lipColor);
    setBumpScale(p.bumpScale);
    setRoughness(p.roughness);
    setAutoSpinY(p.autoSpinY);

    updateCustomization(p);
  };

  // Immediate event updates for individual controls
  const handleColorChange = (key: 'baseColor' | 'pebbleColor' | 'seamColor' | 'lipColor', value: string) => {
    setSelectedPreset('Custom');
    if (key === 'baseColor') setBaseColor(value);
    if (key === 'pebbleColor') setPebbleColor(value);
    if (key === 'seamColor') setSeamColor(value);
    if (key === 'lipColor') setLipColor(value);

    updateCustomization({ [key]: value });
  };

  const handleSliderChange = (key: 'bumpScale' | 'roughness' | 'autoSpinY', value: number) => {
    setSelectedPreset('Custom');
    if (key === 'bumpScale') setBumpScale(value);
    if (key === 'roughness') setRoughness(value);
    if (key === 'autoSpinY') setAutoSpinY(value);

    updateCustomization({ [key]: value });
  };

  return (
    <>
      {/* Floating vertical quick badge link on right screen edge */}
      <div 
        className="fixed right-0 top-[28%] z-[480] pointer-events-auto"
        id="customizer-badge-container"
      >
        <button
          onClick={() => setIsOpen(true)}
          className="bg-white hover:bg-neutral-100 text-black font-sans font-bold text-[10px] tracking-[4px] uppercase py-4 px-2 rounded-l-2xl shadow-xl flex items-center gap-2 transform origin-right transition-all duration-300 hover:translate-x-[-4px]"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          <span className="text-amber-500 animate-pulse font-serif text-[12px] pb-1">✦</span>
          CUSTOM LAB
        </button>
      </div>

      {/* Main Slide-out Panel Overlay */}
      <div 
        className={`fixed inset-y-0 right-0 w-full max-w-[350px] z-[990] h-screen glass-dark border-l border-neutral-800/80 p-6 flex flex-col justify-between shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        id="customizer-drawer-root"
      >
        {/* Header section with Close Trigger */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800/60">
            <div className="flex items-center gap-2">
              <span className="text-amber-500 text-lg">✦</span>
              <h3 className="font-display text-lg uppercase tracking-wider text-white font-medium">
                CUSTOM LAB
              </h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-neutral-900/60 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center text-sm font-sans cursor-pointer transition-colors"
            >
              ×
            </button>
          </div>

          <p className="font-sans text-[11px] text-neutral-400 leading-relaxed font-normal">
            Tinker with the molecular structure of our procedural 3D streetball. Modify colors, pebble densities, and traction in real time.
          </p>

          {/* Quick Preset select widgets */}
          <div className="space-y-2 pt-2">
            <span className="table text-[9px] font-bold text-neutral-500 uppercase tracking-wider">
              Studio Presets
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {PRESETS.map((p) => (
                <button
                  key={p.name}
                  onClick={() => handleApplyPreset(p)}
                  className={`px-3 py-2 rounded-xl text-left border text-[10px] font-semibold transition-all ${
                    selectedPreset === p.name
                      ? 'bg-white text-black border-white shadow-md font-bold'
                      : 'bg-neutral-900/40 border-neutral-800/80 text-neutral-400 hover:bg-neutral-900 hover:text-white'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Real-time Slider controls */}
          <div className="space-y-4.5 pt-4">
            <span className="table text-[9px] font-bold text-neutral-500 uppercase tracking-wider">
              Fine-Tuning Controls
            </span>

            {/* Colors Grid */}
            <div className="grid grid-cols-2 gap-3.5">
              <div className="flex flex-col gap-1.5">
                <span className="text-[9px] font-medium text-neutral-400 uppercase tracking-wide">Base Leather</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={baseColor}
                    onChange={(e) => handleColorChange('baseColor', e.target.value)}
                    className="w-7 h-7 rounded-lg bg-transparent border-0 outline-0 appearance-none cursor-pointer"
                  />
                  <span className="font-mono text-[9px] text-neutral-500 uppercase">{baseColor}</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[9px] font-medium text-neutral-400 uppercase tracking-wide">Pebble Core</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={pebbleColor}
                    onChange={(e) => handleColorChange('pebbleColor', e.target.value)}
                    className="w-7 h-7 rounded-lg bg-transparent border-0 outline-0 appearance-none cursor-pointer"
                  />
                  <span className="font-mono text-[9px] text-neutral-500 uppercase">{pebbleColor}</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[9px] font-medium text-neutral-400 uppercase tracking-wide">Rubber Channels</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={seamColor}
                    onChange={(e) => handleColorChange('seamColor', e.target.value)}
                    className="w-7 h-7 rounded-lg bg-transparent border-0 outline-0 appearance-none cursor-pointer"
                  />
                  <span className="font-mono text-[9px] text-neutral-500 uppercase">{seamColor}</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[9px] font-medium text-neutral-400 uppercase tracking-wide">Seam Bevels</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={lipColor}
                    onChange={(e) => handleColorChange('lipColor', e.target.value)}
                    className="w-7 h-7 rounded-lg bg-transparent border-0 outline-0 appearance-none cursor-pointer"
                  />
                  <span className="font-mono text-[9px] text-neutral-500 uppercase">{lipColor}</span>
                </div>
              </div>
            </div>

            {/* Sliders Block */}
            <div className="space-y-3.5 pt-2">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-[9px] font-medium text-neutral-400 uppercase tracking-wide">
                  <span>Pebble Height Intensity</span>
                  <span className="font-mono text-neutral-500">{(bumpScale * 1000).toFixed(0)}</span>
                </div>
                <input
                  type="range"
                  min="0.01"
                  max="0.18"
                  step="0.005"
                  value={bumpScale}
                  onChange={(e) => handleSliderChange('bumpScale', parseFloat(e.target.value))}
                  className="w-full accent-white appearance-none h-[4px] bg-neutral-800 rounded-full cursor-pointer outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-[9px] font-medium text-neutral-400 uppercase tracking-wide">
                  <span>Roughness / Sheen</span>
                  <span className="font-mono text-neutral-500">{roughness.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.15"
                  max="0.95"
                  step="0.05"
                  value={roughness}
                  onChange={(e) => handleSliderChange('roughness', parseFloat(e.target.value))}
                  className="w-full accent-white appearance-none h-[4px] bg-neutral-800 rounded-full cursor-pointer outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-[9px] font-medium text-neutral-400 uppercase tracking-wide">
                  <span>Auto Rotation Speed</span>
                  <span className="font-mono text-neutral-500">{(autoSpinY * 1000).toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="0.008"
                  step="0.0005"
                  value={autoSpinY}
                  onChange={(e) => handleSliderChange('autoSpinY', parseFloat(e.target.value))}
                  className="w-full accent-white appearance-none h-[4px] bg-neutral-800 rounded-full cursor-pointer outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Bottom Box */}
        <div className="pt-4 border-t border-neutral-800/60 mt-4 text-center">
          <span className="font-sans text-[10px] text-neutral-500 tracking-wide inline-block">
            ✓ Seamless live update active
          </span>
        </div>
      </div>

      {/* Click outside overlay backplate to close */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-[470] bg-black/20 backdrop-blur-[2px] transition-opacity duration-300 pointer-events-auto"
        />
      )}
    </>
  );
}
