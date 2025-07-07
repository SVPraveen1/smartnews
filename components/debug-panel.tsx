"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bug, RefreshCw } from "lucide-react"

export function DebugPanel() {
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testAPIs = async () => {
    setLoading(true)
    const results: any = {}

    // Test News API
    try {
      const newsResponse = await fetch("/api/news")
      results.news = {
        status: newsResponse.status,
        ok: newsResponse.ok,
        data: newsResponse.ok ? await newsResponse.json() : await newsResponse.text(),
      }
    } catch (error) {
      results.news = { error: error instanceof Error ? error.message : "Unknown error" }
    }

    // Test Portfolio News API
    try {
      const portfolioResponse = await fetch("/api/portfolio-news?symbols=RELIANCE,TCS")
      results.portfolio = {
        status: portfolioResponse.status,
        ok: portfolioResponse.ok,
        data: portfolioResponse.ok ? await portfolioResponse.json() : await portfolioResponse.text(),
      }
    } catch (error) {
      results.portfolio = { error: error instanceof Error ? error.message : "Unknown error" }
    }

    setDebugInfo(results)
    setLoading(false)
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bug className="h-5 w-5" />
          API Debug Panel
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={testAPIs} disabled={loading} className="mb-4">
          {loading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Bug className="h-4 w-4 mr-2" />}
          Test APIs
        </Button>

        {debugInfo && (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">News API</h4>
              <Badge variant={debugInfo.news.ok ? "default" : "destructive"}>
                Status: {debugInfo.news.status || "Error"}
              </Badge>
              <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-32">
                {JSON.stringify(debugInfo.news, null, 2)}
              </pre>
            </div>

            <div>
              <h4 className="font-medium mb-2">Portfolio News API</h4>
              <Badge variant={debugInfo.portfolio.ok ? "default" : "destructive"}>
                Status: {debugInfo.portfolio.status || "Error"}
              </Badge>
              <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-32">
                {JSON.stringify(debugInfo.portfolio, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
