import React, { useRef, Suspense, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { 
  OrbitControls, Sparkles, Float, MeshTransmissionMaterial, 
  Environment, Html, PositionalAudio
} from '@react-three/drei';
import * as THREE from 'three';

// --- DATA POOLS ---
const RAW_PLAYLIST = [
  { title: "Las Mañanitas 🎂", url: "/music/mañanitas.m4a" },
  { title: "Melendi-Leonel_Garcia", url: "/music/Para_Empezar.m4a" },
  { title: "James Blunt", url: "/music/Monsters.m4a" },
  { title: "Dean Lewis", url: "/music/How_Do_I_Say_Goodbye.m4a" },
  { title: "Juan Gabriel", url: "/music/Abrazame_muy_fuerte.mp3" },
  { title: "Carlos Rivera", url: "/music/Te_Esperaba.m4a" },
  { title: "Carlos Rivera", url: "/music/Gracias_a_Ti.m4a" },
  { title: "Carlos Rivera", url: "/music/Fascinacion.mp3" },
  { title: "Camilo", url: "/music/Favorito.m4a" },
  { title: "Camilo Sesto", url: "/music/Amor_de_Mujer.m4a" },
  { title: "Camilo Sesto", url: "/music/Solo_el_Cielo_y_Tu.mp3" },
  { title: "Ricardo Montaner", url: "/music/El_Poder_de_Tu_Amor.m4a" },
  { title: "Bronco-RicardoMontaner", url: "/music/La_Cima_del_Cielo.mp3" },
  { title: "Pablo Alboran", url: "/music/Solamente_Tu.mp3" },
  { title: "Luz de dia", url: "https://www.dropbox.com/scl/fi/p5bmy0sqpavvbonq8rp9w/Los_Enanitos_Verdes_-_Luz_de_Dia.mp3?rlkey=gb518qnj0d8fdb12085bgqayy&st=9e0hb9xb&dl=0&raw=1" },
  { title: "Tu refugio", url: "https://www.dropbox.com/scl/fi/escpm2lnl4ukcm4exqalz/Pablo_Alboran_-_Tu_refugio.mp3?rlkey=1qlp19177h7754815z7n1tm7m&st=r3efsv2y&dl=0&raw=1" },
  { title: "Siempre", url: "https://www.dropbox.com/scl/fi/qcb32l3rfii8r13qdbzpx/Il_Divo_-_Siempre.mp3?rlkey=9lrnu9i5aphrywllwwjn2lb83&st=u8t0tu1m&dl=0&raw=1" },
  { title: "Prometo", url: "https://www.dropbox.com/scl/fi/pydbbgauuy85r1jsrjjui/Fonseca_-_Prometo.mp3?rlkey=hs2rj0fxbvkpuhfjzikmeexsu&st=6vgr0ze6&dl=0&raw=1" },
  { title: "Resumiendo", url: "https://www.dropbox.com/scl/fi/fpuoiubwq8x6ljt3p5nd1/Ricardo_Montaner_-_Resumiendo.mp3?rlkey=5c5bu8j3vgl8o8y2lf3f46z56&st=alv7umbg&dl=0&raw=1" },
  { title: "Carlos rivera", url: "https://www.dropbox.com/scl/fi/rvn3xf1rczhw066eqf80x/Carlos_Rivera_-_La_Luna_del_Cielo.mp3?rlkey=kl30bbhv1ouapxz4fpmh65cu4&st=fgh6vyrw&dl=0&raw=1" }
];

const BIRTHDAY_MESSAGES = [
  "¡FELIZ CUMPLEAÑOS IRIS, AMOR MIO! 🎂",
  "¡FELICIDADES WENDY HERMOSA! ✨",
  "¡TE AMO MUCHISIMO! ❤️",
  "¡ERES MI TODO! 🌹",
  "¡POR MIL AMANECERES MÁS! 🌅",
  "❤️ ME ENCANTAS!!!! ❤️",
  "¡ERES MI SUEÑO REALIDAD! 💫"
];

const ESFERA_POOL = ["/photos/esferas/00.webp", "/photos/esferas/01.webp", "/photos/esferas/02.webp", "/photos/esferas/03.webp", "/photos/esferas/04.webp", "/photos/esferas/05.webp", "/photos/esferas/06.webp"];
const COUPON_POOL = ["/photos/cupones/c01.webp", "/photos/cupones/c02.webp", "/photos/cupones/c03.webp", "/photos/cupones/c04.webp", "/photos/cupones/c05.webp", "/photos/cupones/c06.webp", "/photos/cupones/c07.webp", "/photos/cupones/c08.webp", "/photos/cupones/c09.webp", "/photos/cupones/c10.webp", "/photos/cupones/c11.webp", "/photos/cupones/c12.webp"];
const SPHERE_SLOTS = [{ pos: [0, 5, 0], delay: 0 }, { pos: [-18, 12, -10], delay: 2 }, { pos: [16, -8, -10], delay: 4 }, { pos: [20, 16, -25], delay: 1 }, { pos: [-20, -12, -25], delay: 3 }];

// --- UTILS ---
const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

const createPawTex = () => {
  const canvas = document.createElement('canvas'); canvas.width = 128; canvas.height = 128;
  const ctx = canvas.getContext('2d'); ctx.fillStyle = 'white';
  ctx.beginPath(); ctx.ellipse(64, 85, 28, 22, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(32, 50, 12, 16, -0.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(54, 35, 12, 16, -0.2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(78, 35, 12, 16, 0.2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(100, 50, 12, 16, 0.5, 0, Math.PI * 2); ctx.fill();
  return new THREE.CanvasTexture(canvas);
};

const createSuperFlareTexture = () => {
  const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 512;
  const ctx = canvas.getContext('2d'); const center = 256;
  const glow = ctx.createRadialGradient(center, center, 0, center, center, 250);
  glow.addColorStop(0, 'rgba(255, 255, 255, 1)'); glow.addColorStop(0.3, 'rgba(255, 255, 255, 0.4)'); glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = glow; ctx.fillRect(0, 0, 512, 512);
  const drawRay = (w, l, angle) => {
    ctx.save(); ctx.translate(center, center); ctx.rotate(angle);
    const grad = ctx.createLinearGradient(-l/2, 0, l/2, 0);
    grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.9)'); grad.addColorStop(0, 'transparent'); grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad; ctx.fillRect(-l/2, -w/2, l, w); ctx.restore();
  };
  for (let i = 0; i < 12; i++) drawRay(i % 3 === 0 ? 6 : 3, 512, (Math.PI * 2 / 12) * i);
  return new THREE.CanvasTexture(canvas);
};

const createBottleGeometry = () => {
  const points = [new THREE.Vector2(0, -5), new THREE.Vector2(2.2, -5), new THREE.Vector2(2.2, 2), new THREE.Vector2(0.8, 5), new THREE.Vector2(0.8, 8), new THREE.Vector2(1.1, 8.2)];
  return new THREE.LatheGeometry(points, 32);
};

// --- COMPONENTES ---

const CameraListener = () => {
  const { camera } = useThree();
  const [listener] = useState(() => new THREE.AudioListener());
  useEffect(() => { camera.add(listener); return () => camera.remove(listener); }, [camera, listener]);
  return null;
};

// Pancarta Colosal Adaptable
const GiantFloatingBanner = () => {
  const bannerRef = useRef();
  const [msgIdx, setMsgIdx] = useState(0);
  const xPos = useRef(250); 
  const speed = 25; 
  useFrame((state, delta) => {
    xPos.current -= speed * delta;
    if (xPos.current < -250) { xPos.current = 250; setMsgIdx((prev) => (prev + 1) % BIRTHDAY_MESSAGES.length); }
    if (bannerRef.current) {
      const yShift = Math.sin(state.clock.getElapsedTime() * 1.5) * 8;
      bannerRef.current.position.set(xPos.current, 20 + yShift, 40); 
    }
  });
  return (
    <group ref={bannerRef}>
      <Html center distanceFactor={15}>
        <div className="font-['Caveat'] text-white text-[10rem] md:text-[25rem] whitespace-nowrap select-none drop-shadow-[0_0_60px_rgba(255,255,255,1)] opacity-95 italic uppercase pointer-events-none px-10">
          {BIRTHDAY_MESSAGES[msgIdx]}
        </div>
      </Html>
    </group>
  );
};

const MemorialStar = ({ position, name, color, isLowTide, audioUrl, isPlaying }) => {
  const flareRef = useRef();
  const starTex = useMemo(() => createSuperFlareTexture(), []);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const pulse = (isLowTide ? 6 : 4) + Math.sin(t * 3) * 0.8;
    if (flareRef.current) { flareRef.current.scale.set(pulse * 6, pulse * 6, 1); flareRef.current.rotation.z = t * 0.1; }
  });
  return (
    <group position={position}>
      <sprite ref={flareRef}><spriteMaterial map={starTex} color={color} transparent blending={THREE.AdditiveBlending} opacity={1} /></sprite>
      <pointLight intensity={isLowTide ? 600 : 250} distance={100} color={color} decay={1.5} />
      {isPlaying && audioUrl && (<Suspense fallback={null}><PositionalAudio url={audioUrl} distance={25} loop /></Suspense>)}
      <Html position={[0, -4, 0]} center><div className="font-['Caveat'] text-3xl md:text-5xl text-white opacity-90 whitespace-nowrap pointer-events-none drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]">{name}</div></Html>
    </group>
  );
};

const WalkingPath = ({ type, count = 20, startPos, endPos, pathDelay = 0 }) => {
  const pawTex = useMemo(() => createPawTex(), []);
  const paws = useMemo(() => {
    const path = []; const dx = endPos[0] - startPos[0]; const dz = endPos[2] - startPos[2]; const baseRotation = Math.atan2(dx, dz);
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1); let x = startPos[0] + t * dx; let z = startPos[2] + t * dz;
      let scale, currentStepDelay, offsetX, offsetZ;
      const side = i % 2 === 0 ? 1 : -1; 
      if (type === 'bulldog') { scale = 4.5; offsetX = Math.cos(baseRotation) * side * 3.5; offsetZ = -Math.sin(baseRotation) * side * 3.5; currentStepDelay = i * 0.6; }
      else if (type === 'small') { scale = 2.2; offsetX = Math.cos(baseRotation) * side * 1.5; offsetZ = -Math.sin(baseRotation) * side * 1.5; currentStepDelay = i * 0.3; }
      else { scale = 1.5; offsetX = Math.cos(baseRotation) * side * 0.8; offsetZ = -Math.sin(baseRotation) * side * 0.8; currentStepDelay = i * 0.15; }
      path.push({ pos: [x + offsetX, -29.6, z + offsetZ], scale, rotation: baseRotation + (side * 0.1), stepDelay: currentStepDelay, pathDelay });
    }
    return path;
  }, [type, count, startPos, endPos, pathDelay]);
  return paws.map((p, i) => {
    const ref = useRef();
    useFrame(({ clock }) => {
      const loopingT = (clock.getElapsedTime() - p.pathDelay) % 12;
      const timeSinceStep = loopingT - p.stepDelay;
      let opacity = 0;
      if (timeSinceStep > 0 && timeSinceStep < 5) {
          if (timeSinceStep < 0.5) opacity = (timeSinceStep / 0.5) * (p.scale > 3 ? 0.5 : 0.3);
          else if (timeSinceStep > 3) opacity = ((5 - timeSinceStep) / 2) * (p.scale > 3 ? 0.5 : 0.3);
          else opacity = (p.scale > 3 ? 0.5 : 0.3);
      }
      if (ref.current) ref.current.opacity = opacity;
    });
    return (<mesh key={i} position={p.pos} rotation={[-Math.PI / 2, 0, p.rotation + Math.PI]}><planeGeometry args={[p.scale, p.scale]} /><meshBasicMaterial ref={ref} map={pawTex} transparent opacity={0} color="#eeeeff" depthWrite={false} /></mesh>);
  });
};

const DynamicPhotoSlot = ({ position, initialIndex, delay, onSelect }) => {
  const [photoIndex, setPhotoIndex] = useState(initialIndex);
  useEffect(() => { const interval = setInterval(() => { setPhotoIndex((p) => (p + 1) % ESFERA_POOL.length); }, 15000 + (delay * 1000)); return () => clearInterval(interval); }, [delay]);
  const tex = useLoader(THREE.TextureLoader, ESFERA_POOL[photoIndex]);
  return (<Float speed={2}><group position={position} onPointerDown={(e) => { e.stopPropagation(); onSelect(ESFERA_POOL[photoIndex]); }}><mesh><sphereGeometry args={[4, 64, 64]} /><MeshTransmissionMaterial thickness={0.5} transmission={1} color="#aeeeee" /></mesh><mesh><circleGeometry args={[3.5, 32]} /><meshBasicMaterial map={tex} side={THREE.DoubleSide} transparent opacity={0.9} /></mesh></group></Float>);
};

const MessageBottle = ({ position, url, delay, onSelect }) => {
  const ref = useRef(); const tex = useLoader(THREE.TextureLoader, url); const geo = useMemo(() => createBottleGeometry(), []);
  useFrame((s) => { const t = s.clock.getElapsedTime(); ref.current.position.y = position[1] + Math.sin(t * 1 + delay) * 1.2; ref.current.rotation.y = t * 0.5 + delay; });
  return (<Float speed={1.5}><group ref={ref} position={position} rotation={[Math.PI/2.2, 0, 0]} onPointerDown={(e) => { e.stopPropagation(); onSelect(url); }}><mesh geometry={geo}><MeshTransmissionMaterial thickness={1} transmission={1} ior={1.5} color="#cceeff" /></mesh><mesh position={[0, -1.2, 0]} rotation={[0, Math.PI/2, 0]}><cylinderGeometry args={[1.5, 1.5, 6, 32, 1, true]} /><meshBasicMaterial map={tex} side={THREE.DoubleSide} transparent opacity={0.9} /></mesh></group></Float>);
};

const TreasureChest = ({ position, url, onSelect }) => (
  <group position={position} onPointerDown={(e) => { e.stopPropagation(); onSelect(url); }}><mesh position={[0, -1, 0]}><boxGeometry args={[6, 3.5, 4]} /><meshStandardMaterial color="#5d3a1e" roughness={0.6} emissive="#3d2110" emissiveIntensity={0.4} /></mesh><mesh position={[0, 0.75, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[2, 2, 6, 32, 1, false, 0, Math.PI]} /><meshStandardMaterial color="#6d4a2e" roughness={0.6} emissive="#4d2b16" emissiveIntensity={0.4} /></mesh><mesh position={[0, 0.5, 2.1]}><boxGeometry args={[1.2, 1.8, 0.5]} /><meshStandardMaterial color="#ffd700" metalness={1} emissive="#ffd700" emissiveIntensity={0.5} /></mesh><pointLight position={[0, 2, 0]} intensity={50} color="#ffaa00" distance={25} /><Sparkles count={20} scale={10} size={4} speed={0.4} color="#ffff00" /></group>
);

const OceanContent = ({ isLowTide, setFocusedPhoto, isPlaying }) => {
  const treasureData = useMemo(() => {
    const shuffled = shuffleArray(COUPON_POOL);
    return shuffled.map((url, i) => {
      const isBottle = i < 6;
      const pos = isBottle ? [(Math.random() - 0.5) * 85, (Math.random() - 0.5) * 30, (Math.random() * -40) - 10] : [[-45, 0, 45, -35, 35, 0][i-6], -28, [-55, -60, -55, -30, -30, -40][i-6]];
      return { url, pos, type: isBottle ? 'bottle' : 'chest', delay: Math.random() * 5 };
    });
  }, []);

  const color = isLowTide ? '#2a1a00' : '#001e36';
  return (
    <>
      <CameraListener />
      <color attach="background" args={[color]} />
      <fog attach="fog" args={[color, 10, 150]} />
      <ambientLight intensity={1.5} />
      <GiantFloatingBanner />
      <group position={[0, 45, -45]}>
        <MemorialStar position={[-35, 5, 0]} name="." color="#50ffb1" isLowTide={isLowTide} audioUrl="/music/How_Do_I_Say_Goodbye.m4a" isPlaying={isPlaying} />
        <MemorialStar position={[35, 12, -10]} name="." color="#00e5ff" isLowTide={isLowTide} audioUrl="/music/Monsters.m4a" isPlaying={isPlaying} />
        <MemorialStar position={[15, 20, -30]} name="." color="#ffffff" isLowTide={isLowTide} audioUrl="/music/Abrazame_muy_fuerte.mp3" isPlaying={isPlaying} />
      </group>
      <Suspense fallback={null}>
        <Sparkles count={600} scale={110} size={35} speed={0.7} />
        <WalkingPath type="bulldog" startPos={[50, 0, -60]} endPos={[-40, 0, 20]} count={22} pathDelay={0} />
        <WalkingPath type="small" startPos={[-45, 0, -50]} endPos={[35, 0, 10]} count={30} pathDelay={4} />
        <WalkingPath type="tiny" startPos={[20, 0, -65]} endPos={[-20, 0, 15]} count={40} pathDelay={8} />
        {SPHERE_SLOTS.map((s, i) => <DynamicPhotoSlot key={`s-${i}`} position={s.pos} initialIndex={i % ESFERA_POOL.length} delay={s.delay} onSelect={setFocusedPhoto} />)}
        {treasureData.map((item, i) => item.type === 'bottle' ? <MessageBottle key={`b-${i}`} position={item.pos} url={item.url} delay={item.delay} onSelect={setFocusedPhoto} /> : <TreasureChest key={`c-${i}`} position={item.pos} url={item.url} onSelect={setFocusedPhoto} />)}
      </Suspense>
      <OrbitControls enablePan={false} autoRotate autoRotateSpeed={0.3} maxDistance={95} minDistance={30} />
      <Environment preset="night" />
    </>
  );
};

export const Scene3D = ({ isLowTide, setFocusedPhoto }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const audioRef = useRef(null);
  const hasInteracted = useRef(false);
  
  const shuffledPlaylist = useMemo(() => {
    const mananitas = RAW_PLAYLIST.find(t => t.url.includes('mañanitas'));
    const others = RAW_PLAYLIST.filter(t => !t.url.includes('mañanitas'));
    return [mananitas, ...shuffleArray(others)];
  }, []);

  // Lógica de audio corregida: Solo se desbloquea una vez y no interfiere al pausar
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(shuffledPlaylist[trackIndex].url);
      audioRef.current.onended = () => handleNext();
    } else {
      audioRef.current.src = shuffledPlaylist[trackIndex].url;
    }
    if (isPlaying) audioRef.current.play().catch(() => setIsPlaying(false));
  }, [trackIndex, shuffledPlaylist]);

  useEffect(() => {
    if (isPlaying) audioRef.current?.play().catch(() => setIsPlaying(false));
    else audioRef.current?.pause();
  }, [isPlaying]);

  // DESBLOQUEADOR GLOBAL ÚNICO (No reactivo al estado para no romper el pause)
  useEffect(() => {
    const unlock = () => {
      if (!hasInteracted.current) {
        hasInteracted.current = true;
        setIsPlaying(true);
      }
      window.removeEventListener('click', unlock);
      window.removeEventListener('touchstart', unlock);
    };
    window.addEventListener('click', unlock);
    window.addEventListener('touchstart', unlock);
    return () => { window.removeEventListener('click', unlock); window.removeEventListener('touchstart', unlock); };
  }, []);

  const togglePlay = (e) => { e.stopPropagation(); setIsPlaying(!isPlaying); };
  const handleNext = () => setTrackIndex(prev => (prev + 1) % shuffledPlaylist.length);
  const handlePrev = () => setTrackIndex(prev => (prev - 1 + shuffledPlaylist.length) % shuffledPlaylist.length);

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#001e36]">
      {/* UI SUPERIOR MEJORADA PARA MÓVIL */}
      <div className="absolute top-0 left-0 w-full z-50 pointer-events-none p-3 md:p-10 flex flex-row justify-between items-start gap-2">
        <div className="flex flex-col gap-2 pointer-events-auto max-w-[65%]">
          <div className="bg-black/70 backdrop-blur-3xl p-4 md:p-7 rounded-[1.8rem] md:rounded-[2.5rem] border border-white/20 shadow-2xl scale-95 md:scale-100 origin-top-left">
            <h1 className="text-white text-3xl md:text-5xl font-['Caveat'] tracking-wider leading-none">Iris Wendy</h1>
            <p className="text-cyan-300 text-[10px] md:text-[11px] tracking-[0.2em] mt-1 uppercase font-black">Santuario Oceánico</p>
            <div className="flex flex-col gap-3 mt-4 border-t border-white/10 pt-3">
                <span className="text-white/60 text-[9px] md:text-[11px] uppercase font-bold tracking-tighter truncate max-w-[140px] md:max-w-[200px]">
                    {isPlaying ? `Escuchando: ${shuffledPlaylist[trackIndex].title}` : 'Recuerdos en Silencio'}
                </span>
                <div className="flex items-center gap-4 md:gap-6">
                  <button onClick={handlePrev} className="text-white/40 hover:text-cyan-400 text-2xl p-2 transition-all">«</button>
                  <button onClick={togglePlay} className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-500 shadow-xl border-2 ${isPlaying ? 'bg-cyan-500/20 border-cyan-400 scale-110' : 'bg-white/10 border-white/30'}`}>
                    {isPlaying ? <span className="text-cyan-300 text-2xl md:text-3xl">⏸</span> : <span className="text-white text-2xl md:text-3xl ml-1">▶</span>}
                  </button>
                  <button onClick={handleNext} className="text-white/40 hover:text-cyan-400 text-2xl p-2 transition-all">»</button>
                </div>
            </div>
          </div>
        </div>
        <div className="pointer-events-auto bg-black/70 backdrop-blur-3xl p-4 md:p-7 rounded-[1.8rem] md:rounded-[2.5rem] border border-white/20 shadow-2xl text-right scale-95 md:scale-100 origin-top-right">
            <span className="text-cyan-300 text-[10px] md:text-[11px] tracking-[0.2em] block uppercase font-black mb-1">Amaneceres</span>
            <span className="text-white text-5xl md:text-7xl font-['Caveat'] leading-none">6,059</span>
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