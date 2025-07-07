"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { TrendingUp, Newspaper, Clock, ExternalLink, Search, Filter, LogOut } from "lucide-react"
import Link from "next/link"

interface NewsItem {
  title: string
  description: string
  link: string
  pubDate: string
  source_id: string
  category: string[]
}

interface AppUser {
  id: string
  name: string
  email: string
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([])
  const [appUser, setAppUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSource, setSelectedSource] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Check authentication
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/auth/login")
      return
    }

    const userData = JSON.parse(currentUser)
    setAppUser(userData)
    fetchNews()
  }, [router])

  useEffect(() => {
    filterNews()
  }, [news, searchTerm, selectedSource])

  const fetchNews = async () => {
    try {
      const response = await fetch("/api/news")
      const data = await response.json()

      if (response.ok || data.results) {
        setNews(data.results || [])
      } else {
        console.error("News API error:", data.error)
        setNews([]) // Will show empty state
      }
    } catch (error) {
      console.error("Error fetching news:", error)
      setNews([])
    } finally {
      setLoading(false)
    }
  }

  const filterNews = () => {
    let filtered = news

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedSource) {
      filtered = filtered.filter((item) => item.source_id === selectedSource)
    }

    setFilteredNews(filtered)
  }

  const getUniqueSources = () => {
    const sources = news.map((item) => item.source_id)
    return [...new Set(sources)]
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/")
  }

  if (!appUser) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Market News</h2>
          <p className="text-gray-600 text-sm sm:text-base">Stay updated with the latest Indian stock market news</p>
        </div>

        {/* Filters */}
        <Card className="mb-6 sm:mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
              Filter News
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search news..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 text-sm"
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <select
                  value={selectedSource}
                  onChange={(e) => setSelectedSource(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Sources</option>
                  {getUniqueSources().map((source) => (
                    <option key={source} value={source}>
                      {source}
                    </option>
                  ))}
                </select>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedSource("")
                }}
                size="sm"
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* News Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total News</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">{news.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Filtered Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">{filteredNews.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">News Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">{getUniqueSources().length}</div>
            </CardContent>
          </Card>
        </div>

        {/* News List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Newspaper className="h-4 w-4 sm:h-5 sm:w-5" />
              Latest News
            </CardTitle>
            <CardDescription className="text-sm">
              {filteredNews.length} articles found
              {searchTerm && ` for "${searchTerm}"`}
              {selectedSource && ` from ${selectedSource}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                  </div>
                ))}
              </div>
            ) : filteredNews.length > 0 ? (
              <div className="space-y-4 sm:space-y-6">
                {filteredNews.map((item, index) => (
                  <article key={index} className="p-4 sm:p-6 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-3 gap-2">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
                        {item.title}
                      </h3>
                      <Badge variant="outline" className="shrink-0 text-xs">
                        {item.source_id}
                      </Badge>
                    </div>

                    <p className="text-gray-700 mb-4 line-clamp-3 text-sm sm:text-base">{item.description}</p>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div className="flex items-center text-xs sm:text-sm text-gray-500">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        {formatDate(item.pubDate)}
                      </div>

                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-xs sm:text-sm"
                      >
                        Read Full Article
                        <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <Newspaper className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No news found</h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  {searchTerm || selectedSource
                    ? "Try adjusting your filters to see more results"
                    : "Unable to load news at the moment"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
