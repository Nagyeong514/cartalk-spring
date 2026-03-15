# 🏎️ CarTalk Pro
> **사용자 차량 정보 기반의 스마트 관리 및 커뮤니티 통합 플랫폼**
> 
> "CarTalk Pro"는 단순한 게시판을 넘어 사용자의 차량 데이터를 기반으로 맞춤형 정비를 돕고, 깐깐한 본인 인증 로직을 통해 안전한 정보 공유 생태계를 구축하는 Full-stack 프로젝트입니다.

---

## 📂 브랜치 구조 안내
이 프로젝트는 유지보수와 협업의 효율성을 위해 기능을 분리하여 관리합니다.

- `main`: 백엔드(Spring Boot)와 프론트엔드(React)가 통합된 최종 배포용 브랜치
- `feature/community`: 게시판 CRUD, 댓글, 좋아요 등 커뮤니티 도메인 전용
- `feature/auth`: JWT 기반 인증 및 Member ID 식별 로직 전용
- `feature/vehicle`: 차량 데이터 연동 및 관리 서비스 전용

---

## 🛠️ Tech Stack

### Backend
- **Framework**: Spring Boot 3.x
- **Language**: Java 17
- **ORM**: Spring Data JPA
- **Database**: MySQL
- **Security**: JWT (JSON Web Token), Password Hashing (BCrypt)
- **File Server**: Local Storage System (with Unique UUID Management)

### Frontend
- **Library**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks (useState, useEffect)
- **Icons**: Lucide React

---

## 🚀 주요 기능

- **고유 식별자(Member ID) 인증**: 동명이인 문제를 차단하기 위해 DB 고유 PK를 활용한 본인 확인 시스템
- **스마트 게시판**: 카테고리/태그별 필터링 및 텍스트+이미지 복합 수정/삭제 기능
- **파일 생명주기 관리**: 수정/삭제 시 서버 내 잔존하는 가비지 파일을 자동으로 추적하여 제거
- **실시간 상호작용**: 조회수 카운팅, 좋아요(Dirty Checking), 댓글 시스템

---

## 📡 주요 API

| 메서드 | 경로 | 기능 설명 |
| :--- | :--- | :--- |
| `POST` | `/api/member/login` | 로그인 및 고유 식별자(memberId) 발급 |
| `GET` | `/api/community/posts` | 카테고리별 게시글 리스트 조회 |
| `GET` | `/api/community/posts/{id}` | 게시글 상세 데이터 및 작성자 ID 반환 |
| `PUT` | `/api/community/posts/{id}` | 게시글 수정 (JSON 데이터 + Multipart 파일) |
| `DELETE` | `/api/community/posts/{id}` | 게시글 레코드 및 실제 서버 이미지 삭제 |

---

## 💡 Technical Challenges & Troubleshooting

### 1. 동명이인 방지를 위한 사용자 식별 로직 개선
- **문제**: 초기엔 유저의 '이름(Name)'으로 본인 여부를 비교했으나, 중복 이름 발생 시 권한 오판 우려 및 보안 취약성 발견.
- **해결**: 로그인 시 토큰과 함께 고유 번호(`memberId`)를 반환하는 `LoginResponseDto`를 구축. 프론트엔드에서 이를 숫자 타입으로 엄격하게 비교하여 본인 확인 로직의 신뢰도를 100%로 확보.

### 2. 물리 파일과 DB 레코드 간의 동기화 최적화
- **문제**: 게시글 삭제 시 DB 데이터만 지워지고 실제 서버 저장소의 이미지는 가비지 데이터로 남아 용량을 차지함.
- **해결**: `FileService`에 물리 파일 삭제 로직을 구현. 게시글 수정/삭제 트랜잭션 내에서 실제 파일을 먼저 검증 후 제거하도록 설계하여 서버 자원 관리 효율성 증대.

### 3. 복합 데이터(Multipart + JSON) 전송의 안정성 확보
- **문제**: 게시글 수정 시 텍스트 정보(JSON)와 새 이미지 파일을 동시에 보낼 때 데이터 유실 및 매핑 오류 발생.
- **해결**: 프론트엔드에서 `Blob`을 사용하여 JSON의 Content-Type을 명시하고, 백엔드에서 `@RequestPart`를 통해 안정적으로 수신하도록 통신 구조 개선.

---

## 📅 향후 계획 및 로드맵
- [ ] **AWS Deployment**: EC2 및 S3를 활용한 클라우드 아키텍처 배포
- [ ] **Public API Integration**: 국토교통부 리콜 정보 API 연동을 통한 실시간 알림 구현
- [ ] 

---
