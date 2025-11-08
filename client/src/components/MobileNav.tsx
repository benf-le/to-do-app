import { useState, useEffect } from "react"; // Thêm hook
import { Link, useNavigate } from "react-router-dom"; // Thêm Link và useNavigate
import { useCookies } from "react-cookie"; // Thêm useCookies
import { BASE_URL } from "../constant/appInfo.ts"; // Import BASE_URL

// Interface User (có thể tách ra file riêng nếu dùng ở nhiều nơi)
interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    userType: string;
}

interface MobileNavProps {
    onOpenSidebar: () => void;
}

export default function MobileNav({ onOpenSidebar }: MobileNavProps) {
    const navigate = useNavigate();
    const [cookies, , removeCookie] = useCookies(["AuthToken"]);
    const [user, setUser] = useState<User | null>(null);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    // Logic fetch user (giống Sidebar)
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = cookies.AuthToken;
                if (!token) return;
                const userId = localStorage.getItem("userId");
                if (!userId) return;

                const res = await fetch(BASE_URL + `/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
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

    // Logic logout (giống Sidebar)
    const handleLogout = () => {
        removeCookie("AuthToken", { path: "/" });
        localStorage.removeItem("userId");
        navigate("/login");
        setIsUserMenuOpen(false); // Đóng menu sau khi logout
    };

    const displayName = user ? `${user.firstName} ${user.lastName}` : "Loading...";

    return (
        // Chỉ hiển thị trên mobile (md:hidden)
        <header className="md:hidden bg-gray-900 text-white p-4 flex items-center justify-between relative"> {/* Thêm relative */}
            {/* Nút Hamburger */}
            <button
                onClick={onOpenSidebar}
                className="p-2 rounded-md hover:bg-gray-700"
                aria-label="Open menu"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                </svg>
            </button>

            {/* Tiêu đề */}
            <h1 className="text-xl font-bold ml-4">Task Manager</h1>

            {/* --- KHU VỰC USER MỚI --- */}
            <div className="ml-auto relative"> {/* ml-auto đẩy sang phải, relative cho dropdown */}
                {/* Nút hiển thị tên User và Icon */}
                <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center p-2 rounded-md hover:bg-gray-700 focus:outline-none"
                    aria-label="User menu"
                >
                    {/* Icon User (SVG Placeholder) */}
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    <span className="text-sm font-medium hidden sm:inline">{displayName}</span> {/* Ẩn tên trên màn hình rất nhỏ */}
                    {/* Icon mũi tên (tùy chọn) */}
                    <svg className={`w-4 h-4 ml-1 transition-transform duration-200 ${isUserMenuOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>

                {/* Dropdown Menu (Hiển thị phía dưới nút, căn phải) */}
                {isUserMenuOpen && (
                    <>
                        {/* Overlay để đóng khi click ra ngoài */}
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setIsUserMenuOpen(false)}
                        />
                        {/* Nội dung dropdown */}
                        <div className="absolute top-full right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-20">
                            <div className="px-4 py-2 text-sm text-gray-400 border-b border-gray-700">{displayName}</div> {/* Hiển thị lại tên user */}
                            <Link
                                to="/profile" // Thay bằng đường dẫn thực tế
                                onClick={() => setIsUserMenuOpen(false)}
                                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                            >
                                Profile
                            </Link>
                            <Link
                                to="/settings" // Thay bằng đường dẫn thực tế
                                onClick={() => setIsUserMenuOpen(false)}
                                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                            >
                                Setting
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
                    </>
                )}
            </div>
            {/* --- KẾT THÚC KHU VỰC USER --- */}
        </header>
    );
}
