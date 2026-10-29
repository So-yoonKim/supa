import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CATEGORIES, PRODUCTS } from '../data'
import IPCard from '../components/IPCard'
import { useAuth } from '../AuthContext'
import { useLikes } from '../useLikes'
import { useCart } from '../CartContext'

export default function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { likes, toggle, error } = useLikes()
  const { items, add, error: cartError } = useCart()
  const [category, setCategory] = useState('전체')
  const [keyword, setKeyword] = useState('')

  // 카테고리 + 검색어(상품명·분류·설명, 띄어쓰기/대소문자 무시)로 페이지 안의 상품을 찾습니다.
  const shown = useMemo(() => {
    const norm = (s) => s.toLowerCase().replace(/\s+/g, '')
    const k = norm(keyword)
    return PRODUCTS.filter(
      (p) => (category === '전체' || p.category === category) && (!k || norm(`${p.name}${p.category}${p.tagline}${p.desc}`).includes(k))
    )
  }, [category, keyword])

  const onToggle = async (id) => {
    if (!user) {
      alert('좋아요는 로그인 후 이용할 수 있어요.')
      navigate('/login')
      return
    }
    await toggle(id)
  }

  const onAddCart = async (id, n = 1) => {
    if (!user) {
      alert('장바구니는 로그인 후 이용할 수 있어요.')
      navigate('/login')
      return
    }
    await add(id, n)
  }

  return (
    <>
      <section className="hero">
        <h1>제주로마트 온라인몰</h1>
        <p>갈치, 전복, 한라봉, 감귤까지. 제주의 신선한 먹거리를 집에서 만나 보세요.</p>
        <input
          className="search"
          type="search"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="상품 검색 (예: 한라봉, 우유)"
          aria-label="상품 검색"
        />
        {!user && <Link className="cta" to="/signup">회원가입하고 장바구니 담기</Link>}
      </section>
      <nav className="cats" aria-label="카테고리">
        {CATEGORIES.map((c) => (
          <button key={c} className={c === category ? 'cat on' : 'cat'} onClick={() => setCategory(c)}>
            {c}
          </button>
        ))}
      </nav>
      {(error || cartError) && <p className="error center">{error || cartError}</p>}
      {shown.length === 0 && <p className="center empty">"{keyword}"에 맞는 상품이 없어요.</p>}
      <section className="grid">
        {shown.map((ip) => (
          <IPCard
            key={ip.id}
            ip={ip}
            liked={likes.has(ip.id)}
            onToggle={onToggle}
            inCart={items[ip.id] ?? 0}
            onAddCart={onAddCart}
          />
        ))}
      </section>
    </>
  )
}
