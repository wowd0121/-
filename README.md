# 감정일기 앱

Supabase를 기반으로 한 감정일기 관리 애플리케이션입니다.

## 주요 기능

### 🔐 사용자 인증
- Supabase Auth를 통한 이메일/비밀번호 로그인
- 회원가입 및 비밀번호 재설정
- 세션 관리 및 자동 로그인

### 📝 일기 관리
- **일기 작성**: 제목, 내용, 감정 태그 선택
- **일기 목록**: 사용자별 일기 목록 조회
- **일기 상세**: 일기 내용 상세 보기
- **일기 수정**: 기존 일기 내용 수정
- **일기 삭제**: 일기 삭제 기능

### 🧭 네비게이션 기능
- **앞으로가기/뒤로가기**: 이전/다음 일기로 이동
- **목록 이동**: 일기 목록으로 돌아가기
- **AI 챗봇**: 일기와 관련된 AI 대화 기능

### 🎨 감정 태그
- 기쁨 😊
- 분노 😡
- 불안 😰
- 슬픔 😢
- 평온 😌
- 놀람 😲

## 기술 스택

- **Frontend**: Next.js 14, TypeScript, Emotion
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Styling**: Emotion (CSS-in-JS)
- **State Management**: React Hooks

## 데이터베이스 스키마

### diaries 테이블
```sql
CREATE TABLE diaries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  emotion TEXT NOT NULL,
  emoji TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 보안 정책
- Row Level Security (RLS) 활성화
- 사용자는 자신의 일기만 조회/수정/삭제 가능
- 자동 인덱싱으로 성능 최적화

## 설치 및 실행

1. 환경 변수 설정
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

2. 의존성 설치
```bash
npm install
```

3. 개발 서버 실행
```bash
npm run dev
```

4. Supabase 데이터베이스 설정
- `supabase-schema.sql` 파일의 내용을 Supabase SQL Editor에서 실행

## 페이지 구조

- `/` - 메인 페이지
- `/auth/login` - 로그인
- `/auth/register` - 회원가입
- `/auth/forgot-password` - 비밀번호 재설정
- `/diary` - 일기 목록
- `/diary/[id]` - 일기 상세
- `/diary/[id]/edit` - 일기 수정
- `/write` - 일기 작성
- `/chat/[id]` - AI 챗봇

## 주요 컴포넌트

### 일기 관리 (`src/lib/diary.ts`)
- `getDiaries()` - 사용자 일기 목록 조회
- `getDiary()` - 일기 상세 조회
- `createDiary()` - 일기 생성
- `updateDiary()` - 일기 수정
- `deleteDiary()` - 일기 삭제
- `getAdjacentDiaries()` - 이전/다음 일기 조회

### 인증 관리 (`src/lib/auth.tsx`)
- `useAuth()` - 인증 상태 관리
- `signIn()` - 로그인
- `signUp()` - 회원가입
- `signOut()` - 로그아웃

## 네비게이션 기능

### 앞으로가기/뒤로가기
- 일기 상세 페이지에서 이전/다음 일기로 이동
- 최신순으로 정렬된 일기 목록에서 순차적 이동
- 첫 번째/마지막 일기에서는 해당 버튼 비활성화

### 버튼 구성
- **이전 일기** (←): 이전 일기로 이동
- **다음 일기** (→): 다음 일기로 이동
- **AI 챗봇**: 현재 일기와 관련된 AI 대화
- **목록으로**: 일기 목록으로 돌아가기
- **수정**: 일기 수정 페이지로 이동
- **삭제**: 일기 삭제 (확인 후)

## 보안 기능

- 사용자별 데이터 격리
- RLS 정책으로 데이터 접근 제어
- 인증된 사용자만 일기 관리 가능
- 다른 사용자의 일기 접근 차단

## 성능 최적화

- 데이터베이스 인덱싱
- 클라이언트 사이드 캐싱
- 로딩 상태 표시
- 에러 처리 및 사용자 피드백
