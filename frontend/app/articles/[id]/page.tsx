'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { useArticle } from '@/lib/api/hooks'
import { initializeAPIClient, getAPIClient } from '@/lib/api/client'
import { Loader2, ArrowLeft, Star, Copy, BookOpen } from 'lucide-react'
import { Article } from '@/lib/types'
import { Breadcrumb } from '@/components/breadcrumb'

export default function ArticleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const articleId = params.id as string
  const [favorites, setFavorites] = useState<string[]>([])
  const [copied, setCopied] = useState(false)

  const { data: article, isLoading } = useArticle(articleId)

  useEffect(() => {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api'
    initializeAPIClient(baseURL)

    const saved = localStorage.getItem('favorites')
    if (saved) {
      setFavorites(JSON.parse(saved))
    }
  }, [])

  const toggleFavorite = (id: string) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter((fav) => fav !== id)
      : [...favorites, id]
    setFavorites(newFavorites)
    localStorage.setItem('favorites', JSON.stringify(newFavorites))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isFavorited = favorites.includes(articleId)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button variant="ghost" onClick={() => router.back()} className="mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div className="text-center py-16">
            <p className="text-muted-foreground">Article non trouvé</p>
          </div>
        </main>
      </div>
    )
  }

  const breadcrumbs = [
    { label: 'Accueil', href: '/' },
    { label: 'Explorateur', href: '/explorer' },
    ...(article.chapter
      ? [
          {
            label: `Chapitre ${article.chapter.number}`,
            href: `/chapters/${article.chapter.id}`,
          },
        ]
      : []),
    { label: article.number },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>

        <Breadcrumb items={breadcrumbs} />

        <article className="mt-8 space-y-8">
          {/* Header */}
          <div className="space-y-4 border-b border-border pb-8">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="font-serif text-4xl font-bold text-primary mb-2">
                  {article.number}
                </h1>
                {article.chapter && (
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Chapitre {article.chapter.number}: {article.chapter.title}
                    </p>
                    {article.section && (
                      <p className="ml-6">
                        Section {article.section.number}: {article.section.title}
                      </p>
                    )}
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => toggleFavorite(articleId)}
                className="text-amber-500 hover:text-amber-600"
              >
                <Star
                  className={`h-6 w-6 ${isFavorited ? 'fill-current' : ''}`}
                />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="text-base leading-relaxed text-foreground whitespace-pre-wrap font-serif text-justify">
              {article.content}
            </p>
          </div>

          {/* Actions */}
          <div className="border-t border-border pt-8 flex gap-3">
            <Button
              onClick={() => copyToClipboard(article.content)}
              variant="outline"
              className="flex-1"
            >
              <Copy className="h-4 w-4 mr-2" />
              {copied ? 'Copié!' : 'Copier le texte'}
            </Button>
            <Button
              onClick={() => toggleFavorite(articleId)}
              variant={isFavorited ? 'default' : 'outline'}
              className="flex-1"
            >
              <Star className="h-4 w-4 mr-2" />
              {isFavorited ? 'Favoris' : 'Ajouter aux favoris'}
            </Button>
          </div>
        </article>
      </main>
    </div>
  )
}
