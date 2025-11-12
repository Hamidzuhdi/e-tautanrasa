// // src/app/api/cart/route.ts
// import { NextRequest, NextResponse } from "next/server"
// import { prisma } from "@/lib/prisma"
// import { getServerSession } from "next-auth"
// import { authOptions } from "@/lib/auth"

// // GET user cart
// export async function GET() {
//   try {
//     const session = await getServerSession(authOptions)
    
//     if (!session) {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 401 }
//       )
//     }

//     const cartItems = await prisma.cart.findMany({
//       where: { userId: parseInt(session.user.id) },
//       include: {
//         product: {
//           select: {
//             id: true,
//             name: true,
//             price: true,
//             images: true,
//             stock: true,
//             status: true
//           }
//         }
//       },
//       orderBy: { createdAt: 'desc' }
//     })

//     // Calculate total
//     const total = cartItems.reduce((sum, item) => {
//       return sum + (item.product.price * item.quantity)
//     }, 0)

//     return NextResponse.json({
//       items: cartItems,
//       total,
//       itemCount: cartItems.length
//     })
//   } catch (error) {
//     console.error("Error fetching cart:", error)
//     return NextResponse.json(
//       { error: "Failed to fetch cart" },
//       { status: 500 }
//     )
//   }
// }

// // POST add item to cart
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
//     const { productId, quantity } = body

//     if (!productId || !quantity || quantity <= 0) {
//       return NextResponse.json(
//         { error: "Valid product ID and quantity are required" },
//         { status: 400 }
//       )
//     }

//     // Check if product exists and has stock
//     const product = await prisma.product.findUnique({
//       where: { id: parseInt(productId) }
//     })

//     if (!product) {
//       return NextResponse.json(
//         { error: "Product not found" },
//         { status: 404 }
//       )
//     }

//     if (product.status !== 'ACTIVE') {
//       return NextResponse.json(
//         { error: "Product is not available" },
//         { status: 400 }
//       )
//     }

//     if (product.stock < quantity) {
//       return NextResponse.json(
//         { error: `Only ${product.stock} items available in stock` },
//         { status: 400 }
//       )
//     }

//     // Check if item already in cart
//     const existingCartItem = await prisma.cart.findFirst({
//       where: {
//         userId: parseInt(session.user.id),
//         productId: parseInt(productId)
//       }
//     })

//     let cartItem
//     if (existingCartItem) {
//       // Update quantity
//       const newQuantity = existingCartItem.quantity + quantity
      
//       if (newQuantity > product.stock) {
//         return NextResponse.json(
//           { error: `Cannot add more. Only ${product.stock} items available in stock` },
//           { status: 400 }
//         )
//       }

//       cartItem = await prisma.cart.update({
//         where: { id: existingCartItem.id },
//         data: { quantity: newQuantity },
//         include: {
//           product: {
//             select: {
//               id: true,
//               name: true,
//               price: true,
//               images: true,
//               stock: true
//             }
//           }
//         }
//       })
//     } else {
//       // Create new cart item
//       cartItem = await prisma.cart.create({
//         data: {
//           userId: parseInt(session.user.id),
//           productId: parseInt(productId),
//           quantity
//         },
//         include: {
//           product: {
//             select: {
//               id: true,
//               name: true,
//               price: true,
//               images: true,
//               stock: true
//             }
//           }
//         }
//       })
//     }

//     return NextResponse.json(cartItem, { status: 201 })
//   } catch (error) {
//     console.error("Error adding to cart:", error)
//     return NextResponse.json(
//       { error: "Failed to add item to cart" },
//       { status: 500 }
//     )
//   }
// }

// // DELETE clear cart
// export async function DELETE() {
//   try {
//     const session = await getServerSession(authOptions)
    
//     if (!session) {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 401 }
//       )
//     }

//     await prisma.cart.deleteMany({
//       where: { userId: parseInt(session.user.id) }
//     })

//     return NextResponse.json({ message: "Cart cleared successfully" })
//   } catch (error) {
//     console.error("Error clearing cart:", error)
//     return NextResponse.json(
//       { error: "Failed to clear cart" },
//       { status: 500 }
//     )
//   }
// }