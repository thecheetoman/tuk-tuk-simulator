import { useMemo } from "react";
import * as THREE from "three";

export default function TelephonePoles() {
  // Fixed telephone pole positions with wires connecting them
  const poles = useMemo(() => [
    { position: [-180, 6, -120], id: 0 },
    { position: [-90, 6, -120], id: 1 },
    { position: [0, 6, -120], id: 2 },
    { position: [90, 6, -120], id: 3 },
    { position: [180, 6, -120], id: 4 }
  ], []);

  // Create wire connections between poles
  const wires = useMemo(() => {
    const wireConnections = [];
    for (let i = 0; i < poles.length - 1; i++) {
      const startPole = poles[i];
      const endPole = poles[i + 1];
      
      // Calculate wire position and rotation
      const midX = (startPole.position[0] + endPole.position[0]) / 2;
      const distance = Math.abs(endPole.position[0] - startPole.position[0]);
      
      wireConnections.push({
        position: [midX, 7, -120],
        length: distance,
        id: i
      });
    }
    return wireConnections;
  }, [poles]);

  return (
    <group>
      {/* Telephone poles with collision */}
      {poles.map((pole) => (
        <group key={`pole-${pole.id}`}>
          {/* Main pole */}
          <mesh 
            position={pole.position as [number, number, number]} 
            castShadow 
            userData={{ collision: true }}
          >
            <cylinderGeometry args={[0.3, 0.3, 12, 8]} />
            <meshLambertMaterial color="#8B4513" />
          </mesh>
          
          {/* Crossbeam */}
          <mesh 
            position={[pole.position[0], pole.position[1] + 5, pole.position[2]]} 
            castShadow
          >
            <boxGeometry args={[3, 0.3, 0.3]} />
            <meshLambertMaterial color="#654321" />
          </mesh>
          
          {/* Insulators */}
          <mesh 
            position={[pole.position[0] - 1, pole.position[1] + 5.2, pole.position[2]]} 
            castShadow
          >
            <cylinderGeometry args={[0.1, 0.1, 0.4, 6]} />
            <meshLambertMaterial color="#8FBC8F" />
          </mesh>
          
          <mesh 
            position={[pole.position[0] + 1, pole.position[1] + 5.2, pole.position[2]]} 
            castShadow
          >
            <cylinderGeometry args={[0.1, 0.1, 0.4, 6]} />
            <meshLambertMaterial color="#8FBC8F" />
          </mesh>
        </group>
      ))}
      
      {/* Power lines/wires connecting poles horizontally */}
      {wires.map((wire) => (
        <group key={`wire-${wire.id}`}>
          {/* Main power line - rotated to be horizontal */}
          <mesh 
            position={wire.position as [number, number, number]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.02, 0.02, wire.length, 4]} />
            <meshLambertMaterial color="#2F2F2F" />
          </mesh>
          
          {/* Secondary line - also horizontal */}
          <mesh 
            position={[wire.position[0], wire.position[1] - 0.5, wire.position[2]]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.02, 0.02, wire.length, 4]} />
            <meshLambertMaterial color="#2F2F2F" />
          </mesh>
        </group>
      ))}
    </group>
  );
}