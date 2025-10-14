# 🎭 ETHNOSPARK

A modern, responsive web application for cultural events and ethnic festivals, built with Next.js 15 and TypeScript. ETHNOSPARK provides a comprehensive platform for event management, team coordination, and community engagement.

## ✨ Features

### 🏠 Frontend Features
- **Modern Responsive Design** - Mobile-first approach with Tailwind CSS
- **Interactive Animations** - Smooth transitions powered by Framer Motion
- **Dynamic Gallery** - Image management with ImageKit integration
- **Event Scheduling** - Comprehensive event calendar and management
- **Team Management** - Team member profiles and role management
- **Real-time Announcements** - Community updates and notifications
- **Dark Theme** - Modern dark UI with elegant styling

### 🔧 Admin Dashboard
- **Comprehensive CMS** - Full content management system
- **Statistics Dashboard** - Real-time analytics and insights
- **Image Upload & Management** - Bulk image operations with ImageKit
- **User Authentication** - Secure JWT-based authentication
- **Responsive Admin Panel** - Mobile-optimized administration interface
- **Quick Actions** - Fast navigation between management sections

### 🎨 Technical Features
- **Server-Side Rendering** - Optimized performance with Next.js 15
- **API Routes** - RESTful API with built-in validation
- **Database Integration** - MongoDB with Mongoose ODM
- **Form Validation** - React Hook Form with Zod schemas
- **Component Library** - Reusable UI components with Radix UI
- **Type Safety** - Full TypeScript implementation

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 15.5.5 with Turbopack
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + Shadcn/ui
- **Animations**: Framer Motion
- **State Management**: React Hooks
- **Form Handling**: React Hook Form + Zod

### Backend
- **API**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + bcryptjs
- **File Upload**: Multer + ImageKit
- **Validation**: Zod schemas

### Development Tools
- **Build Tool**: Turbopack (Next.js 15)
- **Linting**: ESLint
- **Package Manager**: npm/yarn/pnpm
- **Image Optimization**: Sharp + ImageKit

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- MongoDB database
- ImageKit account (for image management)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/muh-habeeb/ehinospark.git
   cd ehinospark/ethinicweb
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Configuration**
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string
   
   # JWT Secret
   JWT_SECRET=your_jwt_secret_key
   
   # ImageKit Configuration
   IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
   IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
   IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
   
   # Admin Credentials
   ADMIN_EMAIL=admin@ethnospark.com
   ADMIN_PASSWORD=your_admin_password
   ```

4. **Database Setup**
   ```bash
   # The application will automatically create the required collections
   # You can seed initial data using the API endpoint:
   curl -X POST http://localhost:3000/api/seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Access the application**
   - **Website**: [http://localhost:3000](http://localhost:3000)
   - **Admin Panel**: [http://localhost:3000/admin](http://localhost:3000/admin)

## 📁 Project Structure

```
ethinicweb/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/             # Admin dashboard pages
│   │   ├── api/               # API routes
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Homepage
│   ├── components/            # Reusable components
│   │   ├── admin/             # Admin-specific components
│   │   ├── ui/                # UI library components
│   │   └── website/           # Website components
│   ├── lib/                   # Utility functions
│   └── middleware.ts          # Auth middleware
├── public/                    # Static assets
├── package.json              # Dependencies
└── README.md                 # Documentation
```

## 🎯 Usage

### For Administrators
1. Navigate to `/admin` to access the admin panel
2. Login with your admin credentials
3. Use the dashboard to manage:
   - Event programs and schedules
   - Team member profiles
   - Gallery images
   - Announcements and updates
   - Website hero section content

### For Developers
1. **Adding new components**: Place in appropriate `components/` subdirectory
2. **Creating API endpoints**: Add to `src/app/api/` directory
3. **Database models**: Define in `src/lib/` directory
4. **Styling**: Use Tailwind CSS classes and custom components

## 🔐 Authentication

The application uses JWT-based authentication for admin access:
- Secure password hashing with bcryptjs
- Protected routes with middleware
- Session management with HTTP-only cookies
- Role-based access control

## 📱 Responsive Design

ETHNOSPARK is built with a mobile-first approach:
- **Mobile**: Optimized touch interfaces and navigation
- **Tablet**: Adaptive layouts for medium screens
- **Desktop**: Full-featured interface with enhanced UX

## 🖼️ Image Management

Integrated with ImageKit for optimized image handling:
- Automatic image optimization
- CDN delivery for fast loading
- Bulk upload capabilities
- Responsive image sizing

## 🔧 Development

### Available Scripts

```bash
# Development with Turbopack
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

### Adding New Features

1. Create feature branch: `git checkout -b feature/new-feature`
2. Implement changes with proper TypeScript types
3. Add responsive styling with Tailwind CSS
4. Test on multiple devices and screen sizes
5. Submit pull request with detailed description

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
1. Build the application: `npm run build`
2. Start production server: `npm run start`
3. Configure reverse proxy (nginx/Apache)
4. Set up SSL certificates

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes with proper testing
4. Ensure code follows TypeScript best practices
5. Submit a pull request with detailed description

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Developer**: Muhammad Habeeb
- **Project**: ETHNOSPARK Cultural Event Platform

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation for common solutions

## 🔄 Changelog

### v0.1.0 (Current)
- Initial release with core features
- Admin dashboard implementation
- Responsive design across all devices
- Image management integration
- Authentication system
- Database integration

---

**Built with ❤️ for cultural communities and ethnic festivals**
