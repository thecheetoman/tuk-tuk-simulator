import { useFuelSystem } from "../lib/stores/useFuelSystem";

export default function FuelMeter() {
  const { fuel, maxFuel } = useFuelSystem();
  
  const fuelPercentage = (fuel / maxFuel) * 100;
  const isLowFuel = fuelPercentage < 25;
  const isCriticalFuel = fuelPercentage < 10;
  
  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      border: '2px solid #ff6600',
      borderRadius: '10px',
      padding: '15px',
      fontFamily: 'Inter, sans-serif',
      zIndex: 1000
    }}>
      <div style={{
        color: '#ff6600',
        fontSize: '14px',
        fontWeight: 'bold',
        marginBottom: '8px',
        textAlign: 'center'
      }}>
        FUEL
      </div>
      
      {/* Fuel bar background */}
      <div style={{
        width: '120px',
        height: '20px',
        backgroundColor: 'rgba(60, 60, 60, 0.8)',
        border: '1px solid #444',
        borderRadius: '10px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Fuel bar fill */}
        <div style={{
          width: `${fuelPercentage}%`,
          height: '100%',
          backgroundColor: isCriticalFuel ? '#FF0000' : 
                          isLowFuel ? '#FF8800' : '#00FF00',
          transition: 'width 0.3s ease, background-color 0.3s ease',
          borderRadius: '8px'
        }} />
        
        {/* Fuel percentage text */}
        <div style={{
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '12px',
          fontWeight: 'bold',
          textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
        }}>
          {Math.round(fuelPercentage)}%
        </div>
      </div>
      
      {/* Warning text */}
      {isLowFuel && (
        <div style={{
          color: isCriticalFuel ? '#FF0000' : '#FF8800',
          fontSize: '10px',
          fontWeight: 'bold',
          textAlign: 'center',
          marginTop: '5px',
          animation: isCriticalFuel ? 'blink 1s infinite' : 'none'
        }}>
          {isCriticalFuel ? 'CRITICAL!' : 'LOW FUEL'}
        </div>
      )}
      
      <div style={{
        color: '#ccc',
        fontSize: '10px',
        textAlign: 'center',
        marginTop: '5px'
      }}>
        Find fuel stations to refill
      </div>
      
      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}