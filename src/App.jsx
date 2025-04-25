import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import './App.css';
import Scene from './components/Scene';
import MirrorRoom from './MirrorRoom';
import * as THREE from 'three';

function App() {
    const [showMirrorRoom, setShowMirrorRoom] = useState(true);
    const [showGridHelper, setShowGridHelper] = useState(false);
    const [showAxesHelper, setShowAxesHelper] = useState(false);
    const controlsRef = useRef();

    const toggleMirrorRoom = () => {
        setShowMirrorRoom((prev) => !prev);
    };

    const toggleGridHelper = () => {
        setShowGridHelper((prev) => !prev);
    };

    const toggleAxesHelper = () => {
        setShowAxesHelper((prev) => !prev);
    };

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
                {showMirrorRoom && <MirrorRoom setControlsRef={(ref) => (controlsRef.current = ref)} />}
                <Scene
                    controlsRef={controlsRef}
                    showGridHelper={showGridHelper}
                    showAxesHelper={showAxesHelper}
                />
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
                <h1>HoldFast</h1>
                <p>I J K L - Move light/sphere</p>
                <p>W A S D / Arrows - Rotate cube</p>
                <p>Click & Drag - Spin cube</p>
                <p>Click Small Cube - Stop moving point</p>
                <p>
                    <button
                        onClick={toggleMirrorRoom}
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
                </p>
                <p>Toggle Grid Helper - Button below</p>
                <button
                    onClick={toggleGridHelper}
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
                    onClick={toggleAxesHelper}
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
            </div>
        </>
    );
}

export default App;