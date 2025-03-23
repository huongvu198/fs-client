import ContextNoti from "contexts/notiContext";
import { useContext } from "react";

const useNotification = () => {
  const contextNoti = useContext(ContextNoti);

  return {
    successMessage: contextNoti.successMessage,
    warningMessage: contextNoti.warningMessage,
    errorMessage: contextNoti.errorMessage,
    deleteMessage: contextNoti.deleteMessage,
    successModalMessage: contextNoti.successModalMessage,
    warningModalMessage: contextNoti.warningModalMessage,
    confirmMessage: contextNoti.confirmMessage,
  };
};

export default useNotification;
