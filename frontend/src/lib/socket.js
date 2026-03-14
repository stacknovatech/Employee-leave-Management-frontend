import { io } from "socket.io-client";

let socket = null;

/**
 * Initialize the socket connection (singleton)
 * @param {string} token JWT token used for authentication
 * @returns {import('socket.io-client').Socket}
 */
export function initSocket(token) {
  // if we already have a connected socket, reuse it
  if (socket && socket.connected) return socket;

  // if there is an old socket that is disconnected, clean it up
  if (socket && !socket.connected) {
    socket = null;
  }

  socket = io("/", {
    auth: { token },
    // path may be configured if backend is mounted under /socket.io by proxy
  });
  return socket;
}

export function getSocket() {
  return socket;
}

/**
 * Disconnect and clear the socket instance so that a fresh connection can be
 * established later (for example, on logout/login).
 */
export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
