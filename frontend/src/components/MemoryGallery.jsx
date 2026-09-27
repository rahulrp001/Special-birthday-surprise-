import React, { useState } from 'react'
import HeartAnimation from './HeartAnimation.jsx'
import './MemoryGallery.css'

export default function MemoryGallery({ memories, onContinue }) {
  const [activeIndex, setActiveIndex] = useState(null)

  const hasMemories = memories && memories.length > 0

  function openAt(i) { setActiveIndex(i) }
  function close() { setActiveIndex(null) }
  function next() { setActiveIndex((i) => (i + 1) % memories.length) }
  function prev() { setActiveIndex((i) => (i - 1 + memories.length) % memories.length) }

  return (
    <div className="scene gallery-scene">
      <div className="glow-backdrop" />
      <HeartAnimation count={8} />

      <div className="scene__content gallery-scene__content">
        <p className="eyebrow fade-in">our little memories</p>
        <h2 className="fade-slide-up">Our Little Memories 📸</h2>
        <div className="section-divider" />

        {hasMemories ? (
          <div className="gallery-grid">
            {memories.map((m, i) => (
              <button
                key={m.id}
                className="gallery-card fade-slide-up"
                style={{ animationDelay: `${i * 0.08}s` }}
                onClick={() => openAt(i)}
              >
                <img src={m.image} alt={m.title} loading="lazy" />
                <div className="gallery-card__overlay">
                  <span className="gallery-card__title">{m.title}</span>
                  {m.memory_date && <span className="gallery-card__date">{m.memory_date}</span>}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <p className="gallery-empty">
            No memories added yet — add some photos from the Django admin panel.
          </p>
        )}

        <button className="btn" onClick={onContinue} style={{ marginTop: 44 }}>
          Continue →
        </button>
      </div>

      {activeIndex !== null && hasMemories && (
        <div className="lightbox" role="dialog" aria-modal="true">
          <button className="lightbox__close" onClick={close} aria-label="Close">✕</button>
          <button className="lightbox__nav lightbox__nav--prev" onClick={prev} aria-label="Previous">‹</button>

          <div className="lightbox__content zoom-in">
            <img src={memories[activeIndex].image} alt={memories[activeIndex].title} />
            <h3>{memories[activeIndex].title}</h3>
            {memories[activeIndex].description && <p>{memories[activeIndex].description}</p>}
          </div>

          <button className="lightbox__nav lightbox__nav--next" onClick={next} aria-label="Next">›</button>
        </div>
      )}
    </div>
  )
}
