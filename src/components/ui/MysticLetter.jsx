import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const TypewriterText = ({ text, delay = 0 }) => {
  const words = text.split(" ");
  return (
    <span>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, filter: 'blur(5px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.5, delay: delay + (i * 0.08) }}
          className="inline-block mr-1"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
};

export const MysticLetter = ({ onClose }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.5 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#000510]/95 p-4 backdrop-blur-2xl"
    >
      <div className="relative w-full max-w-2xl">
        <div className="relative bg-[#07111d]/90 border border-cyan-500/30 p-8 md:p-14 shadow-[0_0_80px_rgba(0,0,0,0.5)] rounded-[2rem] overflow-hidden">
          
          <div className="text-center mb-12">
             <Sparkles className="text-cyan-400 w-10 h-10 mx-auto mb-4 animate-bounce" />
             <h2 className="text-4xl md:text-6xl font-['Cinzel'] font-bold tracking-[0.3em] text-white">Bienvenida</h2>
          </div>

          <div className="max-h-[55vh] overflow-y-auto pr-4 text-cyan-50 font-['Montserrat'] text-lg md:text-xl leading-relaxed space-y-8 text-justify custom-scroll">
            <p>
              <span className="font-['Cinzel'] text-cyan-300 font-bold text-3xl block mb-4">Wendy:</span>
              <TypewriterText text="Dicen que el agua de los océanos no se destruye, solo se transforma. Tras 15 años navegando juntos, he aprendido que tú eres exactamente como el mar: profunda, a veces tormentosa, increíblemente inteligente y con una risa que es el único faro que reconozco." delay={1} />
            </p>

            <p>
              <TypewriterText text="Sé que el 2025 se ha empeñado en enviarnos olas demasiado grandes. Sé que el silencio de los que se han ido a veces pesa más que el agua misma." delay={6} />
            </p>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 10, duration: 1 }} className="border-l-4 border-cyan-500/50 pl-6 py-4 italic text-white bg-cyan-950/40 rounded-r-2xl shadow-xl">
              "Pero este Santuario es para recordarte que <span className="text-cyan-300 font-bold not-italic">Daniel</span> ha pasado de los códigos a las estrellas solo para construirte una orilla segura."
            </motion.div>

            <p>
              <TypewriterText text="Aquí, entre delfines de luz y el eco de Goliath y Bruce, solo hay espacio para ti. Bienvenida a tu refugio." delay={12} />
            </p>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 15 }} className="text-center text-cyan-400 font-['Cinzel'] text-2xl font-bold tracking-widest pt-8 border-t border-white/5">
              La marea hoy está a tu favor.
            </motion.p>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 16 }} className="mt-12 flex justify-center">
            <button onClick={onClose} className="px-20 py-5 bg-cyan-500/10 rounded-full border-2 border-cyan-400/40 text-white font-['Cinzel'] text-2xl font-bold tracking-[0.4em] hover:bg-cyan-500/30 hover:border-cyan-300 transition-all duration-500">
              EXPLORAR
            </button>
          </motion.div>
        </div>
      </div>

      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 5px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(34, 211, 238, 0.3); border-radius: 10px; }
      `}</style>
    </motion.div>
  );
};