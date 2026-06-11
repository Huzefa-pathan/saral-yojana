<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="MIT License" />
</p>

# 🏛️ Saral Yojana — Maharashtra Government Schemes Portal

> **Saral Yojana** (सरल योजना — *"Simple Schemes"*) is a full-stack web application that aggregates **45+ Central & State government welfare schemes** for citizens of Maharashtra. It helps users discover, search, and understand schemes across categories like Farmers, Students, Women & Child, Health, Housing, and Social Security.

<br>

## ✨ Features

### 🔍 For Citizens
- **Smart Search** — Full-text search across scheme titles, descriptions, categories, and sources
- **Category Filtering** — Browse schemes by category: Farmers, Students, Women & Child, Health, Housing, Social Security
- **District Filtering** — Filter schemes relevant to your district (currently live for **Thane & Palghar**, expanding to all 36 Maharashtra districts soon)
- **Detailed Scheme Pages** — View eligibility criteria, benefits, required documents, and application links
- **Apply Mode Info** — Know whether to apply online, offline, or both — with direct links to official portals like [MahaDBT](https://mahadbt.maharashtra.gov.in/)
- **User Reviews** — Community review system for citizen feedback

### 🛡️ For Admins
- **Secure Admin Dashboard** — JWT-based authentication with signed HTTP-only cookies
- **Full CRUD Operations** — Create, read, update, and delete schemes from the admin panel
- **Analytics Dashboard** — Track site visits, page views, and search metrics
- **Data Seeding** — Pre-populated with 45+ verified government schemes on startup

<br>

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite 7, TypeScript |
| **UI Components** | shadcn/ui (Radix UI primitives), Lucide Icons |
| **Styling** | TailwindCSS 4, CSS Custom Properties |
| **Routing** | Wouter (lightweight React router) |
| **State Management** | TanStack Query (React Query) v5 |
| **Forms** | React Hook Form + Zod validation |
| **Backend** | Express.js 4 with TypeScript |
| **Authentication** | JWT + Signed Cookies (cookie-parser) |
| **Data Storage** | JSON file-based storage (portable, no external DB needed) |
| **Build Tools** | Vite (frontend), esbuild (backend bundling), tsx (dev) |

<br>

## 📁 Project Structure

```
SaralYojana/
├── client/                     # Frontend React application
│   ├── index.html              # HTML entry point
│   ├── public/                 # Static assets
│   └── src/
│       ├── App.tsx             # Root component with routing
│       ├── main.tsx            # React entry point
│       ├── index.css           # Global styles & theme
│       ├── components/
│       │   ├── Hero.tsx        # Landing page hero section
│       │   ├── Navbar.tsx      # Navigation bar
│       │   ├── Footer.tsx      # Site footer
│       │   ├── CategoryGrid.tsx    # Category browsing grid
│       │   ├── DistrictGrid.tsx    # District browsing grid
│       │   ├── SchemeCard.tsx      # Scheme preview card
│       │   ├── ReviewSystem.tsx    # User review component
│       │   ├── PrivateRoute.tsx    # Auth-protected route wrapper
│       │   └── ui/             # shadcn/ui component library
│       ├── pages/
│       │   ├── Home.tsx        # Landing page
│       │   ├── Schemes.tsx     # Scheme listing with filters
│       │   ├── SchemeDetails.tsx   # Individual scheme page
│       │   ├── About.tsx       # About page
│       │   ├── Support.tsx     # Support/contact page
│       │   ├── AdminLogin.tsx  # Admin authentication
│       │   ├── AdminDashboard.tsx  # Admin management panel
│       │   └── not-found.tsx   # 404 page
│       ├── hooks/              # Custom React hooks
│       └── lib/                # Utilities & query client
│
├── server/                     # Backend Express application
│   ├── index.ts                # Server entry point
│   ├── routes.ts               # API route definitions
│   ├── auth.ts                 # JWT authentication middleware
│   ├── storage.ts              # Data access layer (JsonSchemeStorage)
│   ├── jsonStorage.ts          # JSON file read/write operations
│   ├── seedSchemes.ts          # 45+ pre-populated scheme data
│   ├── analytics.ts            # Visit & search tracking
│   └── vite.ts                 # Vite dev server integration
│
├── shared/                     # Shared types between client & server
│   ├── schema.ts               # TypeScript interfaces (Scheme, SchemeFilters)
│   └── districts.ts            # Maharashtra district data with aliases
│
├── data/                       # Runtime JSON data files
│   ├── schemes.json            # Scheme records
│   └── reviews.json            # User reviews
│
├── package.json
├── tsconfig.json
├── vite.config.js
└── postcss.config.js
```

<br>

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** or **pnpm**

### Installation

```bash
# Clone the repository
git clone https://github.com/Huzefa-pathan/saral-yojana.git
cd saral-yojana

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
# Admin credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password

# Session / JWT secret
SESSION_SECRET=your_random_secret_key
```

> **Note:** The application uses JSON file storage by default — no external database is required. Scheme data is automatically seeded on server startup.

### Running the Application

```bash
# Development mode (starts both frontend & backend with hot-reload)
npm run dev

# The app will be available at http://localhost:5000
```

### Production Build

```bash
# Build frontend (Vite) and backend (esbuild)
npm run build

# Start production server
npm start
```

<br>

## 📡 API Reference

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/schemes` | List schemes with pagination & filters |
| `GET` | `/api/scheme/:id` | Get a single scheme by ID |
| `GET` | `/api/reviews` | List all user reviews |
| `POST` | `/api/reviews` | Submit a new review |

#### Query Parameters for `/api/schemes`

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | `1` | Page number |
| `size` | number | `20` | Items per page |
| `q` | string | — | Full-text search query |
| `district` | string | — | Filter by district name |
| `category` | string | — | Filter by category (`farmers`, `students`, `women_child`, `health`, `housing`, `social_security`) |

### Admin Endpoints (JWT Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/admin/login` | Admin login (returns JWT cookie) |
| `POST` | `/api/admin/logout` | Admin logout (clears cookie) |
| `GET` | `/api/admin/check` | Check authentication status |
| `GET` | `/api/admin/analytics` | Get site analytics |
| `GET` | `/api/admin/schemes` | List all schemes (admin view) |
| `GET` | `/api/admin/scheme/:id` | Get scheme details (admin view) |
| `POST` | `/api/admin/scheme` | Create a new scheme |
| `PUT` | `/api/admin/scheme/:id` | Update an existing scheme |
| `DELETE` | `/api/admin/scheme/:id` | Delete a scheme |

<br>

## 📊 Scheme Categories

| Category | Schemes | Examples |
|----------|---------|----------|
| 🌾 **Farmers** | 13 | PM-KISAN, PM Fasal Bima, Agricultural Mechanization |
| 🎓 **Students** | 12 | PM-YASASVI, INSPIRE, Post-Matric Scholarships |
| 👩 **Women & Child** | 6 | Majhi Ladki Bahin, Sukanya Samriddhi, POSHAN Abhiyan |
| 🏥 **Health** | 3 | MJPJAY, Ayushman Bharat, Aapla Dawakhana |
| 🏠 **Housing** | 5 | PM Awas Yojana (Urban & Rural), Ramai Awas |
| 🛡️ **Social Security** | 7 | Sanjay Gandhi Niradhar, Atal Pension, PMSBY |

<br>

## 🔐 Authentication Flow

```
┌─────────┐     POST /api/admin/login      ┌──────────┐
│  Admin   │ ──────────────────────────────▶ │  Server  │
│  Client  │     { username, password }      │          │
│          │ ◀────────────────────────────── │          │
│          │     Set-Cookie: admin_token      │          │
│          │     (httpOnly, signed, strict)   │          │
│          │                                  │          │
│          │     GET /api/admin/*             │          │
│          │ ──────────────────────────────▶ │          │
│          │     Cookie: admin_token          │  JWT     │
│          │ ◀────────────────────────────── │  Verify  │
│          │     { data }                    │          │
└─────────┘                                  └──────────┘
```

- JWT tokens expire after **1 hour**
- Cookies are `httpOnly`, `signed`, and `sameSite: strict`
- Secure flag enabled in production

<br>

## 🗺️ Supported Districts

### ✅ Currently Live
> **Thane** · **Palghar**

### 🔜 Coming Soon
> Mumbai City, Mumbai Suburban, Pune, Nagpur, Nashik, Aurangabad, Solapur, Kolhapur, Sangli, Satara, Ratnagiri, Sindhudurg, Raigad, Ahmednagar, Jalgaon, Dhule, Nandurbar, Buldhana, Akola, Amravati, Wardha, Chandrapur, Gadchiroli, Gondia, Bhandara, Yavatmal, Washim, Hingoli, Parbhani, Jalna, Beed, Latur, Osmanabad, Nanded

*We're actively working on expanding coverage to all 36 districts of Maharashtra.*

<br>

## 🛠️ Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (Express + Vite HMR) |
| `npm run build` | Build for production (Vite + esbuild) |
| `npm start` | Run production server |
| `npm run check` | TypeScript type checking |

<br>

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

<br>

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

<br>

## 🙏 Acknowledgements

- Government scheme data sourced from official portals: [India.gov.in](https://www.india.gov.in), [MahaDBT](https://mahadbt.maharashtra.gov.in/), [MyGov.in](https://www.mygov.in)
- UI components built with [shadcn/ui](https://ui.shadcn.com/) and [Radix UI](https://www.radix-ui.com/)
- Icons by [Lucide](https://lucide.dev/)

---

<p align="center">
  Made with ❤️ for the citizens of Maharashtra
</p>
