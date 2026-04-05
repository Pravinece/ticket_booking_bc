import React from 'react'

function Background() {
  return (
    <div className='w-full h-full relative -z-10'>
        <div className='w-75 h-80 bg-[#ba9eff95]  opacity-50 absolute top-[-20%] right-[-5%] rounded-full'></div>
        <div className='w-75 h-80 bg-[#53DDFC] opacity-50 absolute bottom-[0%] left-0 rounded-full'></div>
    </div>
  )
}

export default Background