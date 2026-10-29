import { Link, NavLink, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { CartProvider, useCart } from './CartContext'
import { isConfigured, supabase } from './supabase'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'
import MyPage from './pages/MyPage'
import Cart from './pages/Cart'

function Protected({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <p className="center">불러오는 중…</p>
  return user ? children : <Navigate to="/login" replace />
}

function AppInner() {
  const { user } = useAuth()
  const { count } = useCart()
  const navigate = useNavigate()

  const logout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <>
      <header className="nav">
        <Link to="/" className="logo">🍊 제주로마트 온라인몰</Link>
        <nav>
          <NavLink to="/">홈</NavLink>
          {user ? (
            <>
              <NavLink to="/cart">🛒 장바구니{count > 0 ? ` (${count})` : ''}</NavLink>
              <NavLink to="/mypage">마이페이지</NavLink>
              <button className="link" onClick={logout}>로그아웃</button>
            </>
          ) : (
            <>
              <NavLink to="/login">로그인</NavLink>
              <NavLink to="/signup">회원가입</NavLink>
            </>
          )}
        </nav>
      </header>
      {!isConfigured && (
        <div className="banner">
          Supabase 환경변수(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)가 설정되지 않았습니다. README를 참고하세요.
        </div>
      )}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mypage" element={<Protected><MyPage /></Protected>} />
          <Route path="/cart" element={<Protected><Cart /></Protected>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="footer">
        이미지 출처: <a href="https://pixabay.com" target="_blank" rel="noreferrer">Pixabay</a> (Pixabay 콘텐츠 라이선스)
      </footer>
    </>
  )
}

export default function App() {
  return (
    <CartProvider>
      <AppInner />
    </CartProvider>
  )
}
