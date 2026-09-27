import React from 'react'
import './LoadingScreen.css'

/**
 * Full-screen loading state, used both for the initial "unlocking"
 * transition and for any API request that needs a spinner.
 */
export default function LoadingScreen({ label = 'Unlocking your surprise' }) {
  return (
    <div className="loading-screen">
      <div className="loading-screen__hearts" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <p className="loading-screen__label">{label}…</p>
    </div>
  )
}
