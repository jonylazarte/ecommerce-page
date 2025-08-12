'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  inStock: boolean;
  image: string;
  images?: string[];
  features?: string[];
  specifications?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export default function AdminProducts() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    brand: '',
    inStock: true,
    image: '',
    images: '',
    features: '',
    specifications: ''
  });

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      router.push('/auth');
      return;
    }

    fetchProducts();
  }, [user, token]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        images: formData.images ? formData.images.split(',').map(img => img.trim()) : [],
        features: formData.features ? formData.features.split(',').map(f => f.trim()) : [],
        specifications: formData.specifications ? JSON.parse(formData.specifications) : {}
      };

      const url = editingProduct 
        ? `/api/admin/products/${editingProduct.id}`
        : '/api/admin/products';
      
      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        setShowAddModal(false);
        setEditingProduct(null);
        resetForm();
        fetchProducts();
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) return;

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      brand: product.brand,
      inStock: product.inStock,
      image: product.image,
      images: product.images?.join(', ') || '',
      features: product.features?.join(', ') || '',
      specifications: product.specifications ? JSON.stringify(product.specifications, null, 2) : ''
    });
    setShowAddModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      brand: '',
      inStock: true,
      image: '',
      images: '',
      features: '',
      specifications: ''
    });
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
            <h1 className="text-2xl font-bold text-white chinese-text">Gestionar Productos</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  setEditingProduct(null);
                  resetForm();
                  setShowAddModal(true);
                }}
                className="bg-chinese-red-600 hover:bg-chinese-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Agregar Producto
              </button>
              <Link href="/admin" className="text-chinese-red-400 hover:text-chinese-red-300 transition-colors">
                ← Volver al panel
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Products Table */}
        <div className="bg-chinese-black-800 rounded-lg border border-chinese-red-500/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-chinese-black-700 border-b border-chinese-red-500/30">
                  <th className="text-left py-4 px-6 text-chinese-red-300">Imagen</th>
                  <th className="text-left py-4 px-6 text-chinese-red-300">Nombre</th>
                  <th className="text-left py-4 px-6 text-chinese-red-300">Precio</th>
                  <th className="text-left py-4 px-6 text-chinese-red-300">Categoría</th>
                  <th className="text-left py-4 px-6 text-chinese-red-300">Stock</th>
                  <th className="text-left py-4 px-6 text-chinese-red-300">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-chinese-red-500/20 hover:bg-chinese-black-700">
                    <td className="py-4 px-6">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-white font-medium">{product.name}</p>
                        <p className="text-chinese-red-300 text-sm">{product.brand}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-chinese-red-400 font-bold">
                      ${product.price.toLocaleString('es-AR')}
                    </td>
                    <td className="py-4 px-6 text-white">{product.category}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        product.inStock 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {product.inStock ? 'En Stock' : 'Sin Stock'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-chinese-black-800 rounded-lg border border-chinese-red-500/30 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white chinese-text mb-6">
              {editingProduct ? 'Editar Producto' : 'Agregar Producto'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-chinese-red-300 text-sm font-medium mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-chinese-black-700 border border-chinese-red-500/30 rounded-lg text-white focus:outline-none focus:border-chinese-red-400"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-chinese-red-300 text-sm font-medium mb-2">
                    Precio
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full px-4 py-3 bg-chinese-black-700 border border-chinese-red-500/30 rounded-lg text-white focus:outline-none focus:border-chinese-red-400"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-chinese-red-300 text-sm font-medium mb-2">
                    Categoría
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-3 bg-chinese-black-700 border border-chinese-red-500/30 rounded-lg text-white focus:outline-none focus:border-chinese-red-400"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-chinese-red-300 text-sm font-medium mb-2">
                    Marca
                  </label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                    className="w-full px-4 py-3 bg-chinese-black-700 border border-chinese-red-500/30 rounded-lg text-white focus:outline-none focus:border-chinese-red-400"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-chinese-red-300 text-sm font-medium mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 bg-chinese-black-700 border border-chinese-red-500/30 rounded-lg text-white focus:outline-none focus:border-chinese-red-400"
                  required
                />
              </div>
              
              <div>
                <label className="block text-chinese-red-300 text-sm font-medium mb-2">
                  URL de Imagen Principal
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="w-full px-4 py-3 bg-chinese-black-700 border border-chinese-red-500/30 rounded-lg text-white focus:outline-none focus:border-chinese-red-400"
                  required
                />
              </div>
              
              <div>
                <label className="block text-chinese-red-300 text-sm font-medium mb-2">
                  URLs de Imágenes Adicionales (separadas por comas)
                </label>
                <input
                  type="text"
                  value={formData.images}
                  onChange={(e) => setFormData({...formData, images: e.target.value})}
                  className="w-full px-4 py-3 bg-chinese-black-700 border border-chinese-red-500/30 rounded-lg text-white focus:outline-none focus:border-chinese-red-400"
                  placeholder="https://ejemplo1.com/img1.jpg, https://ejemplo2.com/img2.jpg"
                />
              </div>
              
              <div>
                <label className="block text-chinese-red-300 text-sm font-medium mb-2">
                  Características (separadas por comas)
                </label>
                <input
                  type="text"
                  value={formData.features}
                  onChange={(e) => setFormData({...formData, features: e.target.value})}
                  className="w-full px-4 py-3 bg-chinese-black-700 border border-chinese-red-500/30 rounded-lg text-white focus:outline-none focus:border-chinese-red-400"
                  placeholder="Característica 1, Característica 2, Característica 3"
                />
              </div>
              
              <div>
                <label className="block text-chinese-red-300 text-sm font-medium mb-2">
                  Especificaciones (JSON)
                </label>
                <textarea
                  value={formData.specifications}
                  onChange={(e) => setFormData({...formData, specifications: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 bg-chinese-black-700 border border-chinese-red-500/30 rounded-lg text-white focus:outline-none focus:border-chinese-red-400"
                  placeholder='{"Procesador": "Intel i7", "RAM": "16GB", "Almacenamiento": "512GB SSD"}'
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="inStock"
                  checked={formData.inStock}
                  onChange={(e) => setFormData({...formData, inStock: e.target.checked})}
                  className="text-chinese-red-600"
                />
                <label htmlFor="inStock" className="ml-2 text-chinese-red-300">
                  En Stock
                </label>
              </div>
              
              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-chinese-red-600 hover:bg-chinese-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  {editingProduct ? 'Actualizar Producto' : 'Agregar Producto'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingProduct(null);
                    resetForm();
                  }}
                  className="flex-1 bg-chinese-black-700 hover:bg-chinese-black-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

