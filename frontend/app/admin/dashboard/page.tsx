'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { useCodes, useBooks, useChapters, useArticles } from '@/lib/api/hooks'
import { getAPIClient, initializeAPIClient } from '@/lib/api/client'
import { Loader2, Plus } from 'lucide-react'

export default function AdminDashboardPage() {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [initialized, setInitialized] = useState(false)

  const { data: codes, isLoading: codesLoading } = useCodes()
  const { data: books, isLoading: booksLoading } = useBooks()
  const { data: chapters, isLoading: chaptersLoading } = useChapters()
  const { data: articles, isLoading: articlesLoading } = useArticles()

  useEffect(() => {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api'
    initializeAPIClient(baseURL)

    const token = getAPIClient().getToken()
    if (!token) {
      router.push('/admin/login')
    } else {
      setIsAuthorized(true)
    }
    setInitialized(true)
  }, [router])

  if (!initialized || !isAuthorized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const stats = [
    {
      label: 'Codes',
      value: codes?.length || 0,
      loading: codesLoading,
      action: () => router.push('/admin/hierarchy/codes'),
    },
    {
      label: 'Livres',
      value: books?.length || 0,
      loading: booksLoading,
      action: () => router.push('/admin/hierarchy/books'),
    },
    {
      label: 'Chapitres',
      value: chapters?.length || 0,
      loading: chaptersLoading,
      action: () => router.push('/admin/hierarchy/chapters'),
    },
    {
      label: 'Articles',
      value: articles?.length || 0,
      loading: articlesLoading,
      action: () => router.push('/admin/hierarchy/articles'),
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div>
            <h1 className="font-serif text-3xl font-bold mb-2">Tableau de Bord Admin</h1>
            <p className="text-muted-foreground">
              Gérez la structure hiérarchique complète des lois de Madagascar
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="border border-border rounded-lg p-6 space-y-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={stat.action}
              >
                <h3 className="font-serif font-bold text-sm text-muted-foreground">
                  {stat.label}
                </h3>
                <div className="flex items-baseline gap-2">
                  {stat.loading ? (
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  ) : (
                    <span className="text-3xl font-bold text-primary">{stat.value}</span>
                  )}
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Gérer
                </Button>
              </div>
            ))}
          </div>

          {/* Actions Section */}
          <div className="border-t border-border pt-8 space-y-4">
            <h2 className="font-serif text-2xl font-bold">Actions Rapides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={() => router.push('/admin/hierarchy/codes/new')}
                className="justify-start"
                size="lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un Code
              </Button>
              <Button
                onClick={() => router.push('/admin/hierarchy/books/new')}
                variant="outline"
                className="justify-start"
                size="lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un Livre
              </Button>
              <Button
                onClick={() => router.push('/admin/hierarchy/chapters/new')}
                variant="outline"
                className="justify-start"
                size="lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un Chapitre
              </Button>
              <Button
                onClick={() => router.push('/admin/hierarchy/articles/new')}
                variant="outline"
                className="justify-start"
                size="lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un Article
              </Button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="border-t border-border pt-8">
            <h2 className="font-serif text-2xl font-bold mb-4">Vue d&apos;ensemble</h2>
            <div className="border border-border rounded-lg p-6 text-center text-muted-foreground">
              <p>Accédez à la gestion complète de la hiérarchie depuis le menu ci-dessus</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
