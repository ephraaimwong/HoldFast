import React, { useState } from 'react';
import * as THREE from 'three';
import ParticleEffect from './ParticleEffect';

const SmallCube = ({ position, setFuseActive, onSmallCubeClick }) => {
    const [showParticles, setShowParticles] = useState(false);

    const handleClick = () => {
        setFuseActive(false);
        setShowParticles(true);
        onSmallCubeClick();
        // Reset particles after animation
        setTimeout(() => setShowParticles(false), 1000);
    };

    return (
        <>
            <mesh position={position} onClick={handleClick}>
                <boxGeometry args={[0.5, 0.5, 0.5]} />
                <meshStandardMaterial color="red" />
            </mesh>
            {showParticles && <ParticleEffect position={position} color="#ffff00" />}
        </>
    );
};

export default SmallCube; 