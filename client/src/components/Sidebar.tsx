import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import {BASE_URL} from "../constant/appInfo.ts";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    userType: string;
}

// Sidebar component
export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const [cookies, , removeCookie] = useCookies(["AuthToken"]);

    const [user, setUser] = useState<User | null>(null);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const menuItems = [
        { title: "All Tasks", path: "/" },
        { title: "Today Tasks", path: "/today" },
        { title: "Calendar", path: "/calendar" },
    ];

    // Gọi API lấy thông tin người dùng khi Sidebar được mount
    useEffect(() => {
        const fetchUser = async () => {
            try {
                // Giả sử AuthToken là JWT chứa userId
                const token = cookies.AuthToken;
                if (!token) return;

                // 👉 Giải mã JWT hoặc lưu userId vào cookie/session khi login
                // Giả sử bạn lưu userId vào localStorage
                const userId = localStorage.getItem("userId");
                if (!userId) return;

                const res = await fetch(BASE_URL+`/users/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error("Không thể tải thông tin người dùng");
                const data = await res.json();
                setUser(data);
            } catch (error) {
                console.error("Lỗi tải user:", error);
            }
        };

        fetchUser();
    }, [cookies.AuthToken]);

    // Xử lý logout
    const handleLogout = () => {
        removeCookie("AuthToken", { path: "/" });
        localStorage.removeItem("userId");
        navigate("/login");
        onClose();
    };

    const displayName = user ? `${user.firstName} ${user.lastName}` : "Loading...";

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div
                className={`
          w-56 h-screen bg-gray-900 text-white flex flex-col
          fixed top-0 left-0 z-50
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0 md:flex
        `}
            >
                {/* Header */}
                <div className="p-4 border-b border-gray-700 hidden md:block">
                    <h1 className="text-xl font-bold">Task Manager</h1>
                </div>

                {/* Menu chính */}
                <nav className="flex-1 p-4 overflow-y-auto">
                    <ul className="space-y-2">
                        {menuItems.map((item) => (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    onClick={onClose}
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

                {/* --- KHU VỰC USER --- */}
                <div className="p-4 border-t border-gray-700 mt-auto relative">
                    {/* Dropdown Menu */}
                    {isUserMenuOpen && (
                        <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                            <Link
                                to="/profile"
                                onClick={() => {
                                    setIsUserMenuOpen(false);
                                    onClose();
                                }}
                                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                            >
                                Profile
                            </Link>
                            <Link
                                to="/settings"
                                onClick={() => {
                                    setIsUserMenuOpen(false);
                                    onClose();
                                }}
                                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                            >
                                Settings
                            </Link>
                            <Link
                                to="https://forms.gle/eLEb9KUGkgVqxhwe8" // Thay bằng đường dẫn thực tế
                                onClick={() => setIsUserMenuOpen(false)}
                                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                            >
                                App Feedback
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300"
                            >
                                Logout
                            </button>
                        </div>
                    )}

                    {/* Nút hiển thị tên User */}
                    <button
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="flex items-center justify-between w-full px-4 py-2 rounded-lg text-left text-gray-300 hover:bg-gray-700 hover:text-white focus:outline-none"
                    >
                        <span>{displayName}</span>
                        <svg
                            className={`w-4 h-4 transition-transform duration-200 ${
                                isUserMenuOpen ? "transform rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                            ></path>
                        </svg>
                    </button>
                </div>
            </div>
        </>
    );
}
