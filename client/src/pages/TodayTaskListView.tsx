import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Status, type Task } from "../models/task.ts";
import { createTask, deleteTask, getTasks, updateTask } from "../api/tasks.ts";
import { useState } from "react";
import AppLayout from "../components/AppLayout.tsx";

export default function TodayTaskListView() {
    const queryClient = useQueryClient();
    const { data: tasks } = useQuery({ queryKey: ["tasks"], queryFn: getTasks });

    const createMutation = useMutation({
        mutationFn: createTask,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
    });

    const updateMutation = useMutation({
        mutationFn: (data: { id: string; task: Partial<Task> }) =>
            updateTask(data.id, data.task),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteTask,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
    });

    // Lấy ngày hôm nay (YYYY-MM-DD)
    const today = new Date().toISOString().split("T")[0];

    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const [formValues, setFormValues] = useState<Partial<Task>>({});

    const handleSave = () => {
        const payload = {
            ...formValues,
            dueDate: new Date(today).toISOString(), // luôn gán hôm nay
        };

        if (editingTaskId === "new") {
            createMutation.mutate(payload as Task);
        } else if (editingTaskId) {
            updateMutation.mutate({ id: editingTaskId, task: payload });
        }

        setEditingTaskId(null);
        setFormValues({});
    };

    const handleCancel = () => {
        setEditingTaskId(null);
        setFormValues({});
    };

    // Lọc task theo hôm nay
    const todayTasks = tasks?.filter(
        (task: { dueDate: string | number | Date; }) =>
            task.dueDate &&
            new Date(task.dueDate).toISOString().split("T")[0] === today
    );

    return (
        <AppLayout>
        <div className="w-[90%] mx-auto py-6">
            <div className="flex justify-between mb-6">
                <h1 className="text-2xl font-bold">
                    Today View ({new Date(today).toLocaleDateString("vi-VN")})
                </h1>
                <button
                    className="bg-amber-500 text-white px-4 py-2 rounded"
                    onClick={() => {
                        setEditingTaskId("new");
                        setFormValues({
                            title: "",
                            description: "",
                            status: Status.TODO,
                            dueDate: today, // mặc định hôm nay
                        });
                    }}
                >
                    + Thêm Task
                </button>
            </div>

            <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="text-left px-4 py-3">#</th>
                        <th className="text-left px-4 py-3">Tên công việc</th>
                        <th className="text-left px-4 py-3">Mô tả</th>
                        <th className="text-left px-4 py-3">Trạng thái</th>
                        <th className="text-left px-4 py-3">Thao tác</th>
                    </tr>
                    </thead>
                    <tbody>
                    {/* Hàng thêm mới */}
                    {editingTaskId === "new" && (
                        <tr className="bg-yellow-50">
                            <td className="px-4 py-3">-</td>
                            <td className="px-4 py-3">
                                <input
                                    autoFocus
                                    className="border p-1 rounded w-full"
                                    value={formValues.title || ""}
                                    onChange={(e) =>
                                        setFormValues({ ...formValues, title: e.target.value })
                                    }
                                />
                            </td>
                            <td className="px-4 py-3">
                                <input
                                    className="border p-1 rounded w-full"
                                    value={formValues.description || ""}
                                    onChange={(e) =>
                                        setFormValues({
                                            ...formValues,
                                            description: e.target.value,
                                        })
                                    }
                                />
                            </td>
                            <td className="px-4 py-3">
                                <select
                                    value={formValues.status}
                                    onChange={(e) =>
                                        setFormValues({
                                            ...formValues,
                                            status: e.target.value as Status,
                                        })
                                    }
                                    className="border p-1 rounded"
                                >
                                    <option value={Status.TODO}>TODO</option>
                                    <option value={Status.IN_PROGRESS}>IN_PROGRESS</option>
                                    <option value={Status.DONE}>DONE</option>
                                </select>
                            </td>
                            <td className="px-4 py-3 flex gap-2">
                                <button
                                    className="px-3 py-1 bg-green-500 text-white rounded"
                                    onClick={handleSave}
                                >
                                    Save
                                </button>
                                <button
                                    className="px-3 py-1 bg-gray-300 rounded"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </button>
                            </td>
                        </tr>
                    )}

                    {/* Các task hôm nay */}
                    {// @ts-ignore
                        todayTasks?.map((task, idx) =>
                        editingTaskId === task.id ? (
                            <tr key={task.id} className="bg-blue-50">
                                <td className="px-4 py-3">{idx + 1}</td>
                                <td className="px-4 py-3">
                                    <input
                                        autoFocus
                                        className="border p-1 rounded w-full"
                                        value={formValues.title || ""}
                                        onChange={(e) =>
                                            setFormValues({ ...formValues, title: e.target.value })
                                        }
                                    />
                                </td>
                                <td className="px-4 py-3">
                                    <input
                                        className="border p-1 rounded w-full"
                                        value={formValues.description || ""}
                                        onChange={(e) =>
                                            setFormValues({
                                                ...formValues,
                                                description: e.target.value,
                                            })
                                        }
                                    />
                                </td>
                                <td className="px-4 py-3">
                                    <select
                                        value={formValues.status}
                                        onChange={(e) =>
                                            setFormValues({
                                                ...formValues,
                                                status: e.target.value as Status,
                                            })
                                        }
                                        className="border p-1 rounded"
                                    >
                                        <option value={Status.TODO}>TODO</option>
                                        <option value={Status.IN_PROGRESS}>IN_PROGRESS</option>
                                        <option value={Status.DONE}>DONE</option>
                                    </select>
                                </td>
                                <td className="px-4 py-3 flex gap-2">
                                    <button
                                        className="px-3 py-1 bg-green-500 text-white rounded"
                                        onClick={handleSave}
                                    >
                                        Save
                                    </button>
                                    <button
                                        className="px-3 py-1 bg-gray-300 rounded"
                                        onClick={handleCancel}
                                    >
                                        Cancel
                                    </button>
                                </td>
                            </tr>
                        ) : (
                            <tr key={task.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3">{idx + 1}</td>
                                <td className="px-4 py-3 font-semibold">{task.title}</td>
                                <td className="px-4 py-3 text-gray-500 truncate">
                                    {task.description}
                                </td>
                                <td className="px-4 py-3">
                                    {task.status === Status.DONE && (
                                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">
                                        DONE
                                      </span>
                                    )}
                                    {task.status === Status.IN_PROGRESS && (
                                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-700">
                                        IN PROGRESS
                                      </span>
                                    )}
                                    {task.status === Status.TODO && (
                                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-200 text-gray-700">
                                        TODO
                                      </span>
                                    )}
                                </td>
                                <td className="px-4 py-3 flex gap-2">
                                    <button
                                        className="px-2 py-1 bg-blue-500 text-white rounded"
                                        onClick={() => {
                                            setEditingTaskId(task.id);
                                            setFormValues(task);
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="px-2 py-1 bg-red-500 text-white rounded"
                                        onClick={() => {
                                            if (
                                                window.confirm(
                                                    `Bạn có chắc chắn muốn xóa task "${task.title}"?`
                                                )
                                            ) {
                                                deleteMutation.mutate(task.id);
                                            }
                                        }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        )
                    )}

                    {todayTasks?.length === 0 && (
                        <tr>
                            <td colSpan={5} className="text-center py-6 text-gray-500">
                                Không có công việc nào cho hôm nay
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
        </AppLayout>
    );
}
