import React, { useState } from 'react'
import Confetti from './Confetti.jsx'
import './LoveSurprise.css'

const MESSAGES = [
  "You're one of the most beautiful parts of my story. ❤️",
  "Every little moment feels better with you in it.",
  "I never get tired of being lucky enough to know you.",
]

export default function LoveSurprise({ onContinue }) {
  const [step, setStep] = useState(0) // 0 = prompt, 1..N = revealed messages
  const revealed = step > 0

  function handleNext() {
    setStep((s) => Math.min(s + 1, MESSAGES.length))
  }

  return (
    <div className={`scene surprise-scene ${revealed ? 'surprise-scene--dark' : ''}`}>
      <div className="glow-backdrop" />
      {revealed && <Confetti pieces={44} />}

      <div className="scene__content">
        {step === 0 && (
          <div className="fade-slide-up">
            <h2>Want to see one more surprise?</h2>
            <button className="btn" onClick={handleNext} style={{ marginTop: 30 }}>
              YES ❤️
            </button>
          </div>
        )}

        {step > 0 && step <= MESSAGES.length && (
          <div className="surprise-message zoom-in" key={step}>
            <p className="surprise-message__text glow-text">{MESSAGES[step - 1]}</p>

            {step < MESSAGES.length ? (
              <button className="btn btn--ghost" onClick={handleNext} style={{ marginTop: 34 }}>
                One More Surprise →
              </button>
            ) : (
              <button className="btn" onClick={onContinue} style={{ marginTop: 34 }}>
                Continue →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
