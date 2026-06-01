'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAPIClient } from './client'
import * as types from '../types'

// ============ CODES ============
export function useCodes() {
  return useQuery({
    queryKey: ['codes'],
    queryFn: () => getAPIClient().getCodes(),
  })
}

export function useCode(id: string) {
  return useQuery({
    queryKey: ['codes', id],
    queryFn: () => getAPIClient().getCode(id),
    enabled: !!id,
  })
}

export function useCreateCode() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { name: string; description?: string }) =>
      getAPIClient().createCode(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['codes'] })
    },
  })
}

export function useUpdateCode() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name?: string; description?: string } }) =>
      getAPIClient().updateCode(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['codes'] })
      queryClient.invalidateQueries({ queryKey: ['codes', variables.id] })
    },
  })
}

export function useDeleteCode() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => getAPIClient().deleteCode(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['codes'] })
    },
  })
}

// ============ BOOKS ============
export function useBooks() {
  return useQuery({
    queryKey: ['books'],
    queryFn: () => getAPIClient().getBooks(),
  })
}

export function useBook(id: string) {
  return useQuery({
    queryKey: ['books', id],
    queryFn: () => getAPIClient().getBook(id),
    enabled: !!id,
  })
}

export function useCreateBook() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { title: string; number?: string; codeId: string }) =>
      getAPIClient().createBook(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['books'] })
      queryClient.invalidateQueries({ queryKey: ['codes', variables.codeId] })
    },
  })
}

export function useUpdateBook() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { title?: string; number?: string; codeId?: string } }) =>
      getAPIClient().updateBook(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['books'] })
      queryClient.invalidateQueries({ queryKey: ['books', variables.id] })
    },
  })
}

export function useDeleteBook() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => getAPIClient().deleteBook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] })
    },
  })
}

// ============ TITLES ============
export function useTitles() {
  return useQuery({
    queryKey: ['titles'],
    queryFn: () => getAPIClient().getTitles(),
  })
}

export function useTitle(id: string) {
  return useQuery({
    queryKey: ['titles', id],
    queryFn: () => getAPIClient().getTitle(id),
    enabled: !!id,
  })
}

export function useCreateTitle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { title: string; number?: string; bookId: string }) =>
      getAPIClient().createTitle(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['titles'] })
      queryClient.invalidateQueries({ queryKey: ['books', variables.bookId] })
    },
  })
}

export function useUpdateTitle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { title?: string; number?: string; bookId?: string } }) =>
      getAPIClient().updateTitle(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['titles'] })
      queryClient.invalidateQueries({ queryKey: ['titles', variables.id] })
    },
  })
}

export function useDeleteTitle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => getAPIClient().deleteTitle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['titles'] })
    },
  })
}

// ============ CHAPTERS ============
export function useChapters() {
  return useQuery({
    queryKey: ['chapters'],
    queryFn: () => getAPIClient().getChapters(),
  })
}

export function useChapter(id: string) {
  return useQuery({
    queryKey: ['chapters', id],
    queryFn: () => getAPIClient().getChapter(id),
    enabled: !!id,
  })
}

export function useCreateChapter() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { title: string; number?: string; titleId: string }) =>
      getAPIClient().createChapter(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['chapters'] })
      queryClient.invalidateQueries({ queryKey: ['titles', variables.titleId] })
    },
  })
}

export function useUpdateChapter() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { title?: string; number?: string; titleId?: string } }) =>
      getAPIClient().updateChapter(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['chapters'] })
      queryClient.invalidateQueries({ queryKey: ['chapters', variables.id] })
    },
  })
}

export function useDeleteChapter() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => getAPIClient().deleteChapter(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chapters'] })
    },
  })
}

// ============ SECTIONS ============
export function useSections() {
  return useQuery({
    queryKey: ['sections'],
    queryFn: () => getAPIClient().getSections(),
  })
}

export function useSection(id: string) {
  return useQuery({
    queryKey: ['sections', id],
    queryFn: () => getAPIClient().getSection(id),
    enabled: !!id,
  })
}

export function useCreateSection() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { title: string; number?: string; chapterId: string }) =>
      getAPIClient().createSection(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sections'] })
      queryClient.invalidateQueries({ queryKey: ['chapters', variables.chapterId] })
    },
  })
}

export function useUpdateSection() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { title?: string; number?: string; chapterId?: string } }) =>
      getAPIClient().updateSection(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sections'] })
      queryClient.invalidateQueries({ queryKey: ['sections', variables.id] })
    },
  })
}

export function useDeleteSection() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => getAPIClient().deleteSection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] })
    },
  })
}

// ============ ARTICLES ============
export function useArticles() {
  return useQuery({
    queryKey: ['articles'],
    queryFn: () => getAPIClient().getArticles(),
  })
}

export function useArticle(id: string) {
  return useQuery({
    queryKey: ['articles', id],
    queryFn: () => getAPIClient().getArticle(id),
    enabled: !!id,
  })
}

export function useArticlesByChapter(chapterId: string) {
  return useQuery({
    queryKey: ['articles', 'chapter', chapterId],
    queryFn: () => getAPIClient().getArticlesByChapter(chapterId),
    enabled: !!chapterId,
  })
}

export function useArticlesBySection(sectionId: string) {
  return useQuery({
    queryKey: ['articles', 'section', sectionId],
    queryFn: () => getAPIClient().getArticlesBySection(sectionId),
    enabled: !!sectionId,
  })
}

export function useCreateArticle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { number: string; content: string; sectionId?: string; chapterId?: string }) =>
      getAPIClient().createArticle(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['articles'] })
      if (variables.sectionId) {
        queryClient.invalidateQueries({ queryKey: ['sections', variables.sectionId] })
      }
      if (variables.chapterId) {
        queryClient.invalidateQueries({ queryKey: ['chapters', variables.chapterId] })
      }
    },
  })
}

export function useUpdateArticle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { number?: string; content?: string; sectionId?: string; chapterId?: string } }) =>
      getAPIClient().updateArticle(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['articles'] })
      queryClient.invalidateQueries({ queryKey: ['articles', variables.id] })
    },
  })
}

export function useDeleteArticle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => getAPIClient().deleteArticle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] })
    },
  })
}

// ============ AUTH ============
export function useLoginAdmin() {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      getAPIClient().loginAdmin(email, password),
  })
}

export function useRegisterAdmin() {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      getAPIClient().registerAdmin(email, password),
  })
}
