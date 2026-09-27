import React, { useState } from 'react'
import HeartAnimation from './HeartAnimation.jsx'
import Starfield from './Starfield.jsx'
import { loginRequest } from '../services/api.js'
import './Login.css'

export default function Login({ onSuccess }) {
  const [username, setUsername] = useState('')
  const [dob, setDob] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [unlocked, setUnlocked] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!username.trim() || !dob) {
      setError("Oops! This little surprise is only for you ❤️")
      return
    }

    setLoading(true)
    const result = await loginRequest(username.trim(), dob)
    setLoading(false)

    if (result.success) {
      setUnlocked(true)
      // Let the unlock animation play before handing off to the parent.
      setTimeout(() => onSuccess(result.data.name), 1100)
    } else {
      setError(result.message)
    }
  }

  return (
    <div className="scene login-scene">
      <div className="glow-backdrop" />
      <Starfield />
      <HeartAnimation count={10} />

      <div className={`login-card scene__content ${unlocked ? 'login-card--unlocked' : ''}`}>
        <p className="eyebrow fade-in">a private surprise</p>
        <h1 className="fade-slide-up">Hey You ❤️</h1>
        <p className="login-card__subtitle fade-slide-up">
          There's a little surprise waiting for you...
        </p>

        <form onSubmit={handleSubmit} className="login-form fade-slide-up">
          <label className="login-form__field">
            <span className="visually-hidden">Your Name</span>
            <input
              type="text"
              placeholder="Your Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="off"
              disabled={loading || unlocked}
            />
          </label>

          <label className="login-form__field">
            <span className="visually-hidden">Your Date of Birth</span>
            <input
              type="date"
              placeholder="Your Date of Birth"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              disabled={loading || unlocked}
            />
          </label>

          <button type="submit" className="btn login-form__submit" disabled={loading || unlocked}>
            <span className={`lock-icon ${unlocked ? 'lock-icon--open' : ''}`} aria-hidden="true">
              {unlocked ? '💗' : '🔒'}
            </span>
            {loading ? 'Checking…' : unlocked ? 'Unlocked' : 'Unlock My Surprise ❤️'}
          </button>

          {error && <p className="error-banner" role="alert">{error}</p>}
        </form>
      </div>
    </div>
  )
}
