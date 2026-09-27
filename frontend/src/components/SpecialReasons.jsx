import React, { useEffect, useRef, useState } from 'react'
import HeartAnimation from './HeartAnimation.jsx'
import './SpecialReasons.css'

function RevealCard({ reason, index }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`reason-card ${visible ? 'reason-card--visible' : ''}`}
      style={{ transitionDelay: `${index * 0.08}s` }}
    >
      <span className="reason-card__icon">{reason.icon}</span>
      <h3>{reason.title}</h3>
      <p>{reason.description}</p>
    </div>
  )
}

export default function SpecialReasons({ reasons, onContinue }) {
  const hasReasons = reasons && reasons.length > 0

  return (
    <div className="scene reasons-scene">
      <div className="glow-backdrop" />
      <HeartAnimation count={8} />

      <div className="scene__content reasons-scene__content">
        <p className="eyebrow fade-in">why you are special</p>
        <h2 className="fade-slide-up">Why You Are Special ❤️</h2>
        <div className="section-divider" />

        {hasReasons ? (
          <div className="reasons-grid">
            {reasons.map((r, i) => <RevealCard key={r.id} reason={r} index={i} />)}
          </div>
        ) : (
          <p className="gallery-empty">No reasons added yet — add some from the Django admin panel.</p>
        )}

        <button className="btn" onClick={onContinue} style={{ marginTop: 44 }}>
          Continue →
        </button>
      </div>
    </div>
  )
}
