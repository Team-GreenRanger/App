# EcoLife React Application

안드로이드 WebView에서 JavaScript Bridge를 통해 네이티브 기능에 접근하는 React + TypeScript 애플리케이션입니다.

## 주요 기능

### 1. 안드로이드 Bridge API
- 진동 제어 (단일/패턴)
- 토스트 메시지 표시
- 알림 표시
- 클립보드 작업
- 공유 기능
- 시스템 정보 조회
- 화면 밝기 제어
- 로컬 저장소 관리
- 네비게이션 제어

### 2. TypeScript 타입 정의
- 완전한 타입 안전성
- 자동완성 지원
- 컴파일 타임 오류 검출

### 3. React Hook 기반 API
- `useAndroidApi`: 기본 안드로이드 API 접근
- `useAndroidStorage`: 로컬 저장소 관리

## 프로젝트 구조

```
src/
├── api/
│   ├── AndroidApi.ts          # 안드로이드 API 래퍼 클래스
│   └── index.ts
├── hooks/
│   ├── useAndroidApi.ts       # 안드로이드 API 훅
│   ├── useAndroidStorage.ts   # 저장소 전용 훅
│   └── index.ts
├── types/
│   ├── android-bridge.types.ts # 타입 정의
│   └── index.ts
├── pages/
│   ├── HomePage.tsx
│   ├── RankingPage.tsx
│   ├── MissionsPage.tsx
│   ├── MapPage.tsx
│   └── MyPage.tsx
├── utils/
│   └── android.utils.ts       # 유틸리티 함수
├── App.tsx                    # 메인 앱 컴포넌트
└── main.tsx                   # 엔트리 포인트
```

## 설치

```bash
npm install
```

## 개발 환경

### 개발자 네비게이션
개발 모드(`npm run dev`)에서만 하단에 개발자용 네비게이션바가 표시됩니다:
- 5개 페이지 직접 네비게이션 (home, ranking, missions, map, my)
- 현재 활성 페이지 하이라이트
- 프로덕션 빌드에서는 표시되지 않음
- 안드로이드 네이티브 네비게이션과 동일한 기능

### 환경별 실행
```bash
npm run dev        # 개발 모드 - 개발자 네비게이션 포함
npm run build      # 프로덕션 빌드 - 개발자 네비게이션 제외
npm run preview    # 빌드 미리보기
npm run lint       # 코드 린팅
npm run type-check # 타입 체크
```

## 기술 스택

- **React 18** - UI 라이브러리
- **TypeScript** - 타입 안전성
- **Vite** - 빌드 도구
- **Tailwind CSS** - 유틸리티 기반 CSS 프레임워크
- **React Router** - 클라이언트 사이드 라우팅
- **ESLint** - 코드 품질 관리

## 사용 방법

### 1. 기본 사용법

```tsx
import { useAndroidApi } from '@/hooks/useAndroidApi';

const MyComponent = () => {
  const { showToast, vibrate, isAvailable } = useAndroidApi();

  const handleClick = () => {
    if (isAvailable) {
      showToast({ message: '안녕하세요!' });
      vibrate({ duration: 200 });
    }
  };

  return <button onClick={handleClick}>테스트</button>;
};
```

### 2. 저장소 사용법

```tsx
import { useAndroidStorage } from '@/hooks/useAndroidStorage';

interface UserData {
  name: string;
  level: number;
}

const UserProfile = () => {
  const { data, save, isLoading } = useAndroidStorage<UserData>('user', {
    name: '기본값',
    level: 1
  });

  const updateLevel = () => {
    if (data) {
      save({ ...data, level: data.level + 1 });
    }
  };

  if (isLoading) return <div>로딩 중...</div>;

  return (
    <div>
      <p>이름: {data?.name}</p>
      <p>레벨: {data?.level}</p>
      <button onClick={updateLevel}>레벨업</button>
    </div>
  );
};
```

### 3. 직접 API 사용법

```tsx
import AndroidApi from '@/api/AndroidApi';

// 직접 API 호출
const result = await AndroidApi.saveToStorage('key', 'value');
if (result.success) {
  console.log('저장 성공');
}
```

### 4. 컴포넌트 사용법

```tsx
import { 
  CarbonCreditCard, 
  EcoTipCard, 
  LearnMoreCard,
  RankingItem,
  StatCard 
} from '@/components';

// Carbon Credit 카드
<CarbonCreditCard 
  points={4400} 
  onClick={() => console.log('클릭됨')} 
/>

// Eco Tip 카드
<EcoTipCard
  title="오늘의 친환경 팁"
  description="전자기기 플러그를 뽑아보세요!"
  icon="💡"
/>

// 랭킹 아이템
<RankingItem
  rank={1}
  name="사용자 이름"
  points={4400}
  isCurrentUser={true}
/>
```

## React Router 설정

HashRouter를 사용하여 안드로이드 WebView와 호환성을 보장합니다.

```tsx
// 라우팅 예시
<HashRouter>
  <Routes>
    <Route path="/home" element={<HomePage />} />
    <Route path="/ranking" element={<RankingPage />} />
    {/* ... */}
  </Routes>
</HashRouter>
```

## 안드로이드 연동

안드로이드에서 이 앱을 로드할 때:

1. WebView에 JavaScript Interface 등록
2. `window.EcoLifeApp.AndroidBridge` 객체 제공
3. 모든 메서드가 동기적으로 작동

## 주의사항

- 안드로이드 환경이 아닌 경우 `isAvailable`로 확인 후 사용
- 에러 핸들링은 각 API 메서드에서 자동 처리
- Promise 기반 API로 비동기 작업 지원
- TypeScript 컴파일 오류 해결 후 빌드 필요