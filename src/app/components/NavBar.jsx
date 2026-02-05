export default function NavBar() {
  return (
    <nav style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px' }}>
      <div>
        <h2>3S Bus Booking</h2>
      </div>
      <div>
        <a href="/3s" style={{ margin: '0 10px' }}>Home</a>
        <a href="/3s/login" style={{ margin: '0 10px' }}>Login</a>
        <a href="/3s/register" style={{ margin: '0 10px' }}>Register</a>
      </div>
    </nav>
  );
}