import TaskListPage from "../pages/TaskListPage.tsx";
import TodayTaskListView from "../pages/TodayTaskListView.tsx";
import CalendarView from "../pages/CalendarView.tsx";

export const routes=[
    {
        path:'/',
        page: TaskListPage
    },
    {
        path:'/today',
        page: TodayTaskListView
    },
    {
        path:'/calendar',
        page: CalendarView
    }
]