import { useEffect, useState } from 'react'

export default function IPCard({ ip, liked, onToggle, inCart = 0, onAddCart }) {
  const [photo, setPhoto] = useState(null) // Pixabay API 결과 { url, page, user }
  const [imgOk, setImgOk] = useState(true)
  const [qty, setQty] = useState(1) // 담을 수량

  useEffect(() => {
    let alive = true
    fetch(`/api/pixabay?q=${encodeURIComponent(ip.query)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (alive && d && d.url) { setPhoto(d); setImgOk(true) } })
      .catch(() => {})
    return () => { alive = false }
  }, [ip.query])

  const src = photo ? photo.url : ip.image
  const onError = () => (photo ? setPhoto(null) : setImgOk(false))

  return (
    <article className="card">
      <div className="thumb">
        {imgOk ? (
          <img src={src} alt={ip.name} onError={onError} loading="lazy" />
        ) : (
          <span className="emoji">{ip.emoji}</span>
        )}
      </div>
      <div className="body">
        <h3>{ip.name}</h3>
        <p className="tag">{ip.tagline}</p>
        <p>{ip.desc}</p>
        {photo && (
          <p className="credit">
            사진: <a href={photo.page} target="_blank" rel="noreferrer">{photo.user}</a> / Pixabay
          </p>
        )}
        <div className="actions">
          <button className={liked ? 'like on' : 'like'} onClick={() => onToggle(ip.id)}>
            {liked ? '♥ 좋아요 취소' : '♡ 좋아요'}
          </button>
          {onAddCart && (
            <>
              <div className="qty pick">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="수량 감소">−</button>
                <span>{qty}</span>
                <button onClick={() => setQty((q) => Math.min(99, q + 1))} aria-label="수량 증가">+</button>
              </div>
              <button className="cart-btn" onClick={() => onAddCart(ip.id, qty)}>
                🛒 담기{inCart > 0 ? ` (${inCart})` : ''}
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  )
}
