#!/bin/bash
set -e

echo "⏳ Waiting for DB..."

# Wait until we can connect to MySQL using PHP (to avoid mysql CLI SSL issues)
until php -r "\$mysqli = new mysqli('${WORDPRESS_DB_HOST}', '${WORDPRESS_DB_USER}', '${WORDPRESS_DB_PASSWORD}'); if (\$mysqli->connect_error) { exit(1); } exit(0);"; do
  sleep 5
done

echo "🚀 Installing WordPress..."

if ! wp core is-installed --allow-root; then
  wp core install \
    --url="http://localhost:8080" \
    --title="Demo Shop" \
    --admin_user="admin" \
    --admin_password="admin123" \
    --admin_email="admin@test.com" \
    --skip-email \
    --allow-root
fi

echo "🧩 Installing WooCommerce..."

wp plugin install woocommerce --activate --allow-root || true

echo "🎨 Theme..."

wp theme install storefront --activate --allow-root || true

echo "🎉 Done"

exec apache2-foreground