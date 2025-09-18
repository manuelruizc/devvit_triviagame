import { useEffect, useRef, useCallback } from 'react';

export const SOUNDFILES = {
  achievement: '/sounds/achievement.mp3',
  clue: '/sounds/clue.mp3',
  correct: '/sounds/correct.mp3',
  error: '/sounds/error.mp3',
  meow: '/sounds/meow.mp3',
  perfectchain: '/sounds/perfectchain.mp3',
  timeticking: '/sounds/timeticking.mp3',
  wii: '/sounds/wiii.mp3',
};

export type SoundMapKey =
  | 'achievement'
  | 'clue'
  | 'correct'
  | 'error'
  | 'meow'
  | 'perfectchain'
  | 'timeticking'
  | 'wii';

type SoundMap = { [key in SoundMapKey]?: AudioBuffer };

export default function useSounds(soundFiles: Record<SoundMapKey, string>) {
  const audioCtx = useRef<AudioContext | null>(null);
  const buffersRef = useRef<SoundMap>({});
  const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  useEffect(() => {
    audioCtx.current = new AudioContext();

    Object.entries(soundFiles).forEach(async ([key, file]) => {
      const res = await fetch(file);
      const arrayBuffer = await res.arrayBuffer();
      const decoded = await audioCtx.current!.decodeAudioData(arrayBuffer);
      buffersRef.current[key as SoundMapKey] = decoded;
    });
  }, [soundFiles]);

  const playSound = useCallback((name: SoundMapKey) => {
    const buffer = buffersRef.current[name];
    if (audioCtx.current && buffer) {
      const source = audioCtx.current.createBufferSource();
      source.buffer = buffer;
      const gainNode = audioCtx.current.createGain();
      gainNode.gain.value = name === 'meow' ? 0.05 : 0.15; // volume between 0 and 1

      gainNode.connect(audioCtx.current.destination);
      source.connect(gainNode);
      source.start(0);
      activeSourcesRef.current.add(source);
      source.onended = () => {
        activeSourcesRef.current.delete(source);
      };
    }
  }, []);

  const stopAllSounds = useCallback(() => {
    activeSourcesRef.current.forEach((source) => {
      source.stop();
      activeSourcesRef.current.delete(source);
    });
  }, []);

  return { playSound, stopAllSounds };
}
