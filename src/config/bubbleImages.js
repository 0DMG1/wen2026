/**
 * Galería de burbujas: 6 imágenes.
 * - true: placeholder remoto (picsum) para ver el efecto.
 * - false: tus fotos en public/assets/fotos/ (1.jpg, 2.jpg, ...)
 */
const USE_PICSUM_PLACEHOLDER = true

const PICSUM_IMAGES = Array.from({ length: 6 }, (_, i) => ({
  src: `https://picsum.photos/seed/ocean${i}/300`,
  alt: `Foto ${i + 1}`,
}))

const LOCAL_IMAGES = [
  { src: '/assets/fotos/1.jpg', alt: 'Recuerdo 1' },
  { src: '/assets/fotos/2.jpg', alt: 'Recuerdo 2' },
  { src: '/assets/fotos/3.jpg', alt: 'Recuerdo 3' },
  { src: '/assets/fotos/4.jpg', alt: 'Recuerdo 4' },
  { src: '/assets/fotos/5.jpg', alt: 'Recuerdo 5' },
  { src: '/assets/fotos/6.jpg', alt: 'Recuerdo 6' },
]

export const BUBBLE_IMAGES = USE_PICSUM_PLACEHOLDER ? PICSUM_IMAGES : LOCAL_IMAGES
