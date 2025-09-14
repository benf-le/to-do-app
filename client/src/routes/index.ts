import TaskListPage from "../pages/TaskListPage.tsx";
import TodayTaskListView from "../pages/TodayTaskListView.tsx";
import CalendarView from "../pages/CalendarView.tsx";

export const routes=[
    {
        path:'/tasks',
        page: TaskListPage
    },
    {
        path:'/tasks/today',
        page: TodayTaskListView
    },
    {
        path:'/tasks/calendar',
        page: CalendarView
    }
]