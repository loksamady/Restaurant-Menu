export enum PAGE_STATUS {
  DISABLE = 0,
  ACTIVE = 1,
  DELETE = 2,
}

export const PAGE_STATUS_LABEL: { [key in PAGE_STATUS as number]: string } = {
  [PAGE_STATUS.DISABLE]: "DISABLE",
  [PAGE_STATUS.ACTIVE]: "ACTIVE",
  [PAGE_STATUS.DELETE]: "DELETE",
};
