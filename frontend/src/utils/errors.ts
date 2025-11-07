import type { HttpError } from '@/types/http';

export function toErrorMessage(err: HttpError): string {
  if (err.response?.data !== undefined) {
    if (typeof err.response.data === 'string') return err.response.data;
    try {
      return JSON.stringify(err.response.data);
    } catch {
      return 'Error';
    }
  }
  return err.message ?? 'Error';
}

export function handleHttpError(
  err: unknown,
  setMessage: (msg: string) => void,
): void {
  setMessage(toErrorMessage(err as HttpError));
}
