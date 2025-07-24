
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ExhaustSmokeProps {
  position: THREE.Vector3;
  isAccelerating: boolean;
  isBoosting?: boolean;
}

export default function ExhaustSmoke({ position, isAccelerating, isBoosting = false }: ExhaustSmokeProps) {
  const particlesRef = useRef<THREE.Points>(null);
  const timeRef = useRef(0);
  
  const particleCount = 80;
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const lifetimes = new Float32Array(particleCount);
    const opacities = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      // Start particles at exhaust position
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;
        
      // Random velocities - more spread and upward motion
      velocities[i * 3] = (Math.random() - 0.5) * 0.4;
      velocities[i * 3 + 1] = Math.random() * 0.8 + 0.5; // More upward velocity
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
      
      sizes[i] = Math.random() * 0.3 + 0.1; // Larger particles
      lifetimes[i] = Math.random() * 2 + 1;
      opacities[i] = Math.random() * 0.8 + 0.2;
    }
    
    return { positions, velocities, sizes, lifetimes, opacities };
  }, [particleCount]);
  
  useFrame((state, delta) => {
    if (!particlesRef.current || !isAccelerating) return;
    
    timeRef.current += delta;
    const positionAttribute = particlesRef.current.geometry.attributes.position;
    const positions = positionAttribute.array as Float32Array;
    
    // Control active particle count based on boost state
    const activeParticleCount = isBoosting ? particleCount : Math.floor(particleCount * 0.7);
    
    for (let i = 0; i < activeParticleCount; i++) {
      // Update particle lifetime
      particles.lifetimes[i] -= delta;
      
      if (particles.lifetimes[i] <= 0) {
        // Reset particle at exhaust position
        positions[i * 3] = (Math.random() - 0.5) * 0.5;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
        particles.lifetimes[i] = Math.random() * 3 + 1;
        
        // Randomize velocity - more intense when boosting
        const velocityMultiplier = isBoosting ? 2.0 : 1.2;
        particles.velocities[i * 3] = (Math.random() - 0.5) * 0.6 * velocityMultiplier;
        particles.velocities[i * 3 + 1] = (Math.random() * 1.0 + 0.8) * velocityMultiplier;
        particles.velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.6 * velocityMultiplier;
      } else {
        // Update position based on velocity
        positions[i * 3] += particles.velocities[i * 3] * delta;
        positions[i * 3 + 1] += particles.velocities[i * 3 + 1] * delta;
        positions[i * 3 + 2] += particles.velocities[i * 3 + 2] * delta;
        
        // Add some wind effect and drag
        positions[i * 3] += Math.sin(timeRef.current * 2 + i) * 0.02;
        particles.velocities[i * 3 + 1] *= 0.98; // Slow down over time
      }
    }
    
    // Hide inactive particles by moving them far away
    for (let i = activeParticleCount; i < particleCount; i++) {
      positions[i * 3] = -10000;
      positions[i * 3 + 1] = -10000;
      positions[i * 3 + 2] = -10000;
    }
    
    positionAttribute.needsUpdate = true;
  });
  
  if (!isAccelerating) return null;
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={isBoosting ? 0.4 : 0.25}
        color={isBoosting ? "#FF6B00" : "#888888"}
        transparent
        opacity={isBoosting ? 0.9 : 0.7}
        sizeAttenuation={true}
        alphaTest={0.1}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
