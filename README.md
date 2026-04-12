# Coom Endem — Organic Products Store

**Coom Endem** is a modern e-commerce web application for organic and natural products. The store promotes healthy, eco-friendly living by offering a curated selection of organic food items, transparent pricing, and a clean shopping experience.

## About the Project

The homepage showcases the brand's key values — 100% natural products, fair prices, eco-friendly packaging, fast delivery, and a wide selection — and includes the following sections:

- **Hero Banner** — full-screen responsive banner with a call-to-action button linking to the products page.
- **Key Benefits** — a highlights bar with emojis summarising the brand's five core promises.
- **Product Catalog** — a 4-column grid of featured organic products with ratings, descriptions, prices, add-to-favourites and add-to-cart interactions.
- **Food Blog** — two colourful blog post cards ("Reasons to Go Organic" and "Healthy Snack Ideas") with a "Read More" button.
- **Instagram Section** — auto-scrolling infinite carousel linking to the brand's Instagram feed.
- **Navbar** — sticky, hide-on-scroll navigation with a search bar, page links (Home, Products, Categories, Sales, Discounts, Blog), and user links (Favourites, Orders, Sign In). Fully responsive with a slide-in mobile menu.
- **Footer** — newsletter subscription button, grouped links (Customer Support, For Businesses, Legal), copyright, and social media icons (Facebook, Instagram, LinkedIn).

## Key Features

- **Responsive Design** — fully adaptive layout across mobile, tablet, and desktop using Tailwind CSS breakpoints and a slide-in mobile drawer menu.
- **Hide-on-Scroll Navbar** — sticky navigation bar that automatically hides when scrolling down and reappears when scrolling up, keeping the screen real estate clean on mobile.
- **Product Catalog with Interactions** — 4-column product grid with hover-reveal "Add to Cart" button, toggleable heart (favourites) button with active state, star ratings, and review counts.
- **Favourites Management** — client-side favourites list tracked in React state; heart icon fills red when a product is added to favourites.
- **Integrated Search** — search bar in the navbar (desktop and mobile) that routes the user to `/search?q=…` on submit or on Enter key press.
- **Auto-Scrolling Instagram Carousel** — infinite CSS-animated image strip that loops seamlessly, linking to the brand's Instagram feed.
- **Food Blog Section** — visually rich blog post cards with cover images, category tags, titles, and "Read More" call-to-action buttons.
- **Newsletter Subscription** — footer email opt-in with a subscribe button.
- **Local Custom Fonts** — `Noto Sans` (multiple weights) and `Candal` served from `public/fonts/` as `.woff2` files for zero-dependency typography.
- **WordPress + WooCommerce Backend** — product catalogue and blog content are managed through a [WordPress](https://wordpress.org) CMS with the [WooCommerce](https://woocommerce.com) plugin. The Next.js front-end fetches product and post data from the WordPress REST API / WooCommerce REST API, keeping content updates completely code-free for store managers.

## Tech Stack

| Technology | Version |
|---|---|
| [Next.js](https://nextjs.org) | 16.1.4 |
| [React](https://react.dev) | 19.2.3 |
| [TypeScript](https://www.typescriptlang.org) | ^5 |
| [Tailwind CSS](https://tailwindcss.com) | ^4 |
| [lucide-react](https://lucide.dev) | ^0.563.0 |

Custom fonts: **Noto Sans** (multiple weights) and **Candal**, served locally as `.woff2` files from `public/fonts/`.

## Project Structure

```
coom-endem/
├── app/
│   ├── layout.tsx                   # Root layout (Navbar + Footer + metadata)
│   ├── page.tsx                     # Homepage — assembles all sections
│   ├── globals.css                  # Global styles
│   └── components/
│       ├── Navbar/
│       │   └── NavbarMain.tsx       # Responsive sticky navbar with scroll hide
│       ├── Footer/
│       │   └── Footer.tsx           # Footer with links and social icons
│       └── pages/home/
│           ├── Banner.tsx           # Hero banner
│           ├── LinkingWords.tsx     # Key benefits bar
│           ├── ProductCatalog.tsx   # Product grid with favourites & cart
│           ├── Blog.tsx             # Food blog section
│           └── Instagram.tsx        # Auto-scroll Instagram carousel
├── public/
│   ├── img/                         # Product, banner, blog and Instagram images
│   ├── icons/                       # SVG icons (search, star, social, auth…)
│   ├── fonts/                       # Local woff2 font files
│   └── img/logos/logo.svg           # Brand logo
├── next.config.ts
├── tailwind.config / postcss.config.mjs
└── tsconfig.json
```

## Getting Started

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm start` | Start the production server |
| `npm run lint` | Run ESLint |

## Deployment

The easiest way to deploy is via [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme):

```bash
npm run build
```

See the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for other hosting options.
