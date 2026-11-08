import { useMemo } from 'react'
import { AudioLines, ListMusic, LoaderCircle, Music2, Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react'
import Section from './Section.jsx'
import AssetImage from './AssetImage.jsx'
import useAudioPlayer from '../hooks/useAudioPlayer.js'
import { clamp, formatTime, playableTracks } from '../utils/music.js'

function PlayerPanel({ tracks, settings, player }) {
  const track = player?.track
  const disabled = !track
  const duration = player?.duration || 0
  const time = clamp(player?.time || 0, 0, duration || 0)
  const silent = player?.muted || player?.volume === 0
  const volume = silent ? 0 : player?.volume || 0
  const stateLabel = player?.loading ? settings.loading
    : player?.isPlaying ? settings.playing
      : time > 0 ? settings.paused : settings.ready

  return (
    <div className={`music-layout ${player?.isPlaying ? 'is-playing' : ''}`}>
      <div className="music-player-panel">
        <div className="music-now-playing">
          <div className="music-cover">
            {track ? <AssetImage key={track.cover || track.src} src={track.cover} alt={track.title || settings.untitled} placeholder={settings.coverPlaceholder} />
              : <div className="music-empty-cover"><Music2 size={44} strokeWidth={1} aria-hidden="true" /><span>{settings.emptyCover}</span></div>}
          </div>
          <div className="music-track-info">
            <p className="music-eyebrow">{settings.nowPlaying}</p>
            <h3>{track ? track.title || settings.untitled : settings.emptyTitle}</h3>
            {track?.artist && <p className="music-artist">{track.artist}</p>}
            <p className="music-status" role="status"><span aria-hidden="true" />{disabled ? settings.emptyDescription : stateLabel}</p>
          </div>
        </div>

        <div className="music-progress">
          <input type="range" min="0" max={duration || 1} step="0.1" value={time}
            disabled={disabled || !duration} aria-label={settings.seek}
            aria-valuetext={`${formatTime(time)} / ${formatTime(duration)}`}
            style={{ '--range-fill': `${duration ? time / duration * 100 : 0}%` }}
            onChange={(event) => player?.seek(event.target.value)} />
          <div className="music-times"><span>{formatTime(time)}</span><span>{formatTime(duration)}</span></div>
        </div>

        <div className="music-transport-row">
          <div className="music-transport">
            <button type="button" className="icon-button" disabled={disabled || tracks.length < 2} aria-label={settings.previous} onClick={() => player?.previous()}><SkipBack size={18} aria-hidden="true" /></button>
            <button type="button" className="music-play-button" disabled={disabled} aria-label={player?.requested ? settings.pause : settings.play} onClick={() => player?.toggle()}>
              {player?.loading ? <LoaderCircle size={24} className="audio-spinner" aria-hidden="true" /> : player?.requested ? <Pause size={24} fill="currentColor" aria-hidden="true" /> : <Play size={24} fill="currentColor" aria-hidden="true" />}
            </button>
            <button type="button" className="icon-button" disabled={disabled || tracks.length < 2} aria-label={settings.next} onClick={() => player?.next()}><SkipForward size={18} aria-hidden="true" /></button>
          </div>
          <div className="music-volume">
            <button type="button" className="music-volume-button" disabled={disabled} aria-label={silent ? settings.unmute : settings.mute} aria-pressed={Boolean(silent)} onClick={() => player?.toggleMute()}>{silent ? <VolumeX size={19} aria-hidden="true" /> : <Volume2 size={19} aria-hidden="true" />}</button>
            <input type="range" min="0" max="1" step="0.01" value={volume} disabled={disabled || player?.deviceVolume}
              aria-label={settings.volume} aria-valuetext={`${Math.round(volume * 100)}%`}
              style={{ '--range-fill': `${volume * 100}%` }} onChange={(event) => player?.setVolume(event.target.value)} />
            <span aria-hidden="true">{Math.round(volume * 100)}%</span>
          </div>
        </div>
        {player?.deviceVolume && <p className="music-note">{settings.deviceVolume}</p>}
        {player?.error && <p className="music-error" role="alert">{player.error}</p>}
      </div>

      <div className="music-playlist-panel">
        <div className="music-playlist-heading"><h3><ListMusic size={17} aria-hidden="true" />{settings.playlist}</h3><span>{tracks.length}</span></div>
        {tracks.length ? <ol className="music-playlist">{tracks.map((item, index) => {
          const active = player?.index === index
          const playing = active && player?.isPlaying
          return (
            <li key={item.id || item.src}>
              <button type="button" className={`music-playlist-track ${active ? 'is-current' : ''}`} aria-current={active ? 'true' : undefined}
                aria-label={`${active && player?.requested ? settings.pause : settings.play}: ${item.title || settings.untitled}`}
                onClick={() => player?.choose(index)}>
                <span className="music-track-number">{playing ? <AudioLines size={17} aria-hidden="true" /> : String(index + 1).padStart(2, '0')}</span>
                <span className="music-playlist-info"><strong>{item.title || settings.untitled}</strong>{item.artist && <span>{item.artist}</span>}</span>
                {playing ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
              </button>
            </li>
          )
        })}</ol> : <div className="music-playlist-empty"><Music2 size={24} strokeWidth={1.2} aria-hidden="true" /><p>{settings.emptyDescription}</p></div>}
      </div>
    </div>
  )
}

function LoadedMusicPlayer({ tracks, settings }) {
  const player = useAudioPlayer(tracks, settings)
  return <>
    <audio ref={player.audioRef} {...player.audioEvents} preload="metadata" playsInline hidden />
    <PlayerPanel tracks={tracks} settings={settings} player={player} />
  </>
}

export default function MusicPlayer({ items = [], heading, settings }) {
  const tracks = useMemo(() => playableTracks(items), [items])
  return <Section id="music" heading={heading} className="music-section">
    {tracks.length ? <LoadedMusicPlayer tracks={tracks} settings={settings} /> : <PlayerPanel tracks={tracks} settings={settings} />}
  </Section>
}
