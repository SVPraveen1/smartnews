// Script to create demo user and sample data
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createDemoUser() {
  try {
    // Check if demo user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'demo@smartinvest.com' }
    })

    if (existingUser) {
      console.log('Demo user already exists!')
      return
    }

    // Create demo user
    const hashedPassword = await bcrypt.hash('demo123', 10)
    
    const demoUser = await prisma.user.create({
      data: {
        email: 'demo@smartinvest.com',
        name: 'Demo User',
        password: hashedPassword,
        notifications: true
      }
    })

    console.log('Demo user created:', demoUser.email)

    // Create sample portfolio stocks
    const sampleStocks = [
      { symbol: 'RELIANCE', name: 'Reliance Industries Ltd', quantity: 10, avgPrice: 2500.50 },
      { symbol: 'TCS', name: 'Tata Consultancy Services', quantity: 5, avgPrice: 3200.75 },
      { symbol: 'INFY', name: 'Infosys Limited', quantity: 15, avgPrice: 1450.25 },
      { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd', quantity: 8, avgPrice: 2750.00 },
      { symbol: 'ICICIBANK', name: 'ICICI Bank Limited', quantity: 12, avgPrice: 950.30 }
    ]

    for (const stock of sampleStocks) {
      await prisma.portfolio.create({
        data: {
          userId: demoUser.id,
          ...stock
        }
      })
    }

    console.log('Sample portfolio created!')

  } catch (error) {
    console.error('Error creating demo user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createDemoUser()
