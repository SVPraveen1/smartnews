"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface User {
  id: string
  name: string
  email: string
  notifications?: boolean
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; user?: User; error?: string }>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check for existing user session
    const currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
      try {
        setUser(JSON.parse(currentUser))
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem('currentUser')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        localStorage.setItem('currentUser', JSON.stringify(data.user))
        return { success: true, user: data.user }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      return { success: false, error: 'Login failed' }
    }
  }

  const register = async (email: string, password: string, name: string) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        localStorage.setItem('currentUser', JSON.stringify(data.user))
        return { success: true, user: data.user }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      return { success: false, error: 'Registration failed' }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('currentUser')
    router.push('/')
  }

  // Protect routes
  useEffect(() => {
    if (!isLoading && !user) {
      const protectedRoutes = ['/dashboard', '/portfolio', '/news']
      if (protectedRoutes.includes(pathname)) {
        router.push('/auth/login')
      }
    }
  }, [user, isLoading, pathname, router])

  const value = {
    user,
    login,
    register,
    logout,
    isLoading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
