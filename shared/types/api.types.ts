export type ApiResponse<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
};

export type ApiMeta = {
  page?: number;
  limit?: number;
  total?: number;
  totalPage?: number;
};

export type ApiList<T> = {
  data: T[];
  meta?: ApiMeta;
};
