interface GameMenuProps {
  isVisible: boolean;
  onStart: () => void;
  onSettings: () => void;
}

export default function GameMenu({ isVisible, onStart, onSettings }: GameMenuProps) {
  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        zIndex: 9999,
        pointerEvents: 'all'
      }}
    >
      <div style={{
        backgroundColor: 'rgba(40, 40, 40, 0.95)',
        border: '3px solid #ff6600',
        borderRadius: '15px',
        padding: '40px',
        textAlign: 'center' as const,
        color: 'white',
        fontFamily: 'Inter, sans-serif',
        backdropFilter: 'blur(10px)'
      }}>
        <h1 style={{
          fontSize: '48px',
          margin: '0 0 10px 0',
          color: '#ff6600',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
        }}>
          Tuk Tuk Simulator 3D
        </h1>
        
        <p style={{
          fontSize: '18px',
          margin: '0 0 30px 0',
          color: '#ccc'
        }}>
          Navigate through the ruins of Mumbai
        </p>

        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '15px' }}>
          <button
            onClick={onStart}
            style={{
              padding: '15px 30px',
              fontSize: '20px',
              backgroundColor: '#ff6600',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
          >
            START DRIVING
          </button>
          
          <button
            onClick={onSettings}
            style={{
              padding: '12px 30px',
              fontSize: '16px',
              backgroundColor: 'transparent',
              color: '#ccc',
              border: '2px solid #666',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            SETTINGS
          </button>
        </div>

        <div style={{
          marginTop: '30px',
          fontSize: '14px',
          color: '#888'
        }}>
          Use WASD to drive • SPACE for handbrake • C to switch camera
        </div>
      </div>
    </div>
  );
}