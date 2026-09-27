import React, { useMemo } from 'react'
import './HeartAnimation.css'

/**
 * Renders a field of slowly floating hearts, used as ambient decoration
 * behind most scenes. `count` controls density; keep it modest on mobile.
 */
export default function HeartAnimation({ count = 14 }) {
  const hearts = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 10 + Math.random() * 10,
      size: 10 + Math.random() * 18,
      drift: (Math.random() - 0.5) * 80,
      opacity: 0.25 + Math.random() * 0.4,
      char: Math.random() > 0.35 ? '❤' : '♡',
    }))
  }, [count])

  return (
    <div className="heart-field" aria-hidden="true">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="heart-field__heart"
          style={{
            left: `${h.left}%`,
            fontSize: `${h.size}px`,
            animationDelay: `${h.delay}s`,
            animationDuration: `${h.duration}s`,
            '--drift': `${h.drift}px`,
            '--o': h.opacity,
          }}
        >
          {h.char}
        </span>
      ))}
    </div>
  )
}
