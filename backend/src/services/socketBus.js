let ioInstance = null;

export function setSocketServer(io) {
  ioInstance = io;
}

export function emitLive(event, payload) {
  if (ioInstance) ioInstance.emit(event, payload);
}
