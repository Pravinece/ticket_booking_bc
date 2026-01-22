import http from "http";
import { initSocket } from '../app/lib/socket.js'

try {
    const server = http.createServer();
    initSocket(server);
    
    server.listen(3001, () => {
        console.log("Socket server running on port 3001");
    });
} catch (err) {
    console.log(err);
}
