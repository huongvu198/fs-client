import React, { useEffect, useState } from "react";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  MessageInput,
  Message,
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { CommentOutlined, CloseOutlined } from "@ant-design/icons";
import useSocket from "@hooks/useSocket";
import { SocketEvent } from "shared/enum";

const FloatingChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "d641f5e3-4a40-4c4b-ad86-911999d51854",
      conversationId: "7cab5070-4726-4e7c-98e2-205757e59457",
      senderId: 62,
      content: "62HIHIH",
      isRead: false,
      createdAt: "2025-05-13T16:25:34.582Z",
      sender: {
        id: 62,
        email: "nhatnt@newwave.com.vn",
        fullName: "Nguyễn Tiến Nhất",
      },
    },
    {
      id: "d9a9c504-c00a-44c3-a143-b4c1f216c022",
      conversationId: "7cab5070-4726-4e7c-98e2-205757e59457",
      senderId: 62,
      content: "62HIHIH",
      isRead: false,
      createdAt: "2025-05-13T16:27:34.555Z",
      sender: {
        id: 62,
        email: "nhatnt@newwave.com.vn",
        fullName: "Nguyễn Tiến Nhất",
      },
    },
    {
      id: "c8db0438-5c8e-4933-a178-26b332aa318a",
      conversationId: "7cab5070-4726-4e7c-98e2-205757e59457",
      senderId: 10,
      content: "Hi",
      isRead: false,
      createdAt: "2025-05-13T16:29:07.126Z",
      sender: {
        id: 10,
        email: "huongvt@newwave.com.vn",
        fullName: "Huong Vu",
      },
    },
    {
      id: "1a8eb4cc-83ae-469e-98ce-7ea7e08ecc09",
      conversationId: "7cab5070-4726-4e7c-98e2-205757e59457",
      senderId: 62,
      content: "Toi can sp",
      isRead: false,
      createdAt: "2025-05-13T16:33:14.050Z",
      sender: {
        id: 62,
        email: "nhatnt@newwave.com.vn",
        firstName: "Tiến Nhất",
      },
    },
    {
      id: "1368c09f-d497-4b6e-99b5-f8f5bf456b6f",
      conversationId: "7cab5070-4726-4e7c-98e2-205757e59457",
      senderId: 10,
      content: "Co van de gi",
      isRead: false,
      createdAt: "2025-05-13T16:33:20.290Z",
      sender: {
        id: 10,
        email: "huongvt@newwave.com.vn",
        fullName: "Huong Vu",
      },
    },
  ]);

  console.log("messages", messages);

  const { sendMessage } = useSocket({
    [SocketEvent.NEW_MESSAGE]: (data) => {
      console.log("data", data);
      setMessages((prev) => [...prev, data]);
    },
  });

  useEffect(() => {
    sendMessage(SocketEvent.JOIN_CONVERSATION, {
      conversationId: "7cab5070-4726-4e7c-98e2-205757e59457",
    });
  }, [sendMessage]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = (message: any) => {
    const newMessage = {
      id: crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).substr(2, 9),
      conversationId: "7cab5070-4726-4e7c-98e2-205757e59457",
      senderId: 62,
      content: message,
      isRead: false,
      createdAt: new Date().toISOString(),
      sender: {
        id: 62,
        email: "nhatnt@newwave.com.vn",
        fullName: "Nguyễn Tiến Nhất",
      },
    };
    sendMessage(SocketEvent.SEND_MESSAGE, newMessage);
  };

  return (
    <div>
      <div className="floating-button" onClick={toggleChat}>
        <CommentOutlined style={{ fontSize: 32, color: "#fff" }} />
      </div>

      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <span>Chat với chúng tôi</span>
            <CloseOutlined className="close-icon" onClick={toggleChat} />
          </div>
          <MainContainer>
            <ChatContainer>
              <MessageList>
                {messages.map((msg) => (
                  <Message
                    key={msg.id}
                    model={{
                      message: msg.content,
                      sender: msg.sender.fullName || msg.sender.firstName || "",
                      direction: msg.senderId === 62 ? "outgoing" : "incoming",
                      position: "single",
                    }}
                  />
                ))}
              </MessageList>
              <MessageInput
                placeholder="Nhập tin nhắn..."
                onSend={handleSend}
                attachButton={false}
              />
            </ChatContainer>
          </MainContainer>
        </div>
      )}

      <style>{`
        .floating-button {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 50px;
          height: 50px;
          background-color: #007bff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        }

        .chat-window {
          position: fixed;
          bottom: 80px;
          right: 20px;
          width: 300px;
          height: 400px;
          background-color: #fff;
          border-radius: 10px;
          box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
          overflow: hidden;
          z-index: 1000;
          display: flex;
          flex-direction: column;
        }

        .chat-header {
          background-color: #007bff;
          color: #fff;
          padding: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: bold;
        }

        .close-icon {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default FloatingChatWidget;
