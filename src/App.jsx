import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ObjectDetection from './ObjectDetection'

function App() {
  const [count, setCount] = useState(0)

  return (
    <main>
      <ObjectDetection />
    </main>
  )
}

export default App
