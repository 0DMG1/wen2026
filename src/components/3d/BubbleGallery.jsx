import { useRef, useState, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { BUBBLE_IMAGES } from '../../config/bubbleImages'

const BUBBLE_RADIUS = 0.85
const FLOAT_AMPLITUDE = 0.35
const FLOAT_SPEED = 0.12

function useImageTexture(src) {
  const [texture, setTexture] = useState(null)

  useEffect(() => {
    if (!src) return
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const tex = new THREE.CanvasTexture(img)
      tex.needsUpdate = true
      setTexture(tex)
    }
    img.onerror = () => setTexture(null)
    img.src = src
    return () => setTexture(null)
  }, [src])

  return texture
}

function CrystalBubble({ item, index, onBubbleClick }) {
  const group = useRef(null)
  const materialRef = useRef(null)
  const pulseStartRef = useRef(null)
  const triggerPulseRef = useRef(false)
  const texture = useImageTexture(item.src)

  const seed = useMemo(() => index * 1.37 + 0.5, [index])
  const baseX = useMemo(() => (Math.random() - 0.5) * 12, [])
  const baseY = useMemo(() => (Math.random() - 0.5) * 6, [])
  const baseZ = useMemo(() => (Math.random() - 0.5) * 10, [])
  const phaseX = useMemo(() => Math.random() * Math.PI * 2, [])
  const phaseZ = useMemo(() => Math.random() * Math.PI * 2, [])
  const phaseY = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.elapsedTime

    if (triggerPulseRef.current) {
      pulseStartRef.current = t
      triggerPulseRef.current = false
    }

    group.current.position.x = baseX + Math.sin(t * FLOAT_SPEED + phaseX) * FLOAT_AMPLITUDE * 3
    group.current.position.y = baseY + Math.sin(t * FLOAT_SPEED * 0.8 + phaseY) * FLOAT_AMPLITUDE * 2.5
    group.current.position.z = baseZ + Math.cos(t * FLOAT_SPEED * 1.1 + phaseZ) * FLOAT_AMPLITUDE * 3
    group.current.rotation.y = t * 0.05 + seed
    group.current.rotation.x = Math.sin(t * 0.06) * 0.12

    if (pulseStartRef.current !== null) {
      const elapsed = t - pulseStartRef.current
      const pulse = Math.max(0, 1 - elapsed * 2)
      group.current.scale.setScalar(1 + pulse * 0.12)
      if (materialRef.current) {
        const baseColor = new THREE.Color('#aaddff')
        const flashColor = new THREE.Color('#d4eeff')
        materialRef.current.color.copy(flashColor).lerp(baseColor, Math.min(1, elapsed * 2))
      }
      if (elapsed > 0.5) pulseStartRef.current = null
    }
  })

  const handleClick = (e) => {
    e.stopPropagation()
    triggerPulseRef.current = true
    if (onBubbleClick) onBubbleClick(index, item)
    console.log('Foto clickeada!')
  }

  return (
    <group ref={group}>
      <mesh onClick={handleClick} castShadow receiveShadow>
        <sphereGeometry args={[BUBBLE_RADIUS, 32, 32]} />
        <meshPhysicalMaterial
          ref={materialRef}
          color="#aaddff"
          transparent
          transmission={0.97}
          roughness={0.02}
          metalness={0}
          thickness={0.4}
          ior={1.15}
          clearcoat={0.6}
          clearcoatRoughness={0.05}
          envMapIntensity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, 0, BUBBLE_RADIUS * 0.92]} onClick={handleClick}>
        <planeGeometry args={[BUBBLE_RADIUS * 1.55, BUBBLE_RADIUS * 1.55]} />
        {texture ? (
          <meshBasicMaterial
            map={texture}
            side={THREE.DoubleSide}
            transparent
            opacity={0.92}
          />
        ) : (
          <meshBasicMaterial
            color="#1a365d"
            side={THREE.DoubleSide}
            transparent
            opacity={0.5}
          />
        )}
      </mesh>
    </group>
  )
}

export function BubbleGallery() {
  const handleBubbleClick = (index, item) => {
    console.log('Foto clickeada!', { index, item })
  }

  const items = useMemo(
    () => (BUBBLE_IMAGES.length >= 6 ? BUBBLE_IMAGES.slice(0, 6) : BUBBLE_IMAGES),
    []
  )

  return (
    <group>
      {items.map((item, i) => (
        <CrystalBubble
          key={`${item.src}-${i}`}
          item={item}
          index={i}
          onBubbleClick={handleBubbleClick}
        />
      ))}
    </group>
  )
}
