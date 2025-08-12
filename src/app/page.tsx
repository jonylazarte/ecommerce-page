import ProductCard from '../components/ProductCard';
import { getProducts } from '../lib/products';

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-chinese-black-900 chinese-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="text-center py-20 mb-16">
          <h1 className="text-6xl font-bold text-chinese-red-500 chinese-display mb-6">
            欢迎来到红辣椒
          </h1>
          <p className="text-2xl text-chinese-red-300 mb-8 max-w-3xl mx-auto chinese-handwriting">
            Tu tienda de confianza para productos tecnológicos chinos de alta calidad
          </p>
        </section>

        {/* Products Grid */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-white text-center mb-12 chinese-title">
            我们的产品
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
