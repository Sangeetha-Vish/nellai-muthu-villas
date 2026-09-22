# Nella Muthu Vilas - Traditional Digital Sweet Shop

A three-application architecture for browsing and ordering traditional Indian sweets.

## Architecture

| Application | Responsibility | Development URL |
| --- | --- | --- |
| `client/` | Customer storefront, account, cart, checkout, and customer workflows | http://localhost:3000 |
| `admin/` | Admin login, dashboard, product, branch, order, feedback, and report screens | http://localhost:3001 |
| `server/` | Shared Prisma-backed HTTP API and health checks | http://localhost:5000 |

Prisma schema and migrations are centralized under `server/prisma/` and are not redesigned.

### API Migration

The dedicated Express server now owns all 20 original API paths:

```text
GET    /api/health
GET    /api/products
GET    /api/branches
POST   /api/auth/login
POST   /api/auth/signup
GET    /api/auth/me
POST   /api/auth/logout
POST   /api/admin/login
GET/POST /api/orders
POST   /api/feedback
GET/PATCH /api/admin/branches
GET    /api/admin/dashboard/stats
GET/POST/PATCH /api/admin/products
GET    /api/admin/orders
PATCH  /api/admin/orders/:id
GET    /api/admin/logs
GET    /api/admin/feedback
GET    /api/admin/reports/sales
GET    /api/admin/reports/products
GET    /api/admin/reports/branches
```

Implementation follows `routes -> controllers -> services -> Prisma`, with JWT session-cookie and bearer-token support in `server/src/middleware/auth.js`. The client and admin apps contain no API route files and use `NEXT_PUBLIC_API_URL`.

## 🎨 Design Philosophy

This application follows a **"No Hustle"** approach:
- Calm, respectful, and traditional aesthetic
- Browsing without pressure - no forced location sharing
- Heritage brand experience, not a typical e-commerce site
- Gentle transitions and elegant animations

## 🚀 Features Implemented (Modules 1-4)

### ✅ Module 1: Brand & Theme System
- **Color Palette**: Deep Maroon (#630D16), Cream (#FDFCF0), Muted Gold (#D4AF37), Dark Brown (#3D2B1F)
- **Typography**: Playfair Display (serif headings), Lato (body text)
- **Animations**: Smooth fade-in/fade-out transitions (no bounce, no jarring effects)
- **UI Components**: Button (solid/outline variants), ProductCard, BranchCard

### ✅ Module 2: Entry & Welcome Flow
- 3-second welcome screen with brand name
- Automatic fade-out transition to homepage
- Seamless state management without page reload

### ✅ Module 3: Homepage (Products First)
- Header with logo, branch selector, and cart
- Gentle note: "You may browse our sweets without selecting a branch"
- Product showcase grid with 6 traditional sweets
- Non-intrusive "Choose Branch" call-to-action

### ✅ Module 4: Branch Selection
- Modal interface with smooth animations
- Smart suggestion UI (location-based, UI only)
- Manual branch selection with 3 branches
- Branch context for state management across the app

### ✅ Backend & Database
- **PostgreSQL**: Production-grade database for scalability and reliability
- **Prisma ORM**: Type-safe database access and migrations
- **Connection Pooling**: Optimized for high-concurrency production workloads
- **Automated Backups**: Daily database dumps with retention policy

### ✅ Production & Security
- **HTTPS Enforcement**: Automatic redirection from HTTP to HTTPS
- **Security Headers**: HSTS, CSP, XFO, and X-Content-Type-Options
- **Monitoring**: Integration with Sentry (Errors) and LogRocket (Session Replay)
- **Rate Limiting**: Anti-abuse protection for Auth and Order APIs
- **Health Checks**: Standardized `/api/health` monitoring endpoint
- **CDN Optimized**: Asset prefixing for edge delivery of static content

## 📋 Prerequisites

- Node.js 20.x or higher
- PostgreSQL 14.x or higher
- npm (comes with Node.js)

## 🛠️ Installation & Setup

### 1. Install Dependencies

\`\`\`bash
npm install
cd client && npm install
cd ../admin && npm install
cd ../server && npm install
\`\`\`

### 2. Set Up Environment Variables

Copy the production template and fill in your secrets:

\`\`\`bash
cp .env.production.sample .env
\`\`\`

### 3. Set Up Database

\`\`\`bash
# Generate Prisma Client from the server directory
cd server
npm run prisma:generate

# Apply migrations
npm run prisma:migrate

# Seed data (Optional)
npm run prisma:seed
\`\`\`

### 4. Start Applications

**Development Mode:**
\`\`\`bash
npm run client
npm run admin
npm run server
\`\`\`

Build each frontend with `npm run build` from its application directory.

## 📁 Project Structure

\`\`\`
nellamuthuvilas/
├── client/                   # Customer-facing Next.js application
├── admin/                    # Admin-facing Next.js application
├── server/                   # Dedicated Prisma-backed backend
│   ├── prisma/                # The only Prisma directory (PostgreSQL)
│   │   ├── schema.prisma
│   │   ├── seed.js
│   │   └── migrations/
│   └── src/                   # API routes, controllers, services, middleware
├── .github/workflows/         # CI/CD pipelines
├── package.json               # Orchestration commands only
└── README.md
\`\`\`

## 🎯 Key Technologies

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Monitoring**: Sentry & LogRocket
- **Infrastructure**: GitHub Actions (CI/CD)
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Fonts**: Google Fonts (Playfair Display, Lato)

## 🎨 Design Tokens

### Colors
\`\`\`css
--color-brand-maroon: #630D16   /* Primary brand color */
--color-brand-cream: #FDFCF0    /* Background */
--color-brand-gold: #D4AF37     /* Accents, borders */
--color-brand-brown: #3D2B1F    /* Text */
\`\`\`

### Typography
- **Headings**: Playfair Display (serif)
- **Body**: Lato (sans-serif)
- **Line Height**: Generous spacing for readability

### Animations
- Fade-in: 1.5s ease-out
- Fade-out: 1.5s ease-in
- No bounce, no spinning loaders

## 📱 Responsive Design

The application is fully responsive and works on:
- ✅ Desktop (1920px+)
- ✅ Tablet (768px - 1024px)
- ✅ Mobile (320px - 767px)

## 🔧 Known Issues & Future Enhancements

### Current Limitations
1. **Prisma 7 Seed Script**: The seed script has configuration issues with Prisma 7. Data can be added manually via Prisma Studio.
2. **Cart Functionality**: Cart is UI-only (shows "0" items). Full cart implementation is pending.
3. **Location Services**: Smart branch suggestion is UI-only. Geolocation integration is pending.

### Future Modules (Not Yet Implemented)
- Module 5: Product Detail Page
- Module 6: Cart & Checkout Flow
- Module 7: Order Confirmation
- Module 8: Admin Panel
- Module 9: Festival Mode
- Module 10: Payment Integration

## 🧪 Testing the Application

1. **Welcome Screen**: Open http://localhost:3000 and observe the 3-second welcome animation
2. **Product Browsing**: Scroll through the 6 traditional sweets
3. **Branch Selection**: Click "Choose Branch for Availability & Pickup" to open the modal
4. **Branch Selection**: Select a branch from the list
5. **Header Update**: Notice the header updates with the selected branch name

## 📝 API Endpoints

### GET /api/products
Returns all products from the database.

**Response**:
\`\`\`json
[
  {
    "id": "...",
    "name": "Mysore Pak",
    "description": "Traditional ghee-based sweet...",
    "image": "/images/mysore-pak.jpg",
    "price": 450,
    "weight": "500g",
    "tradition": "Prepared using the authentic recipe...",
    "available": true
  }
]
\`\`\`

### GET /api/branches
Returns all branch locations.

**Response**:
\`\`\`json
[
  {
    "id": "...",
    "name": "RS Puram",
    "location": "123 Avinashi Road, RS Puram",
    "area": "RS Puram",
    "timings": "8:00 AM - 9:00 PM",
    "distance": "2.5 km"
  }
]
\`\`\`

## 🤝 Contributing

This is a heritage brand project. When contributing:
1. Maintain the calm, traditional aesthetic
2. Follow the "No Hustle" philosophy
3. Test on both desktop and mobile
4. Ensure smooth, gentle transitions

## 📄 License

Private project for Nella Muthu Vilas.

## 🙏 Acknowledgments

- Design inspired by traditional Indian sweet shops
- Built with modern web technologies while respecting heritage values
