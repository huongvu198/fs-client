import { Id, toast, Zoom } from "react-toastify";

const toastIds = new Map<string, Id>();

export enum ToastType {
  SUCCESS = "success",
  ERROR = "error",
  INFO = "info",
}

export function showToast(type: ToastType, message: string, options = {}) {
  if (toastIds.has(message)) {
    toast.dismiss(toastIds.get(message));
  }

  const id: Id = toast[type](message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
    transition: Zoom,
    ...options,
  });

  toastIds.set(message, id);
}
