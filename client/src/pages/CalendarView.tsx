import { useMemo, useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addHours, format, startOfDay, startOfWeek as dfStartOfWeek, getDay as dfGetDay } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import {
    Calendar,
    dateFnsLocalizer,
    type Event,
    Views,
    type View,
} from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { getTasks, createTask, updateTask, deleteTask } from "../api/tasks";
import { Status, type Task } from "../models/task";

// ==== Locale imports (thêm en-US / en-GB / en-IN / vi) ====
import { enUS, enGB, enIN } from "date-fns/locale";
import { vi as viLocale } from "date-fns/locale";

// ==== Map các locale được hỗ trợ ====
const LOCALES = {
    "en-US": enUS, // Mỹ: tuần bắt đầu Chủ nhật, 12h
    "en-GB": enGB, // Anh: tuần bắt đầu Thứ 2, 24h
    "en-IN": enIN, // Ấn Độ: tuần bắt đầu Thứ 2, 24h
    vi: viLocale,  // Việt Nam
} as const;

// Lấy locale trình duyệt -> khớp LOCALES (fallback hợp lý)
function getUserLocale(): keyof typeof LOCALES {
    const nav = typeof navigator !== "undefined" ? navigator.language : "en-US";
    if ((nav as keyof typeof LOCALES) in LOCALES) return nav as keyof typeof LOCALES;
    if (nav.startsWith("en")) return "en-US";
    return "en-GB"; // fallback an toàn
}

// 12h ở Mỹ, 24h các nơi khác (tuỳ chỉnh theo ý bạn)
function getHourCycle(localeKey: string): "h12" | "h23" {
    return localeKey === "en-US" ? "h12" : "h23";
}

// Tạo localizer theo locale (ảnh hưởng nhãn, tuần bắt đầu…)
function makeLocalizer(localeKey: keyof typeof LOCALES) {
    const locale = LOCALES[localeKey];
    return dateFnsLocalizer({
        format,
        parse: (value: string | number | Date) => new Date(value),
        startOfWeek: (date: Date) => dfStartOfWeek(date, { locale }), // tuần theo locale
        getDay: (date: Date) => dfGetDay(date),
        locales: LOCALES,
    });
}

type CalEvent = Event & { resource?: { task: Task } };

export default function CalendarView() {
    const queryClient = useQueryClient();
    const { data: tasks, isLoading } = useQuery({ queryKey: ["tasks"], queryFn: getTasks });

    const createMutation = useMutation({
        mutationFn: createTask,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
    });
    const updateMutation = useMutation({
        mutationFn: (data: { id: string; task: Partial<Task> }) => updateTask(data.id, data.task),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
    });
    const deleteMutation = useMutation({
        mutationFn: deleteTask,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
    });

    // ==== View/Date có typing đúng, không cần ts-ignore ====
    const [view, setView] = useState<View>(Views.MONTH);
    const [date, setDate] = useState(new Date());

    // ==== Locale & Timezone ====
    const [localeKey, setLocaleKey] = useState<keyof typeof LOCALES>(getUserLocale());
    const [timeZone, setTimeZone] = useState("UTC");

    useEffect(() => {
        try {
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
            setTimeZone(tz); // ví dụ: "Asia/Kolkata", "America/New_York", "Europe/London", "Asia/Ho_Chi_Minh"
        } catch {
            setTimeZone("UTC");
        }
    }, []);

    useEffect(() => {
        setLocaleKey(getUserLocale());
    }, []);
    // Localizer theo locale đã detect
    const localizer = makeLocalizer(localeKey);

    // Định dạng theo 12h/24h phù hợp từng nước
    const hourCycle = getHourCycle(localeKey);
    const fmt = (opts: Intl.DateTimeFormatOptions) =>
        new Intl.DateTimeFormat(localeKey, { hourCycle, ...opts });

    const formats = {
        timeGutterFormat: (d: Date) => fmt({ hour: "numeric", minute: "2-digit" }).format(d),
        eventTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) =>
            `${fmt({ hour: "numeric", minute: "2-digit" }).format(start)} – ${fmt({
                hour: "numeric",
                minute: "2-digit",
            }).format(end)}`,
        dayHeaderFormat: (d: Date) =>
            fmt({ weekday: "long", year: "numeric", month: "long", day: "numeric" }).format(d),
    };

    // --- Chuyển event UTC -> giờ địa phương theo timezone người dùng ---
    const events: CalEvent[] = useMemo(() => {
        if (!tasks) return [];
        return tasks.map((t) => {
            const baseDate = t.dueDate ? new Date(t.dueDate) : new Date(t.createdAt); // nên là UTC ISO từ backend
            const startLocal = toZonedTime(baseDate, timeZone);
            const endLocal = addHours(startLocal, 1);
            return {
                id: t.id,
                title: t.title,
                start: startLocal,
                end: endLocal,
                allDay: false,
                resource: { task: t },
            };
        });
    }, [tasks, timeZone]);

    // --- Click event: sửa/xoá nhanh ---
    const handleSelectEvent = async (ev: CalEvent) => {
        const task = ev.resource?.task;
        if (!task) return;
        const action = window.prompt(
            `Edit title or type "delete" to remove\nCurrent: ${task.title}`,
            task.title
        );
        if (!action) return;
        if (action.toLowerCase() === "delete") {
            if (window.confirm(`Delete task "${task.title}"?`)) {
                await deleteMutation.mutateAsync(task.id);
            }
            return;
        }
        if (action.trim() && action.trim() !== task.title) {
            await updateMutation.mutateAsync({ id: task.id, task: { title: action.trim() } });
        }
    };

    // --- Click slot: tạo task mới (lưu UTC) ---
    const handleSelectSlot = async ({ start }: { start: Date }) => {
        const title = window.prompt("Task title:");
        if (!title) return;
        const due = startOfDay(start).toISOString(); // lưu UTC
        await createMutation.mutateAsync({
            title,
            description: "",
            status: Status.TODO,
            dueDate: due,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            id: "temp",
        } as unknown as Task);
    };

    // --- Màu theo trạng thái ---
    const eventPropGetter = (event: CalEvent) => {
        const status = event.resource?.task.status;
        let bg = "#e5e7eb";
        let color = "#111827";
        if (status === Status.IN_PROGRESS) { bg = "#fde68a"; color = "#78350f"; }
        else if (status === Status.DONE) { bg = "#a7f3d0"; color = "#064e3b"; }
        return { style: { backgroundColor: bg, color, borderRadius: 8, border: "none", padding: "2px 6px" } };
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                <h1 className="text-2xl font-bold">🌍 Calendar View</h1>
                <div className="text-sm text-gray-600">
                    Timezone: <span className="font-medium">{timeZone}</span> · Locale: <span className="font-medium">{localeKey}</span>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-3 h-[78vh]">
                {isLoading ? (
                    <div className="p-6 text-gray-500">Loading…</div>
                ) : (
                    <Calendar
                        localizer={localizer}
                        culture={localeKey} // 👉 tự hiển thị đúng cho US/UK/IN/VN
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
                        view={view}
                        date={date}
                        onView={(v) => setView(v)}
                        onNavigate={(d) => setDate(d)}
                        selectable
                        popup
                        onSelectSlot={handleSelectSlot}
                        onSelectEvent={handleSelectEvent}
                        eventPropGetter={eventPropGetter}
                        formats={formats}    // 👉 12h ở US, 24h ở UK/IN/VN
                        step={30}
                        timeslots={2}
                    />
                )}
            </div>
        </div>
    );
}
