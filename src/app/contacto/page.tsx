'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simular envío del formulario
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitStatus('success');
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        asunto: '',
        mensaje: ''
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-chinese-bg">
      {/* Hero Section */}
      <div className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 chinese-display">
              联系我们
            </h1>
            <p className="text-xl text-chinese-red-300 mb-8 max-w-3xl mx-auto chinese-handwriting">
              Estamos aquí para ayudarte. Contáctanos para cualquier consulta sobre nuestros productos tecnológicos chinos.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-chinese-black-800/50 backdrop-blur-sm rounded-2xl border border-chinese-red-500/30 p-8">
              <h2 className="text-3xl font-bold text-white mb-8 chinese-title">Envíanos un Mensaje</h2>
              
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
                  <p className="text-green-400 chinese-handwriting">¡Mensaje enviado exitosamente! Te responderemos pronto.</p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 chinese-handwriting">Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="nombre" className="block text-chinese-red-300 mb-2 chinese-handwriting">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-chinese-black-700 border border-chinese-red-500/30 rounded-lg text-white placeholder-chinese-red-400/50 focus:outline-none focus:border-chinese-red-400 focus:ring-2 focus:ring-chinese-red-400/20 transition-all duration-200"
                      placeholder="Tu nombre completo"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-chinese-red-300 mb-2 chinese-handwriting">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-chinese-black-700 border border-chinese-red-500/30 rounded-lg text-white placeholder-chinese-red-400/50 focus:outline-none focus:border-chinese-red-400 focus:ring-2 focus:ring-chinese-red-400/20 transition-all duration-200"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="telefono" className="block text-chinese-red-300 mb-2 chinese-handwriting">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-chinese-black-700 border border-chinese-red-500/30 rounded-lg text-white placeholder-chinese-red-400/50 focus:outline-none focus:border-chinese-red-400 focus:ring-2 focus:ring-chinese-red-400/20 transition-all duration-200"
                      placeholder="+54 11 1234-5678"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="asunto" className="block text-chinese-red-300 mb-2 chinese-handwriting">
                      Asunto
                    </label>
                    <select
                      id="asunto"
                      name="asunto"
                      value={formData.asunto}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-chinese-black-700 border border-chinese-red-500/30 rounded-lg text-white focus:outline-none focus:border-chinese-red-400 focus:ring-2 focus:ring-chinese-red-400/20 transition-all duration-200"
                    >
                      <option value="">Selecciona un asunto</option>
                      <option value="consulta-producto">Consulta sobre producto</option>
                      <option value="soporte-tecnico">Soporte técnico</option>
                      <option value="venta-mayorista">Venta mayorista</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="mensaje" className="block text-chinese-red-300 mb-2 chinese-handwriting">
                    Mensaje
                  </label>
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-chinese-black-700 border border-chinese-red-500/30 rounded-lg text-white placeholder-chinese-red-400/50 focus:outline-none focus:border-chinese-red-400 focus:ring-2 focus:ring-chinese-red-400/20 transition-all duration-200 resize-none"
                    placeholder="Cuéntanos en qué podemos ayudarte..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-chinese text-xl py-4 transform hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed chinese-handwriting"
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Business Info */}
              <div className="bg-chinese-black-800/50 backdrop-blur-sm rounded-2xl border border-chinese-red-500/30 p-8">
                <h3 className="text-2xl font-bold text-white mb-6 chinese-title">Información de Contacto</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-chinese-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1 chinese-handwriting">Teléfono</h4>
                      <p className="text-chinese-red-300 chinese-handwriting">+54 11 1234-5678</p>
                      <p className="text-chinese-red-400 text-sm chinese-handwriting">Lun a Vie: 9:00 - 18:00</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-chinese-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1 chinese-handwriting">Email</h4>
                      <p className="text-chinese-red-300 chinese-handwriting">info@gmaildeprueba.com.ar</p>
                      <p className="text-chinese-red-400 text-sm chinese-handwriting">Respuesta en 24 horas</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-chinese-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1 chinese-handwriting">Dirección</h4>
                      <p className="text-chinese-red-300 chinese-handwriting">Av. Corrientes 1234</p>
                      <p className="text-chinese-red-300 chinese-handwriting">CABA, Buenos Aires</p>
                      <p className="text-chinese-red-400 text-sm chinese-handwriting">Argentina</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-chinese-black-800/50 backdrop-blur-sm rounded-2xl border border-chinese-red-500/30 p-8">
                <h3 className="text-2xl font-bold text-white mb-6 chinese-title">Horarios de Atención</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-chinese-red-300 chinese-handwriting">Lunes - Viernes</span>
                    <span className="text-white font-semibold chinese-handwriting">9:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-chinese-red-300 chinese-handwriting">Sábados</span>
                    <span className="text-white font-semibold chinese-handwriting">10:00 - 14:00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-chinese-red-300 chinese-handwriting">Domingos</span>
                    <span className="text-white font-semibold chinese-handwriting">Cerrado</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-chinese-red-500/10 border border-chinese-red-500/20 rounded-lg">
                  <p className="text-chinese-red-300 text-sm chinese-handwriting">
                    <strong>Nota:</strong> Los pedidos online se procesan las 24 horas del día, los 7 días de la semana.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
