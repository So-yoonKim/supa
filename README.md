# 제주로마트 온라인몰

제주 먹거리(생선·육류, 과일·채소, 유제품, 간식)를 판매하는 온라인몰 데모. React + Vite + Supabase(이메일/비밀번호 인증).

## 기능
- 홈: 카테고리 탭 + 검색 + 상품 카드 (좋아요는 로그인 필요)
- 회원가입 / 로그인 (Supabase Auth)
- 마이페이지: 닉네임 수정, 좋아요한 상품 목록 (로그인 필요)

## 1. 로컬 준비
1. [Node.js LTS](https://nodejs.org) 설치 (이 PC에는 아직 없음)
2. 의존성 설치 후 실행
   ```bash
   npm install
   npm run dev
   ```

## 2. Supabase 설정
1. **DB 테이블 만들기**: Supabase 대시보드 > SQL Editor > New query 에 `supabase/schema.sql` 내용을 붙여넣고 Run.
   (profiles, likes 테이블 + 가입 시 프로필 자동 생성 트리거 + RLS 정책)
2. **키 찾기**: Project Settings > API (또는 상단 Connect 버튼)
   - Project URL: `https://aelomkubcfpeifkwofhd.supabase.co`
   - `anon` `public` 키 → 프론트엔드용. **`service_role` 키는 절대 사용/커밋 금지.**
3. **로컬 `.env`**: `.env.example` 을 `.env` 로 복사하고 `VITE_SUPABASE_ANON_KEY` 에 anon 키를 붙여넣기. (`.env` 는 `.gitignore` 로 커밋되지 않음)
4. **Auth URL 설정**: Authentication > URL Configuration
   - Site URL: 배포 주소 (예: `https://내프로젝트.vercel.app`)
   - Redirect URLs: `http://localhost:5173/**`, `https://내프로젝트.vercel.app/**`
5. (선택) 개발 중 이메일 확인을 끄려면 Authentication > Sign In / Providers > Email 의 "Confirm email" 해제. 켜 두면 가입 후 메일의 링크를 눌러야 로그인됩니다.

## 3. 이미지 (Pixabay)
사진은 Pixabay API 로 가져옵니다. 키가 브라우저에 노출되지 않도록 Vercel 서버리스 함수(`api/pixabay.js`)가 대신 호출합니다.

1. https://pixabay.com/api/docs/ 에서 로그인 후 무료 API 키를 확인합니다.
2. Vercel > Settings > Environment Variables 에 **`PIXABAY_API_KEY`** 로 등록 (접두사 `VITE_` 없이, Production/Preview/Development 모두).
   - `VITE_PIXABAY_API_KEY` 이름으로 등록해 두었어도 동작합니다. 다만 `VITE_` 접두사 변수는 일반적으로 브라우저 코드에 포함되어 공개되므로 `PIXABAY_API_KEY` 를 권장합니다.
3. 환경변수는 **등록 후 Redeploy** 해야 적용됩니다 (Deployments > 최신 배포 ... > Redeploy).
4. 로컬에서 `/api` 를 테스트하려면 `npm run dev` 대신 `npx vercel dev` 를 사용하세요. (`npm run dev` 에서는 /api 가 없어 `public/images/` 파일 또는 이모지로 대체됩니다.)
5. 안 보일 때 확인: 배포주소/api/pixabay?q=jeju 를 브라우저로 열어 보세요. `{"url": ...}` 이면 정상, `PIXABAY_API_KEY 환경변수가 없습니다` 이면 이름 오타 또는 Redeploy 누락, `Pixabay 응답 오류` 이면 키가 틀린 것입니다.

검색어는 `src/data.js` 의 `query` 에서 바꿀 수 있습니다. API 가 실패하면 `public/images/` 의 파일(`dolhareubang.jpg` 등), 그것도 없으면 이모지로 대체됩니다.
Pixabay 약관상 결과는 24시간 캐시(함수가 CDN 캐시 1일 설정)하고, 카드에 촬영자와 출처를 표기합니다.

## 4. Vercel 배포
1. GitHub 저장소에 푸시
2. Vercel > Add New Project > 저장소 선택 (Framework: Vite 자동 감지, Build `npm run build`, Output `dist`)
3. Settings > Environment Variables 에 `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` 등록 (Production/Preview/Development 모두) 후 Redeploy
4. 배포 주소를 위 2-4 의 Supabase Site URL / Redirect URLs 에 등록
5. SPA 새로고침 404 방지용 `vercel.json` rewrite 포함됨
