import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function CameraController({ selectedSeat, CAMERA_POSITIONS, controlsRef }) {
  const { camera } = useThree();

  const targetPosition = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());
  const speed = 0.1;

  useEffect(() => {
    const config = CAMERA_POSITIONS[selectedSeat];
    targetPosition.current.set(...config.position);
    targetLookAt.current.set(...config.target);
  }, [selectedSeat, CAMERA_POSITIONS]);

  useFrame(() => {
    if (!controlsRef?.current) return;

    camera.position.lerp(targetPosition.current, speed);
    controlsRef.current.target.lerp(targetLookAt.current, speed);
    controlsRef.current.update();
  });

  return null;
}