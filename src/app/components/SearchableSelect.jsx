'use client'
import { useState, useRef, useEffect } from 'react'

export default function SearchableSelect({ name, placeholder, options }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const filtered = options.filter(o => o.toLowerCase().includes(query.toLowerCase()))

  useEffect(() => {
    const handler = (e) => { if (!ref.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative w-full">
      <input type="hidden" name={name} value={query} />
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
        className="w-full bg-transparent border border-[#53DDFC] text-white placeholder:text-gray-500 focus:outline-none rounded-2xl p-1 indent-4"
        autoComplete="off"
      />
      {open && filtered.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 max-h-48 overflow-y-auto bg-[#192540] border border-[#53DDFC] rounded-xl scrollbar-thin">
          {filtered.map((city) => (
            <li
              key={city}
              onClick={() => { setQuery(city); setOpen(false) }}
              className="px-4 py-2 text-white cursor-pointer hover:bg-[#53DDFC]/20 capitalize"
            >
              {city}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
