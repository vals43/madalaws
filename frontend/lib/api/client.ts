import axios, { AxiosInstance, AxiosError } from 'axios'

class APIClient {
  private client: AxiosInstance
  private token: string | null = null
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL.replace(/\/$/, '') // Remove trailing slash
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Load token from localStorage if available
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('auth_token')
      if (storedToken) {
        this.setToken(storedToken)
      }
    }

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          this.clearToken()
          if (typeof window !== 'undefined') {
            window.location.href = '/admin/login'
          }
        }
        return Promise.reject(error)
      }
    )
  }

  setToken(token: string) {
    this.token = token
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token)
    }
  }

  clearToken() {
    this.token = null
    delete this.client.defaults.headers.common['Authorization']
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
    }
  }

  getToken() {
    return this.token
  }

  // PUBLIC ROUTES - Codes
  async getCodes() {
    const response = await this.client.get('/codes')
    return response.data
  }

  async getCode(id: string) {
    const response = await this.client.get(`/codes/${id}`)
    return response.data
  }

  // PUBLIC ROUTES - Books
  async getBooks() {
    const response = await this.client.get('/books')
    return response.data
  }

  async getBook(id: string) {
    const response = await this.client.get(`/books/${id}`)
    return response.data
  }

  // PUBLIC ROUTES - Titles
  async getTitles() {
    const response = await this.client.get('/titles')
    return response.data
  }

  async getTitle(id: string) {
    const response = await this.client.get(`/titles/${id}`)
    return response.data
  }

  // PUBLIC ROUTES - Chapters
  async getChapters() {
    const response = await this.client.get('/chapters')
    return response.data
  }

  async getChapter(id: string) {
    const response = await this.client.get(`/chapters/${id}`)
    return response.data
  }

  // PUBLIC ROUTES - Sections
  async getSections() {
    const response = await this.client.get('/sections')
    return response.data
  }

  async getSection(id: string) {
    const response = await this.client.get(`/sections/${id}`)
    return response.data
  }

  // PUBLIC ROUTES - Articles
  async getArticles() {
    const response = await this.client.get('/articles')
    return response.data
  }

  async getArticle(id: string) {
    const response = await this.client.get(`/articles/${id}`)
    return response.data
  }

  async getArticlesByChapter(chapterId: string) {
    const response = await this.client.get(`/articles/by-chapter/${chapterId}`)
    return response.data
  }

  async getArticlesBySection(sectionId: string) {
    const response = await this.client.get(`/articles/by-section/${sectionId}`)
    return response.data
  }

  // AUTH - Admin
  async registerAdmin(email: string, password: string) {
    const response = await this.client.post('/admin/auth/register', {
      email,
      password,
    })
    return response.data
  }

  async loginAdmin(email: string, password: string) {
    const response = await this.client.post('/admin/auth/login', {
      email,
      password,
    })
    return response.data
  }

  // ADMIN - Codes
  async createCode(data: { name: string; description?: string }) {
    const response = await this.client.post('/admin/codes', data)
    return response.data
  }

  async updateCode(id: string, data: { name?: string; description?: string }) {
    const response = await this.client.put(`/admin/codes/${id}`, data)
    return response.data
  }

  async deleteCode(id: string) {
    await this.client.delete(`/admin/codes/${id}`)
  }

  // ADMIN - Books
  async createBook(data: { title: string; number?: string; codeId: string }) {
    const response = await this.client.post('/admin/books', data)
    return response.data
  }

  async updateBook(id: string, data: { title?: string; number?: string; codeId?: string }) {
    const response = await this.client.put(`/admin/books/${id}`, data)
    return response.data
  }

  async deleteBook(id: string) {
    await this.client.delete(`/admin/books/${id}`)
  }

  // ADMIN - Titles
  async createTitle(data: { title: string; number?: string; bookId: string }) {
    const response = await this.client.post('/admin/titles', data)
    return response.data
  }

  async updateTitle(id: string, data: { title?: string; number?: string; bookId?: string }) {
    const response = await this.client.put(`/admin/titles/${id}`, data)
    return response.data
  }

  async deleteTitle(id: string) {
    await this.client.delete(`/admin/titles/${id}`)
  }

  // ADMIN - Chapters
  async createChapter(data: { title: string; number?: string; titleId: string }) {
    const response = await this.client.post('/admin/chapters', data)
    return response.data
  }

  async updateChapter(id: string, data: { title?: string; number?: string; titleId?: string }) {
    const response = await this.client.put(`/admin/chapters/${id}`, data)
    return response.data
  }

  async deleteChapter(id: string) {
    await this.client.delete(`/admin/chapters/${id}`)
  }

  // ADMIN - Sections
  async createSection(data: { title: string; number?: string; chapterId: string }) {
    const response = await this.client.post('/admin/sections', data)
    return response.data
  }

  async updateSection(id: string, data: { title?: string; number?: string; chapterId?: string }) {
    const response = await this.client.put(`/admin/sections/${id}`, data)
    return response.data
  }

  async deleteSection(id: string) {
    await this.client.delete(`/admin/sections/${id}`)
  }

  // ADMIN - Articles
  async createArticle(data: { number: string; content: string; sectionId?: string; chapterId?: string }) {
    const response = await this.client.post('/admin/articles', data)
    return response.data
  }

  async updateArticle(id: string, data: { number?: string; content?: string; sectionId?: string; chapterId?: string }) {
    const response = await this.client.put(`/admin/articles/${id}`, data)
    return response.data
  }

  async deleteArticle(id: string) {
    await this.client.delete(`/admin/articles/${id}`)
  }
}

// Create singleton instance
let apiClient: APIClient | null = null

export function initializeAPIClient(baseURL: string): APIClient {
  apiClient = new APIClient(baseURL)
  return apiClient
}

export function getAPIClient(): APIClient {
  if (!apiClient) {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api'
    apiClient = new APIClient(baseURL)
  }
  return apiClient
}

export default APIClient
