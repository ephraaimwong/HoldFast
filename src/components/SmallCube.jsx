import React from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

const SmallCube = ({ position, setFuseActive, onSmallCubeClick, color = "red", scale = 1 }) => {
    const { camera } = useThree();

    const handleClick = (e) => {
        e.stopPropagation();
        setFuseActive(false);
        onSmallCubeClick();
    };

    return (
        <mesh position={position} onClick={handleClick} scale={scale}>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial color={color} />
        </mesh>
    );
};

export default SmallCube; 