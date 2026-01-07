import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";

function BrainSphere() {
  const mesh = useRef();
  useFrame(() => {
    mesh.current.rotation.y += 0.002;
    mesh.current.rotation.x += 0.001;
  });

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[2.2, 64, 64]} />
      <meshStandardMaterial wireframe color="#2563eb" transparent opacity={0.6}/>
    </mesh>
  );
}

export default function AIBrain() {
  return (
    <Canvas camera={{ position: [0, 0, 6] }} style={{ position:"absolute", inset:0 }}>
      <ambientLight intensity={0.6} />
      <pointLight position={[5,5,5]} />
      <BrainSphere />
    </Canvas>
  );
}
