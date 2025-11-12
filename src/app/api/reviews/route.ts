// src/app/api/reviews/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// GET reviews
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    const userId = searchParams.get('userId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where: any = {}

    if (productId) {
      where.productId = parseInt(productId)
    }

    if (userId) {
      where.userId = parseInt(userId)
    }

    const reviews = await prisma.review.findMany({
      where,
      include: {
        user: {
          select: { name: true }
        },
        product: {
          select: { name: true, images: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    })

    const total = await prisma.review.count({ where })

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    )
  }
}

// POST create review
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { productId, rating, comment } = body

    if (!productId || !rating) {
      return NextResponse.json(
        { error: "Product ID and rating are required" },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      )
    }

    // Check if user has purchased this product
    const order = await prisma.order.findFirst({
      where: {
        userId: parseInt(session.user.id),
        status: 'DELIVERED',
        items: {
          some: {
            productId: parseInt(productId)
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json(
        { error: "You can only review products you have purchased" },
        { status: 400 }
      )
    }

    // Check if user already reviewed this product
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: parseInt(session.user.id),
        productId: parseInt(productId)
      }
    })

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this product" },
        { status: 400 }
      )
    }

    const review = await prisma.review.create({
      data: {
        userId: parseInt(session.user.id),
        productId: parseInt(productId),
        rating,
        comment
      },
      include: {
        user: {
          select: { name: true }
        },
        product: {
          select: { name: true }
        }
      }
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    )
  }
}