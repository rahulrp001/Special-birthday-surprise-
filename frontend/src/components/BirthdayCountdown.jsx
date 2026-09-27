import React, { useEffect, useState } from 'react'
import Confetti from './Confetti.jsx'
import './BirthdayCountdown.css'

function getTimeLeft(targetIso) {
  const target = new Date(targetIso).getTime()
  const now = Date.now()
  const diff = Math.max(target - now, 0)

  return {
    total: diff,
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export default function BirthdayCountdown({ targetIso, onContinue }) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(targetIso))
  const reachedZero = timeLeft.total <= 0

  useEffect(() => {
    if (!targetIso) return
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(targetIso))
    }, 1000)
    return () => clearInterval(interval)
  }, [targetIso])

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ]

  return (
    <div className="scene countdown-scene">
      <div className="glow-backdrop" />
      {reachedZero && <Confetti pieces={80} />}

      <div className="scene__content">
        <p className="eyebrow fade-in">your birthday moment</p>
        <h2 className="fade-slide-up">Your Birthday Moment ✨</h2>
        <div className="section-divider" />

        {reachedZero ? (
          <p className="countdown-celebrate glow-text zoom-in">It's here — happy birthday! 🎆</p>
        ) : (
          <div className="countdown-grid fade-slide-up">
            {units.map((u) => (
              <div className="countdown-unit" key={u.label}>
                <span className="countdown-unit__value">{String(u.value).padStart(2, '0')}</span>
                <span className="countdown-unit__label">{u.label}</span>
              </div>
            ))}
          </div>
        )}

        <button className="btn" onClick={onContinue} style={{ marginTop: 44 }}>
          Continue →
        </button>
      </div>
    </div>
  )
}
