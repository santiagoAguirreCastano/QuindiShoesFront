import React, { useRef, forwardRef, useImperativeHandle} from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { GuardarPersonalizado } from "./GuardarPersonalizado";
import { getZonaIdFromName, getColorHexFromStore } from "../PersonalizadorUtils/utils";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

function AjustarCamaraResponsive() {
  const { camera, size } = useThree();

  useEffect(() => {
    if (size.width < 640) {
      // Pantallas pequeñas
      camera.position.set(0, 1, 6.5); // Aleja la cámara
      camera.fov = 60;
    } else if (size.width < 1024) {
      // Tablets o medianos
      camera.position.set(0, 1, 5.5);
      camera.fov = 55;
    } else {
      // Escritorio
      camera.position.set(0, 1, 4.8);
      camera.fov = 50;
    }
    camera.updateProjectionMatrix(); // Obligatorio
  }, [size.width, camera]);

  return null;
}

function renderNode(node, colores, personalizacion) {
  if (!node) return null;

  if (node.isMesh && node.geometry) {
    const zonaId = getZonaIdFromName(node.name);
    const colorHex = getColorHexFromStore(zonaId, colores, personalizacion);

    return (
      <mesh
        key={node.uuid}
        geometry={node.geometry}
        position={node.position}
        rotation={node.rotation}
        scale={node.scale}
      >
        <meshStandardMaterial color={colorHex || "#cccccc"} />
      </mesh>
    );
  }

  return (
    <group
      key={node.uuid}
      position={node.position}
      rotation={node.rotation}
      scale={node.scale}
    >
      {node.children?.map((child) => renderNode(child, colores, personalizacion))}
    </group>
  );
}
useGLTF.preload("https://res.cloudinary.com/dwdjlk9lv/image/upload/v1751481715/nike_shoes_hupdgv.glb");


// ✅ AQUI: forwardRef para exponer el canvas
const PersonalizadorCanvas = forwardRef((props, ref) => {
  const containerRef = useRef(null);
  const {scene} = useGLTF("https://res.cloudinary.com/dwdjlk9lv/image/upload/v1751481715/nike_shoes_hupdgv.glb");
  const { personalizacion, colores} = GuardarPersonalizado();

  // ✅ Esto permite que el padre acceda al <canvas>
  useImperativeHandle(ref, () => ({
    getCanvas: () => containerRef.current?.querySelector("canvas"),
    getScene: () => scene
  }));

  return (
    <div
      ref={containerRef}
        className="relative w-full h-full bg-white overflow-hidden"
    >
      <Canvas gl={{ preserveDrawingBuffer: true }} className="w-full h-full bg-white">
  <AjustarCamaraResponsive />
        <ambientLight intensity={1.2} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />
        {renderNode(scene, colores, personalizacion)}
        <OrbitControls />
      </Canvas>
    </div>
  );
});

export default PersonalizadorCanvas;
