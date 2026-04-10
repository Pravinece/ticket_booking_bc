'use client'
import React, { useState } from 'react'
import { createBooking } from '@/app/actions/booking'
import { generateTicketPDF } from '@/app/components/TicketPDF'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Armchair } from 'lucide-react'
import ObjectLoader from './ObjectLoader'

function SeatsClient({ bus, seats: initialSeats, busId, date }) {
    const [seats] = useState(initialSeats)
    const [selected, setSelected] = useState([])
    const [passengerDetails, setPassengerDetails] = useState([])
    const [bookingStatus, setBookingStatus] = useState(null)
    const [processing, setProcessing] = useState(false)
    const [viewBus, setViewBus] = useState(false)

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
          return existing || { seatNumber: num, name: '', age: '', gender: '', mobile: '' }
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
      const isValid = passengerDetails.every(p => p.name.trim() && p.age && p.gender && p.mobile.trim())
      if (!isValid) { alert('Please fill all passenger details'); return }

      setProcessing(true)

      try {
        const result = await createBooking({
          busId, journeyDate: date,
          seats: passengerDetails.map(p => ({ number: p.seatNumber, name: p.name, age: p.age, gender: p.gender, mobile: p.mobile })),
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
      booked: 'bg-white/10 text-white/10 cursor-not-allowed',
      selected: 'bg-[#BA9EFF] text-white shadow-lg shadow-[#BA9EFF] scale-105',
      available: 'border-[#53DDFC] bg-white/10 hover:bg-green-100 hover:scale-105 cursor-pointer'
    }

  return (
    <>
    {/* Success Modal */}
    {bookingStatus?.success && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[2000]">
        <Card className="glass p-8 text-center max-w-sm mx-4 bg-amber-50">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
          <p className="text-muted-foreground mb-1">Booking ID:</p>
          <p className="font-mono text-sm bg-muted p-2 rounded-lg mb-4">{bookingStatus.bookingId}</p>
          <p className="text-muted-foreground text-sm mb-4">Amount Paid: ₹{totalAmount}</p>
          <div className="flex flex-col gap-3">
            <Button onClick={handleDownloadTicket} size="lg" className="w-full">
              📄 Download Ticket PDF
            </Button>
            <Button onClick={() => window.location.href = '/3s'} variant="outline" size="lg" className="w-full text-[#DEE5FF]">
              Back to Home
            </Button>
          </div>
        </Card>
      </div>
    )}

    {!viewBus ? <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6 flex">
        <div className='flex flex-col gap-1'>
        <a href="/3s/bus" className="text-sm text-[#DEE5FF] hover:text-white transition-colors ">← Back to Buses</a>
        <h1 className="text-2xl font-bold mt-1 bg-[#DEE5FF] bg-clip-text text-transparent">
          Select Your Space
        </h1>
        </div>
        <div className='ml-auto'>
          <Button className="btn" onClick={()=>{setViewBus(true)}}>View Bus Seats</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6 w-full">
        <div className=''>
          <div className="flex flex-wrap gap-4 mb-4">
            {[
              { color: 'bg-white/10 border-1 border-[#53DDFC]', label: 'Available' },
              { color: 'bg-[#BA9EFF] border-1 border-[#BA9EFF]', label: 'Selected' },
              { color: 'bg-white/10 border-1 border-white/10', label: 'Booked' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2">
                <div className={cn("w-5 h-5 rounded-md", item.color)}></div>
                <span className="text-[10px] text-white">{item.label}</span>
              </div>
            ))}
          </div>

          <Card className="glass-card p-6">
            <div className="flex flex-wrap gap-4 justify-center">
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
                    <span className='flex flex-col items-center text-[10px]'><Armchair className='w-[18px]'/> {seat.seat_number}</span>
                    
                  </div>
                )
              })}
            </div>
          </Card>
        </div>

        {/* Right: Passenger Details */}
        <div className=' p-4 m-2'>
          <h3 className="font-semibold mb-4 text-[#53DDFC]">
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
            <div className="space-y-4 h-full flex flex-col justify-evenly">
            <div className=" glass-card space-y-4 h-85 overflow-y-auto">
              {passengerDetails.map((passenger, index) => (
                <div key={passenger.seatNumber} className=" text-[#DEE5FF]">
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-green-500 text-white flex items-center justify-center text-sm font-bold">
                        {passenger.seatNumber}
                      </span>
                      <span className="text-sm font-medium">Seat {passenger.seatNumber}</span>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[#53DDFC]">Name</Label>
                      <Input
                        type="text"
                        value={passenger.name}
                        onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                        placeholder="Passenger name"
                        className="text-[#53DDFC] border-white  focus:border-white"
                      />
                    </div>
                    <div className="flex gap-4">
                      <div className="flex flex-col space-y-1 w-1/3">
                        <Label>Age</Label>
                        <Input
                          type="number"
                          value={passenger.age}
                          onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
                          placeholder="Age"
                          className="text-[#53DDFC] border-white  focus:border-white"
                        />
                      </div>
                      <div className="flex flex-col space-y-1 w-2/3">
                        <Label>Gender</Label>
                        <div className="flex items-center gap-4 h-9">
                          {['Male', 'Female', 'Other'].map((g) => (
                            <label key={g} className="flex items-center gap-1.5 cursor-pointer text-[12px] text-white">
                              <span
                                onClick={() => handlePassengerChange(index, 'gender', g)}
                                className={`w-4 h-4 rounded-full border-2 border-[#53DDFC] flex items-center justify-center transition-all duration-200`}
                              >
                                {passenger.gender === g && <span className="w-2 h-2 rounded-full bg-[#53DDFC]" />}
                              </span>
                              {g}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label >Mobile</Label>
                      <Input
                        type="tel"
                        value={passenger.mobile}
                        onChange={(e) => handlePassengerChange(index, 'mobile', e.target.value)}
                        placeholder="Mobile number"
                        className="text-[#53DDFC] border-white  focus:border-white"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Summary & Pay */}
              <div className="bg-blue-950/30 rounded-3xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-[#DEE5FF]">Total Amount</p>
                    <p className="text-2xl font-bold text-[#53DDFC]">₹{totalAmount}</p>
                  </div>
                  <p className="text-sm text-[#DEE5FF]">{selected.length} × ₹{bus.fare}</p>
                </div>
                <Button onClick={handleBookAndPay} size="lg" className="w-full btn" disabled={processing}>
                  {processing ? 'Processing...' : `Proceed to Pay`}
                </Button>
              </div>
            </div>

            <div className="text-center text-sm text-[#DEE5FF] mt-4 w-full h-28 flex items-center justify-center border border-[#DEE5FF]/20 rounded-lg overflow-hidden">
              <img src="/bus1.jpeg" alt="" className='w-full h-full object-cover object-[50%_40%]'/>
            </div>
            </div>
          )}
        </div>
      </div>
    </div> : <ObjectLoader seats={seats} setViewBus={()=>{setViewBus(!viewBus)}}/>}
    </>
  )
}

export default SeatsClient