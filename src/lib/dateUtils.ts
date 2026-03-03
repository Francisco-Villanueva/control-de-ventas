/**
 * Date utilities for timezone-safe date handling
 *
 * This module provides utilities to work with dates as strings ("YYYY-MM-DD") throughout
 * the application, only converting to Date objects when absolutely necessary.
 * This eliminates timezone confusion and date offset bugs.
 */

/**
 * Converts a Date object to YYYY-MM-DD string in LOCAL timezone
 * This ensures the user's selected date is preserved
 */
export function toDateString(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Converts YYYY-MM-DD string to Date object at LOCAL midnight
 * Use this for display/formatting only, not for comparisons
 */
export function fromDateString(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day, 0, 0, 0, 0)
}

/**
 * Gets today's date as YYYY-MM-DD string in LOCAL timezone
 */
export function getTodayString(): string {
  return toDateString(new Date())
}

/**
 * Converts YYYY-MM-DD string to Date at UTC midnight (for Prisma @db.Date fields)
 * This creates a Date object that Prisma will store correctly as a DATE type
 */
export function toUTCDate(dateStr: string): Date {
  return new Date(dateStr + 'T00:00:00.000Z')
}

/**
 * Extracts YYYY-MM-DD from a Prisma Date field
 * Handles the case where Prisma returns Date objects for @db.Date fields
 */
export function fromPrismaDate(prismaDate: Date | string): string {
  if (prismaDate instanceof Date) {
    return toDateString(prismaDate)
  }
  return String(prismaDate).split('T')[0]
}
