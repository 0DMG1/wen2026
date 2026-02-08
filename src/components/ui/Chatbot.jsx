import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, X, Loader2 } from 'lucide-react'
import { TbRobot } from "react-icons/tb" 
import { useGemini } from '../../hooks/useGemini'

export function Chatbot() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)
  const { messages, loading, error, sendMessage } = useGemini()

  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }
  useEffect(() => { if (open) setTimeout(scrollToBottom, 100) }, [messages, loading, open])

  const handleSubmit = async (e) => {
    e.preventDefault(); if (!input.trim() || loading) return;
    const text = input.trim(); setInput(''); await sendMessage(text);
  }

  return (
    <>
      {/* INYECCIÓN DE ESTILOS PARA LA BARRA DE SCROLL MÍSTICA */}
      <style>{`
        #chat-scroll-area::-webkit-scrollbar {
          width: 5px;
        }
        #chat-scroll-area::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        #chat-scroll-area::-webkit-scrollbar-thumb {
          background: rgba(34, 211, 238, 0.3);
          border-radius: 10px;
        }
        #chat-scroll-area::-webkit-scrollbar-thumb:hover {
          background: rgba(34, 211, 238, 0.5);
        }
      `}</style>

      {/* BOTÓN FLOTANTE */}
      <button 
        onClick={() => setOpen(!open)} 
        className="fixed bottom-6 right-6 z-[998] flex items-center justify-center w-20 h-20 rounded-full bg-indigo-600/40 border-4 border-white/20 shadow-2xl hover:scale-110 group transition-all"
      >
        {open ? <X className="w-10 h-10 text-white" /> : <TbRobot className="text-5xl text-indigo-200 drop-shadow-[0_0_15px_rgba(99,102,241,0.8)] group-hover:text-white transition-all" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div 
            // AJUSTE MOBILE: Definimos h-[75vh] y max-h-[600px] para asegurar que el scroll funcione
            className="fixed bottom-28 left-4 right-4 h-[70vh] md:h-[550px] z-[999] md:inset-auto md:bottom-32 md:right-12 md:w-[420px] flex flex-col rounded-[2.5rem] overflow-hidden border border-white/20 shadow-[0_0_100px_rgba(0,0,0,1)] bg-[#070c14]/90 backdrop-blur-xl" 
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 50 }}
          >
            {/* CABECERA */}
            <div className="flex-shrink-0 flex items-center justify-between px-6 py-5 bg-white/5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <TbRobot className="w-6 h-6 text-cyan-400 drop-shadow-[0_0_5px_cyan]" />
                <div>
                  <h2 className="text-lg font-['Cinzel'] font-bold text-white">Espíritu del Océano</h2>
                  <p className="text-[9px] font-['Montserrat'] text-cyan-400 uppercase tracking-widest font-bold">IA Mística de Acuario</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="p-2 text-white/50 hover:text-white transition-colors"><X className="w-7 h-7" /></button>
            </div>

            {/* ÁREA DE MENSAJES: Corregida para scroll infinito en mobile */}
            <div 
              id="chat-scroll-area" 
              className="flex-1 overflow-y-auto p-4 space-y-6 bg-black/20 font-['Montserrat'] touch-pan-y" 
              style={{ 
                WebkitOverflowScrolling: 'touch',
                overflowY: 'auto',
                height: '100%' 
              }}
            >
              {messages.length === 0 ? (
                <div className="py-10 text-center opacity-70 text-lg text-cyan-50 italic px-4">
                  Bienvenida, Wendy. ¿Qué secretos deseas revelar hoy?
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} w-full`}>
                    <div className={`max-w-[85%] px-5 py-3 shadow-2xl text-[14px] leading-relaxed ${msg.role === 'user' ? "bg-cyan-500/20 text-white rounded-2xl rounded-tr-none border border-cyan-500/30" : "bg-white/5 text-cyan-50 rounded-2xl rounded-tl-none border border-white/10"}`}>
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
              {loading && (
                <div className="flex items-center gap-2 text-cyan-400/50 text-md italic px-4">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>El mar responde...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* INPUT FIXED AL FINAL */}
            <form onSubmit={handleSubmit} className="flex-shrink-0 p-5 bg-black/60 border-t border-white/10 flex gap-2">
              <input 
                type="text" 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                placeholder="Susurra tu mensaje..." 
                className="flex-1 rounded-xl px-4 py-3 text-sm font-['Montserrat'] text-white bg-white/5 border border-white/10 focus:outline-none" 
                disabled={loading} 
              />
              <button 
                type="submit" 
                disabled={loading || !input.trim()} 
                className="w-12 h-12 flex items-center justify-center rounded-xl bg-cyan-600/30 border border-cyan-500/30 hover:bg-cyan-600/50"
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}