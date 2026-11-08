import { useEffect, useRef, useState } from 'react'
import { clamp, trackKey } from '../utils/music.js'

// Satu elemen audio untuk seluruh playlist. play() tetap dipanggil langsung
// dari tindakan pengguna, bukan efek yang dapat menghilangkan user gesture.
export default function useAudioPlayer(tracks, settings) {
  const audioRef = useRef(null)
  const loaded = useRef(null)
  const operation = useRef(0)
  const wantsPlayback = useRef(false)
  const lastVolume = useRef(clamp(settings.initialVolume, 0, 1) || 0.65)
  const [selectedKey, setSelectedKey] = useState(() => trackKey(tracks[0]))
  const [isPlaying, setIsPlaying] = useState(false)
  const [requested, setRequested] = useState(false)
  const [loading, setLoading] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolumeState] = useState(clamp(settings.initialVolume, 0, 1))
  const [muted, setMuted] = useState(false)
  const [deviceVolume, setDeviceVolume] = useState(false)
  const [error, setError] = useState('')
  const index = Math.max(0, tracks.findIndex((track) => trackKey(track) === selectedKey))
  const track = tracks[index]
  const key = trackKey(track)

  function pause() {
    operation.current += 1
    wantsPlayback.current = false
    setRequested(false)
    audioRef.current?.pause()
    setIsPlaying(false)
    setLoading(false)
  }

  function play() {
    const audio = audioRef.current
    if (!audio) return
    const request = ++operation.current
    if (audio.error) audio.load()
    wantsPlayback.current = true
    setRequested(true)
    setLoading(true)
    setError('')
    const failed = (failure) => {
      if (request !== operation.current) return
      wantsPlayback.current = false
      setRequested(false)
      setIsPlaying(false)
      setLoading(false)
      setError(failure?.name === 'NotAllowedError' ? settings.blockedError : settings.sourceError)
    }
    try {
      Promise.resolve(audio.play()).then(() => {
        if (request !== operation.current) return
        setIsPlaying(!audio.paused)
        setLoading(false)
      }, failed)
    } catch (failure) {
      failed(failure)
    }
  }

  function loadTrack(next, shouldPlay) {
    const audio = audioRef.current
    if (!audio || !next) return
    pause()
    loaded.current = { key: trackKey(next), src: next.src }
    audio.src = next.src
    audio.load()
    setSelectedKey(trackKey(next))
    setTime(0)
    setDuration(0)
    setError('')
    if (shouldPlay) play()
  }

  function setVolume(value) {
    const audio = audioRef.current
    if (!audio) return
    const level = clamp(Number(value), 0, 1)
    try { audio.volume = level } catch { setDeviceVolume(true) }
    setDeviceVolume(Math.abs(audio.volume - level) > 0.01)
    setVolumeState(audio.volume)
    if (level > 0) {
      lastVolume.current = level
      audio.muted = false
    }
    setMuted(audio.muted)
  }

  function toggleMute() {
    const audio = audioRef.current
    if (!audio) return
    if (audio.muted || audio.volume === 0) {
      if (audio.volume === 0) setVolume(lastVolume.current)
      audio.muted = false
    } else {
      audio.muted = true
    }
    setMuted(audio.muted)
  }

  function seek(value) {
    if (!duration) return
    const nextTime = clamp(Number(value), 0, duration)
    try {
      audioRef.current.currentTime = nextTime
      setTime(nextTime)
    } catch {
      setError(settings.seekError)
    }
  }

  function select(nextIndex, startPlayback = wantsPlayback.current) {
    const next = tracks[(nextIndex + tracks.length) % tracks.length]
    if (next) loadTrack(next, startPlayback)
  }

  useEffect(() => {
    const audio = audioRef.current
    setVolume(clamp(settings.initialVolume, 0, 1))
    return () => {
      operation.current += 1
      wantsPlayback.current = false
      loaded.current = null
      audio.pause()
      audio.removeAttribute('src')
      audio.load()
    }
  }, [])

  // Penggantian/penghapusan lagu lewat konfigurasi tidak memulai audio sendiri.
  // Pemilihan lewat tombol sudah memuat sumbernya secara sinkron di loadTrack.
  useEffect(() => {
    if (loaded.current?.key !== key || loaded.current?.src !== track.src) loadTrack(track, false)
  }, [key, track.src])

  const syncTime = () => setTime(Math.max(0, Number.isFinite(audioRef.current.currentTime) ? audioRef.current.currentTime : 0))
  const syncDuration = () => {
    const value = audioRef.current.duration
    setDuration(Number.isFinite(value) && value > 0 ? value : 0)
    syncTime()
  }

  const audioEvents = {
    onLoadedMetadata: syncDuration,
    onDurationChange: syncDuration,
    onTimeUpdate: syncTime,
    onPlay: () => {
      if (!wantsPlayback.current) { audioRef.current.pause(); return }
      setIsPlaying(true)
    },
    onPlaying: () => {
      if (!wantsPlayback.current) { audioRef.current.pause(); return }
      setIsPlaying(true)
      setLoading(false)
    },
    onPause: () => {
      // Abaikan pause sumber lama saat sumber baru sudah berjalan. Saat akhir
      // lagu, browser dapat mengirim pause sebelum ended: pertahankan intent.
      if (!audioRef.current.paused || audioRef.current.ended) return
      wantsPlayback.current = false
      setRequested(false)
      setIsPlaying(false)
      setLoading(false)
    },
    onWaiting: () => setLoading(wantsPlayback.current),
    onStalled: () => setLoading(wantsPlayback.current),
    onCanPlay: () => setLoading(false),
    onEnded: () => {
      if (wantsPlayback.current && index < tracks.length - 1) select(index + 1, true)
      else pause()
    },
    onError: () => {
      if (!audioRef.current.error) return
      pause()
      setError(settings.sourceError)
    },
    onVolumeChange: () => {
      setVolumeState(audioRef.current.volume)
      setMuted(audioRef.current.muted)
    },
  }

  return {
    audioRef, audioEvents, track, index, isPlaying, requested, loading, time,
    duration, volume, muted, deviceVolume, error, setVolume, toggleMute, seek,
    toggle: () => { if (wantsPlayback.current || !audioRef.current.paused) pause(); else play() },
    previous: () => select(index - 1),
    next: () => select(index + 1),
    choose: (nextIndex) => { if (nextIndex === index) { if (wantsPlayback.current) pause(); else play() } else select(nextIndex, true) },
  }
}
