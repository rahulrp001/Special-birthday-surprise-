import React from 'react'
import HeartAnimation from './HeartAnimation.jsx'
import Confetti from './Confetti.jsx'
import { useTypewriter } from './useTypewriter.js'
import './BirthdayHero.css'

export default function BirthdayHero({ name, onContinue }) {
  const { output, done } = useTypewriter(
    'Today is all about celebrating the beautiful person you are.',
    { speed: 26, startDelay: 600 }
  )

  return (
    <div className="scene hero-scene">
      <div className="glow-backdrop" />
      <HeartAnimation count={18} />
      <Confetti pieces={36} />

      <div className="scene__content">
        <p className="eyebrow fade-in">happy birthday</p>

        <h1 className="hero-title glow-text zoom-in">
          Happy Birthday, {name} ❤️
        </h1>

        <p className="hero-message">
          {output}
          {!done && <span className="caret" aria-hidden="true" />}
        </p>

        {done && (
          <button className="btn fade-slide-up" onClick={onContinue} style={{ marginTop: 40 }}>
            Continue →
          </button>
        )}
      </div>
    </div>
  )
}
