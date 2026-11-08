export const clamp = (value, min, max) => Math.min(max, Math.max(min, Number.isFinite(value) ? value : min))

export function formatTime(seconds) {
  const value = Math.floor(Math.max(0, Number.isFinite(seconds) ? seconds : 0))
  return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, '0')}`
}

export function playableTracks(items) {
  return (Array.isArray(items) ? items : [])
    .filter((item) => item && typeof item.src === 'string' && item.src.trim())
    .map((item) => ({ ...item, src: item.src.trim() }))
}

export const trackKey = (track) => String(track.id || track.src)
