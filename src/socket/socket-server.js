import http from "http";
import { initSocket } from "./lib/socket.js";

const server = http.createServer();

initSocket(server);

server.listen(3000, () => {
  console.log("Socket server running on port 3001");
});
