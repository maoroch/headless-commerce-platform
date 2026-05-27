# Coom Endem E-commerce

A modern, fast, and full-stack e-commerce project leveraging **Next.js** for the frontend and **WordPress + WooCommerce** as a headless backend API. Everything is containerized with **Docker** for a seamless, one-command development experience.

## Features

- ⚡️ **Next.js 16 (App Router)** frontend for lightning-fast performance and SEO (SSG & CSR).
- 🛍 **WooCommerce Headless backend**: Content, products, Categories, and Orders are handled by WP REST API & WooCommerce API.
- 🐳 **Dockerized Workflow**: Fully automated local environment bringing up Front-end, Database, and WordPress containers in a single command.
- 🔄 **Automated Initialization**: Database seeds from `seed.sql` on first boot, and a built-in bash script handles WP-CLI automatic WordPress Core & WooCommerce plugin setup/active configuration.
- 🎨 **Tailwind CSS** integration.

---

## 🚀 Getting Started

### Prerequisites
- Docker and Docker Compose installed.
- Node.js (v18+) for local frontend development (optional if you develop purely inside Docker).

### 1. Environment Setup

Clone the repository and create your local environment constants file:

```bash
git clone https://github.com/maoroch/coom-endem.git
cd coom-endem
cp .env.example .env
```

*Note: For Next.js to communicate with WooCommerce, you will need to generate WooCommerce REST API keys in your WordPress Dashboard under **WooCommerce > Settings > Advanced > REST API** and place them inside `.env`.*

### 2. Start the Development Server

You can bring up the entire stack using Docker Compose:

```bash
docker compose up -d --build
```

**What happens?**
1. Spin up a **MySQL 8** container and seed initial data if `/docker/mysql/seed.sql` is provided.
2. Spin up a **WordPress** container, automatically downloading WP-CLI and activating the **WooCommerce** plugin using `docker/scripts/init-wordpress.sh`.
3. Spin up the **Next.js** container on `http://localhost:3000`.

### 3. Access the Project

- **Storefront (Next.js)**: [http://localhost:3000](http://localhost:3000)
- **WordPress Admin**: [http://localhost:8080/wp-admin/](http://localhost:8080/wp-admin/)
  - Default User: `admin`
  - Default Pass: `admin123`

---

## 📂 Project Structure

- `/front-end`: Next.js 16 React Application.
- `/backend/wordpress`: Persistent volume map for WordPress contents & customized Dockerfile. 
- `/docker`: Assets, DB seeding scripts (`seed.sql`), and WP container bash setup (`init-wordpress.sh`).
- `/documentation`: Component and PlantUML diagrams mapping the architecture.

## 🤝 Contributing

Contributions are welcome! Please feel free to open a Pull Request.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).