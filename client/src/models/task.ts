
// Task type
export const Status = {
    TODO: "TODO",
    IN_PROGRESS: "IN_PROGRESS",
    DONE: "DONE",
} as const;

export type Status = typeof Status[keyof typeof Status];


export interface Task {
    id: string;
    title: string;
    description?: string | null;
    status: Status;
    dueDate?: string | null;
    estimatedTime?: number | null;
    actualTime?: number | null;
    completedAt?: string | null;
    createdAt: string;
    updatedAt: string;
}

export type TaskDTO = Omit<Task, "id" | "createdAt" | "updatedAt">;
