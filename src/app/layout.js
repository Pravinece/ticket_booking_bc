import "./globals.css";

export const metadata = {
  title: "3S Bus Booking",
  description: "Book your bus tickets online",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="liquid-blob liquid-blob-1"></div>
        <div className="liquid-blob liquid-blob-2"></div>
        <div className="liquid-blob liquid-blob-3"></div>
        {children}
      </body>
    </html>
  );
}