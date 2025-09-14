import {useMemo, useState} from "react";
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {addHours, format, startOfDay} from "date-fns";
import {vi as viLocale} from "date-fns/locale";
import {
    Calendar,
    dateFnsLocalizer,
    type Event,
    Views,
} from "react-big-calendar";

import "react-big-calendar/lib/css/react-big-calendar.css";

import AppLayout from "../components/AppLayout";
import {getTasks, createTask, updateTask, deleteTask} from "../api/tasks";
import {Status, type Task} from "../models/task";

const locales = { vi: viLocale };
const localizer = dateFnsLocalizer({
    format,
    parse: (str: string | number | Date) => {
        // lazy parse: new Date(str) cho date-only vẫn OK
        return new Date(str);
    },
    startOfWeek: (date: string | number | Date) => {
        // Tuần bắt đầu từ thứ 2 (theo VN)
        const d = new Date(date);
        const day = d.getDay();
        const diff = (day === 0 ? -6 : 1) - day; // chuyển về thứ 2
        d.setDate(d.getDate() + diff);
        return d;
    },
    getDay: (date: string | number | Date) => new Date(date).getDay(),
    locales,
});

type CalEvent = Event & {
    resource?: {
        task: Task
    }
};

export default function CalendarView() {
    const queryClient = useQueryClient();

    const {data: tasks, isLoading} = useQuery({
        queryKey: ["tasks"],
        queryFn: getTasks,
    });

    const createMutation = useMutation({
        mutationFn: createTask,
        onSuccess: () => queryClient.invalidateQueries({queryKey: ["tasks"]}),
    });

    const updateMutation = useMutation({
        mutationFn: (data: {id: string; task: Partial<Task>}) => updateTask(data.id, data.task),
        onSuccess: () => queryClient.invalidateQueries({queryKey: ["tasks"]}),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteTask,
        onSuccess: () => queryClient.invalidateQueries({queryKey: ["tasks"]}),
    });

    const [view, setView] = useState(Views.MONTH); // MONTH | WEEK | DAY | AGENDA
    const [date, setDate] = useState(new Date());

    // Map Task -> Calendar Event
    const events: CalEvent[] = useMemo(() => {
        if (!tasks) return [];
        // @ts-ignore
        return tasks.map((t) => {
            const start = t.dueDate ? new Date(t.dueDate) : new Date(t.createdAt);
            // hiển thị 1h cho event có time, nếu chỉ có ngày thì allDay
            const isAllDay = !t.dueDate || t.dueDate.length <= 10; // dạng "YYYY-MM-DD"
            const startAtLocal = isAllDay ? startOfDay(start) : start;
            const endAtLocal = isAllDay ? addHours(startAtLocal, 24) : addHours(startAtLocal, 1);

            return {
                id: t.id,
                title: t.title,
                start: startAtLocal,
                end: endAtLocal,
                allDay: isAllDay,
                resource: {task: t},
            };
        });
    }, [tasks]);

    // Tạo nhanh khi click vào 1 ngày trống
    const handleSelectSlot = async ({start}: { start: Date; end: Date; slots: Date[]; action: "select" }) => {
        const title = window.prompt("Nhập tiêu đề task:");
        if (!title) return;

        // Đặt dueDate = đầu ngày (local) rồi convert ISO
        const due = startOfDay(start).toISOString();

        await createMutation.mutateAsync({
            title,
            description: "",
            status: Status.TODO,
            dueDate: due,
            estimatedTime: null,
            actualTime: null,
            completedAt: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            id: "temp", // backend sẽ bỏ qua/ghi đè
        } as unknown as Task);
    };

    // Click vào event: cho edit nhanh / delete
    const handleSelectEvent = async (ev: CalEvent) => {
        const task = ev.resource?.task;
        if (!task) return;

        const action = window.prompt(
            `Sửa tiêu đề hoặc gõ "delete" để xoá\nHiện tại: ${task.title}`,
            task.title
        );

        if (action === null) return;
        if (action.toLowerCase() === "delete") {
            if (window.confirm(`Xoá task "${task.title}"?`)) {
                await deleteMutation.mutateAsync(task.id);
            }
            return;
        }

        if (action.trim() && action.trim() !== task.title) {
            await updateMutation.mutateAsync({id: task.id, task: {title: action.trim()}});
        }
    };

    // Đổi ngày event bằng kéo (nếu muốn bật draggable, dùng addon của RBC; ở đây chỉ cho phép click/slot)
    // Tối giản: khi đổi ngày (chuyển view hoặc click next/prev) không cần gì thêm

    // Màu theo status
    const eventPropGetter = (event: CalEvent) => {
        const status = event.resource?.task.status;
        let bg = "#e5e7eb"; // gray-200
        let color = "#111827"; // gray-900
        if (status === Status.IN_PROGRESS) {
            bg = "#fde68a"; // amber-300
            color = "#78350f"; // amber-900
        } else if (status === Status.DONE) {
            bg = "#a7f3d0"; // emerald-200
            color = "#064e3b"; // emerald-900
        }
        return {
            style: {
                backgroundColor: bg,
                color,
                borderRadius: 8,
                border: "none",
                padding: "2px 6px",
            }
        };
    };


    return (
        <AppLayout>
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Calendar View</h1>
                <div className="text-sm text-gray-600">Xem theo tháng/tuần/ngày. Click ngày để thêm, click event để sửa/xoá.</div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-3 h-[78vh]">
                {isLoading ? (
                    <div className="p-6 text-gray-500">Đang tải…</div>
                ) : (
                    <Calendar
                        localizer={localizer}
                        culture="vi"
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
                        view={view}
                        date={date}
                        // @ts-ignore
                        onView={(v) => setView(v)}
                        onNavigate={(d) => setDate(d)}
                        selectable
                        popup
                        // @ts-ignore
                        onSelectSlot={handleSelectSlot}
                        onSelectEvent={handleSelectEvent}
                        eventPropGetter={eventPropGetter}
                        toolbar={true}
                        step={30}
                        timeslots={2}
                        // style={{ height: "78vh" }} // đã dùng class h-[78vh]
                    />
                )}
            </div>
        </AppLayout>
    );
}
