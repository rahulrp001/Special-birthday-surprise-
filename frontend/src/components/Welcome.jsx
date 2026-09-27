import React, { useState } from 'react'
import HeartAnimation from './HeartAnimation.jsx'
import { useTypewriter } from './useTypewriter.js'
import './Welcome.css'

export default function Welcome({ name, onContinue }) {
  const [stage, setStage] = useState(0)

  const line1 = useTypewriter('Wait... before you continue...', { speed: 38 })
  const line2 = useTypewriter(
    line1.done ? 'Someone very special was born on this day...' : '',
    { speed: 34, startDelay: 400 }
  )

  React.useEffect(() => {
    if (line2.done && stage < 1) {
      const t = setTimeout(() => setStage(1), 900)
      return () => clearTimeout(t)
    }
  }, [line2.done, stage])

  React.useEffect(() => {
    if (stage === 1) {
      const t = setTimeout(() => setStage(2), 2200)
      return () => clearTimeout(t)
    }
  }, [stage])

  return (
    <div className="scene welcome-scene">
      <div className="glow-backdrop" />
      <HeartAnimation count={12} />

      <div className="scene__content">
        <p className="welcome-line welcome-line--typing">
          {line1.output}
          {!line1.done && <span className="caret" aria-hidden="true" />}
        </p>

        {line1.done && (
          <p className="welcome-line welcome-line--typing welcome-line--secondary">
            {line2.output}
            {line1.done && !line2.done && <span className="caret" aria-hidden="true" />}
          </p>
        )}

        {stage >= 1 && (
          <h1 className="welcome-name zoom-in glow-text">{name}</h1>
        )}

        {stage >= 2 && (
          <div className="fade-slide-up">
            <p className="welcome-line">Today isn't just another day...</p>
            <p className="welcome-line welcome-line--emphasis">Today is YOUR day. ❤️</p>
            <button className="btn" onClick={onContinue} style={{ marginTop: 36 }}>
              Continue →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
