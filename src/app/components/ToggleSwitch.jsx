'use client'
import { useState } from 'react'

export default function ToggleSwitch({ name, label }) {
  const [on, setOn] = useState(false)

  return (
    <div className="flex items-center justify-between">
      <label className="text-white text-[12px]">{label}</label>
      <input type="hidden" name={name} value={on ? 'true' : ''} />
      <button
        type="button"
        onClick={() => setOn(!on)}
        className={`w-10 h-5 rounded-full border-2 border-[#53DDFC] flex items-center px-0.5 transition-all duration-300 ${on ? 'justify-end bg-transparent' : 'justify-start bg-transparent'}`}
      >
        <span className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${on ? 'bg-[#53DDFC]' : 'bg-gray-500'}`} />
      </button>
    </div>
  )
}
