import { Canvas } from '@react-three/fiber';
import './App.css';
import Scene from './Cube';
import MirrorRoom from './MirrorRoom';
import * as THREE from 'three';
import {useRef,useState} from 'react';


function App() {
    const [showMirrorRoom, setShowMirrorRoom] = useState(false);
    const [showGridHelper, setShowGridHelper] = useState(false);
    const [showAxesHelper, setShowAxesHelper] = useState(false);

    const toggleMirrorRoom = () => {
        setShowMirrorRoom((prev) => {
            console.log('MirrorRoom toggled:', !prev);
            return !prev;
        });
    };

    const toggleGridHelper = () => {
        setShowGridHelper((prev) => {
            console.log('GridHelper toggled:', !prev);
            return !prev;
        });
    };

    const toggleAxesHelper = () => {
        setShowAxesHelper((prev) => {
            console.log('AxesHelper toggled:', !prev);
            return !prev;
        });
    };

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
                {showMirrorRoom && <MirrorRoom setControlsRef={(ref)=>(controlsRef.current = ref)}/>}
              
              <Scene controlsRef={controlsRef} showGridHelper={showGridHelper} showAxesHelper={showAxesHelper}/>
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
                <p><button 
                    onClick = {toggleMirrorRoom}
                    style={{
                        padding: '0.5rem',
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        border: '1px solid white',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                    }}
                >
                    {showMirrorRoom ? 'Hide Mirror Room' : 'Show Mirror Room'}
                </button>
                
                <p>Toggle Grid Helper - Button below</p>
                <button
                    onClick={() => {
                        console.log('GridHelper toggle button clicked');
                        toggleGridHelper();
                    }}
                    style={{
                        padding: '0.5rem',
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        border: '1px solid white',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                    }}
                >
                    {showGridHelper ? 'Hide Grid' : 'Show Grid'}
                </button>
                <p>Toggle Axes Helper - Button below</p>
                <button
                    onClick={() => {
                        console.log('AxesHelper toggle button clicked');
                        toggleAxesHelper();
                    }}
                    style={{
                        padding: '0.5rem',
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        border: '1px solid white',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                    }}
                >
                    {showAxesHelper ? 'Hide Axes' : 'Show Axes'}
                </button>
                </p>
            </div>
        </>
    );
}

export default App;