// Vercel 서버리스 함수: Pixabay API 키를 브라우저에 노출하지 않고 사진 한 장을 찾아 돌려줍니다.
// 환경변수: PIXABAY_API_KEY (Vercel > Settings > Environment Variables). 접두사 VITE_ 는 붙이지 않아도 됩니다.
export default async function handler(req, res) {
  const key = process.env.PIXABAY_API_KEY || process.env.VITE_PIXABAY_API_KEY
  if (!key) return res.status(500).json({ error: 'PIXABAY_API_KEY 환경변수가 없습니다. 등록 후 Redeploy 하세요.' })

  const q = String(req.query.q || '').trim().slice(0, 100)
  if (!q) return res.status(400).json({ error: 'q 파라미터가 필요합니다.' })

  const url = 'https://pixabay.com/api/?' + new URLSearchParams({
    key, q, image_type: 'photo', orientation: 'horizontal', safesearch: 'true', per_page: '5',
  })
  try {
    const r = await fetch(url)
    if (!r.ok) return res.status(502).json({ error: `Pixabay 응답 오류 (${r.status}). API 키를 확인하세요.` })
    const data = await r.json()
    const hit = (data.hits || [])[0]
    // Pixabay 약관상 결과를 24시간 캐시해야 하므로 CDN 캐시를 하루로 둡니다.
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=86400')
    return res.status(200).json(hit ? { url: hit.webformatURL, page: hit.pageURL, user: hit.user } : { url: null })
  } catch (e) {
    return res.status(502).json({ error: 'Pixabay에 연결하지 못했습니다.' })
  }
}
