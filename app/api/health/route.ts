import { NextResponse } from "next/server"

export async function GET() {
  try {
    const health = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      environment: {
        newsApiKey: !!process.env.newsdata_api_key,
        geminiApiKey: !!process.env.gemini_api_key,
      },
      services: {
        database: "localStorage", // Since we're using localStorage
        news: "newsdata.io",
        ai: "gemini",
      },
    }

    return NextResponse.json(health)
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
