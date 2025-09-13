import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {Status, type Task} from "../models/task.ts";
import {createTask, deleteTask, getTasks, updateTask} from "../api/tasks.ts";
import { useState } from "react";

export default function TaskListView() {
    const queryClient = useQueryClient();
    const { data: tasks } = useQuery({ queryKey:["tasks"], queryFn:getTasks });

    const createMutation = useMutation({
        mutationFn: createTask,
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ["tasks"] }),
    });

    const updateMutation = useMutation({
        mutationFn: (data: { id: string; task: Partial<Task> }) =>
            updateTask(data.id, data.task),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ["tasks"] }),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteTask,
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ["tasks"] }),
    });
    // state quản lý edit
    const [editingTaskId, setEditingTaskId] = useState<string|null>(null);
    const [formValues, setFormValues] = useState<Partial<Task>>({});

    // handle blur -> lưu lại
    const handleSave = () => {
        if (editingTaskId === "new") {
            createMutation.mutate(formValues as Task);
        } else if (editingTaskId) {
            updateMutation.mutate({ id: editingTaskId, task: formValues });
        }
        setEditingTaskId(null);
        setFormValues({});
    };

    const handleCancel = () => {
        setEditingTaskId(null);
        setFormValues({});
    };

    return (
        <div className="w-[90%] mx-auto py-6">
            {/* Header */}
            <div className="flex justify-between mb-6">
                <h1 className="text-2xl font-bold">Quản Lý Công Việc</h1>
                <button
                    className="bg-amber-500 text-white px-4 py-2 rounded"
                    onClick={()=>{
                        setEditingTaskId("new");
                        setFormValues({ title:"", description:"", status:Status.TODO, estimatedTime:0 });
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
                        <th className="text-left px-4 py-3">Ước tính</th>
                        <th className="text-left px-4 py-3">Thao tác</th>
                    </tr>
                    </thead>
                    <tbody>
                    {/* Hàng mới */}
                    {editingTaskId==="new" && (
                        <tr className="bg-yellow-50">
                            <td className="px-4 py-3">-</td>
                            <td className="px-4 py-3">
                                <input autoFocus className="border p-1 rounded w-full"
                                       value={formValues.title||""}
                                       onChange={e=>setFormValues({...formValues,title:e.target.value})}

                                />
                            </td>
                            <td className="px-4 py-3">
                                <input className="border p-1 rounded w-full"
                                       value={formValues.description||""}
                                       onChange={e=>setFormValues({...formValues,description:e.target.value})}

                                />
                            </td>
                            <td className="px-4 py-3">
                                <select
                                    value={formValues.status}
                                    onChange={e=>setFormValues({...formValues,status:e.target.value as Status})}
                                    className="border p-1 rounded"
                                >
                                    <option value={Status.TODO}>TODO</option>
                                    <option value={Status.IN_PROGRESS}>IN_PROGRESS</option>
                                    <option value={Status.DONE}>DONE</option>
                                </select>
                            </td>
                            <td className="px-4 py-3">
                                <input type="number" className="border p-1 rounded w-20"
                                       value={formValues.estimatedTime||0}
                                       onChange={e=>setFormValues({...formValues,estimatedTime:Number(e.target.value)})}
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
                    {tasks?.map((task,idx)=>(
                        editingTaskId===task.id ? (
                            <tr key={task.id} className=" bg-blue-50">
                                <td className="px-4 py-3">{idx+1}</td>
                                <td className="px-4 py-3">
                                    <input autoFocus className="border p-1 rounded w-full"
                                           value={formValues.title||""}
                                           onChange={e=>setFormValues({...formValues,title:e.target.value})}
                                           />
                                </td>
                                <td className="px-4 py-3">
                                    <input className="border p-1 rounded w-full"
                                           value={formValues.description||""}
                                           onChange={e=>setFormValues({...formValues,description:e.target.value})}
                                           />
                                </td>
                                <td className="px-4 py-3">
                                    <select
                                        value={formValues.status}
                                        onChange={e=>setFormValues({...formValues,status:e.target.value as Status})}
                                        className="border p-1 rounded"
                                    >
                                        <option value={Status.TODO}>TODO</option>
                                        <option value={Status.IN_PROGRESS}>IN PROGRESS</option>
                                        <option value={Status.DONE}>DONE</option>
                                    </select>
                                </td>
                                <td className="px-4 py-3">
                                    <input type="number" className="border p-1 rounded w-20"
                                           value={formValues.estimatedTime||0}
                                           onChange={e=>setFormValues({...formValues,estimatedTime:Number(e.target.value)})}
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
                                <td className="px-4 py-3">{idx+1}</td>
                                <td className="px-4 py-3 font-semibold">{task.title}</td>
                                <td className="px-4 py-3 text-gray-500 truncate">{task.description}</td>
                                <td className="px-4 py-3">{task.status}</td>
                                <td className="px-4 py-3 text-emerald-600">{task.estimatedTime}</td>
                                <td className="px-4 py-3">
                                    <button
                                        className="text-blue-600"
                                        onClick={()=>{
                                            setEditingTaskId(task.id);
                                            setFormValues(task);
                                        }}
                                    >✎</button>

                                    <button
                                        className="text-red-600"
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
                                        🗑
                                    </button>
                                </td>
                            </tr>
                        )
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}