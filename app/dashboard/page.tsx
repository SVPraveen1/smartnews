"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  TrendingUp,
  Newspaper,
  PieChart,
  Brain,
  Plus,
  ExternalLink,
  Clock,
  TrendingDown,
  LogOut,
  Bell,
} from "lucide-react"
import Link from "next/link"
import { DebugPanel } from "@/components/debug-panel"

interface NewsItem {
  title: string
  description: string
  link: string
  pubDate: string
  source_id: string
  category: string[]
}

interface PortfolioStock {
  symbol: string
  name: string
  quantity: number
  avgPrice: number
}

interface AIInsight {
  stock: string
  sentiment: "Positive" | "Negative" | "Neutral"
  confidence: number
  reasoning: string
  impact: string
}

interface DashboardUser {
  id: string
  name: string
  email: string
  notifications: boolean
}

export default function DashboardPage() {
  const [generalNews, setGeneralNews] = useState<NewsItem[]>([])
  const [portfolioNews, setPortfolioNews] = useState<NewsItem[]>([])
  const [portfolio, setPortfolio] = useState<PortfolioStock[]>([])
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([])
  const [user, setUser] = useState<DashboardUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check authentication
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/auth/login")
      return
    }

    const userData = JSON.parse(currentUser)
    setUser(userData)
    setNotificationsEnabled(userData.notifications || false)

    // Load portfolio from localStorage
    const savedPortfolio = localStorage.getItem(`portfolio_${userData.id}`)
    if (savedPortfolio) {
      setPortfolio(JSON.parse(savedPortfolio))
    }

    // Request notification permission
    if ("Notification" in window && userData.notifications) {
      Notification.requestPermission()
    }

    // Fetch news and insights
    fetchNews()
  }, [router])

  useEffect(() => {
    if (portfolio.length > 0 && user) {
      fetchPortfolioNews()
    }
  }, [portfolio, user])

  const fetchNews = async () => {
    try {
      console.log("Fetching general news...")
      const response = await fetch("/api/news")

      const data = await response.json()

      if (response.ok) {
        console.log("News fetched successfully:", data.results?.length || 0, "articles")
        setGeneralNews(data.results || [])
      } else {
        console.error("News API returned error:", data.error)
        setGeneralNews(data.results || []) // Use mock data from API response
      }
    } catch (error) {
      console.error("Error fetching news:", error)
      setGeneralNews([]) // Will show empty state
    }
  }

  const fetchPortfolioNews = async () => {
    if (portfolio.length === 0) {
      setLoading(false)
      return
    }

    try {
      console.log("Fetching portfolio news for:", portfolio.map((s) => s.symbol).join(", "))
      const symbols = portfolio.map((stock) => stock.symbol).join(",")
      const response = await fetch(`/api/portfolio-news?symbols=${symbols}`)

      const data = await response.json()

      if (response.ok) {
        console.log("Portfolio news fetched:", data.news?.length || 0, "articles")
        console.log("AI insights generated:", data.insights?.length || 0, "insights")

        setPortfolioNews(data.news || [])
        setAiInsights(data.insights || [])

        // Send notifications for significant insights
        if (notificationsEnabled && data.insights?.length > 0) {
          sendNotifications(data.insights)
        }
      } else {
        console.error("Portfolio news API returned error:", data.error)
        setPortfolioNews(data.news || [])
        setAiInsights(data.insights || [])
      }
    } catch (error) {
      console.error("Error fetching portfolio news:", error)
      setPortfolioNews([])
      setAiInsights([])
    } finally {
      setLoading(false)
    }
  }

  const sendNotifications = (insights: AIInsight[]) => {
    if ("Notification" in window && Notification.permission === "granted") {
      insights.forEach((insight) => {
        if (insight.confidence > 75 && insight.sentiment !== "Neutral") {
          new Notification(`${insight.stock} - ${insight.sentiment} Impact`, {
            body: insight.reasoning,
            icon: "/favicon.ico",
          })
        }
      })
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/")
  }

  const toggleNotifications = async (enabled: boolean) => {
    setNotificationsEnabled(enabled)

    if (user) {
      const updatedUser = { ...user, notifications: enabled }
      setUser(updatedUser)
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))

      // Update in users array
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const userIndex = users.findIndex((u: any) => u.id === user.id)
      if (userIndex >= 0) {
        users[userIndex] = updatedUser
        localStorage.setItem("users", JSON.stringify(users))
      }

      if (enabled && "Notification" in window) {
        await Notification.requestPermission()
      }
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "Positive":
        return "bg-green-100 text-green-800"
      case "Negative":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "Positive":
        return <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
      case "Negative":
        return <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4" />
      default:
        return <Brain className="h-3 w-3 sm:h-4 sm:w-4" />
    }
  }

  if (!user) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Dashboard Header */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.name}!</h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Stay updated with market news and AI-powered portfolio insights
          </p>
        </div>


        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Portfolio Stocks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">{portfolio.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Latest News</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">{generalNews.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Portfolio News</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">{portfolioNews.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">AI Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">{aiInsights.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-4 text-xs sm:text-sm">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
            <TabsTrigger value="portfolio-news">Portfolio</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Portfolio Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <PieChart className="h-4 w-4 sm:h-5 sm:w-5" />
                    Portfolio Summary
                  </CardTitle>
                  <CardDescription className="text-sm">Your current stock holdings</CardDescription>
                </CardHeader>
                <CardContent>
                  {portfolio.length > 0 ? (
                    <div className="space-y-3">
                      {portfolio.slice(0, 5).map((stock, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium text-sm sm:text-base">{stock.symbol}</div>
                            <div className="text-xs sm:text-sm text-gray-600 line-clamp-1">{stock.name}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-sm sm:text-base">{stock.quantity} shares</div>
                            <div className="text-xs sm:text-sm text-gray-600">₹{stock.avgPrice}</div>
                          </div>
                        </div>
                      ))}
                      <Link href="/portfolio">
                        <Button variant="outline" className="w-full mt-4 bg-transparent text-sm">
                          Manage Portfolio
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="text-center py-6 sm:py-8">
                      <PieChart className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4 text-sm sm:text-base">No stocks in your portfolio yet</p>
                      <Link href="/portfolio">
                        <Button size="sm">
                          <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                          Add Stocks
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent AI Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Brain className="h-4 w-4 sm:h-5 sm:w-5" />
                    Recent AI Insights
                  </CardTitle>
                  <CardDescription className="text-sm">Latest analysis for your portfolio</CardDescription>
                </CardHeader>
                <CardContent>
                  {aiInsights.length > 0 ? (
                    <div className="space-y-4">
                      {aiInsights.slice(0, 3).map((insight, index) => (
                        <div key={index} className="p-3 sm:p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm sm:text-base">{insight.stock}</span>
                            <Badge className={getSentimentColor(insight.sentiment)}>
                              {getSentimentIcon(insight.sentiment)}
                              <span className="ml-1 text-xs">{insight.sentiment}</span>
                            </Badge>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">{insight.reasoning}</p>
                          <div className="text-xs text-gray-500">Confidence: {insight.confidence}%</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 sm:py-8">
                      <Brain className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 text-sm sm:text-base">
                        Add stocks to your portfolio to get AI insights
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="news">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Newspaper className="h-4 w-4 sm:h-5 sm:w-5" />
                  Latest Market News
                </CardTitle>
                <CardDescription className="text-sm">Recent news from Indian stock markets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {generalNews.slice(0, 10).map((news, index) => (
                    <div key={index} className="p-3 sm:p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-900 line-clamp-2 text-sm sm:text-base pr-2">
                          {news.title}
                        </h3>
                        <Badge variant="outline" className="ml-2 shrink-0 text-xs">
                          {news.source_id}
                        </Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">{news.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(news.pubDate).toLocaleDateString()}
                        </div>
                        <a
                          href={news.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm flex items-center"
                        >
                          Read more <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio-news">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <PieChart className="h-4 w-4 sm:h-5 sm:w-5" />
                  Portfolio-Specific News
                </CardTitle>
                <CardDescription className="text-sm">News relevant to your holdings</CardDescription>
              </CardHeader>
              <CardContent>
                {portfolioNews.length > 0 ? (
                  <div className="space-y-4">
                    {portfolioNews.map((news, index) => (
                      <div key={index} className="p-3 sm:p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-gray-900 line-clamp-2 text-sm sm:text-base pr-2">
                            {news.title}
                          </h3>
                          <Badge variant="outline" className="ml-2 shrink-0 text-xs">
                            {news.source_id}
                          </Badge>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">{news.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(news.pubDate).toLocaleDateString()}
                          </div>
                          <a
                            href={news.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm flex items-center"
                          >
                            Read more <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 sm:py-12">
                    <Newspaper className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4 text-sm sm:text-base">No portfolio-specific news available</p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Add stocks to your portfolio to see relevant news
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Brain className="h-4 w-4 sm:h-5 sm:w-5" />
                  AI-Powered Insights
                </CardTitle>
                <CardDescription className="text-sm">
                  Intelligent analysis of market impact on your portfolio
                </CardDescription>
              </CardHeader>
              <CardContent>
                {aiInsights.length > 0 ? (
                  <div className="space-y-4 sm:space-y-6">
                    {aiInsights.map((insight, index) => (
                      <div key={index} className="p-4 sm:p-6 border rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-base sm:text-lg font-semibold">{insight.stock}</h3>
                          <Badge className={getSentimentColor(insight.sentiment)}>
                            {getSentimentIcon(insight.sentiment)}
                            <span className="ml-1 text-xs">{insight.sentiment} Impact</span>
                          </Badge>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">Analysis</h4>
                            <p className="text-gray-700 text-sm sm:text-base">{insight.reasoning}</p>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">Expected Impact</h4>
                            <p className="text-gray-700 text-sm sm:text-base">{insight.impact}</p>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t">
                            <span className="text-xs sm:text-sm text-gray-600">Confidence Score</span>
                            <div className="flex items-center">
                              <div className="w-16 sm:w-24 bg-gray-200 rounded-full h-2 mr-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${insight.confidence}%` }}
                                ></div>
                              </div>
                              <span className="text-xs sm:text-sm font-medium">{insight.confidence}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 sm:py-12">
                    <Brain className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4 text-sm sm:text-base">No AI insights available</p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Add stocks to your portfolio to get intelligent market analysis
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
