import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function CausticsLight() {
  const spot1 = useRef(null)
  const spot2 = useRef(null)
  const spot3 = useRef(null)
  const dirLight = useRef(null)
  const target1 = useMemo(() => new THREE.Object3D(), [])
  const target2 = useMemo(() => new THREE.Object3D(), [])
  const target3 = useMemo(() => new THREE.Object3D(), [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (spot1.current) {
      spot1.current.position.x = Math.sin(t * 0.2) * 12
      spot1.current.position.z = Math.cos(t * 0.15) * 12
      spot1.current.position.y = 20
      target1.position.set(spot1.current.position.x * 0.3, -10, spot1.current.position.z * 0.3)
    }
    if (spot2.current) {
      spot2.current.position.x = Math.sin(t * 0.25 + 2) * 10
      spot2.current.position.z = Math.cos(t * 0.18 + 1) * 10
      spot2.current.position.y = 18
      target2.position.set(spot2.current.position.x * 0.2, -8, spot2.current.position.z * 0.2)
    }
    if (spot3.current) {
      spot3.current.position.x = Math.sin(t * 0.18 + 4) * 8
      spot3.current.position.z = Math.cos(t * 0.22 + 3) * 8
      spot3.current.position.y = 22
      target3.position.set(spot3.current.position.x * 0.25, -12, spot3.current.position.z * 0.25)
    }
    if (dirLight.current) {
      dirLight.current.position.x = Math.sin(t * 0.1) * 5
      dirLight.current.position.z = Math.cos(t * 0.08) * 5
      dirLight.current.position.y = 15
    }
  })

  return (
    <>
      <primitive object={target1} />
      <primitive object={target2} />
      <primitive object={target3} />
      <ambientLight intensity={0.35} color="#1a3a5c" />
      <directionalLight
        ref={dirLight}
        position={[0, 15, 0]}
        intensity={0.8}
        color="#7eb8da"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <spotLight
        ref={spot1}
        target={target1}
        angle={0.5}
        penumbra={0.6}
        intensity={1.2}
        color="#63b3ed"
        distance={45}
        decay={2}
        castShadow
      />
      <spotLight
        ref={spot2}
        target={target2}
        angle={0.45}
        penumbra={0.7}
        intensity={0.9}
        color="#8b5cf6"
        distance={40}
        decay={2}
      />
      <spotLight
        ref={spot3}
        target={target3}
        angle={0.5}
        penumbra={0.5}
        intensity={0.8}
        color="#4299e1"
        distance={42}
        decay={2}
      />
      <pointLight position={[0, 5, 0]} intensity={0.3} color="#a78bfa" distance={30} decay={2} />
    </>
  )
}
