// src/components/MainLayout.tsx
import { useState } from "react";
import { Outlet } from "react-router-dom"; // Outlet là nơi render các trang con
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";

export default function MainLayout() {
    // State quản lý việc đóng/mở sidebar
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const openSidebar = () => setIsSidebarOpen(true);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar (Đã có logic ẩn/hiện bên trong) */}
            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

            <div className="flex-1 flex flex-col h-screen overflow-y-auto">
                {/* Nút 3 gạch (chỉ hiện trên mobile) */}
                <MobileNav onOpenSidebar={openSidebar} />

                {/* Nội dung chính của bạn (All Tasks, Today Tasks...) */}
                <main className="p-4">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}