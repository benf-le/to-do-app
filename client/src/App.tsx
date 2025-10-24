import './App.css'
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import { routes } from "./routes"; // Import routes config
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MainLayout from './components/MainLayout';
import Login from './pages/sign/Login'; // Import trực tiếp
import SignUp from './pages/sign/SignUp';
import ProtectedRoute from "./components/ProtectedRoute.tsx"; // Import trực tiếp

const queryClient = new QueryClient();

function App() {
    // Lọc các routes cần layout
    const layoutRoutes = routes.filter(route => route.path !== '/login' && route.path !== '/sign-up');

    return (
        <QueryClientProvider client={queryClient}>
            <div>
                <Router>
                    <Routes>
                        <Route element={<ProtectedRoute />}>
                        {/* Các route CÓ layout */}
                        <Route path="/" element={<MainLayout />}>
                            {
                                layoutRoutes.map((route) => {
                                    const Page = route.page;

                                    // Xử lý route trang chủ đặc biệt
                                    if (route.path === '/') {
                                        // Sử dụng 'index' prop cho route mặc định của layout
                                        return <Route key="index" index element={<Page />} />;
                                    }

                                    // Bỏ dấu '/' ở đầu path con
                                    const childPath = route.path.replace(/^\//, '');

                                    return (
                                        <Route key={childPath} path={childPath} element={<Page />} />
                                    );
                                })
                            }
                        </Route>
                        </Route>
                        {/* Các route KHÔNG CÓ layout (Login, Signup) */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/sign-up" element={<SignUp />} />

                        {/* Bạn có thể thêm các route không layout khác ở đây */}
                        {/* Ví dụ: <Route path="/forgot-password" element={<ForgotPasswordPage />} /> */}

                    </Routes>
                </Router>
            </div>
        </QueryClientProvider>
    )
}

export default App;

