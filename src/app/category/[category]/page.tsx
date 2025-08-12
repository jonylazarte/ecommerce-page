'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../../../components/header/header';
import ProductCard from '../../../components/ProductCard';
import { getProductsByCategory, Product } from '../../../lib/products';
import { useCart } from '../../../contexts/CartContext';

export default function CategoryPage() {
  const params = useParams();
  const category = params.category as string;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { cartItems } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await getProductsByCategory(category);
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const addToCart = (product: Product, quantity: number) => {
    if (!product || !quantity) return;
    
    // This function is now handled by the context, so we just need to update the context
    // The context will manage the cartItems state and re-render the header
  };

  const categoryNames: Record<string, string> = {
    'drones': 'Drones',
    'smartphones': 'Smartphones',
    'auriculares': 'Auriculares',
    'camaras': 'Cámaras',
    'tablets': 'Tablets',
    'wearables': 'Wearables'
  };

  const categoryNamesChinese: Record<string, string> = {
    'drones': '无人机',
    'smartphones': '智能手机',
    'auriculares': '耳机',
    'camaras': '相机',
    'tablets': '平板电脑',
    'wearables': '可穿戴设备'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-chinese-black-900 chinese-bg">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl text-chinese-red-400 mb-4">Cargando productos...</h1>
          <p className="text-chinese-red-300 mb-8">Por favor, espera mientras cargamos los productos de la categoría.</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-chinese-black-900 chinese-bg">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl text-chinese-red-400 mb-4">Categoría no encontrada</h1>
          <p className="text-chinese-red-300 mb-8">La categoría que buscas no existe o no tiene productos</p>
          <Link href="/" className="btn-chinese">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-chinese-black-900 chinese-bg">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-chinese-red-300">
            <li><Link href="/" className="hover:text-chinese-red-400 transition-colors">Inicio</Link></li>
            <li>/</li>
            <li className="text-chinese-red-400">{categoryNames[category] || category}</li>
          </ol>
        </nav>

        {/* Category Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-chinese-red-500 chinese-text mb-4">
            {categoryNames[category] || category}
          </h1>
          <h2 className="text-3xl font-bold text-white mb-4">
            {categoryNames[category] || category}
          </h2>
          <p className="text-chinese-red-200 text-lg">
            Descubre nuestra selección de {categoryNames[category] || category}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
