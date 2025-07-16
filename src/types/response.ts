export type BaseResponse<T> = {
  data: T;
  timestamp: Date;
  status: number;
  totalRecords: number;
  currentRecords: number;
  totalPages: number;
  currentPage: number;
};
