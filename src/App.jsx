import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import './App.css';
import Scene from './components/Scene';
import MirrorRoom from './MirrorRoom';
import * as THREE from 'three';

function App() {
    const [showMirrorRoom, setShowMirrorRoom] = useState(true);
    const [showGridHelper, setShowGridHelper] = useState(false);
    const [showAxesHelper, setShowAxesHelper] = useState(false);
    const [isGameRunning, setIsGameRunning] = useState(false);
    const [timer, setTimer] = useState(45);
    const [clickedCubes, setClickedCubes] = useState(new Set());
    const controlsRef = useRef();

    useEffect(() => {
        let intervalId;
        if (isGameRunning && timer > 0) {
            intervalId = setInterval(() => {
                setTimer(prevTime => prevTime - 1);
            }, 1000);
        } else if (timer === 0) {
            setIsGameRunning(false);
        }
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [isGameRunning, timer]);

    // Check if all cubes are clicked
    useEffect(() => {
        if (isGameRunning && clickedCubes.size === 3) {
            setIsGameRunning(false);
            // You could add a victory sound or effect here
        }
    }, [clickedCubes, isGameRunning]);

    const toggleMirrorRoom = () => {
        setShowMirrorRoom((prev) => !prev);
    };

    const toggleGridHelper = () => {
        setShowGridHelper((prev) => !prev);
    };

    const toggleAxesHelper = () => {
        setShowAxesHelper((prev) => !prev);
    };

    const toggleGame = () => {
        setIsGameRunning(prev => !prev);
        if (!isGameRunning) {
            setTimer(45);
            setClickedCubes(new Set()); // Reset clicked cubes when starting new game
        }
    };

    const handleCubeClick = (cubeIndex) => {
        if (isGameRunning) {
            setClickedCubes(prev => new Set([...prev, cubeIndex]));
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
                    onCubeClick={handleCubeClick}
                    isGameRunning={isGameRunning}
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
                <div style={{ marginBottom: '1rem' }}>
                    <h2 style={{
                        margin: '0 0 0.5rem 0',
                        color: timer <= 10 ? 'red' : 'white',
                        fontSize: timer <= 10 ? '1.5rem' : '1.2rem'
                    }}>
                        Timer: {formatTime(timer)}
                    </h2>
                    <p style={{ margin: '0 0 0.5rem 0' }}>
                        Cubes clicked: {clickedCubes.size}/3
                    </p>
                    <button
                        onClick={toggleGame}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: isGameRunning ? 'rgba(255,0,0,0.2)' : 'rgba(0,255,0,0.2)',
                            color: 'white',
                            border: '1px solid white',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            width: '100%',
                        }}
                    >
                        {isGameRunning ? 'Stop Game' : 'Start Game'}
                    </button>
                </div>
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