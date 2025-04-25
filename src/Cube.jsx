import React, { useRef, useState, useEffect } from 'react'; // Import React hooks for state and side effects
import { useFrame } from '@react-three/fiber'; // Import React Three Fiber components for 3D rendering 
import * as THREE from 'three'; // Import Three.js core library for 3D math and objects 
import { OrbitControls } from '@react-three/drei';

// Cube component manages the main cube and its interactions 
const Cube = ({ spinToggle, setSpinToggle, rotationSpeed, controlsRef }) => {
    // State and ref setup for cube interactions 
    const cubeRef = useRef(); // Reference to the main cube mesh for direct manipulation 
    const [isDragged, setIsDragged] = useState(false); // Tracks if the cube is being dragged with the mouse 
    const [lastMousePos, setLastMousePos] = useState(null); // Stores last mouse position for drag calculations 
    const keyRotationSpeed = 2; // Fixed speed for keyboard-based rotation
    const [fuseActive, setFuseActive] = useState(true); // State to control whether the fuse animation is active 

    //debug for orbit controls initialization
    useEffect(() => {
        console.log('Cube initialized, controlsRef:', !!controlsRef.current);
    }, [controlsRef]);

    // Handle keyboard input for cube rotation 
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
                console.log('Cube key:', key);
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
                const quaternion = new THREE.Quaternion(); // Convert Euler angles to quaternion 
                quaternion.setFromEuler(eulerRotation);
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
        event.stopPropagation(); // This prevents the event from reaching OrbitControls 
        // Disable OrbitControls when dragging cube
        if (controlsRef?.current) {
            controlsRef.current.enabled = false;
            console.log('OrbitControls disabled for cube drag');
        }
        setIsDragged(true);
        setLastMousePos({ x: event.clientX, y: event.clientY });
        setSpinToggle(false);
        console.log('Cube dragged');
    };

    const handlePointerMove = (event) => {
        event.stopPropagation();
        event.preventDefault();
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

    const handlePointerUp = () => {
        setIsDragged(false);
        // Re-enable OrbitControls when done dragging 
        if (controlsRef?.current) {
            controlsRef.current.enabled = true;
            //debug statement
            console.log('OrbitControls re-enabled');
        }
    };

    // Define static end point for SmallCube
    const endPoint = new THREE.Vector3(0, 0, -1.25); // Set coordinates to center of back face 

    // Render the cube and its child components 
    return (
        <group ref={cubeRef} position={[0, 1.25, 0]}>
            <mesh position={[0, 0, 0]} onPointerDown={handlePointerDown} castShadow receiveShadow>
                <boxGeometry args={[2.5, 2.5, 2.5]} />
                <meshStandardMaterial
                    color={spinToggle ? 'hotpink' : 'blue'}
                    roughness={0.5}
                    metalness={0.2}
                    transparent
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
            console.log('CubeLines rendered');
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
                new THREE.Vector3(-1.25, -1.25, 1.25),  // -1.25 = half of -2.5 (cube edge) 
                new THREE.Vector3(1.25, 1.25, 1.25),    // 1.25 = half of 2.5 (cube edge) 
                new THREE.Vector3(1.25, 1.25, -1.25),   // Transition to back face 
                new THREE.Vector3(0, 0, -1.25)          // Center of back face 
            ];
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            lineRef.current.geometry = geometry;
            console.log('WrappingLine rendered');
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
    const trail = useRef([]);

    const points = [
        new THREE.Vector3(-1.25, -1.25, 1.25),  // -1.25 = half of -2.5 (cube edge) 
        new THREE.Vector3(1.25, 1.25, 1.25),    // 1.25 = half of 2.5 (cube edge)
        new THREE.Vector3(1.25, 1.25, -1.25),   // Transition to back face
        new THREE.Vector3(0, 0, -1.25)          // Center of back face 
    ];
    // FIXME: we need to create a parameter for taking in a points array, otherwise we'll be duplicating lines everywhere 

    // Animate the point’s position 
    useFrame(({ clock }) => {
        if (pointRef.current && fuseActive) {
            const time = clock.getElapsedTime();
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

            // Spark flicker 
            const flicker = 0.8 + Math.sin(time * 20 + t * 10) * 0.2;
            pointRef.current.scale.set(flicker, flicker, flicker);
            pointRef.current.material.emissiveIntensity = 2 + Math.sin(time * 30) * 1;
            pointRef.current.material.opacity = 0.5 + Math.random() * 0.3;

        }
    });
    // TODO: What do different easing styles look like here? 

    return (
        <>
            {/* Main Spark */}
            <mesh ref={pointRef} castShadow receiveShadow>
                <sphereGeometry args={[0.1, 16, 16]} />
                <meshStandardMaterial
                    color="yellow"
                    emissive="yellow"
                    emissiveIntensity={2}
                    transparent
                    opacity={0.7}
                />
            </mesh>

            {/* Trailing sparks */}
            {trail.current.map((entry, i) => (
                <mesh key={i} position={entry.position}>
                    <sphereGeometry args={[0.08 - i * 0.005, 12, 12]} />
                    <meshStandardMaterial color="orange" emissive="orange" emissiveIntensity={1.5 - i * 0.1} transparent opacity={0.4 - i * 0.3} />
                </mesh>
            ))}
        </>
    );
};

// Create a clickable small cube to stop the fuse 
const SmallCube = ({ position, setFuseActive }) => {
    const cubeRef = useRef();

    // Update small cube position
    useEffect(() => {
        if (cubeRef.current && position) {
            cubeRef.current.position.copy(position);
            console.log('SmallCube rendered at:', position.toArray());
        }
    }, [position]);

    const handleClick = () => {
        setFuseActive(false);
        console.log('SmallCube clicked, fuseActive set to false');
    };

    return (
        <mesh ref={cubeRef} onClick={handleClick} castShadow receiveShadow>
            <boxGeometry args={[0.2, 0.2, 0.2]} />
            <meshStandardMaterial color="red" />
        </mesh>
    );
    // TODO: Small size makes it hard to click - consider increasing size or adding a visual cue 
};

const Scene = ({ showGridHelper, showAxesHelper }) => {
    const [pos, setPos] = useState([10, 10, 10]);
    const controlsRef = useRef();
    const activeKeys = useRef(new Set());
    const lightSpeed = 600; // Units per second
    const [spinToggle, setSpinToggle] = useState(false);
    const [rotationSpeed, setRotationSpeed] = useState(0.05);

    useEffect(() => {
        const handleKeyDown = (event) => {
            const key = event.key.toLowerCase();
            activeKeys.current.add(key);
            if (["i", "j", "k", "l"].includes(key)) {
                event.preventDefault();
                //debugging statement
                console.log('Sphere key:', key);
            }
            if (event.key === 'r') { //autorotate
                setSpinToggle((prev) => !prev);
            } else if (event.key === '1') { //speed up
                setRotationSpeed((prev) => prev + 0.02);
            } else if (event.key === '2') {//speed down
                setRotationSpeed((prev) => prev - 0.02);
            }
        };
        const handleKeyUp = (event) => activeKeys.current.delete(event.key.toLowerCase());

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);


    useFrame(({ clock, gl, scene }) => {
        try {
            const delta = clock.getDelta();
            scene.matrixWorldAutoUpdate = true;
            if (!gl.shadowMap.enabled) {
                gl.shadowMap.enabled = true;
                gl.shadowMap.type = THREE.PCFSoftShadowMap; //enable soft shadows, complex
                console.log('Manually enabled shadow map');
            }

            // Smooth sphere/spotlight movement
            let deltaX = 0, deltaZ = 0;
            if (activeKeys.current.has('i')) deltaZ -= lightSpeed * delta;
            if (activeKeys.current.has('k')) deltaZ += lightSpeed * delta;
            if (activeKeys.current.has('j')) deltaX -= lightSpeed * delta;
            if (activeKeys.current.has('l')) deltaX += lightSpeed * delta;
            if (deltaX !== 0 || deltaZ !== 0) {
                setPos((prev) => {
                    const newX = Math.max(-50, Math.min(50, prev[0] + deltaX));
                    const newZ = Math.max(-50, Math.min(50, prev[2] + deltaZ));
                    const newPos = [newX, 10, newZ];

                    //debugging statement
                    console.log('New position:', newPos);
                    return newPos;
                });
            }
        } catch (error) {
            console.error('useFrame error:', error);
        }
    });

    return (
        <>

            <ambientLight intensity={0.1} /> //
            <spotLight
                position={pos}
                angle={Math.PI / 4}
                penumbra={0.5}
                intensity={500} //brightness of spotlight
                castShadow
                color="lightyellow"
                distance={50}
                shadow-mapSize-width={1024} //increase for more detail
                shadow-mapSize-height={1024} //increase for more detail
                target-position={[0, 0, 0]}
            />
            {/* spotlight cube thingy */}
            <mesh position={pos} castShadow receiveShadow>
                <sphereGeometry args={[0.3, 32, 32]} />
                <meshStandardMaterial color="yellow" emissive="yellow" emissiveIntensity={2} />
            </mesh>
            <mesh position={pos} castShadow receiveShadow>
                <boxGeometry args={[0.5, 0.5, 0.5]} />
                <meshStandardMaterial color="red" />
            </mesh>
            <Cube
                spinToggle={spinToggle}
                setSpinToggle={setSpinToggle}
                rotationSpeed={rotationSpeed}
                controlsRef={controlsRef}
            />
            {/*base plate for spotlight and shadow to be cast on */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow castShadow>
                <planeGeometry args={[30, 30]} />
                <meshStandardMaterial color="white" roughness={0.5} metalness={0.2} />
            </mesh>

            {/* helpers, toggleable */}
            {showGridHelper && <gridHelper args={[30, 30, '#ffffff', '#444444']} position={[0, -2, 0]} />}
            {showAxesHelper && <axesHelper args={[10]} position={[0, -1, 0]} />}

            {/* Scene gets orbits controls on intitalization, disabled when cube dragged */}
            <OrbitControls ref={controlsRef} />
        </>
    );
};

export default Scene;