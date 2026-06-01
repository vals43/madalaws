'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, BookOpen, Lock } from 'lucide-react'
import { Code, Book, Title, Chapter, Section, Article } from '@/lib/types'
import { cn } from '@/lib/utils'

interface HierarchyNode {
  type: 'code' | 'book' | 'title' | 'chapter' | 'section' | 'article'
  id: string
  title: string
  number?: string
  children?: HierarchyNode[]
  data?: any
}

interface HierarchyNavigatorProps {
  codes: Code[]
  onSelectArticle?: (article: Article, context: any) => void
  onSelectChapter?: (chapter: Chapter, context: any) => void
}

function TreeNode({
  node,
  level,
  onSelectArticle,
  onSelectChapter,
}: {
  node: HierarchyNode
  level: number
  onSelectArticle?: (article: Article, context: any) => void
  onSelectChapter?: (chapter: Chapter, context: any) => void
}) {
  const [isOpen, setIsOpen] = useState(level < 2)
  const hasChildren = node.children && node.children.length > 0

  const getIcon = () => {
    switch (node.type) {
      case 'code':
        return <BookOpen className="h-4 w-4 text-primary" />
      case 'article':
        return <Lock className="h-3 w-3 text-muted-foreground" />
      default:
        return null
    }
  }

  const handleClick = () => {
    if (node.type === 'chapter' && onSelectChapter) {
      onSelectChapter(node.data, {})
    } else if (node.type === 'article' && onSelectArticle) {
      onSelectArticle(node.data, {})
    }
  }

  const isClickable = node.type === 'chapter' || node.type === 'article'

  return (
    <div>
      <div
        className={cn(
          'flex items-center gap-2 py-2 px-2 rounded hover:bg-muted transition-colors',
          isClickable && 'cursor-pointer hover:bg-accent/50',
          level > 0 && 'ml-' + level * 4
        )}
        style={{ marginLeft: `${level * 16}px` }}
        onClick={handleClick}
      >
        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsOpen(!isOpen)
            }}
            className="p-0 hover:bg-background rounded"
          >
            {isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        )}
        {!hasChildren && <div className="w-4" />}

        {getIcon()}

        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-foreground truncate">
            {node.number && <span className="font-semibold text-primary">{node.number}</span>}{' '}
            {node.title}
          </div>
        </div>
      </div>

      {hasChildren && isOpen && (
        <div>
          {node.children!.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              onSelectArticle={onSelectArticle}
              onSelectChapter={onSelectChapter}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function HierarchyNavigator({
  codes,
  onSelectArticle,
  onSelectChapter,
}: HierarchyNavigatorProps) {
  const nodes: HierarchyNode[] = codes.map((code) => ({
    type: 'code',
    id: code.id,
    title: code.name,
    children: code.books?.map((book) => ({
      type: 'book' as const,
      id: book.id,
      title: book.title,
      number: book.number,
      children: [], // Simplified for now - would need to fetch titles
      data: book,
    })),
    data: code,
  }))

  return (
    <div className="space-y-2">
      {nodes.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          level={0}
          onSelectArticle={onSelectArticle}
          onSelectChapter={onSelectChapter}
        />
      ))}
    </div>
  )
}
