import TaskListPage from "../pages/TaskListPage.tsx";
import TodayTaskListView from "../pages/TodayTaskListView.tsx";
import CalendarView from "../pages/CalendarView.tsx";
import SignUp from "../pages/sign/SignUp.tsx";
import Login from "../pages/sign/Login.tsx";

export const routes=[
    {
        path:'/sign-up',
        page: SignUp,
    },
    {
        path:'/login',
        page: Login,
    },
    {
        path:'/',
        page: TaskListPage,
    },
    {
        path:'/today',
        page: TodayTaskListView,
    },
    {
        path:'/calendar',
        page: CalendarView,
    }
]