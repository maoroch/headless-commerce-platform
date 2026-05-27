# 🌿 Coom Endem: Headless E-Commerce Template

[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2016-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![WordPress](https://img.shields.io/badge/CMS-WordPress--Headless-blue?style=for-the-badge&logo=wordpress)](https://wordpress.org/)
[![WooCommerce](https://img.shields.io/badge/Shop-WooCommerce%20API-purple?style=for-the-badge&logo=woocommerce)](https://woocommerce.com/)
[![Docker](https://img.shields.io/badge/Container-Docker%20Compose-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

An enterprise-grade, blazing-fast, **completely decoupled headless e-commerce store** built with a **Next.js 16 App Router** frontend and a **WordPress + WooCommerce** API-first backend. Everything is fully containerized with **Docker Compose** for a seamless, zero-config, one-command local developer experience.

> 🌟 **Perfect Portfolio Template for Upwork Clients & Developers:** This repository serves as a production-ready, hyper-optimized architectural showcase demonstrating how to decouple traditional CMS setups to achieve superior Core Web Vitals (INP, LCP) and bulletproof security.

---

## 🎯 Executive Summary & Business Value

Traditional WooCommerce stores suffer from slow page load times, high server costs, and database vulnerabilities. **Coom Endem** solves this by separating the presentation layer from the database layer.

### Why Headless Next.js + WooCommerce?
* **🚀 Blistering Speed & Performance:** Perfect Google Lighthouse and Core Web Vitals scores by leveraging Next.js static page pre-rendering (SSG), Incremental Static Regeneration (ISR), and Client-side Hydration.
* **🛡 Bulletproof Security:** The WordPress admin dashboard and database are completely hidden behind the internal Docker network. Attackers cannot access or scan `/wp-admin/` or execute SQL injections from the browser.
* **💰 Zero-Cost Server Scaling:** The Next.js frontend can be deployed to edge networks like **Vercel** or **Netlify** for free, serving millions of pageviews. The WordPress backend only needs to handle API calls from Next.js, dramatically reducing server requirements.
* **✍ Familiar Admin Panel:** Shop managers, marketing teams, and content writers continue to manage products, categories, orders, coupons, and blogs using the beloved **WordPress Admin Dashboard** without needing to touch code.

---

## 🗺 System Architecture

This project is built following the **C4 Software Architecture Model**. Below is the system context mapping how components communicate.

### System Context

```
                   +---------------------+
                   | Visitor / Customer  |
                   +----------+----------+
                              |
                              | Browses / Purchases (HTTPS)
                              v
                   +---------------------+          Deploys to           +-------------------+
                   |  Next.js Storefront | +---------------------------> |   Vercel / Edge   |
                   +----------+----------+                               +-------------------+
                              |
                              | WooCommerce REST API (/wp-json/wc/v3/*) [Server-Side Only]
                              | JWT Authentication / SSL-Bypassed Query Params
                              v
                   +---------------------+          Runs on              +-------------------+
                   | WordPress Backend   | +---------------------------> | VPS / Host Server |
                   +----------+----------+                               +-------------------+
                              |
                              | Local TCP / Unix Socket
                              v
                   +---------------------+
                   |    MySQL 8 DB       |
                   +---------------------+
```

### Architectural Highlights (How It Works Under the Hood)
1. **BFF (Backend-for-Frontend) API Proxy:** The Next.js frontend interacts with the WooCommerce API *strictly server-side* via API Routes (`/api/shop`, `/api/products`). **WooCommerce REST API keys never leak to the client.**
2. **Global Media Translation:** To bypass Docker container network resolving issues inside client browsers, a custom utility dynamically translates internal container-facing image URLs (`https://wordpress/...`) into host-accessible public URLs (`http://localhost:8080/...`) in all parsed JSON payloads before rendering.
3. **Internal SSL Spoofing:** To allow local query parameter authentication over standard HTTP without SSL/HTTPS warnings breaking WooCommerce REST API requests, a custom Must-Use WordPress plugin (`wp-content/mu-plugins/bypass-wc-ssl-check.php`) is auto-loaded to spoof `$_SERVER['HTTPS'] = 'on'` strictly for `/wp-json/` routes.

---

## 🐳 Automated One-Command Developer Experience

Getting a headless e-commerce system running locally can be incredibly painful (syncing databases, setting up permalinks, importing assets, configuring plugin keys). **Coom Endem automates all of this.**

When you run `docker compose up --build`, the entire stack orchestrates automatically:
* **🔄 DB Auto-Seeding:** The MySQL container imports initial table structures, products, pages, and blogs from the structured `seed.sql` dump.
* **📦 Asset Auto-Extraction:** The container checks the `wp-content/uploads` directory. If empty, it extracts the 168 MB `uploads.zip` file containing high-res product and blog graphics and correctly adjusts file permissions (`chown -R www-data:www-data`) for Apache.
* **🔗 Pretty Permalinks Generator:** WP-CLI automatically configures pretty permalinks (`wp rewrite structure '/%postname%/' --hard`), which is required for WooCommerce REST API endpoints.
* **🧩 Force-Install plugin & Theme:** WP-CLI automatically downloads and activates the correct **WooCommerce (10.7.0)** plugin and **Storefront** theme even if the database already lists them as active.
* **🔑 Auto-Generated API Credentials:** A custom PHP script executes inside the container on startup, automatically generating and hashing the WooCommerce REST API credentials used by the Next.js frontend and saving them in the `wp_woocommerce_api_keys` table.
* **⏳ Compiling Wait-Loop:** Next.js uses a custom Node.js polling loop at container startup to wait until the WordPress REST API is fully responsive (`200 OK`) before beginning page pre-rendering (`next build`), preventing compile-time race conditions.

---

## 📂 Project Structure

```
├── backend/
│   └── wordpress/           # WordPressPersistent volume maps & plugins
│       ├── Dockerfile       # Custom WordPress + WP-CLI + Unzip image
│       └── wp-content/      # Themes, plugins, and uploaded assets
├── docker/
│   ├── assets/              # Compressed assets zip (uploads.zip)
│   ├── mysql/               # MySQL seed SQL dump (seed.sql)
│   └── scripts/             # Container initialization bash files
├── documentation/
│   └── diagrams/            # Architecture C4 & UML diagrams (PNG + PUML)
├── front-end/
│   ├── app/                 # Next.js 16 App Router (Pages, Components & APIs)
│   ├── lib/                 # Core API fetch client & global replacements
│   ├── Dockerfile           # Next.js NodeJS production build image
│   └── next.config.ts       # Next.js configurations & image optimization bypassed
├── docker-compose.yml       # Docker orchestrator configuration
└── .env.example             # Initial environment configuration keys
```

---

## 🚀 Getting Started

### Prerequisites
* **Docker** and **Docker Compose** installed on your Mac, Windows, or Linux system.
* That's it! Everything else (Node.js, PHP, MySQL, Apache) runs inside the container sandbox.

### 1. Initial Setup
Clone the repository and copy the environment variables file:
```bash
git clone https://github.com/maoroch/coom-endem.git
cd coom-endem
cp .env.example .env
```

### 2. Run the Stack
Bring up the entire system with Docker Compose:
```bash
docker compose down -v  # Clear previous cache (if any)
docker compose up --build
```
*Sit back and relax! The startup script will install dependencies, unpack all images, seed the database, and compile the Next.js pages.*

### 3. Access the URLs
Once the Next.js container finishes compiling, open the following links in your browser:
* **🛍 Next.js Frontend Storefront**: [http://localhost:3000](http://localhost:3000) *(Use an Incognito tab or refresh with `Cmd+Shift+R` to clear browser cache)*
* **⚙️ Headless WordPress Admin**: [http://localhost:8080/wp-admin/](http://localhost:8080/wp-admin/)
  * **Username:** `admin`
  * **Password:** `admin123`
* **📦 DB Adminer (Optional)**: If you need to view raw tables.

---

## 🤝 Portfolio Presentation (For Upwork & Clients)

This project displays a high-degree of full-stack engineering proficiency. Key points to highlight to clients:
1. **Headless CMS integration:** The capability to decouple standard monolithic CMS databases.
2. **Next.js API Routes (BFF):** Demonstrates secure client-server architectures by hiding REST keys.
3. **Advanced Dockerization:** Orchestrating multi-container systems that resolve network DNS issues, automate asset extraction, and eliminate compile-time race conditions.
4. **Clean Code & Typings:** Strict TypeScript usage for WooCommerce payloads (`WCProduct`, `WCCategory`, `WPPost`).

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).