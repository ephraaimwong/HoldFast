import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Scene from './Cube';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Introducing THE CUBE</h1>
      <p> R - Toggle Cube Rotation</p>
      <Scene/>
    </>
  )
}

export default App
