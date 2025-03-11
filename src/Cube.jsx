import React, { useRef, useState, useEffect } from 'react';
import { useFrame, Canvas } from '@react-three/fiber';
// import { Sphere, OrbitControls } from '@react-three/drei';
// import gsap from 'gsap';

const Cube = ({ spinToggle, rotationSpeed }) => {
    const cubeRef = useRef();
    // const defaultRotationSpeed = 0.05;
    // rotationSpeed = defaultRotationSpeed
    
    useEffect(()=> {
        if(spinToggle){
            const interval = setInterval(() => {
                if(cubeRef.current){
                    cubeRef.current.rotation.x += rotationSpeed;
                    cubeRef.current.rotation.y += rotationSpeed;
                }
            },16); //update at 60 fps
            return () => clearInterval(interval);
        }
    }, [spinToggle, rotationSpeed]);


  return (
    //mesh for 3d objects
    <mesh
      ref={cubeRef}
      position={[0,0,0]} //center cube in canvas
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
                    setSpinToggle(spinToggle => !spinToggle);
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
                <Cube spinToggle={spinToggle} rotationSpeed={rotationSpeed}/>


            </Canvas>
        );
    };
    

export default Scene;
