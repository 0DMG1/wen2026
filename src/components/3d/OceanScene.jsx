import { UnderwaterGradient } from './UnderwaterGradient'
import { SandySeabed } from './SandySeabed'
import { CausticsLight } from './CausticsLight'
import { PlanktonAndBubbles } from './PlanktonAndBubbles'
import { OceanCreatures } from './OceanCreatures'
import { BubbleGallery } from './BubbleGallery'

export function OceanScene() {
  return (
    <>
      <color attach="background" args={['#050d18']} />
      <fog attach="fog" args={['#0a1929', 8, 45]} />
      <UnderwaterGradient />
      <CausticsLight />
      <SandySeabed />
      <PlanktonAndBubbles />
      <OceanCreatures />
      <BubbleGallery />
    </>
  )
}
