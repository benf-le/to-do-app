import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {Status, type Task} from "../models/task.ts";
import {createTask, deleteTask, getTasks, updateTask} from "../api/tasks.ts";
import {useMemo, useState} from "react";
import {FormatDateTimeLocal} from "../components/FormatDateTimeLocal.tsx";

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


    const TaskDetailModal = ({
                                 initialTask,
                                 isEditing,
                                 onClose,
                                 onEdit,      
                                 onDelete,    
                             }: {
        initialTask?: Task;
        isEditing: boolean;
        onClose: () => void;
        onSave: (data: Partial<Task>) => void;
        onCreate: (data: Partial<Task>) => void;
        onEdit: () => void;          
        onDelete: () => void;        
    }) => {

        // State nội bộ cho form (khởi tạo với initialTask hoặc giá trị mặc định)
        const [form, setForm] = useState<Partial<Task>>({
            title: initialTask?.title || "",
            description: initialTask?.description || "",
            status: initialTask?.status || Status.TODO,
            dueDate: initialTask?.dueDate ? new Date(initialTask.dueDate).toISOString().slice(0, 16) : FormatDateTimeLocal(new Date()), // Mặc định hôm nay nếu tạo mới
            createdAt: initialTask?.createdAt,
            updatedAt: initialTask?.updatedAt,
        });

        // Helper để format ngày giờ (cho chế độ xem)
        const formatDate = (dateString: string | undefined | null) => {
            if (!dateString) return "Chưa có";
            return new Date(dateString).toLocaleString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            });
        };

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
            setForm({ ...form, [e.target.name]: e.target.value });
        };



        // Xác định task hiển thị (cho chế độ xem)
        const displayTask = initialTask || (form as Task); // Hiển thị task ban đầu hoặc form nếu tạo mới

        return (
            <div
                className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
                onClick={onClose} // Click backdrop để đóng
            >
                {/* Nội dung Modal */}
                <div
                    className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg"
                    onClick={(e) => e.stopPropagation()} // Ngăn click bên trong modal đóng modal
                >
                    {/* Header Modal */}
                    <div className="flex justify-between items-center mb-4 border-b pb-3">
                        {isEditing ? (
                            <textarea
                                name="title"
                                value={form.title || ""}
                                onChange={handleInputChange}
                                className="text-2xl font-bold text-gray-800 p-2 rounded w-full border focus:outline-none focus:border-blue-500 resize-none"
                                placeholder="Task Title"
                                rows={2}
                                autoFocus // Tự động focus khi tạo mới/sửa
                            />
                        ) : (
                            <h2 className="flex-1 text-2xl font-bold text-gray-800 break-words">{displayTask.title}</h2>
                        )}
                        <button
                            className="text-gray-500 hover:text-gray-800 text-3xl font-light ml-4"
                            onClick={onClose}
                        >
                            &times;
                        </button>
                    </div>

                    {/* Status Badge */}
                    <div className="mb-4">
                        <label className="text-sm font-medium text-gray-500">Status</label>
                        <div className="mt-1">
                            {isEditing ? (
                                <select
                                    name="status"
                                    value={form.status}
                                    onChange={handleInputChange}
                                    className="border p-2 rounded w-full"
                                >
                                    <option value={Status.TODO}>TO DO</option>
                                    <option value={Status.IN_PROGRESS}>IN PROGRESS</option>
                                    <option value={Status.DONE}>DONE</option>
                                </select>
                            ) : (
                                <>
                                    {displayTask.status === Status.DONE && ( <span className="px-3 py-1 text-sm font-medium rounded-full bg-emerald-100 text-emerald-700">DONE</span> )}
                                    {displayTask.status === Status.IN_PROGRESS && ( <span className="px-3 py-1 text-sm font-medium rounded-full bg-amber-100 text-amber-700">IN PROGRESS</span> )}
                                    {displayTask.status === Status.TODO && ( <span className="px-3 py-1 text-sm font-medium rounded-full bg-gray-200 text-gray-700">TO DO</span> )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                        <label className="text-sm font-medium text-gray-500">Description</label>
                        {isEditing ? (
                            <textarea
                                name="description"
                                value={form.description || ""}
                                onChange={handleInputChange}
                                className="text-gray-700 mt-1 bg-gray-50 p-3 rounded w-full border min-h-[100px] max-h-[250px] overflow-y-auto focus:outline-none focus:border-blue-500"
                                placeholder="Task Description"
                            />
                        ) : (
                            <p className="text-gray-700 mt-1 whitespace-pre-wrap bg-gray-50 p-3 rounded min-h-[100px] max-h-[250px] overflow-y-auto">
                                {displayTask.description || "No description."}
                            </p>
                        )}
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                        <div>
                            <div className="font-medium text-gray-500 text-sm">Deadline</div>
                            {isEditing ? (
                                <input
                                    type="datetime-local"
                                    name="dueDate"
                                    className="border p-2 rounded w-full"
                                    value={form.dueDate || ""}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <div className="text-blue-600 font-medium">{formatDate(displayTask.dueDate)}</div>
                            )}
                        </div>
                        {/* Chỉ hiển thị Ngày tạo/Cập nhật khi xem chi tiết (không hiển thị khi tạo mới) */}
                        {!isEditing && initialTask && (
                            <>
                                <div>
                                    <div className="font-medium text-gray-500 text-sm">Created At</div>
                                    <div>{formatDate(displayTask.createdAt)}</div>
                                </div>
                                <div>
                                    <div className="font-medium text-gray-500 text-sm">Last Updated</div>
                                    <div>{formatDate(displayTask.updatedAt)}</div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Nút bấm (thay đổi theo chế độ) */}
                    <div className="mt-6 flex gap-3">
                        {!isEditing ? (
                            <>
                                {/* Nhóm nút dành cho mobile */}
                                <div className="flex gap-3 w-full md:hidden">
                                    <button
                                        className="w-1/2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                        onClick={onEdit}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="w-1/2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                        onClick={onDelete}
                                    >
                                        Delete
                                    </button>
                                </div>

                                {/* Nút Close (luôn có, nhưng trên mobile sẽ nằm dưới 2 nút trên) */}
                                <button
                                    className="w-full bg-gray-100 text-gray-800 px-4 py-2 rounded hover:bg-gray-200 mt-3"
                                    onClick={onClose}
                                >
                                    Close
                                </button>
                            </>
                        ) : (
                        <button
                                className="w-full bg-gray-100 text-gray-800 px-4 py-2 rounded hover:bg-gray-200"
                                onClick={onClose}
                            >
                                Close
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    };
    // -----------------------------
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

