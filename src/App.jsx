import { useState } from 'react'; 
import { Scene3D } from './components/3d/Scene3D';
import { MysticLetter } from './components/ui/MysticLetter';
import { Chatbot } from './components/ui/Chatbot';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  const [auth, setAuth] = useState(false);
  const [pass, setPass] = useState("");
  const [showLetter, setShowLetter] = useState(false);
  const [isLowTide, setIsLowTide] = useState(false);
  const [focusedPhoto, setFocusedPhoto] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    if (pass === "310623") { setAuth(true); setShowLetter(true); } else { setPass(""); }
  };

  if (!auth) {
    return (
      <div className="w-full h-screen bg-[#00040a] flex flex-col items-center justify-center font-['Caveat'] text-white text-center">
        <div className="text-9xl mb-8 animate-pulse drop-shadow-[0_0_20px_cyan]">⚓</div>
        <h1 className="text-6xl mb-10 tracking-[0.3em] text-cyan-100 uppercase font-bold px-4">Santuario</h1>
        <form onSubmit={handleLogin} className="w-80 space-y-8 px-6">
          <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="• • • • • •" className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-[2.5rem] text-center text-5xl tracking-[0.3em] focus:outline-none focus:border-cyan-400 transition-all shadow-2xl" autoFocus />
          <button type="submit" className="w-full py-4 bg-cyan-500/20 rounded-[2.5rem] border border-cyan-400/40 text-4xl font-bold tracking-widest hover:bg-cyan-500/40 transition-all uppercase shadow-lg">Abrir</button>
        </form>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black select-none font-['Caveat']">
      
      {/* 1. EL OCÉANO 3D */}
      <Scene3D isLowTide={isLowTide} setFocusedPhoto={setFocusedPhoto} />
      
      {showLetter && <MysticLetter onClose={() => setShowLetter(false)} />}

      {/* 2. OVERLAY DE FOTO ENFOCADA (Lightbox Pro) */}
      <AnimatePresence>
        {focusedPhoto && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 md:p-12 bg-black/80 backdrop-blur-md pointer-events-auto"
          >
            {/* Contenedor de la imagen que respeta el aspect ratio */}
            <motion.div 
              initial={{ scale: 0.5, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 100 }}
              className="relative max-w-5xl w-full h-full flex items-center justify-center overflow-hidden rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(255,255,255,0.1)] bg-white/5"
            >
              <img 
                src={focusedPhoto} 
                alt="Recuerdo" 
                className="w-full h-full object-contain p-2"
              />
            </motion.div>

            {/* Botón Regresar */}
            <button 
              onClick={() => setFocusedPhoto(null)}
              className="mt-8 px-12 py-4 bg-cyan-500/20 border-2 border-cyan-400/50 text-white rounded-full text-4xl hover:bg-cyan-500/40 transition-all shadow-2xl active:scale-95"
            >
              Regresar al Océano
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. INTERFAZ HUD */}
      {!showLetter && (
        <div className={`absolute inset-0 pointer-events-none z-50 flex flex-col justify-between p-6 md:p-12 transition-all duration-700 ${focusedPhoto ? 'opacity-0' : 'opacity-100'}`}>
          
          <div className="flex justify-between items-start w-full">
            <div className="bg-black/50 p-6 rounded-[2.5rem] backdrop-blur-xl border border-white/10">
              <h2 className="text-4xl text-white leading-none">Iris Wendy</h2>
              <p className="font-sans text-[9px] uppercase tracking-[0.5em] text-cyan-400 mt-3 font-bold text-center">Refugio 2025</p>
            </div>
            <div className="bg-black/50 p-6 rounded-[2.5rem] backdrop-blur-xl border border-white/10 text-right">
              <p className="text-cyan-400 text-lg opacity-80 leading-none">Amaneceres</p>
              <p className="text-5xl text-white">6,059</p>
            </div>
          </div>

          <div className="flex justify-between items-end w-full pb-6 px-4">
            <div className="pointer-events-auto">
               <button onClick={() => setIsLowTide(!isLowTide)} className={`w-24 h-24 rounded-full border-4 flex items-center justify-center transition-all duration-1000 shadow-2xl ${isLowTide ? 'bg-amber-400 border-white scale-110 shadow-amber-500' : 'bg-black/40 border-cyan-500/50'}`}>
                 <span className="text-6xl">{isLowTide ? '✨' : '⚓'}</span>
               </button>
            </div>

            <div className="flex flex-col items-end gap-10 pointer-events-auto">
              <Chatbot />
              <button 
                onClick={() => { alert("Tu inteligencia es la fosa más profunda y tu humor ácido es el que nos salva siempre."); }} 
                className="w-20 h-20 rounded-full bg-indigo-600/40 border-4 border-white/20 flex items-center justify-center shadow-2xl hover:scale-110"
              >
                <span className="text-6xl filter drop-shadow-[0_0_10px_cyan]">🐚</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}