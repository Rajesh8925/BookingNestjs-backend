// src/utils/socket.ts
import ioClient from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

const socket = ioClient(SOCKET_URL, {
  autoConnect: true,
});

export default socket;
