'use client'

import { useRouter } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const router = useRouter()

  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && <ChevronRight className="h-4 w-4" />}
          {item.href ? (
            <Button
              variant="link"
              size="sm"
              onClick={() => router.push(item.href!)}
              className="p-0 h-auto text-muted-foreground hover:text-foreground"
            >
              {item.label}
            </Button>
          ) : (
            <span className="text-foreground font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}
