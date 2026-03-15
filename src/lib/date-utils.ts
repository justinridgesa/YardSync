import { format, parseISO, isToday, isYesterday, isSameDay } from 'date-fns';

/**
 * Format date for display
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  
  if (isToday(d)) {
    return `Today at ${format(d, 'h:mm a')}`;
  }
  
  if (isYesterday(d)) {
    return `Yesterday at ${format(d, 'h:mm a')}`;
  }
  
  return format(d, 'MMM d, yyyy');
}

/**
 * Format date time
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM d, yyyy h:mm a');
}

/**
 * Format date only
 */
export function formatDateOnly(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM d, yyyy');
}

/**
 * Check if task is overdue
 */
export function isOverdue(dueDate: Date | string): boolean {
  const due = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate;
  return due < new Date();
}

/**
 * Get days until due
 */
export function daysUntilDue(dueDate: Date | string): number {
  const due = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate;
  const today = new Date();
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Common date ranges
 */
export const dateRanges = {
  today: () => {
    const now = new Date();
    return {
      start: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
      end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
    };
  },
  
  thisWeek: () => {
    const now = new Date();
    const day = now.getDay();
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - day);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 7);
    
    return { start: startDate, end: endDate };
  },
  
  thisMonth: () => {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return { start: startDate, end: endDate };
  },
  
  last30Days: () => {
    const now = new Date();
    const startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    return { start: startDate, end: now };
  },
};
