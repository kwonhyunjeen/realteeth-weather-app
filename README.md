# Weather App

대한민국 행정구역을 검색하고 선택한 지역의 날씨를 확인할 수 있는 React 기반 날씨 앱입니다. 현재 위치 기반 날씨 조회, 지역 검색, 즐겨찾기, 시간대별 기온 표시를 제공합니다.

## 실행 방법

### 1. 패키지 설치

```bash
pnpm install
```

### 2. 환경 변수 설정

루트 디렉토리의 `.env.template`을 참고해 `.env` 파일을 생성합니다.

```bash
KAKAO_REST_API_KEY=카카오_REST_API_키
OPENWEATHER_API_KEY=OpenWeatherMap_API_키
```

- `KAKAO_REST_API_KEY`: Kakao Local API 호출에 사용합니다.
- `OPENWEATHER_API_KEY`: OpenWeatherMap One Call API 호출에 사용합니다.

클라이언트에서 API 키가 노출되지 않도록 Vercel Serverless Function을 프록시로 사용합니다.

### 3. 개발 서버 실행

```bash
pnpm dev
```

개발 서버 실행 시 Vite 개발 서버와 TypeScript watch가 함께 실행됩니다.
Vercel 서버리스 함수 실행으로 인해 Vercel 프로젝트와의 연동이 필요합니다.

### 4. 빌드 및 로컬 프리뷰

```bash
pnpm build
pnpm preview
```

## 구현 기능

### 현재 위치 기반 날씨 조회

- 앱 첫 진입 시 브라우저 Geolocation API로 현재 위치 좌표를 가져옵니다.
- 현재 위치 좌표를 기준으로 OpenWeatherMap One Call API에서 날씨 정보를 조회합니다.
- 좌표 조회 중, 날씨 조회 중, 위치 권한 실패, 날씨 조회 실패 상태를 텍스트로 UI에 표시합니다.

### 지역 검색

- 제공된 대한민국 행정구역 데이터를 앱 내부 데이터로 사용합니다.
- 시/군/구/동 단위의 행정구역명을 검색할 수 있습니다.
- 검색어는 공백 차이와 행정구역 접미사 차이를 줄이기 위해 정규화한 뒤 매칭합니다.
- 검색 결과는 최대 20개까지 표시합니다.
- 지역을 선택하면 Kakao Local API로 행정구역명을 좌표로 변환한 뒤 해당 위치의 날씨를 조회합니다.
- 좌표를 찾을 수 없는 지역은 “해당 장소의 정보가 제공되지 않습니다.” 메시지를 표시합니다.

### 날씨 상세 정보

- 선택한 위치의 현재 기온을 표시합니다.
- 당일 최고 기온과 최저 기온을 표시합니다.
- 현재 날씨 설명을 표시합니다.
- 앞으로 12개 시간대의 시간별 기온을 가로 스크롤 목록으로 표시합니다.
- Kakao Local API의 역지오코딩 결과를 활용해 좌표 기준 지역명을 표시합니다.

### 즐겨찾기

- 선택한 지역을 즐겨찾기에 추가할 수 있습니다.
- 즐겨찾기는 최대 6개까지 추가할 수 있습니다.
- 즐겨찾기 목록은 `localStorage`에 저장합니다.
- 즐겨찾기 카드에는 지역 별칭, 지역명, 현재 기온, 당일 최고/최저 기온을 표시합니다.
- 즐겨찾기 카드를 선택하면 해당 지역의 상세 날씨 정보를 표시합니다.
- 즐겨찾기 별칭을 편집할 수 있습니다.
- 즐겨찾기를 삭제할 수 있습니다.

### 반응형 UI

- 데스크탑에서는 좌측 사이드바에 검색/즐겨찾기 목록을, 우측 영역에 상세 날씨 정보를 배치합니다.
- 모바일 화면에서는 콘텐츠 영역 중심으로 표시되도록 레이아웃을 조정합니다.

## 기술적 의사결정

### API 키 보호를 위한 프록시 구성

OpenWeatherMap과 Kakao API 키를 클라이언트 코드에 직접 포함하지 않기 위해 `/api` 경로의 Vercel Serverless Function을 프록시로 구성했습니다. 클라이언트는 `/openweathermap`, `/kakao` 경로로 요청하고, `vercel.json`의 rewrite 설정을 통해 서버리스 함수가 실제 외부 API 요청을 수행합니다.

### 즐겨찾기 저장 방식

즐겨찾기는 서버 상태가 아니라 사용자 브라우저에 종속된 개인 설정이므로 `localStorage`에 저장합니다. 저장 데이터에는 행정구역 ID, 좌표, 별칭을 포함해 앱을 다시 열어도 즐겨찾기 카드와 날씨 조회에 필요한 정보를 복원할 수 있게 했습니다.

### 서버 상태 관리

좌표 조회, 날씨 조회, 역지오코딩 조회는 TanStack Query로 관리합니다. 동일한 위치의 비동기 요청 상태를 선언적으로 처리하고, 로딩/성공/실패 상태를 UI와 분리해 관리하기 위해 사용했습니다.

### FSD 기준 책임 분리

프로젝트는 Feature-Sliced Design 기준으로 레이어를 나누었습니다. 외부 API와 도메인 모델은 `entities`, 사용자 행동 단위의 로직은 `features`, 화면 조합 단위의 UI는 `widgets`, 페이지 진입점은 `pages`에 배치했습니다.

## 기술 스택

- React
- TypeScript
- Vite
- TanStack Query
- Tailwind CSS
- Vitest
- Kakao Local API
- OpenWeatherMap One Call API
- Vercel Serverless Function

## 프로젝트 구조

```txt
src/
  app/
    App.tsx
    main.tsx
    styles.css
  pages/                     # 페이지 컴포넌트
    {SLICE}/                   # 페이지/라우팅 단위 슬라이스 (예: home, weather)
      index.tsx
      {COMPONENT}.tsx
  widgets/                   # 독립적으로 동작하는 UI 컴포넌트
    {SLICE}/                   # 컴포넌트 단위 슬라이스 (예: weather-board)
      index.tsx
      {COMPONENT}.tsx
  features/                  # 제품 기능을 구현하는 재사용 가능한 로직
    {SLICE}/                   # 도메인/기능 단위 슬라이스 (예: weather)
      config/                # 상수 선언
      lib/                   # 비즈니스 로직 (예: 데이터 계산/가공 함수, 유효성 검사 정책)
      model/                 # 타입/스키마
      ui/                    # 도메인 맥락을 이해하지만 외부 데이터에는 직접 의존하지 않는 컴포넌트
  entities/                  # 외부 데이터
    {SLICE}/                   # 도메인/리소스 단위 슬라이스 (예: weather)
      api/                   # API 함수/쿼리
      model/                 # API 타입/스키마
  shared/                    # 공통 - 슬라이스 없음
    api/                       # API 클라이언트/인스턴스 및 클래스/타입
    lib/                       # 유틸리티 함수 및 React Hooks
    ui/                        # 외부 데이터에 직접 의존하지 않는 컴포넌트
api/
  kakao/                     # Kakao API 프록시
  openweathermap/            # OpenWeatherMap API 프록시
```

### 주요 디렉토리

- `src/entities/location`: 행정구역 데이터, 지역 검색, Kakao 지오코딩/역지오코딩 API
- `src/entities/weather`: OpenWeatherMap 날씨 API 요청과 날씨 응답 타입
- `src/features/bookmark`: 즐겨찾기 제한 정책
- `src/features/location`: 현재 위치 좌표 조회
- `src/features/weather`: 기온 표시 포맷팅
- `src/widgets/district-search`: 지역 검색 UI
- `src/widgets/district-weather-card`: 현재 위치/즐겨찾기 날씨 카드 UI
- `src/widgets/weather-detail`: 선택한 위치의 상세 날씨 UI
- `src/widgets/weather-layout`: 데스크탑/모바일 레이아웃

## 제출 정보

- GitHub Repository: https://github.com/kwonhyunjeen/weather-app
- 배포 URL: https://weather-app-nine-ecru-15.vercel.app
