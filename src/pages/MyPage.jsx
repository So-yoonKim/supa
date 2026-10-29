import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { useAuth } from '../AuthContext'
import { PRODUCTS } from '../data'
import IPCard from '../components/IPCard'
import { useLikes } from '../useLikes'

export default function MyPage() {
  const { user } = useAuth()
  const { likes, toggle } = useLikes()
  const [nickname, setNickname] = useState('')
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    supabase
      .from('profiles')
      .select('nickname')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) setError(error.message)
        else setNickname(data?.nickname ?? '')
      })
  }, [user.id])

  const save = async (e) => {
    e.preventDefault()
    setMsg('')
    setError('')
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, nickname: nickname.trim() })
    if (error) setError(error.message)
    else setMsg('저장했어요.')
  }

  const liked = PRODUCTS.filter((ip) => likes.has(ip.id))

  return (
    <div className="mypage">
      <form className="form" onSubmit={save}>
        <h2>마이페이지</h2>
        <p>{user.email}</p>
        <label>닉네임<input value={nickname} onChange={(e) => setNickname(e.target.value)} /></label>
        {error && <p className="error">{error}</p>}
        {msg && <p className="ok">{msg}</p>}
        <button>닉네임 저장</button>
      </form>
      <h2 className="center">내가 좋아요한 상품 ({liked.length})</h2>
      {liked.length === 0 ? (
        <p className="center">아직 좋아요한 상품이 없어요. 홈에서 눌러 보세요!</p>
      ) : (
        <section className="grid">
          {liked.map((ip) => (
            <IPCard key={ip.id} ip={ip} liked onToggle={toggle} />
          ))}
        </section>
      )}
    </div>
  )
}
