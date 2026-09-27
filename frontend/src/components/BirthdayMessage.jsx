import React from 'react'
import HeartAnimation from './HeartAnimation.jsx'
import './BirthdayMessage.css'

export default function BirthdayMessage({ message, onContinue }) {
  const paragraphs = message.split('\n').filter((line) => line.trim() !== '')

  return (
    <div className="scene letter-scene">
      <div className="glow-backdrop" />
      <HeartAnimation count={8} />

      <div className="scene__content">
        <p className="eyebrow fade-in">a little message for you</p>
        <h2 className="fade-slide-up">A Little Message For You 💌</h2>
        <div className="section-divider" />

        <div className="letter-card fade-slide-up">
          {paragraphs.map((line, i) => (
            <p key={i} className="letter-card__line">{line}</p>
          ))}
        </div>

        <button className="btn" onClick={onContinue} style={{ marginTop: 40 }}>
          Continue →
        </button>
      </div>
    </div>
  )
}
