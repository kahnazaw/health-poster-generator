import { useCallback, useRef } from "react";

type SoundType = "click" | "success" | "error" | "toggle";

const audioContext = typeof window !== "undefined" ? new (window.AudioContext || (window as any).webkitAudioContext)() : null;

function playTone(frequency: number, duration: number, type: OscillatorType = "sine", volume: number = 0.1) {
  if (!audioContext) return;
  
  try {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  } catch (e) {
    console.log("Sound playback not available");
  }
}

const sounds: Record<SoundType, () => void> = {
  click: () => playTone(800, 0.05, "sine", 0.05),
  success: () => {
    playTone(523, 0.1, "sine", 0.08);
    setTimeout(() => playTone(659, 0.1, "sine", 0.08), 100);
    setTimeout(() => playTone(784, 0.15, "sine", 0.08), 200);
  },
  error: () => {
    playTone(300, 0.15, "sawtooth", 0.05);
    setTimeout(() => playTone(250, 0.2, "sawtooth", 0.05), 150);
  },
  toggle: () => playTone(600, 0.08, "sine", 0.05),
};

export function useSound() {
  const enabledRef = useRef(true);

  const playSound = useCallback((type: SoundType) => {
    if (!enabledRef.current) return;
    
    if (audioContext?.state === "suspended") {
      audioContext.resume();
    }
    
    sounds[type]?.();
  }, []);

  const setEnabled = useCallback((enabled: boolean) => {
    enabledRef.current = enabled;
  }, []);

  return { playSound, setEnabled, enabled: enabledRef.current };
}
