import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Use the environment variable key that matches what you provided
    const apiKey = process.env.newsdata_api_key

    if (!apiKey) {
      console.error("News API key not found in environment variables")
      return NextResponse.json({
        results: getMockNews(),
        totalResults: 15,
        status: "mock_data",
        error: "API key not configured",
      })
    }

    // Simplified parameters according to NewsData.io documentation
    const params = new URLSearchParams({
      apikey: apiKey,
      country: "in",
      category: "business",
      language: "en",
      size: "10",
    })

    console.log("Fetching news with correct parameters...")

    const response = await fetch(`https://newsdata.io/api/1/news?${params}`, {
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 600 }, // Cache for 10 minutes
    })

    if (!response.ok) {
      console.error(`News API error: ${response.status} - ${response.statusText}`)
      const errorText = await response.text()
      console.error("Error response:", errorText)

      return NextResponse.json({
        results: getMockNews(),
        totalResults: 15,
        status: "mock_data",
        error: `API error: ${response.status}`,
      })
    }

    const data = await response.json()
    console.log("News API response:", data.status, "Results:", data.results?.length || 0)

    return NextResponse.json({
      results: data.results || getMockNews(),
      totalResults: data.totalResults || 0,
      status: "success",
    })
  } catch (error) {
    console.error("Error fetching news:", error)

    return NextResponse.json({
      results: getMockNews(),
      totalResults: 12,
      status: "mock_data",
      error: "Network error",
    })
  }
}

function getMockNews() {
  return [
    {
      title: "Indian Stock Market Shows Strong Performance Amid Global Uncertainty",
      description:
        "The BSE Sensex and NSE Nifty indices have shown resilience despite global market volatility, with banking and IT sectors leading the gains. Market experts suggest that domestic factors are supporting the upward momentum.",
      link: "https://economictimes.indiatimes.com/markets/stocks/news",
      pubDate: new Date().toISOString(),
      source_id: "economictimes_indiatimes",
      category: ["business"],
    },
    {
      title: "RBI Monetary Policy Decision Expected to Impact Market Sentiment",
      description:
        "Investors are closely watching the Reserve Bank of India's upcoming monetary policy announcement for signals on interest rate direction. The decision could significantly influence market trends in the coming weeks.",
      link: "https://www.moneycontrol.com/news/business/markets/",
      pubDate: new Date(Date.now() - 3600000).toISOString(),
      source_id: "moneycontrol",
      category: ["business"],
    },
    {
      title: "IT Sector Stocks Rally on Strong Q3 Earnings Outlook",
      description:
        "Major IT companies like TCS, Infosys, and Wipro are seeing increased investor interest ahead of their quarterly earnings announcements. The sector is expected to benefit from continued digital transformation trends.",
      link: "https://www.business-standard.com/markets/news",
      pubDate: new Date(Date.now() - 7200000).toISOString(),
      source_id: "business_standard",
      category: ["business"],
    },
    {
      title: "Banking Stocks Surge on Improved Credit Growth Prospects",
      description:
        "HDFC Bank, ICICI Bank, and SBI shares have gained momentum as analysts project better credit growth in the upcoming quarters. The banking sector is showing signs of recovery from previous challenges.",
      link: "https://www.livemint.com/market/stock-market-news",
      pubDate: new Date(Date.now() - 10800000).toISOString(),
      source_id: "livemint",
      category: ["business"],
    },
    {
      title: "Foreign Institutional Investors Show Renewed Interest in Indian Markets",
      description:
        "FII inflows have picked up pace in recent weeks, with international investors showing confidence in India's economic growth story. This trend is providing additional support to market indices.",
      link: "https://www.financialexpress.com/market/",
      pubDate: new Date(Date.now() - 14400000).toISOString(),
      source_id: "financialexpress",
      category: ["business"],
    },
    {
      title: "SEBI Introduces New Regulations for Mutual Fund Industry",
      description:
        "The Securities and Exchange Board of India has announced new guidelines aimed at enhancing transparency and investor protection in the mutual fund sector.",
      link: "https://www.thehindu.com/business/markets/",
      pubDate: new Date(Date.now() - 18000000).toISOString(),
      source_id: "thehindu",
      category: ["business"],
    },
    {
      title: "Startup Funding in India Reaches New Milestone",
      description:
        "Indian startups have raised record funding this quarter, with fintech and e-commerce sectors leading the investment activity. This reflects growing confidence in India's digital economy.",
      link: "https://indianexpress.com/section/business/",
      pubDate: new Date(Date.now() - 21600000).toISOString(),
      source_id: "indianexpress",
      category: ["business"],
    },
    {
      title: "Infrastructure Sector Gets Major Government Boost",
      description:
        "The government has announced a new infrastructure development package worth ₹10 lakh crore, focusing on roads, railways, and digital infrastructure to boost economic growth.",
      link: "https://www.deccanherald.com/business",
      pubDate: new Date(Date.now() - 25200000).toISOString(),
      source_id: "deccanherald",
      category: ["business"],
    },
    {
      title: "Renewable Energy Stocks Rally on Policy Support",
      description:
        "Solar and wind energy companies are seeing strong investor interest following new government policies and international climate commitments.",
      link: "https://www.ndtv.com/business",
      pubDate: new Date(Date.now() - 28800000).toISOString(),
      source_id: "ndtv",
      category: ["business"],
    },
    {
      title: "Cryptocurrency Regulations Clarity Expected Soon",
      description:
        "The government is expected to provide clarity on cryptocurrency regulations, which could significantly impact the digital asset market in India.",
      link: "https://www.timesnow.com/business-news",
      pubDate: new Date(Date.now() - 32400000).toISOString(),
      source_id: "timesnow",
      category: ["business"],
    },
    {
      title: "Pharmaceutical Exports from India Hit Record High",
      description:
        "Indian pharmaceutical companies have achieved record export figures, driven by strong demand for generic medicines and vaccines in global markets.",
      link: "https://timesofindia.indiatimes.com/business/",
      pubDate: new Date(Date.now() - 36000000).toISOString(),
      source_id: "toi",
      category: ["business"],
    },
    {
      title: "Auto Sector Shows Signs of Recovery Post-Pandemic",
      description:
        "Major automotive companies report improved sales figures as the industry recovers from pandemic-related disruptions, with electric vehicle adoption gaining momentum.",
      link: "https://www.financialexpress.com/auto/",
      pubDate: new Date(Date.now() - 39600000).toISOString(),
      source_id: "financialexpress",
      category: ["business"],
    },
    {
      title: "GST Collections Cross ₹1.5 Lakh Crore Mark",
      description:
        "India's GST collections have crossed the ₹1.5 lakh crore milestone, indicating strong economic recovery and improved tax compliance across the country.",
      link: "https://www.cnbctv18.com/business/",
      pubDate: new Date(Date.now() - 43200000).toISOString(),
      source_id: "cnbctv18",
      category: ["business"],
    },
    {
      title: "Digital Payments Surge to New Heights",
      description:
        "UPI transactions have reached record levels, with digital payments becoming the preferred mode of transaction for millions of Indians across urban and rural areas.",
      link: "https://www.bloombergquint.com/business/",
      pubDate: new Date(Date.now() - 46800000).toISOString(),
      source_id: "bloombergquint",
      category: ["business"],
    },
    {
      title: "Real Estate Market Shows Strong Recovery",
      description:
        "Property sales have increased significantly in major cities, with affordable housing and commercial real estate leading the recovery in the post-pandemic era.",
      link: "https://www.zeebiz.com/markets/",
      pubDate: new Date(Date.now() - 50400000).toISOString(),
      source_id: "zeebiz",
      category: ["business"],
    },
  ]
}
