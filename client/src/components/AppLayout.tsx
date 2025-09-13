import Sidebar from "./Sidebar.tsx";


interface AppLayoutProps {
    children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
    return (
        <div className="flex h-screen">
            {/*Sidebar bên trái */}
            <Sidebar/>

            {/* Content bên phải */}
            <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
                {children}
            </div>
        </div>
    );
}
