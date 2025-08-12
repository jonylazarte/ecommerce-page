'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Settings {
  stripe: {
    publishableKey: string;
    secretKey: string;
  };
  paypal: {
    clientId: string;
    clientSecret: string;
    mode: 'sandbox' | 'live';
  };
  email: {
    host: string;
    port: number;
    user: string;
    password: string;
    from: string;
  };
  bank: {
    bankName: string;
    accountType: string;
    accountNumber: string;
    cbu: string;
    holder: string;
    cuit: string;
  };
}

export default function AdminSettings() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [settings, setSettings] = useState<Settings>({
    stripe: { publishableKey: '', secretKey: '' },
    paypal: { clientId: '', clientSecret: '', mode: 'sandbox' },
    email: { host: '', port: 587, user: '', password: '', from: '' },
    bank: { bankName: '', accountType: '', accountNumber: '', cbu: '', holder: '', cuit: '' }
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      router.push('/auth');
      return;
    }
  }, [user, router]);

  useEffect(() => {
    const loadSettings = async () => {
      if (!user || user.role !== 'ADMIN') return;
      
      try {
        const response = await fetch('/api/admin/settings', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };

    loadSettings();
  }, [user, token]);

  const handleSave = async () => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        setMessage('Configuración guardada exitosamente');
      } else {
        setMessage('Error al guardar la configuración');
      }
    } catch (error) {
      setMessage('Error al guardar la configuración');
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = (section: keyof Settings, field: string, value: string | number) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  return (
    <div className="min-h-screen bg-chinese-black-900 chinese-bg">
      {/* Header */}
      <div className="bg-chinese-black-800 border-b border-chinese-red-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white chinese-text">Configuración</h1>
            <Link href="/admin" className="text-chinese-red-400 hover:text-chinese-red-300 transition-colors">
              ← Volver al panel
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('Error') 
              ? 'bg-red-500/20 border border-red-500/30 text-red-400' 
              : 'bg-green-500/20 border border-green-500/30 text-green-400'
          }`}>
            {message}
          </div>
        )}

        {/* Stripe Configuration */}
        <div className="bg-chinese-black-800 rounded-lg border border-chinese-red-500/30 p-6 mb-6">
          <h2 className="text-xl font-bold text-white chinese-text mb-4">Configuración de Stripe</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-chinese-red-300 text-sm font-medium mb-2">
                Publishable Key
              </label>
              <input
                type="text"
                value={settings.stripe.publishableKey}
                onChange={(e) => updateSettings('stripe', 'publishableKey', e.target.value)}
                className="w-full px-4 py-3 bg-chinese-black-700 border border-chinese-red-500/30 rounded-lg text-white placeholder-chinese-red-400 focus:outline-none focus:border-chinese-red-400 transition-colors"
                placeholder="pk_test_..."
              />
            </div>
            <div>
              <label className="block text-chinese-red-300 text-sm font-medium mb-2">
                Secret Key
              </label>
              <input
                type="password"
                value={settings.stripe.secretKey}
                onChange={(e) => updateSettings('stripe', 'secretKey', e.target.value)}
                className="w-full px-4 py-3 bg-chinese-black-700 border border-chinese-red-500/30 rounded-lg text-white placeholder-chinese-red-400 focus:outline-none focus:border-chinese-red-400 transition-colors"
                placeholder="sk_test_..."
              />
            </div>
          </div>
        </div>

        {/* PayPal Configuration */}
        <div className="bg-chinese-black-800 rounded-lg border border-chinese-red-500/30 p-6 mb-6">
          <h2 className="text-xl font-bold text-white chinese-text mb-4">Configuración de PayPal</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-chinese-red-300 text-sm font-medium mb-2">
                Client ID
              </label>
              <input
                type="text"
                value={settings.paypal.clientId}
                onChange={(e) => updateSettings('paypal', 'clientId', e.target.value)}
                className="w-full px-4 py-3 bg-chinese-black-700 border border-chinese-red-500/30 rounded-lg text-white placeholder-chinese-red-400 focus:outline-none focus:border-chinese-red-400 transition-colors"
                placeholder="Client ID de PayPal"
              />
            </div>
            <div>
              <label className="block text-chinese-red-300 text-sm font-medium mb-2">
                Client Secret
              </label>
              <input
                type="password"
                value={settings.paypal.clientSecret}
                onChange={(e) => updateSettings('paypal', 'clientSecret', e.target.value)}
                className="w-full px-4 py-3 bg-chinese-black-700 border border-chinese-red-500/30 rounded-lg text-white placeholder-chinese-red-400 focus:outline-none focus:border-chinese-red-400 transition-colors"
                placeholder="Client Secret de PayPal"
              />
            </div>
            <div>
              <label className="block text-chinese-red-300 text-sm font-medium mb-2">
                Modo
              </label>
              <select
                value={settings.paypal.mode}
                onChange={(e) => updateSettings('paypal', 'mode', e.target.value)}
                className="w-full px-4 py-3 bg-chinese-black-700 border border-chinese-red-500/30 rounded-lg text-white focus:outline-none focus:border-chinese-red-400 transition-colors"
              >
                <option value="sandbox">Sandbox (Pruebas)</option>
                <option value="live">Live (Producción)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Email Configuration */}
        <div className="bg-chinese-black-800 rounded-lg border border-chinese-red-500/30 p-6 mb-6">
          <h2 className="text-xl font-bold text-white chinese-text mb-4">Configuración de Email</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-chinese-red-300 text-sm font-medium mb-2">
                Host SMTP
              </label>
              <input
                type="text"
                value={settings.email.host}
                onChange={(e) => updateSettings('email', 'host', e.target.value)}
                className="w-full px-4 py-3 bg-chinese-black-700 border border-chinese-red-500/30 rounded-lg text-white placeholder-chinese-red-400 focus:outline-none focus:border-chinese-red-400 transition-colors"
                placeholder="smtp.gmail.com"
              />
            </div>
            <div>
              <label className="block text-chinese-red-300 text-sm font-medium mb-2">
                Puerto
              </label>
              <input
                type="number"
                value={settings.email.port}
                onChange={(e) => updateSettings('email', 'port', parseInt(e.target.value))}
                className="w-full px-4 py-3 bg-chinese-black-700 border border-chinese-red-500/30 rounded-lg text-white placeholder-chinese-red-400 focus:outline-none focus:border-chinese-red-400 transition-colors"
                placeholder="587"
              />
            </div>
            <div>
              <label className="block text-chinese-red-300 text-sm font-medium mb-2">
                Usuario
              </label>
              <input
                type="email"
                value={settings.email.user}
                onChange={(e) => updateSettings('email', 'user', e.target.value)}
                className="w-full px-4 py-3 bg-chinese-black-700 border border-chinese-red-500/30 rounded-lg text-white placeholder-chinese-red-400 focus:outline-none focus:border-chinese-red-400 transition-colors"
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <label className="block text-chinese-red-300 text-sm font-medium mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={settings.email.password}
                onChange={(e) => updateSettings('email', 'password', e.target.value)}
                className="w-full px-4 py-3 bg-chinese-black-700 border border-chinese-red-500/30 rounded-lg text-white placeholder-chinese-red-400 focus:outline-none focus:border-chinese-red-400 transition-colors"
                placeholder="Contraseña de la app"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-chinese-red-300 text-sm font-medium mb-2">
                Email Remitente
              </label>
              <input
                type="email"
                value={settings.email.from}
                onChange={(e) => updateSettings('email', 'from', e.target.value)}
                className="w-full px-4 py-3 bg-chinese-black-700 border border-chinese-red-500/30 rounded-lg text-white placeholder-chinese-red-400 focus:outline-none focus:border-chinese-red-400 transition-colors"
                placeholder="noreply@tutienda.com"
              />
            </div>
          </div>
        </div>

        {/* Bank Configuration */}
        <div className="bg-chinese-black-800 rounded-lg border border-chinese-red-500/30 p-6 mb-6">
          <h2 className="text-xl font-bold text-white chinese-text mb-4">Configuración Bancaria</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-chinese-red-300 text-sm font-medium mb-2">
                Nombre del Banco
              </label>
              <input
                type="text"
                value={settings.bank.bankName}
                onChange={(e) => updateSettings('bank', 'bankName', e.target.value)}
                className="w-full px-4 py-3 bg-chinese-black-700 border border-chinese-red-500/30 rounded-lg text-white placeholder-chinese-red-400 focus:outline-none focus:border-chinese-red-400 transition-colors"
                placeholder="Banco de la Nación Argentina"
              />
            </div>
            <div>
              <label className="block text-chinese-red-300 text-sm font-medium mb-2">
                Tipo de Cuenta
              </label>
              <input
                type="text"
                value={settings.bank.accountType}
                onChange={(e) => updateSettings('bank', 'accountType', e.target.value)}
                className="w-full px-4 py-3 bg-chinese-black-700 border border-chinese-red-500/30 rounded-lg text-white placeholder-chinese-red-400 focus:outline-none focus:border-chinese-red-400 transition-colors"
                placeholder="Cuenta Corriente"
              />
            </div>
            <div>
              <label className="block text-chinese-red-300 text-sm font-medium mb-2">
                Número de Cuenta
              </label>
              <input
                type="text"
                value={settings.bank.accountNumber}
                onChange={(e) => updateSettings('bank', 'accountNumber', e.target.value)}
                className="w-full px-4 py-3 bg-chinese-black-700 border border-chinese-red-500/30 rounded-lg text-white placeholder-chinese-red-400 focus:outline-none focus:border-chinese-red-400 transition-colors"
                placeholder="1234-5678-9012-3456"
              />
            </div>
            <div>
              <label className="block text-chinese-red-300 text-sm font-medium mb-2">
                CBU
              </label>
              <input
                type="text"
                value={settings.bank.cbu}
                onChange={(e) => updateSettings('bank', 'cbu', e.target.value)}
                className="w-full px-4 py-3 bg-chinese-black-700 border border-chinese-red-500/30 rounded-lg text-white placeholder-chinese-red-400 focus:outline-none focus:border-chinese-red-400 transition-colors"
                placeholder="0110123456789012345678"
              />
            </div>
            <div>
              <label className="block text-chinese-red-300 text-sm font-medium mb-2">
                Titular
              </label>
              <input
                type="text"
                value={settings.bank.holder}
                onChange={(e) => updateSettings('bank', 'holder', e.target.value)}
                className="w-full px-4 py-3 bg-chinese-black-700 border border-chinese-red-500/30 rounded-lg text-white placeholder-chinese-red-400 focus:outline-none focus:border-chinese-red-400 transition-colors"
                placeholder="RedChilli Store S.A."
              />
            </div>
            <div>
              <label className="block text-chinese-red-300 text-sm font-medium mb-2">
                CUIT
              </label>
              <input
                type="text"
                value={settings.bank.cuit}
                onChange={(e) => updateSettings('bank', 'cuit', e.target.value)}
                className="w-full px-4 py-3 bg-chinese-black-700 border border-chinese-red-500/30 rounded-lg text-white placeholder-chinese-red-400 focus:outline-none focus:border-chinese-red-400 transition-colors"
                placeholder="30-12345678-9"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-chinese-red-600 hover:bg-chinese-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Guardando...' : 'Guardar Configuración'}
          </button>
        </div>
      </div>
    </div>
  );
}
