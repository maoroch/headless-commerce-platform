'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, SlidersHorizontal, X, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/Cartcontext';
import { useFavourites } from '@/context/FavouritesContext';
import type { WCProduct, WCCategory } from '@/lib/wordpress';

const WP = process.env.NEXT_PUBLIC_WORDPRESS_URL ?? 'http://coom-endem-server.local';
const KEY = process.env.NEXT_PUBLIC_WC_CONSUMER_KEY ?? '';
const SEC = process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET ?? '';

function wcUrl(path: string, params: Record<string, string> = {}) {
  const url = new URL(`${WP}/wp-json/wc/v3${path}`);
  url.searchParams.set('consumer_key', KEY);
  url.searchParams.set('consumer_secret', SEC);
  Object.entries(params).forEach(([k, v]) => v && url.searchParams.set(k, v));
  return url.toString();
}

interface FilterState {
  categories: string[];
  priceRange: [number, number];
  rating: number | null;
  inStock: boolean;
  organic: boolean;
  onSale: boolean;
}

const DEFAULT_FILTERS: FilterState = {
  categories: [],
  priceRange: [0, 1000],
  rating: null,
  inStock: false,
  organic: false,
  onSale: false,
};

export default function ShopPage() {
  const { addToCart } = useCart();
  const { toggleFavourite, isFavourite } = useFavourites();

  const [products, setProducts] = useState<WCProduct[]>([]);
  const [categories, setCategories] = useState<WCCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    fetch(wcUrl('/products/categories', { hide_empty: 'true', per_page: '20' }))
      .then(r => r.json())
      .then((data: WCCategory[]) => setCategories(Array.isArray(data) ? data.filter(c => c.slug !== 'uncategorized') : []))
      .catch(() => {});
  }, []);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    const params: Record<string, string> = {
      per_page: '100',
      status: 'publish',
      orderby: sortBy === 'price-desc' ? 'price' : sortBy,
      order: sortBy === 'price-desc' ? 'desc' : 'asc',
    };
    if (filters.categories.length === 1) params.category = filters.categories[0];
    if (filters.onSale) params.on_sale = 'true';
    if (filters.inStock) params.stock_status = 'instock';
    try {
      const data: WCProduct[] = await fetch(wcUrl('/products', params)).then(r => r.json());
      setProducts(Array.isArray(data) ? data : []);
    } catch { setProducts([]); }
    setLoading(false);
  }, [sortBy, filters.categories, filters.onSale, filters.inStock]);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  const filtered = useMemo(() => products.filter(p => {
    const price = parseFloat(p.price) || 0;
    if (price < filters.priceRange[0] || price > filters.priceRange[1]) return false;
    if (filters.organic && !p.tags?.some(t => t.slug === 'organic')) return false;
    if (filters.rating && Number(p.average_rating) < filters.rating) return false;
    return true;
  }), [products, filters.priceRange, filters.organic, filters.rating]);

  const clearFilters = () => { setFilters(DEFAULT_FILTERS); setSortBy('date'); };

  const toggleCategory = (id: string) =>
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(id) ? prev.categories.filter(c => c !== id) : [...prev.categories, id],
    }));

  const activeFilterCount =
    filters.categories.length +
    (filters.inStock ? 1 : 0) + (filters.organic ? 1 : 0) + (filters.onSale ? 1 : 0) +
    (filters.rating ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000 ? 1 : 0);

  const Sidebar = () => (
    <div className="space-y-8">
      {/* Categories */}
      <div className="border-b border-gray-100 pb-8">
        <h3 className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4">Category</h3>
        <div className="space-y-1">
          {categories.map(cat => (
            <label key={cat.id} className="flex items-center gap-3 py-2 px-3 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors group">
              <input type="checkbox" checked={filters.categories.includes(String(cat.id))}
                onChange={() => toggleCategory(String(cat.id))}
                className="w-4 h-4 rounded border-gray-300 accent-black" />
              <span className="text-sm text-gray-700 group-hover:text-black transition-colors">{cat.name}</span>
              <span className="ml-auto text-xs text-gray-400">{cat.count}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="border-b border-gray-100 pb-8">
        <h3 className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4">Price Range</h3>
        <div className="space-y-3">
          <input type="range" min="0" max="1000" value={filters.priceRange[0]}
            onChange={e => setFilters(prev => ({ ...prev, priceRange: [+e.target.value, prev.priceRange[1]] }))}
            className="w-full accent-black" />
          <input type="range" min="0" max="1000" value={filters.priceRange[1]}
            onChange={e => setFilters(prev => ({ ...prev, priceRange: [prev.priceRange[0], +e.target.value] }))}
            className="w-full accent-black" />
          <div className="flex gap-3 mt-2">
            <input type="number" value={filters.priceRange[0]}
              onChange={e => setFilters(prev => ({ ...prev, priceRange: [+e.target.value, prev.priceRange[1]] }))}
              className="w-1/2 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black transition-colors"
              placeholder="Min" />
            <input type="number" value={filters.priceRange[1]}
              onChange={e => setFilters(prev => ({ ...prev, priceRange: [prev.priceRange[0], +e.target.value] }))}
              className="w-1/2 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black transition-colors"
              placeholder="Max" />
          </div>
        </div>
      </div>

      {/* Availability */}
      <div className="border-b border-gray-100 pb-8">
        <h3 className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4">Availability</h3>
        <div className="space-y-1">
          {([
            { label: 'In Stock Only', key: 'inStock' },
            { label: 'Organic Only',  key: 'organic' },
            { label: 'On Sale',       key: 'onSale'  },
          ] as const).map(({ label, key }) => (
            <label key={key} className="flex items-center gap-3 py-2 px-3 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors group">
              <input type="checkbox" checked={!!filters[key]}
                onChange={e => setFilters(prev => ({ ...prev, [key]: e.target.checked }))}
                className="w-4 h-4 rounded border-gray-300 accent-black" />
              <span className="text-sm text-gray-700 group-hover:text-black transition-colors">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div className="border-b border-gray-100 pb-8">
        <h3 className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4">Minimum Rating</h3>
        <select value={filters.rating ?? ''}
          onChange={e => setFilters(prev => ({ ...prev, rating: e.target.value ? +e.target.value : null }))}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black transition-colors bg-white">
          <option value="">Any rating</option>
          <option value="4">4+ stars</option>
          <option value="3">3+ stars</option>
          <option value="2">2+ stars</option>
        </select>
      </div>

      {/* Sort */}
      <div className="border-b border-gray-100 pb-8">
        <h3 className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4">Sort By</h3>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black transition-colors bg-white">
          <option value="date">Newest</option>
          <option value="price">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="popularity">Most Popular</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      <button onClick={clearFilters}
        className="group w-full border border-black rounded-full flex items-center justify-between pl-6 pr-2 py-2 transition-all duration-300 ease-out hover:bg-black hover:text-white active:scale-95">
        <span className="text-sm font-bold tracking-wide">Clear All Filters</span>
        <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center group-hover:bg-white transition-all duration-300 flex-shrink-0">
          <X size={16} className="text-white group-hover:text-black transition-colors duration-300" />
        </div>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-white mt-40">
      <div className="px-4 sm:px-6 lg:px-15 py-8 sm:py-12 lg:py-16 mt-8 sm:mt-12 lg:mt-16">

        <div className="mb-10 sm:mb-12 lg:mb-16 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">Shop All Products</h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 mt-3 sm:mt-4 leading-relaxed max-w-2xl">
              Discover our full range of organic products, carefully sourced and crafted to delight your senses.
            </p>
          </div>
          <p className="text-sm text-gray-500 lg:flex-shrink-0">
            {loading ? 'Loading...' : `${filtered.length} products available`}
          </p>
        </div>

        <div className="lg:hidden mb-6">
          <button onClick={() => setIsFilterOpen(true)}
            className="group inline-flex items-center gap-3 px-6 py-3 bg-black text-white text-sm font-bold rounded-full transition-all duration-300 hover:bg-gray-900 hover:shadow-lg active:scale-95">
            <SlidersHorizontal size={18} />
            Filters
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-white text-black text-xs font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          <aside className={`
            fixed lg:static inset-0 z-50 lg:z-auto bg-white lg:bg-transparent
            w-[300px] lg:w-64 transform transition-transform duration-300 ease-in-out
            ${isFilterOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            overflow-y-auto lg:overflow-visible p-6 lg:p-0 shadow-2xl lg:shadow-none flex-shrink-0
          `}>
            <div className="flex items-center justify-between lg:hidden mb-8">
              <h2 className="text-xl font-bold">Filters</h2>
              <button onClick={() => setIsFilterOpen(false)}
                className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                <X size={18} />
              </button>
            </div>
            <Sidebar />
          </aside>

          <main className="flex-1 min-w-0">
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {filters.categories.map(id => {
                  const cat = categories.find(c => String(c.id) === id);
                  return cat ? (
                    <button key={id} onClick={() => toggleCategory(id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-xs font-semibold text-gray-700 hover:bg-gray-200 transition-colors">
                      {cat.name} <X size={10} />
                    </button>
                  ) : null;
                })}
                {filters.organic && (
                  <button onClick={() => setFilters(p => ({ ...p, organic: false }))}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#B3E5C9] rounded-full text-xs font-semibold text-gray-700 hover:opacity-80">
                    Organic <X size={10} />
                  </button>
                )}
                {filters.onSale && (
                  <button onClick={() => setFilters(p => ({ ...p, onSale: false }))}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFCAB3] rounded-full text-xs font-semibold text-gray-700 hover:opacity-80">
                    On Sale <X size={10} />
                  </button>
                )}
                {filters.inStock && (
                  <button onClick={() => setFilters(p => ({ ...p, inStock: false }))}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-xs font-semibold text-gray-700 hover:bg-gray-200">
                    In Stock <X size={10} />
                  </button>
                )}
                {filters.rating && (
                  <button onClick={() => setFilters(p => ({ ...p, rating: null }))}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFCAB3] rounded-full text-xs font-semibold text-gray-700 hover:opacity-80">
                    {filters.rating}+ stars <X size={10} />
                  </button>
                )}
              </div>
            )}

            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="rounded-xl bg-gray-100 animate-pulse aspect-square" />
                ))}
              </div>
            )}

            {!loading && filtered.length === 0 && (
              <div className="text-center py-24">
                <p className="text-5xl mb-4">🌿</p>
                <h3 className="text-xl font-bold mb-2">No products found</h3>
                <p className="text-gray-500 text-sm mb-8">Try adjusting your filters to see more results.</p>
                <button onClick={clearFilters}
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-black text-white font-bold rounded-full transition-all duration-300 hover:bg-gray-900 hover:shadow-lg active:scale-95">
                  Clear Filters
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            )}

            {!loading && filtered.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
                {filtered.map(product => {
                  const image = product.images?.[0]?.src ?? '';
                  const organic = product.tags?.some(t => t.slug === 'organic');
                  const fav = isFavourite(product.id);
                  const rating = Number(product.average_rating);

                  return (
                    <div key={product.id}
                      className="product-item group flex flex-col rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg bg-white border border-gray-100">
                      <Link href={`/shop/${product.slug}`}>
                        <div className="relative overflow-hidden bg-gray-100 aspect-square">
                          {image ? (
                            <Image src={image} alt={product.name} fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                              className="object-cover transition-transform duration-300 group-hover:scale-105" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-5xl">🌿</div>
                          )}
                          {organic && (
                            <span className="absolute top-3 left-3 px-3 py-1 bg-[#B3E5C9] text-gray-800 text-xs font-semibold rounded-full">Organic</span>
                          )}
                          {product.on_sale && !organic && (
                            <span className="absolute top-3 left-3 px-3 py-1 bg-[#FFCAB3] text-gray-800 text-xs font-semibold rounded-full">Sale</span>
                          )}
                          {product.stock_status === 'outofstock' && (
                            <span className="absolute top-3 left-3 px-3 py-1 bg-[#FFCAB3] text-gray-800 text-xs font-semibold rounded-full">Sold Out</span>
                          )}
                          <button onClick={e => { e.preventDefault(); toggleFavourite(product.id); }}
                            className="absolute top-3 right-3 p-2 rounded-full bg-white shadow-md transition-all duration-200 hover:shadow-lg active:scale-90"
                            aria-label="Add to favourites">
                            <Heart size={18} className={fav ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-500 transition-colors'} />
                          </button>
                          {product.stock_status !== 'outofstock' && (
                            <button onClick={e => { e.preventDefault(); addToCart(product); }}
                              className="absolute bottom-3 right-3 p-2.5 rounded-full bg-black text-white shadow-md transition-all duration-200 hover:bg-gray-900 hover:shadow-lg active:scale-90 opacity-0 group-hover:opacity-100"
                              aria-label="Add to cart">
                              <ShoppingCart size={18} />
                            </button>
                          )}
                        </div>
                      </Link>

                      <div className="flex flex-col flex-1 p-4 sm:p-5">
                        {rating > 0 && (
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center gap-1">
                              <Image src="/icons/star.svg" alt="Star" width={16} height={16} />
                              <span className="text-sm font-semibold text-black">{rating.toFixed(1)}</span>
                            </div>
                            {product.rating_count > 0 && (
                              <span className="text-xs text-gray-500">({product.rating_count} reviews)</span>
                            )}
                          </div>
                        )}
                        <Link href={`/shop/${product.slug}`}>
                          <h3 className="text-base sm:text-lg font-bold leading-snug mb-2 line-clamp-2 hover:text-yellow-500 transition-colors">
                            {product.name}
                          </h3>
                        </Link>
                        {product.short_description && (
                          <p className="text-sm text-gray-600 mb-4 flex-1 line-clamp-2 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: product.short_description }} />
                        )}
                        <div className="flex items-center gap-2 mt-auto">
                          <span className="text-lg font-bold text-black">${product.price}</span>
                          {product.on_sale && product.regular_price && (
                            <span className="text-sm text-gray-400 line-through">${product.regular_price}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>

        <div className="flex justify-center mt-16 sm:mt-20">
          <button onClick={loadProducts}
            className="group w-full sm:w-auto sm:min-w-80 border border-black rounded-full flex items-center justify-between pl-6 sm:pl-8 pr-2 py-2 sm:py-3 transition-all duration-300 ease-out hover:bg-black hover:text-white hover:shadow-xl active:scale-95">
            <span className="text-sm sm:text-base font-bold tracking-wide">Load More Products</span>
            <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-black flex items-center justify-center group-hover:bg-white transition-all duration-300 group-hover:scale-110 flex-shrink-0">
              <ArrowRight className="text-white group-hover:text-black transition-all duration-300 group-hover:translate-x-1" size={20} strokeWidth={2.5} />
            </div>
          </button>
        </div>
      </div>

      {isFilterOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsFilterOpen(false)} />
      )}
    </div>
  );
}