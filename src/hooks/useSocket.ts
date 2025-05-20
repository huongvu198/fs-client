import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { config } from "@config/appConfig";
import { getUserIdFromToken } from "../shared/common";
import { getAccessToken } from "@config/accessToken";
import { SocketEvent } from "shared/enum";

type EventCallback = (data: any) => void;
const { socketURL } = config.server;

const useSocket = (handlers: Partial<Record<SocketEvent, EventCallback>>) => {
  const socketRef = useRef<Socket | null>(null);
  const handlersRef = useRef(handlers);

  const accessToken = getAccessToken();
  const userId = getUserIdFromToken(accessToken!);

  // Cập nhật handler mỗi khi thay đổi
  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  // Khởi tạo kết nối socket chỉ 1 lần
  useEffect(() => {
    const socket = io(socketURL, {
      transports: ["websocket"],
      query: { userId },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Socket.IO connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket.IO disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, [socketURL, userId]);

  // Đăng ký và huỷ listener mỗi khi handlers thay đổi
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const entries = Object.entries(handlers) as [SocketEvent, EventCallback][];

    for (const [eventName, handler] of entries) {
      socket.on(eventName, handler);
    }

    return () => {
      for (const [eventName, handler] of entries) {
        socket.off(eventName, handler);
      }
    };
  }, [handlers]);

  const sendMessage = (
    event: SocketEvent,
    data: any,
    callback?: (response: any) => void
  ) => {
    const socket = socketRef.current;
    if (socket?.connected) {
      socket.emit(event, data, (response: any) => {
        callback?.(response);
      });
    } else {
      console.warn("⚠️ Socket chưa kết nối. Không thể gửi dữ liệu.");
    }
  };

  return { sendMessage };
};

export default useSocket;
