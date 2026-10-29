# 제주 IP 도감

돌하르방·해녀·한라봉·흑돼지·곶자왈 등 제주 IP를 소개하는 사이트. React + Vite + Supabase(이메일/비밀번호 인증).

## 기능
- 홈: 히어로 + IP 카드 갤러리 (좋아요는 로그인 필요)
- 회원가입 / 로그인 (Supabase Auth)
- 마이페이지: 닉네임 수정, 좋아요한 IP 목록 (로그인 필요)

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
`public/images/` 에 아래 파일명으로 Pixabay 이미지를 넣으세요. 없으면 이모지로 자동 대체됩니다.
`dolhareubang.jpg`, `haenyeo.jpg`, `hallabong.jpg`, `blackpork.jpg`, `gotjawal.jpg`
Pixabay 콘텐츠 라이선스는 상업적 사용 가능·출처 표기 불필요이나, 사이트 하단에 출처를 표기해 두었습니다.

## 4. Vercel 배포
1. GitHub 저장소에 푸시
2. Vercel > Add New Project > 저장소 선택 (Framework: Vite 자동 감지, Build `npm run build`, Output `dist`)
3. Settings > Environment Variables 에 `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` 등록 (Production/Preview/Development 모두) 후 Redeploy
4. 배포 주소를 위 2-4 의 Supabase Site URL / Redirect URLs 에 등록
5. SPA 새로고침 404 방지용 `vercel.json` rewrite 포함됨
