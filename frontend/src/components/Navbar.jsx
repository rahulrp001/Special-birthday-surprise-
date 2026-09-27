import React, { useRef, useState, useEffect } from 'react'
import './Navbar.css'

export default function Navbar({ musicUrl }) {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !musicUrl) return
    audio.play()
      .then(() => setPlaying(true))
      .catch(() => {
        // Autoplay blocked — wait for first user interaction
        const resume = () => {
          audio.play().then(() => setPlaying(true)).catch(() => {})
          document.removeEventListener('click', resume)
        }
        document.addEventListener('click', resume)
      })
  }, [musicUrl])

  if (!musicUrl) return null

  function toggle() {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
    } else {
      audio.play().catch(() => {})
    }
    setPlaying(!playing)
  }

  return (
    <div className="navbar">
      <audio ref={audioRef} src={musicUrl} loop />
      <button
        className={`navbar__music ${playing ? 'navbar__music--playing' : ''}`}
        onClick={toggle}
        aria-label={playing ? 'Pause music' : 'Play music'}
      >
        🎵
      </button>
    </div>
  )
}
