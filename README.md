# README.md

## 디렉토리 구조

디렉토리 구조는 **Feature-Sliced Design (FSD)**를 기반으로 하며, 슬라이스와 세그먼트는 아래 구조로 확정합니다.

```
- src/
    - app/
        - App.tsx
        - main.tsx
        - styles.css
    - pages/                     # 페이지 컴포넌트
        - {SLICE}/                   # 페이지/라우팅 단위 슬라이스 (예: home, weather)
            - index.tsx
            - {COMPONENT}.tsx
    - widgets/                   # 독립적으로 동작하는 UI 컴포넌트
        - {SLICE}/                   # 컴포넌트 단위 슬라이스 (예: weather-board)
            - index.tsx
            - {COMPONENT}.tsx
    - features/                  # 제품 기능을 구현하는 재사용 가능한 로직
        - {SLICE}/                   # 도메인/기능 단위 슬라이스 (예: weather)
            - config/                # 상수 선언
            - lib/                   # 비즈니스 로직 (예: 데이터 계산/가공 함수, 유효성 검사 정책)
            - model/                 # 타입/스키마
            - ui/                    # 도메인 맥락을 이해하지만 외부 데이터에는 직접 의존하지 않는 컴포넌트
    - entities/                  # 외부 데이터
        - {SLICE}/                   # 도메인/리소스 단위 슬라이스 (예: weather)
            - api/                   # API 함수/쿼리
            - model/                 # API 타입/스키마
    - shared/                    # 공통 - 슬라이스 없음
        - api/                       # API 클라이언트/인스턴스 및 클래스/타입
        - lib/                       # 유틸리티 함수 및 React Hooks
        - ui/                        # 외부 데이터에 직접 의존하지 않는 컴포넌트 (예: 디자인 시스템)
```
