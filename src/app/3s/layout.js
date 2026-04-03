import NavBar from '../components/NavBar';

export default function Layout({ children }) {
  return (
    <div className="w-screen h-screen flex flex-col">
      <div className="w-full glass border-b border-white/20 shadow-lg sticky top-0 z-50">
        <NavBar />
      </div>
      <div className="flex-1 overflow-auto">
        <div className="page-enter">
          {children}
        </div>
      </div>
    </div>
  );
}