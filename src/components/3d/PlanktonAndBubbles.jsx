import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const PLANKTON_COUNT = 600
const BUBBLE_COUNT = 80

export function PlanktonAndBubbles() {
  const planktonRef = useRef(null)
  const bubbleRef = useRef(null)

  const [planktonPos, planktonCol, planktonSize] = useMemo(() => {
    const pos = new Float32Array(PLANKTON_COUNT * 3)
    const col = new Float32Array(PLANKTON_COUNT * 3)
    const size = new Float32Array(PLANKTON_COUNT)
    const c1 = new THREE.Color(0x63b3ed)
    const c2 = new THREE.Color(0x8b5cf6)
    const c3 = new THREE.Color(0x4299e1)
    for (let i = 0; i < PLANKTON_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 50
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30
      pos[i * 3 + 2] = (Math.random() - 0.5) * 50
      const c = Math.random() < 0.33 ? c1 : Math.random() < 0.5 ? c2 : c3
      col[i * 3] = c.r
      col[i * 3 + 1] = c.g
      col[i * 3 + 2] = c.b
      size[i] = 0.08 + Math.random() * 0.15
    }
    return [pos, col, size]
  }, [])

  const [bubblePos, bubbleSize] = useMemo(() => {
    const pos = new Float32Array(BUBBLE_COUNT * 3)
    const size = new Float32Array(BUBBLE_COUNT)
    for (let i = 0; i < BUBBLE_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 35
      pos[i * 3 + 1] = -12 - Math.random() * 8
      pos[i * 3 + 2] = (Math.random() - 0.5) * 35
      size[i] = 0.06 + Math.random() * 0.12
    }
    return [pos, size]
  }, [])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    if (planktonRef.current) {
      const pos = planktonRef.current.geometry.attributes.position.array
      for (let i = 0; i < PLANKTON_COUNT; i++) {
        pos[i * 3] += Math.sin(t + i * 0.02) * 0.008
        pos[i * 3 + 1] += Math.cos(t * 0.7 + i * 0.03) * 0.005
        pos[i * 3 + 2] += Math.sin(t * 0.5 + i * 0.02) * 0.006
      }
      planktonRef.current.geometry.attributes.position.needsUpdate = true
    }
    if (bubbleRef.current) {
      const pos = bubbleRef.current.geometry.attributes.position.array
      for (let i = 0; i < BUBBLE_COUNT; i++) {
        pos[i * 3 + 1] += 0.02 + Math.random() * 0.01
        if (pos[i * 3 + 1] > 15) pos[i * 3 + 1] = -14 - Math.random() * 4
      }
      bubbleRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <group>
      <points ref={planktonRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={PLANKTON_COUNT} array={planktonPos} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={PLANKTON_COUNT} array={planktonCol} itemSize={3} />
          <bufferAttribute attach="attributes-size" count={PLANKTON_COUNT} array={planktonSize} itemSize={1} />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          vertexColors
          transparent
          opacity={0.85}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
      <points ref={bubbleRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={BUBBLE_COUNT} array={bubblePos} itemSize={3} />
          <bufferAttribute attach="attributes-size" count={BUBBLE_COUNT} array={bubbleSize} itemSize={1} />
        </bufferGeometry>
        <pointsMaterial
          size={0.15}
          color="#aaddff"
          transparent
          opacity={0.6}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  )
}
