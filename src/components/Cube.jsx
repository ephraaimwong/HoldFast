import React, { useRef, useState, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import WrappingLine from './WrappingLine';
import MovingPoint from './MovingPoint';
import CubeLines from './CubeLines';
import SmallCube from './SmallCube';

/**
 * Cube component - Represents a game cube with a fuse and small cube
 * Handles cube rotation, physics, and game interactions
 */
const Cube = ({ position, rotationSpeed, controlsRef, cubeIndex, onCubeClick, onFuseComplete, isGameRunning }) => {
    const cubeRef = useRef();
    const wrappingLineRef = useRef();
    const [isDragged, setIsDragged] = useState(false);
    const [lastMousePos, setLastMousePos] = useState(null);
    const [spinToggle, setSpinToggle] = useState(true);
    const [fuseActive, setFuseActive] = useState(false);
    const [endPoint, setEndPoint] = useState(new THREE.Vector3(0, 0, -1.25));
    const keyRotationSpeed = 2;

    // Physics properties
    const [hasGravity, setHasGravity] = useState(false);
    const [velocity, setVelocity] = useState(new THREE.Vector3(0, 0, 0));
    const gravity = 0.01; // Gravity strength
    const initialPosition = useMemo(() => new THREE.Vector3().copy(position), [position]);
    const floorY = -40; // Floor level in the scene

    // Animation properties
    const [isShrinking, setIsShrinking] = useState(false);
    const [shrinkProgress, setShrinkProgress] = useState(0);
    const [cubeColor, setCubeColor] = useState(spinToggle ? 'grey' : 'blue');
    const shrinkDuration = 1000; // 1 second for shrinking animation
    const shrinkStartTime = useRef(0);
    const initialScale = useRef(new THREE.Vector3(1, 1, 1));
    const targetScale = new THREE.Vector3(0.5, 0.5, 0.5);

    // Generate a unique seed based on the cube index for consistent randomization
    const uniqueSeed = useMemo(() => {
        return Math.random() * 1000 + cubeIndex * 1000;
    }, [cubeIndex]);

    // Handle keyboard controls for cube rotation
    useEffect(() => {
        const activeKeys = new Set();
        const handleKeyDown = (event) => {
            const key = event.key.toLowerCase();
            if (["arrowup", "arrowdown", "arrowleft", "arrowright", "i", "j", "k", "l"].includes(key)) {
                event.preventDefault();
            }
            activeKeys.add(key);
            if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key)) {
                setSpinToggle(false);
            }
        };
        const handleKeyUp = (event) => activeKeys.delete(event.key.toLowerCase());
        const updateRotation = () => {
            if (!cubeRef.current) return;
            let deltaX = 0, deltaY = 0;
            if (activeKeys.has('w') || activeKeys.has('arrowup')) deltaX -= keyRotationSpeed;
            if (activeKeys.has('s') || activeKeys.has('arrowdown')) deltaX += keyRotationSpeed;
            if (activeKeys.has('a') || activeKeys.has('arrowleft')) deltaY -= keyRotationSpeed;
            if (activeKeys.has('d') || activeKeys.has('arrowright')) deltaY += keyRotationSpeed;
            if (deltaX !== 0 || deltaY !== 0) {
                const eulerRotation = new THREE.Euler(
                    THREE.MathUtils.degToRad(deltaX),
                    THREE.MathUtils.degToRad(deltaY),
                    0,
                    'XYZ'
                );
                const quaternion = new THREE.Quaternion();
                quaternion.setFromEuler(eulerRotation);
                cubeRef.current.quaternion.multiplyQuaternions(quaternion, cubeRef.current.quaternion);
            }
            requestAnimationFrame(updateRotation);
        };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        requestAnimationFrame(updateRotation);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    // Handle automatic cube rotation when spinToggle is true
    useEffect(() => {
        if (spinToggle && !isDragged) {
            const interval = setInterval(() => {
                if (cubeRef.current) {
                    cubeRef.current.rotation.x += rotationSpeed;
                    cubeRef.current.rotation.y += rotationSpeed;
                }
            }, 16);
            return () => clearInterval(interval);
        }
    }, [spinToggle, isDragged, rotationSpeed]);

    // Handle mouse drag for cube rotation
    const handlePointerDown = (event) => {
        event.stopPropagation();
        if (controlsRef?.current) {
            controlsRef.current.enabled = false;
        }
        setIsDragged(true);
        setLastMousePos({ x: event.clientX, y: event.clientY });
        setSpinToggle(false);
    };

    const handlePointerMove = (event) => {
        event.stopPropagation();
        event.preventDefault();
        if (isDragged && lastMousePos) {
            const { innerWidth, innerHeight } = window;
            // Calculate rotation based on mouse movement relative to window size
            const deltaX = event.movementX * 1.5 / innerWidth;
            const deltaY = event.movementY * 1.5 / innerHeight;
            if (cubeRef.current) {
                const eulerRotation = new THREE.Euler(
                    deltaY * Math.PI,
                    deltaX * Math.PI,
                    0,
                    'XYZ'
                );
                const quaternion = new THREE.Quaternion();
                quaternion.setFromEuler(eulerRotation);
                cubeRef.current.quaternion.multiplyQuaternions(quaternion, cubeRef.current.quaternion);
            }
            setLastMousePos({ x: event.clientX, y: event.clientY });
        }
    };

    const handlePointerUp = () => {
        setIsDragged(false);
        if (controlsRef?.current) {
            controlsRef.current.enabled = true;
        }
    };

    // Add/remove mouse event listeners based on drag state
    useEffect(() => {
        if (isDragged) {
            window.addEventListener('mousemove', handlePointerMove);
            window.addEventListener('mouseup', handlePointerUp);
        } else {
            window.removeEventListener('mousemove', handlePointerMove);
            window.removeEventListener('mouseup', handlePointerUp);
        }
        return () => {
            window.removeEventListener('mousemove', handlePointerMove);
            window.removeEventListener('mouseup', handlePointerUp);
        };
    }, [isDragged]);

    // Update endPoint when new points are generated
    const handlePointsGenerated = (points) => {
        if (points && points.length > 0) {
            setEndPoint(points[points.length - 1]);
        }
    };

    // Handle main cube click to generate new points
    const handleCubeClick = () => {
        if (!isDragged && wrappingLineRef.current) {
            wrappingLineRef.current.generateRandomPoints();
        }
    };

    // Handle small cube click - success case
    const handleSmallCubeClick = () => {
        if (isGameRunning) {
            // First update the game state
            onCubeClick(cubeIndex);

            // Then update local state
            setFuseActive(false);

            // Enable gravity when small cube is clicked
            setHasGravity(true);

            // Start shrinking animation
            setIsShrinking(true);
            shrinkStartTime.current = Date.now();

            // Change color to green
            setCubeColor('green');

            // Add a small random initial velocity for more interesting movement
            setVelocity(new THREE.Vector3(
                (Math.random() - 0.5) * 0.1, // Random X velocity
                0.05, // Small upward initial velocity
                (Math.random() - 0.5) * 0.1  // Random Z velocity
            ));
        }
    };

    // Handle fuse completion - failure case
    const handleFuseComplete = () => {
        if (isGameRunning) {
            // Change color to red
            setCubeColor('red');

            // Enable gravity
            setHasGravity(true);

            // Add an explosive upward velocity
            setVelocity(new THREE.Vector3(
                (Math.random() - 0.5) * 0.2, // Random X velocity
                0.2, // Stronger upward velocity for explosion effect
                (Math.random() - 0.5) * 0.2  // Random Z velocity
            ));

            // Call the separate fuse completion callback
            onFuseComplete();
        }
    };

    // Apply physics in the animation frame
    useFrame(() => {
        if (hasGravity && cubeRef.current) {
            // Apply gravity to velocity
            velocity.y -= gravity;

            // Update position based on velocity
            const newPosition = cubeRef.current.position.clone();
            newPosition.add(velocity);

            // Check for floor collision
            if (newPosition.y <= floorY) {
                newPosition.y = floorY;
                velocity.y = -velocity.y * 0.5; // Bounce with energy loss

                // If velocity is very small, stop bouncing
                if (Math.abs(velocity.y) < 0.01) {
                    velocity.y = 0;
                }
            }

            // Apply new position
            cubeRef.current.position.copy(newPosition);
        }

        // Handle shrinking animation
        if (isShrinking && cubeRef.current) {
            const elapsed = Date.now() - shrinkStartTime.current;
            const progress = Math.min(elapsed / shrinkDuration, 1);
            setShrinkProgress(progress);

            // Calculate current scale based on progress
            const currentScale = new THREE.Vector3().lerpVectors(
                initialScale.current,
                targetScale,
                progress
            );

            // Apply scale to the cube
            cubeRef.current.scale.copy(currentScale);

            // If animation is complete, stop shrinking
            if (progress >= 1) {
                setIsShrinking(false);
            }
        }
    });

    // Reset cube state when game starts
    useEffect(() => {
        if (isGameRunning) {
            // Start the fuse when game starts
            setFuseActive(true);
            // Reset cube state
            setHasGravity(false);
            setCubeColor(spinToggle ? 'grey' : 'blue');
            if (cubeRef.current) {
                cubeRef.current.scale.copy(initialScale.current);
                cubeRef.current.position.copy(initialPosition);
            }
            setVelocity(new THREE.Vector3(0, 0, 0));
            setIsShrinking(false);
            setShrinkProgress(0);
            // Generate new points for the line
            if (wrappingLineRef.current) {
                wrappingLineRef.current.generateRandomPoints();
            }
        } else {
            // Stop the fuse when game ends
            setFuseActive(false);
        }
    }, [isGameRunning, initialPosition, spinToggle]);

    // Update endPoint when points change
    useEffect(() => {
        if (wrappingLineRef.current) {
            const points = wrappingLineRef.current.getPoints();
            if (points && points.length > 0) {
                setEndPoint(points[points.length - 1]);
            }
        }
    }, [wrappingLineRef.current?.getPoints()]);

    return (
        <group ref={cubeRef} position={position}>
            <mesh position={[0, 0, 0]} onPointerDown={handlePointerDown} onClick={handleCubeClick} castShadow receiveShadow>
                <boxGeometry args={[2.5, 2.5, 2.5]} />
                <meshStandardMaterial
                    color={cubeColor}
                    roughness={0.5}
                    metalness={0.2}
                    transparent
                    opacity={0.7}
                />
            </mesh>
            <CubeLines />
            <WrappingLine ref={wrappingLineRef} onPointsGenerated={handlePointsGenerated} seed={uniqueSeed} />
            <MovingPoint
                fuseActive={fuseActive}
                points={wrappingLineRef.current?.getPoints() || []}
                onFuseComplete={handleFuseComplete}
            />
            <SmallCube position={endPoint} setFuseActive={setFuseActive} onSmallCubeClick={handleSmallCubeClick} color="white" scale={0.3} />
        </group>
    );
};

export default Cube; 