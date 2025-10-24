// src/App.tsx (ĐÃ SỬA)

import './App.css'
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import { routes } from "./routes"; // <-- 1. IMPORT routes THẬT CỦA BẠN
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MainLayout from './components/MainLayout';

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <div>
                <Router>
                    <Routes>
                        {/* 2. Dùng MainLayout làm route cha */}
                        <Route path="/" element={<MainLayout />}>
                            {
                                // 3. Map qua routes THẬT của bạn
                                routes.map((route) => {
                                    const Page = route.page;

                                    if (route.path === '/') {
                                        return <Route key="index" index element={<Page />} />;
                                    }

                                    const childPath = route.path.replace(/^\//, '');

                                    return (
                                        <Route key={childPath} path={childPath} element={<Page />} />
                                    );
                                })
                            }
                        </Route>

                        {/* 4. Thêm route Login/Signup (KHÔNG CÓ LAYOUT) ở đây */}
                        {/* <Route path="/login" element={<LoginPage />} /> */}

                    </Routes>
                </Router>
            </div>
        </QueryClientProvider>
    )
}

export default App;