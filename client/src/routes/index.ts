import TaskListPage from "../pages/TaskListPage.tsx";
import TodayTaskListView from "../pages/TodayTaskListView.tsx";

export const routes=[
    {
        path:'/',
        page: TaskListPage
    },
    {
        path:'/today',
        page: TodayTaskListView
    }
]