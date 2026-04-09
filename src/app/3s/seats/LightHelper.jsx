import { useHelper } from "@react-three/drei";
import { useRef } from "react";
import { DirectionalLightHelper } from "three";

const LightHelper = () => {
  const dirLight = useRef(null);
  useHelper(dirLight, DirectionalLightHelper, "red");
  const dirLight1 = useRef(null);
  useHelper(dirLight1, DirectionalLightHelper, "red");
  const dirLight2 = useRef(null);
  useHelper(dirLight2, DirectionalLightHelper, "red");

  return (
    <>
      <ambientLight
        position={[2, 15, 8]}
        intensity={3}
        color={"white"}
        name="exclude"
      />

      {/* <directionalLight
        position={[5, 15, 5]}
        name="key light"
        intensity={10}
        // ref={dirLight}
        // target={[0, 20, 0]}
      /> */}
      {/* <hemisphereLight
        position={[0, 10, 0]}
        name="hemisphere light"
        intensity={6}
        color={"white"}
      /> */}
    </>
  );
};

export default LightHelper;
