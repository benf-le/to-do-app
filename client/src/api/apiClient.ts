import axios from 'axios';
import { Cookies } from 'react-cookie';
import {BASE_URL} from "../constant/appInfo.ts"; // Import Cookies

// Khởi tạo một instance của Cookies
const cookies = new Cookies();

const apiClient = axios.create({
    baseURL: BASE_URL,
});

// Đây là mấu chốt: Interceptor (bộ chặn) request
// Nó sẽ chạy trước MỌI request được gửi đi
apiClient.interceptors.request.use(
    (config) => {
        // Đọc token từ cookie
        const token = cookies.get('AuthToken');

        if (token) {
            // Nếu có token, đính kèm nó vào header
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // Xử lý lỗi
        return Promise.reject(error);
    }
);

export default apiClient;

