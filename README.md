# 💍 모바일 청첩장 프로젝트

링크를 통해 공유 가능한 모바일 웹 청첩장 애플리케이션입니다.

## 📋 프로젝트 개요

React와 TypeScript를 사용하여 개발된 단일 페이지 형식의 모바일 청첩장입니다. GitHub Pages를 통해 호스팅하여 링크 공유로 손님들에게 전달할 수 있습니다.

### 주요 기능

1. **헤더 섹션** - 결혼 날짜, 시간, 장소 표기 및 간단한 달력
2. **초대 문구** - 신랑/신부 정보 및 환영 메시지
3. **포토 갤러리** - 3x3 그리드 형식의 웨딩 사진 및 확대/슬라이드 기능
4. **오시는 길** - 네이버 지도 연동 및 교통편 안내
5. **방명록** - 간단한 댓글 남기기 기능
6. **계좌 정보** - 축의금 계좌번호 및 클립보드 복사 기능
7. **공유 버튼** - 카카오톡 공유 및 링크 복사

## 🛠 기술 스택

- **Frontend**: React 18, TypeScript
- **빌드 도구**: Vite
- **라우팅**: React Router DOM
- **HTTP 클라이언트**: Axios
- **호스팅**: GitHub Pages

## 📦 설치 방법

### 1. 저장소 클론

```bash
git clone https://github.com/aldlfkahs/wedding-invitation.git
cd wedding-invitation
```

### 2. 의존성 설치

```bash
npm install
```

## ⚙️ 프로젝트 설정 (필수)

프로젝트를 실행하기 전에 다음 정보들을 수정해야 합니다.

### 1. 헤더 정보 수정

**파일**: `src/components/Header/index.tsx`

```typescript
const weddingDate = "2023-10-15"; // 결혼식 날짜 (YYYY-MM-DD 형식)
const weddingTime = "15:00"; // 결혼식 시간 (HH:MM 형식)
const weddingLocation = "서울특별시 강남구"; // 결혼식 장소
```

**헤더 메인 배경 이미지 파일명 규칙**
- 파일 위치: `public/images/main.jpg`
- 헤더는 항상 `main` 이름의 이미지를 로드합니다.

### 2. 초대 문구 수정

**파일**: `src/components/InvitationMessage/index.tsx`

- 신랑/신부 이름
- 부모님 성함
- 초대 메시지 (4-5줄)
- 예: "OOO, OOO의 장남 OOO"

### 3. 웨딩 사진 추가

**파일**: `src/components/PhotoGallery/index.tsx`

```typescript
const photos = [
    '/images/photo1.jpg',
    '/images/photo2.jpg',
    '/images/photo3.jpg',
    // ... 최대 9장까지 추가 가능
];
```

**사진 저장 위치**: `public/images/` 폴더에 웨딩 사진 업로드

**중요 규칙**
- `main.jpg`는 헤더 배경 전용 이미지이며, 포토갤러리에서는 자동 제외됩니다.
- 포토갤러리에 표시할 파일 목록은 `public/images/manifest.json`에서 관리합니다.

### 4. 계좌 정보 입력

**파일**: `src/components/AccountInfo/index.tsx`

```typescript
// 신랑/신부 각각의 계좌 정보 입력
Bank Name: "국민은행"
Account Holder: "홍길동"
Account Number: "123-456-789012"
```

### 5. 배경음악 추가

**파일**: `src/components/BackgroundMusic/index.tsx`

1. 음악 파일(예: `bgm.mp3`)을 **`public/` 폴더**에 넣습니다.
2. 파일 이름이 `bgm.mp3`가 아닐 경우 컴포넌트 상단의 `MUSIC_SRC` 상수를 수정합니다.

```typescript
// src/components/BackgroundMusic/index.tsx
const MUSIC_SRC = `${import.meta.env.BASE_URL}파일명.mp3`;
```

> 지원 포맷: `.mp3`, `.ogg`, `.wav` 등 브라우저 기본 지원 오디오 형식  
> 페이지 진입 시 자동 재생을 시도하며, 브라우저 정책으로 막힐 경우 첫 클릭/터치 시 재생됩니다.

### 6. 오시는 길 정보 설정

**파일**: `src/components/Location/index.tsx`

- 결혼식장 주소
- 네이버 지도 연동 정보
- 자차 이용 안내
- 대중교통 이용 안내

**.env 파일 생성** (프로젝트 루트에)

```
VITE_KAKAO_API_KEY=your_kakao_javascript_key
```

## 🚀 실행 방법

### 개발 모드 실행

```bash
npm start
```

브라우저에서 `http://localhost:5173` 접속

### 프로덕션 빌드

```bash
npm run build
```

빌드된 파일은 `dist/` 폴더에 생성됩니다.

### 빌드 결과 미리보기

```bash
npm run serve
```

## 📤 배포 방법 (GitHub Pages)

### 1. package.json에 homepage 추가

```json
{
  "homepage": "https://aldlfkahs.github.io/wedding-invitation"
}
```

### 2. GitHub Pages 배포 스크립트 추가

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

### 3. gh-pages 패키지 설치

```bash
npm install --save-dev gh-pages
```

### 4. 배포 실행

```bash
npm run deploy
```

### 5. GitHub 저장소 설정

1. GitHub 저장소 페이지로 이동
2. Settings > Pages 메뉴 선택
3. Source를 `gh-pages` 브랜치로 설정
4. 배포 완료 후 URL로 접속 가능

## 📁 프로젝트 구조

```
wedding-invitation/
├── public/
│   ├── index.html           # HTML 템플릿
│   └── images/              # 웨딩 사진 저장 위치 (직접 추가)
├── src/
│   ├── components/
│   │   ├── Header/          # 헤더 (날짜, 시간, 장소)
│   │   ├── InvitationMessage/  # 초대 문구
│   │   ├── PhotoGallery/    # 포토 갤러리
│   │   ├── Location/        # 오시는 길
│   │   ├── GuestBook/       # 방명록
│   │   ├── AccountInfo/     # 계좌 정보
│   │   └── ShareButtons/    # 공유 버튼
│   ├── styles/
│   │   ├── global.css       # 전역 스타일
│   │   └── variables.css    # CSS 변수
│   ├── types/
│   │   └── index.ts         # TypeScript 타입 정의
│   ├── utils/
│   │   └── index.ts         # 유틸리티 함수
│   ├── App.tsx              # 메인 앱 컴포넌트
│   └── index.tsx            # 앱 진입점
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## ✅ 체크리스트

프로젝트를 완성하기 위해 다음 항목들을 확인하세요:

- [ ] 결혼식 날짜, 시간, 장소 정보 입력
- [ ] 신랑/신부 이름 및 초대 문구 작성
- [ ] 웨딩 사진 9장 업로드 (`public/images/` 폴더에)
- [ ] 배경음악 파일 추가 (`public/bgm.mp3`)
- [ ] 결혼식장 위치 및 교통편 정보 입력
- [ ] 계좌 정보 입력 (신랑/신부 각각)
- [ ] 로컬에서 테스트 실행
- [ ] 프로덕션 빌드 및 배포
- [ ] 모바일 기기에서 테스트

## 🎨 커스터마이징

### 색상 변경

**파일**: `src/styles/variables.css`

CSS 변수를 수정하여 테마 색상을 변경할 수 있습니다.

### 폰트 변경

**파일**: `src/styles/global.css`

원하는 웹 폰트를 import하여 사용할 수 있습니다.

## 📱 모바일 최적화

이 프로젝트는 모바일 우선으로 설계되었으며, 다양한 화면 크기에서 반응형으로 작동합니다.

## 🐛 문제 해결

### 사진이 표시되지 않는 경우
- `public/images/` 폴더에 이미지가 제대로 업로드되었는지 확인
- 이미지 경로가 올바른지 확인 (`/images/photo.jpg` 형식)

### 빌드 오류가 발생하는 경우
- Node.js 버전 확인 (v14 이상 권장)
- `node_modules` 삭제 후 재설치: `npm install`
- TypeScript 오류 확인 및 수정

## 📄 라이선스

MIT License

## 👨‍💻 개발자

- GitHub: [@aldlfkahs](https://github.com/aldlfkahs)

## 🙏 감사의 말

프로젝트를 사용해 주셔서 감사합니다. 행복한 결혼식 되시기 바랍니다! 💕
