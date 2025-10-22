import TaskListPage from "../pages/TaskListPage.tsx";
import TodayTaskListView from "../pages/TodayTaskListView.tsx";
import CalendarView from "../pages/CalendarView.tsx";
import SignUp from "../pages/sign/SignUp.tsx";
import Login from "../pages/sign/Login.tsx";

export const routes=[
    {
        path:'/sign-up',
        page: SignUp,
        // isProtected:false,
    },
    {
        path:'/login',
        page: Login,
        // isProtected:false,
    },
    {
        path:'/',
        page: TaskListPage,
        // isProtected:true,
    },
    {
        path:'/today',
        page: TodayTaskListView,
        // isProtected:true
    },
    {
        path:'/calendar',
        page: CalendarView,
        // isProtected:true
    }
]