import React, { useRef, Suspense, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, Sparkles, Float, MeshTransmissionMaterial, Environment, Html, PositionalAudio } from '@react-three/drei';
import * as THREE from 'three';
import { FiSkipBack, FiPlay, FiPause, FiSkipForward } from "react-icons/fi";
import { TbZodiacAquarius, TbRipple } from "react-icons/tb";

// --- DATA POOLS ---
const RAW_PLAYLIST = [
  { title: "Las Mañanitas 🎂", url: "/music/mañanitas.m4a" },
  { title: "Melendi-Leonel_Garcia", url: "/music/Para_Empezar.m4a" },
  { title: "Carlos Rivera", url: "https://www.dropbox.com/scl/fi/rvn3xf1rczhw066eqf80x/Carlos_Rivera_-_La_Luna_del_Cielo.mp3?rlkey=kl30bbhv1ouapxz4fpmh65cu4&st=fgh6vyrw&dl=0&raw=1" }
];

const BIRTHDAY_MESSAGES = [ 
  "✨ MIRA HACIA LAS ESTRELLAS, WENDY ✨", // Mensaje guía inicial
  "¡FELIZ CUMPLEAÑOS AMOR MÍO! 🎂", 
  "¡ERES MI SUEÑO REALIDAD! 💫", 
  "¡♒ ACUARIANA MÍSTICA ♒!"
];

const ESFERA_POOL = ["/photos/esferas/00.webp", "/photos/esferas/01.webp", "/photos/esferas/02.webp", "/photos/esferas/03.webp", "/photos/esferas/04.webp", "/photos/esferas/05.webp", "/photos/esferas/06.webp"];
const COUPON_POOL = ["/photos/cupones/c01.webp", "/photos/cupones/c02.webp", "/photos/cupones/c03.webp", "/photos/cupones/c04.webp", "/photos/cupones/c05.webp", "/photos/cupones/c06.webp", "/photos/cupones/c07.webp", "/photos/cupones/c08.webp", "/photos/cupones/c09.webp", "/photos/cupones/c10.webp", "/photos/cupones/c11.webp", "/photos/cupones/c12.webp"];
const SPHERE_SLOTS = [{ pos: [0, 5, 0], delay: 0 }, { pos: [-18, 12, -10], delay: 2 }, { pos: [16, -8, -10], delay: 4 }, { pos: [20, 16, -25], delay: 1 }, { pos: [-20, -12, -25], delay: 3 }];
const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

// --- COMPONENTES DE GUÍA Y CELEBRACIÓN ---

// 1. PILAR DE LUZ: Indica dónde están las estrellas memoriales
const StellarGuideBeam = ({ active }) => {
  const beamRef = useRef();
  useFrame(({ clock }) => {
    if (beamRef.current) {
      beamRef.current.rotation.y = clock.getElapsedTime() * 0.5;
      beamRef.current.material.opacity = active ? 0.3 + Math.sin(clock.getElapsedTime() * 2) * 0.1 : 0;
    }
  });

  return (
    <mesh ref={beamRef} position={[0, 10, -45]} rotation={[0, 0, 0]}>
      <cylinderGeometry args={[8, 15, 120, 32, 1, true]} />
      <meshStandardMaterial 
        color="#ffd700" 
        emissive="#ffaa00" 
        emissiveIntensity={2} 
        transparent 
        side={THREE.DoubleSide} 
        depthWrite={false}
      />
    </mesh>
  );
};

const FloatingLanterns = ({ isVisible }) => {
  const count = 25;
  const lanternData = useMemo(() => Array.from({ length: count }).map(() => ({
    pos: [(Math.random() - 0.5) * 110, -45, (Math.random() - 0.5) * 80],
    speed: 0.03 + Math.random() * 0.06,
    scale: 0.8 + Math.random() * 0.5,
    flicker: Math.random() * 10
  })), []);
  const groupRef = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (!groupRef.current) return;
    groupRef.current.children.forEach((instance, i) => {
      const d = lanternData[i];
      if (isVisible) {
        instance.position.y = -35 + (t * d.speed * 8) % 90;
        instance.position.x += Math.sin(t * 0.5 + i) * 0.01;
        instance.scale.setScalar(d.scale);
        if (instance.children[1]) instance.children[1].intensity = 1.5 + Math.sin(t * 4 + d.flicker) * 0.5;
      } else { instance.scale.setScalar(0); }
    });
  });
  return (
    <group ref={groupRef}>
      {lanternData.map((d, i) => (
        <group key={i} position={d.pos}>
          <mesh><cylinderGeometry args={[0.5, 0.45, 1.2, 8]} /><meshStandardMaterial color="#ffcc66" emissive="#ffaa33" emissiveIntensity={0.5} transparent opacity={0.6} /></mesh>
          <pointLight color="#ff8800" intensity={2} distance={15} />
          <mesh position={[0,-0.2,0]}><sphereGeometry args={[0.15, 8, 8]} /><meshBasicMaterial color="#fff" /></mesh>
        </group>
      ))}
    </group>
  );
};

const TransitionFlash = ({ active }) => {
  const [show, setShow] = useState(false);
  useEffect(() => { setShow(true); const t = setTimeout(() => setShow(false), 800); return () => clearTimeout(t); }, [active]);
  return <Html fullscreen style={{ pointerEvents: 'none' }}><div className={`w-full h-full bg-white transition-opacity duration-700 ${show ? 'opacity-30' : 'opacity-0'}`} /></Html>;
};

// --- ELEMENTOS DE ESCENA ---
const createPawTex = () => { const canvas = document.createElement('canvas'); canvas.width = 128; canvas.height = 128; const ctx = canvas.getContext('2d'); ctx.fillStyle = 'white'; ctx.beginPath(); ctx.ellipse(64, 85, 28, 22, 0, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.ellipse(32, 50, 12, 16, -0.5, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.ellipse(54, 35, 12, 16, -0.2, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.ellipse(78, 35, 12, 16, 0.2, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.ellipse(100, 50, 12, 16, 0.5, 0, Math.PI * 2); ctx.fill(); return new THREE.CanvasTexture(canvas); };
const createSuperFlareTexture = () => { const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 512; const ctx = canvas.getContext('2d'); const center = 256; const glow = ctx.createRadialGradient(center, center, 0, center, center, 250); glow.addColorStop(0, 'rgba(255, 255, 255, 1)'); glow.addColorStop(0.3, 'rgba(255, 255, 255, 0.4)'); glow.addColorStop(1, 'rgba(255, 255, 255, 0)'); ctx.fillStyle = glow; ctx.fillRect(0, 0, 512, 512); const drawRay = (w, l, angle) => { ctx.save(); ctx.translate(center, center); ctx.rotate(angle); const grad = ctx.createLinearGradient(-l/2, 0, l/2, 0); grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.9)'); grad.addColorStop(0, 'transparent'); grad.addColorStop(1, 'transparent'); ctx.fillStyle = grad; ctx.fillRect(-l/2, -w/2, l, w); ctx.restore(); }; for (let i = 0; i < 12; i++) drawRay(i % 3 === 0 ? 6 : 3, 512, (Math.PI * 2 / 12) * i); return new THREE.CanvasTexture(canvas); };
const createBottleGeometry = () => { const points = [new THREE.Vector2(0, -5), new THREE.Vector2(2.2, -5), new THREE.Vector2(2.2, 2), new THREE.Vector2(0.8, 5), new THREE.Vector2(0.8, 8), new THREE.Vector2(1.1, 8.2)]; return new THREE.LatheGeometry(points, 32); };

const CameraListener = () => { const { camera } = useThree(); const [listener] = useState(() => new THREE.AudioListener()); useEffect(() => { camera.add(listener); return () => camera.remove(listener); }, [camera, listener]); return null; };

const GiantFloatingBanner = ({ isBirthdayMode }) => {
  const bannerRef = useRef();
  const [msgIdx, setMsgIdx] = useState(0);
  const xPos = useRef(250);
  const speed = 25;

  // Al cambiar el modo, reseteamos el banner para mostrar el mensaje de "Mira arriba"
  useEffect(() => {
    if (isBirthdayMode) {
      setMsgIdx(0); 
      xPos.current = 150; // Lo ponemos cerca para que se lea rápido
    }
  }, [isBirthdayMode]);

  useFrame((state, delta) => {
    xPos.current -= speed * delta;
    if (xPos.current < -250) {
      xPos.current = 250;
      setMsgIdx((prev) => (prev + 1) % BIRTHDAY_MESSAGES.length);
    }
    if (bannerRef.current) {
      const yShift = Math.sin(state.clock.getElapsedTime() * 1.5) * 8;
      bannerRef.current.position.set(xPos.current, 20 + yShift, 40);
    }
  });

  return (
    <group ref={bannerRef}>
      <Html center distanceFactor={15}>
        <div className={`
          font-['Cinzel'] font-bold text-[10rem] md:text-[25rem] whitespace-nowrap select-none italic uppercase px-10
          ${isBirthdayMode ? 'banner-shimmer-gold' : 'banner-shimmer-cyan'}
        `}>
          {BIRTHDAY_MESSAGES[msgIdx]}
        </div>
      </Html>
    </group>
  );
};

const MemorialStar = ({ position, name, color, isBirthdayMode, audioUrl, isPlaying }) => {
  const flareRef = useRef(); const starTex = useMemo(() => createSuperFlareTexture(), []);
  useFrame(({ clock }) => { const t = clock.getElapsedTime(); const pulse = (isBirthdayMode ? 6 : 4) + Math.sin(t * 3) * 0.8; if (flareRef.current) { flareRef.current.scale.set(pulse * 6, pulse * pulse, 1); flareRef.current.rotation.z = t * 0.1; } });
  const activeColor = isBirthdayMode ? "#ffd700" : color;
  return ( <group position={position}><sprite ref={flareRef}><spriteMaterial map={starTex} color={activeColor} transparent blending={THREE.AdditiveBlending} opacity={1} /></sprite><pointLight intensity={isBirthdayMode ? 600 : 250} distance={100} color={activeColor} decay={1.5} />{isPlaying && audioUrl && (<Suspense fallback={null}><PositionalAudio url={audioUrl} distance={25} loop /></Suspense>)}<Html position={[0, -4, 0]} center><div className={`font-['Cinzel'] text-3xl md:text-5xl transition-all duration-1000 ${isBirthdayMode ? 'text-amber-200' : 'text-white'} opacity-90 whitespace-nowrap pointer-events-none drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]`}>{name}</div></Html></group> );
};

const WalkingPath = ({ type, count = 20, startPos, endPos, pathDelay = 0 }) => {
  const pawTex = useMemo(() => createPawTex(), []);
  const paws = useMemo(() => { const path = []; const dx = endPos[0] - startPos[0]; const dz = endPos[2] - startPos[2]; const baseRotation = Math.atan2(dx, dz); for (let i = 0; i < count; i++) { const t = i / (count - 1); let x = startPos[0] + t * dx; let z = startPos[2] + t * dz; let scale, currentStepDelay, offsetX, offsetZ; const side = i % 2 === 0 ? 1 : -1; if (type === 'bulldog') { scale = 4.5; offsetX = Math.cos(baseRotation) * side * 3.5; offsetZ = -Math.sin(baseRotation) * side * 3.5; currentStepDelay = i * 0.6; } else if (type === 'small') { scale = 2.2; offsetX = Math.cos(baseRotation) * side * 1.5; offsetZ = -Math.sin(baseRotation) * side * 1.5; currentStepDelay = i * 0.3; } else { scale = 1.5; offsetX = Math.cos(baseRotation) * side * 0.8; offsetZ = -Math.sin(baseRotation) * side * 0.8; currentStepDelay = i * 0.15; } path.push({ pos: [x + offsetX, -29.6, z + offsetZ], scale, rotation: baseRotation + (side * 0.1), stepDelay: currentStepDelay, pathDelay }); } return path; }, [type, count, startPos, endPos, pathDelay]);
  return paws.map((p, i) => { const ref = useRef(); useFrame(({ clock }) => { const loopingT = (clock.getElapsedTime() - p.pathDelay) % 12; const timeSinceStep = loopingT - p.stepDelay; let opacity = 0; if (timeSinceStep > 0 && timeSinceStep < 5) { if (timeSinceStep < 0.5) opacity = (timeSinceStep / 0.5) * (p.scale > 3 ? 0.5 : 0.3); else if (timeSinceStep > 3) opacity = ((5 - timeSinceStep) / 2) * (p.scale > 3 ? 0.5 : 0.3); else opacity = (p.scale > 3 ? 0.5 : 0.3); } if (ref.current) ref.current.opacity = opacity; }); return (<mesh key={i} position={p.pos} rotation={[-Math.PI / 2, 0, p.rotation + Math.PI]}><planeGeometry args={[p.scale, p.scale]} /><meshBasicMaterial ref={ref} map={pawTex} transparent opacity={0} color="#eeeeff" depthWrite={false} /></mesh>); });
};

const DynamicPhotoSlot = ({ position, initialIndex, delay, onSelect }) => {
  const [photoIndex, setPhotoIndex] = useState(initialIndex); useEffect(() => { const interval = setInterval(() => { setPhotoIndex((p) => (p + 1) % ESFERA_POOL.length); }, 15000 + (delay * 1000)); return () => clearInterval(interval); }, [delay]);
  const tex = useLoader(THREE.TextureLoader, ESFERA_POOL[photoIndex]);
  return (<Float speed={2}><group position={position} onPointerDown={(e) => { e.stopPropagation(); onSelect(ESFERA_POOL[photoIndex]); }}><mesh><sphereGeometry args={[4, 64, 64]} /><MeshTransmissionMaterial thickness={0.5} transmission={1} color="#aeeeee" /></mesh><mesh position={[0,0,0.1]}><circleGeometry args={[3.5, 32]} /><meshBasicMaterial map={tex} side={THREE.DoubleSide} transparent opacity={0.9} /></mesh></group></Float>);
};

const MessageBottle = ({ position, url, delay, onSelect }) => {
  const ref = useRef(); const tex = useLoader(THREE.TextureLoader, url); const geo = useMemo(() => createBottleGeometry(), []);
  useFrame((s) => { const t = s.clock.getElapsedTime(); if(ref.current) { ref.current.position.y = position[1] + Math.sin(t * 1 + delay) * 1.2; ref.current.rotation.y = t * 0.5 + delay; } });
  return (<Float speed={1.5}><group ref={ref} position={position} rotation={[Math.PI/2.2, 0, 0]} onPointerDown={(e) => { e.stopPropagation(); onSelect(url); }}><mesh geometry={geo}><MeshTransmissionMaterial thickness={1} transmission={1} ior={1.5} color="#cceeff" /></mesh><mesh position={[0, -1.2, 0]} rotation={[0, Math.PI/2, 0]}><cylinderGeometry args={[1.5, 1.5, 6, 32, 1, true]} /><meshBasicMaterial map={tex} side={THREE.DoubleSide} transparent opacity={0.9} /></mesh></group></Float>);
};

const TreasureChest = ({ position, url, onSelect }) => (
  <group position={position} onPointerDown={(e) => { e.stopPropagation(); onSelect(url); }}><mesh position={[0, -1, 0]}><boxGeometry args={[6, 3.5, 4]} /><meshStandardMaterial color="#5d3a1e" roughness={0.6} emissive="#3d2110" emissiveIntensity={0.4} /></mesh><mesh position={[0, 0.75, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[2, 2, 6, 32, 1, false, 0, Math.PI]} /><meshStandardMaterial color="#6d4a2e" roughness={0.6} emissive="#4d2b16" emissiveIntensity={0.4} /></mesh><mesh position={[0, 0.5, 2.1]}><boxGeometry args={[1.2, 1.8, 0.5]} /><meshStandardMaterial color="#ffd700" metalness={1} emissive="#ffd700" emissiveIntensity={0.5} /></mesh><pointLight position={[0, 2, 0]} intensity={50} color="#ffaa00" distance={25} /><Sparkles count={20} scale={10} size={4} speed={0.4} color="#ffff00" /></group>
);

const OceanContent = ({ isLowTide, setFocusedPhoto, isPlaying }) => {
  const treasureData = useMemo(() => { const shuffled = shuffleArray(COUPON_POOL); return shuffled.map((url, i) => { const isBottle = i < 6; const pos = isBottle ? [(Math.random() - 0.5) * 85, (Math.random() - 0.5) * 35, (Math.random() * -40) - 10] : [[-45, 0, 45, -35, 35, 0][i-6], -28, [-55, -60, -55, -30, -30, -40][i-6]]; return { url, pos, type: isBottle ? 'bottle' : 'chest', delay: Math.random() * 5 }; }); }, []);
  const color = isLowTide ? '#2a1a00' : '#001e36'; 
  return (
    <>
      <CameraListener /> <color attach="background" args={[color]} /> <fog attach="fog" args={[color, 10, 150]} /> <ambientLight intensity={isLowTide ? 2 : 1.5} /> 
      <TransitionFlash active={isLowTide} />
      
      {/* GUÍA HACIA LAS ESTRELLAS */}
      {isLowTide && <StellarGuideBeam active={isLowTide} />}
      
      <GiantFloatingBanner isBirthdayMode={isLowTide} />
      <group position={[0, 45, -45]}> 
        <MemorialStar position={[-35, 5, 0]} name="." color="#50ffb1" isBirthdayMode={isLowTide} audioUrl="/music/How_Do_I_Say_Goodbye.m4a" isPlaying={isPlaying} /> 
        <MemorialStar position={[35, 12, -10]} name="." color="#00e5ff" isBirthdayMode={isLowTide} audioUrl="/music/Monsters.m4a" isPlaying={isPlaying} /> 
        <MemorialStar position={[15, 20, -30]} name="." color="#ffffff" isBirthdayMode={isLowTide} audioUrl="/music/Abrazame_muy_fuerte.mp3" isPlaying={isPlaying} /> 
      </group>
      <Suspense fallback={null}> 
        <FloatingLanterns isVisible={isLowTide} />
        <Sparkles count={isLowTide ? 1200 : 600} scale={110} size={35} speed={isLowTide ? 1.5 : 0.7} color={isLowTide ? "#ffcc66" : "#ffffff"} />
        <WalkingPath type="bulldog" startPos={[50, 0, -60]} endPos={[-40, 0, 20]} count={22} pathDelay={0} />
        <WalkingPath type="small" startPos={[-45, 0, -50]} endPos={[35, 0, 10]} count={30} pathDelay={4} />
        <WalkingPath type="tiny" startPos={[20, 0, -65]} endPos={[-20, 0, 15]} count={40} pathDelay={8} />
        {SPHERE_SLOTS.map((s, i) => <DynamicPhotoSlot key={`s-${i}`} position={s.pos} initialIndex={i % ESFERA_POOL.length} delay={s.delay} onSelect={setFocusedPhoto} />)}
        {treasureData.map((item, i) => item.type === 'bottle' ? <MessageBottle key={`b-${i}`} position={item.pos} url={item.url} delay={item.delay} onSelect={setFocusedPhoto} /> : <TreasureChest key={`c-${i}`} position={item.pos} url={item.url} onSelect={setFocusedPhoto} />)}
      </Suspense> 
      <OrbitControls enablePan={false} autoRotate autoRotateSpeed={0.3} maxDistance={95} minDistance={30} /> <Environment preset="night" /> 
    </>
  );
};

export const Scene3D = ({ isLowTide, setIsLowTide, setFocusedPhoto, focusedPhoto, showLetter }) => {
  const [isPlaying, setIsPlaying] = useState(false); const [trackIndex, setTrackIndex] = useState(0); const audioRef = useRef(null); const hasInteracted = useRef(false);
  const shuffledPlaylist = useMemo(() => { const mananitas = RAW_PLAYLIST.find(t => t.url.includes('mañanitas')); const others = RAW_PLAYLIST.filter(t => !t.url.includes('mañanitas')); return [mananitas, ...shuffleArray(others)]; }, []);
  useEffect(() => { if (!audioRef.current) { audioRef.current = new Audio(shuffledPlaylist[trackIndex].url); audioRef.current.onended = () => handleNext(); } else { audioRef.current.pause(); audioRef.current.src = shuffledPlaylist[trackIndex].url; audioRef.current.load(); } if (isPlaying) audioRef.current.play().catch(() => setIsPlaying(false)); }, [trackIndex, shuffledPlaylist]);
  useEffect(() => { if (isPlaying) audioRef.current?.play().catch(() => setIsPlaying(false)); else audioRef.current?.pause(); }, [isPlaying]);
  useEffect(() => { const unlock = () => { if (!hasInteracted.current) { hasInteracted.current = true; setIsPlaying(true); } window.removeEventListener('click', unlock); window.removeEventListener('touchstart', unlock); }; window.addEventListener('click', unlock); window.addEventListener('touchstart', unlock); return () => { window.removeEventListener('click', unlock); window.removeEventListener('touchstart', unlock); }; }, []);
  const togglePlay = (e) => { e.stopPropagation(); setIsPlaying(!isPlaying); };
  const handleNext = () => { setTrackIndex(prev => (prev + 1) % shuffledPlaylist.length); if (!isPlaying) setIsPlaying(true); };
  const handlePrev = () => { setTrackIndex(prev => (prev - 1 + shuffledPlaylist.length) % shuffledPlaylist.length); if (!isPlaying) setIsPlaying(true); };

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#001e36]">
      <style>{`
        @keyframes shimmer-move { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        .banner-shimmer-cyan { background: linear-gradient(90deg, rgba(255,255,255,0.1) 20%, rgba(34,211,238,0.9) 50%, rgba(255,255,255,0.1) 80%); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: shimmer-move 4s infinite linear; filter: drop-shadow(0 0 15px rgba(34,211,238,0.4)); }
        .banner-shimmer-gold { background: linear-gradient(90deg, rgba(251,191,36,0.3) 20%, rgba(255,255,255,1) 50%, rgba(251,191,36,0.3) 80%); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: shimmer-move 3s infinite linear; filter: drop-shadow(0 0 20px rgba(251,191,36,0.6)); }
      `}</style>

      <div className={`absolute inset-0 pointer-events-none z-50 flex flex-col justify-between transition-all duration-700 ${showLetter || focusedPhoto ? 'opacity-0' : 'opacity-100'}`}>
        <div className="p-3 md:p-10 flex flex-row justify-between items-start gap-2">
          <div className="flex flex-col gap-2 pointer-events-auto max-w-[65%]">
            <div className={`transition-all duration-1000 p-4 md:p-7 rounded-[1.8rem] border shadow-2xl scale-95 md:scale-100 origin-top-left ${isLowTide ? 'bg-amber-950/70 border-amber-500/50 shadow-amber-500/20' : 'bg-black/70 border-white/20'}`}>
              <h1 className="text-white text-3xl md:text-5xl font-['Cinzel'] tracking-[0.2em] leading-none text-center">Iris Wendy</h1>
              <p className={`text-[10px] md:text-[11px] font-['Montserrat'] tracking-[0.3em] mt-2 uppercase font-black text-center transition-colors ${isLowTide ? 'text-amber-400' : 'text-cyan-300'}`}>Refugio 2026</p>
              <div className="flex flex-col gap-4 mt-4 border-t border-white/10 pt-3 text-center">
                  <span className={`text-[11px] font-['Montserrat'] uppercase font-bold tracking-widest truncate max-w-[140px] md:max-w-[200px] mx-auto transition-all duration-500 ${isPlaying ? (isLowTide ? 'text-amber-300 drop-shadow-[0_0_8px_gold]' : 'text-cyan-300 drop-shadow-[0_0_8px_cyan]') : 'text-white/40 italic'}`}>
                      {isPlaying ? `-> ${shuffledPlaylist[trackIndex].title}` : `Pausado`}
                  </span>
                  <div className="flex items-center justify-center gap-4 md:gap-6">
                    <button onClick={handlePrev} className="text-white/40 hover:text-amber-400 text-2xl transition-all p-2"><FiSkipBack /></button>
                    <button onClick={togglePlay} className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${isPlaying ? (isLowTide ? 'bg-amber-500/30 border-amber-400 scale-110 shadow-[0_0_15px_rgba(255,191,0,0.4)]' : 'bg-cyan-500/30 border-cyan-400 scale-110 shadow-[0_0_15px_rgba(34,211,238,0.4)]') : 'bg-white/10 border-white/30'}`}>
                      {isPlaying ? <FiPause className={`${isLowTide ? 'text-amber-300' : 'text-cyan-300'} text-2xl md:text-3xl`} /> : <FiPlay className="text-white text-2xl md:text-3xl ml-1" />}
                    </button>
                    <button onClick={handleNext} className="text-white/40 hover:text-amber-400 text-2xl transition-all p-2"><FiSkipForward /></button>
                  </div>
              </div>
            </div>
          </div>
          <div className={`pointer-events-auto transition-all duration-1000 p-4 md:p-7 rounded-[1.8rem] border shadow-2xl text-right scale-95 md:scale-100 origin-top-right ${isLowTide ? 'bg-amber-950/70 border-amber-500/50 shadow-amber-500/20' : 'bg-black/70 border-white/20'}`}>
              <span className={`text-[10px] font-['Montserrat'] tracking-[0.2em] block uppercase font-black mb-1 ${isLowTide ? 'text-amber-400' : 'text-cyan-300'}`}>Amaneceres</span>
              <span className="text-white text-5xl md:text-7xl font-['Montserrat'] font-extrabold leading-none drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">6,059</span>
          </div>
        </div>

        <div className="p-6 md:p-12 flex justify-between items-end">
          <div className="pointer-events-auto">
             <button onClick={() => setIsLowTide(!isLowTide)} className={`w-24 h-24 rounded-full border-4 flex items-center justify-center transition-all duration-1000 shadow-2xl ${isLowTide ? 'bg-amber-500/80 border-amber-200 scale-110 shadow-amber-500/50' : 'bg-black/40 border-cyan-500/50 hover:bg-cyan-500/20'}`}>
               <TbZodiacAquarius className={`text-5xl transition-all duration-700 ${isLowTide ? 'text-amber-100 rotate-180 drop-shadow-[0_0_20px_gold]' : 'text-cyan-400 drop-shadow-[0_0_10px_cyan]'}`} />
             </button>
          </div>
          <div className="flex flex-col items-end gap-10 pointer-events-auto pb-24 md:pb-28">
            <button 
              onClick={(e) => { e.stopPropagation(); alert("Tu inteligencia es la fosa más profunda y tu humor ácido es el que nos salva siempre."); }} 
              className={`w-16 h-16 rounded-full border-2 flex items-center justify-center shadow-lg hover:scale-110 group transition-all duration-1000 ${isLowTide ? 'bg-amber-600/40 border-amber-400/50' : 'bg-cyan-600/40 border-white/30'}`}
            >
              <TbRipple className={`text-4xl transition-colors duration-1000 ${isLowTide ? 'text-amber-200' : 'text-cyan-300'} group-hover:text-white group-hover:drop-shadow-[0_0_15px_white]`} />
            </button>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 75], fov: 45 }} gl={{ antialias: true, alpha: true }}>
            <Suspense fallback={null}><OceanContent isLowTide={isLowTide} setFocusedPhoto={setFocusedPhoto} isPlaying={isPlaying} /></Suspense>
        </Canvas>
      </div>
    </div>
  );
};