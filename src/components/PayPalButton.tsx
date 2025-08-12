'use client';

import { useEffect, useState } from 'react';

interface PayPalButtonProps {
  amount: number;
  currency: string;
  onSuccess: (paymentId: string) => void;
  onError: (error: string) => void;
  onCancel: () => void;
  disabled?: boolean;
}

declare global {
  interface Window {
    paypal?: any;
  }
}

export default function PayPalButton({ 
  amount, 
  currency, 
  onSuccess, 
  onError, 
  onCancel, 
  disabled = false 
}: PayPalButtonProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Cargar el SDK de PayPal
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    
    if (!clientId) {
      onError('Error: PayPal Client ID no configurado');
      return;
    }
    
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}`;
    script.async = true;
    script.onload = () => setIsLoaded(true);
    script.onerror = () => onError('Error al cargar PayPal');
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [currency, onError]);

  useEffect(() => {
    if (!isLoaded || !window.paypal) return;

    window.paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                value: (amount / 100).toFixed(2), // Convertir centavos a dólares
                currency_code: currency
              }
            }
          ]
        });
      },
      onApprove: async (data: any, actions: any) => {
        try {
          const order = await actions.order.capture();
          onSuccess(order.id);
        } catch (error) {
          onError('Error al procesar el pago');
        }
      },
      onCancel: () => {
        onCancel();
      },
      onError: (err: any) => {
        onError('Error en PayPal: ' + err.message);
      }
    }).render('#paypal-button-container');
  }, [isLoaded, amount, currency, onSuccess, onError, onCancel]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center p-4 bg-chinese-black-700 rounded-lg">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-chinese-red-400 mr-3"></div>
        <span className="text-chinese-red-300">Cargando PayPal...</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div id="paypal-button-container" className={disabled ? 'opacity-50 pointer-events-none' : ''}></div>
    </div>
  );
}
