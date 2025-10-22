// src/components/Sidebar.tsx (ĐÃ CẬP NHẬT)
import { Link, useLocation } from "react-router-dom";

// 1. Thêm props
interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const location = useLocation();

    const menuItems = [
        { title: "All Tasks", path: "/" },
        { title: "Today Tasks", path: "/today" },
        { title: "Calendar", path: "/calendar" },
    ];

    return (
        <>
            {/* 2. Thêm lớp Overlay để bấm ra ngoài là tắt (chỉ hiện trên mobile khi isOpen) */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* 3. Chỉnh sửa class của Sidebar */}
            <div
                className={`
                    w-56 h-screen bg-gray-900 text-white flex flex-col
                    fixed top-0 left-0 z-50 
                    transition-transform duration-300 ease-in-out
                    
                    
                    isOpen ? "translate-x-0" : "-translate-x-full"
                    
                   
                    md:relative md:translate-x-0 md:flex
                `}
            >
                {/* 4. Ẩn tiêu đề này trên mobile (vì đã có ở MobileNav) */}
                <div className="p-4 border-b border-gray-700 hidden md:block">
                    <h1 className="text-xl font-bold">Task Manager</h1>
                </div>

                <nav className="flex-1 p-4">
                    <ul className="space-y-2">
                        {menuItems.map((item) => (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    onClick={onClose} // Thêm onClick để tự động đóng khi chọn menu
                                    className={`block px-4 py-2 rounded-lg transition-colors ${
                                        location.pathname === item.path
                                            ? "bg-blue-600 text-white"
                                            : "text-gray-300 hover:bg-gray-700 hover:text-white"
                                    }`}
                                >
                                    {item.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </>
    );
}