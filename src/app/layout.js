import "./globals.css";

export const metadata = {
  title: "Bus Booking",
  description: "Book your bus tickets online",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}