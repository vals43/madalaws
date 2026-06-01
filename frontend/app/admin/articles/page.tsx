'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useArticles, useDeleteArticle, useCreateArticle, useUpdateArticle, useChapters } from '@/lib/api/hooks'
import { getAPIClient, initializeAPIClient } from '@/lib/api/client'
import { Article, Chapter } from '@/lib/types'
import { Loader2, Plus, Edit2, Trash2 } from 'lucide-react'

export default function AdminArticlesPage() {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [number, setNumber] = useState('')
  const [content, setContent] = useState('')
  const [chapterId, setChapterId] = useState('')
  const [sectionId, setSectionId] = useState('')
  const [error, setError] = useState('')

  const { data: articles, isLoading: articlesLoading, refetch } = useArticles()
  const { data: chapters } = useChapters()
  const deleteArticleMutation = useDeleteArticle()
  const createArticleMutation = useCreateArticle()
  const updateArticleMutation = useUpdateArticle()

  const isLoading = createArticleMutation.isPending || updateArticleMutation.isPending

  useEffect(() => {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api'
    initializeAPIClient(baseURL)

    const token = getAPIClient().getToken()
    if (!token) {
      router.push('/admin/login')
    } else {
      setIsAuthorized(true)
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!number.trim() || !content.trim()) {
      setError('Le numéro et le contenu sont requis')
      return
    }

    if (!chapterId && !sectionId) {
      setError('Le chapitre ou la section est requis')
      return
    }

    try {
      if (editingArticle) {
        await updateArticleMutation.mutateAsync({
          id: editingArticle.id,
          data: { number, content, chapterId: chapterId || undefined, sectionId: sectionId || undefined },
        })
      } else {
        await createArticleMutation.mutateAsync({
          number,
          content,
          chapterId: chapterId || undefined,
          sectionId: sectionId || undefined,
        })
      }
      resetForm()
      refetch()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la sauvegarde')
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingArticle(null)
    setNumber('')
    setContent('')
    setChapterId('')
    setSectionId('')
  }

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      try {
        await deleteArticleMutation.mutateAsync(id)
        refetch()
      } catch (error) {
        console.error('Erreur lors de la suppression:', error)
      }
    }
  }

  const handleEdit = (article: Article) => {
    setEditingArticle(article)
    setNumber(article.number)
    setContent(article.content)
    setChapterId(article.chapterId || '')
    setSectionId(article.sectionId || '')
    setShowForm(true)
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-3xl font-bold">Gestion des Articles</h1>
              <p className="text-muted-foreground">Créer et gérer les articles juridiques</p>
            </div>
            <Button onClick={() => { setEditingArticle(null); setShowForm(!showForm) }}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvel Article
            </Button>
          </div>

          {showForm && (
            <div className="border border-border rounded-lg p-6 bg-card space-y-4">
              <h2 className="font-serif text-xl font-bold">
                {editingArticle ? 'Modifier l&apos;Article' : 'Ajouter un Article'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded bg-destructive/10 text-destructive text-sm">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Numéro</label>
                    <Input
                      placeholder="Article 1"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Chapitre</label>
                    <select
                      value={chapterId}
                      onChange={(e) => setChapterId(e.target.value)}
                      disabled={isLoading}
                      className="w-full px-3 py-2 border border-border rounded bg-background text-foreground"
                    >
                      <option value="">-- Sélectionner un chapitre --</option>
                      {chapters?.map((chapter: Chapter) => (
                        <option key={chapter.id} value={chapter.id}>
                          Chapitre {chapter.number}: {chapter.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Contenu</label>
                  <textarea
                    placeholder="Contenu de l'article..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    disabled={isLoading}
                    rows={6}
                    className="w-full px-3 py-2 border border-border rounded bg-background text-foreground"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" disabled={isLoading} className="flex-1">
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sauvegarde...
                      </>
                    ) : editingArticle ? (
                      'Mettre à jour'
                    ) : (
                      'Créer'
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm} disabled={isLoading}>
                    Annuler
                  </Button>
                </div>
              </form>
            </div>
          )}

          <div className="space-y-3">
            {articlesLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : articles && articles.length > 0 ? (
              articles.map((article: Article) => (
                <div
                  key={article.id}
                  className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif font-bold text-foreground">
                        {article.number}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate mt-1">
                        {article.content.substring(0, 100)}...
                      </p>
                      {article.chapter && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Chapitre {article.chapter.number}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(article)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(article.id)}
                        className="text-destructive hover:text-destructive"
                        disabled={deleteArticleMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Aucun article. Commencez par en ajouter un !
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
