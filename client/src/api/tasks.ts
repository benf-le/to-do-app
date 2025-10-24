import apiClient from './apiClient'; // <-- 1. Import apiClient đã cấu hình
import type { Task } from '../models/task'; // 2. Giữ nguyên kiểu dữ liệu Task

// BASE_URL đã được định nghĩa trong apiClient, nên chúng ta không cần import nó ở đây

export const getTasks = async (): Promise<Task[]> => {
    // 3. Dùng apiClient thay vì axios
    const res = await apiClient.get('/tasks');
    return res.data;
};

export const createTask = async (task: Partial<Task>): Promise<Task> => {
    // 4. Dùng apiClient thay vì axios
    const res = await apiClient.post('/tasks/create', task);
    return res.data;
};

export const updateTask = async (
    id: string,
    task: Partial<Task>,
): Promise<Task> => {
    // 5. Dùng apiClient thay vì axios
    const res = await apiClient.patch(`/tasks/update/${id}`, task);
    return res.data;
};

export const deleteTask = async (id: string): Promise<void> => {
    // 6. Dùng apiClient thay vì axios (Hàm delete thường trả về void)
    await apiClient.delete(`/tasks/delete/${id}`);
};

