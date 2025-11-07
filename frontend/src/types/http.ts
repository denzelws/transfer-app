export type Page<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type ListPayload<T> = Page<T> | T[] | null | undefined;

export type HttpError = {
  response?: {
    data?: unknown;
    status?: number;
    statusText?: string;
  };
  message?: string;
};
