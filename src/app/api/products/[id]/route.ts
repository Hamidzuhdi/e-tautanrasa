// // src/app/api/products/[id]/route.ts
// import { NextRequest, NextResponse } from "next/server"
// import { prisma } from "@/lib/prisma"
// import { getServerSession } from "next-auth"
// import { authOptions } from "@/lib/auth"

// // GET single product
// export async function GET(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const productId = parseInt(params.id)
    
//     const product = await prisma.product.findUnique({
//       where: { id: productId },
//       include: {
//         category: true,
//         reviews: {
//           include: { user: { select: { name: true } } },
//           orderBy: { createdAt: 'desc' }
//         },
//         _count: { select: { reviews: true, carts: true } }
//       }
//     })

//     if (!product) {
//       return NextResponse.json(
//         { error: "Product not found" },
//         { status: 404 }
//       )
//     }

//     return NextResponse.json(product)
//   } catch (error) {
//     console.error("Error fetching product:", error)
//     return NextResponse.json(
//       { error: "Failed to fetch product" },
//       { status: 500 }
//     )
//   }
// }

// // PUT update product (Admin only)
// export async function PUT(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const session = await getServerSession(authOptions)
    
//     if (!session || session.user.role !== 'ADMIN') {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 401 }
//       )
//     }

//     const productId = parseInt(params.id)
//     const body = await request.json()
//     const { name, slug, description, price, images, categoryId, stock, status } = body

//     const product = await prisma.product.update({
//       where: { id: productId },
//       data: {
//         name,
//         slug,
//         description,
//         price: parseFloat(price),
//         images,
//         categoryId: parseInt(categoryId),
//         stock: parseInt(stock),
//         status
//       },
//       include: {
//         category: true
//       }
//     })

//     return NextResponse.json(product)
//   } catch (error) {
//     console.error("Error updating product:", error)
//     return NextResponse.json(
//       { error: "Failed to update product" },
//       { status: 500 }
//     )
//   }
// }

// // DELETE product (Admin only)
// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const session = await getServerSession(authOptions)
    
//     if (!session || session.user.role !== 'ADMIN') {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 401 }
//       )
//     }

//     const productId = parseInt(params.id)

//     // Check if product has orders
//     const ordersCount = await prisma.orderItem.count({
//       where: { productId }
//     })

//     if (ordersCount > 0) {
//       return NextResponse.json(
//         { error: "Cannot delete product with existing orders. Set status to INACTIVE instead." },
//         { status: 400 }
//       )
//     }

//     await prisma.product.delete({
//       where: { id: productId }
//     })

//     return NextResponse.json({ message: "Product deleted successfully" })
//   } catch (error) {
//     console.error("Error deleting product:", error)
//     return NextResponse.json(
//       { error: "Failed to delete product" },
//       { status: 500 }
//     )
//   }
// }

// // PATCH toggle product status (Admin only)
// export async function PATCH(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const session = await getServerSession(authOptions)
    
//     if (!session || session.user.role !== 'ADMIN') {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 401 }
//       )
//     }

//     const productId = parseInt(params.id)
//     const body = await request.json()
//     const { status } = body

//     const product = await prisma.product.update({
//       where: { id: productId },
//       data: { status },
//       include: { category: true }
//     })

//     return NextResponse.json(product)
//   } catch (error) {
//     console.error("Error updating product status:", error)
//     return NextResponse.json(
//       { error: "Failed to update product status" },
//       { status: 500 }
//     )
//   }
// }