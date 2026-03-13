import axios from 'axios';

// 1. Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: 'http://localhost:8080', // 우리가 만든 스프링 부트 서버 주소
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. 요청 인터셉터(Request Interceptor) 설정
// 서버로 요청이 나가기 직전에 가로채서 토큰을 붙여줍니다.
apiClient.interceptors.request.use(
  (config) => {
    // 로컬 스토리지에서 'token'이라는 이름으로 저장된 JWT를 가져옵니다.
    const token = localStorage.getItem('token');

    if (token) {
      // 토큰이 있다면 헤더에 Bearer 토큰을 추가합니다.
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;