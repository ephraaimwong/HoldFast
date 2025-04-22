import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';
import MirrorRoom from './MirrorRoom';

const Cube = ({ spinToggle, setSpinToggle, rotationSpeed, controlsRef }) => {
    const cubeRef = useRef();
    const [isDragged, setIsDragged] = useState(false);
    const [lastMousePos, setLastMousePos] = useState(null);
    const keyRotationSpeed = 2;
    const [fuseActive, setFuseActive] = useState(true);

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
        event.stopPropagation();
        if (controlsRef?.current) {
            controlsRef.current.enabled = false;
        }
        setIsDragged(true);
        setLastMousePos({ x: event.clientX, y: event.clientY });
        setSpinToggle(false);
        console.log('Cube dragged');
    };

    const handlePointerMove = (event) => {
        if (isDragged && lastMousePos && cubeRef.current) {
            const { innerWidth, innerHeight } = window;
            const deltaX = event.movementX * 1.5 / innerWidth;
            const deltaY = event.movementY * 1.5 / innerHeight;
            const eulerRotation = new THREE.Euler(
                deltaY * Math.PI,
                deltaX * Math.PI,
                0,
                'XYZ'
            );
            const quaternion = new THREE.Quaternion();
            quaternion.setFromEuler(eulerRotation);
            cubeRef.current.quaternion.multiplyQuaternions(quaternion, cubeRef.current.quaternion);
            setLastMousePos({ x: event.clientX, y: event.clientY });
        }
    };

    const handlePointerUp = () => {
        setIsDragged(false);
        if (controlsRef?.current) {
            controlsRef.current.enabled = true;
        }
    };

    const endPoint = new THREE.Vector3(0, 0, -1.25);

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
        </group>
    );
};

const CubeLines = () => {
    const linesRef = useRef();

    useEffect(() => {
        if (linesRef.current) {
            const geometry = new THREE.BoxGeometry(2.5, 2.5, 2.5);
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

const WrappingLine = () => {
    const lineRef = useRef();

    useEffect(() => {
        if (lineRef.current) {
            const points = [
                new THREE.Vector3(-1.25, -1.25, 1.25),
                new THREE.Vector3(1.25, 1.25, 1.25),
                new THREE.Vector3(1.25, 1.25, -1.25),
                new THREE.Vector3(0, 0, -1.25)
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
};

const MovingPoint = ({ fuseActive }) => {
    const pointRef = useRef();
    const [t, setT] = useState(0);
    const trail = useRef([]);

    const points = [
        new THREE.Vector3(-1.25, -1.25, 1.25),
        new THREE.Vector3(1.25, 1.25, 1.25),
        new THREE.Vector3(1.25, 1.25, -1.25),
        new THREE.Vector3(0, 0, -1.25)
    ];

    useFrame(({ clock }) => {
        if (pointRef.current && fuseActive) {
            const time = clock.getElapsedTime();
            setT((prev) => (prev + 0.005) % 1);
            const segmentCount = points.length - 1;
            const segmentIndex = Math.floor(t * segmentCount);
            const segmentT = (t * segmentCount) % 1;
            const startPoint = points[segmentIndex];
            const endPoint = points[Math.min(segmentIndex + 1, points.length - 1)];
            const position = new THREE.Vector3()
                .copy(startPoint)
                .lerp(endPoint, segmentT);
            pointRef.current.position.copy(position);
            const flicker = 0.8 + Math.sin(time * 20 + t * 10) * 0.2;
            pointRef.current.scale.set(flicker, flicker, flicker);
            pointRef.current.material.emissiveIntensity = 2 + Math.sin(time * 30) * 1;
            pointRef.current.material.opacity = 0.5 + Math.random() * 0.3;
            console.log('MovingPoint position:', position.toArray());
        }
    });

    return (
        <>
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

        {trail.current.map((entry,i)=>(
            <mesh key={i} position={entry.position}>
                <sphereGeometry args={[0.08-i*0.005,12,12]}/>
                <meshStandardMaterial color="orange" emissive="orange" emissiveIntensity={1.5-i*0.1} transparent opacity={0.4-i*0.3}/>
            </mesh>
        ))}
        </>
    );
};

const SmallCube = ({ position, setFuseActive }) => {
    const cubeRef = useRef();

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
};

const Scene = () => {
    const [pos, setPos] = useState([10, 10, 10]);
    const controlsRef = useRef();
    const activeKeys = useRef(new Set());
    const lightSpeed = 300; // Units per second
    const [spinToggle, setSpinToggle] = useState(false);
    const [rotationSpeed, setRotationSpeed] = useState(0.05);

    useEffect(() => {
        const handleKeyDown = (event) => {
            const key = event.key.toLowerCase();
            activeKeys.current.add(key);
            if (["i", "j", "k", "l"].includes(key)) {
                event.preventDefault();
                console.log('Sphere key:', key);
            }
            if(event.key === 'r'){
                setSpinToggle((prev) => !prev);
            }else if (event.key ==='1'){
                setRotationSpeed((prev) => prev + 0.02);
            } else if (event.key === '2'){
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
                gl.shadowMap.type = THREE.PCFSoftShadowMap;
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
            <ambientLight intensity={0.1} />
            <spotLight
                position={pos}
                angle={Math.PI / 4}
                penumbra={0.5}
                intensity={2000}
                castShadow
                color="white"
                distance={50}
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                target-position={[0, 0, 0]}
            />
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
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow castShadow>
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial color="white" roughness={0.5} metalness={0.2} />
            </mesh>
            {/* <gridHelper args={[50, 50, '#ffffff', '#444444']} />
            <axesHelper args={[10]} /> */}
            <MirrorRoom/>
            <OrbitControls ref={controlsRef} />
        </>
    );
};

export default Scene;