import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
    const location = useLocation();

    const menuItems = [
        { title: "All Tasks", path: "/tasks" },
        { title: "Today Tasks", path: "/tasks/today" },
        { title: "Calendar", path: "/tasks/calendar" },
    ];

    return (
        <div className="w-56 h-screen bg-gray-900 text-white flex flex-col">
            <div className="p-4 border-b border-gray-700">
                <h1 className="text-xl font-bold">Task Manager</h1>
            </div>

            <nav className="flex-1 p-4">
                <ul className="space-y-2">
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <Link
                                to={item.path}
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
    );
}
