import React, { useMemo } from 'react'
import './Confetti.css'

const COLORS = ['#e0577a', '#f2a4b8', '#d9a35c', '#f0cf9b', '#f7ece9']

/**
 * A short burst of falling confetti. Mount this component to play the
 * burst once; unmount it (or let `duration` finish) to stop it.
 */
export default function Confetti({ pieces = 60 }) {
  const bits = useMemo(() => {
    return Array.from({ length: pieces }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.8,
      duration: 2.6 + Math.random() * 2,
      color: COLORS[i % COLORS.length],
      width: 6 + Math.random() * 6,
      height: 10 + Math.random() * 10,
      rotate: Math.random() * 360,
    }))
  }, [pieces])

  return (
    <div className="confetti-field" aria-hidden="true">
      {bits.map((b) => (
        <span
          key={b.id}
          className="confetti-field__piece"
          style={{
            left: `${b.left}%`,
            background: b.color,
            width: `${b.width}px`,
            height: `${b.height}px`,
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.duration}s`,
            transform: `rotate(${b.rotate}deg)`,
          }}
        />
      ))}
    </div>
  )
}
