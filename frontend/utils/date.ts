import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(relativeTime);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export function formatDate(date: string | Date): string {
    const today = dayjs().startOf('day');
    const dueDate = dayjs(date).startOf('day');

    const duration = dueDate.diff(today, 'day') + 1;
    let remaining = `(${duration} days)`;

    if (today.isSame(dueDate, 'day')) {
        const hoursLeft = dueDate.endOf('day').diff(dayjs(), 'hour');
        remaining = `(${hoursLeft} hours)`;
    }

    return `${dueDate.format("MMM D, YYYY")} ${remaining}`;
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

export function formatDateRange(startDate?: string, endDate?: string): string {
    const start = dayjs(startDate);
    const end = dayjs(endDate);
    const duration = end.diff(start, 'day') + 1;

    return `${start.format('MMM D')} - ${end.format('MMM D, YYYY')} (${duration} days)`;
}
