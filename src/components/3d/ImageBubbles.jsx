import { Suspense, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { BUBBLE_IMAGES } from '../../config/bubbleImages'

function SingleBubble({ src, index }) {
  const group = useRef(null)
  const texture = useTexture(src)

  const angle = (index / BUBBLE_IMAGES.length) * Math.PI * 2
  const radius = 6 + (index % 3) * 3
  const baseX = Math.cos(angle) * radius
  const baseZ = Math.sin(angle) * radius
  const baseY = (index % 5) * 2 - 4

  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    group.current.position.x = baseX + Math.sin(t * 0.2 + index) * 0.5
    group.current.position.z = baseZ + Math.cos(t * 0.15 + index * 0.7) * 0.5
    group.current.position.y = baseY + Math.sin(t * 0.25 + index * 0.5) * 0.3
    group.current.rotation.y = t * 0.1 + index * 0.5
    group.current.rotation.x = Math.sin(t * 0.1) * 0.2
  })

  return (
    <group ref={group}>
      {/* Esfera exterior transparente (vidrio) */}
      <mesh>
        <sphereGeometry args={[1.4, 32, 32]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.25}
          roughness={0.1}
          metalness={0.05}
          clearcoat={0.8}
          clearcoatRoughness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Imagen en plano interior */}
      {texture && (
        <mesh position={[0, 0, 0.95]}>
          <planeGeometry args={[1.6, 1.6]} />
          <meshBasicMaterial
            map={texture}
            side={THREE.DoubleSide}
            transparent
            opacity={0.95}
          />
        </mesh>
      )}
    </group>
  )
}

function FallbackBubble({ index }) {
  const group = useRef(null)
  const angle = (index / BUBBLE_IMAGES.length) * Math.PI * 2
  const radius = 6 + (index % 3) * 3
  const baseX = Math.cos(angle) * radius
  const baseZ = Math.sin(angle) * radius
  const baseY = (index % 5) * 2 - 4

  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    group.current.position.x = baseX + Math.sin(t * 0.2 + index) * 0.5
    group.current.position.z = baseZ + Math.cos(t * 0.15 + index * 0.7) * 0.5
    group.current.position.y = baseY + Math.sin(t * 0.25 + index * 0.5) * 0.3
    group.current.rotation.y = t * 0.1 + index * 0.5
  })

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[1.4, 32, 32]} />
        <meshPhysicalMaterial
          color="#63b3ed"
          transparent
          opacity={0.4}
          roughness={0.3}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

export function ImageBubbles() {
  return (
    <Suspense fallback={null}>
      {BUBBLE_IMAGES.map((item, i) => (
        <Suspense key={`${item.src}-${i}`} fallback={<FallbackBubble index={i} />}>
          <SingleBubble src={item.src} index={i} />
        </Suspense>
      ))}
    </Suspense>
  )
}
