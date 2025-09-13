import axios from "axios";
import type { Task } from "../models/task";

const API_URL = "http://localhost:3000"; // NestJS backend

export const getTasks = async () => {
    const res = await axios.get(`${API_URL}/tasks`);
    return res.data;
};

export const createTask = async (task: any) => {
    const res = await axios.post(`${API_URL}/tasks/create`, task);
    return res.data;
};

export const updateTask = async (id: string, task: Partial<Task>) => {
    const res = await axios.patch(`${API_URL}/tasks/update/${id}`, task);
    return res.data;
};

export const deleteTask = async (id: string) => {
    const res = await axios.delete(`${API_URL}/tasks/delete/${id}`);
    return res.data;
};
