import { Canvas } from '@react-three/fiber';
import './App.css';
import Scene from './Cube';
import MirrorRoom from './MirrorRoom';
import * as THREE from 'three';
import {useRef} from 'react';


function App() {
    const controlsRef = useRef();
    return (
        <>
            <Canvas
                camera={{ position: [0, 15, 30], fov: 45, near: 0.1, far: 1000 }}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100vh',
                    width: '100vw',
                    zIndex: 0,
                }}
                shadows
                gl={{ antialias: true, shadowMapType: THREE.PCFSoftShadowMap }}
            >
              <MirrorRoom setControlsRef={(ref)=>(controlsRef.current = ref)}/>
              <Scene controlsRef={controlsRef}/>
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
                <p>I J K L - Move light/sphere</p>
                <p>W A S D / Arrows - Rotate cube</p>
                <p>Click & Drag - Spin cube</p>
                <p>Click Small Cube - Stop moving point</p>
            </div>
        </>
    );
}

export default App;