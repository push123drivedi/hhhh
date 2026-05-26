import { io } from "socket.io-client";

let socket;

export function getSocket() {
  if (!socket) {
    socket = io(
      import.meta.env.VITE_SOCKET_URL ||
      "https://svms-duty-backend.onrender.com",
      {
        auth: {
          token: localStorage.getItem("token")
        },
        autoConnect: false
      }
    );
  }

  return socket;
}
