'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useCodes } from '@/lib/api/hooks'
import { initializeAPIClient } from '@/lib/api/client'
import { Loader2 } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()
  const [initialized, setInitialized] = useState(false)
  const { data: codes, isLoading, error } = useCodes()

  useEffect(() => {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api'
    initializeAPIClient(baseURL)
    setInitialized(true)
  }, [])

  const handleExplore = () => {
    router.push('/explorer')
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10">
        {/* Hero Section */}
        <section className="py-28 md:py-36 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 text-sm font-medium tracking-[0.2em] text-accent uppercase">
              Plateforme Juridique
            </div>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-semibold text-primary mb-8 leading-tight">
              MadaLaws
            </h1>
            <div className="w-24 h-[2px] bg-accent mx-auto mb-8"></div>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-sans">
              Explorez l'ensemble des lois de Madagascar avec une structure hiérarchique complète et intuitive. Une plateforme numérique centralisée pour une meilleure accessibilité juridique.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={handleExplore}
                className="font-medium tracking-wide px-8 py-6 text-base border-0 bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300"
              >
                Commencer l&apos;exploration
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push('/favorites')}
                className="font-medium tracking-wide px-8 py-6 text-base border-border/60 hover:border-accent/50 hover:bg-accent/5 transition-all duration-300"
              >
                Voir mes favoris
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 border-t border-border/60">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-display font-semibold text-primary mb-3">
                {isLoading ? (
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-accent" />
                ) : error ? (
                  '—'
                ) : (
                  codes?.length || 0
                )}
              </div>
              <div className="w-12 h-[1px] bg-accent/40 mx-auto mb-3"></div>
              <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">Codes Juridiques</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-display font-semibold text-primary mb-3">6+</div>
              <div className="w-12 h-[1px] bg-accent/40 mx-auto mb-3"></div>
              <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">Niveaux Hiérarchiques</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-display font-semibold text-primary mb-3">100%</div>
              <div className="w-12 h-[1px] bg-accent/40 mx-auto mb-3"></div>
              <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">Accès Libre</p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 border-t border-border/60">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-primary mb-4">
              Fonctionnalités Principales
            </h2>
            <div className="w-16 h-[2px] bg-accent mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: 'Navigation Hiérarchique',
                description: 'Explorez l&apos;ensemble de la structure juridique avec un système de navigation intuitif de Codes à Articles.',
              },
              {
                title: 'Recherche Avancée',
                description: 'Recherchez des articles, lois et concepts juridiques avec des filtres puissants et contextualisés.',
              },
              {
                title: 'Système de Favoris',
                description: 'Sauvegardez vos articles préférés et créez votre propre collection de références juridiques.',
              },
              {
                title: 'Thèmes Personnalisés',
                description: 'Passez facilement entre les thèmes clair et sombre pour une expérience de lecture optimale.',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-8 rounded-lg border border-border/60 bg-card hover:border-accent/30 hover:shadow-lg transition-all duration-300"
              >
                <h3 className="font-display text-xl font-semibold text-primary mb-4 group-hover:text-accent transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground font-sans leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 border-t border-border/60 text-center mb-20">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-primary mb-6">
              Prêt à commencer ?
            </h2>
            <p className="text-muted-foreground mb-10 leading-relaxed font-sans">
              Accédez à l&apos;ensemble des lois de Madagascar, explorez la structure hiérarchique complète et créez vos favoris.
            </p>
            <Button
              size="lg"
              onClick={handleExplore}
              className="font-medium tracking-wide px-10 py-6 text-base border-0 bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300"
            >
              Ouvrir l&apos;Explorateur
            </Button>
          </div>
        </section>
      </main>
    </div>
  )
}
