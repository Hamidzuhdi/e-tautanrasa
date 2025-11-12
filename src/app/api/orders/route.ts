// // src/app/api/orders/route.ts
// import { NextRequest, NextResponse } from "next/server"
// import { prisma } from "@/lib/prisma"
// import { getServerSession } from "next-auth"
// import { authOptions } from "@/lib/auth"

// // GET orders
// export async function GET(request: NextRequest) {
//   try {
//     const session = await getServerSession(authOptions)
    
//     if (!session) {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 401 }
//       )
//     }

//     const { searchParams } = new URL(request.url)
//     const status = searchParams.get('status')
//     const page = parseInt(searchParams.get('page') || '1')
//     const limit = parseInt(searchParams.get('limit') || '20')

//     const where: any = {}

//     // Customers can only see their own orders, admins see all
//     if (session.user.role !== 'ADMIN') {
//       where.userId = parseInt(session.user.id)
//     }

//     if (status) {
//       where.status = status
//     }

//     const orders = await prisma.order.findMany({
//       where,
//       include: {
//         user: {
//           select: { name: true, email: true }
//         },
//         items: {
//           include: {
//             product: {
//               select: { name: true, images: true }
//             }
//           }
//         }
//       },
//       orderBy: { createdAt: 'desc' },
//       skip: (page - 1) * limit,
//       take: limit
//     })

//     const total = await prisma.order.count({ where })

//     return NextResponse.json({
//       orders,
//       pagination: {
//         page,
//         limit,
//         total,
//         pages: Math.ceil(total / limit)
//       }
//     })
//   } catch (error) {
//     console.error("Error fetching orders:", error)
//     return NextResponse.json(
//       { error: "Failed to fetch orders" },
//       { status: 500 }
//     )
//   }
// }

// // POST create order
// export async function POST(request: NextRequest) {
//   try {
//     const session = await getServerSession(authOptions)
    
//     if (!session) {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 401 }
//       )
//     }

//     const body = await request.json()
//     const { items, shippingAddress, paymentMethod } = body

//     if (!items || items.length === 0) {
//       return NextResponse.json(
//         { error: "Order items are required" },
//         { status: 400 }
//       )
//     }

//     // Calculate total
//     let totalAmount = 0
//     for (const item of items) {
//       const product = await prisma.product.findUnique({
//         where: { id: item.productId }
//       })

//       if (!product) {
//         return NextResponse.json(
//           { error: `Product with ID ${item.productId} not found` },
//           { status: 400 }
//         )
//       }

//       if (product.stock < item.quantity) {
//         return NextResponse.json(
//           { error: `Insufficient stock for product ${product.name}` },
//           { status: 400 }
//         )
//       }

//       totalAmount += product.price * item.quantity
//     }

//     // Create order with transaction
//     const order = await prisma.$transaction(async (tx) => {
//       // Create order
//       const newOrder = await tx.order.create({
//         data: {
//           userId: parseInt(session.user.id),
//           totalAmount,
//           status: 'PENDING',
//           shippingAddress,
//           paymentMethod,
//           items: {
//             create: items.map((item: any) => ({
//               productId: item.productId,
//               quantity: item.quantity,
//               price: item.price
//             }))
//           }
//         },
//         include: {
//           items: {
//             include: {
//               product: true
//             }
//           }
//         }
//       })

//       // Update product stock
//       for (const item of items) {
//         await tx.product.update({
//           where: { id: item.productId },
//           data: {
//             stock: {
//               decrement: item.quantity
//             }
//           }
//         })
//       }

//       // Clear user's cart
//       await tx.cart.deleteMany({
//         where: { userId: parseInt(session.user.id) }
//       })

//       return newOrder
//     })

//     return NextResponse.json(order, { status: 201 })
//   } catch (error) {
//     console.error("Error creating order:", error)
//     return NextResponse.json(
//       { error: "Failed to create order" },
//       { status: 500 }
//     )
//   }
// }