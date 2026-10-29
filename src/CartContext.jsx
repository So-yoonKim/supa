import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from './supabase'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [items, setItems] = useState({}) // { [ip_id]: quantity }
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) {
      setItems({})
      return
    }
    supabase
      .from('cart_items')
      .select('ip_id, quantity')
      .then(({ data, error }) => {
        if (error) setError(error.message)
        else setItems(Object.fromEntries(data.map((r) => [r.ip_id, r.quantity])))
      })
  }, [user])

  // 수량을 지정 값으로 저장 (0 이하이면 삭제)
  const setQuantity = useCallback(
    async (ipId, quantity) => {
      if (!user) return false
      setError('')
      const q =
        quantity > 0
          ? supabase.from('cart_items').upsert({ user_id: user.id, ip_id: ipId, quantity })
          : supabase.from('cart_items').delete().eq('user_id', user.id).eq('ip_id', ipId)
      const { error } = await q
      if (error) {
        setError(error.message)
        return true
      }
      setItems((prev) => {
        const next = { ...prev }
        if (quantity > 0) next[ipId] = quantity
        else delete next[ipId]
        return next
      })
      return true
    },
    [user]
  )

  const add = useCallback((ipId) => setQuantity(ipId, (items[ipId] ?? 0) + 1), [items, setQuantity])
  const remove = useCallback((ipId) => setQuantity(ipId, 0), [setQuantity])

  const count = useMemo(() => Object.values(items).reduce((a, b) => a + b, 0), [items])

  return (
    <CartContext.Provider value={{ items, count, add, setQuantity, remove, error }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
