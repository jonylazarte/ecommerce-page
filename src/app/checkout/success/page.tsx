'use client';

import Link from 'next/link';
import Header from '../../../components/header/header';

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-chinese-black-900 chinese-bg">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-chinese-black-800 rounded-lg border border-chinese-red-500/30 p-12">
          {/* Success Icon */}
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-4xl font-bold text-white chinese-text mb-4">
            ¡Pedido Confirmado!
          </h1>
          
          <p className="text-xl text-chinese-red-300 mb-8">
            Gracias por tu compra. Tu pedido ha sido procesado exitosamente.
          </p>

          <div className="bg-chinese-black-700 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-white mb-4">Próximos Pasos</h2>
            <div className="text-chinese-red-300 space-y-2">
              <p>• Recibirás un email de confirmación con los detalles de tu pedido</p>
              <p>• Te notificaremos cuando tu pedido sea enviado</p>
              <p>• Puedes rastrear tu pedido desde tu cuenta</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="bg-chinese-red-600 hover:bg-chinese-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 transform hover:scale-105"
            >
              Volver a la Tienda
            </Link>
            
            <Link
              href="/orders"
              className="bg-chinese-black-700 hover:bg-chinese-black-600 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 border border-chinese-red-500/30"
            >
              Ver Mis Pedidos
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
