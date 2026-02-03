import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function createCausticTexture() {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#0a1929'
  ctx.fillRect(0, 0, size, size)
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0, 'rgba(99, 179, 237, 0.25)')
  g.addColorStop(0.3, 'rgba(99, 179, 237, 0.12)')
  g.addColorStop(0.6, 'rgba(99, 179, 237, 0.04)')
  g.addColorStop(1, 'transparent')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  for (let i = 0; i < 12; i++) {
    const x = (Math.random() * 0.8 + 0.1) * size
    const y = (Math.random() * 0.8 + 0.1) * size
    const r = 30 + Math.random() * 40
    const spot = ctx.createRadialGradient(x, y, 0, x, y, r)
    spot.addColorStop(0, 'rgba(139, 92, 246, 0.15)')
    spot.addColorStop(0.5, 'rgba(99, 179, 237, 0.08)')
    spot.addColorStop(1, 'transparent')
    ctx.fillStyle = spot
    ctx.fillRect(0, 0, size, size)
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(3, 3)
  return tex
}

export function SandySeabed() {
  const mesh = useRef(null)
  const sandTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 128
    canvas.height = 128
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#1a3a2e'
    ctx.fillRect(0, 0, 128, 128)
    for (let i = 0; i < 200; i++) {
      ctx.fillStyle = `rgba(210, 180, 140, ${0.1 + Math.random() * 0.2})`
      ctx.beginPath()
      ctx.arc(Math.random() * 128, Math.random() * 128, 0.5 + Math.random(), 0, Math.PI * 2)
      ctx.fill()
    }
    const tex = new THREE.CanvasTexture(canvas)
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(8, 8)
    return tex
  }, [])
  const causticTexture = useMemo(() => createCausticTexture(), [])

  const causticRef = useRef(null)
  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (causticRef.current?.material?.map) {
      causticRef.current.material.map.offset.x = Math.sin(t * 0.15) * 0.1
      causticRef.current.material.map.offset.y = Math.cos(t * 0.12) * 0.1
    }
  })

  const sandColor = '#2d4a3e'
  const causticColor = '#63b3ed'

  return (
    <group position={[0, -14, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh ref={mesh} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial
          color={sandColor}
          map={sandTexture}
          roughness={0.95}
          metalness={0}
          transparent
        />
      </mesh>
      <mesh ref={causticRef} position={[0, 0.02, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial
          map={causticTexture}
          transparent
          opacity={0.7}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}
