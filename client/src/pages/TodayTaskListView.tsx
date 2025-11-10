import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Status, type Task } from "../models/task.ts";
import { createTask, deleteTask, getTasks, updateTask } from "../api/tasks.ts";
import { useState } from "react";
import TaskDetailModal from "../components/TaskDetailModal.tsx";

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

    const today = new Date().toISOString().split("T")[0];
    new Date(today).toISOString();
    const [modalState, setModalState] =
        useState<{ task?: Task; isEditing: boolean } | null>(null);

    // lọc task hôm nay
    const todayTasks = Array.isArray(tasks)
        ? tasks.filter(
            (t: Task) =>
                t.dueDate &&
                new Date(t.dueDate).toISOString().split("T")[0] === today
        )
        : [];


    return (
        <div>
            <div className="w-[90%] mx-auto py-6">
                <div className="flex justify-between mb-6">
                    <h1 className="text-2xl font-bold">
                        Today View ({new Date(today).toLocaleDateString("vi-VN")})
                    </h1>
                    <button
                        className="bg-amber-500 text-white px-4 py-2 rounded"
                        onClick={() => setModalState({ task: undefined, isEditing: true })}
                    >
                        + Create Task
                    </button>
                </div>

                <div className="rounded-2xl bg-white shadow-sm overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                        <tr>
                            {/* Ẩn giống All Task */}
                            <th className="hidden md:table-cell text-left px-4 py-3">#</th>
                            <th className="text-left px-4 py-3">Name</th>
                            <th className="hidden md:table-cell text-left px-4 py-3">Description</th>
                            <th className="text-left px-4 py-3">Status</th>
                            <th className="hidden md:table-cell text-left px-4 py-3">Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {todayTasks?.map((task, idx) => (
                            <tr
                                key={task.id}
                                className="hover:bg-gray-50 cursor-pointer"
                                onClick={() => setModalState({ task, isEditing: false })}
                            >
                                <td className="hidden md:table-cell px-4 py-3">{idx + 1}</td>

                                <td className="px-4 py-3 font-semibold max-w-[15rem] line-clamp-3">
                                    {task.title}
                                </td>

                                <td className="hidden md:table-cell px-4 py-3 text-gray-500 max-w-[20rem] line-clamp-3">
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

                                <td className="hidden md:table-cell py-3">
                                    <div className="flex gap-2">
                                        <button
                                            className="px-2 py-1 bg-blue-500 text-white rounded"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setModalState({ task, isEditing: true });
                                            }}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="px-2 py-1 bg-red-500 text-white rounded"
                                            onClick={(e) => {
                                                e.stopPropagation();
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
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {todayTasks?.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center py-6 text-gray-500">
                                    No tasks for today.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {modalState && (
                <TaskDetailModal
                    initialTask={modalState.task}
                    isEditing={modalState.isEditing}
                    onClose={() => setModalState(null)}
                    forceTodayDate={true}             // ✅ GIỮ behavior tạo task hôm nay
                    onSave={(updatedData) => {
                        if (modalState.task) {
                            updateMutation.mutate({ id: modalState.task.id, task: updatedData });
                        }
                        setModalState(null);
                    }}
                    onCreate={(newData) => {
                        createMutation.mutate(newData as Task);
                        setModalState(null);
                    }}
                    onEdit={() => setModalState((prev) => (prev ? { ...prev, isEditing: true } : prev))}
                    onDelete={() => {
                        if (!modalState.task) return;
                        if (window.confirm(`Delete task "${modalState.task.title}"?`)) {
                            deleteMutation.mutate(modalState.task.id);
                            setModalState(null);
                        }
                    }}
                />
            )}
        </div>
    );
}
