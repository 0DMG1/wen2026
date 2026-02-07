import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

export const MysticLetter = ({ onClose }) => {
  const [opacity, setOpacity] = useState("opacity-0");

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpacity("opacity-100");
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`fixed inset-0 z-[200] flex items-center justify-center bg-[#000510]/95 backdrop-blur-lg transition-opacity duration-1000 ${opacity}`}>
      
      {/* --- EL PERGAMINO REDISEÑADO --- */}
      <div className="relative w-full max-w-xl mx-4 transform transition-all duration-700 scale-100">
        
        {/* RODILLO SUPERIOR */}
        <div className="h-4 w-[102%] -ml-[1%] bg-gradient-to-r from-cyan-900 via-cyan-400 to-cyan-900 rounded-full shadow-[0_0_20px_rgba(34,211,238,0.3)] z-10 relative border border-cyan-300/30"></div>

        {/* CUERPO DEL PAPEL */}
        <div className="relative bg-[#07111d] border-x-2 border-cyan-500/20 px-8 py-12 shadow-[0_0_60px_rgba(0,0,0,1)]">
          
          {/* Textura de fondo mística */}
          <div className="absolute inset-0 opacity-5 pointer-events-none" 
               style={{backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px'}}>
          </div>

          {/* CABECERA CON CINZEL */}
          <div className="text-center mb-10">
             <Sparkles className="text-cyan-400 w-8 h-8 mx-auto mb-4 animate-pulse" />
             <h2 className="text-4xl md:text-5xl font-['Cinzel'] font-bold tracking-[0.2em] text-white">
               Bienvenida
             </h2>
             <div className="h-px w-24 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mx-auto mt-4"></div>
          </div>

          {/* TEXTO CON MONTSERRAT PARA MÁXIMA LEGIBILIDAD */}
          <div className="max-h-[55vh] overflow-y-auto pr-2 text-cyan-50/90 font-['Montserrat'] text-base md:text-lg leading-relaxed space-y-8">
            
            <p className="text-pretty">
              <span className="font-['Cinzel'] text-cyan-300 font-bold text-2xl block mb-3">Wendy:</span> 
              Dicen que el agua de los océanos no se destruye, solo se transforma. 
              Tras <span className="text-white font-bold border-b border-cyan-500/30">15 años navegando juntos</span>, he aprendido que tú eres exactamente como el mar: 
              <span className="italic text-cyan-200"> profunda, a veces tormentosa, increíblemente inteligente</span> y con una risa que es el único faro que reconozco.
            </p>

            <p className="text-pretty opacity-80">
              Sé que el 2025 se ha empeñado en enviarnos olas demasiado grandes. Sé que el silencio de los que se han ido a veces pesa más que el agua misma.
            </p>

            {/* SECCIÓN DANIEL CON DISEÑO ESPECIAL */}
            <div className="border-l-2 border-cyan-500/50 pl-6 py-4 italic text-white/90 bg-cyan-950/20 rounded-r-2xl shadow-inner">
              "Pero este Santuario es para recordarte que <span className="text-cyan-300 font-bold not-italic">Daniel</span> ha pasado de los códigos a las estrellas solo para construirte una orilla segura."
            </div>

            <p className="text-pretty">
              Aquí, entre delfines de luz y el eco de <span className="text-amber-300 font-semibold">Goliath</span> y <span className="text-amber-300 font-semibold">Bruce</span>, solo hay espacio para ti. 
              Bienvenida a tu refugio.
            </p>

            <p className="text-center text-cyan-400 mt-12 font-['Cinzel'] text-xl font-bold tracking-widest pt-6">
              La marea hoy está a tu favor.
            </p>
          </div>

          {/* BOTÓN SELLO */}
          <div className="mt-12 flex justify-center">
            <button 
              onClick={onClose}
              className="group relative px-16 py-4 bg-cyan-500/10 rounded-full border-2 border-cyan-400/40 hover:border-cyan-300 transition-all duration-500 shadow-[0_0_20px_rgba(34,211,238,0.1)] hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]"
            >
              <span className="relative font-['Cinzel'] text-xl font-bold text-white uppercase tracking-[0.3em]">
                Explorar
              </span>
            </button>
          </div>

        </div>

        {/* RODILLO INFERIOR */}
        <div className="h-4 w-[102%] -ml-[1%] bg-gradient-to-r from-cyan-900 via-cyan-400 to-cyan-900 rounded-full shadow-lg z-10 relative border border-cyan-300/30"></div>
        
      </div>

      {/* ESTILOS DE SCROLL */}
      <style>{`
        .max-h-\\[55vh\\]::-webkit-scrollbar { width: 4px; }
        .max-h-\\[55vh\\]::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
        .max-h-\\[55vh\\]::-webkit-scrollbar-thumb { background: rgba(34,211,238,0.3); border-radius: 10px; }
      `}</style>
    </div>
  );
};