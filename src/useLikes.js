import { useCallback, useEffect, useState } from 'react'
import { supabase } from './supabase'
import { useAuth } from './AuthContext'

export function useLikes() {
  const { user } = useAuth()
  const [likes, setLikes] = useState(new Set())
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) {
      setLikes(new Set())
      return
    }
    supabase
      .from('likes')
      .select('ip_id')
      .then(({ data, error }) => {
        if (error) setError(error.message)
        else setLikes(new Set(data.map((r) => r.ip_id)))
      })
  }, [user])

  const toggle = useCallback(
    async (ipId) => {
      if (!user) return false
      setError('')
      const has = likes.has(ipId)
      const q = has
        ? supabase.from('likes').delete().eq('user_id', user.id).eq('ip_id', ipId)
        : supabase.from('likes').insert({ user_id: user.id, ip_id: ipId })
      const { error } = await q
      if (error) {
        setError(error.message)
        return true
      }
      setLikes((prev) => {
        const next = new Set(prev)
        has ? next.delete(ipId) : next.add(ipId)
        return next
      })
      return true
    },
    [user, likes]
  )

  return { likes, toggle, error }
}
