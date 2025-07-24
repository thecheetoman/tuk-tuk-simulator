import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export default function IndianBuildings() {
  // Load the generated 3D models
  const { scene: apartmentScene } = useGLTF("/models/indian_apartment.glb");
  const { scene: shopScene } = useGLTF("/models/indian_shop.glb");
  
  // Create Indian-style buildings with realistic 3D models
  const buildings = useMemo(() => {
    const buildingArray: any[] = [];
    
    // Pre-defined building positions for better performance
    const buildingData = [
      { x: -30, z: -40, type: 'apartment', scale: [2.5, 2.5, 2.5], rotation: 0 },
      { x: 40, z: -30, type: 'shop', scale: [2, 2, 2], rotation: Math.PI / 4 },
      { x: -50, z: 20, type: 'apartment', scale: [3, 3, 3], rotation: Math.PI / 2 },
      { x: 30, z: 40, type: 'shop', scale: [1.8, 1.8, 1.8], rotation: -Math.PI / 3 },
      { x: -20, z: 60, type: 'apartment', scale: [2.8, 2.8, 2.8], rotation: Math.PI },
      { x: 60, z: -10, type: 'shop', scale: [2.2, 2.2, 2.2], rotation: Math.PI / 6 },
      { x: -70, z: -20, type: 'apartment', scale: [2.6, 2.6, 2.6], rotation: -Math.PI / 2 },
      { x: 10, z: 70, type: 'shop', scale: [1.9, 1.9, 1.9], rotation: Math.PI / 3 },
      { x: 80, z: 15, type: 'apartment', scale: [3.2, 3.2, 3.2], rotation: -Math.PI / 4 },
      { x: -40, z: -70, type: 'shop', scale: [2.1, 2.1, 2.1], rotation: 2 * Math.PI / 3 }
    ];
    
    buildingData.forEach((building, i) => {
      buildingArray.push({
        id: i,
        position: [building.x, 0, building.z],
        scale: building.scale,
        rotation: building.rotation,
        type: building.type
      });
    });
    
    return buildingArray;
  }, []);

  return (
    <group>
      {buildings.map((building) => (
        <group key={building.id}>
          {/* Use realistic 3D models instead of basic shapes */}
          <primitive 
            object={building.type === 'apartment' ? apartmentScene.clone() : shopScene.clone()}
            position={building.position as [number, number, number]} 
            scale={building.scale as [number, number, number]}
            rotation={[0, building.rotation, 0]}
            castShadow 
            receiveShadow
          />
        </group>
      ))}
    </group>
  );
}