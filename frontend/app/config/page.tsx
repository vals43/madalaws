'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { initializeAPIClient, getAPIClient } from '@/lib/api/client'
import { Check, AlertCircle } from 'lucide-react'

export default function ConfigPage() {
  const [baseUrl, setBaseUrl] = useState('')
  const [saved, setSaved] = useState(false)
  const [tested, setTested] = useState(false)
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api'
    setBaseUrl(url)
  }, [])

  const handleSave = () => {
    initializeAPIClient(baseUrl)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleTest = async () => {
    setIsLoading(true)
    try {
      const client = getAPIClient()
      await client.getCodes()
      setTestResult('success')
    } catch (error) {
      setTestResult('error')
    } finally {
      setIsLoading(false)
      setTested(true)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="font-serif text-3xl font-bold mb-2">Configuration API</h1>
            <p className="text-muted-foreground">
              Configurez l'URL de base de l'API pour MadaLaws
            </p>
          </div>

          <div className="border border-border rounded-lg p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">URL de Base API</label>
              <Input
                type="url"
                placeholder="http://localhost:5000/api"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Par défaut: http://localhost:5000/api
              </p>
            </div>

            <div className="space-y-3">
              <Button onClick={handleSave} className="w-full">
                {saved ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Sauvegardé
                  </>
                ) : (
                  'Sauvegarder'
                )}
              </Button>
              <Button
                onClick={handleTest}
                variant="outline"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Test en cours...' : 'Tester la connexion'}
              </Button>
            </div>

            {tested && (
              <div
                className={`flex items-center gap-3 p-4 rounded-lg ${
                  testResult === 'success'
                    ? 'bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800'
                }`}
              >
                {testResult === 'success' ? (
                  <>
                    <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="font-medium text-green-900 dark:text-green-200">
                        Connexion réussie
                      </p>
                      <p className="text-sm text-green-800 dark:text-green-300">
                        L'API est accessible et fonctionne correctement
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    <div>
                      <p className="font-medium text-red-900 dark:text-red-200">
                        Erreur de connexion
                      </p>
                      <p className="text-sm text-red-800 dark:text-red-300">
                        Vérifiez l&apos;URL et assurez-vous que l&apos;API est en cours d&apos;exécution
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="border-t border-border pt-6 space-y-4">
            <h2 className="font-serif font-bold">Variables d&apos;Environnement</h2>
            <div className="bg-muted p-4 rounded font-mono text-xs space-y-2">
              <div>
                <p className="text-muted-foreground">Ajoutez ceci à votre fichier .env.local:</p>
              </div>
              <div className="bg-background p-2 rounded border border-border">
                <p className="select-all">NEXT_PUBLIC_API_BASE_URL={baseUrl}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
