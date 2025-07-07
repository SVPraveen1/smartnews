import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const portfolio = await prisma.portfolio.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ portfolio })

  } catch (error) {
    console.error('Portfolio fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, symbol, name, quantity, avgPrice } = await request.json()

    if (!userId || !symbol || !name || !quantity || !avgPrice) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if stock already exists in portfolio
    const existingStock = await prisma.portfolio.findFirst({
      where: {
        userId,
        symbol
      }
    })

    if (existingStock) {
      // Update existing stock
      const updatedStock = await prisma.portfolio.update({
        where: { id: existingStock.id },
        data: {
          quantity: existingStock.quantity + quantity,
          avgPrice: ((existingStock.avgPrice * existingStock.quantity) + (avgPrice * quantity)) / (existingStock.quantity + quantity)
        }
      })
      return NextResponse.json({ stock: updatedStock })
    } else {
      // Create new stock entry
      const newStock = await prisma.portfolio.create({
        data: {
          userId,
          symbol,
          name,
          quantity,
          avgPrice
        }
      })
      return NextResponse.json({ stock: newStock })
    }

  } catch (error) {
    console.error('Portfolio add error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, quantity, avgPrice } = await request.json()

    if (!id || quantity === undefined || avgPrice === undefined) {
      return NextResponse.json(
        { error: 'ID, quantity, and avgPrice are required' },
        { status: 400 }
      )
    }

    const updatedStock = await prisma.portfolio.update({
      where: { id },
      data: { quantity, avgPrice }
    })

    return NextResponse.json({ stock: updatedStock })

  } catch (error) {
    console.error('Portfolio update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Stock ID is required' },
        { status: 400 }
      )
    }

    await prisma.portfolio.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Stock removed from portfolio' })

  } catch (error) {
    console.error('Portfolio delete error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
