# Headless E-Commerce · Next.js + WooCommerce

> Modern headless storefront — Next.js 16 frontend powered by WordPress + WooCommerce as a headless backend via REST API

![Next.js](https://img.shields.io/badge/Next.js-16.1-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38BDF8?logo=tailwindcss)
![WooCommerce](https://img.shields.io/badge/WooCommerce-REST_API-7F54B3?logo=woocommerce)
![WordPress](https://img.shields.io/badge/WordPress-REST_API-21759B?logo=wordpress)

---

> 📋 [Full case study](https://ilyas.dev/projects/headless-ecommerce) · 🔗 [Live demo](https://your-demo.vercel.app)

---

## Overview

A production-ready headless e-commerce platform that replaces the traditional WordPress/WooCommerce theme with a blazing-fast Next.js storefront. WooCommerce runs purely as a backend — managing products, orders, customers, reviews and coupons — while Next.js handles rendering, routing and user experience.

**Architecture:** Next.js consumes WooCommerce REST API (`/wp-json/wc/v3/*`) and WordPress REST API (`/wp-json/wp/v2/*`) via server components for SSG/SSR pages, and a BFF (Backend For Frontend) layer via Next.js API Routes for all auth and transactional flows. JWT tokens are verified server-side using `jsonwebtoken` — credentials never reach the browser.

---

## Architecture Diagrams

### System Context
<img src="documentation/diagrams/png/Headless E-Commerce System Context.png" alt="System Context" width="600">

### Container Diagram
<img src="documentation/diagrams/png/Headless E-Commerce Container Diagram.png" alt="Container Diagram" width="600">

### Data Flow
<img src="documentation/diagrams/png/Headless E-Commerce Data Flow.png" alt="Data Flow" width="400">

### Frontend Components
<img src="documentation/diagrams/png/Headless E-Commerce Frontend Components.png" alt="Component Diagram">

> PlantUML source files available in `documentation/diagrams/*.puml`

---

## Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Route Groups](#route-groups)
- [Rendering Strategy](#rendering-strategy)
- [API Layer](#api-layer)
- [State Management](#state-management)
- [SEO](#seo)
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
- ⭐ **Product reviews** — authenticated review submission + display
- 🏷️ **Discounts page** — sale products + active coupons
- ❤️ **Favourites** — client-side wishlist persisted in localStorage
- 🛒 **Cart** — persistent cart via sessionStorage, quantity management

### Checkout & Orders
- 💳 **Checkout** — billing/shipping form, payment method selection, order note
- ✅ **Order confirmation** — post-checkout confirmation page with order summary
- 📋 **Orders history** — authenticated order list with status filtering
- 🔍 **View order** — detailed single order page

### Auth
- 🔐 **Login** — JWT authentication via `wp-jwt-auth` WordPress plugin
- 📝 **Register** — customer creation via WooCommerce Customers API + auto-login
- 🔑 **Forgot password** — password reset via WordPress native flow

### Blog
- 📰 **Blog listing** — WordPress posts with featured images and categories
- 📄 **Post detail** — full post with read time, tags, author

### Admin (WordPress side)
- ✅ Full product & review management via WooCommerce admin
- ✅ Blog content via WordPress editor
- ✅ Order management, coupon management
- ✅ Customer management

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| Next.js | 16.1 | App Router, SSR/SSG/ISR, Route Groups |
| React | 19 | UI components |
| TypeScript | 5 | Type safety |
| Tailwind CSS | 4 | Styling |
| Lucide React | 0.563 | Icons |
| jsonwebtoken | 9 | Server-side JWT verification |

### Backend (Headless)
| Technology | Purpose |
|---|---|
| WordPress | CMS, Blog, User management |
| WooCommerce | Products, Orders, Customers, Reviews, Coupons |
| WooCommerce REST API (`/wc/v3/*`) | Products, Categories, Coupons, Customers, Orders, Reviews |
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
├── app/
│   ├── layout.tsx                        # Root layout — providers, fonts, SEO
│   │
│   ├── (landing)/                        # Public landing page
│   │   └── page.tsx                      # Home (SSG)
│   │
│   ├── (auth)/                           # Auth route group — shared layout
│   │   ├── login/page.tsx                # Login (Client)
│   │   ├── register/page.tsx             # Registration (Client)
│   │   └── forgot-password/page.tsx      # Password reset (Client)
│   │
│   ├── (shop)/                           # Shop route group — shared layout
│   │   ├── shop/
│   │   │   ├── page.tsx                  # Product catalog (SSR)
│   │   │   └── [slug]/page.tsx           # Product detail (ISR)
│   │   ├── categories/
│   │   │   ├── page.tsx                  # All categories (SSR)
│   │   │   └── [slug]/page.tsx           # Category products (SSR)
│   │   ├── search/page.tsx               # Search results (SSR)
│   │   ├── discounts/page.tsx            # Sale products + coupons (SSR)
│   │   ├── favourites/page.tsx           # Wishlist (Client)
│   │   ├── cart/page.tsx                 # Cart (Client)
│   │   ├── checkout/page.tsx             # Checkout form (Client)
│   │   ├── order-confirmation/[id]/      # Post-checkout confirmation (Client)
│   │   ├── orders/page.tsx               # Order history (Client + Auth)
│   │   └── view-order/[id]/page.tsx      # Single order detail (Client + Auth)
│   │
│   ├── (pages)/                          # Content route group
│   │   └── blog/
│   │       ├── page.tsx                  # Blog listing (SSG)
│   │       └── [slug]/page.tsx           # Post detail (SSG)
│   │
│   └── api/                              # BFF — Next.js API Routes
│       ├── auth/
│       │   ├── login/route.ts            # JWT login
│       │   ├── register/route.ts         # WC customer creation
│       │   └── forgot-password/route.ts  # WP password reset
│       ├── products/route.ts             # Product proxy
│       ├── categories/route.ts           # Categories proxy
│       ├── orders/route.ts               # Authenticated orders (GET)
│       ├── create-order/route.ts         # Order creation (POST)
│       ├── reviews/route.ts              # Product reviews (GET + POST)
│       └── search/route.ts              # Product search proxy
│
├── components/
│   ├── Navbar/
│   │   ├── NavbarMain.tsx                # Navigation, cart count
│   │   └── Usermenu.tsx                  # Auth state, logout
│   ├── Footer/Footer.tsx
│   ├── AddToCartButton.tsx               # CartContext
│   ├── FavouriteButton.tsx               # FavouritesContext
│   └── pages/home/                       # Home page sections
│       ├── Banner.tsx
│       ├── Catalog.tsx
│       ├── ProductCatalog.tsx
│       ├── Blog.tsx
│       ├── Reviews.tsx
│       ├── Instagram.tsx
│       └── LinkingWords.tsx
│
├── context/
│   ├── Authcontext.tsx                   # User state (localStorage)
│   ├── Cartcontext.tsx                   # Cart state (sessionStorage)
│   └── FavouritesContext.tsx             # Wishlist state (localStorage)
│
├── lib/
│   ├── wordpress.ts                      # WP REST + WC REST helpers + types
│   └── seo.ts                            # Metadata helpers, generateProductMetadata
│
├── types/
│   ├── product.ts                        # WCProduct interface
│   ├── blog.ts                           # WPPost interface
│   └── orders.ts                         # WCOrder, WCLineItem, OrderStatus
│
├── scripts/
│   ├── import-products-to-wc.ts          # Batch import products → WooCommerce
│   └── import-blog-to-wp.ts              # Import blog posts → WordPress
│
├── public/
│   ├── fonts/                            # Noto Sans, Candal (self-hosted)
│   ├── icons/                            # SVG icons
│   └── img/                              # Static images
│
└── documentation/
    └── diagrams/                         # Architecture diagrams (.puml + .png)
```

---

## Route Groups

The app uses Next.js **Route Groups** to organize layouts without affecting URL structure:

| Group | Path | Layout | Purpose |
|---|---|---|---|
| `(landing)` | `/` | Minimal | Homepage only |
| `(auth)` | `/login`, `/register`, `/forgot-password` | Auth layout | Shared auth UI |
| `(shop)` | `/shop`, `/cart`, `/checkout`, `/orders`, ... | Shop layout | Full storefront |
| `(pages)` | `/blog`, `/blog/[slug]` | Content layout | Blog & static pages |

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
| Checkout | Client | — | Transactional, no SEO needed |
| Orders / View Order | Client | — | Authenticated, user-specific |
| Order Confirmation | Client | — | Post-checkout only |
| Favourites | Client | — | localStorage only |

---

## API Layer

### BFF — Next.js API Routes

All sensitive operations run server-side. JWT tokens are verified using `jsonwebtoken` + `JWT_AUTH_SECRET` env var — no raw credentials exposed to the client.

#### Auth

**`POST /api/auth/login`**
```
1. POST /wp-json/jwt-auth/v1/token   → get JWT
2. GET  /wp-json/wp/v2/users/me      → get user profile
3. Return { token, user }
```

**`POST /api/auth/register`**
```
1. POST /wp-json/wc/v3/customers     → create WC customer
2. POST /wp-json/jwt-auth/v1/token   → auto-login, get JWT
3. GET  /wp-json/wp/v2/users/me      → get user profile
4. Return { token, user }
```

**`POST /api/auth/forgot-password`**
```
1. POST /wp-login.php?action=lostpassword  → trigger WP reset email
2. Return generic success message (no email existence leak)
```

#### Orders

**`POST /api/create-order`** *(authenticated or guest)*
```
1. Verify JWT from Authorization header → extract customer_id
2. POST /wp-json/wc/v3/orders  → create order in WooCommerce
3. customer_id linked if authenticated, guest order if not
```

**`GET /api/orders`** *(authenticated only)*
```
1. Verify JWT → extract customer_id
2. GET /wp-json/wc/v3/orders?customer={id}
3. Return order list filtered by customer
```

#### Reviews

**`GET /api/reviews?product_id=123`**
```
GET /wp-json/wc/v3/products/reviews?product=123
```

**`POST /api/reviews`** *(authenticated only)*
```
1. Verify JWT → extract user info
2. POST /wp-json/wc/v3/products/reviews
```

#### Products & Search

**`GET /api/products`** — proxy with query params forwarding  
**`GET /api/categories`** — category list proxy  
**`GET /api/search?q=query`** — product search proxy

---

## State Management

| Context | Storage | Data |
|---|---|---|
| `AuthContext` | localStorage | JWT token, user profile |
| `CartContext` | sessionStorage | Cart items, quantities, total |
| `FavouritesContext` | localStorage | Wishlist product IDs |

---

## SEO

Centralized in `lib/seo.ts`:

- `defaultMetadata` — site-wide title template, OG, Twitter cards
- `pageMetadata` — static metadata per page key (shop, cart, blog, orders, etc.)
- `getPageMetadata(key)` — helper to generate page metadata
- `generateProductMetadata(slug)` — dynamic metadata for product pages (fetches product, extracts description and image)
- `viewport` — device-width config

---

## Environment Variables

```env
# WordPress + WooCommerce
WORDPRESS_URL=https://your-wordpress-site.com

# WooCommerce REST API Keys
# WP Admin → WooCommerce → Settings → Advanced → REST API
WC_CONSUMER_KEY=ck_xxxxxxxxxxxxxxxxxxxx
WC_CONSUMER_SECRET=cs_xxxxxxxxxxxxxxxxxxxx

# JWT secret — must match JWT_AUTH_SECRET_KEY in wp-config.php
JWT_AUTH_SECRET=your-jwt-secret-key
```

> ⚠️ All env vars are server-only (no `NEXT_PUBLIC_` prefix) — credentials stay on the server. JWT tokens are verified server-side via `jsonwebtoken`.

---

## Quickstart

### Requirements
- Node.js 18+
- WordPress site with WooCommerce and JWT Auth plugin

### 1. Clone and install

```bash
git clone <repo-url>
cd coom-endem
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
# Fill in WORDPRESS_URL, WC_CONSUMER_KEY, WC_CONSUMER_SECRET, JWT_AUTH_SECRET
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
| JWT Authentication for WP REST API | Login endpoint + token issuance |
| (Optional) Cloudinary | Image CDN integration |

### WooCommerce REST API Keys

1. **WP Admin → WooCommerce → Settings → Advanced → REST API**
2. Click **Add Key** → permissions **Read/Write**
3. Copy `Consumer Key` and `Consumer Secret` to `.env.local`

### JWT Auth Plugin Setup

Add to `wp-config.php`:
```php
define('JWT_AUTH_SECRET_KEY', 'your-secret-key'); // Must match JWT_AUTH_SECRET in .env.local
define('JWT_AUTH_CORS_ENABLE', true);
```

---

## Data Import Scripts

```bash
# Import products from data/products.json → WooCommerce
npx dotenv-cli -e .env.local -- npx tsx scripts/import-products-to-wc.ts

# Import blog posts → WordPress
npx dotenv-cli -e .env.local -- npx tsx scripts/import-blog-to-wp.ts
```

---

## Demo

> Live demo uses static mock data. Connect your WooCommerce instance via `.env.local` for full API integration.

- 🔗 [Live Demo](https://your-demo.vercel.app)
- 🐙 [GitHub Repository](https://github.com/maoroch/headless-commerce-platform)

---

## License

© 2025–2026 Ilyas Salimov. All rights reserved.  
Telegram: [@Ilyas_ones](https://t.me/Ilyas_ones)