'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity?: (productId: string, quantity: number) => void;
  onRemoveItem?: (productId: string) => void;
}

const Cart = ({ isOpen, onClose, cartItems = [], onUpdateQuantity, onRemoveItem }: CartProps) => {
  const router = useRouter();
  const total = (cartItems || []).reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleCheckout = () => {
    onClose(); // Close cart
    router.push('/checkout'); // Navigate to checkout
  };

  // Handle escape key only
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    } else {
      document.removeEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Animation timing
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    } else {
      // Delay hiding the component until animation finishes
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Don't render if not open and not animating
  if (!isOpen && !isAnimating) return null;

  return (
    <div className={`fixed inset-0 z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-chinese-black-900/80 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Cart Panel */}
      <div className={`fixed top-0 right-0 h-screen w-full max-w-md bg-chinese-black-800/90 backdrop-blur-sm border-l border-chinese-red-500/30 shadow-2xl transform transition-transform duration-300 ease-out overflow-hidden ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 lg:h-20 px-4 sm:px-6 lg:px-8 border-b border-chinese-red-500/20 bg-chinese-black-800/90 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-chinese-red-600 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
              </div>
              <h2 className="text-xl lg:text-2xl font-bold text-white chinese-title">购物车</h2>
            </div>
            <button
              onClick={onClose}
              className="text-chinese-red-400 hover:text-chinese-red-300 hover:bg-chinese-black-700 p-2 rounded-lg transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {(cartItems || []).length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-chinese-black-700 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-chinese-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                                 <p className="text-chinese-red-300 text-lg chinese-handwriting mb-2">Tu carrito está vacío</p>
                <p className="text-chinese-red-400">Agrega productos para comenzar</p>
              </div>
            ) : (
              <div className="space-y-4">
                {(cartItems || []).map((item, index) => (
                  <div 
                    key={index} 
                    className="bg-chinese-black-700 rounded-lg border border-chinese-red-500/20 p-4 transform hover:scale-[1.02] transition-all duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="relative w-20 h-20">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded-lg border border-chinese-red-500/30"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-white chinese-serif truncate">{item.name}</h3>
                        <p className="text-chinese-red-300 text-lg font-bold">${item.price.toLocaleString('es-AR')}</p>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <button
                          onClick={() => onRemoveItem && onRemoveItem(item.id)}
                          className="text-chinese-red-400 hover:text-chinese-red-300 hover:bg-chinese-red-500/10 p-1 rounded transition-colors duration-200"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => onUpdateQuantity && onUpdateQuantity(item.id, Math.max(1, (item.quantity || 1) - 1))}
                            className="w-8 h-8 rounded-full bg-chinese-black-600 hover:bg-chinese-red-600 text-chinese-red-300 hover:text-white flex items-center justify-center border border-chinese-red-500/30 transition-all duration-200"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-white font-medium">{item.quantity || 1}</span>
                          <button
                            onClick={() => onUpdateQuantity && onUpdateQuantity(item.id, (item.quantity || 1) + 1)}
                            className="w-8 h-8 rounded-full bg-chinese-black-600 hover:bg-chinese-red-600 text-chinese-red-300 hover:text-white flex items-center justify-center border border-chinese-red-500/30 transition-all duration-200"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {(cartItems || []).length > 0 && (
            <div className="border-t border-chinese-red-500/30 p-6 space-y-4">
              {/* Subtotal */}
              <div className="flex justify-between items-center text-lg">
                                 <span className="text-chinese-red-300 chinese-handwriting">Subtotal:</span>
                                 <span className="text-white font-semibold">${total.toLocaleString('es-AR')}</span>
              </div>
              
              {/* Shipping */}
              <div className="flex justify-between items-center text-sm">
                                 <span className="text-chinese-red-400 chinese-handwriting">Envío:</span>
                <span className="text-chinese-red-400">Gratis</span>
              </div>
              
              {/* Total */}
              <div className="flex justify-between items-center text-2xl font-bold border-t border-chinese-red-500/30 pt-4">
                                 <span className="text-white chinese-handwriting">Total:</span>
                                 <span className="text-chinese-red-400">${total.toLocaleString('es-AR')}</span>
              </div>
              
              {/* Checkout Button */}
              <button 
                onClick={handleCheckout}
                className="btn-chinese w-full text-xl py-4 transform hover:scale-105 transition-transform duration-200"
              >
                完成购买
              </button>
              
              {/* Continue Shopping */}
                             <button
                 onClick={onClose}
                 className="w-full py-3 text-chinese-red-300 hover:text-chinese-red-400 transition-colors duration-200 chinese-handwriting"
               >
                 Continuar Comprando
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;



