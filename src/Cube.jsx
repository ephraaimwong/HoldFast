import React, { useRef, useState, useEffect } from 'react'; // Import React hooks for state and side effects
import { useFrame, Canvas } from '@react-three/fiber'; // Import React Three Fiber components for 3D rendering
import * as THREE from 'three'; // Import Three.js core library for 3D math and objects

// Cube component manages the main cube and its interactions
const Cube = ({ spinToggle, setSpinToggle, rotationSpeed }) => {
    // State and ref setup for cube interactions
    const cubeRef = useRef(); // Reference to the main cube mesh for direct manipulation
    const [isDragged, setIsDragged] = useState(false); // Tracks if the cube is being dragged with the mouse
    const [lastMousePos, setLastMousePos] = useState(null); // Stores last mouse position for drag calculations
    const keyRotationSpeed = 2; // Fixed speed for keyboard-based rotation
    const [fuseActive, setFuseActive] = useState(true); // State to control whether the fuse animation is active

    // Handle keyboard input for cube rotation
    useEffect(() => {
        const activeKeys = new Set();
        const handleKeyDown = (event) => {
            if (["arrowup", "arrowdown", "arrowleft", "arrowright"].includes(event.key.toLowerCase())) {
                event.preventDefault();
            }
            activeKeys.add(event.key.toLowerCase());
            if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(event.key.toLowerCase())) {
                setSpinToggle(false);
            }
        };
        const handleKeyUp = (event) => activeKeys.delete(event.key.toLowerCase());
        const updateRotation = () => {
            if (!cubeRef.current) return;
            let deltaX = 0, deltaY = 0; // Initialize rotation deltas
            if (activeKeys.has('w') || activeKeys.has('arrowup')) deltaX -= keyRotationSpeed; // Subtract 2 from X delta
            if (activeKeys.has('s') || activeKeys.has('arrowdown')) deltaX += keyRotationSpeed; // Add 2 to X delta
            if (activeKeys.has('a') || activeKeys.has('arrowleft')) deltaY -= keyRotationSpeed; // Subtract 2 from Y delta
            if (activeKeys.has('d') || activeKeys.has('arrowright')) deltaY += keyRotationSpeed; // Add 2 to Y delta
            if (deltaX !== 0 || deltaY !== 0) {
                const eulerRotation = new THREE.Euler(
                    THREE.MathUtils.degToRad(deltaX), // Convert deltaX (degrees) to radians
                    THREE.MathUtils.degToRad(deltaY), // Convert deltaY (degrees) to radians
                    0, // Z rotation remains 0
                    'XYZ' // Apply rotations in X, Y, Z order
                );
                const quaternion = new THREE.Quaternion();
                quaternion.setFromEuler(eulerRotation); // Convert Euler angles to quaternion
                cubeRef.current.quaternion.multiplyQuaternions(quaternion, cubeRef.current.quaternion); // Multiply current quaternion by new rotation
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

    // Manage automatic cube rotation
    useEffect(() => {
        if (spinToggle && !isDragged) {
            const interval = setInterval(() => {
                if (cubeRef.current) {
                    cubeRef.current.rotation.x += rotationSpeed; // Add rotationSpeed to X rotation
                    cubeRef.current.rotation.y += rotationSpeed; // Add rotationSpeed to Y rotation
                }
            }, 16); // Approximately 60 FPS
            return () => clearInterval(interval);
        }
    }, [spinToggle, isDragged, rotationSpeed]);

    // Handle mouse drag for manual cube rotation
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

    const handlePointerDown = (event) => {
        setIsDragged(true);
        setLastMousePos({ x: event.clientX, y: event.clientY });
        setSpinToggle(false);
    };

    const handlePointerMove = (event) => {
        if (isDragged && lastMousePos) {
            const { innerWidth, innerHeight } = window;
            const deltaX = event.movementX * 1.5 / innerWidth; // Multiply movement by 1.5 and normalize by window width
            const deltaY = event.movementY * 1.5 / innerHeight; // Multiply movement by 1.5 and normalize by window height
            if (cubeRef.current) {
                const eulerRotation = new THREE.Euler(
                    deltaY * Math.PI, // Scale deltaY by π for full rotation range
                    deltaX * Math.PI, // Scale deltaX by π for full rotation range
                    0, // No Z rotation
                    'XYZ' // Apply rotations in X, Y, Z order
                );
                const quaternion = new THREE.Quaternion();
                quaternion.setFromEuler(eulerRotation); // Convert Euler to quaternion
                cubeRef.current.quaternion.multiplyQuaternions(quaternion, cubeRef.current.quaternion); // Multiply current quaternion by new rotation
            }
            setLastMousePos({ x: event.clientX, y: event.clientY });
        }
    };

    const handlePointerUp = () => setIsDragged(false);

    // Define static end point for SmallCube
    const endPoint = new THREE.Vector3(0, 0, -1.25); // Set coordinates to center of back face

    // Render the cube and its child components
    return (
        <group ref={cubeRef}>
            <mesh position={[0, 0, 0]} onPointerDown={handlePointerDown}>
                <boxGeometry args={[2.5, 2.5, 2.5]} /> // 2.5 units width, height, depth
                <meshStandardMaterial
                    color={spinToggle ? 'hotpink' : 'white'}
                    transparent={true}
                    opacity={0.7}
                />
            </mesh>
            <CubeLines />
            <WrappingLine />
            <MovingPoint fuseActive={fuseActive} />
            <SmallCube position={endPoint} setFuseActive={setFuseActive} />
            {/* TODO: Could add a reset mechanism to restart the fuse */}
        </group>
    );
};

// Render wireframe lines on the cube
const CubeLines = () => {
    const linesRef = useRef();

    // Setup wireframe geometry
    useEffect(() => {
        if (linesRef.current) {
            const geometry = new THREE.BoxGeometry(2.5, 2.5, 2.5); // 2.5 units width, height, depth
            const edges = new THREE.EdgesGeometry(geometry);
            linesRef.current.geometry = edges;
        }
    }, []);

    return (
        <lineSegments ref={linesRef}>
            <lineBasicMaterial
                attach="material"
                color="black"
                linewidth={2}
            />
        </lineSegments>
    );
};

// Create a line wrapping around the cube
const WrappingLine = () => {
    const lineRef = useRef();

    // Setup line geometry with fixed points
    useEffect(() => {
        if (lineRef.current) {
            const points = [
                new THREE.Vector3(-1.25, -1.25, 1.25), // -1.25 = half of -2.5 (cube edge)
                new THREE.Vector3(1.25, 1.25, 1.25),   // 1.25 = half of 2.5 (cube edge)
                new THREE.Vector3(1.25, 1.25, -1.25),  // Transition to back face
                new THREE.Vector3(0, 0, -1.25)         // Center of back face
            ];
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            lineRef.current.geometry = geometry;
        }
    }, []);

    return (
        <line ref={lineRef}>
            <lineBasicMaterial
                attach="material"
                color="red"
                linewidth={3}
            />
        </line>
    );
    // TODO: modularize this so that we can create random straight paths
};

// Animate a point moving along the wrapping line
const MovingPoint = ({ fuseActive }) => {
    const pointRef = useRef();
    const [t, setT] = useState(0); // Parametric t from 0 to 1

    const points = [
        new THREE.Vector3(-1.25, -1.25, 1.25), // -1.25 = half of -2.5 (cube edge)
        new THREE.Vector3(1.25, 1.25, 1.25),   // 1.25 = half of 2.5 (cube edge)
        new THREE.Vector3(1.25, 1.25, -1.25),  // Transition to back face
        new THREE.Vector3(0, 0, -1.25)         // Center of back face
    ];
    // FIXME: we need to create a parameter for taking in a points array, otherwise we'll be duplicating lines everywhere

    // Animate the point’s position
    useFrame(() => {
        if (pointRef.current && fuseActive) {
            setT((prev) => (prev + 0.005) % 1); // Add 0.005 to t, modulo 1 to loop

            const segmentCount = points.length - 1; // 4 points - 1 = 3 segments
            const segmentIndex = Math.floor(t * segmentCount); // t * 3, floor to get segment (0, 1, or 2)
            const segmentT = (t * segmentCount) % 1; // t * 3 modulo 1 for local segment progress

            const startPoint = points[segmentIndex];
            const endPoint = points[Math.min(segmentIndex + 1, points.length - 1)]; // Ensure index doesn’t exceed array

            const position = new THREE.Vector3()
                .copy(startPoint)
                .lerp(endPoint, segmentT); // Linear interpolation: start + (end - start) * segmentT

            pointRef.current.position.copy(position);
        }
    });
    // TODO: What do different easing styles look like here?

    return (
        <mesh ref={pointRef}>
            <sphereGeometry args={[0.1, 32, 32]} /> // Radius 0.1, 32 segments for smoothness
            <meshStandardMaterial color="yellow" />
        </mesh>
    );
};

// Create a clickable small cube to stop the fuse
const SmallCube = ({ position, setFuseActive }) => {
    const cubeRef = useRef();

    // Update small cube position
    useEffect(() => {
        if (cubeRef.current && position) {
            cubeRef.current.position.copy(position);
        }
    }, [position]);

    const handleClick = () => {
        setFuseActive(false);
    };

    return (
        <mesh ref={cubeRef} onClick={handleClick}>
            <boxGeometry args={[0.2, 0.2, 0.2]} /> // 0.2 units width, height, depth
            <meshStandardMaterial color="red" />
        </mesh>
    );
    // TODO: Small size makes it hard to click - consider increasing size or adding a visual cue
};

// Main scene setup with canvas and lighting
const Scene = () => {
    const defaultRotationSpeed = 0.05;
    const [spinToggle, setSpinToggle] = useState(false);
    const [rotationSpeed, setRotationSpeed] = useState(defaultRotationSpeed);

    // Handle keyboard controls for rotation speed and toggle
    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key.toLowerCase() === 'r') {
                setSpinToggle((prev) => !prev);
            } else if (event.key === '1') {
                setRotationSpeed((prev) => prev + 0.02); // Add 0.02 to current speed
            } else if (event.key === '2') {
                setRotationSpeed((prev) => prev - 0.02); // Subtract 0.02 from current speed
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, []);

    return (
        <Canvas
            style={{ height: '70vh', width: '100%', display: 'block' }}
            camera={{ position: [0, 0, 5] }} // Camera at 5 units on Z axis
        >
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 15, 5]} intensity={5} />
            <Cube
                spinToggle={spinToggle}
                rotationSpeed={rotationSpeed}
                setSpinToggle={setSpinToggle}
            />
        </Canvas>
    );
};

export default Scene; // Export Scene as default export