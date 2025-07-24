import { useGameState } from "../lib/stores/useGameState";
import FuelMeter from "./FuelMeter";

interface UIOverlayProps {
  isVisible: boolean;
}

export default function UIOverlay({ isVisible }: UIOverlayProps) {
  const { speed, score } = useGameState();

  if (!isVisible) return null;

  return (
    <>
      <div style={{
        position: 'fixed',
        top: '10px',
        left: '10px',
        zIndex: 10000,
        pointerEvents: 'none',
        color: 'white',
        fontFamily: 'Inter, sans-serif',
        fontSize: '16px',
        fontWeight: 'bold',
        textShadow: '2px 2px 4px rgba(0,0,0,0.9)',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        padding: '12px 16px',
        borderRadius: '8px',
        border: '2px solid #ff6600',
        backdropFilter: 'blur(3px)',
        minWidth: '160px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.5)'
      }}>
        <div style={{ marginBottom: '6px', color: '#ff6600', fontSize: '14px' }}>
          Speed: {speed} km/h
        </div>
        <div style={{ color: '#00ff00', fontSize: '14px' }}>
          Score: {score}
        </div>
        <div style={{ 
          color: '#ccc', 
          fontSize: '12px', 
          marginTop: '8px',
          borderTop: '1px solid #444',
          paddingTop: '6px'
        }}>
          Hold SHIFT to boost
        </div>
      </div>
      <FuelMeter />
    </>
  );
}