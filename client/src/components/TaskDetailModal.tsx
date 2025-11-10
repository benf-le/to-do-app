// components/TaskDetailModal.tsx
import { useMemo, useState } from "react";
import { Status, type Task } from "../models/task";
import { FormatDateTimeLocal } from "./FormatDateTimeLocal";

type Props = {
    initialTask?: Task;
    isEditing: boolean;
    onClose: () => void;
    onSave: (data: Partial<Task>) => void;
    onCreate: (data: Partial<Task>) => void;
    onEdit: () => void;
    onDelete: () => void;
    forceTodayDate?: boolean; // ✅ ép dueDate = hôm nay khi tạo mới
};

export default function TaskDetailModal({
                                            initialTask,
                                            isEditing,
                                            onClose,
                                            onSave,
                                            onCreate,
                                            onEdit,
                                            onDelete,
                                            forceTodayDate,
                                        }: Props) {
    const today = useMemo(() => new Date().toISOString().split("T")[0], []);
    const todayISO = useMemo(() => new Date(today).toISOString(), [today]);

    const [form, setForm] = useState<Partial<Task>>({
        title: initialTask?.title || "",
        description: initialTask?.description || "",
        status: initialTask?.status || Status.TODO,
        // nếu tạo mới + forceTodayDate => khóa về hôm nay
        dueDate: initialTask
            ? new Date(initialTask.dueDate ?? new Date()).toISOString().slice(0, 16)
            : forceTodayDate
                ? FormatDateTimeLocal(new Date(todayISO))
                : FormatDateTimeLocal(new Date()),
        createdAt: initialTask?.createdAt,
        updatedAt: initialTask?.updatedAt,
    });

    const formatDate = (dateString?: string | null) => {
        if (!dateString) return "Chưa có";
        return new Date(dateString).toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

    const handleSaveClick = () => {
        const payload: Partial<Task> = {
            ...form,
            dueDate: forceTodayDate
                ? todayISO
                : form.dueDate
                    ? new Date(form.dueDate).toISOString()
                    : null,
        };
        initialTask ? onSave(payload) : onCreate(payload);
    };

    const displayTask = (initialTask || (form as Task));

    return (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex justify-between items-center mb-4 border-b pb-3">
                    {isEditing ? (
                        <textarea
                            name="title"
                            value={form.title || ""}
                            onChange={handleChange}
                            className="text-2xl font-bold text-gray-800 p-2 rounded w-full border focus:outline-none focus:border-blue-500 resize-none"
                            placeholder="Task Title"
                            rows={2}
                            autoFocus
                        />
                    ) : (
                        <h2 className="flex-1 text-2xl font-bold text-gray-800 break-words">{displayTask.title}</h2>
                    )}
                    <button className="text-gray-500 hover:text-gray-800 text-3xl font-light ml-4" onClick={onClose}>
                        &times;
                    </button>
                </div>

                {/* Status */}
                <div className="mb-4">
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <div className="mt-1">
                        {isEditing ? (
                            <select name="status" value={form.status} onChange={handleChange} className="border p-2 rounded w-full">
                                <option value={Status.TODO}>TO DO</option>
                                <option value={Status.IN_PROGRESS}>IN PROGRESS</option>
                                <option value={Status.DONE}>DONE</option>
                            </select>
                        ) : (
                            <>
                                {displayTask.status === Status.DONE && (
                                    <span className="px-3 py-1 text-sm font-medium rounded-full bg-emerald-100 text-emerald-700">DONE</span>
                                )}
                                {displayTask.status === Status.IN_PROGRESS && (
                                    <span className="px-3 py-1 text-sm font-medium rounded-full bg-amber-100 text-amber-700">IN PROGRESS</span>
                                )}
                                {displayTask.status === Status.TODO && (
                                    <span className="px-3 py-1 text-sm font-medium rounded-full bg-gray-200 text-gray-700">TO DO</span>
                                )}
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
                            onChange={handleChange}
                            className="text-gray-700 mt-1 bg-gray-50 p-3 rounded w-full border min-h-[100px] max-h-[250px] overflow-y-auto focus:outline-none focus:border-blue-500"
                            placeholder="Task Description"
                        />
                    ) : (
                        <p className="text-gray-700 mt-1 whitespace-pre-wrap bg-gray-50 p-3 rounded min-h-[100px] max-h-[250px] overflow-y-auto">
                            {displayTask.description || "No description."}
                        </p>
                    )}
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                    <div>
                        <div className="font-medium text-gray-500 text-sm">Deadline</div>
                        {(isEditing || forceTodayDate) ? (
                            <input
                                type="datetime-local"
                                name="dueDate"
                                className={`border p-2 rounded w-full ${forceTodayDate ? "bg-gray-100" : ""}`}
                                value={form.dueDate || ""}
                                onChange={handleChange}
                                disabled={forceTodayDate}
                            />
                        ) : (
                            <div className="text-blue-600 font-medium">{formatDate(displayTask.dueDate)}</div>
                        )}
                    </div>

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

                {/* Actions */}
                <div className="mt-6 flex gap-3">
                    {!isEditing ? (
                        <>
                            <div className="flex gap-3 w-full md:hidden">
                                <button className="w-1/2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={onEdit}>
                                    Edit
                                </button>
                                <button className="w-1/2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={onDelete}>
                                    Delete
                                </button>
                            </div>

                            <button className="w-full bg-gray-100 text-gray-800 px-4 py-2 rounded hover:bg-gray-200 mt-3" onClick={onClose}>
                                Close
                            </button>
                        </>
                    ) : (
                        <>
                            <button className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={handleSaveClick}>
                                {initialTask ? "Save changes" : "Create Task"}
                            </button>
                            <button className="w-full bg-gray-100 text-gray-800 px-4 py-2 rounded hover:bg-gray-200" onClick={onClose}>
                                Cancel
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
