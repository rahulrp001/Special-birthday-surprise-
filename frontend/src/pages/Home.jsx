import React, { useEffect, useState } from 'react'
import Login from '../components/Login.jsx'
import Welcome from '../components/Welcome.jsx'
import BirthdayHero from '../components/BirthdayHero.jsx'
import BirthdayMessage from '../components/BirthdayMessage.jsx'
import MemoryGallery from '../components/MemoryGallery.jsx'
import SpecialReasons from '../components/SpecialReasons.jsx'
import LoveSurprise from '../components/LoveSurprise.jsx'
import BirthdayCountdown from '../components/BirthdayCountdown.jsx'
import FinalSurprise from '../components/FinalSurprise.jsx'
import LoadingScreen from '../components/LoadingScreen.jsx'
import Navbar from '../components/Navbar.jsx'
import { fetchBirthday, fetchMemories, fetchReasons, fetchMessages, fetchCountdown } from '../services/api.js'

const STAGES = [
  'login', 'unlocking', 'welcome', 'hero', 'message',
  'gallery', 'reasons', 'surprise', 'countdown', 'final',
]

export default function Home() {
  const [stage, setStage] = useState(() => {
    const saved = localStorage.getItem('stage')
    if (!saved || saved === 'unlocking') return 'login'
    return saved
  })
  const [name, setName] = useState(() => localStorage.getItem('name') || '')
  const [siteData, setSiteData] = useState(() => {
    try { return JSON.parse(localStorage.getItem('siteData')) } catch { return null }
  })
  const [memories, setMemories] = useState(() => {
    try { return JSON.parse(localStorage.getItem('memories')) || [] } catch { return [] }
  })
  const [reasons, setReasons] = useState(() => {
    try { return JSON.parse(localStorage.getItem('reasons')) || [] } catch { return [] }
  })
  const [countdownIso, setCountdownIso] = useState(() => localStorage.getItem('countdownIso') || null)
  const [loadError, setLoadError] = useState('')
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)

  async function handleLoginSuccess(loggedInName) {
    setName(loggedInName)
    localStorage.setItem('name', loggedInName)
    setStage('unlocking')
    localStorage.setItem('stage', 'unlocking')

    const [birthdayRes, memoriesRes, reasonsRes, messagesRes, countdownRes] = await Promise.all([
      fetchBirthday(),
      fetchMemories(),
      fetchReasons(),
      fetchMessages(),
      fetchCountdown(),
    ])

    if (birthdayRes.success) { setSiteData(birthdayRes.data); localStorage.setItem('siteData', JSON.stringify(birthdayRes.data)) }
    if (memoriesRes.success) { setMemories(memoriesRes.data); localStorage.setItem('memories', JSON.stringify(memoriesRes.data)) }
    if (reasonsRes.success) { setReasons(reasonsRes.data); localStorage.setItem('reasons', JSON.stringify(reasonsRes.data)) }
    if (countdownRes.success) { setCountdownIso(countdownRes.data.next_birthday); localStorage.setItem('countdownIso', countdownRes.data.next_birthday) }

    if (!birthdayRes.success && !messagesRes.success) {
      setLoadError(birthdayRes.message || "Couldn't load your surprise. Please refresh and try again.")
    }

    // Small pause so the loading screen doesn't just flash.
    setTimeout(() => setStage('welcome'), 900)
  }

  function goTo(nextStage) {
    setStage(nextStage)
    localStorage.setItem('stage', nextStage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function restart() {
    setStage('login')
    setName('')
    setSiteData(null)
    setMemories([])
    setReasons([])
    setCountdownIso(null)
    localStorage.clear()
  }

  const birthdayMessage = siteData?.birthday_message || ''
  const finalMessage = siteData?.final_message || ''
  const musicUrl = siteData?.background_music || null

  if (stage === 'login') {
    return <Login onSuccess={handleLoginSuccess} />
  }

  if (stage === 'unlocking') {
    return <LoadingScreen label="Unlocking your surprise" />
  }

  if (loadError) {
    return (
      <div className="scene">
        <div className="glow-backdrop" />
        <div className="scene__content">
          <h2>Something went wrong</h2>
          <p className="error-banner" role="alert">{loadError}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Navbar musicUrl={musicUrl} />

      {siteData?.profile_image && (
        <div className="profile-corner-wrap">
          <button
            className="profile-corner"
            onClick={() => setProfileMenuOpen(o => !o)}
            aria-label="Profile menu"
          >
            <img src={siteData.profile_image} alt={name} />
          </button>

          {profileMenuOpen && (
            <div className="profile-menu" onClick={() => setProfileMenuOpen(false)}>
              <p className="profile-menu__name">💖 {name}</p>
              <div className="profile-menu__divider" />
              {[
                { label: '🎉 Welcome', s: 'welcome' },
                { label: '🎂 Birthday', s: 'hero' },
                { label: '💌 Message', s: 'message' },
                { label: '📸 Memories', s: 'gallery' },
                { label: '💖 Reasons', s: 'reasons' },
                { label: '✨ Surprise', s: 'surprise' },
                { label: '⏳ Countdown', s: 'countdown' },
                { label: '🎁 Final', s: 'final' },
              ].map(({ label, s }) => (
                <button
                  key={s}
                  className={`profile-menu__item ${stage === s ? 'profile-menu__item--active' : ''}`}
                  onClick={() => goTo(s)}
                >
                  {label}
                </button>
              ))}
              <div className="profile-menu__divider" />
              <button className="profile-menu__item profile-menu__item--logout" onClick={restart}>
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      )}

      {stage === 'welcome' && (
        <Welcome name={name} onContinue={() => goTo('hero')} />
      )}

      {stage === 'hero' && (
        <BirthdayHero name={name} profileImage={siteData?.profile_image} onContinue={() => goTo('message')} />
      )}

      {stage === 'message' && (
        <BirthdayMessage
          message={birthdayMessage || `Dear ${name},\nHappy Birthday! (Add your message from the Django admin panel.)`}
          onContinue={() => goTo('gallery')}
        />
      )}

      {stage === 'gallery' && (
        <MemoryGallery memories={memories} onContinue={() => goTo('reasons')} />
      )}

      {stage === 'reasons' && (
        <SpecialReasons reasons={reasons} onContinue={() => goTo('surprise')} />
      )}

      {stage === 'surprise' && (
        <LoveSurprise onContinue={() => goTo('countdown')} />
      )}

      {stage === 'countdown' && (
        <BirthdayCountdown
          targetIso={countdownIso || new Date().toISOString()}
          onContinue={() => goTo('final')}
        />
      )}

      {stage === 'final' && (
        <FinalSurprise
          name={name}
          message={finalMessage || "Happy Birthday! (Add your final message from the Django admin panel.)"}
          onRestart={restart}
        />
      )}
    </>
  )
}
