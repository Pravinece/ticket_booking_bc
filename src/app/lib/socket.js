import { Server } from "socket.io";
import pool from "./db.js";

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

            socket.on("joinBus", async ({ busId, date }) => {
                socket.join(`bus_${busId}_${date}`);
                console.log(`Joined room bus_${busId}_${date}`);

                try {
                    const bus = await pool.query("SELECT * FROM buses WHERE id = $1", [busId]);
                    const seats = await pool.query(
                        "SELECT * FROM seats WHERE bus_id = $1 AND booked_date = $2",
                        [busId, date]
                    );

                    const capacity = bus.rows[0].capacity;
                    const bookedSeats = seats.rows.map(s => s.seat_number);
                    
                    const allSeats = Array.from({ length: capacity }, (_, i) => ({
                        seat_number: i + 1,
                        status: bookedSeats.includes(i + 1) ? 'booked' : 'open'
                    }));

                    socket.emit("seats:data", { bus: bus.rows[0], seats: allSeats });
                } catch (error) {
                    socket.emit("seats:error", { message: error.message });
                }
            });

            socket.on("seat:update", async ({ busId, date, seatNumber, status }) => {
                try {
                    if (status === 'booked') {
                        await pool.query(
                            `INSERT INTO seats (bus_id, seat_number, status, booked_date) 
                             VALUES ($1, $2, $3, $4)`,
                            [busId, seatNumber, status, date]
                        );
                    }
                    io.to(`bus_${busId}_${date}`).emit("seat:changed", { seatNumber, status });
                } catch (error) {
                    socket.emit("seat:error", { message: error.message });
                }
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
