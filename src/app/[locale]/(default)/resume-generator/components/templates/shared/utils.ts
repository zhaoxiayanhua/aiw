import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isEmptyString(value: string): boolean {
  return !value || value.trim().length === 0;
}

export function isUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function sanitize(html: string): string {
  // Simple sanitization - you might want to use a library like DOMPurify
  return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
}

export function extractRelevantCourseNames(value: string): string[] {
  if (isEmptyString(value)) {
    return [];
  }

  const normalized = value
    .replace(/^relevant\s+coursework\s*:?\s*/i, "")
    .replace(/\r\n?/g, "\n")
    .replace(/[;\uFF1B]/g, "\n");

  const courseNames = normalized
    .split(/\n+/)
    .flatMap((line) => line.split(","))
    .map((part) => part.replace(/^[-\u2022\u25CF\s]+/, "").trim())
    .map((part) => part.split(/\s(?:-|\u2013|\u2014)\s|:\s*/)[0]?.trim() ?? "")
    .map((part) => part.replace(/[.\u3002;\uFF1B]+$/, "").trim())
    .filter(Boolean)
    .filter((part) => !/^(and|or|with|including|covered|focus|focused|such as)\b/i.test(part));

  return Array.from(new Set(courseNames));
}

export function formatRelevantCoursework(value: string, separator = ", "): string {
  return extractRelevantCourseNames(value).join(separator);
}
