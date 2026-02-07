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
      setAuth(true); 
      setShowLetter(true); 
      setError(false);
    } else { 
      setError(true); 
      setPass(""); 
      // Quitamos el error visual después de 2 segundos
      setTimeout(() => setError(false), 2000);
    }
  };

  // Variantes para la vibración del formulario en caso de error
  const shakeVariants = {
    error: { x: [-10, 10, -10, 10, 0], transition: { duration: 0.4 } }
  };

  if (!auth) {
    return (
      <div className="w-full h-screen bg-[#00040a] flex flex-col items-center justify-center font-['Cinzel'] text-white text-center p-4">
        <motion.div initial={{ scale: 0.8 }} animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 4 }} className="text-9xl mb-8 drop-shadow-[0_0_20px_cyan]">⚓</motion.div>
        <h1 className="text-5xl mb-10 tracking-[0.3em] font-bold uppercase">Santuario</h1>
        
        <motion.form 
          onSubmit={handleLogin} 
          animate={error ? "error" : ""} 
          variants={shakeVariants} 
          className="w-full max-w-sm space-y-6 px-6"
        >
          <div className="relative">
            <input 
              type="password" value={pass} 
              onChange={(e) => { setPass(e.target.value); if(error) setError(false); }} 
              placeholder="• • • • • •" 
              className={`w-full px-6 py-4 bg-white/5 border ${error ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'border-white/10'} rounded-full text-center text-5xl font-['Montserrat'] focus:outline-none focus:border-cyan-400 transition-all`} 
              autoFocus 
            />
            {/* Mensaje de error flotante restaurado */}
            <AnimatePresence>
              {error && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0 }} 
                  className="absolute -bottom-10 left-0 w-full text-red-400 text-lg font-['Montserrat'] font-bold italic"
                >
                  Código incorrecto, amor...
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          <button 
            type="submit" 
            className={`w-full py-4 rounded-full border transition-all text-2xl font-bold uppercase ${error ? 'bg-red-500/20 border-red-500/40 text-red-200' : 'bg-cyan-500/20 border-cyan-400/40 hover:bg-cyan-500/40 text-white'}`}
          >
            {error ? "Reintentar" : "Entrar"}
          </button>
        </motion.form>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black select-none">
      <Scene3D isLowTide={isLowTide} setIsLowTide={setIsLowTide} setFocusedPhoto={setFocusedPhoto} focusedPhoto={focusedPhoto} showLetter={showLetter} />
      
      <AnimatePresence>
        {showLetter && <MysticLetter onClose={() => setShowLetter(false)} />}
      </AnimatePresence>

      <div className={`transition-opacity duration-1000 ${focusedPhoto || showLetter ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
         <Chatbot />
      </div>

      <AnimatePresence>
        {focusedPhoto && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 bg-black/90 backdrop-blur-xl pointer-events-auto">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="relative max-w-5xl w-full h-full flex items-center justify-center rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
              <img src={focusedPhoto} alt="Recuerdo" className="w-full h-full object-contain p-2" />
            </motion.div>
            <button onClick={() => setFocusedPhoto(null)} className="mt-8 px-12 py-4 bg-cyan-500/20 border-2 border-cyan-400/50 text-white rounded-full text-2xl font-['Cinzel'] font-bold hover:bg-cyan-500/40 shadow-2xl transition-all">Regresar</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}