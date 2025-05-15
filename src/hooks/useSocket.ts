// useSocket.ts
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { SocketEvent } from "@constants/const";

type EventCallback = (data: any) => void;

const useSocket = (
  url: string,
  handlers: Partial<Record<SocketEvent, EventCallback>>
) => {
  const socketRef = useRef<Socket | null>(null);
  const handlersRef = useRef(handlers);

  // Cập nhật ref khi handlers thay đổi
  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  useEffect(() => {
    const socket = io(url, { transports: ["websocket"] });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Socket.IO connected:", socket.id);
    });

    Object.keys(handlers).forEach((eventName) => {
        socket.on(eventName, (data: any) => {
          const handler = handlersRef.current[eventName as SocketEvent];
          if (handler) handler(data);
        });
      });
      
    socket.on("disconnect", () => {
      console.log("❌ Socket.IO disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, [url]);

  const sendMessage = (event: SocketEvent, data: any, callback?: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data, (response: any) => {
        callback?.(response);
      });
    } else {
      console.warn("⚠️ Socket chưa kết nối. Không thể gửi dữ liệu.");
    }
  };

  return { sendMessage };
};

export default useSocket;
