# TAUTAN RASA - E-Commerce Platform

Modern e-commerce platform for Tautan Rasa fashion brand, featuring full authentication, admin dashboard, and dynamic product management.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Setup database:**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000) in your browser**

## 🔐 Login Credentials

### Admin Access
- **Email:** admin@tautanrasa.com
- **Password:** admin123
- **Access:** Admin Dashboard with full CRUD operations

## 🛠 Tech Stack

- **Framework:** Next.js 15 with App Router & Turbopack
- **Database:** MySQL with Prisma ORM
- **Authentication:** NextAuth.js with credentials provider
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Security:** bcrypt password hashing, JWT sessions

## 📱 Features

### Customer Features
- ✅ Product browsing by category
- ✅ Shopping cart with quantity management
- ✅ User authentication (login/register)
- ✅ User profile management
- ✅ Order history tracking
- ✅ Responsive design for all devices

### Admin Features
- ✅ Admin dashboard with analytics
- ✅ Product management (CRUD operations)
- ✅ Category management
- ✅ Order management
- ✅ User management
- ✅ Role-based access control

### Technical Features
- ✅ MySQL database with comprehensive schema
- ✅ API routes with proper authentication
- ✅ Middleware for route protection
- ✅ Image optimization with Next.js
- ✅ SEO optimization
- ✅ TypeScript for type safety

## 📁 Project Structure

```
src/
├── app/                    # App Router pages
│   ├── admin/             # Admin dashboard pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── collections/       # Product collection pages
│   └── ...                # Other pages
├── components/            # Reusable UI components
├── lib/                   # Database connection & utilities
└── types/                 # TypeScript type definitions
```

## 🗄 Database Schema

- **Users:** Authentication and profile data
- **Products:** Product catalog with categories
- **Categories:** Product categorization
- **Orders:** Order management system
- **Payments:** Payment tracking
- **Shopping Cart:** Cart items management

## 🎯 Collections Available

- **Charm Series**: 2 products in database
- **Taut Series**: 1 product in database  
- **Drawstring Collection**: 1 product in database

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth.js authentication

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/[id]` - Update product (Admin only)
- `DELETE /api/products/[id]` - Delete product (Admin only)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Admin only)

## 🧪 Testing Instructions

1. **Homepage:** Visit localhost:3000 to see the main website
2. **Admin Login:** Click the red "Admin" button or login with admin credentials
3. **Admin Dashboard:** Access via dropdown after login (Dashboard Admin)
4. **Product Management:** View products at `/admin/products`
5. **Category Management:** View categories at `/admin/categories`
6. **Product Display:** Visit `/collections/charm-series` to see database products
7. **Cart Functionality:** Add items to cart and test quantity calculations
8. **User Profile:** Access profile and order history from user dropdown

## 🔒 Security Features

- Password hashing with bcrypt
- JWT-based session management
- Role-based route protection (Admin/Customer)
- Input validation and sanitization
- Protected API endpoints

## 📞 Contact & Social Media

- **Email:** hello.tautanrasa@gmail.com
- **TikTok:** @tautanrasa.co
- **Shopee:** Available via provided links
- **WhatsApp:** Customer support available

## 🚀 Deployment

The application is ready for deployment with:
- Environment variables configured
- Database migrations ready
- Production build optimizations
- Image optimization enabled

---

Built with ❤️ for Tautan Rasa fashion brand by D IV Informatics Engineering Student, Airlangga University