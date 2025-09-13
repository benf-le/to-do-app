import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {Status, type Task} from "../models/task.ts";
import {createTask, deleteTask, getTasks, updateTask} from "../api/tasks.ts";
import {useMemo, useState} from "react";
import AppLayout from "../components/AppLayout.tsx";

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
    // state quản lý edit
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const [formValues, setFormValues] = useState<Partial<Task>>({});
    const [deadlineSortOrder, setdeadlineSortOrder] = useState<"asc" | "desc">("asc");
    const [statusSortOrder, setStatusSortOrder] = useState<"asc" | "desc" | null>("desc");


    const handleSave = () => {
        const payload = { ...formValues };

        // Nếu có dueDate (string từ input), convert thành ISO format
        if (formValues.dueDate) {
            payload.dueDate = new Date(formValues.dueDate as string).toISOString();
        }
        if (editingTaskId === "new") {
            createMutation.mutate(formValues as Task);
        } else if (editingTaskId) {
            updateMutation.mutate({id: editingTaskId, task: formValues});
        }
        setEditingTaskId(null);
        setFormValues({});
    };

    const handleCancel = () => {
        setEditingTaskId(null);
        setFormValues({});
    };

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
        <AppLayout>
        <div className="w-[90%] mx-auto py-6">
            {/* Header */}
            <div className="flex justify-between mb-6">
                <h1 className="text-2xl font-bold">Quản Lý Công Việc</h1>
                <button
                    className="bg-amber-500 text-white px-4 py-2 rounded"
                    onClick={() => {
                        setEditingTaskId("new");
                        setFormValues({
                            title: "",
                            description: "",
                            status: Status.TODO,
                            dueDate: new Date().toISOString().split("T")[0]
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
                            Trạng thái{" "}
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
                        <th className="text-left px-4 py-3">Thao tác</th>
                    </tr>
                    </thead>
                    <tbody>
                    {/* Hàng mới */}
                    {editingTaskId === "new" && (
                        <tr className="bg-yellow-50">
                            <td className="px-4 py-3">-</td>
                            <td className="px-4 py-3">
                                <input autoFocus className="border p-1 rounded w-full"
                                       value={formValues.title || ""}
                                       onChange={e => setFormValues({...formValues, title: e.target.value})}

                                />
                            </td>
                            <td className="px-4 py-3">
                                <input className="border p-1 rounded w-full"
                                       value={formValues.description || ""}
                                       onChange={e => setFormValues({...formValues, description: e.target.value})}

                                />
                            </td>
                            <td className="px-4 py-3">
                                <select
                                    value={formValues.status}
                                    onChange={e => setFormValues({...formValues, status: e.target.value as Status})}
                                    className="border p-1 rounded"
                                >
                                    <option value={Status.TODO}>TODO</option>
                                    <option value={Status.IN_PROGRESS}>IN_PROGRESS</option>
                                    <option value={Status.DONE}>DONE</option>
                                </select>
                            </td>
                            <td className="px-4 py-3">
                                <input
                                    type="date"
                                    className="border p-1 rounded"
                                    value={formValues.dueDate || ""}
                                    onChange={e => setFormValues({...formValues, dueDate: e.target.value})}
                                />

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

                    {/* Các hàng task */}
                    {sortedTasks?.map((task, idx) => (
                        editingTaskId === task.id ? (
                            <tr key={task.id} className=" bg-blue-50">
                                <td className="px-4 py-3">{idx + 1}</td>
                                <td className="px-4 py-3 ">
                                    <input autoFocus className="border p-1 rounded w-full "
                                           value={formValues.title || ""}
                                           onChange={e => setFormValues({...formValues, title: e.target.value})}
                                    />
                                </td>
                                <td className="px-4 py-3">
                                    <input className="border p-1 rounded w-full"
                                           value={formValues.description || ""}
                                           onChange={e => setFormValues({...formValues, description: e.target.value})}
                                    />
                                </td>
                                <td className="px-4 py-3">
                                    <select
                                        value={formValues.status}
                                        onChange={e => setFormValues({...formValues, status: e.target.value as Status})}
                                        className="border p-1 rounded"
                                    >
                                        <option value={Status.TODO}>TODO</option>
                                        <option value={Status.IN_PROGRESS}>IN PROGRESS</option>
                                        <option value={Status.DONE}>DONE</option>
                                    </select>
                                </td>
                                <td className="px-4 py-3">
                                    <input
                                        type="date"
                                        className="border p-1 rounded"
                                        value={formValues.dueDate || ""}
                                        onChange={e => setFormValues({...formValues, dueDate: e.target.value})}
                                    />
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
                                <td className="px-4 py-3 ">{idx + 1}</td>
                                <td className="px-4 py-3 font-semibold max-w-[15rem]">{task.title}</td>
                                <td className="px-4 py-3 text-gray-500 truncate max-w-[20rem]">{task.description}</td>
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
                                        ? new Date(task.dueDate).toLocaleDateString("vi-VN")
                                        : "Chưa có"}
                                </td>
                                <td className=" py-3 flex gap-2">
                                    <button
                                        className="px-2 py-1 bg-blue-500 text-white rounded"
                                        onClick={() => {
                                            setEditingTaskId(task.id);
                                            setFormValues({
                                                ...task,
                                                dueDate: task.dueDate
                                                    ? new Date(task.dueDate).toISOString().split("T")[0]
                                                    : ""
                                            });
                                        }}
                                    >Edit
                                    </button>

                                    <button
                                        className="px-2 py-1 bg-red-500 text-white rounded "
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
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
        </AppLayout>
    );
}