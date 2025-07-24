import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { useTukTukGame } from "../lib/stores/useTukTukGame";
import { useGameState } from "../lib/stores/useGameState";

export default function GameUI() {
  const { tukTukPosition } = useTukTukGame();
  const { setSpeed } = useGameState();
  const lastPosition = useRef(tukTukPosition.clone());

  useFrame((state, delta) => {
    // Calculate speed (distance traveled per second) - reduced by half
    const distance = tukTukPosition.distanceTo(lastPosition.current);
    const currentSpeed = distance / delta;
    setSpeed(Math.round(currentSpeed * 3.6 * 0.5)); // Convert to km/h and reduce by half
    
    lastPosition.current.copy(tukTukPosition);
  });

  // Return null since UI will be rendered outside canvas
  return null;
}