// 제주로마트 온라인몰 상품 목록.
// query: Pixabay 검색어(영어가 결과가 잘 나옵니다). /api/pixabay 가 실패하면 emoji 로 대체됩니다.
// id 는 Supabase 의 likes / cart_items 테이블의 ip_id 컬럼에 저장되므로 바꾸지 마세요.
export const CATEGORIES = ['전체', '생선·육류', '과일·채소', '유제품', '간식']

export const PRODUCTS = [
  // 생선·육류
  { id: 'galchi', category: '생선·육류', name: '갈치', emoji: '🐟', query: 'hairtail fish', tagline: '은빛 제주 은갈치', desc: '은빛 비늘이 반짝이는 제주 은갈치. 구이와 조림으로 인기예요.' },
  { id: 'jeonbok', category: '생선·육류', name: '전복', emoji: '🐚', query: 'abalone', tagline: '바다가 키운 보양식', desc: '해녀가 건져 올린 쫄깃한 제주 전복. 회, 죽, 버터구이로 즐겨요.' },
  { id: 'godeungeo', category: '생선·육류', name: '고등어', emoji: '🐠', query: 'mackerel fish', tagline: '고소한 제주 고등어', desc: '살이 단단하고 고소한 제주 고등어. 구이와 조림에 좋아요.' },
  // 과일·채소
  { id: 'applemango', category: '과일·채소', name: '애플망고', emoji: '🥭', query: 'apple mango', tagline: '달콤한 제주 하우스 망고', desc: '붉게 익어 향이 진한 제주 애플망고. 부드럽고 달콤해요.' },
  { id: 'fig', category: '과일·채소', name: '무화과', emoji: '🫐', query: 'fig fruit', tagline: '톡톡 터지는 단맛', desc: '껍질째 먹는 부드러운 무화과. 달콤하고 씨가 톡톡 씹혀요.' },
  { id: 'gamgyul', category: '과일·채소', name: '감귤', emoji: '🍊', query: 'tangerine jeju', tagline: '제주의 겨울 대표 과일', desc: '새콤달콤한 제주 감귤. 비타민이 풍부한 겨울 간식이에요.' },
  { id: 'hallabong', category: '과일·채소', name: '한라봉', emoji: '🍊', query: 'hallabong jeju', tagline: '한라산을 닮은 감귤', desc: '꼭지가 볼록 솟아 한라산을 닮은 달콤한 과일. 겨울 제주의 대표 특산물입니다.' },
  { id: 'gosari', category: '과일·채소', name: '고사리', emoji: '🌿', query: 'bracken fern', tagline: '제주 들판의 봄나물', desc: '비 온 뒤 들판에서 자란 제주 고사리. 나물과 육개장에 어울려요.' },
  // 유제품
  { id: 'hallamilk', category: '유제품', name: '한라우유', emoji: '🥛', query: 'milk bottle', tagline: '고소한 한라산 우유', desc: '신선하고 고소한 맛의 우유. 아침 식사에 좋아요.' },
  { id: 'jejumilk', category: '유제품', name: '제주우유', emoji: '🥛', query: 'milk carton', tagline: '청정 제주 우유', desc: '청정 제주에서 자란 젖소의 우유. 깔끔하고 담백해요.' },
  { id: 'sanghayogurt', category: '유제품', name: '상하목장 요거트', emoji: '🍦', query: 'yogurt', tagline: '부드러운 떠먹는 요거트', desc: '부드럽고 진한 맛의 요거트. 과일과 함께 먹기 좋아요.' },
  // 간식
  { id: 'gamgyulcookie', category: '간식', name: '제주감귤쿠키', emoji: '🍪', query: 'orange cookies', tagline: '감귤향 가득한 쿠키', desc: '제주 감귤의 향을 담은 바삭한 쿠키. 선물용으로 인기예요.' },
  { id: 'gwajeul', category: '간식', name: '과즐', emoji: '🍘', query: 'korean traditional confection yugwa', tagline: '바삭한 제주 전통 과자', desc: '쌀과 조청으로 만든 바삭하고 달콤한 제주 전통 과자.' },
]
