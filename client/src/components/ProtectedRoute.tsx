import React from 'react';
import { useCookies } from 'react-cookie'; // Lỗi "Could not resolve" thường do thư viện chưa được cài đặt
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute: React.FC = () => {
    const [cookies] = useCookies(['AuthToken']);

    // Kiểm tra xem cookie AuthToken có tồn tại không
    const isAuthenticated = !!cookies.AuthToken;

    if (!isAuthenticated) {
        // Nếu chưa đăng nhập, điều hướng về trang login
        // replace=true sẽ thay thế trang hiện tại trong history, tránh việc bấm back quay lại trang cũ
        return <Navigate to="/login" replace />;
    }

    // Nếu đã đăng nhập, hiển thị nội dung trang con (qua Outlet)
    return <Outlet />;
};

export default ProtectedRoute;

