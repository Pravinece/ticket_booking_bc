'use client'
import { useRef } from 'react'
import { cn } from '@/lib/utils'

export default function DateInput({ className, ...props }) {
  const ref = useRef(null)

  return (
    <input
      ref={ref}
      type="date"
      onClick={() => ref.current?.showPicker()}
      className={cn(
        "flex h-10 w-full rounded-xl border border-input bg-background/60 backdrop-blur-sm px-4 py-2 text-sm shadow-sm transition-all duration-300 placeholder:text-[#DEE5FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer [&::-webkit-calendar-picker-indicator]:brightness-0 [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-80 [&::-webkit-calendar-picker-indicator]:cursor-pointer",
        className
      )}
      {...props}
    />
  )
}
