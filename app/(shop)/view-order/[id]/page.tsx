import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Package, MapPin, Calendar, CreditCard, Truck, Clock, CheckCircle, XCircle } from 'lucide-react';
import { getOrderById } from '@/lib/wordpress';

interface Props {
  params: Promise<{ id: string }>;
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
  processing: { 
    label: 'Processing', 
    bg: 'bg-yellow-100', 
    text: 'text-yellow-700',
    icon: <Clock size={14} className="text-yellow-600" />
  },
  'on-hold': { 
    label: 'On Hold', 
    bg: 'bg-yellow-100', 
    text: 'text-yellow-700',
    icon: <Clock size={14} className="text-yellow-600" />
  },
  completed: { 
    label: 'Delivered', 
    bg: 'bg-[#B3E5C9]', 
    text: 'text-green-800',
    icon: <CheckCircle size={14} className="text-green-600" />
  },
  pending: { 
    label: 'Pending', 
    bg: 'bg-[#B3E5C9]/60', 
    text: 'text-green-700',
    icon: <Clock size={14} className="text-green-600" />
  },
  cancelled: { 
    label: 'Cancelled', 
    bg: 'bg-[#FFCAB3]', 
    text: 'text-red-700',
    icon: <XCircle size={14} className="text-red-500" />
  },
  refunded: { 
    label: 'Refunded', 
    bg: 'bg-[#FFCAB3]', 
    text: 'text-red-700',
    icon: <XCircle size={14} className="text-red-500" />
  },
  failed: { 
    label: 'Failed', 
    bg: 'bg-[#FFCAB3]', 
    text: 'text-red-700',
    icon: <XCircle size={14} className="text-red-500" />
  },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export default async function ViewOrderPage({ params }: Props) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) return notFound();

  const status = STATUS_CONFIG[order.status] ?? { 
    label: order.status, 
    bg: 'bg-gray-100', 
    text: 'text-gray-700',
    icon: <Package size={14} className="text-gray-500" />
  };
  
  // Безопасное получение адреса доставки
  const shipping = order.shipping || {};
  const addressParts = [
    shipping.address_1,
    shipping.city,
    shipping.state,
    shipping.postcode,
    shipping.country,
  ].filter(Boolean);
  const address = addressParts.length > 0 ? addressParts.join(', ') : 'No shipping address provided';
  
  const hasShippingInfo = shipping.first_name || shipping.last_name || address !== 'No shipping address provided';

  const total = parseFloat(order.total).toFixed(2);
  const subtotal = total;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-15 py-8 sm:py-12 lg:py-16 mt-32">
        <div className="max-w-5xl mx-auto">
          <Link 
            href="/orders" 
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors mb-6 group"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform duration-200" />
            Back to Orders
          </Link>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Order #{order.id}</h1>
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                  <Calendar size={14} />
                  <span>{formatDate(order.date_created)}</span>
                </div>
              </div>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${status.bg} ${status.text}`}>
                {status.icon}
                {status.label}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 sm:px-8 py-5 border-b border-gray-100">
                  <h2 className="font-bold text-lg flex items-center gap-2">
                    <Package size={18} className="text-gray-500" />
                    Items
                  </h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {order.line_items.map((item: any) => (
                    <div key={item.id} className="p-6 sm:p-8 flex gap-5">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        {item.image?.src ? (
                          <Image src={item.image.src} alt={item.name} fill sizes="80px" className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-3xl">🌿</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900">{item.name}</div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-gray-500">
                          <span>Qty: {item.quantity}</span>
                          <span>${item.price} each</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">${parseFloat(item.total).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Блок адреса доставки — показываем только если есть данные */}
              {hasShippingInfo && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
                  <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <MapPin size={18} className="text-gray-500" />
                    Shipping Address
                  </h2>
                  <div className="text-gray-700 space-y-1">
                    {(shipping.first_name || shipping.last_name) && (
                      <p className="font-medium">{shipping.first_name} {shipping.last_name}</p>
                    )}
                    <p>{address}</p>
                    {shipping.phone && <p className="text-gray-500 text-sm">{shipping.phone}</p>}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
                <h2 className="font-bold text-lg mb-5">Order Summary</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-medium">${subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="border-t border-gray-100 pt-3 mt-3 flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span>${total}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <CreditCard size={18} className="text-gray-500" />
                  Payment
                </h2>
                <p className="text-gray-700 text-sm">
                  {order.payment_method_title || order.payment_method || 'Bank Transfer'}
                </p>
              </div>

              {order.customer_note && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
                  <h2 className="font-bold text-lg mb-2">Note</h2>
                  <p className="text-gray-600 text-sm">{order.customer_note}</p>
                </div>
              )}

              <div className="bg-[#B3E5C9]/30 rounded-2xl p-6 text-center">
                <Truck size={24} className="mx-auto text-gray-600 mb-2" />
                <p className="text-sm font-medium text-gray-800">Need help?</p>
                <p className="text-xs text-gray-500 mt-1">Contact our support team for any questions about your order.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}