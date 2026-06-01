'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from './theme-toggle'
import { getAPIClient } from '@/lib/api/client'
import { useEffect, useState } from 'react'

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const token = getAPIClient().getToken()
    setIsAdmin(!!token)
  }, [])

  const handleLogout = () => {
    getAPIClient().clearToken()
    setIsAdmin(false)
    router.push('/admin/login')
  }

  const isAdminPage = pathname.startsWith('/admin')

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/90 backdrop-blur-md supports-backdrop-filter:bg-background/80">
      <div className="flex h-16 max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 items-center justify-between gap-6">
        <div className="flex items-center gap-8">
          <button
            onClick={() => router.push('/')}
            className="font-display font-bold text-xl md:text-2xl text-primary hover:text-accent transition-colors duration-300 tracking-wide"
          >
            MadaLaws
          </button>
          <nav className=" md:flex gap-1">
            <Button
              variant={!isAdminPage ? 'default' : 'ghost'}
              onClick={() => router.push('/')}
              className="h-9 px-4 font-medium tracking-wide"
            >
              Accueil
            </Button>
            <Button
              variant={pathname === '/explorer' ? 'default' : 'ghost'}
              onClick={() => router.push('/explorer')}
              className="h-9 px-4 font-medium tracking-wide"
            >
              Explorer
            </Button>
            <Button
              variant={pathname === '/favorites' ? 'default' : 'ghost'}
              onClick={() => router.push('/favorites')}
              className="h-9 px-4 font-medium tracking-wide"
            >
              Favoris
            </Button>
          </nav>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <ThemeToggle />
          {isAdmin ? (
            <Button variant="outline" size="sm" onClick={handleLogout} className="font-medium tracking-wide border-border/60 hover:border-accent/50">
              Déconnexion
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={() => router.push('/admin/login')} className="font-medium tracking-wide border-border/60 hover:border-accent/50">
              Admin
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
