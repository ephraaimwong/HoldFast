import { useState } from 'react' // Import useState hook from React for state management
import reactLogo from './assets/react.svg' // Import React logo from assets
import viteLogo from '/vite.svg' // Import Vite logo from public directory
import './App.css' // Import App-specific CSS styles
import Scene from './Cube'; // Import the Scene component containing the 3D cube

function App() {
  const [count, setCount] = useState(0) // State for a counter, currently unused

  return (
    <>
      {/* Main heading for the demo */}
      <h1>HoldFast DEMO</h1>
      {/* Brief description of the app */}
      <p>-- Proof of Concept --</p>
      {/* Instruction for toggling cube rotation */}
      <p> R - Toggle Cube Rotation</p>
      {/* Instruction for rotating the cube with keys */}
      <p>w a s d || arrow keys to rotate THE CUBE</p>
      {/* Instruction for adjusting rotation speed */}
      <p>1,2 accelerates rotation in either direction</p>
      
      {/* Render the 3D cube scene */}
      <Scene/>
      {/* TODO: The count state is unused - could be removed or implemented for additional functionality */}
      {/* TODO: Logos (reactLogo, viteLogo) are imported but not used - consider displaying them or removing imports */}
      {/* TODO: Consider adding more styling in App.css to enhance presentation */}
    </>
  )
}

export default App // Export the App component as the default export