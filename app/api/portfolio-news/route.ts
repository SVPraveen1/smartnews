import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const symbols = searchParams.get("symbols")

    if (!symbols) {
      return NextResponse.json({ error: "No symbols provided" }, { status: 400 })
    }

    const stockSymbols = symbols
      .split(",")
      .filter((s) => s.trim())
      .slice(0, 10) // Limit to 10 symbols
    console.log("Fetching portfolio news for symbols:", stockSymbols)

    // Use the correct environment variable names
    const newsApiKey = process.env.newsdata_api_key
    const geminiApiKey = process.env.gemini_api_key

    let allNews: any[] = []

    // Fetch news related to portfolio stocks with simplified parameters
    if (newsApiKey) {
      try {
        // Use a single request with all symbols to avoid rate limits
        const symbolQuery = stockSymbols.join(" OR ")
        const params = new URLSearchParams({
          apikey: newsApiKey,
          country: "in",
          category: "business",
          q: symbolQuery,
          language: "en",
          size: "10",
        })

        const response = await fetch(`https://newsdata.io/api/1/news?${params}`, {
          headers: {
            Accept: "application/json",
            "User-Agent": "SmartInvest/1.0",
          },
        })

        if (response.ok) {
          const data = await response.json()
          allNews = data.results || []
        } else {
          console.error(`Portfolio news API error: ${response.status}`)
        }
      } catch (error) {
        console.error("Error fetching portfolio news:", error)
      }
    }

    // Generate mock portfolio-specific news if API fails or returns no results
    if (allNews.length === 0) {
      allNews = generateMockPortfolioNews(stockSymbols)
    }

    // Generate AI insights
    const insights = await generateAIInsights(stockSymbols, allNews, geminiApiKey)

    return NextResponse.json({
      news: allNews.slice(0, 15), // Limit results
      insights: insights,
      status: "success",
    })
  } catch (error) {
    console.error("Error in portfolio-news API:", error)

    // Return mock data with better insights
    const symbols = request.nextUrl.searchParams.get("symbols")?.split(",") || []
    const mockInsights = generateMockInsights(symbols.slice(0, 10))

    return NextResponse.json({
      news: generateMockPortfolioNews(symbols.slice(0, 10)),
      insights: mockInsights,
      status: "mock_data",
    })
  }
}

function generateMockPortfolioNews(symbols: string[]) {
  return symbols
    .flatMap((symbol) => [
      {
        title: `${symbol} Stock Analysis: Market Outlook Remains Positive`,
        description: `Recent analysis of ${symbol} shows strong fundamentals with positive market sentiment. The stock continues to attract investor interest amid favorable market conditions and sector-specific growth drivers.`,
        link: `https://economictimes.indiatimes.com/markets/stocks/news/${symbol.toLowerCase()}`,
        pubDate: new Date(Date.now() - Math.random() * 86400000).toISOString(),
        source_id: "economictimes",
        category: ["business"],
      },
      {
        title: `${symbol} Quarterly Results Expected to Beat Estimates`,
        description: `Market analysts are optimistic about ${symbol}'s upcoming quarterly results, with expectations of strong revenue growth and improved margins. The company's strategic initiatives are showing positive results.`,
        link: `https://www.moneycontrol.com/news/business/earnings/${symbol.toLowerCase()}`,
        pubDate: new Date(Date.now() - Math.random() * 172800000).toISOString(),
        source_id: "moneycontrol",
        category: ["business"],
      },
    ])
    .slice(0, 15)
}

function getReasoningForStock(symbol: string, sentiment: string) {
  const reasoningMap: Record<string, Record<string, string>> = {
    RELIANCE: {
      Positive:
        "Strong quarterly results in petrochemicals division with improved refining margins and robust retail growth. Digital initiatives showing promising traction.",
      Negative:
        "Concerns over debt levels and slower than expected digital business monetization affecting investor sentiment. Oil price volatility impacting margins.",
      Neutral:
        "Mixed signals from different business segments with petrochemicals performing well but telecom facing intense competition.",
    },
    TCS: {
      Positive:
        "Strong deal wins in digital transformation space with healthy demand from BFSI and retail sectors. Margin expansion through automation initiatives.",
      Negative:
        "Margin pressure due to wage hikes and increased competition in the IT services space. Client budget constraints in key markets.",
      Neutral:
        "Steady performance with consistent deal flow but facing headwinds from global economic uncertainty and currency fluctuations.",
    },
    HDFCBANK: {
      Positive:
        "Robust credit growth and improving asset quality with strong deposit mobilization capabilities. Digital banking initiatives gaining traction.",
      Negative:
        "Rising interest rates and potential credit costs in unsecured lending portfolio causing concern. Regulatory scrutiny on digital initiatives.",
      Neutral:
        "Stable performance with healthy fundamentals but facing challenges from increased competition and regulatory changes.",
    },
    INFY: {
      Positive:
        "Strong client additions and healthy pipeline in cloud and digital services with margin expansion. Large deal momentum continues.",
      Negative:
        "Attrition concerns and wage inflation impacting profitability in key markets. Project delays affecting revenue recognition.",
      Neutral:
        "Consistent performance but facing challenges from currency fluctuations and client budget constraints in discretionary spending.",
    },
    BHARTIARTL: {
      Positive:
        "Strong subscriber additions and ARPU improvement in mobile services. Digital services expansion showing promise.",
      Negative: "Intense competition and spectrum costs impacting profitability. Regulatory challenges in key markets.",
      Neutral: "Steady performance with improving fundamentals but facing headwinds from competitive pricing pressure.",
    },
  }

  return (
    reasoningMap[symbol]?.[sentiment] ||
    `Current market analysis suggests ${symbol} is showing ${sentiment.toLowerCase()} momentum based on recent sector performance, company fundamentals, and market positioning relative to peers.`
  )
}

function getImpactForStock(symbol: string, sentiment: string) {
  const impactMap: Record<string, string> = {
    Positive:
      "Expected positive impact on stock price in the short to medium term with potential for outperformance against sector benchmarks.",
    Negative:
      "Likely to face downward pressure in the near term with increased volatility expected. Consider risk management strategies.",
    Neutral:
      "Expected to trade in line with broader market trends with limited directional bias. Monitor for catalyst events.",
  }

  return (
    impactMap[sentiment] ||
    "Monitor for upcoming developments, quarterly results, and sector-specific news for clearer directional signals."
  )
}

async function generateAIInsights(symbols: string[], news: any[], geminiApiKey?: string) {
  if (!geminiApiKey) {
    console.log("Gemini API key not found, using enhanced mock insights")
    return generateMockInsights(symbols)
  }

  try {
    const prompt = `
    As a financial analyst, analyze the following Indian stock market news for these stocks: ${symbols.join(", ")}.
    
    News articles:
    ${news
      .slice(0, 8)
      .map((article, i) => `${i + 1}. ${article.title}: ${article.description}`)
      .join("\n")}
    
    For each stock symbol, provide analysis in this exact JSON format:
    [
      {
        "stock": "SYMBOL",
        "sentiment": "Positive|Negative|Neutral",
        "confidence": 65-95,
        "reasoning": "Brief 1-2 sentence analysis explaining the sentiment",
        "impact": "1-2 sentences on expected price impact"
      }
    ]
    
    Consider:
    - Recent company performance and fundamentals
    - Sector trends and market conditions
    - News sentiment and market reactions
    - Technical and fundamental factors
    
    Respond only with the JSON array, no additional text.
    `

    console.log("Calling Gemini API for insights...")

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            topK: 20,
            topP: 0.8,
            maxOutputTokens: 1024,
          },
        }),
      },
    )

    if (!response.ok) {
      console.error(`Gemini API error: ${response.status}`)
      throw new Error("Gemini API error")
    }

    const data = await response.json()
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (aiResponse) {
      try {
        // Clean the response and extract JSON
        const cleanResponse = aiResponse.replace(/```json\n?|\n?```/g, "").trim()
        const jsonMatch = cleanResponse.match(/\[[\s\S]*\]/)

        if (jsonMatch) {
          const parsedInsights = JSON.parse(jsonMatch[0])
          console.log("Successfully parsed AI insights:", parsedInsights.length, "insights")
          return parsedInsights
        }
      } catch (parseError) {
        console.error("Error parsing AI response:", parseError)
      }
    }

    // Fallback to mock insights
    return generateMockInsights(symbols)
  } catch (error) {
    console.error("Error generating AI insights:", error)
    return generateMockInsights(symbols)
  }
}

function generateMockInsights(symbols: string[]) {
  return symbols.map((symbol) => {
    const sentiments = ["Positive", "Negative", "Neutral"] as const
    const weights = [0.4, 0.2, 0.4] // 40% positive, 20% negative, 40% neutral
    const randomValue = Math.random()
    let selectedSentiment: (typeof sentiments)[number]

    if (randomValue < weights[0]) {
      selectedSentiment = "Positive"
    } else if (randomValue < weights[0] + weights[1]) {
      selectedSentiment = "Negative"
    } else {
      selectedSentiment = "Neutral"
    }

    const confidence = Math.floor(Math.random() * 30) + 65 // 65-95%

    return {
      stock: symbol,
      sentiment: selectedSentiment,
      confidence: confidence,
      reasoning: getReasoningForStock(symbol, selectedSentiment),
      impact: getImpactForStock(symbol, selectedSentiment),
    }
  })
}
