'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    image: string;
  };
}

interface Order {
  id: string;
  userId: string;
  total: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  paymentMethod: 'CARD' | 'PAYPAL' | 'TRANSFER';
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    email: string;
    phone: string;
  };
  orderItems: OrderItem[];
  createdAt: string;
  updatedAt: string;
  user: {
    name: string;
    email: string;
  };
}

export default function AdminOrders() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      router.push('/auth');
      return;
    }

    fetchOrders();
  }, [user, token]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        fetchOrders();
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const updatePaymentStatus = async (orderId: string, paymentStatus: Order['paymentStatus']) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ paymentStatus })
      });

      if (response.ok) {
        fetchOrders();
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-500/20 text-yellow-400';
      case 'PROCESSING': return 'bg-blue-500/20 text-blue-400';
      case 'SHIPPED': return 'bg-purple-500/20 text-purple-400';
      case 'DELIVERED': return 'bg-green-500/20 text-green-400';
      case 'CANCELLED': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getPaymentStatusColor = (status: Order['paymentStatus']) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-500/20 text-yellow-400';
      case 'COMPLETED': return 'bg-green-500/20 text-green-400';
      case 'FAILED': return 'bg-red-500/20 text-red-400';
      case 'REFUNDED': return 'bg-orange-500/20 text-orange-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getPaymentMethodText = (method: Order['paymentMethod']) => {
    switch (method) {
      case 'CARD': return 'Tarjeta';
      case 'PAYPAL': return 'PayPal';
      case 'TRANSFER': return 'Transferencia';
      default: return method;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-chinese-black-900 chinese-bg flex items-center justify-center">
        <div className="text-chinese-red-400">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-chinese-black-900 chinese-bg">
      {/* Header */}
      <div className="bg-chinese-black-800 border-b border-chinese-red-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white chinese-text">Gestionar Pedidos</h1>
            <Link href="/admin" className="text-chinese-red-400 hover:text-chinese-red-300 transition-colors">
              ← Volver al panel
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Orders Table */}
        <div className="bg-chinese-black-800 rounded-lg border border-chinese-red-500/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-chinese-black-700 border-b border-chinese-red-500/30">
                  <th className="text-left py-4 px-6 text-chinese-red-300">ID</th>
                  <th className="text-left py-4 px-6 text-chinese-red-300">Cliente</th>
                  <th className="text-left py-4 px-6 text-chinese-red-300">Total</th>
                  <th className="text-left py-4 px-6 text-chinese-red-300">Estado</th>
                  <th className="text-left py-4 px-6 text-chinese-red-300">Pago</th>
                  <th className="text-left py-4 px-6 text-chinese-red-300">Método</th>
                  <th className="text-left py-4 px-6 text-chinese-red-300">Fecha</th>
                  <th className="text-left py-4 px-6 text-chinese-red-300">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-chinese-red-500/20 hover:bg-chinese-black-700">
                    <td className="py-4 px-6 text-white font-mono">#{order.id}</td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-white font-medium">{order.user.name}</p>
                        <p className="text-chinese-red-300 text-sm">{order.user.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-chinese-red-400 font-bold">
                      ¥{order.total.toFixed(2)}
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                        className={`px-2 py-1 rounded-full text-xs border-none focus:outline-none ${getStatusColor(order.status)}`}
                      >
                        <option value="PENDING">Pendiente</option>
                        <option value="PROCESSING">Procesando</option>
                        <option value="SHIPPED">Enviado</option>
                        <option value="DELIVERED">Entregado</option>
                        <option value="CANCELLED">Cancelado</option>
                      </select>
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={order.paymentStatus}
                        onChange={(e) => updatePaymentStatus(order.id, e.target.value as Order['paymentStatus'])}
                        className={`px-2 py-1 rounded-full text-xs border-none focus:outline-none ${getPaymentStatusColor(order.paymentStatus)}`}
                      >
                        <option value="PENDING">Pendiente</option>
                        <option value="COMPLETED">Completado</option>
                        <option value="FAILED">Fallido</option>
                        <option value="REFUNDED">Reembolsado</option>
                      </select>
                    </td>
                    <td className="py-4 px-6 text-white">
                      {getPaymentMethodText(order.paymentMethod)}
                    </td>
                    <td className="py-4 px-6 text-chinese-red-300">
                      {new Date(order.createdAt).toLocaleDateString('es-AR')}
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowOrderModal(true);
                        }}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Ver Detalles
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-chinese-black-800 rounded-lg border border-chinese-red-500/30 p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white chinese-text">
                Pedido #{selectedOrder.id}
              </h2>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-chinese-red-400 hover:text-chinese-red-300 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Order Info */}
              <div className="space-y-4">
                <div className="bg-chinese-black-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Información del Cliente</h3>
                  <div className="text-chinese-red-300 space-y-1">
                    <p><strong>Nombre:</strong> {selectedOrder.user.name}</p>
                    <p><strong>Email:</strong> {selectedOrder.user.email}</p>
                    <p><strong>Teléfono:</strong> {selectedOrder.shippingAddress.phone}</p>
                  </div>
                </div>

                <div className="bg-chinese-black-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Dirección de Envío</h3>
                  <div className="text-chinese-red-300 space-y-1">
                    <p>{selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}</p>
                    <p>{selectedOrder.shippingAddress.address}</p>
                    <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}</p>
                    <p>{selectedOrder.shippingAddress.country}</p>
                  </div>
                </div>

                <div className="bg-chinese-black-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Información del Pedido</h3>
                  <div className="text-chinese-red-300 space-y-1">
                    <p><strong>Fecha:</strong> {new Date(selectedOrder.createdAt).toLocaleString('es-AR')}</p>
                    <p><strong>Método de Pago:</strong> {getPaymentMethodText(selectedOrder.paymentMethod)}</p>
                    <p><strong>Total:</strong> ¥{selectedOrder.total.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-chinese-black-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3">Productos</h3>
                <div className="space-y-3">
                  {selectedOrder.orderItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 p-3 bg-chinese-black-800 rounded-lg">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="text-white font-medium">{item.product.name}</p>
                        <p className="text-chinese-red-300 text-sm">
                          Cantidad: {item.quantity} × ${item.price.toLocaleString('es-AR')}
                        </p>
                      </div>
                      <div className="text-chinese-red-400 font-bold">
                        ${(item.quantity * item.price).toLocaleString('es-AR')}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-chinese-red-500/30">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span className="text-white">Total:</span>
                    <span className="text-chinese-red-400">¥{selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowOrderModal(false)}
                className="bg-chinese-black-700 hover:bg-chinese-black-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

