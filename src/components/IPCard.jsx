import { useState } from 'react'

export default function IPCard({ ip, liked, onToggle }) {
  const [imgOk, setImgOk] = useState(true)
  return (
    <article className="card">
      <div className="thumb">
        {imgOk ? (
          <img src={ip.image} alt={ip.name} onError={() => setImgOk(false)} loading="lazy" />
        ) : (
          <span className="emoji">{ip.emoji}</span>
        )}
      </div>
      <div className="body">
        <h3>{ip.name}</h3>
        <p className="tag">{ip.tagline}</p>
        <p>{ip.desc}</p>
        <button className={liked ? 'like on' : 'like'} onClick={() => onToggle(ip.id)}>
          {liked ? '♥ 좋아요 취소' : '♡ 좋아요'}
        </button>
      </div>
    </article>
  )
}
