import type { HttpError } from '@/types/http';

export function toErrorMessage(err: HttpError): string {
  const data = err.response?.data;

  if (data !== undefined) {
    if (typeof data === 'string') return data;

    try {
      return JSON.stringify(data);
    } catch {
      return 'System error: Unable to parse response';
    }
  }

  return err.message ?? 'Unknown connection error';
}

export function handleHttpError(
  err: unknown,
  setMessage: (msg: string) => void,
): void {
  setMessage(toErrorMessage(err as HttpError));
}
