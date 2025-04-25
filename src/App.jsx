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
    const [timer, setTimer] = useState(60);
    const [clickedCubes, setClickedCubes] = useState(new Set());
    const [autoRotateCamera, setAutoRotateCamera] = useState(true);
    const [showVictoryMessage, setShowVictoryMessage] = useState(false);
    const [showGameOverMessage, setShowGameOverMessage] = useState(false);
    const controlsRef = useRef();

    useEffect(() => {
        let intervalId;
        if (isGameRunning && timer > 0) {
            intervalId = setInterval(() => {
                setTimer(prevTime => prevTime - 1);
            }, 1000);
        } else if (timer === 0) {
            setIsGameRunning(false);
            // Show game over message if not all cubes are clicked
            if (clickedCubes.size < 6) {
                setShowGameOverMessage(true);
                // Hide game over message after 5 seconds
                const timeoutId = setTimeout(() => {
                    setShowGameOverMessage(false);
                }, 5000);
                return () => clearTimeout(timeoutId);
            }
        }
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [isGameRunning, timer, clickedCubes.size]);

    // Check if all cubes are clicked
    useEffect(() => {
        if (isGameRunning && clickedCubes.size === 6) {
            setIsGameRunning(false);
            setShowVictoryMessage(true);
            // Hide victory message after 5 seconds
            const timeoutId = setTimeout(() => {
                setShowVictoryMessage(false);
            }, 5000);
            return () => clearTimeout(timeoutId);
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
        setShowVictoryMessage(false);
        setShowGameOverMessage(false);
        if (!isGameRunning) {
            setTimer(30);
            setClickedCubes(new Set());
            setAutoRotateCamera(false);
        } else {
            setAutoRotateCamera(true);
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
                    autoRotateCamera={autoRotateCamera}
                />
            </Canvas>

            {showVictoryMessage && (
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 2,
                        color: 'white',
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        padding: '2rem',
                        borderRadius: '8px',
                        textAlign: 'center',
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        animation: 'fadeIn 0.5s ease-in',
                    }}
                >
                    Clear! Score: {timer}s
                </div>
            )}

            {showGameOverMessage && (
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 2,
                        color: 'white',
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        padding: '2rem',
                        borderRadius: '8px',
                        textAlign: 'center',
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        animation: 'fadeIn 0.5s ease-in',
                    }}
                >
                    Game Over! Cubes clicked: {clickedCubes.size}/6
                </div>
            )}

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
                        Cubes clicked: {clickedCubes.size}/6
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
                            marginBottom: '0.5rem',
                        }}
                    >
                        {isGameRunning ? 'Stop Game' : 'Start Game'}
                    </button>
                    <button
                        onClick={() => setAutoRotateCamera(!autoRotateCamera)}
                        disabled={isGameRunning}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: autoRotateCamera ? 'rgba(0,255,0,0.2)' : 'rgba(255,255,255,0.2)',
                            color: 'white',
                            border: '1px solid white',
                            borderRadius: '4px',
                            cursor: isGameRunning ? 'not-allowed' : 'pointer',
                            fontSize: '1rem',
                            width: '100%',
                            opacity: isGameRunning ? 0.5 : 1,
                        }}
                    >
                        {autoRotateCamera ? 'Auto-Rotate: On' : 'Auto-Rotate: Off'}
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
                            width: '100%',
                        }}
                    >
                        {showMirrorRoom ? 'Hide Mirror Room' : 'Show Mirror Room'}
                    </button>
                </p>
                <p>
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
                            width: '100%',
                        }}
                    >
                        {showGridHelper ? 'Hide Grid' : 'Show Grid'}
                    </button>
                </p>
                <p>
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
                            width: '100%',
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