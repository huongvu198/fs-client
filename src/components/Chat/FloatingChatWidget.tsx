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
import { useAuthContext } from "contexts/authContext";
import {
  conversationSelector,
  getConversation,
  getMessages,
  messagesSelector,
} from "@redux/chatSlice";
import { useSelector } from "react-redux";
import { getUserIdFromToken } from "shared/common";
import { getAccessToken } from "@config/accessToken";
import { useRedux } from "@hooks/useRedux";

const FloatingChatWidget = () => {
  const { isAuthenticated } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);
  const reduxMessages = useSelector(messagesSelector);
  const [messages, setMessages] = useState(reduxMessages);
  const conversationId = useSelector(conversationSelector);
  const accessToken = getAccessToken();
  const userId = getUserIdFromToken(accessToken!);
  const dispatch = useRedux();

  const { sendMessage } = useSocket({
    [SocketEvent.NEW_MESSAGE]: (data) => {
      setMessages((prev) => [...prev, data]);
    },
  });

  useEffect(() => {
    setMessages(reduxMessages);
  }, [reduxMessages]);

  useEffect(() => {
    if (userId) {
      dispatch(getConversation());
    }
  }, [userId]);

  useEffect(() => {
    if (conversationId) {
      dispatch(getMessages(conversationId));
    }
  }, [conversationId]);

  useEffect(() => {
    if (conversationId) {
      sendMessage(SocketEvent.JOIN_CONVERSATION, {
        conversationId: conversationId,
      });
    }
  }, [sendMessage, conversationId]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = (message: any) => {
    const newMessage = {
      conversationId: conversationId,
      senderId: userId,
      content: message,
      isRead: false,
    };
    sendMessage(SocketEvent.SEND_MESSAGE, newMessage);
  };

  return isAuthenticated ? (
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
                      sender: msg.senderName || "",
                      direction:
                        msg.senderId === Number(userId!)
                          ? "outgoing"
                          : "incoming",
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
  ) : null;
};

export default FloatingChatWidget;
