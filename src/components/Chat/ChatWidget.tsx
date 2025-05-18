/* Updated ChatWidget Component with useSocket Hook */

import useSocket from "@hooks/useSocket";
import { useEffect } from "react";
import { Widget, addResponseMessage } from "react-chat-widget";
import "react-chat-widget/lib/styles.css";
import { SocketEvent } from "shared/enum";

function ChatWidget() {
  const { sendMessage } = useSocket({
    [SocketEvent.NEW_MESSAGE]: (message) => {
      addResponseMessage(message);
    },
  });

  useEffect(() => {
    addResponseMessage(
      '<a href="/login" style="color: #007bff; text-decoration: underline;">Đăng nhập để nhận hỗ trợ</a>'
    );
  }, []);

  const handleNewUserMessage = (message: any) => {
    sendMessage(SocketEvent.SEND_MESSAGE, message);
  };

  return (
    <Widget
      handleNewUserMessage={handleNewUserMessage}
      title="Chat với chúng tôi"
      subtitle="Hỗ trợ trực tuyến"
      launcherStyle={{
        bottom: "20px", // Khoảng cách từ đáy màn hình
        left: "20px", // Cách cạnh trái
        right: "auto", // Xóa vị trí mặc định bên phải
      }}
    />
  );
}

export default ChatWidget;
