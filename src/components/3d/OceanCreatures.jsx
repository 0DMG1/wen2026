import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function makePath(seed, length = 24) {
  const points = []
  let x = (Math.random() - 0.5) * 16
  let z = (Math.random() - 0.5) * 16
  let y = (Math.random() - 0.5) * 8
  for (let i = 0; i < length; i++) {
    points.push(new THREE.Vector3(x, y, z))
    x += (Math.random() - 0.5) * 3 + Math.sin(i * 0.5 + seed) * 1.5
    z += (Math.random() - 0.5) * 3 + Math.cos(i * 0.4 + seed) * 1.5
    y += (Math.random() - 0.5) * 0.8
    x = Math.max(-18, Math.min(18, x))
    z = Math.max(-18, Math.min(18, z))
    y = Math.max(-10, Math.min(6, y))
  }
  return points
}

function Turtle({ path, index }) {
  const group = useRef(null)
  const progress = useRef(0)

  useFrame((state, delta) => {
    if (!group.current || path.length < 2) return
    progress.current += delta * 0.08
    if (progress.current >= 1) progress.current = 0
    const t = progress.current * (path.length - 1)
    const i = Math.floor(t)
    const f = t - i
    const a = path[i]
    const b = path[(i + 1) % path.length]
    group.current.position.lerpVectors(a, b, f)
    const next = path[(i + 2) % path.length]
    if (next) {
      group.current.lookAt(next.x, next.y + 0.5, next.z)
    }
    group.current.rotation.x += delta * 0.2
  })

  return (
    <group ref={group}>
      <mesh position={[0, 0, 0]} castShadow>
        <sphereGeometry args={[0.55, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <meshStandardMaterial color="#3d6b2a" roughness={0.7} metalness={0.05} />
      </mesh>
      <mesh position={[0.08, 0.05, 0.45]} castShadow>
        <sphereGeometry args={[0.45, 10, 10, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        <meshStandardMaterial color="#4a7c23" roughness={0.65} metalness={0} />
      </mesh>
      <mesh position={[0.35, 0.08, 0.35]} castShadow>
        <sphereGeometry args={[0.18, 8, 8]} />
        <meshStandardMaterial color="#4a7c23" />
      </mesh>
    </group>
  )
}

function Dolphin({ path, index }) {
  const group = useRef(null)
  const progress = useRef(Math.random())

  useFrame((state, delta) => {
    if (!group.current || path.length < 2) return
    progress.current += delta * 0.12
    if (progress.current >= 1) progress.current = 0
    const t = progress.current * (path.length - 1)
    const i = Math.floor(t)
    const f = t - i
    const a = path[i]
    const b = path[(i + 1) % path.length]
    group.current.position.lerpVectors(a, b, f)
    const next = path[(i + 2) % path.length]
    if (next) {
      group.current.lookAt(next.x, next.y, next.z)
    }
    group.current.rotation.z = Math.sin(state.clock.elapsedTime * 2 + index) * 0.15
  })

  return (
    <group ref={group}>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <capsuleGeometry args={[0.2, 1.4, 6, 12]} />
        <meshStandardMaterial color="#7eb8da" roughness={0.25} metalness={0.08} />
      </mesh>
      <mesh position={[0.75, 0, 0]} castShadow>
        <sphereGeometry args={[0.3, 10, 10]} />
        <meshStandardMaterial color="#8ecae6" roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.28, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <coneGeometry args={[0.12, 0.35, 6]} />
        <meshStandardMaterial color="#7eb8da" />
      </mesh>
    </group>
  )
}

export function OceanCreatures() {
  const turtlePaths = useMemo(
    () => [makePath(1), makePath(2), makePath(3), makePath(4)],
    []
  )
  const dolphinPaths = useMemo(
    () => [makePath(10), makePath(11), makePath(12), makePath(13), makePath(14)],
    []
  )

  return (
    <>
      {turtlePaths.map((path, i) => (
        <Turtle key={`turtle-${i}`} path={path} index={i} />
      ))}
      {dolphinPaths.map((path, i) => (
        <Dolphin key={`dolphin-${i}`} path={path} index={i} />
      ))}
    </>
  )
}
