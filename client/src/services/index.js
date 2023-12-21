import { io } from "socket.io-client";

export const SOCKET = io('http://localhost:5000', {
   // autoConnect: false,
   // transports: ['polling'],
   // upgrade: false
});