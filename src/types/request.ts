/* REQUEST PARAM TYPE */
export type CommonRequestParamType = {
  page?: number;
  limit?: number;
};

export type AdminMenuRequestParamType = {
  merchantId: number;
  status?: number;
  orderBy?: string;
};
