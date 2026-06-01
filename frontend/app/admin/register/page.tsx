'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRegisterAdmin } from '@/lib/api/hooks'
import { getAPIClient, initializeAPIClient } from '@/lib/api/client'
import { Loader2 } from 'lucide-react'
import { Header } from '@/components/header'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const registerMutation = useRegisterAdmin()

  useEffect(() => {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api'
    initializeAPIClient(baseURL)

    // Check if already logged in
    if (getAPIClient().getToken()) {
      router.push('/admin/dashboard')
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    setIsLoading(true)

    try {
      const response = await registerMutation.mutateAsync({ email, password })
      getAPIClient().setToken(response.token)
      router.push('/admin/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur d&apos;inscription')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="border border-border rounded-lg p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="font-serif text-3xl font-bold">Créer un compte Admin</h1>
            <p className="text-muted-foreground">
              Inscrivez-vous pour accéder aux fonctionnalités d&apos;administration
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Mot de passe</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Confirmer le mot de passe</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Inscription...
                </>
              ) : (
                'S&apos;inscrire'
              )}
            </Button>
          </form>

          <div className="border-t border-border pt-4 text-center text-sm">
            <p className="text-muted-foreground">
              Déjà inscrit ?{' '}
              <button
                onClick={() => router.push('/admin/login')}
                className="text-primary hover:underline"
              >
                Se connecter
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
