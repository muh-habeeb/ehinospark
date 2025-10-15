import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Safely parse JSON response from fetch, handling empty responses and errors
 */
export async function safeFetch<T = unknown>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<{ data: T; response: Response }> {
  const response = await fetch(input, init);
  
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorData.message || errorMessage;
    } catch {
      // If JSON parsing fails, use the default error message
    }
    throw new Error(errorMessage);
  }

  let data: T;
  try {
    data = await response.json();
  } catch {
    throw new Error('Invalid JSON response from server');
  }

  return { data, response };
}

/**
 * Handle file upload with proper error handling
 */
export async function uploadFile(
  file: File,
  folder?: string
): Promise<{ url: string; fileId: string; name: string }> {
  const formData = new FormData();
  formData.append('file', file);
  if (folder) {
    formData.append('folder', folder);
  }

  const { data } = await safeFetch<{ url: string; fileId: string; name: string }>('/api/upload', {
    method: 'POST',
    body: formData,
  });

  return data;
}
