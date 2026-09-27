import React, { useState } from 'react'
import Confetti from './Confetti.jsx'
import HeartAnimation from './HeartAnimation.jsx'
import './FinalSurprise.css'

export default function FinalSurprise({ name, message, onRestart }) {
  const [open, setOpen] = useState(false)
  const paragraphs = message.split('\n').filter((line) => line.trim() !== '')

  return (
    <div className="scene final-scene">
      <div className="glow-backdrop" />
      <HeartAnimation count={14} />
      {open && <Confetti pieces={70} />}

      <div className="scene__content">
        {!open ? (
          <div className="fade-slide-up">
            <p className="eyebrow">before you leave...</p>
            <h2>One more thing before you go...</h2>
            <button
              className="btn"
              onClick={() => setOpen(true)}
              style={{ marginTop: 32 }}
            >
              Open Your Final Surprise 💝
            </button>
          </div>
        ) : (
          <div className="envelope zoom-in">
            <h1 className="final-title glow-text">Happy Birthday, {name} ❤️</h1>

            <div className="final-letter fade-slide-up">
              {paragraphs.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>

            <p className="final-footer fade-in">Made with ❤️ just for you.</p>

            <button className="btn btn--ghost" onClick={onRestart} style={{ marginTop: 28 }}>
              Relive the surprise
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
