import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { playSwoosh } from '../utils/audio';

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const BALL_SCALE = 0.97;
const FOOTER_SCALE = 0.5;

const SECTIONS = {
  hero:   { x: 0.0,   y: 0.08,  z: 0,    scale: BALL_SCALE * 0.84 },
  stats:  { x: 2.2,  y: 0.0,  z: 0,    scale: BALL_SCALE },
  how:    { x: -2.0, y: 0.0,  z: 0,    scale: BALL_SCALE },
  footer: { x: 2.5,  y: -1.3,  z: -2.0, scale: FOOTER_SCALE },
};

export default function ThreeCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 1. RENDERER SETUP
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.64;

    // 2. SCENE & CAMERA
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.set(0, 0, 5.5);

    // 3. REFLECTIONS & ENVIRONMENT
    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();
    const roomEnv = new RoomEnvironment();
    scene.environment = pmrem.fromScene(roomEnv, 0.04).texture;

    // 4. LIGHTING
    const ambientLight = new THREE.AmbientLight(0xfff0dd, 0.55);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffeedd, 1.6);
    dirLight1.position.set(-2, 4, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xf5e8d0, 0.35);
    dirLight2.position.set(4, 1, -2);
    scene.add(dirLight2);

    const hemisphereLight = new THREE.HemisphereLight(0xfff0dd, 0xcfc0ae, 0.4);
    scene.add(hemisphereLight);

    // 5. BALL STATE & PROCEDURAL TEXTURE GENERATION
    let ball: THREE.Group | THREE.Mesh | null = null;
    let baseScale = 1.0;
    let ballLoaded = false;

    // Target positions for Scroll lerping
    const targetPos = { ...SECTIONS.hero };
    let targetScale = SECTIONS.hero.scale;
    let currentSection = 'hero';

    // Separate rotation tracking for interactive (drag/auto-spin) vs scroll-based rolling
    const extraRot = { x: 0, y: 0, z: 0 };
    const scrollRot = { x: 0, y: 0, z: 0 };

    // Global basketball customizable config state
    const currentConfig = {
      baseColor: '#c84400',
      pebbleColor: '#df5504',
      specColor: 'rgba(255, 200, 150, 0.55)',
      seamColor: '#1c1c1c',
      lipColor: '#ff964f',
      bumpScale: 0.065,
      roughness: 0.65,
      autoSpinY: 0.002,
      ballScaleMultiplier: 1.0,
      metalness: 0.08
    };

    let textureCanvas: HTMLCanvasElement | null = null;
    let bumpCanvas: HTMLCanvasElement | null = null;
    let colorTexture: THREE.CanvasTexture | null = null;
    let bumpTexture: THREE.CanvasTexture | null = null;
    let basketballMat: THREE.MeshStandardMaterial | null = null;

    // Draws procedural content onto the persistent canvases and updates textures
    function drawBasketballTextures(config: typeof currentConfig) {
      if (!textureCanvas || !bumpCanvas) return;

      const ctx = textureCanvas.getContext('2d', { alpha: false })!;
      const bCtx = bumpCanvas.getContext('2d', { alpha: false })!;

      // Enable smoothing for crisp details
      ctx.imageSmoothingEnabled = true;
      bCtx.imageSmoothingEnabled = true;

      // 1. BASE LEATHER GRIT COLORS
      ctx.fillStyle = config.baseColor;
      ctx.fillRect(0, 0, textureCanvas.width, textureCanvas.height);

      // Add a rich radial gradient directly baked onto the background leather color for realistic ambient occlusion
      const colorGrad = ctx.createRadialGradient(
        textureCanvas.width / 2, textureCanvas.height / 2, 100,
        textureCanvas.width / 2, textureCanvas.height / 2, 900
      );
      colorGrad.addColorStop(0, 'rgba(255, 140, 50, 0.18)');
      colorGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.05)');
      colorGrad.addColorStop(1, 'rgba(0, 0, 0, 0.28)');
      ctx.fillStyle = colorGrad;
      ctx.fillRect(0, 0, textureCanvas.width, textureCanvas.height);

      // Bump map: start with perfect neutral height (middle gray)
      bCtx.fillStyle = '#808080';
      bCtx.fillRect(0, 0, bumpCanvas.width, bumpCanvas.height);

      // 2. SUBSTRATE POROUS MICRO-TEXTURE (FINE GRAIN NOISE & ORGANIC LEATHER WRINKLES)
      // Layer vertical micro-creases for grain depth
      for (let i = 0; i < 400; i++) {
        const x = Math.random() * textureCanvas.width;
        const y = Math.random() * textureCanvas.height;
        const len = 4 + Math.random() * 12;
        ctx.strokeStyle = Math.random() > 0.5 ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.04)';
        ctx.lineWidth = 0.8 + Math.random() * 0.8;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + (Math.random() - 0.5) * 2, y + len);
        ctx.stroke();

        bCtx.strokeStyle = Math.random() > 0.5 ? '#6a6a6a' : '#969696';
        bCtx.lineWidth = 0.8;
        bCtx.beginPath();
        bCtx.moveTo(x, y);
        bCtx.lineTo(x, y + len * 0.8);
        bCtx.stroke();
      }

      // Micro pores for leather skin realism
      for (let i = 0; i < 110000; i++) {
        const x = Math.random() * textureCanvas.width;
        const y = Math.random() * textureCanvas.height;
        const size = 1.0 + Math.random() * 1.0;

        ctx.fillStyle = Math.random() > 0.5 ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 180, 120, 0.05)';
        ctx.fillRect(x, y, size, size);

        bCtx.fillStyle = Math.random() > 0.5 ? '#6c6c6c' : '#949494';
        bCtx.fillRect(x, y, size, size);
      }

      // 3. PIXEL-PERFECT JITTERED HEXAGONAL PIE-PACKED PEBBLE GENERATION
      // This creates a uniform, beautifully packed basketball leather texture with no gaps or weird overlaps
      const cols = 280;
      const rows = 140;
      const colWidth = textureCanvas.width / cols;
      const rowHeight = textureCanvas.height / rows;

      for (let rIndex = 0; rIndex < rows; rIndex++) {
        for (let cIndex = 0; cIndex < cols; cIndex++) {
          // Offsets: alternate rows shift by 50% for standard hexagonal packing pattern
          const rowOffset = (rIndex % 2 === 0) ? colWidth * 0.5 : 0;
          
          // Random organic distribution jitter: mimics professional pebbled composite/leather molds
          const jitterX = (Math.random() - 0.5) * colWidth * 0.44;
          const jitterY = (Math.random() - 0.5) * rowHeight * 0.44;

          const x = (cIndex * colWidth + rowOffset + jitterX + textureCanvas.width) % textureCanvas.width;
          const y = rIndex * rowHeight + rowHeight * 0.5 + jitterY;

          // Guard margins near poles
          if (y < 4 || y > textureCanvas.height - 4) continue;

          // Radius for pebble (ideal size to look dense and professional)
          const r = 2.1 + Math.random() * 0.7;

          // --- COLOR MAP DRAWING ---
          // A. Deep leather crevice shadow underneath each pebble (Baked Ambient Occlusion)
          ctx.fillStyle = 'rgba(8, 2, 0, 0.52)';
          ctx.beginPath();
          ctx.arc(x + 0.9, y + 0.9, r * 1.14, 0, Math.PI * 2);
          ctx.fill();

          // B. Main pebble dome
          ctx.fillStyle = config.pebbleColor;
          ctx.beginPath();
          ctx.arc(x, y, r * 0.9, 0, Math.PI * 2);
          ctx.fill();

          // C. Pebble specular highlight dot (top-left)
          ctx.fillStyle = config.specColor;
          ctx.beginPath();
          ctx.arc(x - 0.5, y - 0.5, r * 0.38, 0, Math.PI * 2);
          ctx.fill();

          // --- BUMP MAP DRAWING ---
          // Pebble recess grout (darker = lower height)
          bCtx.fillStyle = '#626262';
          bCtx.beginPath();
          bCtx.arc(x + 0.5, y + 0.5, r * 1.18, 0, Math.PI * 2);
          bCtx.fill();

          // Pebble dome cap (whiter = raised height)
          bCtx.fillStyle = '#eeeeee';
          bCtx.beginPath();
          bCtx.arc(x - 0.3, y - 0.3, r * 0.84, 0, Math.PI * 2);
          bCtx.fill();
        }
      }

      // 4. EMBOSSED AND BEVELED SEAM PATH DRAWING
      function drawSeamPath(
        c: CanvasRenderingContext2D,
        width: number,
        height: number,
        lineWidth: number,
        style: string
      ) {
        c.strokeStyle = style;
        c.lineWidth = lineWidth;
        c.lineCap = 'round';
        c.lineJoin = 'round';

        // Equator meridian (Horizontal center line)
        c.beginPath();
        c.moveTo(0, height / 2);
        c.lineTo(width, height / 2);
        c.stroke();

        // Longitudinal vertical meridian (Plane x = 0 - Main vertical seam)
        c.beginPath();
        c.moveTo(0, 0);
        c.lineTo(0, height);
        c.moveTo(width * 0.5, 0);
        c.lineTo(width * 0.5, height);
        c.moveTo(width, 0);
        c.lineTo(width, height);
        c.stroke();

        // Left and right curved segments reconstructed using mathematically precise 3D-to-2D projection
        const alpha = 42 * (Math.PI / 180); // 42 degrees tilt
        const d = 0.35; // 0.35 distance shift from origin to split loops symmetrically
        const r = Math.sqrt(1 - d * d);
        const steps = 400; // high precision density for perfectly smooth lines

        // Symmetrical Curved Loop 1 (Left Loop - shifted towards Negative X/Z)
        c.beginPath();
        let first1 = true;
        let lastU1 = 0;
        for (let i = 0; i <= steps; i++) {
          const t = (i / steps) * Math.PI * 2;
          
          // 3D coordinates on Unit Sphere
          const x = -r * Math.cos(t) * Math.sin(alpha) - d * Math.cos(alpha);
          const y = r * Math.sin(t);
          const z = r * Math.cos(t) * Math.cos(alpha) - d * Math.sin(alpha);

          // Correct standard Three.js UV projection
          const clampY = Math.max(-1, Math.min(1, y));
          const phi = Math.acos(clampY);
          const theta = Math.atan2(x, -z);

          const u = (theta + Math.PI) / (Math.PI * 2);
          const v = 1.0 - phi / Math.PI;

          const U = u * width;
          const V = v * height;

          if (first1) {
            c.moveTo(U, V);
            first1 = false;
          } else if (Math.abs(U - lastU1) > width / 2) {
            c.moveTo(U, V);
          } else {
            c.lineTo(U, V);
          }
          lastU1 = U;
        }
        c.stroke();

        // Symmetrical Curved Loop 2 (Right Loop - shifted towards Positive X/Z)
        c.beginPath();
        let first2 = true;
        let lastU2 = 0;
        for (let i = 0; i <= steps; i++) {
          const t = (i / steps) * Math.PI * 2;
          
          // 3D coordinates on Unit Sphere - Symmetric reflected circle
          const x = -r * Math.cos(t) * Math.sin(alpha) + d * Math.cos(alpha);
          const y = r * Math.sin(t);
          const z = -r * Math.cos(t) * Math.cos(alpha) - d * Math.sin(alpha);

          // Correct standard Three.js UV projection
          const clampY = Math.max(-1, Math.min(1, y));
          const phi = Math.acos(clampY);
          const theta = Math.atan2(x, -z);

          const u = (theta + Math.PI) / (Math.PI * 2);
          const v = 1.0 - phi / Math.PI;

          const U = u * width;
          const V = v * height;

          if (first2) {
            c.moveTo(U, V);
            first2 = false;
          } else if (Math.abs(U - lastU2) > width / 2) {
            c.moveTo(U, V);
          } else {
            c.lineTo(U, V);
          }
          lastU2 = U;
        }
        c.stroke();
      }

      // A. Draw Seams onto Color Map (Multiple passes for premium beveling)
      drawSeamPath(ctx, textureCanvas.width, textureCanvas.height, 46, 'rgba(15, 3, 0, 0.45)');
      drawSeamPath(ctx, textureCanvas.width, textureCanvas.height, 30, config.lipColor);
      drawSeamPath(ctx, textureCanvas.width, textureCanvas.height, 22, config.seamColor);
      drawSeamPath(ctx, textureCanvas.width, textureCanvas.height, 10, '#000000');

      // B. Draw Seams onto Bump Map (Recessed grooves with round lips)
      drawSeamPath(bCtx, bumpCanvas.width, bumpCanvas.height, 46, '#555555');
      drawSeamPath(bCtx, bumpCanvas.width, bumpCanvas.height, 30, '#b2b2b2');
      drawSeamPath(bCtx, bumpCanvas.width, bumpCanvas.height, 22, '#1a1a1a');
      drawSeamPath(bCtx, bumpCanvas.width, bumpCanvas.height, 10, '#000000');

      if (colorTexture) colorTexture.needsUpdate = true;
      if (bumpTexture) bumpTexture.needsUpdate = true;
    }

    // Generates the initial beautiful pebbled 3D basketball fallbacks
    function generateProceduralBasketball() {
      textureCanvas = document.createElement('canvas');
      textureCanvas.width = 2048;
      textureCanvas.height = 1024;

      bumpCanvas = document.createElement('canvas');
      bumpCanvas.width = 2048;
      bumpCanvas.height = 1024;

      colorTexture = new THREE.CanvasTexture(textureCanvas);
      colorTexture.colorSpace = THREE.SRGBColorSpace;
      colorTexture.wrapS = THREE.RepeatWrapping;
      colorTexture.wrapT = THREE.ClampToEdgeWrapping;

      bumpTexture = new THREE.CanvasTexture(bumpCanvas);
      bumpTexture.wrapS = THREE.RepeatWrapping;
      bumpTexture.wrapT = THREE.ClampToEdgeWrapping;

      // Draw initial textures
      drawBasketballTextures(currentConfig);

      // Increase sphere geometry segments to 128 for completely flawless, smooth sphere edges
      const sphereGeo = new THREE.SphereGeometry(1.2, 128, 128);
      basketballMat = new THREE.MeshStandardMaterial({
        map: colorTexture,
        bumpMap: bumpTexture,
        bumpScale: currentConfig.bumpScale,
        roughness: currentConfig.roughness,
        metalness: 0.08,
        envMapIntensity: 1.1
      });

      const mesh = new THREE.Mesh(sphereGeo, basketballMat);
      const group = new THREE.Group();
      group.add(mesh);
      return group;
    }

    // Customization event listener
    const handleCustomize = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (!customEvent || !customEvent.detail) return;
      const config = customEvent.detail;
      
      if (config.baseColor) currentConfig.baseColor = config.baseColor;
      if (config.pebbleColor) currentConfig.pebbleColor = config.pebbleColor;
      if (config.specColor) currentConfig.specColor = config.specColor;
      if (config.seamColor) currentConfig.seamColor = config.seamColor;
      if (config.lipColor) currentConfig.lipColor = config.lipColor;
      if (config.bumpScale !== undefined) currentConfig.bumpScale = config.bumpScale;
      if (config.roughness !== undefined) currentConfig.roughness = config.roughness;
      if (config.metalness !== undefined) currentConfig.metalness = config.metalness;
      if (config.autoSpinY !== undefined) currentConfig.autoSpinY = config.autoSpinY;
      if (config.ballScaleMultiplier !== undefined) currentConfig.ballScaleMultiplier = config.ballScaleMultiplier;

      // Re-trigger visual drawing
      drawBasketballTextures(currentConfig);

      // Trigger material updates
      if (basketballMat) {
        basketballMat.bumpScale = currentConfig.bumpScale;
        basketballMat.roughness = currentConfig.roughness;
        if (currentConfig.metalness !== undefined) {
          basketballMat.metalness = currentConfig.metalness;
        }
        basketballMat.needsUpdate = true;
      }

      // If only scale or spin parameters are tuned, bypass full cinematic zoom to prevent stuttering & re-trigger noise
      const onlyScaleOrSpinUpdated = Object.keys(config).every(k => k === 'ballScaleMultiplier' || k === 'autoSpinY');
      if (onlyScaleOrSpinUpdated) return;

      // Also trigger a beautiful celebratory spin / scale animation on customization update!
      if (ball) {
        playSwoosh();
        gsap.killTweensOf(extraRot);
        gsap.to(extraRot, {
          y: extraRot.y + Math.PI * 2,
          duration: 1.2,
          ease: 'power3.out'
        });
        
        gsap.killTweensOf(ball.scale);
        const originalScale = baseScale * targetScale * (currentConfig.ballScaleMultiplier || 1.0);
        gsap.timeline()
          .to(ball.scale, {
            x: originalScale * 1.12,
            y: originalScale * 1.12,
            z: originalScale * 1.12,
            duration: 0.22,
            ease: 'power2.out'
          })
          .to(ball.scale, {
            x: originalScale,
            y: originalScale,
            z: originalScale,
            duration: 0.45,
            ease: 'back.out(1.7)'
          });
      }
    };

    const handleSignatureSpin = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (!customEvent || !customEvent.detail || !ball) return;
      
      const { type } = customEvent.detail;
      
      gsap.killTweensOf(extraRot);
      gsap.killTweensOf(ball.scale);
      
      const originalScale = baseScale * targetScale;

      if (type === 'The Corkscrew') {
         gsap.to(extraRot, {
            x: extraRot.x + Math.PI * 4,
            y: extraRot.y + Math.PI * 4,
            z: extraRot.z + Math.PI * 4,
            duration: 2.5,
            ease: "power2.inOut"
         });
      } else if (type === 'Reverse Backspin') {
         gsap.to(extraRot, {
            y: extraRot.y - Math.PI * 8,
            duration: 3,
            ease: "circ.easeOut"
         });
      } else if (type === 'Top Rock Wobble') {
         // quick wobble on Z and X
         gsap.timeline()
           .to(extraRot, { z: extraRot.z + 0.5, x: extraRot.x - 0.2, duration: 0.15, ease: 'power1.out' })
           .to(extraRot, { z: extraRot.z - 0.5, x: extraRot.x + 0.4, duration: 0.3, ease: 'power1.inOut' })
           .to(extraRot, { z: extraRot.z + 0.3, x: extraRot.x - 0.2, duration: 0.3, ease: 'power1.inOut' })
           .to(extraRot, { z: Math.round(extraRot.z / (Math.PI*2)) * Math.PI*2, x: Math.round(extraRot.x / (Math.PI*2)) * Math.PI*2, duration: 0.5, ease: 'bounce.out' });
      } else if (type === 'Gravity Drop') {
           gsap.timeline()
             .to(ball.scale, { x: originalScale * 1.35, y: originalScale * 1.35, z: originalScale * 1.35, duration: 0.6, ease: "power2.out" })
             .to(extraRot, { x: extraRot.x + Math.PI * 2, y: extraRot.y + Math.PI * 3, duration: 1.5, ease: "power3.inOut" }, 0)
             .to(ball.scale, { x: originalScale, y: originalScale, z: originalScale, duration: 0.5, ease: "bounce.out" }, "-=0.5");
      }
    };

    const handleLightsUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (!customEvent || !customEvent.detail) return;
      
      const { 
        dirLight1Enabled, 
        dirLight1Intensity, 
        dirLight2Enabled, 
        dirLight2Intensity, 
        ambientLightIntensity 
      } = customEvent.detail;

      if (dirLight1) {
        dirLight1.visible = dirLight1Enabled !== false;
        if (typeof dirLight1Intensity === 'number') {
          dirLight1.intensity = dirLight1Intensity;
        }
      }
      if (dirLight2) {
        dirLight2.visible = dirLight2Enabled !== false;
        if (typeof dirLight2Intensity === 'number') {
          dirLight2.intensity = dirLight2Intensity;
        }
      }
      if (ambientLight) {
        if (typeof ambientLightIntensity === 'number') {
          ambientLight.intensity = ambientLightIntensity;
        }
      }
    };

    window.addEventListener('basketball-customize', handleCustomize);
    window.addEventListener('basketball-signature-spin', handleSignatureSpin);
    window.addEventListener('basketball-lights-update', handleLightsUpdate);

    // 6. LOAD GLB OR PROCEDURAL FALLBACK
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    const onModelLoaded = (modelGroup: THREE.Group) => {
      ball = modelGroup;
      // Center the model mesh
      const box = new THREE.Box3().setFromObject(ball);
      const center = new THREE.Vector3();
      box.getCenter(center);
      ball.position.sub(center);

      // Normalize size so maximum size is 2.4 units
      const size = new THREE.Vector3();
      box.getSize(size);
      const maxSize = Math.max(size.x, size.y, size.z);
      baseScale = 2.4 / maxSize;

      // Material Overrides for grittier street-ball aesthetics
      ball.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.material) {
            const m = mesh.material as THREE.MeshStandardMaterial;
            m.envMapIntensity = 0.15;
            if (m.roughness !== undefined) {
              m.roughness = Math.min(1.0, Math.max(0.82, (m.roughness ?? 0.5) * 1.55));
            }
            if (m.metalness !== undefined) {
              m.metalness = 0;
            }
            if (m.color) {
              m.color.multiplyScalar(0.68); // darken mesh colors for street-grit aesthetic
            }
            m.needsUpdate = true;
          }
        }
      });

      scene.add(ball);
      ballLoaded = true;
      ballEntrance();
    };

    // Load actual GLB or use procedural fallback
    loader.load(
      '/models/basketball.glb',
      (gltf) => {
        onModelLoaded(gltf.scene);
      },
      undefined,
      (err) => {
        console.warn('Could not load models/basketball.glb, spawning procedural elite-styled 3D basketball fallback.', err);
        const proceduralBall = generateProceduralBasketball();
        onModelLoaded(proceduralBall);
      }
    );

    // 7. ENTRANCE ANIMATION & DRAG CONTROLS
    let isDragging = false;
    const velocity = { x: 0, y: 0 };
    const prevMouse = { x: 0, y: 0 };

    // Raycasting variables for 3D basketball hover animation effects
    const raycaster = new THREE.Raycaster();
    const ndcMouse = new THREE.Vector2(-999, -999);
    let isBallHoveredGlobal = false;
    let hoverScaleOffset = 1.0;
    const hoverOffsetPosObj = { x: 0, y: 0 };

    const handleNDC_MouseMove = (e: MouseEvent) => {
      ndcMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      ndcMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleNDC_MouseMove);

    const BASE_SPEED = 0.035;
    const autoVel = {
      x: (Math.random() - 0.5) * 0.015,
      y: BASE_SPEED + Math.random() * 0.012,
    };

    function ballEntrance() {
      if (!ball) return;
      canvas.classList.add('drag-enabled');

      // Animates full ball scale up from 25% with slow slide up transition
      ball.scale.setScalar(0.001);
      ball.position.set(SECTIONS.hero.x, SECTIONS.hero.y - 0.8, SECTIONS.hero.z);

      gsap.to(ball.scale, {
        x: baseScale * SECTIONS.hero.scale,
        y: baseScale * SECTIONS.hero.scale,
        z: baseScale * SECTIONS.hero.scale,
        duration: 1.3,
        ease: 'expo.out',
        delay: 0.5
      });

      gsap.to(ball.position, {
        x: SECTIONS.hero.x,
        y: SECTIONS.hero.y,
        z: SECTIONS.hero.z,
        duration: 1.3,
        ease: 'expo.out',
        delay: 0.5,
        onComplete: () => {
          enableDrag();
        }
      });
    }

    // Interactive Drag Physics
    function enableDrag() {
      const getPos = (e: MouseEvent | TouchEvent) => {
        if ('touches' in e) {
          return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
        return { x: e.clientX, y: e.clientY };
      };

      const handleStart = (e: MouseEvent | TouchEvent) => {
        const viewIsCustomLab = window.location.hash === '#custom-lab' || window.location.hash === '#kinetics';
        if (currentSection !== 'hero' && !viewIsCustomLab) return;
        isDragging = true;
        playSwoosh();
        const pos = getPos(e);
        prevMouse.x = pos.x;
        prevMouse.y = pos.y;
        velocity.x = 0;
        velocity.y = 0;
      };

      const handleMove = (e: MouseEvent | TouchEvent) => {
        const viewIsCustomLab = window.location.hash === '#custom-lab' || window.location.hash === '#kinetics';
        if (!isDragging || !ball || (currentSection !== 'hero' && !viewIsCustomLab)) return;
        const pos = getPos(e);
        const dx = pos.x - prevMouse.x;
        const dy = pos.y - prevMouse.y;

        // Apply visual rotation based on dragging distance
        extraRot.y += dx * 0.006;
        extraRot.x += dy * 0.006;

        // Momentum drag capture
        velocity.x = dy * 0.006;
        velocity.y = dx * 0.006;

        prevMouse.x = pos.x;
        prevMouse.y = pos.y;
      };

      const handleEnd = () => {
        if (!isDragging) return;
        isDragging = false;

        // Transition momentum direction to the primary auto-rotation spin vectors
        const mag = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
        if (mag > 0.002) {
          autoVel.x = velocity.x * 0.25;
          autoVel.y = velocity.y * 0.25;
        }
      };

      window.addEventListener('mousedown', handleStart);
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleEnd);

      window.addEventListener('touchstart', handleStart, { passive: true });
      window.addEventListener('touchmove', handleMove, { passive: true });
      window.addEventListener('touchend', handleEnd);
    }

    // 8. SCROLL POSITION INTERPOLATIONS WITH SCROLLTRIGGER
    const easeInOut = (t: number) => {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    };

    // Hero -> Stats transition trigger
    ScrollTrigger.create({
      trigger: '#stats-section',
      start: 'top bottom',
      end: 'top top',
      scrub: 2,
      onUpdate: (self) => {
        const p = self.progress;
        const bentP = easeInOut(p);
        targetPos.x = gsap.utils.interpolate(SECTIONS.hero.x, SECTIONS.stats.x, bentP);
        targetPos.y = gsap.utils.interpolate(SECTIONS.hero.y, SECTIONS.stats.y, bentP);
        targetPos.z = gsap.utils.interpolate(SECTIONS.hero.z, SECTIONS.stats.z, bentP);
        targetScale = gsap.utils.interpolate(SECTIONS.hero.scale, SECTIONS.stats.scale, p);

        // Dynamically rotate the ball based on transition progress (rightward roll)
        scrollRot.x = bentP * -0.6;
        scrollRot.y = bentP * 3.5;
        scrollRot.z = bentP * 0.2;
      },
      onEnter: () => {
        currentSection = 'stats';
        canvas.classList.remove('drag-enabled');
      },
      onLeaveBack: () => {
        currentSection = 'hero';
        canvas.classList.add('drag-enabled');
      }
    });

    // Stats -> How transition trigger
    ScrollTrigger.create({
      trigger: '#how-section',
      start: 'top bottom',
      end: 'top top',
      scrub: 2,
      onUpdate: (self) => {
        if (currentSection === 'hero') return; // protect bounds
        const p = self.progress;
        const bentP = easeInOut(p);
        targetPos.x = gsap.utils.interpolate(SECTIONS.stats.x, SECTIONS.how.x, bentP);
        targetPos.y = gsap.utils.interpolate(SECTIONS.stats.y, SECTIONS.how.y, bentP);
        targetPos.z = gsap.utils.interpolate(SECTIONS.stats.z, SECTIONS.how.z, bentP);
        targetScale = gsap.utils.interpolate(SECTIONS.stats.scale, SECTIONS.how.scale, p);

        // Stats to How rotation (rotating leftwards as it moves left)
        scrollRot.x = -0.6 + bentP * 0.8;
        scrollRot.y = 3.5 - bentP * 6.5;
        scrollRot.z = 0.2 - bentP * 0.4;
      },
      onEnter: () => {
        currentSection = 'how';
        canvas.classList.remove('drag-enabled');
      },
      onLeaveBack: () => {
        currentSection = 'stats';
        canvas.classList.remove('drag-enabled');
      }
    });

    // How -> Footer transition trigger
    ScrollTrigger.create({
      trigger: '#site-footer',
      start: 'top bottom',
      end: 'top top',
      scrub: 2,
      onUpdate: (self) => {
        const p = self.progress;
        const bentP = easeInOut(p);
        
        // Depth recession calculations when transitioning to footer mesh position
        // Adds extra negative depth offset
        const zCompensation = -2.0 * bentP;

        targetPos.x = gsap.utils.interpolate(SECTIONS.how.x, SECTIONS.footer.x, bentP);
        targetPos.y = gsap.utils.interpolate(SECTIONS.how.y, SECTIONS.footer.y, bentP);
        targetPos.z = gsap.utils.interpolate(SECTIONS.how.z, SECTIONS.footer.z, bentP) + zCompensation;
        targetScale = gsap.utils.interpolate(SECTIONS.how.scale, SECTIONS.footer.scale, p);

        // How to Footer: rolls rightwards to x=2.5 and downwards
        scrollRot.x = 0.2 + bentP * 1.2;
        scrollRot.y = -3.0 + bentP * 5.0;
        scrollRot.z = -0.2 + bentP * 0.6;
      },
      onEnter: () => {
        currentSection = 'footer';
        canvas.classList.remove('drag-enabled');
      },
      onLeaveBack: () => {
        currentSection = 'how';
        canvas.classList.remove('drag-enabled');
      }
    });

    // 9. WINDOW RESIZE HANDLER
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener('resize', handleResize);

    // 10. ACTIVE ANIMATION LOOP
    const DAMPING = 0.94;
    function animate() {
      requestAnimationFrame(animate);

      if (ball && ballLoaded) {
        // --- RAYCASTING FOR INTERACTIVE HOVER INTERSECTION ---
        raycaster.setFromCamera(ndcMouse, camera);
        const intersects = raycaster.intersectObjects(scene.children, true);
        let intersectsBall = false;

        for (let i = 0; i < intersects.length; i++) {
          let currentParent: THREE.Object3D | null = intersects[i].object;
          while (currentParent) {
            if (currentParent === ball) {
              intersectsBall = true;
              break;
            }
            currentParent = currentParent.parent;
          }
          if (intersectsBall) break;
        }

        // Trigger state adjustments and dispatch custom events on transition
        if (intersectsBall !== isBallHoveredGlobal) {
          isBallHoveredGlobal = intersectsBall;
          window.dispatchEvent(new CustomEvent('3d-ball-hover', { detail: { hovered: isBallHoveredGlobal } }));

          // Modify material specular characteristics on hover (gleaming leather effect)
          if (basketballMat) {
            gsap.killTweensOf(basketballMat);
            gsap.to(basketballMat, {
              roughness: isBallHoveredGlobal ? currentConfig.roughness * 0.68 : currentConfig.roughness,
              envMapIntensity: isBallHoveredGlobal ? 1.65 : 1.1,
              duration: 0.35,
              overwrite: 'auto'
            });
          }
        }

        // Lerp visual parallax shift and expand vectors on hover
        if (isBallHoveredGlobal) {
          hoverScaleOffset += (1.16 - hoverScaleOffset) * 0.15;
          hoverOffsetPosObj.x += (ndcMouse.x * 0.22 - hoverOffsetPosObj.x) * 0.12;
          hoverOffsetPosObj.y += (ndcMouse.y * 0.22 - hoverOffsetPosObj.y) * 0.12;
        } else {
          hoverScaleOffset += (1.0 - hoverScaleOffset) * 0.15;
          hoverOffsetPosObj.x += (0 - hoverOffsetPosObj.x) * 0.12;
          hoverOffsetPosObj.y += (0 - hoverOffsetPosObj.y) * 0.12;
        }

        if (!isDragging) {
          // Slow continuous float rotation (increases slightly on hover for energetic feel)
          const spinMultiplier = isBallHoveredGlobal ? 2.8 : 1.0;
          extraRot.x += autoVel.x * spinMultiplier;
          extraRot.y += autoVel.y * spinMultiplier;

          // Drag velocity decay momentum physics
          autoVel.x *= DAMPING;
          autoVel.y *= DAMPING;

          // Maintain standard auto rotation speed when momentum settles
          const lengthSquare = autoVel.x * autoVel.x + autoVel.y * autoVel.y;
          const targetSpinY = currentSection === 'hero' ? 0.052 : currentConfig.autoSpinY;
          const targetSpinX = currentSection === 'hero' ? 0.022 : 0.015;
          const thresholdSpeed = currentSection === 'hero' ? 0.06 : BASE_SPEED;
          
          if (lengthSquare < thresholdSpeed * thresholdSpeed) {
            // Gradually lerp back to nice active auto rotation vectors
            autoVel.x += (targetSpinX - autoVel.x) * 0.05;
            autoVel.y += (targetSpinY - autoVel.y) * 0.05;
          }
        }

        // Apply combined interactive rotation (extraRot) and scroll-based rotation (scrollRot)
        ball.rotation.x = extraRot.x + scrollRot.x;
        ball.rotation.y = extraRot.y + scrollRot.y;
        ball.rotation.z = extraRot.z + scrollRot.z;

        const viewIsCustomLab = window.location.hash === '#custom-lab' || window.location.hash === '#kinetics';
        if (viewIsCustomLab) {
          if (!canvas.classList.contains('drag-enabled')) {
            canvas.classList.add('drag-enabled');
          }
        } else if (currentSection !== 'hero') {
          if (canvas.classList.contains('drag-enabled')) {
            canvas.classList.remove('drag-enabled');
          }
        }

        // smooth position & scale lerp coordinates for heavy physics scrub lag feel
        const isMobile = window.innerWidth < 768;
        let currentTargetPos = { ...targetPos };
        let currentTargetScale = targetScale;

        if (viewIsCustomLab) {
          currentTargetPos.x = 0;
          currentTargetPos.y = isMobile ? 0.38 : 0.05; // Center or slightly offset upward on mobile
          currentTargetPos.z = 0;
          currentTargetScale = isMobile ? 0.65 : 0.85; // Beautiful centered display dimensions
        } else if (isMobile) {
          // Responsive layout tweaks for standard sections on mobile viewports
          if (currentSection === 'hero') {
            currentTargetScale = targetScale * 0.72; // Fits neatly inside HOOPLY bounds on tiny screens
            currentTargetPos.y = SECTIONS.hero.y + 0.04;
          } else if (currentSection === 'stats') {
            currentTargetPos.x = 0.0;
            currentTargetPos.y = -1.15; // Shifted below stat cards to present details legibly
            currentTargetScale = BALL_SCALE * 0.55;
          } else if (currentSection === 'how') {
            currentTargetPos.x = 0.0;
            currentTargetPos.y = -0.15; // Repositioned cleanly in the central gap
            currentTargetScale = BALL_SCALE * 0.55;
          } else if (currentSection === 'footer') {
            currentTargetPos.x = 0.0;
            currentTargetPos.y = -1.2;
            currentTargetScale = FOOTER_SCALE * 0.65;
          }
        }

        // Apply interactive micro coordinates parallax shift mapping
        ball.position.x += (currentTargetPos.x + hoverOffsetPosObj.x - ball.position.x) * 0.12;
        ball.position.y += (currentTargetPos.y + hoverOffsetPosObj.y - ball.position.y) * 0.12;
        ball.position.z += (currentTargetPos.z - ball.position.z) * 0.12;

        const realScaled = baseScale * currentTargetScale * hoverScaleOffset * (currentConfig.ballScaleMultiplier || 1.0);
        ball.scale.x += (realScaled - ball.scale.x) * 0.12;
        ball.scale.y += (realScaled - ball.scale.y) * 0.12;
        ball.scale.z += (realScaled - ball.scale.z) * 0.12;
      }

      renderer.render(scene, camera);
    }
    animate();

    // Fire refresh after setup to trigger ScrollTrigger coordinates
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleNDC_MouseMove);
      window.removeEventListener('basketball-customize', handleCustomize);
      window.removeEventListener('basketball-signature-spin', handleSignatureSpin);
      window.removeEventListener('basketball-lights-update', handleLightsUpdate);
      renderer.dispose();

      // Unregister triggers
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed top-0 left-0 w-full h-screen pointer-events-none z-10">
      <canvas id="hero-canvas" ref={canvasRef} />
    </div>
  );
}
