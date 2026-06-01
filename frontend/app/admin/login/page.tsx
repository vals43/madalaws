'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLoginAdmin } from '@/lib/api/hooks'
import { getAPIClient, initializeAPIClient } from '@/lib/api/client'
import { Loader2 } from 'lucide-react'
import { Header } from '@/components/header'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const loginMutation = useLoginAdmin()

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
    setIsLoading(true)

    try {
      const response = await loginMutation.mutateAsync({ email, password })
      getAPIClient().setToken(response.token)
      router.push('/admin/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur de connexion')
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
            <h1 className="font-serif text-3xl font-bold">Connexion Admin</h1>
            <p className="text-muted-foreground">
              Accédez au tableau de bord d&apos;administration
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

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Connexion...
                </>
              ) : (
                'Se connecter'
              )}
            </Button>
          </form>

          <div className="border-t border-border pt-4 text-center text-sm">
            <p className="text-muted-foreground">
              Pas encore de compte ?{' '}
              <button
                onClick={() => router.push('/admin/register')}
                className="text-primary hover:underline"
              >
                S&apos;inscrire
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
