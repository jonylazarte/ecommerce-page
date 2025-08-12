import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProductById } from '../../../lib/products';
import ProductDetailClient from '../../../components/ProductDetailClient';

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-chinese-black-900 chinese-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 lg:mb-8">
          <ol className="flex flex-wrap items-center space-x-1 lg:space-x-2 text-sm lg:text-base text-chinese-red-300">
            <li><Link href="/" className="hover:text-chinese-red-400 transition-colors">Inicio</Link></li>
            <li className="text-chinese-red-500">/</li>
            <li><Link href="/" className="hover:text-chinese-red-400 transition-colors">Productos</Link></li>
            <li className="text-chinese-red-500">/</li>
            <li className="text-chinese-red-400 truncate max-w-[200px] lg:max-w-none">{product.name}</li>
          </ol>
        </nav>

        <ProductDetailClient product={product} />
      </div>
    </div>
  );
}
