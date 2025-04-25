import React, { useRef, useState } from 'react';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import Cube from './Cube';

const Scene = ({ controlsRef, showGridHelper, showAxesHelper }) => {
    const [spinToggle, setSpinToggle] = useState(true);
    const [fuseActive, setFuseActive] = useState(true);
    const rotationSpeed = 0.01;

    return (
        <>
            <OrbitControls ref={controlsRef} />
            {showGridHelper && <gridHelper args={[20, 20]} />}
            {showAxesHelper && <axesHelper args={[5]} />}
            <ambientLight intensity={0.5} />
            <directionalLight
                position={[5, 5, 5]}
                intensity={1}
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
            />
            <Cube
                spinToggle={spinToggle}
                setSpinToggle={setSpinToggle}
                rotationSpeed={rotationSpeed}
                controlsRef={controlsRef}
                fuseActive={fuseActive}
                setFuseActive={setFuseActive}
            />
        </>
    );
};

export default Scene; 