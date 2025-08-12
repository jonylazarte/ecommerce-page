'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Cart from '../Cart';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

export default function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { cartItems, updateQuantity, removeItem } = useCart();
  const { user, logout } = useAuth();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.mobile-menu') && !target.closest('.hamburger')) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-chinese-black-900/95 backdrop-blur-md border-b border-chinese-red-500/20 shadow-lg' 
        : 'bg-chinese-black-800/90 backdrop-blur-sm border-b border-chinese-red-500/30'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4 lg:py-5">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-chinese-red-600 to-chinese-red-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-chinese-red-500/25 transition-all duration-300 group-hover:scale-105">
              <span className="text-white font-bold text-xl lg:text-2xl">名</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl lg:text-2xl font-bold text-chinese-red-400 chinese-display group-hover:text-chinese-red-300 transition-colors duration-300">
                红辣椒
              </span>
              <span className="text-xs text-chinese-red-500/70 hidden sm:block chinese-accent">
                中国科技
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8">
            <Link 
              href="/" 
              className="relative text-chinese-red-300 hover:text-chinese-red-400 transition-colors duration-200 chinese-handwriting font-medium group"
            >
              Inicio
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-chinese-red-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <a 
              href="#" 
              className="relative text-chinese-red-300 hover:text-chinese-red-400 transition-colors duration-200 chinese-handwriting font-medium group"
            >
              Productos
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-chinese-red-400 group-hover:w-full transition-all duration-300"></span>
            </a>
            <Link 
              href="/contacto" 
              className="relative text-chinese-red-300 hover:text-chinese-red-400 transition-colors duration-200 chinese-handwriting font-medium group"
            >
              Contacto
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-chinese-red-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </nav>

          {/* Desktop Auth Section */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-chinese-black-700/50 rounded-lg px-3 py-2">
                  <div className="w-6 h-6 bg-chinese-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-chinese-red-300 text-sm font-medium">
                    {user.name}
                  </span>
                </div>
                {user.role === 'ADMIN' && (
                                     <Link
                     href="/admin"
                     className="bg-chinese-red-600 hover:bg-chinese-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-chinese-red-500/25 chinese-handwriting"
                   >
                     Panel Admin
                   </Link>
                )}
                                 <button
                   onClick={logout}
                   className="text-chinese-red-300 hover:text-chinese-red-400 transition-colors duration-200 text-sm font-medium hover:bg-chinese-black-700/50 px-3 py-2 rounded-lg chinese-handwriting"
                 >
                   Cerrar Sesión
                 </button>
              </div>
            ) : (
                             <Link
                 href="/auth"
                 className="bg-chinese-red-600 hover:bg-chinese-red-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-chinese-red-500/25 transform hover:scale-105 chinese-handwriting"
               >
                 Iniciar Sesión
               </Link>
            )}
          </div>

          {/* Cart Icon */}
          <button
            onClick={openCart}
            className="relative p-2 lg:p-3 text-chinese-red-400 hover:text-chinese-red-300 hover:bg-chinese-black-700/50 rounded-lg transition-all duration-200 group"
          >
            <svg className="w-6 h-6 lg:w-7 lg:h-7 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
            </svg>
            
            {/* Cart Badge */}
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 lg:w-6 lg:h-6 bg-chinese-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden hamburger p-2 text-chinese-red-400 hover:text-chinese-red-300 hover:bg-chinese-black-700/50 rounded-lg transition-all duration-200"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${
                isMobileMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'
              }`}></span>
              <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${
                isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
              }`}></span>
              <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${
                isMobileMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'
              }`}></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden mobile-menu transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="py-4 space-y-4 border-t border-chinese-red-500/20">
            
            {/* Mobile Navigation */}
            <nav className="space-y-3">
                             <Link 
                 href="/" 
                 className="block text-chinese-red-300 hover:text-chinese-red-400 transition-colors duration-200 chinese-handwriting font-medium py-2 px-3 rounded-lg hover:bg-chinese-black-700/50"
                 onClick={() => setIsMobileMenuOpen(false)}
               >
                 Inicio
               </Link>
                             <a 
                 href="#" 
                 className="block text-chinese-red-300 hover:text-chinese-red-400 transition-colors duration-200 chinese-handwriting font-medium py-2 px-3 rounded-lg hover:bg-chinese-black-700/50"
                 onClick={() => setIsMobileMenuOpen(false)}
               >
                 Productos
               </a>
                             <Link 
                 href="/contacto" 
                 className="block text-chinese-red-300 hover:text-chinese-red-400 transition-colors duration-200 chinese-handwriting font-medium py-2 px-3 rounded-lg hover:bg-chinese-black-700/50"
                 onClick={() => setIsMobileMenuOpen(false)}
               >
                 Contacto
               </Link>
            </nav>

            {/* Mobile Auth Section */}
            <div className="pt-4 border-t border-chinese-red-500/20">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 bg-chinese-black-700/50 rounded-lg px-4 py-3">
                    <div className="w-8 h-8 bg-chinese-red-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-chinese-red-300 font-medium">{user.name}</p>
                      <p className="text-chinese-red-500/70 text-xs">{user.email}</p>
                    </div>
                  </div>
                  
                  {user.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      className="block w-full bg-chinese-red-600 hover:bg-chinese-red-700 text-white px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 text-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Panel Admin
                    </Link>
                  )}
                  
                  <button
                    onClick={handleLogout}
                    className="block w-full text-chinese-red-300 hover:text-chinese-red-400 transition-colors duration-200 text-sm font-medium hover:bg-chinese-black-700/50 px-4 py-3 rounded-lg text-left"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth"
                  className="block w-full bg-chinese-red-600 hover:bg-chinese-red-700 text-white px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Iniciar Sesión
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cart Modal */}
      <Cart
        isOpen={isCartOpen}
        onClose={closeCart}
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
      />
    </header>
  );
}
