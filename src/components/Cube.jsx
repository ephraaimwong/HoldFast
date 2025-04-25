import React, { useRef, useState, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import WrappingLine from './WrappingLine';
import MovingPoint from './MovingPoint';
import CubeLines from './CubeLines';
import SmallCube from './SmallCube';

const Cube = ({ position, rotationSpeed, controlsRef, cubeIndex, onCubeClick, isGameRunning }) => {
    const cubeRef = useRef();
    const wrappingLineRef = useRef();
    const [isDragged, setIsDragged] = useState(false);
    const [lastMousePos, setLastMousePos] = useState(null);
    const [spinToggle, setSpinToggle] = useState(true);
    const [fuseActive, setFuseActive] = useState(true);
    const [endPoint, setEndPoint] = useState(new THREE.Vector3(0, 0, -1.25));
    const keyRotationSpeed = 2;

    // Generate a unique seed based on the cube index
    const uniqueSeed = useMemo(() => {
        return Math.random() * 1000 + cubeIndex * 1000;
    }, [cubeIndex]);

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

    const handlePointsGenerated = (points) => {
        if (points && points.length > 0) {
            setEndPoint(points[points.length - 1]);
        }
    };

    const handleCubeClick = () => {
        if (!isDragged && wrappingLineRef.current) {
            wrappingLineRef.current.generateRandomPoints();
        }
    };

    const handleSmallCubeClick = () => {
        if (isGameRunning) {
            setFuseActive(false);
            onCubeClick();
        }
    };

    return (
        <group ref={cubeRef} position={position}>
            <mesh position={[0, 0, 0]} onPointerDown={handlePointerDown} onClick={handleCubeClick} castShadow receiveShadow>
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
            <WrappingLine ref={wrappingLineRef} onPointsGenerated={handlePointsGenerated} seed={uniqueSeed} />
            <MovingPoint fuseActive={fuseActive} points={wrappingLineRef.current?.getPoints() || []} />
            <SmallCube position={endPoint} setFuseActive={setFuseActive} onSmallCubeClick={handleSmallCubeClick} />
        </group>
    );
};

export default Cube; 