import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {Status, type Task} from "../models/task.ts";
import {createTask, deleteTask, getTasks, updateTask} from "../api/tasks.ts";
import {useMemo, useState} from "react";
import TaskDetailModal from "../components/TaskDetailModal.tsx";

export default function TaskListView() {
    const queryClient = useQueryClient();
    const {data: tasks} = useQuery({queryKey: ["tasks"], queryFn: getTasks});

    const createMutation = useMutation({
        mutationFn: createTask,
        onSuccess: () =>
            queryClient.invalidateQueries({queryKey: ["tasks"]}),
    });

    const updateMutation = useMutation({
        mutationFn: (data: { id: string; task: Partial<Task> }) =>
            updateTask(data.id, data.task),
        onSuccess: () =>
            queryClient.invalidateQueries({queryKey: ["tasks"]}),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteTask,
        onSuccess: () =>
            queryClient.invalidateQueries({queryKey: ["tasks"]}),
    });

    const [modalState, setModalState] = useState<{task?: Task, isEditing: boolean} | null>(null);
    const [deadlineSortOrder, setdeadlineSortOrder] = useState<"asc" | "desc" | null>("asc");
    const [statusSortOrder, setStatusSortOrder] = useState<"asc" | "desc" | null>("desc");


    const sortedTasks = useMemo(() => {
        if (!tasks) return [];
        const result = [...tasks];

        // sort theo deadline
        if (deadlineSortOrder) {
            result.sort((a, b) => {
                const dateA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
                const dateB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
                return deadlineSortOrder === "asc" ? dateA - dateB : dateB - dateA;
            });
        }

        // sort theo status (chữ cái)
        if (statusSortOrder) {
            result.sort((a, b) => {
                const sA = a.status || "";
                const sB = b.status || "";
                if (sA < sB) return statusSortOrder === "asc" ? -1 : 1;
                if (sA > sB) return statusSortOrder === "asc" ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [tasks, deadlineSortOrder, statusSortOrder]);


    return (
        <div>
            <div className="w-[95%] md:w-[90%] mx-auto py-6">
                {/* Header */}
                <div className="flex justify-between mb-6">
                    <h1 className="text-2xl font-bold">All Task</h1>
                    <button
                        className="bg-amber-500 text-white px-4 py-2 rounded"
                        // Mở modal ở chế độ TẠO MỚI
                        onClick={() => {
                            setModalState({ task: undefined, isEditing: true });
                        }}
                    >
                        + Create Task
                    </button>
                </div>

                <div className="rounded-2xl bg-white shadow-sm overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                        <tr>
                            {/* Ẩn cột # trên mobile */}
                            <th className="hidden md:table-cell text-left px-4 py-3">#</th>
                            <th className="text-left px-4 py-3">Name</th>
                            {/* Ẩn cột Description trên mobile */}
                            <th className="hidden md:table-cell text-left px-4 py-3">Description</th>
                            <th
                                className="text-left px-4 py-3 cursor-pointer select-none"
                                onClick={() =>
                                    setStatusSortOrder(
                                        statusSortOrder === "asc"
                                            ? "desc"
                                            : statusSortOrder === "desc"
                                                ? null
                                                : "asc"
                                    )
                                }
                            >
                                Status{" "}
                                {statusSortOrder === "asc"
                                    ? "▲"
                                    : statusSortOrder === "desc"
                                        ? "▼"
                                        : ""}
                            </th>
                            <th
                                className="px-4 py-3 text-left cursor-pointer select-none"
                                onClick={() => {
                                    if (deadlineSortOrder === null) setdeadlineSortOrder("asc");
                                    else if (deadlineSortOrder === "asc") setdeadlineSortOrder("desc");
                                    else setdeadlineSortOrder(null);
                                }}
                            >
                                Deadline{" "}
                                {deadlineSortOrder === "asc" && "▲"}
                                {deadlineSortOrder === "desc" && "▼"}
                            </th>
                            {/* Ẩn cột Action trên mobile */}
                            <th className="hidden md:table-cell text-left px-4 py-3">Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {sortedTasks?.map((task, idx) => (
                            // --- VIEW HIỂN THỊ TASK (BÌNH THƯỜNG) ---
                            <tr
                                key={task.id}
                                className="hover:bg-gray-50 cursor-pointer"
                                // Mở modal ở chế độ XEM
                                onClick={() => setModalState({ task, isEditing: false })}
                            >
                                <td className="hidden md:table-cell px-4 py-3 ">{idx + 1}</td>

                                <td
                                    className="px-4 py-3 font-semibold max-w-[15rem] line-clamp-3"
                                >
                                    {task.title}
                                </td>
                                <td
                                    className="hidden md:table-cell px-4 py-3 text-gray-500 max-w-[20rem] line-clamp-3"
                                >
                                    {task.description}
                                </td>
                                <td className="px-4 py-3 ">
                                    {task.status === Status.DONE && (
                                        <span
                                            className="px-3 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">
                                          DONE
                                        </span>
                                    )}
                                    {task.status === Status.IN_PROGRESS && (
                                        <span
                                            className="px-3 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-700">
                                          IN PROGRESS
                                        </span>
                                    )}
                                    {task.status === Status.TODO && (
                                        <span
                                            className="px-3 py-1 text-xs font-medium rounded-full bg-gray-200 text-gray-700">
                                          TODO
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-blue-600">
                                    {task.dueDate
                                        ? new Date(task.dueDate).toLocaleDateString("vi-VN",
                                            {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit"
                                            })
                                        : "Chưa có"}
                                </td>
                                <td className="hidden md:table-cell py-3">
                                    <div className="flex gap-2">
                                        <button
                                            className="px-2 py-1 bg-blue-500 text-white rounded"
                                            // Mở modal ở chế độ SỬA
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setModalState({ task, isEditing: true });
                                            }}
                                        >Edit
                                        </button>

                                        <button
                                            className="px-2 py-1 bg-red-500 text-white rounded "
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
                        </tbody>
                    </table>
                </div>
            </div>

            {modalState && (
                <TaskDetailModal
                    initialTask={modalState.task}
                    isEditing={modalState.isEditing}
                    onClose={() => setModalState(null)}
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
                    onEdit={() => {
                        // chuyển modal sang chế độ edit
                        setModalState((prev) => prev ? { ...prev, isEditing: true } : prev);
                    }}
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

