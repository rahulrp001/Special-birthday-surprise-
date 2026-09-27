import React, { useState, useEffect } from 'react'
import {
  adminLogin, adminGetBirthday, adminUpdateBirthday,
  adminGetMemories, adminAddMemory, adminDeleteMemory,
  adminGetReasons, adminAddReason, adminDeleteReason,
  adminChangePassword,
} from '../services/api.js'
import './AdminPanel.css'

export default function AdminPanel() {
  const [open, setOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [authError, setAuthError] = useState('')
  const [tab, setTab] = useState('birthday')
  const [msg, setMsg] = useState('')

  const [bday, setBday] = useState({ name: '', date_of_birth: '', birthday_message: '', final_message: '' })
  const [profileFile, setProfileFile] = useState(null)
  const [musicFile, setMusicFile] = useState(null)

  const [memories, setMemories] = useState([])
  const [memTitle, setMemTitle] = useState('')
  const [memDesc, setMemDesc] = useState('')
  const [memDate, setMemDate] = useState('')
  const [memImage, setMemImage] = useState(null)

  const [reasons, setReasons] = useState([])
  const [rTitle, setRTitle] = useState('')
  const [rDesc, setRDesc] = useState('')
  const [rIcon, setRIcon] = useState('✨')

  const [newPass, setNewPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')

  const [waNumber, setWaNumber] = useState('')
  const [waMsg, setWaMsg] = useState('')

  async function handleAuth(e) {
    e.preventDefault()
    const res = await adminLogin(password)
    if (res.success) { setAuthed(true); setAuthError(''); loadAll() }
    else setAuthError('Wrong password ❌')
  }

  async function loadAll() {
    const [b, m, r] = await Promise.all([
      adminGetBirthday(password),
      adminGetMemories(password),
      adminGetReasons(password),
    ])
    if (b.success && b.data) setBday({
      name: b.data.name || '',
      date_of_birth: b.data.date_of_birth || '',
      birthday_message: b.data.birthday_message || '',
      final_message: b.data.final_message || '',
    })
    if (m.success) setMemories(m.data)
    if (r.success) setReasons(r.data)
  }

  async function saveBirthday(e) {
    e.preventDefault()
    const fd = new FormData()
    Object.entries(bday).forEach(([k, v]) => fd.append(k, v))
    if (profileFile) fd.append('profile_image', profileFile)
    if (musicFile) fd.append('background_music', musicFile)
    const res = await adminUpdateBirthday(password, fd)
    setMsg(res.success ? '✅ Saved!' : `❌ ${res.message}`)
  }

  async function addMemory(e) {
    e.preventDefault()
    if (!memImage) return setMsg('❌ Image required')
    const fd = new FormData()
    fd.append('title', memTitle)
    fd.append('description', memDesc)
    fd.append('memory_date', memDate)
    fd.append('image', memImage)
    const res = await adminAddMemory(password, fd)
    if (res.success) {
      setMemories(prev => [...prev, res.data])
      setMemTitle(''); setMemDesc(''); setMemDate(''); setMemImage(null)
      setMsg('✅ Memory added!')
    } else setMsg(`❌ ${res.message}`)
  }

  async function deleteMemory(id) {
    const res = await adminDeleteMemory(password, id)
    if (res.success) setMemories(prev => prev.filter(m => m.id !== id))
    else setMsg(`❌ ${res.message}`)
  }

  async function addReason(e) {
    e.preventDefault()
    const res = await adminAddReason(password, { title: rTitle, description: rDesc, icon: rIcon })
    if (res.success) {
      setReasons(prev => [...prev, res.data])
      setRTitle(''); setRDesc(''); setRIcon('✨')
      setMsg('✅ Reason added!')
    } else setMsg(`❌ ${res.message}`)
  }

  async function deleteReason(id) {
    const res = await adminDeleteReason(password, id)
    if (res.success) setReasons(prev => prev.filter(r => r.id !== id))
    else setMsg(`❌ ${res.message}`)
  }

  async function changePassword(e) {
    e.preventDefault()
    if (newPass !== confirmPass) return setMsg('❌ Passwords do not match')
    if (newPass.length < 4) return setMsg('❌ Password must be at least 4 characters')
    const res = await adminChangePassword(password, newPass)
    if (res.success) {
      setMsg('✅ Password changed! Use new password next time.')
      setNewPass(''); setConfirmPass('')
    } else setMsg(`❌ ${res.message}`)
  }

  function sendWhatsApp(e) {
    e.preventDefault()
    const number = waNumber.replace(/[^0-9]/g, '')
    if (!number) return setMsg('❌ Number daalo')
    const siteUrl = window.location.origin
    const fullMsg = waMsg
      ? `${waMsg}\n\n🎁 Click here: ${siteUrl}`
      : `🎂 A special birthday surprise is waiting for you! 🎉\n\nClick the link below to open it 👇\n${siteUrl}\n\n💖 Hope you have an amazing day!`
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(fullMsg)}`, '_blank')
  }

  useEffect(() => {
    if (msg) { const t = setTimeout(() => setMsg(''), 3000); return () => clearTimeout(t) }
  }, [msg])

  return (
    <>
      <button className="admin-fab" onClick={() => setOpen(true)} title="Admin Panel">⚙️</button>

      {open && (
        <div className="admin-overlay" onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
          <div className="admin-modal">
            <button className="admin-modal__close" onClick={() => setOpen(false)}>✕</button>
            <h2 className="admin-modal__title">🛠 Admin Panel</h2>

            {!authed ? (
              <form onSubmit={handleAuth} className="admin-auth">
                <input
                  type="password"
                  placeholder="Admin password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoFocus
                />
                <button type="submit" className="admin-btn">Login</button>
                {authError && <p className="admin-error">{authError}</p>}
              </form>
            ) : (
              <>
                {msg && <p className="admin-msg">{msg}</p>}

                <div className="admin-tabs">
                  {['birthday', 'memories', 'reasons', 'password', 'share'].map(t => (
                    <button key={t} className={`admin-tab ${tab === t ? 'admin-tab--active' : ''}`} onClick={() => setTab(t)}>
                      {t === 'birthday' ? '🎂 Birthday' : t === 'memories' ? '📸 Memories' : t === 'reasons' ? '💖 Reasons' : t === 'password' ? '🔑 Password' : '📱 Share'}
                    </button>
                  ))}
                </div>

                {tab === 'birthday' && (
                  <form onSubmit={saveBirthday} className="admin-form">
                    <label>Name
                      <input value={bday.name} onChange={e => setBday(p => ({ ...p, name: e.target.value }))} />
                    </label>
                    <label>Date of Birth
                      <input type="date" value={bday.date_of_birth} onChange={e => setBday(p => ({ ...p, date_of_birth: e.target.value }))} />
                    </label>
                    <label>Birthday Message
                      <textarea rows={4} value={bday.birthday_message} onChange={e => setBday(p => ({ ...p, birthday_message: e.target.value }))} />
                    </label>
                    <label>Final Message
                      <textarea rows={4} value={bday.final_message} onChange={e => setBday(p => ({ ...p, final_message: e.target.value }))} />
                    </label>
                    <label>Profile Image
                      <input type="file" accept="image/*" onChange={e => setProfileFile(e.target.files[0])} />
                    </label>
                    <label>Background Music
                      <input type="file" accept="audio/*" onChange={e => setMusicFile(e.target.files[0])} />
                    </label>
                    <button type="submit" className="admin-btn">Save Changes</button>
                  </form>
                )}

                {tab === 'memories' && (
                  <div className="admin-section">
                    <form onSubmit={addMemory} className="admin-form">
                      <label>Title <input value={memTitle} onChange={e => setMemTitle(e.target.value)} required /></label>
                      <label>Description <input value={memDesc} onChange={e => setMemDesc(e.target.value)} /></label>
                      <label>Date <input type="date" value={memDate} onChange={e => setMemDate(e.target.value)} /></label>
                      <label>Image <input type="file" accept="image/*" onChange={e => setMemImage(e.target.files[0])} required /></label>
                      <button type="submit" className="admin-btn">Add Memory</button>
                    </form>
                    <div className="admin-list">
                      {memories.map(m => (
                        <div key={m.id} className="admin-list-item">
                          <img src={m.image} alt={m.title} />
                          <span>{m.title}</span>
                          <button className="admin-btn admin-btn--danger" onClick={() => deleteMemory(m.id)}>🗑</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {tab === 'reasons' && (
                  <div className="admin-section">
                    <form onSubmit={addReason} className="admin-form">
                      <label>Icon (emoji) <input value={rIcon} onChange={e => setRIcon(e.target.value)} maxLength={2} /></label>
                      <label>Title <input value={rTitle} onChange={e => setRTitle(e.target.value)} required /></label>
                      <label>Description <input value={rDesc} onChange={e => setRDesc(e.target.value)} required /></label>
                      <button type="submit" className="admin-btn">Add Reason</button>
                    </form>
                    <div className="admin-list">
                      {reasons.map(r => (
                        <div key={r.id} className="admin-list-item">
                          <span>{r.icon} {r.title}</span>
                          <button className="admin-btn admin-btn--danger" onClick={() => deleteReason(r.id)}>🗑</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {tab === 'password' && (
                  <form onSubmit={changePassword} className="admin-form">
                    <p style={{ fontSize: '0.85rem', color: '#c9b8e8', margin: 0 }}>Apna admin panel password yahan se change karo.</p>
                    <label>Naya Password
                      <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="Naya password" required />
                    </label>
                    <label>Confirm Password
                      <input type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} placeholder="Dobara likho" required />
                    </label>
                    <button type="submit" className="admin-btn">🔑 Password Change Karo</button>
                  </form>
                )}

                {tab === 'share' && (
                  <form onSubmit={sendWhatsApp} className="admin-form">
                    <div className="wa-site-link">
                      <span>🔗 Website Link:</span>
                      <code>{window.location.origin}</code>
                      <button
                        type="button"
                        className="admin-btn"
                        style={{ padding: '5px 12px', fontSize: '0.78rem' }}
                        onClick={() => { navigator.clipboard.writeText(window.location.origin); setMsg('✅ Link copied!') }}
                      >
                        Copy
                      </button>
                    </div>
                    <label>Recipient ka WhatsApp Number
                      <input
                        type="tel"
                        value={waNumber}
                        onChange={e => setWaNumber(e.target.value)}
                        placeholder="Country code ke saath, e.g. 919876543210"
                        required
                      />
                    </label>
                    <label>Custom Message (optional)
                      <textarea
                        rows={3}
                        value={waMsg}
                        onChange={e => setWaMsg(e.target.value)}
                        placeholder="Kuch likhna ho toh likho, warna default message jayega..."
                      />
                    </label>
                    <p style={{ fontSize: '0.78rem', color: '#a090c0', margin: 0 }}>
                      ⚠️ Website link automatically message mein add ho jaayega.
                    </p>
                    <button type="submit" className="admin-btn wa-btn">
                      💬 WhatsApp pe Bhejo
                    </button>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
