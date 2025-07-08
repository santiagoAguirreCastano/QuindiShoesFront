import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

function ModeloGLB({ url }) {
  const gltf = useGLTF(url);

  if (!gltf || !gltf.scene) {
    console.warn("Modelo no cargado o escena no válida:", gltf);
    return null;
  }

  return <primitive object={gltf.scene} />;
}


export default function VisorModeloGLB({ url }) {
  if (!url) return <div className="text-red-500">URL del modelo no válida.</div>;

  return (
    <div className="w-full h-64 bg-gray-100 rounded-md overflow-hidden">
      <Canvas camera={{ position: [0, 1, 5], fov: 50 }}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />
        <Suspense fallback={null}>
          <ModeloGLB url={url} />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  );
}
