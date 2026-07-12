import { createContext, useContext, useRef, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { WEDDING_CONFIG } from './config';

interface AudioContextType {
  isPlaying: boolean;
  toggleAudio: () => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider');
  }
  return context;
};

export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const [isPlaying, setIsPlaying] = useState(WEDDING_CONFIG.audio.autoPlay);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Audio setup based on config
  useEffect(() => {
    if (audioRef.current) {
      // Set volume from config
      audioRef.current.volume = WEDDING_CONFIG.audio.volume;
      
      // Auto-play only if enabled in config
      if (WEDDING_CONFIG.audio.autoPlay && WEDDING_CONFIG.audio.enabled) {
        const playAudio = () => {
          if (audioRef.current) {
            audioRef.current.play().catch(console.error);
          }
        };

        // Try to play immediately
        playAudio();

        // If autoplay fails, play on first user interaction
        const handleFirstInteraction = () => {
          playAudio();
          document.removeEventListener('click', handleFirstInteraction);
          document.removeEventListener('touchstart', handleFirstInteraction);
        };

        document.addEventListener('click', handleFirstInteraction);
        document.addEventListener('touchstart', handleFirstInteraction);

        return () => {
          document.removeEventListener('click', handleFirstInteraction);
          document.removeEventListener('touchstart', handleFirstInteraction);
        };
      }
    }
  }, []);

  return (
    <AudioContext.Provider value={{ isPlaying, toggleAudio, audioRef }}>
      {children}
      {/* Audio element */}
      {WEDDING_CONFIG.audio.enabled && (
        <audio
          ref={audioRef}
          loop
          preload="auto"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        >
          <source src={WEDDING_CONFIG.audio.src} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}
    </AudioContext.Provider>
  );
};

