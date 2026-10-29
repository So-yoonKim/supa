import { Link } from 'react-router-dom'
import { PRODUCTS } from '../data'
import { useCart } from '../CartContext'

export default function Cart() {
  const { items, count, setQuantity, remove, error } = useCart()
  const rows = PRODUCTS.filter((ip) => items[ip.id])

  return (
    <section className="cart">
      <h2>🛒 장바구니 ({count})</h2>
      {error && <p className="error">{error}</p>}
      {rows.length === 0 ? (
        <p className="center">
          장바구니가 비어 있어요. <Link to="/">상품 둘러보기</Link>
        </p>
      ) : (
        <ul className="cart-list">
          {rows.map((ip) => (
            <li key={ip.id}>
              <span className="cart-emoji">{ip.emoji}</span>
              <div className="cart-info">
                <strong>{ip.name}</strong>
                <span>{ip.tagline}</span>
              </div>
              <div className="qty">
                <button onClick={() => setQuantity(ip.id, items[ip.id] - 1)} aria-label="수량 감소">−</button>
                <span>{items[ip.id]}</span>
                <button onClick={() => setQuantity(ip.id, items[ip.id] + 1)} aria-label="수량 증가">+</button>
              </div>
              <button className="link danger" onClick={() => remove(ip.id)}>삭제</button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
