import React, { useState, useEffect } from 'react';

export const MysticLetter = ({ onClose }) => {
  const [opacity, setOpacity] = useState("opacity-0");

  useEffect(() => {
    setTimeout(() => {
      setOpacity("opacity-100");
    }, 500);
  }, []);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-[#000510]/90 backdrop-blur-md transition-opacity duration-1000 ${opacity}`}>
      
      {/* --- EL PERGAMINO --- */}
      <div className="relative w-full max-w-lg mx-4 transform transition-all duration-700 scale-100">
        
        {/* RODILLO SUPERIOR (Decorativo) */}
        <div className="h-6 w-[104%] -ml-[2%] bg-gradient-to-r from-cyan-900 via-cyan-600 to-cyan-900 rounded-full shadow-lg z-10 relative border border-cyan-400/30"></div>

        {/* CUERPO DEL PAPEL (Cuerpo principal) */}
        <div className="relative bg-[#0a1625] border-x-2 border-cyan-500/20 px-8 py-10 shadow-[0_0_50px_rgba(0,255,255,0.15)]">
          
          {/* Textura de fondo sutil */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" 
               style={{backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px'}}>
          </div>

          {/* CABECERA */}
          <div className="text-center mb-6">
             <span className="text-4xl animate-pulse">✨</span>
             <h2 className="text-4xl md:text-5xl font-['Caveat'] font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-white to-cyan-200 mt-2">
               Bienvenida
             </h2>
          </div>

          {/* TEXTO MANUSCRITO */}
          <div className="mystic-scroll max-h-[50vh] overflow-y-auto pr-2 text-cyan-100/90 font-['Caveat'] text-2xl md:text-3xl leading-relaxed space-y-6 text-justify">
            
            <p>
              <strong className="text-cyan-300 text-3xl">Wendy:</strong> Dicen que el agua de los océanos no se destruye, solo se transforma. 
              Tras <span className="text-white font-bold">15 años navegando juntos</span>, he aprendido que tú eres exactamente como el mar: 
              profunda, a veces tormentosa, increíblemente inteligente y con una risa que es el único faro que reconozco.
            </p>

            <p>
              Sé que el 2025 se ha empeñado en enviarnos olas demasiado grandes. Sé que el silencio de los que se han ido a veces pesa más que el agua misma.
            </p>

            <div className="border-l-4 border-cyan-500/40 pl-4 py-2 italic text-white/80 bg-cyan-900/10 rounded-r-lg">
              "Pero este Santuario es para recordarte que <span className="text-cyan-300 font-bold">Daniel</span> ha pasado de los códigos a las estrellas solo para construirte una orilla segura."
            </div>

            <p>
              Aquí, entre delfines de luz y el eco de <span className="text-amber-200 font-bold">Goliath</span> y <span className="text-amber-200 font-bold">Bruce</span>, solo hay espacio para ti. 
              Bienvenida a tu refugio.
            </p>

            <p className="text-center text-cyan-400 mt-8 text-2xl font-bold">
              La marea hoy está a tu favor.
            </p>

          </div>

          {/* BOTÓN (Sello Mágico) */}
          <div className="mt-8 flex justify-center">
            <button 
              onClick={onClose}
              className="group relative px-12 py-3 bg-transparent overflow-hidden rounded-full border border-cyan-500/40 hover:border-cyan-400 transition-all duration-300"
            >
              <div className="absolute inset-0 w-full h-full bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-all"></div>
              <span className="relative font-['Caveat'] text-2xl font-bold text-cyan-100 group-hover:text-white uppercase tracking-widest">
                Entrar
              </span>
            </button>
          </div>

        </div>

        {/* RODILLO INFERIOR (Decorativo) */}
        <div className="h-6 w-[104%] -ml-[2%] bg-gradient-to-r from-cyan-900 via-cyan-600 to-cyan-900 rounded-full shadow-lg z-10 relative border border-cyan-400/30"></div>
        
      </div>
    </div>
  );
};

const MemorialStar = ({ position, name, color = "#80e5ff" }) => {
    const [hovered, setHovered] = React.useState(false);
    const haloRef = useRef();
    const rayRef = useRef();
  
    // Animación de pulsación mística
    useFrame(({ clock }) => {
      const t = clock.getElapsedTime();
      const s = 1 + Math.sin(t * 2) * 0.2; // Pulsa entre 1 y 1.2
      if (haloRef.current) {
        haloRef.current.scale.set(s * 3, s * 3, s * 3); // Halo grande
        haloRef.current.material.opacity = 0.4 + Math.sin(t * 2) * 0.2;
      }
      if (rayRef.current) {
        rayRef.current.rotation.y = t * 0.2; // El rayo gira lentamente
      }
    });
  
    return (<group position={[0, 12, -8]}>
        {/* Papá de Wendy - Un faro esmeralda por su fortaleza */}
        <MemorialStar position={[-6, 0, 0]} name="Papá de Wendy" color="#50ffb1" />
        
        {/* Papá de Daniel - Un faro azul profundo por la paz que Wendy le dio a Daniel */}
        <MemorialStar position={[6, 1, -2]} name="Papá de Daniel" color="#00bfff" />
        
        {/* Mary - Luz violeta por la sabiduría de la maestra */}
        <MemorialStar position={[-2, 3, -4]} name="Mary" color="#e0b0ff" />
        
        {/* Papá de Andrea - Luz blanca pura */}
        <MemorialStar position={[3, 2, -6]} name="Papá de Andrea" color="#ffffff" />
      </group>
    );
  };