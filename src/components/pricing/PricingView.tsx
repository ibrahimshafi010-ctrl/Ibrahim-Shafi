import React, { useState } from 'react';
import { Check, Sparkles, HelpCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { ToastMessage } from '../../types';

interface PricingViewProps {
  onStartFree: () => void;
  onShowToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const PricingView: React.FC<PricingViewProps> = ({ onStartFree, onShowToast }) => {
  const [notifyEmail, setNotifyEmail] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleNotifyMe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyEmail || !notifyEmail.includes('@')) {
      onShowToast({
        title: 'Por favor, introduce un correo válido',
        type: 'warning',
      });
      return;
    }
    onShowToast({
      title: '¡Te hemos anotado en la lista prioritaria!',
      message: `Te avisaremos a ${notifyEmail} en cuanto PIXORA PRO esté disponible.`,
      type: 'success',
    });
    setNotifyEmail('');
  };

  const faqs = [
    {
      q: '¿PIXORA FREE es realmente gratis?',
      a: 'Sí, 100% gratuito. Puedes crear tantos diseños como quieras, usar las plantillas incluidas, las 6 herramientas de optimización y descargar tus creaciones en alta resolución PNG sin marcas de agua.',
    },
    {
      q: '¿Tengo que ingresar una tarjeta de crédito?',
      a: 'No. En PIXORA FREE no necesitas ninguna tarjeta ni método de pago. Empiezas a diseñar directamente desde tu navegador.',
    },
    {
      q: '¿Cuándo estará disponible PIXORA PRO?',
      a: 'Estamos afinando las funciones avanzadas como exportación vectorial SVG, kit de marcas y banco extendido de recursos. Puedes suscribirte para recibir acceso anticipado exclusivo.',
    },
    {
      q: '¿Mis diseños se guardan de forma privada?',
      a: 'Por supuesto. Tu trabajo y las imágenes que subes se procesan de manera local y privada en tu propio navegador.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 text-violet-800 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PLANES SENCILLOS Y TRANSPARENTES</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Diseña gratis hoy, potencia tu marca mañana
          </h1>
          <p className="text-slate-600 text-base">
            Elige el plan que mejor se adapte a tu ritmo de trabajo. Sin compromisos ni letras pequeñas.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* 1. PIXORA FREE */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between relative">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-extrabold text-slate-900">PIXORA FREE</h3>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">
                  Actual
                </span>
              </div>

              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                  0 €
                </span>
                <span className="text-slate-500 font-semibold text-sm">/mes</span>
              </div>

              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                Todo lo necesario para diseñar contenido diario, posts para redes y miniaturas sin coste alguno.
              </p>

              <div className="space-y-3 pt-6 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Incluye:
                </span>
                <ul className="space-y-3 text-sm text-slate-700">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Editor básico completo</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Plantillas gratuitas predefinidas</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Herramientas básicas (redimensionar, comprimir, QR, paletas)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Descarga de diseños en alta resolución (PNG/JPG)</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-slate-500">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Sin marcas de agua</span>
                  </li>
                </ul>
              </div>
            </div>

            <button
              onClick={onStartFree}
              className="mt-8 w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold shadow-xs transition-colors flex items-center justify-center gap-2 active:scale-95"
            >
              <span>Comenzar a diseñar gratis</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 2. PIXORA PRO */}
          <div className="bg-gradient-to-b from-white to-violet-50/50 rounded-3xl border-2 border-violet-500 p-8 shadow-xl relative flex flex-col justify-between">
            {/* Ribbon Badge */}
            <div className="absolute -top-3.5 right-6 px-3.5 py-1 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-extrabold uppercase tracking-wider rounded-full shadow-sm">
              Próximamente
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-extrabold text-slate-900">PIXORA PRO</h3>
                <span className="px-3 py-1 bg-violet-100 text-violet-800 text-xs font-bold rounded-full">
                  Premium
                </span>
              </div>

              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                  2,99 €
                </span>
                <span className="text-slate-500 font-semibold text-sm">/mes</span>
              </div>

              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                Para creadores exigentes que necesitan mayor variedad visual, recursos avanzados y soporte de vectores.
              </p>

              <div className="space-y-3 pt-6 border-t border-violet-100">
                <span className="text-xs font-bold text-violet-900 uppercase tracking-wider block">
                  Incluye visualmente:
                </span>
                <ul className="space-y-3 text-sm text-slate-700">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-violet-600 shrink-0" />
                    <span>Más plantillas exclusivas y actualizadas semanalmente</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-violet-600 shrink-0" />
                    <span>Más herramientas y utilidades avanzadas</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-violet-600 shrink-0" />
                    <span>Funciones avanzadas (exportación en vectores SVG)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-violet-600 shrink-0" />
                    <span>Más opciones de diseño, tipografías y efectos visuales</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Notification form */}
            <form onSubmit={handleNotifyMe} className="mt-8 pt-6 border-t border-violet-100 space-y-3">
              <span className="text-xs font-bold text-slate-800 block">
                ¿Te interesa PRO? Recibe acceso preferente:
              </span>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  className="flex-1 px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold transition-colors whitespace-nowrap"
                >
                  Avisadme
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* FAQs */}
        <div className="pt-8 border-t border-slate-200 max-w-3xl mx-auto space-y-4">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-slate-900">Preguntas frecuentes</h3>
            <p className="text-xs text-slate-500">Resolvemos tus dudas sobre PIXORA y sus opciones.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-800 hover:bg-slate-50"
                >
                  <span>{faq.q}</span>
                  <span className="text-violet-600 font-bold text-lg">
                    {openFaq === i ? '−' : '+'}
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
