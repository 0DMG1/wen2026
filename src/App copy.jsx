import { Scene3D } from './components/3d/Scene3D'
import { WelcomeTitle } from './components/ui/WelcomeTitle'
import { Chatbot } from './components/ui/Chatbot'

function App() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-ocean-deep">
      <Scene3D />
      <WelcomeTitle />
      <Chatbot />
    </div>
  )
}

export default App
