'use client';

import { useState } from 'react';
import { Product } from '../lib/products';
import { useCart } from '../contexts/CartContext';

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square bg-chinese-black-700 rounded-lg overflow-hidden border border-chinese-red-500/30">
            <img
              src={product.images?.[selectedImage] || product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Thumbnail Images */}
          {product.images && product.images.length > 1 && (
            <div className="flex space-x-3">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square w-20 bg-chinese-black-700 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    selectedImage === index 
                      ? 'border-chinese-red-500' 
                      : 'border-chinese-red-500/30 hover:border-chinese-red-500/60'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-sm text-chinese-red-400 bg-chinese-red-500/20 px-3 py-1 rounded-full">
                {product.brand}
              </span>
              <span className="text-sm text-chinese-red-300 bg-chinese-black-700 px-3 py-1 rounded-full">
                {product.category}
              </span>
              {product.inStock ? (
                <span className="text-sm text-green-400 bg-green-500/20 px-3 py-1 rounded-full">
                  En Stock
                </span>
              ) : (
                <span className="text-sm text-red-400 bg-red-500/20 px-3 py-1 rounded-full">
                  Sin Stock
                </span>
              )}
            </div>
            
            <h1 className="text-4xl font-bold text-white chinese-text mb-4">{product.name}</h1>
            <p className="text-2xl font-bold text-chinese-red-400 mb-4">${product.price.toLocaleString('es-AR')}</p>
            <p className="text-chinese-red-200 text-lg leading-relaxed">{product.longDescription || product.description}</p>
          </div>

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Características Principales</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-chinese-red-200">
                    <span className="text-chinese-red-500 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Add to Cart Section */}
          <div className="bg-chinese-black-800 p-6 rounded-lg border border-chinese-red-500/30">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg text-chinese-red-300">Cantidad:</span>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full bg-chinese-black-700 hover:bg-chinese-red-600 text-chinese-red-300 hover:text-white flex items-center justify-center border border-chinese-red-500/30 transition-all duration-200"
                >
                  -
                </button>
                <span className="w-12 text-center text-white font-medium text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-full bg-chinese-black-700 hover:bg-chinese-red-600 text-chinese-red-300 hover:text-white flex items-center justify-center border border-chinese-red-500/30 transition-all duration-200"
                >
                  +
                </button>
              </div>
            </div>
            
            <button 
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="btn-chinese w-full text-xl py-4 text-lg transform hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center chinese-text">Especificaciones Técnicas</h2>
          <div className="bg-chinese-black-800 rounded-lg border border-chinese-red-500/30 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center py-3 border-b border-chinese-red-500/20">
                  <span className="text-chinese-red-300 font-medium">{key}</span>
                  <span className="text-white">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Related Products Section */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-white mb-8 text-center chinese-text">Productos Relacionados</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center py-8">
            <p className="text-chinese-red-300">Más productos próximamente</p>
          </div>
        </div>
      </div>
    </>
  );
}
