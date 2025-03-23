import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { Modal } from "antd";
import { NotificationInstance } from "antd/es/notification/interface";
import { createContext, JSX, ReactElement } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  children: JSX.Element;
  api: NotificationInstance;
  contextHolder: ReactElement;
}

interface ConfirmMessage {
  onSubmit?: () => void;
  description: string;
  title?: string;
  onCancel?: () => void;
}

interface Message {
  title?: string;
  description: string;
}

interface Context {
  successMessage: (message: Message) => void;
  errorMessage: (message: Message) => void;
  warningMessage: (message: Message) => void;
  deleteMessage: (message: Message) => void;
  confirmMessage: (message: Message) => void;
  warningModalMessage: (message: Message) => void;
  successModalMessage: (message: Message) => void;
}

const ContextNoti = createContext<Context>({
  successMessage: (_message) => {},
  errorMessage: (_message) => {},
  warningMessage: (_message) => {},
  deleteMessage: (_message) => {},
  confirmMessage: (_message) => {},
  warningModalMessage: (_message) => {},
  successModalMessage: (_message) => {},
});

export const NotiContext = ({ api, contextHolder, children }: Props) => {
  const { t } = useTranslation();

  const successMessage = ({ title, description }: Message) => {
    api.success({
      message: title || t("noti.title.success"),
      description: description,
      duration: 2,
      style: {
        backgroundColor: "#f6ffed",
        border: "1px solid #b7eb8f",
        borderRadius: "5px",
        padding: "12px 16px !important",
      },
    });
  };

  const errorMessage = ({ title, description }: Message) => {
    api.error({
      message: title || t("noti.title.error"),
      description: description,
      duration: 2,
      style: {
        backgroundColor: "#fff2f0",
        border: "1px solid #ffccc7",
        borderRadius: "5px",
        padding: "12px 16px !important",
      },
    });
  };

  const warningMessage = ({ title, description }: Message) => {
    api.warning({
      message: title || t("noti.title.warning"),
      description: description,
      duration: 2,
      style: {
        backgroundColor: "#fffbe6",
        border: "1px solid #ffe58f",
        borderRadius: "5px",
        padding: "12px 16px !important",
      },
    });
  };

  const warningModalMessage = ({
    title,
    description,
    onSubmit = () => {},
  }: ConfirmMessage) => {
    Modal.warning({
      title: title || t("noti.title.warningModal"),
      content: description,
      okText: t("noti.btn.delete"),
      cancelText: t("noti.btn.comfirm"),
      onOk: () => onSubmit(),
    });
  };

  const deleteMessage = ({
    onCancel = () => {},
    title,
    description,
    onSubmit = () => {},
  }: ConfirmMessage) => {
    Modal.confirm({
      className: "modal-message",
      title: title || t("noti.title.delete"),
      content: description,
      icon: (
        <QuestionCircleOutlined
          style={{
            fontSize: "24px",
            color: "#e7515a",
            marginBottom: "0.5rem",
          }}
        />
      ),
      okText: t("noti.btn.delete"),
      cancelText: t("noti.btn.cancel"),
      okButtonProps: {
        className: "btn-danger",
      },
      cancelButtonProps: {
        className: "btn-dark",
      },
      onCancel: () => onCancel(),
      onOk: () => onSubmit(),
    });
  };

  const confirmMessage = ({
    onCancel = () => {},
    title,
    description,
    onSubmit = () => {},
  }: ConfirmMessage) => {
    Modal.confirm({
      className: "modal-message",
      title: title || t("noti.title.comfirm"),
      content: description,
      icon: (
        <ExclamationCircleOutlined
          style={{
            fontSize: "24px",
            color: "#e2a03f",
            marginBottom: "0.5rem",
          }}
        />
      ),
      okText: t("noti.btn.comfirm"),
      cancelText: t("noti.btn.cancel"),
      okButtonProps: {
        className: "btn-info",
      },
      cancelButtonProps: {
        className: "btn-dark",
      },
      onCancel: () => onCancel(),
      onOk: () => onSubmit(),
    });
  };

  const successModalMessage = ({
    title,
    description,
    onSubmit = () => {},
  }: ConfirmMessage) => {
    Modal.confirm({
      className: "modal-message",
      title: title || t("noti.title.successModal"),
      content: description,
      icon: (
        <CheckCircleOutlined
          style={{
            fontSize: "24px",
            color: "#00ab55",
            marginBottom: "0.5rem",
          }}
        />
      ),
      okText: t("noti.btn.comfirm"),
      okButtonProps: {
        className: "btn-info",
      },
      cancelButtonProps: {
        className: "btn-dark",
      },
      onOk: () => onSubmit(),
    });
  };

  return (
    <ContextNoti.Provider
      value={{
        successMessage,
        errorMessage,
        warningMessage,
        deleteMessage,
        confirmMessage,
        warningModalMessage,
        successModalMessage,
      }}
    >
      <>
        {contextHolder}
        {children}
      </>
    </ContextNoti.Provider>
  );
};

export default ContextNoti;