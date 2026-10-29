import { Link, useNavigate } from 'react-router-dom'
import { IPS } from '../data'
import IPCard from '../components/IPCard'
import { useAuth } from '../AuthContext'
import { useLikes } from '../useLikes'
import { useCart } from '../CartContext'

export default function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { likes, toggle, error } = useLikes()
  const { items, add, error: cartError } = useCart()

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
        <h1>제주의 이야기를 만나다</h1>
        <p>돌하르방, 해녀, 한라봉, 흑돼지, 곶자왈. 제주를 대표하는 IP를 소개합니다.</p>
        {!user && <Link className="cta" to="/signup">회원가입하고 좋아요 누르기</Link>}
      </section>
      {(error || cartError) && <p className="error center">{error || cartError}</p>}
      <section className="grid">
        {IPS.map((ip) => (
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
