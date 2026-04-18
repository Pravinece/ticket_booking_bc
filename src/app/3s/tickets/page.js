import { getUserBookings } from '@/app/actions/booking';
import React from 'react'

export default async function TicketsPage() {

    const tickets = await getUserBookings();

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <a href="/3s" className="text-sm text-[#DEE5FF] hover:text-white transition-colors">← Back to Home</a>
                    <h1 className="text-2xl font-bold mt-1 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Tickets
                    </h1>
                </div>
            </div>

            <div className="flex justify-center">
                <div className="glass-card grid gap-4 w-[78%] h-[calc(100vh-220px)] overflow-y-auto m-auto p-6">
                    {tickets.length === 0 ? (
                        <p className="text-center text-white mt-10">No tickets booked yet.</p>
                    ) : (
                        tickets?.map(ticket => {
                            return (
                            <div key={ticket._id} className="p-4 border rounded-lg shadow-sm glass-card w-[95%] h-24 mx-auto">
                                <h2 className="text-lg font-semibold mb-2 text-[#53DDFC]">Total Seats: {ticket.total_seats}</h2>
                                <p className="text-sm text-white mb-1">Journey Date: {new Date(ticket.journey_date).toLocaleDateString()}</p>
                            </div>)
                        })
                    )}
                </div>
            </div>
        </div>
    )
}