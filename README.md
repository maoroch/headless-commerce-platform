# Headless E-Commerce · Next.js + WooCommerce

> Modern headless storefront — Next.js 16 frontend powered by WordPress + WooCommerce as a headless backend via REST API

![Next.js](https://img.shields.io/badge/Next.js-16.1-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38BDF8?logo=tailwindcss)
![WooCommerce](https://img.shields.io/badge/WooCommerce-REST_API-7F54B3?logo=woocommerce)
![WordPress](https://img.shields.io/badge/WordPress-REST_API-21759B?logo=wordpress)

---

## Overview

A production-ready headless e-commerce platform that replaces the traditional WordPress/WooCommerce theme with a blazing-fast Next.js storefront. WooCommerce runs purely as a backend — managing products, orders, customers and coupons — while Next.js handles rendering, routing and user experience.

**Architecture:** Next.js consumes WooCommerce REST API (`/wp-json/wc/v3/*`) and WordPress REST API (`/wp-json/wp/v2/*`) via server components for SSG/SSR pages, and a lightweight BFF (Backend For Frontend) layer via Next.js API Routes for auth flows.

---

## Architecture Diagrams

### System Context
<img src="documentation/diagrams/png/Headless%20E-Commerce%20System%20Context.png" alt="System Context" width="600">


### Container Diagram
<img src="documentation/diagrams/png/Headless%20E-Commerce%20Container%20Diagram.png"
alt="Container Diagram" width="600">

### Data Flow
<img src="documentation/diagrams/png/Headless%20E-Commerce%20Data%20Flow.png"
alt="Data Flow" width="600">

### Frontend Components
<img src="documentation/diagrams/png/Headless%20E-Commerce%20Frontend%20Components.png"
alt="Component Diagram" width="600">


> PlantUML source files available in `documentation/diagrams/*.puml`

---

## Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Rendering Strategy](#rendering-strategy)
- [API Layer](#api-layer)
- [State Management](#state-management)
- [Environment Variables](#environment-variables)
- [Quickstart](#quickstart)
- [WordPress Setup](#wordpress-setup)
- [Data Import Scripts](#data-import-scripts)

---

## Features

### Storefront
- 🛍️ **Product catalog** — grid, filtering by category, sorting
- 🔍 **Search** — full-text search via WooCommerce REST API
- 📦 **Product detail** — images, description, rating, stock status, add to cart
- 🏷️ **Discounts page** — sale products + active coupons
- ❤️ **Favourites** — client-side wishlist persisted in localStorage
- 🛒 **Cart** — persistent cart via sessionStorage, quantity management
- 📋 **Orders** — authenticated order history

### Auth
- 🔐 **Login** — JWT authentication via `wp-jwt-auth` WordPress plugin
- 📝 **Register** — customer creation via WooCommerce Customers API + auto-login

### Blog
- 📰 **Blog listing** — WordPress posts with featured images and categories
- 📄 **Post detail** — full post with read time, tags, author

### Admin (WordPress side)
- ✅ Full product management via WooCommerce admin
- ✅ Blog content via WordPress editor
- ✅ Order management, coupon management
- ✅ Customer management

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| Next.js | 16.1 | App Router, SSR/SSG/ISR |
| React | 19 | UI components |
| TypeScript | 5 | Type safety |
| Tailwind CSS | 4 | Styling |
| Lucide React | 0.563 | Icons |

### Backend (Headless)
| Technology | Purpose |
|---|---|
| WordPress | CMS, Blog, User management |
| WooCommerce | Products, Orders, Customers, Coupons |
| WooCommerce REST API (`/wc/v3/*`) | Products, Categories, Coupons, Customers |
| WordPress REST API (`/wp/v2/*`) | Posts, Media, Users |
| JWT Authentication Plugin | Login token issuance |
| MySQL | WordPress database |

### Infrastructure
| Service | Purpose |
|---|---|
| Vercel | Frontend deployment, Edge CDN |
| WordPress Hosting (VPS / WP Engine) | WP + WooCommerce backend |
| Cloudinary | Image storage and optimization |

---

## Project Structure

```
/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout — providers, fonts
│   ├── page.tsx                  # Home (SSG)
│   ├── shop/
│   │   ├── page.tsx              # Product catalog (SSR)
│   │   └── [slug]/page.tsx       # Product detail (ISR)
│   ├── categories/
│   │   ├── page.tsx              # All categories (SSR)
│   │   └── [slug]/page.tsx       # Category products (SSR)
│   ├── search/page.tsx           # Search results (SSR)
│   ├── blog/
│   │   ├── page.tsx              # Blog listing (SSG)
│   │   └── [slug]/page.tsx       # Post detail (SSG)
│   ├── discounts/page.tsx        # Sale products + coupons (SSR)
│   ├── favourites/page.tsx       # Wishlist (Client)
│   ├── cart/page.tsx             # Cart (Client)
│   ├── orders/page.tsx           # Order history (Client + Auth)
│   ├── login/page.tsx            # Login (Client)
│   ├── register/page.tsx         # Registration (Client)
│   └── api/
│       ├── auth/login/route.ts   # BFF: JWT login
│       ├── auth/register/route.ts# BFF: WC customer creation
│       └── search/route.ts       # BFF: product search
│
├── components/
│   ├── Navbar/
│   │   ├── NavbarMain.tsx        # Navigation, cart count
│   │   └── Usermenu.tsx          # Auth state, logout
│   ├── Footer/Footer.tsx
│   ├── AddToCartButton.tsx       # Cart action
│   ├── FavouriteButton.tsx       # Wishlist action
│   ├── Home.tsx
│   └── pages/home/               # Home page sections
│       ├── Banner.tsx
│       ├── Catalog.tsx
│       ├── ProductCatalog.tsx
│       ├── Blog.tsx
│       ├── Reviews.tsx
│       ├── Instagram.tsx
│       └── LinkingWords.tsx
│
├── context/
│   ├── Authcontext.tsx           # User state (localStorage)
│   ├── Cartcontext.tsx           # Cart state (sessionStorage)
│   └── FavouritesContext.tsx     # Wishlist state (localStorage)
│
├── lib/
│   └── wordpress.ts              # WP REST + WC REST helpers + types
│
├── types/
│   ├── product.ts                # WCProduct interface
│   └── blog.ts                   # WPPost interface
│
├── data/
│   └── products.json             # Seed data for WooCommerce import
│
├── scripts/
│   ├── import-products-to-wc.ts  # Batch import products → WooCommerce
│   └── import-blog-to-wp.ts      # Import blog posts → WordPress
│
├── public/
│   ├── fonts/                    # Noto Sans, Candal (self-hosted)
│   ├── icons/                    # SVG icons
│   └── img/                      # Static images (banner, catalog, etc.)
│
└── documentation/
    └── diagrams/                 # Architecture diagrams (.puml + .png)
```

---

## Rendering Strategy

| Page | Strategy | Revalidate | Reason |
|---|---|---|---|
| Home | SSG | 3600s | Mostly static, high traffic |
| Shop / Categories | SSR | — | Dynamic filters, always fresh |
| Product Detail | ISR | 3600s | Product data changes infrequently |
| Blog Listing | SSG | 3600s | Content rarely changes |
| Blog Post | SSG | 3600s | Static content |
| Discounts | SSR | — | Sale prices change frequently |
| Search | SSR | — | Query-dependent, always fresh |
| Cart | Client | — | User-specific, no SEO needed |
| Orders | Client | — | Authenticated, user-specific |
| Favourites | Client | — | localStorage only |

---

## API Layer

### BFF — Next.js API Routes

Next.js API Routes act as a Backend For Frontend (BFF) — proxying sensitive auth operations server-side to avoid exposing WooCommerce credentials to the browser.

#### `POST /api/auth/login`
```
1. POST /wp-json/jwt-auth/v1/token  → get JWT
2. GET  /wp-json/wp/v2/users/me     → get user profile
3. Return { token, user }
```

#### `POST /api/auth/register`
```
1. POST /wp-json/wc/v3/customers    → create WC customer
2. POST /wp-json/jwt-auth/v1/token  → auto-login, get JWT
3. GET  /wp-json/wp/v2/users/me     → get user profile
4. Return { token, user }
```

#### `GET /api/search?q=query`
```
1. GET /wp-json/wc/v3/products?search=query&status=publish
2. Return WCProduct[]
```

### Direct WP/WC API calls (Server Components)

Server components call WooCommerce/WordPress APIs directly — credentials stay server-side, results are cached via Next.js `fetch` with `revalidate`.

```typescript
// lib/wordpress.ts — example
export async function getProducts(params = {}): Promise<WCProduct[]> {
  return wpFetch(wcUrl('/products', { per_page: '20', status: 'publish', ...params }));
}
```

---

## State Management

All client-side state is managed via React Context — no external state library needed.

| Context | Storage | Data |
|---|---|---|
| `AuthContext` | localStorage | JWT token, user profile |
| `CartContext` | sessionStorage | Cart items, quantities, total |
| `FavouritesContext` | localStorage | Wishlist product IDs |

---

## Environment Variables

### Frontend (`.env.local`)

```env
# WordPress + WooCommerce backend URL
WORDPRESS_URL=https://your-wordpress-site.com
NEXT_PUBLIC_WORDPRESS_URL=https://your-wordpress-site.com

# WooCommerce REST API credentials
# WP Admin → WooCommerce → Settings → Advanced → REST API
WC_CONSUMER_KEY=ck_xxxxxxxxxxxxxxxxxxxx
WC_CONSUMER_SECRET=cs_xxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_WC_CONSUMER_KEY=ck_xxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_WC_CONSUMER_SECRET=cs_xxxxxxxxxxxxxxxxxxxx
```

> ⚠️ For production, use server-only env vars (without `NEXT_PUBLIC_`) for WC credentials. API Routes handle auth server-side.

---

## Quickstart

### Requirements
- Node.js 18+
- WordPress site with WooCommerce installed and running
- WooCommerce REST API credentials

### 1. Clone and install

```bash
git clone <repo-url>
cd coom-endem
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
# Fill in your WordPress URL and WooCommerce API keys
```

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Build for production

```bash
npm run build
npm start
```

---

## WordPress Setup

### Required Plugins

| Plugin | Purpose |
|---|---|
| WooCommerce | E-commerce backend |
| JWT Authentication for WP REST API | Login endpoint |
| (Optional) Cloudinary | Image CDN integration |

### WooCommerce REST API Keys

1. Go to **WP Admin → WooCommerce → Settings → Advanced → REST API**
2. Click **Add Key**
3. Set permissions to **Read/Write**
4. Copy `Consumer Key` and `Consumer Secret` to `.env.local`

### JWT Auth Plugin Setup

Add to `wp-config.php`:
```php
define('JWT_AUTH_SECRET_KEY', 'your-secret-key');
define('JWT_AUTH_CORS_ENABLE', true);
```

---

## Data Import Scripts

Populate your WooCommerce store from `data/products.json`:

```bash
# Import products to WooCommerce
npx dotenv-cli -e .env.local -- npx tsx scripts/import-products-to-wc.ts

# Import blog posts to WordPress
npx dotenv-cli -e .env.local -- npx tsx scripts/import-blog-to-wp.ts
```

The `products.json` file follows this structure:
```json
[
  {
    "id": 1,
    "name": "Product Name",
    "description": "Short description",
    "fullDescription": "Full HTML description",
    "price": 29.99,
    "salePrice": 24.99,
    "categories": ["Organic", "Nuts"],
    "tags": ["organic", "vegan"],
    "imageUrl": "https://..."
  }
]
```

---

## Demo

> Live demo uses static mock data from `data/products.json`.  
> Connect your own WooCommerce instance via `.env.local` to enable full API integration.

- 🔗 [Live Demo](https://your-demo.vercel.app)
- 🐙 [GitHub Repository](https://github.com/yourusername/coom-endem)

---

## License

© 2025–2026 Ilyas Salimov. All rights reserved.

Telegram: [@Ilyas_ones](https://t.me/Ilyas_ones)