import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProductById } from '../../../lib/products';
import ProductDetailClient from '../../../components/ProductDetailClient';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-chinese-black-900 chinese-bg">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-chinese-red-300">
            <li><Link href="/" className="hover:text-chinese-red-400 transition-colors">Inicio</Link></li>
            <li>/</li>
            <li><Link href="/" className="hover:text-chinese-red-400 transition-colors">Productos</Link></li>
            <li>/</li>
            <li className="text-chinese-red-400">{product.name}</li>
          </ol>
        </nav>

        <ProductDetailClient product={product} />
      </div>
    </div>
  );
}
