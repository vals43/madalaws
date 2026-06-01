'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { useCodes, useDeleteCode } from '@/lib/api/hooks'
import { getAPIClient, initializeAPIClient } from '@/lib/api/client'
import { CodeForm } from '@/components/admin/code-form'
import { Code } from '@/lib/types'
import { Loader2, Plus, Edit2, Trash2 } from 'lucide-react'

export default function AdminCodesPage() {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingCode, setEditingCode] = useState<Code | null>(null)

  const { data: codes, isLoading, refetch } = useCodes()
  const deleteCodeMutation = useDeleteCode()

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

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce code ? Tous les éléments liés seront supprimés.')) {
      try {
        await deleteCodeMutation.mutateAsync(id)
        refetch()
      } catch (error) {
        console.error('Erreur lors de la suppression:', error)
      }
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingCode(null)
    refetch()
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
              <h1 className="font-serif text-3xl font-bold">Gestion des Codes</h1>
              <p className="text-muted-foreground">Créer et gérer les codes juridiques</p>
            </div>
            <Button onClick={() => { setEditingCode(null); setShowForm(!showForm) }}>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Code
            </Button>
          </div>

          {showForm && (
            <div className="border border-border rounded-lg p-6 bg-card">
              <h2 className="font-serif text-xl font-bold mb-4">
                {editingCode ? 'Modifier le Code' : 'Ajouter un Code'}
              </h2>
              <CodeForm
                code={editingCode || undefined}
                onSuccess={handleFormSuccess}
                onCancel={() => {
                  setShowForm(false)
                  setEditingCode(null)
                }}
              />
            </div>
          )}

          <div className="space-y-3">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : codes && codes.length > 0 ? (
              codes.map((code: Code) => (
                <div
                  key={code.id}
                  className="border border-border rounded-lg p-4 flex items-start justify-between hover:shadow-md transition-shadow"
                >
                  <div className="flex-1">
                    <h3 className="font-serif font-bold text-lg text-foreground">
                      {code.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{code.description}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {code.books?.length || 0} livres
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingCode(code)
                        setShowForm(true)
                      }}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(code.id)}
                      className="text-destructive hover:text-destructive"
                      disabled={deleteCodeMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Aucun code. Commencez par en ajouter un !
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
