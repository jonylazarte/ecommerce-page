'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import PayPalButton from '../../components/PayPalButton';
import MercadoPagoButton from '../../components/MercadoPagoButton';

interface CheckoutForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface CardForm {
  cardNumber: string;
  cardHolder: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, getTotal, clearCart } = useCart();
  const { user, token } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showPayPalButton, setShowPayPalButton] = useState(false);
  const [showMercadoPagoButton, setShowMercadoPagoButton] = useState(false);
  const [formData, setFormData] = useState<CheckoutForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Argentina'
  });

  const [cardData, setCardData] = useState<CardForm>({
    cardNumber: '',
    cardHolder: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  });

  // Redirect if cart is empty (but not after successful payment)
  useEffect(() => {
    if (cartItems.length === 0 && !paymentSuccess) {
      router.push('/');
    }
  }, [cartItems.length, router, paymentSuccess]);

  const subtotal = getTotal();
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  // Show loading if cart is empty (redirecting)
  if (cartItems.length === 0 && !paymentSuccess) {
    return (
      <div className="min-h-screen bg-chinese-black-900 chinese-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chinese-red-400 mx-auto mb-4"></div>
          <p className="text-chinese-red-300">Redirigiendo...</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCardData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate form
    if (Object.values(formData).some(value => !value)) {
      alert('Por favor completa todos los campos');
      return;
    }
    
    // Move to payment step
    setCurrentStep(2);
  };

  const handlePayment = async () => {
    if (!user || !token) {
      alert('Debes iniciar sesión para continuar');
      router.push('/auth');
      return;
    }

    setLoading(true);
    
    try {
      if (paymentMethod === 'transfer') {
        // Mostrar información de transferencia bancaria
        setCurrentStep(3);
      } else if (paymentMethod === 'card') {
        // Ir al paso de pago con tarjeta
        setCurrentStep(3);
      } else if (paymentMethod === 'paypal') {
        // Mostrar botón de PayPal
        setShowPayPalButton(true);
      } else if (paymentMethod === 'mercadopago') {
        // Mostrar botón de MercadoPago
        setShowMercadoPagoButton(true);
      }
    } catch (error) {
      console.error('Error en el proceso de pago:', error);
      alert('Error en el proceso de pago. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayPalSuccess = async (paymentId: string) => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/payments/paypal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          paymentId: paymentId,
          amount: total,
          currency: 'USD',
          items: cartItems.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price
          })),
          customerInfo: formData
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setPaymentSuccess(true);
          router.push('/checkout/success');
          clearCart();
        } else {
          alert('Error en el pago: ' + (data.error || 'Error desconocido'));
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al procesar pago con PayPal');
      }
    } catch (error) {
      console.error('Error PayPal:', error);
      alert('Error al procesar pago con PayPal. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayPalError = (error: string) => {
    alert('Error en PayPal: ' + error);
    setShowPayPalButton(false);
  };

  const handlePayPalCancel = () => {
    setShowPayPalButton(false);
  };

  const handleMercadoPagoSuccess = async (paymentId: string) => {
    setPaymentSuccess(true);
    router.push('/checkout/success');
    clearCart();
  };

  const handleMercadoPagoError = (error: string) => {
    alert('Error con MercadoPago: ' + error);
    setShowMercadoPagoButton(false);
  };

  const handleMercadoPagoCancel = () => {
    setShowMercadoPagoButton(false);
  };

  const handleConfirmOrder = async () => {
    if (paymentMethod === 'card') {
      // Procesar pago con tarjeta
      await processCardPayment();
    } else {
      // Confirmar pedido (transferencia bancaria)
      setPaymentSuccess(true);
      router.push('/checkout/success');
      clearCart();
    }
  };

  const processCardPayment = async () => {
    setLoading(true);
    
    try {
      // Validar datos de tarjeta
      if (!cardData.cardNumber || !cardData.cardHolder || !cardData.expiryMonth || !cardData.expiryYear || !cardData.cvv) {
        alert('Por favor completa todos los datos de la tarjeta');
        return;
      }

      const response = await fetch('/api/payments/stripe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: total,
          currency: 'usd',
          cardData: cardData,
          items: cartItems.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price
          })),
          customerInfo: formData
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setPaymentSuccess(true);
          router.push('/checkout/success');
          clearCart();
        } else {
          alert('Error en el pago: ' + data.error);
        }
      } else {
        throw new Error('Error al procesar pago con tarjeta');
      }
    } catch (error) {
      console.error('Error tarjeta:', error);
      alert('Error al procesar pago con tarjeta. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-chinese-black-900 chinese-bg">
             {/* Back Button */}
       <div className="bg-chinese-black-800 border-b border-chinese-red-500/30">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
           <Link href="/" className="text-chinese-red-400 hover:text-chinese-red-300 transition-colors duration-200">
             ← Volver a la tienda
           </Link>
         </div>
       </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div className={`flex items-center ${currentStep >= 1 ? 'text-chinese-red-400' : 'text-chinese-red-600'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    currentStep >= 1 ? 'border-chinese-red-400 bg-chinese-red-400' : 'border-chinese-red-600'
                  }`}>
                    <span className="text-white font-bold">1</span>
                  </div>
                                     <span className="ml-3 font-medium chinese-handwriting">Información Personal</span>
                </div>
                <div className={`flex-1 h-0.5 mx-4 ${currentStep >= 2 ? 'bg-chinese-red-400' : 'bg-chinese-red-600'}`}></div>
                <div className={`flex items-center ${currentStep >= 2 ? 'text-chinese-red-400' : 'text-chinese-red-600'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    currentStep >= 2 ? 'border-chinese-red-400 bg-chinese-red-400' : 'border-chinese-red-600'
                  }`}>
                    <span className="text-white font-bold">2</span>
                  </div>
                                     <span className="ml-3 font-medium chinese-handwriting">Pago</span>
                </div>
                <div className={`flex-1 h-0.5 mx-4 ${currentStep >= 3 ? 'bg-chinese-red-400' : 'bg-chinese-red-600'}`}></div>
                <div className={`flex items-center ${currentStep >= 3 ? 'text-chinese-red-400' : 'text-chinese-red-600'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    currentStep >= 3 ? 'border-chinese-red-400 bg-chinese-red-400' : 'border-chinese-red-600'
                  }`}>
                    <span className="text-white font-bold">3</span>
                  </div>
                                     <span className="ml-3 font-medium chinese-handwriting">Confirmación</span>
                </div>
              </div>
            </div>

            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="bg-chinese-black-800 rounded-lg border border-chinese-red-500/30 p-6">
                                 <h2 className="text-2xl font-bold text-white chinese-title mb-6">联系信息</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-chinese-red-300 text-sm font-medium mb-2">
                        Nombre *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-chinese-black-700 border border-chinese-red-500/30 rounded-lg text-white placeholder-chinese-red-400 focus:outline-none focus:border-chinese-red-400 transition-colors duration-200"
                        placeholder="Tu nombre"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-chinese-red-300 text-sm font-medium mb-2">
                        Apellido *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-chinese-black-700 border border-chinese-red-500/30 rounded-lg text-white placeholder-chinese-red-400 focus:outline-none focus:border-chinese-red-400 transition-colors duration-200"
                        placeholder="Tu apellido"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-chinese-red-300 text-sm font-medium mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-chinese-black-700 border border-chinese-red-500/30 rounded-lg text-white placeholder-chinese-red-400 focus:outline-none focus:border-chinese-red-400 transition-colors duration-200"
                        placeholder="tu@email.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-chinese-red-300 text-sm font-medium mb-2">
                        Teléfono *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-chinese-black-700 border border-chinese-red-500/30 rounded-lg text-white placeholder-chinese-red-400 focus:outline-none focus:border-chinese-red-400 transition-colors duration-200"
                        placeholder="+54 11 1234-5678"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-chinese-red-300 text-sm font-medium mb-2">
                      Dirección *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-chinese-black-700 border border-chinese-red-500/30 rounded-lg text-white placeholder-chinese-red-400 focus:outline-none focus:border-chinese-red-400 transition-colors duration-200"
                      placeholder="Calle y número"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-chinese-red-300 text-sm font-medium mb-2">
                        Ciudad *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-chinese-black-700 border border-chinese-red-500/30 rounded-lg text-white placeholder-chinese-red-400 focus:outline-none focus:border-chinese-red-400 transition-colors duration-200"
                        placeholder="Buenos Aires"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-chinese-red-300 text-sm font-medium mb-2">
                        Código Postal *
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-chinese-black-700 border border-chinese-red-500/30 rounded-lg text-white placeholder-chinese-red-400 focus:outline-none focus:border-chinese-red-400 transition-colors duration-200"
                        placeholder="1234"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-chinese-red-300 text-sm font-medium mb-2">
                        País *
                      </label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-chinese-black-700 border border-chinese-red-500/30 rounded-lg text-white focus:outline-none focus:border-chinese-red-400 transition-colors duration-200"
                        required
                      >
                        <option value="Argentina">Argentina</option>
                        <option value="Chile">Chile</option>
                        <option value="Uruguay">Uruguay</option>
                        <option value="Paraguay">Paraguay</option>
                        <option value="Bolivia">Bolivia</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-chinese-red-600 hover:bg-chinese-red-700 text-white font-bold py-4 px-6 rounded-lg transition-colors duration-200 transform hover:scale-105"
                  >
                    Continuar al Pago
                  </button>
                </form>
              </div>
            )}

            {/* Step 2: Payment */}
            {currentStep === 2 && (
              <div className="bg-chinese-black-800 rounded-lg border border-chinese-red-500/30 p-6">
                                 <h2 className="text-2xl font-bold text-white chinese-title mb-6">支付方式</h2>
                
                <div className="space-y-4 mb-8">
                  <div 
                    className={`flex items-center p-4 bg-chinese-black-700 rounded-lg border cursor-pointer transition-colors duration-200 ${
                      paymentMethod === 'card' 
                        ? 'border-chinese-red-400' 
                        : 'border-chinese-red-500/30 hover:border-chinese-red-400'
                    }`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <input 
                      type="radio" 
                      name="payment" 
                      value="card" 
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="text-chinese-red-600" 
                    />
                    <div className="ml-4">
                      <div className="flex items-center space-x-3">
                        <svg className="w-8 h-8 text-chinese-red-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                        </svg>
                        <span className="text-white font-medium">Tarjeta de Crédito/Débito</span>
                      </div>
                      <p className="text-chinese-red-300 text-sm mt-1">Visa, Mastercard, American Express</p>
                    </div>
                  </div>

                  <div 
                    className={`flex items-center p-4 bg-chinese-black-700 rounded-lg border cursor-pointer transition-colors duration-200 ${
                      paymentMethod === 'paypal' 
                        ? 'border-chinese-red-400' 
                        : 'border-chinese-red-500/30 hover:border-chinese-red-400'
                    }`}
                    onClick={() => setPaymentMethod('paypal')}
                  >
                    <input 
                      type="radio" 
                      name="payment" 
                      value="paypal" 
                      checked={paymentMethod === 'paypal'}
                      onChange={() => setPaymentMethod('paypal')}
                      className="text-chinese-red-600" 
                    />
                    <div className="ml-4">
                      <div className="flex items-center space-x-3">
                        <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.067 8.478c.492.315.844.825.844 1.478 0 .653-.352 1.163-.844 1.478-.492.315-1.163.478-1.844.478H18v-1.956h.223c.681 0 1.352-.163 1.844-.478zM7.067 8.478c.492.315.844.825.844 1.478 0 .653-.352 1.163-.844 1.478-.492.315-1.163.478-1.844.478H5v-1.956h.223c.681 0 1.352-.163 1.844-.478z"/>
                        </svg>
                        <span className="text-white font-medium">PayPal</span>
                      </div>
                      <p className="text-chinese-red-300 text-sm mt-1">Pago seguro con PayPal</p>
                    </div>
                  </div>

                  <div 
                    className={`flex items-center p-4 bg-chinese-black-700 rounded-lg border cursor-pointer transition-colors duration-200 ${
                      paymentMethod === 'mercadopago' 
                        ? 'border-chinese-red-400' 
                        : 'border-chinese-red-500/30 hover:border-chinese-red-400'
                    }`}
                    onClick={() => setPaymentMethod('mercadopago')}
                  >
                    <input 
                      type="radio" 
                      name="payment" 
                      value="mercadopago" 
                      checked={paymentMethod === 'mercadopago'}
                      onChange={() => setPaymentMethod('mercadopago')}
                      className="text-chinese-red-600" 
                    />
                    <div className="ml-4">
                      <div className="flex items-center space-x-3">
                        <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                        <span className="text-white font-medium">MercadoPago</span>
                      </div>
                      <p className="text-chinese-red-300 text-sm mt-1">Pago con MercadoPago</p>
                    </div>
                  </div>

                  <div 
                    className={`flex items-center p-4 bg-chinese-black-700 rounded-lg border cursor-pointer transition-colors duration-200 ${
                      paymentMethod === 'transfer' 
                        ? 'border-chinese-red-400' 
                        : 'border-chinese-red-500/30 hover:border-chinese-red-400'
                    }`}
                    onClick={() => setPaymentMethod('transfer')}
                  >
                    <input 
                      type="radio" 
                      name="payment" 
                      value="transfer" 
                      checked={paymentMethod === 'transfer'}
                      onChange={() => setPaymentMethod('transfer')}
                      className="text-chinese-red-600" 
                    />
                    <div className="ml-4">
                      <div className="flex items-center space-x-3">
                        <svg className="w-8 h-8 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                        <span className="text-white font-medium">Transferencia Bancaria</span>
                      </div>
                      <p className="text-chinese-red-300 text-sm mt-1">Transferencia directa a nuestra cuenta</p>
                    </div>
                  </div>
                </div>

                {showPayPalButton ? (
                  <div className="space-y-4">
                    <PayPalButton
                      amount={total}
                      currency="USD"
                      onSuccess={handlePayPalSuccess}
                      onError={handlePayPalError}
                      onCancel={handlePayPalCancel}
                      disabled={loading}
                    />
                    <button
                      onClick={() => setShowPayPalButton(false)}
                      className="w-full bg-chinese-black-700 hover:bg-chinese-black-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : showMercadoPagoButton ? (
                  <div className="space-y-4">
                    <MercadoPagoButton
                      amount={total}
                      currency="USD"
                      onSuccess={handleMercadoPagoSuccess}
                      onError={handleMercadoPagoError}
                      onCancel={handleMercadoPagoCancel}
                      disabled={loading}
                    />
                    <button
                      onClick={() => setShowMercadoPagoButton(false)}
                      className="w-full bg-chinese-black-700 hover:bg-chinese-black-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="flex-1 bg-chinese-black-700 hover:bg-chinese-black-600 text-white font-bold py-4 px-6 rounded-lg transition-colors duration-200"
                    >
                      Atrás
                    </button>
                    <button
                      onClick={handlePayment}
                      disabled={loading}
                      className="flex-1 bg-chinese-red-600 hover:bg-chinese-red-700 text-white font-bold py-4 px-6 rounded-lg transition-colors duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Procesando...' : 'Continuar'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Confirmation */}
            {currentStep === 3 && (
              <div className="bg-chinese-black-800 rounded-lg border border-chinese-red-500/30 p-6">
                                 <h2 className="text-2xl font-bold text-white chinese-title mb-6">
                   {paymentMethod === 'transfer' ? '银行转账信息' : 
                    paymentMethod === 'card' ? '信用卡支付' : '确认订单'}
                 </h2>
                
                {paymentMethod === 'card' ? (
                  <div className="bg-chinese-black-700 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Datos de la Tarjeta</h3>
                                         <form className="space-y-4" autoComplete="off">
                      <div>
                        <label className="block text-chinese-red-300 text-sm font-medium mb-2">
                          Número de Tarjeta *
                        </label>
                                                 <input
                           type="text"
                           name="cardNumber"
                           value={cardData.cardNumber}
                           onChange={handleCardInputChange}
                           className="w-full px-4 py-3 bg-chinese-black-600 border border-chinese-red-500/30 rounded-lg text-white placeholder-chinese-red-400 focus:outline-none focus:border-chinese-red-400 transition-colors duration-200"
                           placeholder="1234 5678 9012 3456"
                           maxLength={19}
                           autoComplete="cc-number"
                           inputMode="numeric"
                         />
                      </div>
                      
                      <div>
                        <label className="block text-chinese-red-300 text-sm font-medium mb-2">
                          Titular de la Tarjeta *
                        </label>
                                                 <input
                           type="text"
                           name="cardHolder"
                           value={cardData.cardHolder}
                           onChange={handleCardInputChange}
                           className="w-full px-4 py-3 bg-chinese-black-600 border border-chinese-red-500/30 rounded-lg text-white placeholder-chinese-red-400 focus:outline-none focus:border-chinese-red-400 transition-colors duration-200"
                           placeholder="NOMBRE APELLIDO"
                           autoComplete="cc-name"
                         />
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-chinese-red-300 text-sm font-medium mb-2">
                            Mes *
                          </label>
                                                     <select
                             name="expiryMonth"
                             value={cardData.expiryMonth}
                             onChange={handleCardInputChange}
                             className="w-full px-4 py-3 bg-chinese-black-600 border border-chinese-red-500/30 rounded-lg text-white focus:outline-none focus:border-chinese-red-400 transition-colors duration-200"
                             autoComplete="cc-exp-month"
                           >
                            <option value="">MM</option>
                            {Array.from({length: 12}, (_, i) => i + 1).map(month => (
                              <option key={month} value={month.toString().padStart(2, '0')}>
                                {month.toString().padStart(2, '0')}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-chinese-red-300 text-sm font-medium mb-2">
                            Año *
                          </label>
                                                     <select
                             name="expiryYear"
                             value={cardData.expiryYear}
                             onChange={handleCardInputChange}
                             className="w-full px-4 py-3 bg-chinese-black-600 border border-chinese-red-500/30 rounded-lg text-white focus:outline-none focus:border-chinese-red-400 transition-colors duration-200"
                             autoComplete="cc-exp-year"
                           >
                            <option value="">YYYY</option>
                            {Array.from({length: 10}, (_, i) => new Date().getFullYear() + i).map(year => (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-chinese-red-300 text-sm font-medium mb-2">
                            CVV *
                          </label>
                                                     <input
                             type="text"
                             name="cvv"
                             value={cardData.cvv}
                             onChange={handleCardInputChange}
                             className="w-full px-4 py-3 bg-chinese-black-600 border border-chinese-red-500/30 rounded-lg text-white placeholder-chinese-red-400 focus:outline-none focus:border-chinese-red-400 transition-colors duration-200"
                             placeholder="123"
                             maxLength={4}
                             autoComplete="cc-csc"
                             inputMode="numeric"
                           />
                        </div>
                      </div>
                    </form>
                    
                    <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                      <h4 className="text-blue-400 font-semibold mb-2">Información de Seguridad:</h4>
                      <ul className="text-blue-300 text-sm space-y-1">
                        <li>• Tus datos de tarjeta están protegidos con encriptación SSL</li>
                        <li>• No almacenamos información de tu tarjeta</li>
                        <li>• El pago se procesa de forma segura a través de Stripe</li>
                      </ul>
                    </div>
                  </div>
                ) : paymentMethod === 'transfer' ? (
                  <div className="bg-chinese-black-700 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Datos Bancarios</h3>
                    <div className="space-y-4 text-chinese-red-300">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Banco:</span>
                        <span>Banco de la Nación Argentina</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Tipo de Cuenta:</span>
                        <span>Cuenta Corriente</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Número de Cuenta:</span>
                        <span className="font-mono text-chinese-red-400">1234-5678-9012-3456</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">CBU:</span>
                        <span className="font-mono text-chinese-red-400">0110123456789012345678</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Titular:</span>
                        <span>RedChilli Store S.A.</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">CUIT:</span>
                        <span className="font-mono text-chinese-red-400">30-12345678-9</span>
                      </div>
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span className="text-white">Monto a Transferir:</span>
                        <span className="text-chinese-red-400">¥{total.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                      <h4 className="text-yellow-400 font-semibold mb-2">Instrucciones:</h4>
                      <ul className="text-yellow-300 text-sm space-y-1">
                        <li>• Realiza la transferencia por el monto exacto indicado</li>
                        <li>• Usa tu nombre como referencia del pago</li>
                        <li>• Envía el comprobante a: pagos@redchilli.com</li>
                        <li>• Tu pedido será procesado una vez confirmado el pago</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="bg-chinese-black-700 rounded-lg p-6 mb-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Resumen del Pedido</h3>
                      <div className="space-y-3">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex justify-between items-center">
                            <span className="text-chinese-red-300">{item.name} x{item.quantity}</span>
                            <span className="text-white font-medium">${item.price.toLocaleString('es-AR')}</span>
                          </div>
                        ))}
                        <div className="border-t border-chinese-red-500/30 pt-3">
                          <div className="flex justify-between items-center">
                            <span className="text-chinese-red-300">Subtotal:</span>
                            <span className="text-white font-medium">¥{subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-chinese-red-300">Envío:</span>
                            <span className="text-white font-medium">Gratis</span>
                          </div>
                          <div className="flex justify-between items-center text-lg font-bold">
                            <span className="text-white">Total:</span>
                            <span className="text-chinese-red-400">¥{total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-chinese-black-700 rounded-lg p-6 mb-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Información de Envío</h3>
                      <div className="text-chinese-red-300">
                        <p>{formData.firstName} {formData.lastName}</p>
                        <p>{formData.address}</p>
                        <p>{formData.city}, {formData.postalCode}</p>
                        <p>{formData.country}</p>
                        <p className="mt-2">{formData.email}</p>
                        <p>{formData.phone}</p>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex space-x-4">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="flex-1 bg-chinese-black-700 hover:bg-chinese-black-600 text-white font-bold py-4 px-6 rounded-lg transition-colors duration-200"
                  >
                    Atrás
                  </button>
                  <button
                    onClick={handleConfirmOrder}
                    disabled={loading}
                    className="flex-1 bg-chinese-red-600 hover:bg-chinese-red-700 text-white font-bold py-4 px-6 rounded-lg transition-colors duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Procesando...' : 
                     paymentMethod === 'transfer' ? 'Confirmar Pedido' : 
                     paymentMethod === 'card' ? 'Pagar con Tarjeta' : 'Finalizar Compra'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-chinese-black-800 rounded-lg border border-chinese-red-500/30 p-6 sticky top-8">
                             <h3 className="text-xl font-bold text-white chinese-title mb-6">订单摘要</h3>
              
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg border border-chinese-red-500/30"
                    />
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{item.name}</h4>
                      <p className="text-chinese-red-300">Cantidad: {item.quantity}</p>
                      <p className="text-chinese-red-400 font-semibold">${item.price.toLocaleString('es-AR')}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-chinese-red-500/30 pt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-chinese-red-300">Subtotal:</span>
                  <span className="text-white">¥{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-chinese-red-300">Envío:</span>
                  <span className="text-white">Gratis</span>
                </div>
                <div className="flex justify-between text-xl font-bold border-t border-chinese-red-500/30 pt-3">
                  <span className="text-white">Total:</span>
                  <span className="text-chinese-red-400">¥{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
