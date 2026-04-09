'use client'
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 10, fontFamily: 'Helvetica' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, borderBottom: '2px solid #1a56db', paddingBottom: 10 },
  logo: { fontSize: 22, fontWeight: 'bold', color: '#1a56db' },
  subLogo: { fontSize: 8, color: '#6b7280' },
  ticketId: { fontSize: 8, color: '#6b7280', textAlign: 'right' },
  
  routeBox: { backgroundColor: '#eff6ff', borderRadius: 6, padding: 12, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  city: { fontSize: 16, fontWeight: 'bold', color: '#1e3a5f' },
  arrow: { fontSize: 14, color: '#1a56db' },
  dateBox: { textAlign: 'center' },
  dateText: { fontSize: 12, fontWeight: 'bold', color: '#1a56db' },
  dateLabel: { fontSize: 7, color: '#6b7280', marginTop: 2 },

  busInfo: { backgroundColor: '#f9fafb', borderRadius: 6, padding: 10, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between' },
  busLabel: { fontSize: 7, color: '#6b7280', marginBottom: 2 },
  busValue: { fontSize: 10, fontWeight: 'bold' },

  sectionTitle: { fontSize: 11, fontWeight: 'bold', color: '#1e3a5f', marginBottom: 8, marginTop: 5 },
  
  tableHeader: { flexDirection: 'row', backgroundColor: '#1a56db', borderRadius: 4, padding: 6, marginBottom: 4 },
  tableHeaderText: { color: 'white', fontSize: 8, fontWeight: 'bold' },
  tableRow: { flexDirection: 'row', padding: 6, borderBottom: '1px solid #e5e7eb' },
  tableRowAlt: { flexDirection: 'row', padding: 6, borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' },
  col1: { width: '15%' },
  col2: { width: '40%' },
  col3: { width: '25%' },
  col4: { width: '20%', textAlign: 'right' },

  totalBox: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#1a56db', borderRadius: 6, padding: 10, marginTop: 8, marginBottom: 15 },
  totalLabel: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  totalAmount: { color: 'white', fontSize: 14, fontWeight: 'bold' },

  paymentBadge: { backgroundColor: '#dcfce7', borderRadius: 4, padding: '4 8', alignSelf: 'flex-start', marginBottom: 12 },
  paymentText: { color: '#166534', fontSize: 8, fontWeight: 'bold' },

  instructionBox: { marginTop: 10, marginBottom: 8 },
  instructionTitle: { fontSize: 9, fontWeight: 'bold', color: '#1e3a5f', marginBottom: 5 },
  instruction: { fontSize: 7.5, color: '#374151', marginBottom: 3, lineHeight: 1.4 },
  bullet: { fontSize: 7.5, color: '#374151', marginBottom: 2.5, paddingLeft: 8, lineHeight: 1.4 },

  disclaimerBox: { marginTop: 8, borderTop: '1px solid #e5e7eb', paddingTop: 8 },
  disclaimerTitle: { fontSize: 8, fontWeight: 'bold', color: '#dc2626', marginBottom: 4 },
  disclaimer: { fontSize: 6.5, color: '#6b7280', lineHeight: 1.4, marginBottom: 2 },

  footer: { position: 'absolute', bottom: 20, left: 30, right: 30, borderTop: '1px solid #e5e7eb', paddingTop: 8, flexDirection: 'row', justifyContent: 'space-between' },
  footerText: { fontSize: 6.5, color: '#9ca3af' },
})

function TicketPDF({ booking }) {
  const { bus, date, passengers, totalAmount, bookingId } = booking
  const bookingDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  const journeyDate = new Date(date).toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>3S Bus Booking</Text>
            <Text style={styles.subLogo}>Your Trusted Travel Partner</Text>
          </View>
          <View>
            <Text style={styles.ticketId}>Booking ID: {bookingId}</Text>
            <Text style={styles.ticketId}>Booked on: {bookingDate}</Text>
            <View style={styles.paymentBadge}>
              <Text style={styles.paymentText}>✓ CONFIRMED</Text>
            </View>
          </View>
        </View>

        {/* Route */}
        <View style={styles.routeBox}>
          <View>
            <Text style={styles.busLabel}>FROM</Text>
            <Text style={styles.city}>{bus.source?.charAt(0).toUpperCase() + bus.source?.slice(1)}</Text>
          </View>
          <Text style={styles.arrow}>→</Text>
          <View>
            <Text style={styles.busLabel}>TO</Text>
            <Text style={styles.city}>{bus.destination?.charAt(0).toUpperCase() + bus.destination?.slice(1)}</Text>
          </View>
          <View style={styles.dateBox}>
            <Text style={styles.dateText}>{journeyDate}</Text>
            <Text style={styles.dateLabel}>Journey Date</Text>
          </View>
        </View>

        {/* Bus Info */}
        <View style={styles.busInfo}>
          <View>
            <Text style={styles.busLabel}>BUS NAME</Text>
            <Text style={styles.busValue}>{bus.bus_name}</Text>
          </View>
          <View>
            <Text style={styles.busLabel}>BUS NUMBER</Text>
            <Text style={styles.busValue}>{bus.bus_number}</Text>
          </View>
          <View>
            <Text style={styles.busLabel}>TOTAL SEATS</Text>
            <Text style={styles.busValue}>{passengers.length}</Text>
          </View>
          <View>
            <Text style={styles.busLabel}>SEAT NOS</Text>
            <Text style={styles.busValue}>{passengers.map(p => p.seatNumber).join(', ')}</Text>
          </View>
        </View>

        {/* Passenger Details */}
        <Text style={styles.sectionTitle}>Passenger Details</Text>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, styles.col1]}>Seat</Text>
          <Text style={[styles.tableHeaderText, styles.col2]}>Passenger Name</Text>
          <Text style={[styles.tableHeaderText, styles.col3]}>Mobile</Text>
          <Text style={[styles.tableHeaderText, styles.col4]}>Fare</Text>
        </View>
        {passengers.map((p, i) => (
          <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
            <Text style={styles.col1}>{p.seatNumber}</Text>
            <Text style={styles.col2}>{p.name}</Text>
            <Text style={styles.col3}>{p.mobile}</Text>
            <Text style={styles.col4}>₹{bus.fare}</Text>
          </View>
        ))}

        {/* Total */}
        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>Total Amount Paid</Text>
          <Text style={styles.totalAmount}>₹{totalAmount}</Text>
        </View>

        {/* Instructions */}
        <View style={styles.instructionBox}>
          <Text style={styles.instructionTitle}>Important Instructions for Passengers:</Text>
          <Text style={styles.bullet}>• Passengers are requested to arrive at the boarding point at least 15 minutes before the scheduled departure time.</Text>
          <Text style={styles.bullet}>• Carry a valid photo ID (Aadhaar Card / Driving License / Passport) along with this e-ticket during the journey.</Text>
          <Text style={styles.bullet}>• This e-ticket is non-transferable. The name on the ticket should match the ID proof of the passenger.</Text>
          <Text style={styles.bullet}>• Children above the age of 5 years will need a separate ticket. Infants can travel on the lap of an adult without a ticket.</Text>
          <Text style={styles.bullet}>• Carrying inflammable goods, alcohol, or any illegal substances on the bus is strictly prohibited.</Text>
          <Text style={styles.bullet}>• The bus operator reserves the right to change the type of bus, departure time, or route due to unforeseen circumstances.</Text>
          <Text style={styles.bullet}>• Luggage allowance: 1 bag (max 15 kg) per passenger. Additional luggage may be charged extra by the operator.</Text>
          <Text style={styles.bullet}>• In case of cancellation, refund will be processed as per the cancellation policy applicable at the time of booking.</Text>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerTitle}>Disclaimer:</Text>
          <Text style={styles.disclaimer}>3S Bus Booking is an intermediary platform that connects bus operators with passengers. The bus service is provided by the respective bus operator and 3S Bus Booking shall not be held liable for any delay, cancellation, or inconvenience caused during the journey. The operator is solely responsible for the quality of service, safety, and adherence to schedules. By booking this ticket, you agree to the terms and conditions of both 3S Bus Booking and the bus operator. All disputes are subject to the jurisdiction of courts in Tamil Nadu, India. For grievances, contact support@3sbusbooking.com within 7 days of the journey date. GST and service charges are included in the fare displayed.</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>3S Bus Booking | www.3sbusbooking.com | support@3sbusbooking.com</Text>
          <Text style={styles.footerText}>This is a computer-generated ticket and does not require a signature.</Text>
        </View>
      </Page>
    </Document>
  )
}

export async function generateTicketPDF(booking) {
  const blob = await pdf(<TicketPDF booking={booking} />).toBlob()
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `3S_Ticket_${booking.bookingId}.pdf`
  link.click()
  URL.revokeObjectURL(url)
}

export default TicketPDF