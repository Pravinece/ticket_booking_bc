'use client'
import { redirect, usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export default function NavBar() {
  const pathname = usePathname()
  const links = [
    { href: '/3s', label: 'Home' },
    { href: '/3s/login', label: 'Login' },
    { href: '/3s/register', label: 'Register' },
    { href: '/3s/tickets', label: 'Tickets' },
  ]


  return (
    <nav className="w-full h-full flex items-center justify-between px-6 ">
      <a href="/3s" className="flex items-center gap-2 group">
        <h2 className="text-lg font-bold bg-gradient-to-r from-[#8455EF] to-[#BA9EFF] bg-clip-text text-transparent">
          Bus Booking
        </h2>
      </a>
      <div className="flex items-center gap-1">
        {links.map(link => (
          <a
            key={link.href}
            href={link.href}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300",
              pathname === link.href
                ? "bg-primary text-primary-foreground shadow-lg"
                : "text-white/40 hover:text-white hover:bg-white/50 btn"
            )}
          >
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  )
}