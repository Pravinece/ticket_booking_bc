import { Server } from "socket.io";

let io;

export function initSocket(server) {
    if (!io) {
        io = new Server(server, {
            cors: {
                origin: "*",
            },
        });

        io.on("connection", (socket) => {
            console.log("Socket connected:", socket.id);

            socket.on("joinBus", (busId) => {
                socket.join(`bus_${busId}`);
                console.log(`Joined room bus_${busId}`);
            });

            socket.on("seat", (data) => {
                const { busId, seatId, status } = data;
                console.log("Seat event:", data);

                socket.to(`bus_${busId}`).emit("seat:update", {
                    seatId,
                    status
                });
            });

            socket.on("booking:success", ({ busId, seatIds, bookingId }) => {
                io.to(`bus_${busId}`).emit("seat:booked", {
                    seatIds,
                    bookingId
                });
            });


            socket.on("disconnect", () => {
                console.log("Socket disconnected:", socket.id);
            });
        });
    }

    return io;
}

export function getIO() {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }
    return io;
}
