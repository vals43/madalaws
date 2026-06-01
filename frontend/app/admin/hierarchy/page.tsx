'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  useCodes,
  useDeleteCode,
  useCreateCode,
  useUpdateCode,
  useBooks,
  useDeleteBook,
  useCreateBook,
  useUpdateBook,
} from '@/lib/api/hooks'
import { getAPIClient, initializeAPIClient } from '@/lib/api/client'
import { Loader2, Plus, Trash2, Edit2 } from 'lucide-react'
import { Code, Book } from '@/lib/types'

export default function HierarchyManagementPage() {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [view, setView] = useState<'codes' | 'books'>('codes')
  const [newItemName, setNewItemName] = useState('')
  const [newItemDesc, setNewItemDesc] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

  const { data: codes, isLoading: codesLoading } = useCodes()
  const { data: books, isLoading: booksLoading } = useBooks()
  const deleteCodeMutation = useDeleteCode()
  const createCodeMutation = useCreateCode()
  const updateCodeMutation = useUpdateCode()
  const deleteBookMutation = useDeleteBook()
  const createBookMutation = useCreateBook()
  const updateBookMutation = useUpdateBook()

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

  const handleCreateCode = async () => {
    if (!newItemName.trim()) return
    await createCodeMutation.mutateAsync({ name: newItemName, description: newItemDesc })
    setNewItemName('')
    setNewItemDesc('')
  }

  const handleDeleteCode = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce code ?')) {
      await deleteCodeMutation.mutateAsync(id)
    }
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="font-serif text-3xl font-bold mb-2">Gestion Hiérarchique</h1>
            <p className="text-muted-foreground">
              Gérez la structure des lois de Madagascar
            </p>
          </div>

          {/* View Switcher */}
          <div className="flex gap-2 border-b border-border">
            <Button
              variant={view === 'codes' ? 'default' : 'ghost'}
              onClick={() => setView('codes')}
            >
              Codes
            </Button>
            <Button
              variant={view === 'books' ? 'default' : 'ghost'}
              onClick={() => setView('books')}
            >
              Livres
            </Button>
          </div>

          {view === 'codes' && (
            <div className="space-y-6">
              {/* Add New Code */}
              <div className="border border-border rounded-lg p-6 space-y-4">
                <h2 className="font-serif font-bold text-lg">Ajouter un Code</h2>
                <div className="space-y-3">
                  <Input
                    placeholder="Nom du code"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                  />
                  <Input
                    placeholder="Description"
                    value={newItemDesc}
                    onChange={(e) => setNewItemDesc(e.target.value)}
                  />
                  <Button onClick={handleCreateCode} disabled={createCodeMutation.isPending}>
                    {createCodeMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Création...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Créer
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Codes List */}
              <div className="space-y-3">
                {codesLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : codes && codes.length > 0 ? (
                  codes.map((code: Code) => (
                    <div
                      key={code.id}
                      className="border border-border rounded-lg p-4 flex items-start justify-between hover:shadow-md transition-shadow"
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif font-bold text-foreground">{code.name}</h3>
                        <p className="text-sm text-muted-foreground">{code.description}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {code.books?.length || 0} livres
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/admin/hierarchy/codes/${code.id}`)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCode(code.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Aucun code trouvé
                  </div>
                )}
              </div>
            </div>
          )}

          {view === 'books' && (
            <div className="text-center py-8 text-muted-foreground">
              <p>Sélectionnez un code pour gérer ses livres</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
