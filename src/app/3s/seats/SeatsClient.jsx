'use client'
import React, { useState } from 'react'
import { createBooking } from '@/app/actions/booking'
import { generateTicketPDF } from '@/app/components/TicketPDF'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

function SeatsClient({ bus, seats: initialSeats, busId, date }) {
    const [seats] = useState(initialSeats)
    const [selected, setSelected] = useState([])
    const [passengerDetails, setPassengerDetails] = useState([])
    const [bookingStatus, setBookingStatus] = useState(null)
    const [processing, setProcessing] = useState(false)

    const totalAmount = selected.length * bus.fare

    const toggleSeat = (seatNum) => {
      const seat = seats.find(s => s.seat_number === seatNum)
      if (seat?.status === 'booked') return

      setSelected(prev => {
        const newSelected = prev.includes(seatNum)
          ? prev.filter(s => s !== seatNum)
          : [...prev, seatNum]

        const newDetails = newSelected.map(num => {
          const existing = passengerDetails.find(p => p.seatNumber === num)
          return existing || { seatNumber: num, name: '', mobile: '' }
        })
        setPassengerDetails(newDetails)
        return newSelected
      })
    }

    const handlePassengerChange = (index, field, value) => {
      setPassengerDetails(prev => prev.map((p, i) => i === index ? { ...p, [field]: value } : p))
    }

    const handleBookAndPay = async () => {
      if (selected.length === 0) { alert('Please select at least one seat'); return }
      const isValid = passengerDetails.every(p => p.name.trim() && p.mobile.trim())
      if (!isValid) { alert('Please fill all passenger details'); return }

      setProcessing(true)

      try {
        const result = await createBooking({
          busId, journeyDate: date,
          seats: passengerDetails.map(p => ({ number: p.seatNumber, name: p.name, mobile: p.mobile })),
          totalAmount
        })

        if (result.error) { alert('Booking failed: ' + result.error); setProcessing(false); return }

        setBookingStatus({ success: true, bookingId: result.bookingId })
      } catch (error) {
        alert('Booking failed')
      }
      setProcessing(false)
    }

    const handleDownloadTicket = async () => {
      await generateTicketPDF({
        bus,
        date,
        passengers: passengerDetails,
        totalAmount,
        bookingId: bookingStatus.bookingId
      })
    }

    const seatColors = {
      booked: 'bg-red-400/80 text-white cursor-not-allowed',
      selected: 'bg-green-500 text-white shadow-lg shadow-green-500/30 scale-105',
      available: 'bg-white/70 hover:bg-blue-100 hover:scale-105 cursor-pointer'
    }

  return (
    <>
    {/* Success Modal */}
    {bookingStatus?.success && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[2000]">
        <Card className="glass p-8 text-center max-w-sm mx-4">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
          <p className="text-muted-foreground mb-1">Booking ID:</p>
          <p className="font-mono text-sm bg-muted p-2 rounded-lg mb-4">{bookingStatus.bookingId}</p>
          <p className="text-muted-foreground text-sm mb-4">Amount Paid: ₹{totalAmount}</p>
          <div className="flex flex-col gap-3">
            <Button onClick={handleDownloadTicket} size="lg" className="w-full">
              📄 Download Ticket PDF
            </Button>
            <Button onClick={() => window.location.href = '/3s'} variant="outline" size="lg" className="w-full">
              Back to Home
            </Button>
          </div>
        </Card>
      </div>
    )}

    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <a href="/3s/bus" className="text-sm text-muted-foreground hover:text-foreground transition-colors">← Back to Buses</a>
        <h1 className="text-2xl font-bold mt-1 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Select Seats
        </h1>
      </div>

      {/* Bus Info */}
      <Card className="glass liquid-card mb-6">
        <CardContent className="p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">{bus.bus_name}</h2>
            <p className="text-sm text-muted-foreground">Bus No: {bus.bus_number}</p>
          </div>
          <div className="flex gap-3">
            <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">📅 {date}</span>
            <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">₹{bus.fare}/seat</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Seats */}
        <div>
          <div className="flex flex-wrap gap-4 mb-4">
            {[
              { color: 'bg-white/70 border', label: 'Available' },
              { color: 'bg-green-500', label: 'Selected' },
              { color: 'bg-red-400/80', label: 'Booked' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2">
                <div className={cn("w-5 h-5 rounded-md", item.color)}></div>
                <span className="text-sm text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>

          <Card className="glass liquid-card p-6">
            <div className="flex flex-wrap gap-2 justify-center">
              {seats.map(seat => {
                const isBooked = seat.status === 'booked'
                const isSelected = selected.includes(seat.seat_number)
                const status = isBooked ? 'booked' : isSelected ? 'selected' : 'available'

                return (
                  <div
                    key={seat.seat_number}
                    onClick={() => toggleSeat(seat.seat_number)}
                    className={cn(
                      "w-11 h-11 rounded-xl border border-border/50 flex items-center justify-center text-sm font-medium transition-all duration-200",
                      seatColors[status]
                    )}
                  >
                    {seat.seat_number}
                  </div>
                )
              })}
            </div>
          </Card>
        </div>

        {/* Right: Passenger Details */}
        <div>
          <h3 className="font-semibold mb-4">
            {selected.length > 0
              ? `Passenger Details (${selected.length} seat${selected.length > 1 ? 's' : ''})`
              : 'Select seats to continue'
            }
          </h3>

          {selected.length === 0 ? (
            <Card className="glass p-8 text-center">
              <p className="text-muted-foreground">👈 Click on available seats to select them</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {passengerDetails.map((passenger, index) => (
                <Card key={passenger.seatNumber} className="glass liquid-card">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-green-500 text-white flex items-center justify-center text-sm font-bold">
                        {passenger.seatNumber}
                      </span>
                      <span className="text-sm font-medium">Seat {passenger.seatNumber}</span>
                    </div>
                    <div className="space-y-1">
                      <Label>Name</Label>
                      <Input
                        type="text"
                        value={passenger.name}
                        onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                        placeholder="Passenger name"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Mobile</Label>
                      <Input
                        type="tel"
                        value={passenger.mobile}
                        onChange={(e) => handlePassengerChange(index, 'mobile', e.target.value)}
                        placeholder="Mobile number"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Summary & Pay */}
              <Card className="glass p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="text-2xl font-bold">₹{totalAmount}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{selected.length} × ₹{bus.fare}</p>
                </div>
                <Button onClick={handleBookAndPay} size="lg" className="w-full" disabled={processing}>
                  {processing ? 'Processing...' : `Pay ₹${totalAmount} & Book`}
                </Button>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  )
}

export default SeatsClient