// src/app/api/categories/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// GET all categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { status: 'ACTIVE' }, // Only get active categories
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { products: true }
        }
      }
    })

    // Transform data for frontend compatibility
    const transformedCategories = categories.map(category => ({
      id: category.id,
      nama: category.name,
      slug: category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: category.description || '',
      image: category.image || '/img/LOGO BRAND TAUTAN RASA.jpg',
      icon: '🌸', // Default icon, bisa ditambah field di schema nanti
      is_active: category.status === 'ACTIVE',
      product_count: category._count.products,
      created_at: category.createdAt.toISOString()
    }))
    
    return NextResponse.json(transformedCategories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    )
  }
}

// POST create category
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { nama, description, image, icon } = body

    if (!nama) {
      return NextResponse.json(
        { error: "Nama kategori wajib diisi" },
        { status: 400 }
      )
    }

    // Check if category name already exists
    const existingCategory = await prisma.category.findUnique({
      where: { name: nama }
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: "Nama kategori sudah ada" },
        { status: 400 }
      )
    }

    const category = await prisma.category.create({
      data: {
        name: nama,
        description: description || '',
        image: image || '/img/LOGO BRAND TAUTAN RASA.jpg',
        status: 'ACTIVE'
      }
    })

    // Transform response for frontend compatibility
    const transformedCategory = {
      id: category.id,
      nama: category.name,
      slug: category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: category.description || '',
      image: category.image || '/img/LOGO BRAND TAUTAN RASA.jpg',
      icon: icon || '🌸',
      is_active: category.status === 'ACTIVE',
      product_count: 0,
      created_at: category.createdAt.toISOString()
    }

    return NextResponse.json(transformedCategory, { status: 201 })
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    )
  }
}