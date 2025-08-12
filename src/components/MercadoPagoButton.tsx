'use client';

import { useEffect, useState } from 'react';

interface MercadoPagoButtonProps {
  amount: number;
  currency: string;
  onSuccess: (paymentId: string) => void;
  onError: (error: string) => void;
  onCancel: () => void;
  disabled?: boolean;
}

declare global {
  interface Window {
    Mercadopago?: any;
  }
}

export default function MercadoPagoButton({ 
  amount, 
  currency, 
  onSuccess, 
  onError, 
  onCancel, 
  disabled = false 
}: MercadoPagoButtonProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Cargar el SDK de MercadoPago
    const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY;
    
    if (!publicKey) {
      onError('Error: MercadoPago Public Key no configurado');
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.async = true;
    script.onload = () => {
      if (window.Mercadopago) {
        window.Mercadopago.setPublishableKey(publicKey);
        setIsLoaded(true);
      } else {
        onError('Error al cargar MercadoPago');
      }
    };
    script.onerror = () => onError('Error al cargar MercadoPago');
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [onError]);

  const handlePayment = async () => {
    if (!window.Mercadopago) {
      onError('MercadoPago no está cargado');
      return;
    }

    try {
      const preference = {
        items: [
          {
            title: 'Compra en RedChilli Store',
            unit_price: amount / 100, // Convertir centavos a pesos
            quantity: 1,
            currency_id: currency === 'USD' ? 'USD' : 'ARS'
          }
        ],
        back_urls: {
          success: `${window.location.origin}/checkout/success`,
          failure: `${window.location.origin}/checkout?error=payment_failed`,
          pending: `${window.location.origin}/checkout?error=payment_pending`
        },
        auto_return: 'approved',
        external_reference: `order_${Date.now()}`
      };

      const response = await fetch('/api/payments/mercadopago/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preference)
      });

      if (response.ok) {
        const data = await response.json();
        window.location.href = data.init_point;
      } else {
        onError('Error al crear preferencia de pago');
      }
    } catch (error) {
      onError('Error al procesar pago con MercadoPago');
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center p-4 bg-chinese-black-700 rounded-lg">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-chinese-red-400 mr-3"></div>
        <span className="text-chinese-red-300">Cargando MercadoPago...</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <button
        onClick={handlePayment}
        disabled={disabled}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-colors duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
        Pagar con MercadoPago
      </button>
    </div>
  );
}
