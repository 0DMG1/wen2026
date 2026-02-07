import { useState } from 'react'; 
import { Scene3D } from './components/3d/Scene3D';
import { MysticLetter } from './components/ui/MysticLetter';
import { Chatbot } from './components/ui/Chatbot';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  const [auth, setAuth] = useState(false);
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [isLowTide, setIsLowTide] = useState(false);
  const [focusedPhoto, setFocusedPhoto] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    if (pass === "310623") { 
      setAuth(true); setShowLetter(true); setError(false);
    } else { 
      setError(true); setPass(""); setTimeout(() => setError(false), 2000);
    }
  };

  if (!auth) {
    return (
      <div className="w-full h-screen bg-[#00040a] flex flex-col items-center justify-center font-['Cinzel'] text-white text-center p-4">
        <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-9xl mb-8 animate-pulse drop-shadow-[0_0_20px_cyan]">⚓</motion.div>
        <h1 className="text-5xl mb-10 tracking-[0.3em] font-bold uppercase">Santuario</h1>
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-6 px-6">
          <input 
            type="password" value={pass} onChange={(e) => setPass(e.target.value)} 
            placeholder="• • • • • •" 
            className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-[2.5rem] text-center text-5xl font-['Montserrat'] focus:outline-none focus:border-cyan-400 transition-all" 
          />
          <button type="submit" className="w-full py-4 rounded-[2.5rem] border border-cyan-400/40 bg-cyan-500/20 text-3xl font-bold uppercase hover:bg-cyan-500/40 transition-all">
            Entrar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black select-none">
      {/* 1. EL OCÉANO 3D */}
      <Scene3D 
        isLowTide={isLowTide} setIsLowTide={setIsLowTide}
        setFocusedPhoto={setFocusedPhoto} focusedPhoto={focusedPhoto}
        showLetter={showLetter}
      />
      
      {/* 2. LA CARTA */}
      {showLetter && <MysticLetter onClose={() => setShowLetter(false)} />}

      {/* 3. EL CHATBOT (Con el Robot incluido) */}
      <div className={`transition-opacity duration-500 ${focusedPhoto || showLetter ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
         <Chatbot />
      </div>

      {/* 4. VISTA DE FOTOS */}
      <AnimatePresence>
        {focusedPhoto && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 bg-black/80 backdrop-blur-md pointer-events-auto">
            <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="relative max-w-5xl w-full h-full flex items-center justify-center rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
              <img src={focusedPhoto} alt="Recuerdo" className="w-full h-full object-contain p-2" />
            </motion.div>
            <button onClick={() => setFocusedPhoto(null)} className="mt-8 px-12 py-4 bg-cyan-500/20 border-2 border-cyan-400/50 text-white rounded-full text-2xl font-['Cinzel'] font-bold hover:bg-cyan-500/40 shadow-2xl transition-all">Regresar</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}