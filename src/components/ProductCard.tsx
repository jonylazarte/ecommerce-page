'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Product } from '../lib/products';
import { useCart } from '../contexts/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  // Early return if no product data
  if (!product || !product.name) {
    return null;
  }

  return (
    <div 
      className="card-chinese overflow-hidden group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with Hover Effects */}
      <div className="aspect-square bg-chinese-black-700 flex items-center justify-center relative overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
        />
        
        {/* Overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-chinese-black-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Quick Actions Overlay */}
        <div className={`absolute inset-0 flex items-center justify-center space-x-3 transition-all duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          {/* Quick View Button */}
          <Link 
            href={`/product/${product.id}`}
            className="bg-chinese-red-600 hover:bg-chinese-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 transform hover:scale-105"
          >
            Ver Detalles
          </Link>
          
          {/* Quick Add to Cart */}
          <button
            onClick={() => addToCart(product, 1)}
            className="bg-chinese-black-800 hover:bg-chinese-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 transform hover:scale-105 border border-chinese-red-500/50"
          >
            Agregar
          </button>
        </div>
      </div>

      {/* Product Info - Simplified */}
      <div className="p-4">
        <h3 className="text-lg font-medium text-white chinese-text group-hover:text-chinese-red-400 transition-colors duration-200 mb-2">
          {product.name}
        </h3>
        <p className="text-chinese-red-400 font-semibold text-lg">
          ${product.price.toLocaleString('es-AR')}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
