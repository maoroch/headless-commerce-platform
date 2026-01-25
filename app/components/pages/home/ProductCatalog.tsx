'use client'
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart } from "lucide-react";
import { useState } from "react";

export default function ProductCatalog() {
  const [favorites, setFavorites] = useState<number[]>([]);

  const products = [
    {
      id: 1,
      name: "Organic Chocolate Cake Slice",
      description: "A rich and decadent chocolate cake made with organic ingredients.",
      price: 4.99,
      rating: 4.9,
      reviews: 120,
      image: "/img/home/products/1.png",
    },
    {
      id: 2,
      name: "Almond Milk with Chia & Blueberries",
      description: "A creamy almond milk infused with chia seeds and blueberries.",
      price: 5.99,
      rating: 4.8,
      reviews: 100,
      image: "/img/home/products/2.png",
    },
    {
      id: 3,
      name: "Fresh Organic Strawberries",
      description: "Juicy and sweet organic strawberries, perfect for snacking or desserts.",
      price: 6.99,
      rating: 4.7,
      reviews: 80,
      image: "/img/home/products/3.png",
    },
    {
      id: 4,
      name: "Buttery Croissants with Almonds",
      description: "Flaky and buttery croissants filled with almond paste and topped with sliced almonds.",
      price: 5.49,
      rating: 4.6,
      reviews: 60,
      image: "/img/home/products/4.png",
    },
  ];

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  return (
    <div className="product-catalog px-4 sm:px-6 lg:px-15 py-8 sm:py-12 lg:py-16 mt-8 sm:mt-12 lg:mt-16">
      {/* Header Section */}
      <div className="info mb-10 sm:mb-12 lg:mb-16 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-0">
        <div className="first-info flex-1">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
            Product Catalog
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 mt-3 sm:mt-4 leading-relaxed max-w-2xl">
            Discover our range of organic products, carefully sourced and crafted to delight your senses.
          </p>
        </div>
        <Link
          href="/shop"
          className="
            group
            inline-flex
            items-center
            gap-2
            text-base
            sm:text-lg
            font-semibold
            text-black
            hover:text-gray-700
            transition-colors
            duration-200
          "
        >
          View All Products
          <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
        </Link>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="
              product-item
              group
              flex
              flex-col
              rounded-xl
              overflow-hidden
              transition-all
              duration-300
              hover:shadow-lg
              bg-white
            "
          >
            {/* Image Container */}
            <div className="relative overflow-hidden bg-gray-100 aspect-square">
              <Image
                src={product.image}
                width={500}
                height={500}
                alt={product.name}
                className="
                  w-full
                  h-full
                  object-cover
                  transition-transform
                  duration-300
                  group-hover:scale-105
                "
              />

              {/* Favorite Button */}
              <button
                onClick={() => toggleFavorite(product.id)}
                className="
                  absolute
                  top-3
                  right-3
                  p-2
                  rounded-full
                  bg-white
                  shadow-md
                  transition-all
                  duration-200
                  hover:shadow-lg
                  active:scale-90
                "
                aria-label="Add to favorites"
              >
                <Heart
                  size={20}
                  className={`transition-all duration-200 ${
                    favorites.includes(product.id)
                      ? "fill-red-500 text-red-500"
                      : "text-gray-600 hover:text-red-500"
                  }`}
                />
              </button>

              {/* Add to Cart Button */}
              <button
                className="
                  absolute
                  bottom-3
                  right-3
                  p-2.5
                  rounded-full
                  bg-black
                  text-white
                  shadow-md
                  transition-all
                  duration-200
                  hover:bg-gray-900
                  hover:shadow-lg
                  active:scale-90
                  opacity-0
                  group-hover:opacity-100
                "
                aria-label="Add to cart"
              >
                <ShoppingCart size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-4 sm:p-5">
              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1">
                  <Image
                    src="/icons/star.svg"
                    alt="Star"
                    width={18}
                    height={18}
                  />
                  <span className="text-sm font-semibold text-black">
                    {product.rating}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  ({product.reviews} reviews)
                </span>
              </div>

              {/* Title */}
              <h3 className="text-base sm:text-lg font-bold leading-snug mb-2 line-clamp-2 hover:text-yellow-500 transition-colors">
                {product.name}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4 flex-1 line-clamp-2 leading-relaxed">
                {product.description}
              </p>

              {/* Price */}
              <span className="text-lg font-bold text-black">
                ${product.price.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}