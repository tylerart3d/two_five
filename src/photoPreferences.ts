import { useSyncExternalStore } from 'react';
let enhanced = true;
const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; };
export function useEnhancedPhotos() { return useSyncExternalStore(subscribe, () => enhanced); }
export function setEnhancedPhotos(value: boolean) { enhanced = value; listeners.forEach(listener => listener()); }
