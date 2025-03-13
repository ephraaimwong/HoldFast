import React, { useRef, useState, useEffect } from 'react'; // Import React hooks for state and side effects
import { useFrame, Canvas } from '@react-three/fiber'; // Import React Three Fiber components for 3D rendering
import * as THREE from 'three'; // Import Three.js core library for 3D math and objects

// Cube component handles core cube logic and interactions
const Cube = ({ spinToggle, setSpinToggle, rotationSpeed }) => {
    const cubeRef = useRef(); // Reference to the main cube mesh for direct manipulation
    const [isDragged, setIsDragged] = useState(false); // Tracks if the cube is being dragged with the mouse
    const [lastMousePos, setLastMousePos] = useState(null); // Stores last mouse position for drag calculations
    const keyRotationSpeed = 2; // Fixed speed for keyboard-based rotation
    const [fuseActive, setFuseActive] = useState(true); // State to control whether the fuse animation is active

    // Keyboard-based rotation logic using WASD and arrow keys
    useEffect(() => {
        const activeKeys = new Set(); // Set to track currently pressed keys
        const handleKeyDown = (event) => { // Handle key press events
            if (["arrowup", "arrowdown", "arrowleft", "arrowright"].includes(event.key.toLowerCase())) {
                event.preventDefault(); // Prevent default scrolling behavior for arrow keys
            }
            activeKeys.add(event.key.toLowerCase()); // Add pressed key to the set
            if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(event.key.toLowerCase())) {
                setSpinToggle(false); // Disable auto-rotation when using keyboard controls
            }
        };
        const handleKeyUp = (event) => activeKeys.delete(event.key.toLowerCase()); // Remove key from set on release
        const updateRotation = () => { // Continuously update cube rotation based on active keys
            if (!cubeRef.current) return; // Exit if cube ref isn’t available
            let deltaX = 0, deltaY = 0; // Rotation changes for X and Y axes
            if (activeKeys.has('w') || activeKeys.has('arrowup')) deltaX -= keyRotationSpeed; // Tilt up
            if (activeKeys.has('s') || activeKeys.has('arrowdown')) deltaX += keyRotationSpeed; // Tilt down
            if (activeKeys.has('a') || activeKeys.has('arrowleft')) deltaY -= keyRotationSpeed; // Rotate left
            if (activeKeys.has('d') || activeKeys.has('arrowright')) deltaY += keyRotationSpeed; // Rotate right
            if (deltaX !== 0 || deltaY !== 0) { // Apply rotation if there’s any change
                const eulerRotation = new THREE.Euler( // Create Euler rotation from angles
                    THREE.MathUtils.degToRad(deltaX), // Convert degrees to radians for X
                    THREE.MathUtils.degToRad(deltaY), // Convert degrees to radians for Y
                    0, // No rotation on Z axis
                    'XYZ' // Rotation order
                );
                const quaternion = new THREE.Quaternion(); // Create quaternion for smooth rotation
                quaternion.setFromEuler(eulerRotation); // Set quaternion from Euler angles
                cubeRef.current.quaternion.multiplyQuaternions(quaternion, cubeRef.current.quaternion); // Apply rotation
            }
            requestAnimationFrame(updateRotation); // Loop the animation frame
        };
        window.addEventListener('keydown', handleKeyDown); // Add keydown listener
        window.addEventListener('keyup', handleKeyUp); // Add keyup listener
        requestAnimationFrame(updateRotation); // Start the rotation update loop
        return () => { // Cleanup on unmount
            window.removeEventListener('keydown', handleKeyDown); // Remove keydown listener
            window.removeEventListener('keyup', handleKeyUp); // Remove keyup listener
        };
    }, []); // Empty dependency array - runs once on mount

    // Automatic rotation when spinToggle is enabled
    useEffect(() => {
        if (spinToggle && !isDragged) { // Only rotate if spin is toggled and not dragging
            const interval = setInterval(() => { // Set interval for continuous rotation
                if (cubeRef.current) { // Check if cube ref is available
                    cubeRef.current.rotation.x += rotationSpeed; // Increment X rotation
                    cubeRef.current.rotation.y += rotationSpeed; // Increment Y rotation
                }
            }, 16); // ~60 FPS update rate
            return () => clearInterval(interval); // Cleanup interval on unmount or dependency change
        }
    }, [spinToggle, isDragged, rotationSpeed]); // Dependencies for re-running effect

    // Mouse drag logic for manual rotation
    useEffect(() => {
        if (isDragged) { // Add listeners only when dragging
            window.addEventListener('mousemove', handlePointerMove); // Listen for mouse movement
            window.addEventListener('mouseup', handlePointerUp); // Listen for mouse release
        } else { // Remove listeners when not dragging
            window.removeEventListener('mousemove', handlePointerMove); // Stop listening for movement
            window.removeEventListener('mouseup', handlePointerUp); // Stop listening for release
        }
        return () => { // Cleanup on unmount or dependency change
            window.removeEventListener('mousemove', handlePointerMove); // Remove movement listener
            window.removeEventListener('mouseup', handlePointerUp); // Remove release listener
        };
    }, [isDragged]); // Dependency on drag state

    const handlePointerDown = (event) => { // Start dragging on mouse down
        setIsDragged(true); // Set dragging state to true
        setLastMousePos({ x: event.clientX, y: event.clientY }); // Store initial mouse position
        setSpinToggle(false); // Disable auto-rotation during drag
    };

    const handlePointerMove = (event) => { // Handle mouse movement during drag
        if (isDragged && lastMousePos) { // Only proceed if dragging and last position exists
            const { innerWidth, innerHeight } = window; // Get window dimensions
            const deltaX = event.movementX * 1.5 / innerWidth; // Normalize X movement
            const deltaY = event.movementY * 1.5 / innerHeight; // Normalize Y movement
            if (cubeRef.current) { // Check if cube ref is available
                const eulerRotation = new THREE.Euler(deltaY * Math.PI, deltaX * Math.PI, 0, 'XYZ'); // Create Euler rotation
                const quaternion = new THREE.Quaternion(); // Create quaternion for rotation
                quaternion.setFromEuler(eulerRotation); // Set quaternion from Euler
                cubeRef.current.quaternion.multiplyQuaternions(quaternion, cubeRef.current.quaternion); // Apply rotation
            }
            setLastMousePos({ x: event.clientX, y: event.clientY }); // Update last mouse position
        }
    };

    const handlePointerUp = () => setIsDragged(false); // Stop dragging on mouse up

    // Define the end point for the SmallCube (matches WrappingLine's last point)
    const endPoint = new THREE.Vector3(0, 0, -1.25); // Center of the back face for small cube placement

    return (
        <group ref={cubeRef}> // Group all elements to rotate together
            <mesh position={[0, 0, 0]} onPointerDown={handlePointerDown}> // Main cube mesh
                <boxGeometry args={[2.5, 2.5, 2.5]} /> // Define cube dimensions (2.5 units per side)
                <meshStandardMaterial // Material for the main cube
                    color={spinToggle ? 'hotpink' : 'white'} // Change color based on spin state
                    transparent={true} // Enable transparency
                    opacity={0.7} // Set partial transparency
                />
            </mesh>
            <CubeLines /> // Add wireframe lines to the cube
            <WrappingLine /> // Add the wrapping line across faces
            <MovingPoint fuseActive={fuseActive} /> // Add moving point (fuse) with animation control
            <SmallCube position={endPoint} setFuseActive={setFuseActive} /> // Add small cube at end point with fuse control
            {/* TODO: Could add a reset mechanism to restart the fuse */}
        </group>
    );
};

// Component for rendering wireframe lines on cube faces
const CubeLines = () => {
    const linesRef = useRef(); // Reference to the wireframe lines

    useEffect(() => { // Set up wireframe geometry on mount
        if (linesRef.current) { // Check if lines ref is available
            const geometry = new THREE.BoxGeometry(2.5, 2.5, 2.5); // Match cube dimensions
            const edges = new THREE.EdgesGeometry(geometry); // Create edges from geometry
            linesRef.current.geometry = edges; // Assign edges to line segments
        }
    }, []); // Empty dependency array - runs once on mount

    return (
        <lineSegments ref={linesRef}> // Render wireframe as line segments
            <lineBasicMaterial // Material for wireframe lines
                attach="material" // Attach to line segments
                color="black" // Set line color
                linewidth={2} // Set line thickness
            />
        </lineSegments>
    );
};

// Component for a line that wraps around multiple faces
const WrappingLine = () => {
    const lineRef = useRef(); // Reference to the wrapping line

    useEffect(() => { // Set up line geometry on mount
        if (lineRef.current) { // Check if line ref is available
            const points = [ // Define points for the wrapping line path
                new THREE.Vector3(-1.25, -1.25, 1.25), // Front face bottom-left
                new THREE.Vector3(1.25, 1.25, 1.25),   // Front face top-right
                new THREE.Vector3(1.25, 1.25, -1.25),  // Back face top-right
                new THREE.Vector3(0, 0, -1.25)         // Center of the back face
            ];
            const geometry = new THREE.BufferGeometry().setFromPoints(points); // Create geometry from points
            lineRef.current.geometry = geometry; // Assign geometry to the line
        }
    }, []); // Empty dependency array - runs once on mount

    return (
        <line ref={lineRef}> // Render the wrapping line
            <lineBasicMaterial // Material for the wrapping line
                attach="material" // Attach to line
                color="red" // Set line color
                linewidth={3} // Set line thickness
            />
        </line>
    );
    // TODO: modularize this so that we can create random straight paths
};

// Component for a point moving along the wrapping line
const MovingPoint = ({ fuseActive }) => {
    const pointRef = useRef(); // Reference to the moving point mesh
    const [t, setT] = useState(0); // Parametric parameter from 0 to 1 for animation

    const points = [ // Define points for the fuse path (duplicates WrappingLine)
        new THREE.Vector3(-1.25, -1.25, 1.25), // Start: Front face bottom-left
        new THREE.Vector3(1.25, 1.25, 1.25),   // Front face top-right
        new THREE.Vector3(1.25, 1.25, -1.25),  // Back face top-right
        new THREE.Vector3(0, 0, -1.25)         // End: Center of the back face
    ];
    // FIXME: we need to create a parameter for taking in a points array, otherwise we'll be duplicating lines everywhere

    // Animation using useFrame, only if fuse is active
    useFrame(() => { // Update position every frame
        if (pointRef.current && fuseActive) { // Only animate if ref exists and fuse is active
            setT((prev) => (prev + 0.005) % 1); // Increment t and loop from 0 to 1

            const segmentCount = points.length - 1; // Number of segments (3)
            const segmentIndex = Math.floor(t * segmentCount); // Determine current segment
            const segmentT = (t * segmentCount) % 1; // Local t within segment (0 to 1)

            const startPoint = points[segmentIndex]; // Get start point of current segment
            const endPoint = points[Math.min(segmentIndex + 1, points.length - 1)]; // Get end point

            const position = new THREE.Vector3() // Calculate position using parametric equation
                .copy(startPoint) // Start at segment’s start point
                .lerp(endPoint, segmentT); // Interpolate to end point based on t

            pointRef.current.position.copy(position); // Update point’s position
        }
    });
    // TODO: What do different easing styles look like here?

    return (
        <mesh ref={pointRef}> // Render the moving point as a sphere
            <sphereGeometry args={[0.1, 32, 32]} /> // Small sphere with radius 0.1
            <meshStandardMaterial color="yellow" /> // Yellow material for visibility
        </mesh>
    );
};

// Component for a small cube centered at a given position
const SmallCube = ({ position, setFuseActive }) => {
    const cubeRef = useRef(); // Reference to the small cube mesh

    useEffect(() => { // Update position when prop changes
        if (cubeRef.current && position) { // Check if ref and position are available
            cubeRef.current.position.copy(position); // Set cube position to prop value
        }
    }, [position]); // Dependency on position prop

    // Handle click to stop the fuse
    const handleClick = () => { // Function to stop fuse animation on click
        setFuseActive(false); // Set fuseActive to false to halt MovingPoint
    };

    return (
        <mesh ref={cubeRef} onClick={handleClick}> // Render small cube with click handler
            <boxGeometry args={[0.2, 0.2, 0.2]} /> // Small cube with 0.2 units per side
            <meshStandardMaterial color="red" /> // Red material for visibility
        </mesh>
    );
    // TODO: Small size makes it hard to click - consider increasing size or adding a visual cue
};

// Main scene component
const Scene = () => {
    const defaultRotationSpeed = 0.05; // Default speed for auto-rotation
    const [spinToggle, setSpinToggle] = useState(false); // State to toggle auto-rotation
    const [rotationSpeed, setRotationSpeed] = useState(defaultRotationSpeed); // State for rotation speed

    useEffect(() => { // Handle keyboard inputs for scene controls
        const handleKeyPress = (event) => { // Process key presses
            if (event.key.toLowerCase() === 'r') { // Toggle rotation with 'r'
                setSpinToggle((prev) => !prev); // Invert spin state
            } else if (event.key === '1') { // Increase speed with '1'
                setRotationSpeed((prev) => prev + 0.02); // Increment speed
            } else if (event.key === '2') { // Decrease speed with '2'
                setRotationSpeed((prev) => prev - 0.02); // Decrement speed
            }
        };
        window.addEventListener('keydown', handleKeyPress); // Add keydown listener
        return () => window.removeEventListener('keydown', handleKeyPress); // Cleanup on unmount
    }, []); // Empty dependency array - runs once on mount

    return (
        <Canvas // Render the 3D canvas
            style={{ height: '70vh', width: '100%', display: 'block' }} // Set canvas dimensions and style
            camera={{ position: [0, 0, 5] }} // Position camera 5 units away on Z axis
        >
            <ambientLight intensity={0.5} /> // Add soft ambient lighting
            <directionalLight position={[10, 15, 5]} intensity={5} /> // Add directional light source
            <Cube // Render the Cube component
                spinToggle={spinToggle} // Pass auto-rotation state
                rotationSpeed={rotationSpeed} // Pass rotation speed
                setSpinToggle={setSpinToggle} // Pass setter for spin toggle
            />
        </Canvas>
    );
};

export default Scene; // Export Scene as default export