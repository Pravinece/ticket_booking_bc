import React, { useEffect } from 'react'
import { useAnimations, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

function ModelLoader() {
    let model = useGLTF('/bus.glb')
    let ani = useAnimations(model.animations, model.scene)
        
  return (
    <primitive object={model.scene} position={[-5 ,-3,0]} rotation={[0,0,0]} scale={2}/>
    // <primitive object={model.scene} position={[-2,-2,0]} rotation={[0,1,0]} scale={2}/>
  )
}

export default ModelLoader