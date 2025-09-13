import TaskListPage from "../pages/TaskListPage.tsx";
import TodayTaskListView from "../pages/TodayTaskListView.tsx";

export const routes=[
    {
        path:'/tasks',
        page: TaskListPage
    },
    {
        path:'/tasks/today',
        page: TodayTaskListView
    }
]