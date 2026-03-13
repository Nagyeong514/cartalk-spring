import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080',
  // headers: { 'Content-Type': 'application/json' }
  // (Axios가 데이터 보고 알아서 정하게 냅두는 게 제일 똑똑합니다)
});

apiClient.interceptors.request.use(
  (config) => {
    // ✅ 'token' 대신 'accessToken'으로 이름을 맞춰줍니다!
    const token = localStorage.getItem('accessToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;