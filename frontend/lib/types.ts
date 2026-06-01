// Hierarchy Types
export interface CodeLite {
  id: string
  name: string
}

export interface BookLite {
  id: string
  title: string
  number: string
}

export interface TitleLite {
  id: string
  title: string
  number: string
}

export interface ChapterLite {
  id: string
  title: string
  number: string
}

export interface SectionLite {
  id: string
  title: string
  number: string
}

export interface ArticleLite {
  id: string
  number: string
}

export interface Code {
  id: string
  name: string
  description: string
  books: BookLite[]
  createdAt: string
  updatedAt: string
}

export interface Book {
  id: string
  title: string
  number: string
  codeId: string
  code: CodeLite
  titles: TitleLite[]
}

export interface Title {
  id: string
  title: string
  number: string
  bookId: string
  book: BookLite
  chapters: ChapterLite[]
}

export interface Chapter {
  id: string
  title: string
  number: string
  titleId: string
  title_obj: TitleLite
  sections: SectionLite[]
  articles: ArticleLite[]
}

export interface Section {
  id: string
  title: string
  number: string
  chapterId: string
  chapter: ChapterLite
  articles: ArticleLite[]
}

export interface Article {
  id: string
  number: string
  content: string
  sectionId?: string
  chapterId?: string
  section?: SectionLite
  chapter?: ChapterLite
}

// Admin Types
export interface AdminUser {
  id: string
  email: string
  role: string
}

export interface AuthResponse {
  token: string
  user: AdminUser
}

export interface Favorite {
  articleId: string
  articleNumber: string
  chapterId: string
  chapterTitle: string
  codeId: string
  codeName: string
  savedAt: string
}
