import Background from '../components/Background';
import NavBar from '../components/NavBar';

export default function Layout({ children }) {
  return (
    <div className="w-screen h-screen flex flex-col relative top-0 left-0">
      <div className='w-full h-full absolute top-0 left-0 -z-10 background'>
        <Background />
      </div>
      <div className='w-screen h-screen z-10'>
        <div className="w-full h-16 backdrop-blur-md bg-[#53DDFC]/20">
          <NavBar />
        </div>
        <div className="w-[100%] h-[calc(100%-4rem)] overflow-hidden backdrop-blur-sm z-10">
          <div className="w-full h-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}