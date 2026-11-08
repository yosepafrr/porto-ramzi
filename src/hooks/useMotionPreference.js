import { useSyncExternalStore } from 'react'

const query = '(prefers-reduced-motion: reduce)'
const snapshot = () => typeof window === 'undefined' || !window.matchMedia ? true : window.matchMedia(query).matches
const serverSnapshot = () => true
const subscribe = (notify) => {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {}
  const media = window.matchMedia(query)
  media.addEventListener('change', notify)
  return () => media.removeEventListener('change', notify)
}

// Menanggapi perubahan preferensi sistem saat halaman sedang terbuka.
export default function useMotionPreference() {
  return useSyncExternalStore(subscribe, snapshot, serverSnapshot)
}
