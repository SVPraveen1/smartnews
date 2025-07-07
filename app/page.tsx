import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Newspaper, PieChart, Brain, ArrowRight, BarChart3, Bell, Shield, Users, Lock } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="py-12 sm:py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Smart News + Portfolio Insights
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed px-4">
              Stay ahead of the Indian stock market with AI-powered news curation, portfolio tracking, and intelligent
              insights that help you make informed investment decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3"
                >
                  Get Started <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
              <Link href="/news">
                <Button variant="outline" size="lg" className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-transparent">
                  View Latest News
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Powerful Features for Smart Investing</h3>
            <p className="text-gray-600 max-w-2xl mx-auto px-4">
              Our platform combines real-time news, portfolio management, and AI analysis to give you the edge in the
              Indian stock market.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center sm:text-left">
                <Newspaper className="h-10 w-10 sm:h-12 sm:w-12 text-blue-600 mb-4 mx-auto sm:mx-0" />
                <CardTitle className="text-lg sm:text-xl">Real-time News Curation</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Automatically curated stock market news from trusted Indian sources like Economic Times and
                  Moneycontrol.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center sm:text-left">
                <PieChart className="h-10 w-10 sm:h-12 sm:w-12 text-green-600 mb-4 mx-auto sm:mx-0" />
                <CardTitle className="text-lg sm:text-xl">Portfolio Management</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Link and manage your stock portfolio with easy-to-use tools and comprehensive tracking features.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center sm:text-left">
                <Brain className="h-10 w-10 sm:h-12 sm:w-12 text-purple-600 mb-4 mx-auto sm:mx-0" />
                <CardTitle className="text-lg sm:text-xl">AI-Powered Insights</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Get intelligent analysis of how market news impacts your specific holdings with confidence scores and
                  reasoning.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center sm:text-left">
                <BarChart3 className="h-10 w-10 sm:h-12 sm:w-12 text-orange-600 mb-4 mx-auto sm:mx-0" />
                <CardTitle className="text-lg sm:text-xl">Filtered News Feed</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  See only the news that matters to your portfolio stocks, saving you time and keeping you focused.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center sm:text-left">
                <Bell className="h-10 w-10 sm:h-12 sm:w-12 text-red-600 mb-4 mx-auto sm:mx-0" />
                <CardTitle className="text-lg sm:text-xl">Smart Alerts</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Receive notifications when important news affects your holdings with customizable alert preferences.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center sm:text-left">
                <Shield className="h-10 w-10 sm:h-12 sm:w-12 text-indigo-600 mb-4 mx-auto sm:mx-0" />
                <CardTitle className="text-lg sm:text-xl">Secure & Reliable</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Built with security and reliability in mind, ensuring your portfolio data is safe and always
                  accessible.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Ready to Transform Your Investment Strategy?
            </h3>
            <p className="text-blue-100 mb-6 sm:mb-8 text-base sm:text-lg px-4">
              Join thousands of smart investors who use our platform to stay ahead of market trends and make informed
              decisions.
            </p>
            <Link href="/auth/register">
              <Button size="lg" variant="secondary" className="px-6 sm:px-8 py-3">
                Start Your Journey <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
                <span className="text-lg sm:text-xl font-bold">SmartInvest</span>
              </div>
              <p className="text-gray-400 text-sm sm:text-base">
                Empowering investors with AI-driven insights and real-time market intelligence.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm sm:text-base">Platform</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <Link href="/dashboard" className="hover:text-white transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/portfolio" className="hover:text-white transition-colors">
                    Portfolio
                  </Link>
                </li>
                <li>
                  <Link href="/news" className="hover:text-white transition-colors">
                    News
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm sm:text-base">Features</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Real-time News</li>
                <li>AI Analysis</li>
                <li>Portfolio Tracking</li>
                <li>Smart Alerts</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm sm:text-base">Support</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 SmartInvest. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
