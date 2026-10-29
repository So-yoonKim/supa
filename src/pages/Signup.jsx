import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

export default function Signup() {
  const navigate = useNavigate()
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setInfo('')
    if (password.length < 6) return setError('비밀번호는 6자 이상이어야 합니다.')
    setBusy(true)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nickname: nickname.trim() || email.split('@')[0] },
        emailRedirectTo: window.location.origin,
      },
    })
    setBusy(false)
    if (error) return setError(error.message)
    if (data.session) navigate('/')
    else setInfo('가입 확인 메일을 보냈어요. 메일의 링크를 누른 뒤 로그인해 주세요.')
  }

  return (
    <form className="form" onSubmit={submit}>
      <h2>회원가입</h2>
      <label>닉네임<input value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="돌하르방" /></label>
      <label>이메일<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
      <label>비밀번호 (6자 이상)<input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" /></label>
      {error && <p className="error">{error}</p>}
      {info && <p className="ok">{info}</p>}
      <button disabled={busy}>{busy ? '처리 중…' : '가입하기'}</button>
      <p>이미 계정이 있나요? <Link to="/login">로그인</Link></p>
    </form>
  )
}
