import React, { useState } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import ParticleEffect from './ParticleEffect';

const SmallCube = ({ position, setFuseActive, onSmallCubeClick, color = "red", scale = 1 }) => {
    const { camera } = useThree();
    const [showParticles, setShowParticles] = useState(false);

    const handleClick = (e) => {
        e.stopPropagation();
        setFuseActive(false);
        setShowParticles(true);
        onSmallCubeClick();
        // Reset particles after animation
        setTimeout(() => setShowParticles(false), 1000);
    };

    return (
        <>
            <mesh position={position} onClick={handleClick} scale={scale}>
                <boxGeometry args={[0.5, 0.5, 0.5]} />
                <meshStandardMaterial color={color} />
            </mesh>
            {showParticles && <ParticleEffect position={position} color="#ffff00" />}
        </>
    );
};

export default SmallCube; 