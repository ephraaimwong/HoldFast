import React, { useRef, useState, useEffect } from 'react';
import { useFrame, Canvas } from '@react-three/fiber';
import * as THREE from 'three';
// import { Sphere, OrbitControls } from '@react-three/drei';
// import gsap from 'gsap';

const Cube = ({ spinToggle, setSpinToggle, rotationSpeed }) => {
    const cubeRef = useRef();
    // const defaultRotationSpeed = 0.05;
    // rotationSpeed = defaultRotationSpeed
    const[isDragged, setIsDragged] = useState(false); 
    const[lastMousePos, setLastMousePos] = useState(null); 
    
    useEffect(()=> { 
        if(spinToggle && !isDragged){ 
            const interval = setInterval(() => { 
                if(cubeRef.current){ 
                    cubeRef.current.rotation.x += rotationSpeed; 
                    cubeRef.current.rotation.y += rotationSpeed; 
                } 
            },16); //update at 60 fps 
            return () => clearInterval(interval); 
        } 
    }, [spinToggle, isDragged, rotationSpeed]); 

    const handlePointerDown = (event) => { 
        setIsDragged(true); 
        setLastMousePos({x:event.clientX, y:event.clientY}); 
        setSpinToggle(false); //stop spinning when cube is dragged 

        //add global event listeners
        window.addEventListener('mousemove', handlePointerMove);
        window.addEventListener('mouseup', handlePointerUp);
    }; 

    // const handlePointerMove = (event) => {  
    //     if(isDragged && lastMousePos){ 
    //         const displacedX = event.clientX - lastMousePos.x; 
    //         const displacedY = event.clientY - lastMousePos.y; 
    //         if(cubeRef.current){ 
    //             cubeRef.current.rotation.y -= displacedX * 0.01; 
    //             cubeRef.current.rotation.x += displacedY * 0.01; 
    //         } 
    //         setLastMousePos({x: event.clientX, y: event.clientY}); 
    //     } 
    // }; 
    const handlePointerMove = (event) => {  
        if (isDragged && lastMousePos) { 
            const deltaX = event.clientX - lastMousePos.x; 
            const deltaY = event.clientY - lastMousePos.y; 
    
            if (cubeRef.current) { 
                // Create Euler rotation based on mouse movement
                const eulerRotation = new THREE.Euler(
                    deltaY * 0.005,  // Invert Y-axis for natural movement
                    deltaX * 0.005,  // Left/right movement
                    0,
                    'XYZ'
                );
    
                // Apply rotation as a quaternion
                const quaternion = new THREE.Quaternion();
                quaternion.setFromEuler(eulerRotation);
    
                // Apply the quaternion rotation to the cube
                cubeRef.current.quaternion.multiplyQuaternions(quaternion, cubeRef.current.quaternion);
            } 
    
            setLastMousePos({ x: event.clientX, y: event.clientY }); 
        } 
    };

    const handlePointerUp = () => { 
        setIsDragged(false); //release mouse drag logic 
        setTimeout(() => setSpinToggle(true), 100); //resume auto rotation after 100ms

        //remove global event listeners
        window.removeEventListener('mousemove', handlePointerMove);
        window.removeEventListener('mouseup', handlePointerUp);
    }; 

  return (
    //mesh for 3d objects
    <mesh
      ref={cubeRef}
      position={[0,0,0]} //center cube in canvas
      onPointerDown= {handlePointerDown} 
    //   onPointerMove = {handlePointerMove} 
    //   onPointerUp={handlePointerUp} 
    //   onPointerLeave={handlePointerUp} 
    >
    
    <boxGeometry args={[1,1,1]}/>
    <meshStandardMaterial color={spinToggle ? 'hotpink' : 'green'}/>
    </mesh>
  )
}

    const Scene = () => {
        const defaultRotationSpeed = 0.05;
        const[spinToggle, setSpinToggle]=useState(false);
        const[rotationSpeed, setRotationSpeed]=useState(defaultRotationSpeed);
        
        // rotationSpeed = defaultRotationSpeed

        useEffect(()=> {
            const handleKeyPress = (event) => {
                if(event.key.toLowerCase() === 'r'){
                    setSpinToggle((prev) => !prev);
                } else if(event.key === '1'){
                    setRotationSpeed((prev)=>prev + 0.01); //speed up
                }else if(event.key === '2'){
                    setRotationSpeed((prev)=>prev - 0.01); //slow down
                } 
            };
            window.addEventListener('keydown', handleKeyPress);
            return () => window.removeEventListener('keydown', handleKeyPress);
        },[]);

        return (
            <Canvas style={{height: '70vh', width: '100%', display:'block'}} camera={{position: [0,0,5]}}>
                <ambientLight intensity={.5}/>
                <directionalLight position={[10,15,5]} intensity={5}/>{/*position[x,y,z] */}
                <Cube spinToggle={spinToggle} rotationSpeed={rotationSpeed} setSpinToggle={setSpinToggle}/>


            </Canvas>
        );
    };
    

export default Scene;
