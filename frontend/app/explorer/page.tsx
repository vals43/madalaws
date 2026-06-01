'use client'

import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCodes, useArticles } from '@/lib/api/hooks'
import { useState, useEffect, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from 'react'
import { Loader2, Search, Star, ChevronRight, Copy } from 'lucide-react'
import { Article } from '@/lib/types'
import { initializeAPIClient } from '@/lib/api/client'

export default function ExplorerPage() {
  const [initialized, setInitialized] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [favorites, setFavorites] = useState<string[]>([])
  const [copied, setCopied] = useState(false)

  const { data: codes, isLoading: codesLoading } = useCodes()
  const { data: articles, isLoading: articlesLoading } = useArticles()

  useEffect(() => {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api'
    initializeAPIClient(baseURL)
    setInitialized(true)

    const saved = localStorage.getItem('favorites')
    if (saved) {
      setFavorites(JSON.parse(saved))
    }
  }, [])

  const filteredArticles = articles?.filter((article: Article) =>
    article.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.content.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  const toggleFavorite = (articleId: string) => {
    const newFavorites = favorites.includes(articleId)
      ? favorites.filter((id) => id !== articleId)
      : [...favorites, articleId]
    setFavorites(newFavorites)
    localStorage.setItem('favorites', JSON.stringify(newFavorites))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  console.log(codes);
  

  const isFavorited = selectedArticle ? favorites.includes(selectedArticle.id) : false

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 py-10">
        <div className="mb-10">
          <div className="text-sm font-medium tracking-[0.2em] text-accent uppercase mb-3">Consultation Juridique</div>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-primary mb-4">
            Explorateur de Lois
          </h1>
          <div className="w-20 h-[2px] bg-accent mb-6"></div>
          <p className="text-muted-foreground font-sans leading-relaxed max-w-2xl">
            Naviguez dans la structure hiérarchique complète des lois de Madagascar
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Navigation Hiérarchique */}
          <div className="lg:col-span-1 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-border/60 focus:border-accent/50 transition-colors"
              />
            </div>

            <div className="luxury-card max-h-[calc(100vh-300px)] overflow-y-auto">
              {codesLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-accent" />
                </div>
              ) : codes && codes.length > 0 ? (
                codes.map((code: { id: Key | null | undefined; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; books: any[] }) => (
                  <div key={code.id} className="space-y-2 mb-4 last:mb-0">
                    <div className="font-display font-semibold text-sm text-primary bg-primary/5 px-3 py-2.5 rounded">
                      {code.name}
                    </div>
                    {code.books && code.books.length > 0 ? (
                      <div className="space-y-1 pl-3 border-l-2 border-border/40">
                        {code.books.map((book) => (
                          <div
                            key={book.id}
                            className="text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors truncate flex items-center gap-1.5 py-0.5"
                          >
                            <ChevronRight className="h-3 w-3 flex-shrink-0 text-accent/60" />
                            <span>
                              {book.number && <span className="font-semibold text-primary/80">{book.number}</span>}{' '}
                              {book.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-muted-foreground italic pl-3">
                        Aucun livre
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground text-center py-4">
                  Aucun code disponible
                </p>
              )}
            </div>
          </div>

          {/* Articles List */}
          <div className="lg:col-span-1">
            <div className="luxury-card max-h-[calc(100vh-300px)] overflow-y-auto">
              <h3 className="text-sm font-display font-semibold text-primary sticky top-0 bg-card pb-3 mb-2">
                Articles
                {filteredArticles.length > 0 && (
                  <span className="text-xs text-muted-foreground ml-2 font-sans">
                    ({filteredArticles.length})
                  </span>
                )}
              </h3>
              {articlesLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-accent" />
                </div>
              ) : filteredArticles.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-8">
                  Aucun article trouvé
                </p>
              ) : (
                filteredArticles.map((article: Article) => (
                  <button
                    key={article.id}
                    onClick={() => setSelectedArticle(article)}
                    className={`w-full text-left p-3 rounded transition-all duration-300 text-xs group mb-2 last:mb-0 ${
                      selectedArticle?.id === article.id
                        ? 'bg-primary/10 border border-accent/30 shadow-sm'
                        : 'border border-transparent hover:bg-accent/5 hover:border-border/40'
                    }`}
                  >
                    <span className="font-semibold text-primary font-display">{article.number}</span>
                    <p className="text-xs text-muted-foreground truncate mt-1 font-sans">
                      {article.content.substring(0, 50)}...
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Article Detail */}
          <div className="lg:col-span-2">
            {selectedArticle ? (
              <div className="luxury-card max-h-[calc(100vh-300px)] overflow-y-auto">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="font-display text-3xl font-semibold text-primary mb-3">
                        {selectedArticle.number}
                      </h2>
                      {selectedArticle.chapter && (
                        <p className="text-xs text-muted-foreground font-sans">
                          <span className="text-accent/80">Chapitre {selectedArticle.chapter.number}:</span> {selectedArticle.chapter.title}
                        </p>
                      )}
                      {selectedArticle.section && (
                        <p className="text-xs text-muted-foreground font-sans mt-1">
                          <span className="text-accent/80">Section {selectedArticle.section.number}:</span> {selectedArticle.section.title}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFavorite(selectedArticle.id)}
                      className="text-accent hover:text-accent/80 hover:bg-accent/10"
                    >
                      <Star
                        className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`}
                      />
                    </Button>
                  </div>
                </div>

                <div className="border-t border-border/60 pt-6 mt-6 space-y-4">
                  <p className="text-base leading-relaxed text-foreground whitespace-pre-wrap font-serif">
                    {selectedArticle.content}
                  </p>

                  <div className="flex gap-3 pt-6 border-t border-border/60">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(selectedArticle.content)}
                      className="flex-1 border-border/60 hover:border-accent/50 font-sans"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      {copied ? 'Copié!' : 'Copier'}
                    </Button>
                    <Button
                      variant={isFavorited ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleFavorite(selectedArticle.id)}
                      className={`flex-1 font-sans ${!isFavorited ? 'border-border/60 hover:border-accent/50' : ''}`}
                    >
                      <Star className="h-4 w-4 mr-2" />
                      {isFavorited ? 'Favoris' : 'Ajouter'}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="luxury-card h-[calc(100vh-300px)] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-[1px] bg-accent/40 mx-auto mb-6"></div>
                  <p className="text-muted-foreground mb-3 font-sans">Sélectionnez un article pour voir son contenu complet</p>
                  <p className="text-xs text-muted-foreground font-sans">Utilisez la recherche ou la navigation pour explorer</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
