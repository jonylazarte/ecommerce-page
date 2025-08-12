'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Product } from '../lib/products';
import { useCart } from '../contexts/CartContext';

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  // Debug log
  useEffect(() => {
    console.log('ProductDetailClient rendered with product:', product);
  }, [product]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  // Safety check
  if (!product) {
    return (
      <div className="min-h-screen bg-chinese-black-900 chinese-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chinese-red-400 mx-auto mb-4"></div>
          <p className="text-chinese-red-300">Cargando producto...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[500px] lg:h-[500px] mx-auto lg:mx-0">
            <div className="w-full h-full bg-chinese-black-700 rounded-lg overflow-hidden border border-chinese-red-500/30 relative">
              <Image
                src={product.images?.[selectedImage] || product.image}
                alt={product.name}
                width={500}
                height={500}
                className="object-cover w-full h-full"
                style={{ maxWidth: '100%', maxHeight: '100%' }}
              />
            </div>
          </div>
          
          {/* Thumbnail Images */}
          {product.images && product.images.length > 1 && (
            <div className="flex space-x-2 lg:space-x-3 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 bg-chinese-black-700 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    selectedImage === index 
                      ? 'border-chinese-red-500' 
                      : 'border-chinese-red-500/30 hover:border-chinese-red-500/60'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-4 lg:space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 lg:gap-3 mb-4">
              <span className="text-xs lg:text-sm text-chinese-red-400 bg-chinese-red-500/20 px-2 lg:px-3 py-1 rounded-full">
                {product.brand || 'Marca'}
              </span>
              <span className="text-xs lg:text-sm text-chinese-red-300 bg-chinese-black-700 px-2 lg:px-3 py-1 rounded-full">
                {product.category || 'Categoría'}
              </span>
              {product.inStock ? (
                <span className="text-xs lg:text-sm text-green-400 bg-green-500/20 px-2 lg:px-3 py-1 rounded-full">
                  En Stock
                </span>
              ) : (
                <span className="text-xs lg:text-sm text-red-400 bg-red-500/20 px-2 lg:px-3 py-1 rounded-full">
                  Sin Stock
                </span>
              )}
            </div>
            
            <h1 className="text-2xl lg:text-4xl font-bold text-white chinese-text mb-3 lg:mb-4">{product.name}</h1>
            <p className="text-xl lg:text-2xl font-bold text-chinese-red-400 mb-3 lg:mb-4">${product.price.toLocaleString('es-AR')}</p>
            <p className="text-sm lg:text-lg text-chinese-red-200 leading-relaxed">{product.longDescription || product.description}</p>
          </div>

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div>
              <h3 className="text-lg lg:text-xl font-semibold text-white mb-3">Características Principales</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm lg:text-base text-chinese-red-200">
                    <span className="text-chinese-red-500 mr-2 flex-shrink-0">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Add to Cart Section */}
          <div className="bg-chinese-black-800 p-4 lg:p-6 rounded-lg border border-chinese-red-500/30">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <span className="text-base lg:text-lg text-chinese-red-300">Cantidad:</span>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-chinese-black-700 hover:bg-chinese-red-600 text-chinese-red-300 hover:text-white flex items-center justify-center border border-chinese-red-500/30 transition-all duration-200"
                >
                  -
                </button>
                <span className="w-10 lg:w-12 text-center text-white font-medium text-base lg:text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-chinese-black-700 hover:bg-chinese-red-600 text-chinese-red-300 hover:text-white flex items-center justify-center border border-chinese-red-500/30 transition-all duration-200"
                >
                  +
                </button>
              </div>
            </div>
            
            <button 
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="btn-chinese w-full text-base lg:text-xl py-3 lg:py-4 transform hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {product.inStock 
                ? `Agregar al Carrito - $${(product.price * quantity).toLocaleString('es-AR')}`
                : 'Sin Stock'
              }
            </button>
          </div>
        </div>
      </div>

      {/* Specifications */}
      {product.specifications && Object.keys(product.specifications).length > 0 && (
        <div className="mt-12 lg:mt-16">
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-6 lg:mb-8 text-center chinese-text">Especificaciones Técnicas</h2>
          <div className="bg-chinese-black-800 rounded-lg border border-chinese-red-500/30 p-4 lg:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b border-chinese-red-500/20">
                  <span className="text-sm lg:text-base text-chinese-red-300 font-medium mb-1 sm:mb-0">{key}</span>
                  <span className="text-sm lg:text-base text-white">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Related Products Section */}
      <div className="mt-12 lg:mt-16">
        <h2 className="text-2xl lg:text-3xl font-bold text-white mb-6 lg:mb-8 text-center chinese-text">Productos Relacionados</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <div className="text-center py-6 lg:py-8">
            <p className="text-sm lg:text-base text-chinese-red-300">Más productos próximamente</p>
          </div>
        </div>
      </div>
    </>
  );
}
