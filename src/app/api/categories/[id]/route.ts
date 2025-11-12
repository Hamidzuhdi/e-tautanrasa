// src/app/api/categories/[id]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// GET single category
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const categoryId = parseInt(params.id)
    
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        _count: {
          select: { products: true }
        }
      }
    })

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      )
    }

    // Transform data for frontend compatibility
    const transformedCategory = {
      id: category.id,
      nama: category.name,
      slug: category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: category.description || '',
      image: category.image || '/img/LOGO BRAND TAUTAN RASA.jpg',
      icon: '🌸', // Default icon
      is_active: category.status === 'ACTIVE',
      product_count: category._count.products,
      created_at: category.createdAt.toISOString()
    }

    return NextResponse.json(transformedCategory)
  } catch (error) {
    console.error("Error fetching category:", error)
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    )
  }
}

// PUT update category
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const categoryId = parseInt(params.id)
    const body = await request.json()
    const { nama, description, image, icon, is_active } = body

    if (!nama) {
      return NextResponse.json(
        { error: "Nama kategori wajib diisi" },
        { status: 400 }
      )
    }

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId }
    })

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      )
    }

    // Check if name is taken by another category
    if (nama !== existingCategory.name) {
      const nameExists = await prisma.category.findUnique({
        where: { name: nama }
      })

      if (nameExists) {
        return NextResponse.json(
          { error: "Nama kategori sudah ada" },
          { status: 400 }
        )
      }
    }

    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: {
        name: nama,
        description: description || '',
        image: image || '/img/LOGO BRAND TAUTAN RASA.jpg',
        status: is_active ? 'ACTIVE' : 'INACTIVE'
      },
      include: {
        _count: {
          select: { products: true }
        }
      }
    })

    // Transform response for frontend compatibility
    const transformedCategory = {
      id: updatedCategory.id,
      nama: updatedCategory.name,
      slug: updatedCategory.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: updatedCategory.description || '',
      image: updatedCategory.image || '/img/LOGO BRAND TAUTAN RASA.jpg',
      icon: icon || '🌸',
      is_active: updatedCategory.status === 'ACTIVE',
      product_count: updatedCategory._count.products,
      created_at: updatedCategory.createdAt.toISOString()
    }

    return NextResponse.json(transformedCategory)
  } catch (error) {
    console.error("Error updating category:", error)
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    )
  }
}

// DELETE category
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const categoryId = parseInt(params.id)

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        _count: {
          select: { products: true }
        }
      }
    })

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      )
    }

    // Check if category has products
    if (existingCategory._count.products > 0) {
      return NextResponse.json(
        { error: "Tidak dapat menghapus kategori yang memiliki produk" },
        { status: 400 }
      )
    }

    await prisma.category.delete({
      where: { id: categoryId }
    })

    return NextResponse.json(
      { message: "Category deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    )
  }
}

// PATCH toggle status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const categoryId = parseInt(params.id)
    const body = await request.json()
    const { is_active } = body

    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: {
        status: is_active ? 'ACTIVE' : 'INACTIVE'
      },
      include: {
        _count: {
          select: { products: true }
        }
      }
    })

    // Transform response for frontend compatibility
    const transformedCategory = {
      id: updatedCategory.id,
      nama: updatedCategory.name,
      slug: updatedCategory.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: updatedCategory.description || '',
      image: updatedCategory.image || '/img/LOGO BRAND TAUTAN RASA.jpg',
      icon: '🌸',
      is_active: updatedCategory.status === 'ACTIVE',
      product_count: updatedCategory._count.products,
      created_at: updatedCategory.createdAt.toISOString()
    }

    return NextResponse.json(transformedCategory)
  } catch (error) {
    console.error("Error toggling category status:", error)
    return NextResponse.json(
      { error: "Failed to toggle category status" },
      { status: 500 }
    )
  }
}