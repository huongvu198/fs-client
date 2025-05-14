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

  useEffect(() => {
    const socket = io(url, {
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Socket.IO connected:", socket.id);
    });

    Object.entries(handlers).forEach(([event, handler]) => {
      if (handler) socket.on(event, handler);
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
        console.log(`📥 Server acknowledged event ${event}:`, response);
        callback?.(response);
      });
    } else {
      console.warn("⚠️ Socket chưa kết nối. Không thể gửi dữ liệu.");
    }
  };

  return { sendMessage };
};

export default useSocket;
