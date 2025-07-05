// test-socket.js
import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); // Change port if needed
console.log("Connecting to server...");
socket.on("connect", () => {
  console.log("Connected to server");
});

socket.on('log', (log) => {
  console.log("Received log:", log);
});