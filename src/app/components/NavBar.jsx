'use client'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export default function NavBar() {
  const pathname = usePathname()

  const links = [
    { href: '/3s', label: 'Home' },
    { href: '/3s/login', label: 'Login' },
    { href: '/3s/register', label: 'Register' },
  ]

  return (
    <nav className="w-full h-14 flex items-center justify-between px-6">
      <a href="/3s" className="flex items-center gap-2 group">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:scale-110 transition-transform duration-300">
          3S
        </div>
        <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
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
                : "text-muted-foreground hover:text-foreground hover:bg-white/50"
            )}
          >
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  )
}