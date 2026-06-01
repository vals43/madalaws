'use client'

import { useState } from 'react'
import { useCreateCode, useUpdateCode } from '@/lib/api/hooks'
import { Code } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'

interface CodeFormProps {
  code?: Code
  onSuccess?: () => void
  onCancel?: () => void
}

export function CodeForm({ code, onSuccess, onCancel }: CodeFormProps) {
  const [name, setName] = useState(code?.name || '')
  const [description, setDescription] = useState(code?.description || '')
  const [error, setError] = useState('')

  const createMutation = useCreateCode()
  const updateMutation = useUpdateCode()
  const isLoading = createMutation.isPending || updateMutation.isPending

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Le nom est requis')
      return
    }

    try {
      if (code) {
        await updateMutation.mutateAsync({
          id: code.id,
          data: { name, description },
        })
      } else {
        await createMutation.mutateAsync({ name, description })
      }
      onSuccess?.()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la sauvegarde')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium">Nom du Code</label>
        <Input
          placeholder="Code pénal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Input
          placeholder="Description du code"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Sauvegarde...
            </>
          ) : code ? (
            'Mettre à jour'
          ) : (
            'Créer'
          )}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Annuler
          </Button>
        )}
      </div>
    </form>
  )
}
