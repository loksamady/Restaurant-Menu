/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "sonner";
import { handleError } from "./errorUtil";

export function toastPromise(
  data: any,
  message: string,
  checkConflict?: boolean
) {
  if (data) {
    toast.promise(data, {
      loading: "Loading...",
      success: message,
      error: (e) => handleError(e, checkConflict),
    });
  }
}
