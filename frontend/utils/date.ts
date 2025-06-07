import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export function formatDate(date: string | Date): string {
    return dayjs(date).format("MMM D, YYYY");
}

export function formatDateRelative(date: string | Date): string {
    return dayjs(date).fromNow();
}

export function formatDateTime(date: string | Date): string {
    return dayjs(date).format("MMM D, YYYY h:mm A");
}

export function isOverdue(date: string | Date): boolean {
    return dayjs(date).isBefore(dayjs(), "day");
}

export function isDueSoon(date: string | Date, days: number = 3): boolean {
    const today = dayjs();
    const dueDate = dayjs(date);
    return dueDate.isAfter(today) && dueDate.isBefore(today.add(days, "day"));
}
