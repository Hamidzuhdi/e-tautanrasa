// // src/app/api/users/[id]/route.ts
// import { NextRequest, NextResponse } from "next/server"
// import { prisma } from "@/lib/prisma"
// import { getServerSession } from "next-auth"
// import { authOptions } from "@/lib/auth"
// import bcrypt from "bcryptjs"

// // GET single user
// export async function GET(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const session = await getServerSession(authOptions)
    
//     if (!session) {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 401 }
//       )
//     }

//     const userId = parseInt(params.id)
    
//     // Users can only access their own data, admins can access all
//     if (session.user.role !== 'ADMIN' && session.user.id !== userId) {
//       return NextResponse.json(
//         { error: "Forbidden" },
//         { status: 403 }
//       )
//     }

//     const user = await prisma.user.findUnique({
//       where: { id: userId },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         role: true,
//         phone: true,
//         address: true,
//         createdAt: true,
//         updatedAt: true,
//         _count: {
//           select: {
//             orders: true,
//             reviews: true,
//             carts: true
//           }
//         }
//       }
//     })

//     if (!user) {
//       return NextResponse.json(
//         { error: "User not found" },
//         { status: 404 }
//       )
//     }

//     return NextResponse.json(user)
//   } catch (error) {
//     console.error("Error fetching user:", error)
//     return NextResponse.json(
//       { error: "Failed to fetch user" },
//       { status: 500 }
//     )
//   }
// }

// // PUT update user
// export async function PUT(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const session = await getServerSession(authOptions)
    
//     if (!session) {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 401 }
//       )
//     }

//     const userId = parseInt(params.id)
//     const body = await request.json()
//     const { name, email, password, role, phone, address } = body

//     // Users can only update their own data, admins can update all
//     if (session.user.role !== 'ADMIN' && session.user.id !== userId) {
//       return NextResponse.json(
//         { error: "Forbidden" },
//         { status: 403 }
//       )
//     }

//     // Only admins can change role
//     if (role && session.user.role !== 'ADMIN') {
//       return NextResponse.json(
//         { error: "Only admin can change user role" },
//         { status: 403 }
//       )
//     }

//     const updateData: any = {
//       name,
//       email,
//       phone,
//       address
//     }

//     // Only include role if user is admin
//     if (role && session.user.role === 'ADMIN') {
//       updateData.role = role
//     }

//     // Hash password if provided
//     if (password) {
//       updateData.password = await bcrypt.hash(password, 12)
//     }

//     const user = await prisma.user.update({
//       where: { id: userId },
//       data: updateData,
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         role: true,
//         phone: true,
//         address: true,
//         updatedAt: true
//       }
//     })

//     return NextResponse.json(user)
//   } catch (error) {
//     console.error("Error updating user:", error)
//     return NextResponse.json(
//       { error: "Failed to update user" },
//       { status: 500 }
//     )
//   }
// }

// // DELETE user (Admin only)
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

//     const userId = parseInt(params.id)

//     // Prevent admin from deleting themselves
//     if (session.user.id === userId) {
//       return NextResponse.json(
//         { error: "Cannot delete your own account" },
//         { status: 400 }
//       )
//     }

//     // Check if user has orders
//     const ordersCount = await prisma.order.count({
//       where: { userId }
//     })

//     if (ordersCount > 0) {
//       return NextResponse.json(
//         { error: "Cannot delete user with existing orders" },
//         { status: 400 }
//       )
//     }

//     await prisma.user.delete({
//       where: { id: userId }
//     })

//     return NextResponse.json({ message: "User deleted successfully" })
//   } catch (error) {
//     console.error("Error deleting user:", error)
//     return NextResponse.json(
//       { error: "Failed to delete user" },
//       { status: 500 }
//     )
//   }
// }