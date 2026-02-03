import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Send, X, Sparkles, Loader2 } from 'lucide-react'
import { useGemini } from '../../hooks/useGemini'

export function Chatbot() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)
  const { messages, loading, error, sendMessage } = useGemini()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (open) {
      setTimeout(scrollToBottom, 100)
    }
  }, [messages, loading, open])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return
    const text = input.trim()
    setInput('')
    await sendMessage(text)
  }

  return (
    <>
      {/* Botón Flotante */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-[998] flex items-center justify-center w-16 h-16 rounded-full shadow-2xl"
        style={{ 
          background: 'rgba(34, 211, 238, 0.2)', 
          backdropFilter: 'blur(10px)', 
          border: '2px solid rgba(34, 211, 238, 0.5)'
        }}
      >
        <MessageCircle className="w-8 h-8 text-white" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-4 top-auto bottom-24 left-4 right-4 z-[999] md:inset-auto md:bottom-32 md:right-12 md:w-[420px] md:h-[550px] flex flex-col rounded-[2rem] overflow-hidden border border-white/20 shadow-[0_0_100px_rgba(0,0,0,1)]"
            style={{ 
              background: '#070c14',
              touchAction: 'auto', // CORREGIDO: Permite el scroll táctil
              maxHeight: 'calc(100vh - 120px)'
            }}
            initial={{ opacity: 0, y: 100 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 100 }}
          >
            {/* Cabecera */}
            <div className="flex items-center justify-between px-6 py-5 bg-white/5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <div>
                  <h2 className="text-lg font-['Cormorant_Garamond'] font-bold text-white">Espíritu del Océano</h2>
                  <p className="text-[9px] text-cyan-400 uppercase tracking-widest font-bold">Guía Místico de Acuario</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="p-2 text-white/50"><X className="w-7 h-7" /></button>
            </div>

            {/* ÁREA DE MENSAJES CON SCROLL CORREGIDO */}
            <div 
              id="chat-scroll-area"
              className="flex-1 p-4 space-y-6 overflow-y-auto bg-black/20"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {messages.length === 0 ? (
                <div className="py-10 text-center opacity-70 font-['Cormorant_Garamond'] text-xl text-cyan-50 italic px-4">
                  Bienvenida, Wendy. El Santuario reconoce tu luz. ¿Qué secretos deseas revelar hoy?
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} w-full`}>
                    <div
                      className={`max-w-[85%] px-5 py-3 shadow-2xl ${
                        msg.role === 'user'
                          ? "bg-cyan-500/20 text-white text-[13px] rounded-2xl rounded-tr-none border border-cyan-500/30"
                          : "bg-white/5 text-cyan-50 font-['Cormorant_Garamond'] text-xl leading-relaxed rounded-2xl rounded-tl-none border border-white/10"
                      }`}
                      style={{ wordBreak: 'break-word' }}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
              {loading && (
                <div className="flex items-center gap-2 text-cyan-400/50 font-['Cormorant_Garamond'] text-lg italic">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>El mar responde...</span>
                </div>
              )}
              {error && <div className="text-red-400 text-xs text-center p-2 bg-red-900/20 rounded-lg">{error}</div>}
              <div ref={messagesEndRef} />
            </div>

            {/* Formulario Input */}
            <form onSubmit={handleSubmit} className="p-5 bg-black/60 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  type="text" value={input} onChange={(e) => setInput(e.target.value)}
                  placeholder="Susurra tu mensaje..."
                  className="flex-1 rounded-xl px-4 py-3 text-sm text-white bg-white/5 border border-white/10 focus:outline-none focus:border-cyan-500/50"
                  disabled={loading}
                />
                <button
                  type="submit" disabled={loading || !input.trim()}
                  className="w-12 h-12 flex items-center justify-center rounded-xl bg-cyan-600/30 text-white border border-cyan-500/30"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        #chat-scroll-area::-webkit-scrollbar {
          width: 6px !important;
          display: block !important;
        }
        #chat-scroll-area::-webkit-scrollbar-thumb {
          background: #22d3ee !important;
          border-radius: 10px !important;
        }
        #chat-scroll-area {
          scrollbar-width: thin;
          scrollbar-color: #22d3ee rgba(0,0,0,0.3);
        }
      `}</style>
    </>
  )
}