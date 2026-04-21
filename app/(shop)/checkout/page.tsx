'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/Cartcontext';
import { useAuth } from '@/context/Authcontext';

export default function CheckoutPage() {
  const { token } = useAuth();
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    address_1: '',
    city: '',
    state: '',
    postcode: '',
    country: 'US',
    email: '',
    phone: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert('Your cart is empty');
      router.push('/shop');
      return;
    }
    setLoading(true);
    try {
const res = await fetch('/api/create-order', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    billing: {
      first_name: form.first_name,
      last_name: form.last_name,
      address_1: form.address_1,
      city: form.city,
      state: form.state,
      postcode: form.postcode,
      country: form.country,
      email: form.email,
      phone: form.phone,
    },
    shipping: {   // 👈 обязательно
      first_name: form.first_name,
      last_name: form.last_name,
      address_1: form.address_1,
      city: form.city,
      state: form.state,
      postcode: form.postcode,
      country: form.country,
      phone: form.phone,
    },
    line_items: items.map(item => ({
      product_id: item.product.id,
      quantity: item.quantity,
    })),
    payment_method: 'bacs',
    customer_note: 'Thank you for your order!',
  }),
});
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Order creation failed');
      clearCart();
      router.push(`/order-confirmation/${data.id}`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white mt-40">
        <div className="px-4 sm:px-6 lg:px-15 py-16 mt-16 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-[#FFCAB3]/40 flex items-center justify-center mb-6">
            <ArrowLeft size={32} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Nothing to checkout</h2>
          <p className="text-gray-500 text-sm mb-8 max-w-xs">Your cart is empty. Add some products first.</p>
          <Link href="/shop" className="group inline-flex items-center gap-2 px-8 py-3 bg-black text-white text-sm font-bold rounded-full hover:bg-gray-900 transition-colors">
            Browse Products
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white mt-40">
      <div className="px-4 sm:px-6 lg:px-15 py-8 sm:py-12 lg:py-16 mt-8 sm:mt-12 lg:mt-16">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Checkout</h2>
            <p className="text-sm text-gray-500 mt-1">Complete your order</p>
          </div>
          <Link href="/cart" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-black transition-colors">
            <ArrowLeft size={14} />
            Back to cart
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 lg:gap-12 items-start">
          {/* Форма */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold tracking-widest text-gray-400 uppercase">First name</label>
                  <input type="text" name="first_name" required value={form.first_name} onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-bold tracking-widest text-gray-400 uppercase">Last name</label>
                  <input type="text" name="last_name" required value={form.last_name} onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black transition-colors" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold tracking-widest text-gray-400 uppercase">Address</label>
                <input type="text" name="address_1" required value={form.address_1} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black transition-colors" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold tracking-widest text-gray-400 uppercase">City</label>
                  <input type="text" name="city" required value={form.city} onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-bold tracking-widest text-gray-400 uppercase">State / Province</label>
                  <input type="text" name="state" value={form.state} onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold tracking-widest text-gray-400 uppercase">Postcode / ZIP</label>
                  <input type="text" name="postcode" required value={form.postcode} onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-bold tracking-widest text-gray-400 uppercase">Country</label>
                  <select name="country" value={form.country} onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black transition-colors bg-white">
                    <option value="US">United States</option>
                    <option value="GB">United Kingdom</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="IT">Italy</option>
                    <option value="ES">Spain</option>
                    <option value="NL">Netherlands</option>
                    <option value="PL">Poland</option>
                    <option value="UA">Ukraine</option>
                    <option value="RU">Russia</option>
                    <option value="KZ">Kazakhstan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold tracking-widest text-gray-400 uppercase">Email</label>
                  <input type="email" name="email" required value={form.email} onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-bold tracking-widest text-gray-400 uppercase">Phone</label>
                  <input type="tel" name="phone" required value={form.phone} onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black transition-colors" />
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="group w-full border border-black rounded-full flex items-center justify-between pl-6 pr-2 py-2 mt-4 transition-all duration-300 ease-out hover:bg-black hover:text-white active:scale-95 disabled:opacity-60">
                <span className="text-sm font-bold tracking-wide">{loading ? 'Processing…' : 'Place Order'}</span>
                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center group-hover:bg-white transition-all duration-300 flex-shrink-0">
                  <ArrowRight size={18} className="text-white group-hover:text-black transition-colors duration-300 group-hover:translate-x-0.5" />
                </div>
              </button>
            </form>
          </div>

          {/* Сводка заказа */}
          <div className="sticky top-28">
            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8">
              <h3 className="font-bold text-lg mb-6">Your Order</h3>
              <div className="space-y-4 mb-6">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex justify-between text-sm">
                    <span className="text-gray-700">{product.name} × {quantity}</span>
                    <span className="font-semibold">${(parseFloat(product.price) * quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-4 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-400 mt-4">Free shipping — always.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}