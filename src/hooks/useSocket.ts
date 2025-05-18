// useSocket.ts
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

  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  useEffect(() => {
    const socket = io(socketURL, {
      transports: ["websocket"],
      query: { userId },
    });
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
  }, [socketURL]);

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
