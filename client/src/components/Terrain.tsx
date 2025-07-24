import { useTexture } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

export default function Terrain() {
  const grassTexture = useTexture("/textures/grass.png");
  const dirtTexture = useTexture("/textures/sand.jpg");

  // Configure textures for much larger terrain
  grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
  grassTexture.repeat.set(500, 500);
  
  dirtTexture.wrapS = dirtTexture.wrapT = THREE.RepeatWrapping;
  dirtTexture.repeat.set(250, 250);

  // Irregular roads with imperfect edges
  const roads = useMemo(() => {
    const roadSegments = [];
    
    // Main cross roads through center with irregular edges
    const mainRoadPoints = [
      { x: 0, z: -300, width: 25 + Math.sin(0) * 3 },
      { x: 0, z: -200, width: 25 + Math.sin(1) * 4 },
      { x: 0, z: -100, width: 25 + Math.sin(2) * 2 },
      { x: 0, z: 0, width: 25 + Math.sin(3) * 5 },
      { x: 0, z: 100, width: 25 + Math.sin(4) * 3 },
      { x: 0, z: 200, width: 25 + Math.sin(5) * 4 },
      { x: 0, z: 300, width: 25 + Math.sin(6) * 2 }
    ];
    
    const crossRoadPoints = [
      { x: -300, z: 0, width: 25 + Math.cos(0) * 3 },
      { x: -200, z: 0, width: 25 + Math.cos(1) * 4 },
      { x: -100, z: 0, width: 25 + Math.cos(2) * 2 },
      { x: 0, z: 0, width: 25 + Math.cos(3) * 5 },
      { x: 100, z: 0, width: 25 + Math.cos(4) * 3 },
      { x: 200, z: 0, width: 25 + Math.cos(5) * 4 },
      { x: 300, z: 0, width: 25 + Math.cos(6) * 2 }
    ];
    
    // Create segments for main roads
    for (let i = 0; i < mainRoadPoints.length - 1; i++) {
      const current = mainRoadPoints[i];
      const next = mainRoadPoints[i + 1];
      roadSegments.push({
        position: [current.x, 0.01, (current.z + next.z) / 2],
        rotation: [-Math.PI / 2, 0, 0],
        size: [(current.width + next.width) / 2, Math.abs(next.z - current.z)]
      });
    }
    
    for (let i = 0; i < crossRoadPoints.length - 1; i++) {
      const current = crossRoadPoints[i];
      const next = crossRoadPoints[i + 1];
      roadSegments.push({
        position: [(current.x + next.x) / 2, 0.01, current.z],
        rotation: [-Math.PI / 2, 0, Math.PI / 2],
        size: [(current.width + next.width) / 2, Math.abs(next.x - current.x)]
      });
    }
    
    // Add some connecting roads with irregularities
    roadSegments.push(
      { position: [75, 0.01, 75], rotation: [-Math.PI / 2, 0, Math.PI / 4], size: [18, 150] },
      { position: [-75, 0.01, 75], rotation: [-Math.PI / 2, 0, -Math.PI / 4], size: [18, 150] },
      { position: [75, 0.01, -75], rotation: [-Math.PI / 2, 0, -Math.PI / 4], size: [18, 150] },
      { position: [-75, 0.01, -75], rotation: [-Math.PI / 2, 0, Math.PI / 4], size: [18, 150] }
    );
    
    return roadSegments;
  }, []);

  // Fixed hill positions - away from central dirt area and rivers (x = ±400)
  const hills = useMemo(() => [
    { position: [-250, 8, -250], size: [40, 16, 40], color: "#228B22" },
    { position: [280, 12, -280], size: [50, 24, 50], color: "#32CD32" },
    { position: [-300, 10, 280], size: [45, 20, 45], color: "#90EE90" },
    { position: [220, 15, 220], size: [55, 30, 55], color: "#228B22" },
    { position: [-350, 6, -180], size: [35, 12, 35], color: "#32CD32" },
    { position: [160, 11, 300], size: [48, 22, 48], color: "#90EE90" },
    { position: [-280, 9, -350], size: [42, 18, 42], color: "#228B22" },
    { position: [280, 13, -220], size: [52, 26, 52], color: "#32CD32" }
  ], []);

  // Fixed tree positions - no teleporting
  const trees = useMemo(() => {
    const treePositions: any[] = [];
    const fixedPositions = [
      [-100, -200], [120, -180], [-80, 160], [90, 140], [-110, 120],
      [130, -160], [-90, -140], [110, 180], [-130, -120], [80, -190],
      [140, 170], [-140, -170], [170, 140], [-170, -140], [190, -80],
      [-190, 80], [80, 190], [-80, -190], [200, 100], [-200, -100],
      [100, 200], [-100, -200], [250, -50], [-250, 50], [50, 250],
      [-50, -250], [300, 0], [-300, 0], [0, 300], [0, -300],
      [220, 160], [-220, -160], [160, 220], [-160, -220], [260, -120],
      [-260, 120], [120, 260], [-120, -260], [180, -240], [-180, 240],
      [240, 180], [-240, -180], [270, -80], [-270, 80], [80, 270],
      [-80, -270], [150, -280], [-150, 280], [280, 150], [-280, -150]
    ];

    fixedPositions.forEach(([x, z], i) => {
      // Avoid roads and buildings
      if (Math.abs(x) > 30 || Math.abs(z) > 30) {
        treePositions.push({
          id: i,
          position: [x, 0, z],
          isDead: i % 4 === 0 // Some dead trees
        });
      }
    });

    return treePositions;
  }, []);

  // Much more trash scattered around - no collisions
  const trash = useMemo(() => {
    const trashItems: any[] = [];
    const trashPositions = [
      // Dense trash in central area
      [-25, -35], [35, -25], [-45, 15], [25, 35], [-15, 55], [55, -15], [-65, -25], [15, 65], [75, 10], [-35, -65],
      [45, 45], [-55, -45], [65, -35], [-75, 35], [85, -55], [-85, 55], [95, 25], [-95, -25], [105, -85], [-105, 85],
      [25, 105], [-25, -105], [115, 15], [-115, -15], [125, -45], [-125, 45], [135, 75], [-135, -75], [145, -105], [-145, 105],
      
      // Scattered small trash pieces
      [-12, -18], [27, -33], [-38, 8], [19, 42], [-7, 63], [48, -8], [-59, -18], [8, 71], [82, 3], [-28, -71],
      [52, 38], [-48, -52], [72, -28], [-68, 28], [92, -48], [-78, 62], [108, 18], [-88, -18], [118, -78], [-98, 92],
      [32, 112], [-18, -98], [128, 8], [-108, -8], [138, -38], [-118, 52], [148, 82], [-128, -68], [158, -98], [-138, 118],
      
      // More dense areas of trash
      [-5, -12], [18, -28], [-31, 5], [14, 37], [-3, 58], [41, -5], [-52, -15], [5, 68], [79, 1], [-25, -68],
      [49, 35], [-45, -49], [69, -25], [-65, 25], [89, -45], [-75, 59], [105, 15], [-85, -15], [115, -75], [-95, 89],
      [29, 109], [-15, -95], [125, 5], [-105, -5], [135, -35], [155, 35], [-155, -35], [165, -65], [-165, 65], [175, 95],
      
      // Road-side trash
      [22, -8], [-18, 12], [33, 3], [-27, -7], [44, 18], [-38, -22], [51, -12], [-41, 28], [62, 7], [-58, -33],
      [73, 22], [-67, -17], [84, -3], [-78, 38], [91, 13], [-87, -28], [102, -18], [-96, 43], [113, 8], [-107, -38],
      
      // Building perimeter trash
      [-33, -42], [42, -32], [-52, 22], [32, 42], [-22, 62], [62, -12], [-72, -22], [12, 72], [82, 12], [-42, -72],
      [55, 47], [-57, -47], [67, -37], [-77, 37], [87, -57], [-87, 57], [97, 27], [-97, -27], [107, -87], [-107, 87],
      
      // Random scattered pieces everywhere
      [11, -19], [-13, 21], [31, -11], [-29, 13], [51, 9], [-49, -9], [71, -31], [-69, 33], [91, 11], [-89, -13],
      [17, 39], [-19, -37], [37, 17], [-35, -19], [57, -39], [-59, 41], [77, 19], [-79, -17], [97, -41], [-99, 43],
      [23, 61], [-21, -59], [43, 23], [-41, -21], [63, -61], [-61, 63], [83, 21], [-81, -23], [103, -63], [-101, 61],
      
      // Outer area trash
      [155, -25], [-155, 25], [175, -55], [-175, 55], [195, 15], [-195, -15], [215, -45], [-215, 45], [235, 25], [-235, -25],
      [255, -65], [-255, 65], [275, 5], [-275, -5], [295, -35], [-295, 35], [315, 45], [-315, -45], [335, -15], [-335, 15],
      [355, -85], [-355, 85], [375, 35], [-375, -35], [395, -55], [-395, 55], [415, 25], [-415, -25], [435, -75], [-435, 75],
      
      // More random distribution
      [168, 28], [-148, -28], [178, -58], [-158, 72], [188, 102], [-168, -88], [198, -18], [-178, 32], [208, 62], [-188, -48],
      [218, -128], [-198, 142], [228, 92], [-208, -78], [238, -108], [-218, 122], [248, 52], [-228, -38], [258, -68], [-238, 82],
      [268, -28], [-248, 38], [278, -58], [-258, 68], [288, -78], [-268, 88], [298, -98], [-278, 108], [308, -118], [-288, 128],
      [318, 22], [-298, -22], [328, -42], [-308, 52], [338, -62], [-318, 72], [348, -82], [-328, 92], [358, -102], [-338, 112],
      
      // Additional layers for heavy pollution
      [38, -88], [-32, 92], [58, -48], [-52, 52], [78, -68], [-72, 72], [98, -28], [-92, 32], [118, -88], [-112, 92],
      [138, -48], [-132, 52], [158, -68], [-152, 72], [178, -28], [-172, 32], [198, -88], [-192, 92], [218, -48], [-212, 52],
      [238, -68], [-232, 72], [258, -28], [-252, 32], [278, -88], [-272, 92], [298, -48], [-292, 52], [318, -68], [-312, 72],
      
      // Even more scattered trash
      [9, -21], [-11, 23], [29, -13], [-27, 15], [49, 7], [-47, -7], [69, -29], [-67, 31], [89, 9], [-87, -11],
      [15, 37], [-17, -35], [35, 15], [-33, -17], [55, -37], [-57, 39], [75, 17], [-77, -15], [95, -39], [-97, 41],
      [21, 59], [-19, -57], [41, 21], [-39, -19], [61, -59], [-59, 61], [81, 19], [-79, -21], [101, -61], [-99, 59],
      [147, -23], [-153, 27], [167, -53], [-173, 57], [187, 13], [-193, -13], [207, -43], [-213, 47], [227, 23], [-233, -23],
      
      // Final layer of dense trash
      [6, -16], [-8, 18], [26, -6], [-24, 8], [46, 14], [-44, -14], [66, -26], [-64, 28], [86, 6], [-84, -8],
      [106, 36], [-104, -34], [126, 16], [-124, -16], [146, -36], [-144, 38], [166, 16], [-164, -16], [186, -38], [-184, 36],
      [206, 56], [-204, -54], [226, 26], [-224, -26], [246, -56], [-244, 58], [266, 26], [-264, -26], [286, -58], [-284, 56]
    ];

    trashPositions.forEach(([x, z], i) => {
      trashItems.push({
        id: i,
        position: [x, 0.2, z], // Slightly lower to avoid floating
        type: i % 6 // More trash variety
      });
    });

    return trashItems;
  }, []);

  // Create irregular circular dirt area shape
  const dirtAreaGeometry = useMemo(() => {
    const geometry = new THREE.RingGeometry(0, 150, 32, 1);
    const positions = geometry.attributes.position.array as Float32Array;
    
    // Add irregularities to make it more organic
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const z = positions[i + 2];
      const distance = Math.sqrt(x * x + z * z);
      const angle = Math.atan2(z, x);
      
      // Add noise for irregular edges
      const noise = Math.sin(angle * 8) * 15 + Math.cos(angle * 5) * 10 + Math.sin(angle * 12) * 8;
      const newDistance = Math.min(distance + noise, 150);
      
      positions[i] = Math.cos(angle) * newDistance;
      positions[i + 2] = Math.sin(angle) * newDistance;
    }
    
    geometry.attributes.position.needsUpdate = true;
    return geometry;
  }, []);

  return (
    <group>
      {/* Grass terrain for outer areas - much larger */}
      <mesh receiveShadow position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5000, 5000]} />
        <meshLambertMaterial map={grassTexture} />
      </mesh>

      {/* Irregular circular dirt area where buildings are */}
      <mesh receiveShadow position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <primitive object={dirtAreaGeometry} />
        <meshLambertMaterial map={dirtTexture} color="rgb(115, 59, 18)" />
      </mesh>

      {/* Dirt roads with same texture and color as central dirt area */}
      {roads.map((road, index) => (
        <mesh 
          key={`road-${index}`}
          receiveShadow 
          position={road.position as [number, number, number]} 
          rotation={road.rotation as [number, number, number]}
        >
          <planeGeometry args={[road.size[0], road.size[1]]} />
          <meshLambertMaterial map={dirtTexture} color="rgb(115, 59, 18)" />
        </mesh>
      ))}

      {/* Polygon hills with ground texture - not spheres */}
      {hills.map((hill, index) => (
        <mesh 
          key={`hill-${index}`}
          position={hill.position as [number, number, number]} 
          castShadow 
          receiveShadow
          name={`hill-${index}`}
        >
          <coneGeometry args={[hill.size[0] / 2, hill.size[1], 8]} />
          <meshLambertMaterial map={grassTexture} />
        </mesh>
      ))}

      {/* Toxic muddy river */}
      <mesh position={[400, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[80, 800]} />
        <meshLambertMaterial 
          color="#654321" 
          transparent 
          opacity={0.8}
        />
      </mesh>
      
      <mesh position={[-400, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[80, 800]} />
        <meshLambertMaterial 
          color="#654321" 
          transparent 
          opacity={0.8}
        />
      </mesh>

      {/* Fixed trees with collision - no teleporting */}
      {trees.map((tree) => (
        <group key={`tree-${tree.id}`} position={tree.position as [number, number, number]}>
          {/* Tree trunk with collision */}
          <mesh position={[0, 4, 0]} castShadow userData={{ collision: true }}>
            <cylinderGeometry args={[0.5, 0.8, 8, 8]} />
            <meshLambertMaterial color="#8B4513" />
          </mesh>
          {/* Tree foliage with collision */}
          <mesh position={[0, 10, 0]} castShadow userData={{ collision: true }}>
            <sphereGeometry args={[4, 8, 6]} />
            <meshLambertMaterial color={tree.isDead ? "#654321" : "#228B22"} />
          </mesh>
        </group>
      ))}

      {/* Fixed trash scattered around - NO COLLISION */}
      {trash.map((item) => (
        <mesh 
          key={`trash-${item.id}`}
          position={item.position as [number, number, number]}
          castShadow
        >
          <boxGeometry args={
            item.type === 0 ? [0.8, 0.4, 0.6] :
            item.type === 1 ? [0.6, 0.6, 0.6] :
            item.type === 2 ? [1.0, 0.3, 0.4] :
            item.type === 3 ? [0.5, 0.5, 0.8] :
            item.type === 4 ? [0.7, 0.2, 0.5] :
            [0.4, 0.3, 0.6]
          } />
          <meshLambertMaterial color={
            item.type === 0 ? "#8B4513" :
            item.type === 1 ? "#2F4F4F" :
            item.type === 2 ? "#654321" :
            item.type === 3 ? "#696969" :
            item.type === 4 ? "#4A4A4A" :
            "#8B7355"
          } />
        </mesh>
      ))}

      {/* Rock formations with collision - fixed positions */}
      <mesh position={[-120, 3, -200]} castShadow userData={{ collision: true }}>
        <sphereGeometry args={[8, 8, 6]} />
        <meshLambertMaterial color="#696969" />
      </mesh>
      
      <mesh position={[350, 4, 150]} castShadow userData={{ collision: true }}>
        <sphereGeometry args={[10, 8, 6]} />
        <meshLambertMaterial color="#708090" />
      </mesh>

      <mesh position={[-300, 5, 250]} castShadow userData={{ collision: true }}>
        <sphereGeometry args={[12, 8, 6]} />
        <meshLambertMaterial color="#696969" />
      </mesh>

      <mesh position={[280, 6, -280]} castShadow userData={{ collision: true }}>
        <sphereGeometry args={[9, 8, 6]} />
        <meshLambertMaterial color="#708090" />
      </mesh>
    </group>
  );
}