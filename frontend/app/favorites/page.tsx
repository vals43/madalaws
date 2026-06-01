'use client'

import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { useArticles } from '@/lib/api/hooks'
import { useState, useEffect } from 'react'
import { Loader2, Trash2 } from 'lucide-react'
import { Article } from '@/lib/types'
import { initializeAPIClient } from '@/lib/api/client'

export default function FavoritesPage() {
  const [initialized, setInitialized] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)

  const { data: articles, isLoading } = useArticles()

  useEffect(() => {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api'
    initializeAPIClient(baseURL)
    setInitialized(true)

    const saved = localStorage.getItem('favorites')
    if (saved) {
      setFavorites(JSON.parse(saved))
    }
  }, [])

  const favoriteArticles = articles?.filter((article: Article) =>
    favorites.includes(article.id)
  ) || []

  const removeFavorite = (articleId: string) => {
    const newFavorites = favorites.filter((id) => id !== articleId)
    setFavorites(newFavorites)
    localStorage.setItem('favorites', JSON.stringify(newFavorites))
    if (selectedArticle?.id === articleId) {
      setSelectedArticle(null)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-serif text-3xl font-bold mb-8">Mes Favoris</h1>

        {!initialized ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : favoriteArticles.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">Vous n&apos;avez pas encore de favoris</p>
            <Button onClick={() => (window.location.href = '/explorer')}>
              Explorer les articles
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Favorites List */}
            <div className="md:col-span-1">
              <div className="border border-border rounded-lg p-4 space-y-2 max-h-96 overflow-y-auto">
                {favoriteArticles.map((article: Article) => (
                  <div
                    key={article.id}
                    className={`p-2 rounded border border-border/50 hover:border-border transition-colors ${
                      selectedArticle?.id === article.id ? 'border-primary bg-primary/5' : ''
                    }`}
                  >
                    <button
                      onClick={() => setSelectedArticle(article)}
                      className="w-full text-left mb-2"
                    >
                      <span className="font-semibold text-primary text-sm">{article.number}</span>
                    </button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFavorite(article.id)}
                      className="w-full justify-start text-xs text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3 mr-2" />
                      Supprimer
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Article Detail */}
            <div className="md:col-span-2">
              {selectedArticle ? (
                <div className="border border-border rounded-lg p-6 space-y-4">
                  <div className="space-y-2">
                    <h2 className="font-serif text-2xl font-bold text-primary">
                      {selectedArticle.number}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {selectedArticle.chapter && (
                        <>
                          Chapitre {selectedArticle.chapter.number}:{' '}
                          {selectedArticle.chapter.title}
                        </>
                      )}
                    </p>
                  </div>

                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                      {selectedArticle.content}
                    </p>
                  </div>

                  <Button
                    variant="destructive"
                    onClick={() => removeFavorite(selectedArticle.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer de mes favoris
                  </Button>
                </div>
              ) : (
                <div className="border border-border rounded-lg p-6 text-center text-muted-foreground">
                  <p>Sélectionnez un favoris pour voir son contenu</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
