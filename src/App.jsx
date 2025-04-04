import { Canvas } from '@react-three/fiber'; // ✅ Must come from R3F
import './App.css';

import MirrorRoom from './MirrorRoom';
import Scene from './Cube';

function App() {
  return (
    <>
      <Canvas
  camera={{ position: [0, 50, 120], fov: 45 }}
  style={{
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100vh',
    width: '100vw',
    zIndex: 0,
  }}
>
  <MirrorRoom />
  <Scene />
</Canvas>

<div
  style={{
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
    color: 'white',
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: '1rem',
    borderRadius: '8px',
  }}
>
  <h1>HoldFast DEMO</h1>
  <p>-- Proof of Concept --</p>
  <p>R - Toggle Cube Rotation</p>
  <p>w a s d || arrow keys to rotate THE CUBE</p>
  <p>1,2 accelerates rotation in either direction</p>
</div>
    </>
  );
}

export default App;
