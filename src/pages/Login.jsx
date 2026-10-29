import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setBusy(false)
    if (error) {
      setError(
        error.message === 'Invalid login credentials'
          ? '이메일 또는 비밀번호가 올바르지 않습니다.'
          : error.message
      )
      return
    }
    navigate('/')
  }

  return (
    <form className="form" onSubmit={submit}>
      <h2>로그인</h2>
      <label>이메일<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
      <label>비밀번호<input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" /></label>
      {error && <p className="error">{error}</p>}
      <button disabled={busy}>{busy ? '처리 중…' : '로그인'}</button>
      <p>계정이 없나요? <Link to="/signup">회원가입</Link></p>
    </form>
  )
}
