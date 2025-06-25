# 🏠 HostConnect

**A Modern Accommodation Booking Platform**

HostConnect is a full-featured, production-ready accommodation listing platform built with React, TypeScript, and Supabase. It enables hosts to list their properties and guests to discover and book unique accommodations with real-time messaging capabilities.

![HostConnect Banner](https://img.shields.io/badge/HostConnect-Production%20Ready-brightgreen) ![React](https://img.shields.io/badge/React-18+-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.8+-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-4.1+-teal) ![Supabase](https://img.shields.io/badge/Supabase-Backend-green)

## 🌟 Features

### 🔐 **Authentication System**
- **User Registration** with email verification
- **Secure Login/Logout** with session management
- **Password Reset** functionality
- **Protected Routes** with authentication guards

### 📋 **Listing Management**
- **Create Listings** with comprehensive form validation
- **Edit Listings** with pre-populated forms
- **Delete Listings** with confirmation dialogs
- **User Dashboard** for managing all listings
- **Search & Filter** functionality
- **Sorting Options** (newest, oldest, price)

### 💬 **Real-time Messaging**
- **Send Messages** from listing details pages
- **Messages Dashboard** for hosts to manage conversations
- **Individual Chat Pages** for detailed conversations
- **Message Validation** with character limits
- **Timestamps** and conversation history

### 🎨 **Modern UI/UX**
- **Responsive Design** that works on all devices
- **Professional Navigation** with mobile hamburger menu
- **Loading States** and user feedback
- **Error Handling** throughout the application
- **Consistent Styling** with Tailwind CSS

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/hostconnect.git
   cd hostconnect
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file
   cp .env.example .env
   
   # Add your Supabase credentials
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:5173
   ```

## 🏗️ Project Structure

```
HostConnect/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.tsx      # Navigation component
│   │   ├── ListingCard.tsx # Listing display component
│   │   └── __tests__/      # Component tests
│   ├── pages/              # Page components
│   │   ├── Home.tsx        # Landing page with listings
│   │   ├── Dashboard.tsx   # User dashboard
│   │   ├── Login.tsx       # Authentication pages
│   │   ├── SignUp.tsx
│   │   ├── CreateListing.tsx
│   │   ├── EditListing.tsx
│   │   ├── ListingDetails.tsx
│   │   ├── Messages.tsx    # Messages dashboard
│   │   ├── Conversation.tsx
│   │   └── __tests__/      # Page tests
│   ├── lib/                # Core functionality
│   │   ├── supabase.ts     # Supabase client setup
│   │   ├── auth.ts         # Authentication functions
│   │   └── database.ts     # Database operations
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
├── public/                 # Static assets
├── docs/                   # Documentation
│   ├── API.md             # API documentation
│   ├── DEPLOYMENT.md      # Deployment guide
│   └── TESTING.md         # Testing guide
└── tests/                  # Test configurations
```

## 🛠️ Technology Stack

### **Frontend**
- **React 18+** - Modern React with hooks
- **TypeScript 5.8+** - Type-safe development
- **Tailwind CSS 4.1+** - Utility-first CSS framework
- **React Router Dom 7.6+** - Client-side routing
- **Vite 5.4+** - Fast build tool and dev server

### **Backend**
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Real-time subscriptions
  - Authentication
  - Row-level security

### **Testing**
- **Jest** - JavaScript testing framework
- **React Testing Library** - React component testing
- **TypeScript** - Compile-time error checking

### **Development Tools**
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks (optional)

## 📱 Pages & Features

### **🏠 Home Page (`/`)**
- Hero section with call-to-action
- Search and filter functionality
- Listing grid with sorting options
- Responsive design for all devices

### **🔐 Authentication Pages**
- **Sign Up (`/signup`)** - User registration with validation
- **Login (`/login`)** - User authentication
- **Forgot Password (`/forgot-password`)** - Password reset
- **Reset Password (`/reset-password`)** - New password setup

### **📊 Dashboard (`/dashboard`)**
- User's listing management
- Quick access to create new listings
- Messages dashboard link
- Success/error message handling

### **📋 Listing Management**
- **Create Listing (`/create-listing`)** - Add new accommodations
- **Edit Listing (`/edit-listing/:id`)** - Modify existing listings
- **Listing Details (`/listing/:id`)** - Detailed view with messaging

### **💬 Messaging System**
- **Messages (`/messages`)** - Conversation overview
- **Conversation (`/conversation/:userId`)** - Individual chats

## 🔧 Configuration

### **Environment Variables**
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional: Custom Configuration
VITE_APP_NAME=HostConnect
VITE_APP_VERSION=1.0.0
```

### **Database Schema**
```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Listings table
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL NOT NULL,
  location VARCHAR NOT NULL,
  availability BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Interactions table
CREATE TABLE interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  host_id UUID REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW()
);
```

## 🧪 Testing

### **Run Tests**
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### **Test Structure**
- **Unit Tests** - Component and function testing
- **Integration Tests** - API and database integration
- **Functional Tests** - User flow testing

### **Testing Guidelines**
- All components have corresponding test files
- Form validation is thoroughly tested
- Authentication flows are covered
- Database operations are mocked and tested

## 🚀 Deployment

### **Build for Production**
```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

### **Deployment Platforms**

#### **Vercel (Recommended)**
1. Connect your GitHub repository
2. Configure environment variables
3. Deploy automatically on push

#### **Netlify**
1. Connect repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`

#### **GitHub Pages**
1. Use provided GitHub Actions workflow
2. Configure repository secrets
3. Deploy on push to main branch

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

## 📊 Performance

### **Bundle Analysis**
- **Total Bundle Size**: ~405KB (gzipped: ~113KB)
- **Vendor Chunks**: React, Router, Supabase
- **Code Splitting**: Automatic route-based splitting
- **Tree Shaking**: Unused code elimination

### **Performance Metrics**
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.0s
- **Cumulative Layout Shift**: < 0.1

## 🔒 Security

### **Authentication Security**
- JWT token-based authentication
- Secure session management
- Protected route guards
- Automatic token refresh

### **Database Security**
- Row-level security (RLS) enabled
- User-specific data access
- SQL injection prevention
- CORS configuration

### **Frontend Security**
- Input validation and sanitization
- XSS prevention
- Environment variable protection
- HTTPS enforcement in production

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](./CONTRIBUTING.md) for details.

### **Development Workflow**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

### **Code Standards**
- Follow TypeScript best practices
- Use ESLint and Prettier configurations
- Write comprehensive tests
- Document new features

## 📝 API Documentation

### **Authentication Endpoints**
```typescript
// Sign up new user
signUp(email: string, password: string, name?: string)

// Sign in existing user
signIn(email: string, password: string)

// Sign out current user
signOut()

// Get current user
getCurrentUser()

// Reset password
resetPassword(email: string)
```

### **Listing Operations**
```typescript
// Create new listing
createListing(listing: CreateListingData)

// Get all listings or user-specific listings
getListings(userId?: string)

// Get listing by ID
getListingById(id: string)

// Update existing listing
updateListing(id: string, updates: Partial<Listing>)

// Delete listing
deleteListing(id: string)
```

### **Messaging Operations**
```typescript
// Create new message
createInteraction(interaction: CreateInteractionData)

// Get conversations
getInteractions(userId: string, hostId?: string)
```

## 🐛 Troubleshooting

### **Common Issues**

#### **Build Errors**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### **Environment Variables Not Loading**
- Ensure variables are prefixed with `VITE_`
- Restart development server after changes
- Check .env file is in project root

#### **Supabase Connection Issues**
- Verify URL and API key are correct
- Check network connectivity
- Ensure RLS policies allow access

#### **TypeScript Errors**
```bash
# Check for type errors
npm run build

# Update TypeScript
npm update typescript
```

## 📈 Roadmap

### **Upcoming Features**
- [ ] **Image Upload** for listings
- [ ] **Payment Integration** (Stripe/PayPal)
- [ ] **Booking Calendar** system
- [ ] **Review & Rating** system
- [ ] **Advanced Search** with maps
- [ ] **Mobile App** (React Native)
- [ ] **Admin Dashboard** for platform management
- [ ] **Analytics Dashboard** for hosts

### **Performance Improvements**
- [ ] **Image Optimization** and lazy loading
- [ ] **Service Worker** for offline support
- [ ] **Database Indexing** optimization
- [ ] **CDN Integration** for static assets

## 📞 Support

### **Getting Help**
- 📖 Check the documentation first
- 🐛 Search existing issues on GitHub
- 💬 Join our community Discord
- 📧 Contact support: support@hostconnect.com

### **Reporting Issues**
Please include:
- Operating system and version
- Node.js version
- Browser and version
- Steps to reproduce
- Expected vs actual behavior

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- **Supabase** - For providing an excellent backend platform
- **React Team** - For the amazing framework
- **Tailwind CSS** - For the utility-first CSS framework
- **Vite** - For the fast build tool
- **Community** - For feedback and contributions

---

## 🎯 Project Stats

![GitHub stars](https://img.shields.io/github/stars/yourusername/hostconnect)
![GitHub forks](https://img.shields.io/github/forks/yourusername/hostconnect)
![GitHub issues](https://img.shields.io/github/issues/yourusername/hostconnect)
![GitHub license](https://img.shields.io/github/license/yourusername/hostconnect)

**Built with ❤️ by the HostConnect Team**

---

*Ready to revolutionize the accommodation booking industry? Start with HostConnect!* 🚀