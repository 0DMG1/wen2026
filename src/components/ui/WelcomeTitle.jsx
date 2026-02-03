import { motion } from 'framer-motion'
import { Gift } from 'lucide-react'
import confetti from 'canvas-confetti'

function fireConfetti() {
  const count = 120
  const defaults = {
    origin: { y: 0.75 },
    colors: ['#63b3ed', '#8b5cf6', '#4299e1', '#a78bfa', '#88ccff'],
  }
  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    })
  }
  fire(0.25, { spread: 26, startVelocity: 55 })
  fire(0.2, { spread: 60 })
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 })
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 })
  fire(0.1, { spread: 120, startVelocity: 45 })
}

export function WelcomeTitle() {
  return (
    <motion.div
      className="absolute top-6 left-0 right-0 z-20 flex flex-col items-center px-4"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="text-center pointer-events-none">
        <motion.h1
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-elegant font-bold text-white drop-shadow-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <span className="bg-gradient-to-r from-ocean-aqua via-mystic-violet to-ocean-light bg-clip-text text-transparent">
            Santuario Oceánico
          </span>
        </motion.h1>
        <motion.p
          className="mt-2 text-sm sm:text-base md:text-lg text-ocean-aqua/90 font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          Felicidades, mi Acuariana favorita
        </motion.p>
      </div>
      <motion.button
        type="button"
        onClick={fireConfetti}
        className="mt-4 flex items-center justify-center w-11 h-11 rounded-full pointer-events-auto transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ocean-aqua/50"
        style={{
          background: 'rgba(99, 179, 237, 0.2)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(99, 179, 237, 0.4)',
          boxShadow: '0 0 20px rgba(99, 179, 237, 0.25)',
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Celebrar con confeti"
      >
        <Gift className="w-6 h-6 text-ocean-aqua" />
      </motion.button>
    </motion.div>
  )
}
