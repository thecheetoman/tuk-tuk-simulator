import { useState, useEffect } from 'react';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export default function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Loading game assets...');

  useEffect(() => {
    const loadingSteps = [
      { text: 'Loading terrain...', duration: 800 },
      { text: 'Loading buildings...', duration: 700 },
      { text: 'Loading vehicles...', duration: 600 },
      { text: 'Loading pedestrians...', duration: 500 },
      { text: 'Loading sounds...', duration: 400 },
      { text: 'Finalizing...', duration: 300 }
    ];

    let currentStep = 0;
    let currentProgress = 0;

    const updateLoading = () => {
      if (currentStep < loadingSteps.length) {
        setLoadingText(loadingSteps[currentStep].text);
        
        const stepProgress = 100 / loadingSteps.length;
        const targetProgress = (currentStep + 1) * stepProgress;
        
        const progressInterval = setInterval(() => {
          currentProgress += 2;
          setProgress(Math.min(currentProgress, targetProgress));
          
          if (currentProgress >= targetProgress) {
            clearInterval(progressInterval);
            currentStep++;
            
            setTimeout(() => {
              if (currentStep >= loadingSteps.length) {
                onLoadingComplete();
              } else {
                updateLoading();
              }
            }, 100);
          }
        }, 30);
      }
    };

    const startTimer = setTimeout(updateLoading, 500);
    return () => clearTimeout(startTimer);
  }, [onLoadingComplete]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#1a1a1a',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10000,
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Game Title */}
      <div style={{
        marginBottom: '60px',
        textAlign: 'center'
      }}>
        <h1 style={{
          color: '#ff6600',
          fontSize: '48px',
          fontWeight: 'bold',
          margin: '0 0 10px 0',
          textShadow: '3px 3px 6px rgba(0,0,0,0.8)'
        }}>
          TUK TUK SIMULATOR
        </h1>
        <p style={{
          color: '#ccc',
          fontSize: '18px',
          margin: 0,
          fontStyle: 'italic'
        }}>
          Navigate the streets of India
        </p>
      </div>

      {/* Loading Progress */}
      <div style={{
        width: '400px',
        marginBottom: '20px'
      }}>
        <div style={{
          width: '100%',
          height: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '4px',
          overflow: 'hidden',
          marginBottom: '15px'
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            backgroundColor: '#ff6600',
            borderRadius: '4px',
            transition: 'width 0.3s ease-out',
            boxShadow: '0 0 10px rgba(255, 102, 0, 0.5)'
          }} />
        </div>
        
        <p style={{
          color: '#fff',
          fontSize: '16px',
          textAlign: 'center',
          margin: 0
        }}>
          {loadingText}
        </p>
        
        <p style={{
          color: '#999',
          fontSize: '14px',
          textAlign: 'center',
          margin: '5px 0 0 0'
        }}>
          {Math.round(progress)}%
        </p>
      </div>

      {/* Loading Animation */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginTop: '20px'
      }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: '12px',
              height: '12px',
              backgroundColor: '#ff6600',
              borderRadius: '50%',
              animation: `pulse 1.5s ease-in-out ${i * 0.3}s infinite`,
              opacity: 0.7
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.3);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}