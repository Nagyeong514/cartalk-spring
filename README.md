**🕒 내일의 첫 번째 미션
-  '좋아요(Like)' 기능을 위한 post_like 엔티티
- 동일 사용자의 중복 카운팅을 막기 위해 추후 Redis나 Cookie를 도입하여 고도화할 계획

**front
- Authorization 헤더: 글쓰기(POST) 요청을 보낼 때, 반드시 헤더에 Authorization: Bearer <토큰>을 실어 보내야 합니다.
- 카테고리 파라미터: 목록을 가져올 때 '전체' 탭이 아니라면 ?category=정비/수리 처럼 쿼리 스트링을 붙여서 요청
