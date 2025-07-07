"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { TrendingUp, Plus, Trash2, Edit, PieChart, DollarSign, LogOut } from "lucide-react"
import Link from "next/link"

interface PortfolioStock {
  symbol: string
  name: string
  quantity: number
  avgPrice: number
}

const POPULAR_STOCKS = [
  { symbol: "RELIANCE", name: "Reliance Industries Ltd" },
  { symbol: "TCS", name: "Tata Consultancy Services" },
  { symbol: "HDFCBANK", name: "HDFC Bank Ltd" },
  { symbol: "INFY", name: "Infosys Ltd" },
  { symbol: "HINDUNILVR", name: "Hindustan Unilever Ltd" },
  { symbol: "ICICIBANK", name: "ICICI Bank Ltd" },
  { symbol: "BHARTIARTL", name: "Bharti Airtel Ltd" },
  { symbol: "ITC", name: "ITC Ltd" },
  { symbol: "SBIN", name: "State Bank of India" },
  { symbol: "LT", name: "Larsen & Toubro Ltd" },
  { symbol: "WIPRO", name: "Wipro Ltd" },
  { symbol: "MARUTI", name: "Maruti Suzuki India Ltd" },
  { symbol: "ASIANPAINT", name: "Asian Paints Ltd" },
  { symbol: "HCLTECH", name: "HCL Technologies Ltd" },
  { symbol: "BAJFINANCE", name: "Bajaj Finance Ltd" },
]

interface AppUser {
  id: string
  name: string
  email: string
}

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<PortfolioStock[]>([])
  const [user, setUser] = useState<AppUser | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingStock, setEditingStock] = useState<PortfolioStock | null>(null)
  const [formData, setFormData] = useState({
    symbol: "",
    name: "",
    quantity: "",
    avgPrice: "",
  })
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

    // Load portfolio from localStorage with user-specific key
    const savedPortfolio = localStorage.getItem(`portfolio_${userData.id}`)
    if (savedPortfolio) {
      setPortfolio(JSON.parse(savedPortfolio))
    }
  }, [router])

  const savePortfolio = (newPortfolio: PortfolioStock[]) => {
    if (!user) return
    setPortfolio(newPortfolio)
    localStorage.setItem(`portfolio_${user.id}`, JSON.stringify(newPortfolio))
  }

  const handleAddStock = () => {
    if (!formData.symbol || !formData.name || !formData.quantity || !formData.avgPrice) {
      alert("Please fill all fields")
      return
    }

    const newStock: PortfolioStock = {
      symbol: formData.symbol.toUpperCase(),
      name: formData.name,
      quantity: Number.parseInt(formData.quantity),
      avgPrice: Number.parseFloat(formData.avgPrice),
    }

    const existingIndex = portfolio.findIndex((stock) => stock.symbol === newStock.symbol)

    if (existingIndex >= 0) {
      // Update existing stock
      const updatedPortfolio = [...portfolio]
      updatedPortfolio[existingIndex] = newStock
      savePortfolio(updatedPortfolio)
    } else {
      // Add new stock
      savePortfolio([...portfolio, newStock])
    }

    setFormData({ symbol: "", name: "", quantity: "", avgPrice: "" })
    setIsAddDialogOpen(false)
    setEditingStock(null)
  }

  const handleEditStock = (stock: PortfolioStock) => {
    setEditingStock(stock)
    setFormData({
      symbol: stock.symbol,
      name: stock.name,
      quantity: stock.quantity.toString(),
      avgPrice: stock.avgPrice.toString(),
    })
    setIsAddDialogOpen(true)
  }

  const handleDeleteStock = (symbol: string) => {
    if (confirm("Are you sure you want to remove this stock from your portfolio?")) {
      const updatedPortfolio = portfolio.filter((stock) => stock.symbol !== symbol)
      savePortfolio(updatedPortfolio)
    }
  }

  const handleQuickAdd = (stock: { symbol: string; name: string }) => {
    setFormData({
      symbol: stock.symbol,
      name: stock.name,
      quantity: "",
      avgPrice: "",
    })
    setIsAddDialogOpen(true)
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/")
  }

  const getTotalValue = () => {
    return portfolio.reduce((total, stock) => total + stock.quantity * stock.avgPrice, 0)
  }

  const getTotalStocks = () => {
    return portfolio.reduce((total, stock) => total + stock.quantity, 0)
  }

  if (!user) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Portfolio Management</h2>
            <p className="text-gray-600 text-sm sm:text-base">Manage your stock holdings and track your investments</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingStock(null)
                  setFormData({ symbol: "", name: "", quantity: "", avgPrice: "" })
                }}
                size="sm"
                className="w-full sm:w-auto"
              >
                <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Add Stock
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-md">
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl">
                  {editingStock ? "Edit Stock" : "Add New Stock"}
                </DialogTitle>
                <DialogDescription className="text-sm">
                  {editingStock ? "Update your stock details" : "Add a new stock to your portfolio"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="symbol" className="text-sm">
                    Stock Symbol
                  </Label>
                  <Input
                    id="symbol"
                    placeholder="e.g., RELIANCE"
                    value={formData.symbol}
                    onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="name" className="text-sm">
                    Company Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="e.g., Reliance Industries Ltd"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="quantity" className="text-sm">
                    Quantity
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="Number of shares"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="avgPrice" className="text-sm">
                    Average Price (₹)
                  </Label>
                  <Input
                    id="avgPrice"
                    type="number"
                    step="0.01"
                    placeholder="Average purchase price"
                    value={formData.avgPrice}
                    onChange={(e) => setFormData({ ...formData, avgPrice: e.target.value })}
                    className="text-sm"
                  />
                </div>
                <Button onClick={handleAddStock} className="w-full">
                  {editingStock ? "Update Stock" : "Add Stock"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Portfolio Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <PieChart className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Total Stocks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">{portfolio.length}</div>
              <p className="text-xs sm:text-sm text-gray-600">Different companies</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Total Shares
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">{getTotalStocks()}</div>
              <p className="text-xs sm:text-sm text-gray-600">Total quantity</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Portfolio Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">₹{getTotalValue().toLocaleString()}</div>
              <p className="text-xs sm:text-sm text-gray-600">Based on avg. price</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Portfolio Holdings */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Your Holdings</CardTitle>
                <CardDescription className="text-sm">Current stocks in your portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                {portfolio.length > 0 ? (
                  <div className="space-y-4">
                    {portfolio.map((stock, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 sm:p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3">
                            <div className="min-w-0 flex-1">
                              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{stock.symbol}</h3>
                              <p className="text-xs sm:text-sm text-gray-600 truncate">{stock.name}</p>
                            </div>
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                            <span>{stock.quantity} shares</span>
                            <span>₹{stock.avgPrice} avg</span>
                            <Badge variant="outline" className="text-xs">
                              ₹{(stock.quantity * stock.avgPrice).toLocaleString()} total
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2 ml-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditStock(stock)}>
                            <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteStock(stock.symbol)}>
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 sm:py-12">
                    <PieChart className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No stocks in your portfolio</h3>
                    <p className="text-gray-600 mb-4 text-sm sm:text-base">
                      Start building your portfolio by adding your first stock
                    </p>
                    <Button onClick={() => setIsAddDialogOpen(true)} size="sm">
                      <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                      Add Your First Stock
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Add Stocks */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Popular Stocks</CardTitle>
                <CardDescription className="text-sm">Quick add popular Indian stocks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {POPULAR_STOCKS.map((stock, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 sm:p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-xs sm:text-sm">{stock.symbol}</div>
                        <div className="text-xs text-gray-600 line-clamp-1">{stock.name}</div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickAdd(stock)}
                        disabled={portfolio.some((p) => p.symbol === stock.symbol)}
                        className="text-xs ml-2"
                      >
                        {portfolio.some((p) => p.symbol === stock.symbol) ? "Added" : "Add"}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
