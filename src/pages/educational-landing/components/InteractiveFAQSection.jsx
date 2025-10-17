import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const InteractiveFAQSection = () => {
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const faqData = [
    {
      id: 1,
      question: "¿Cómo puedo saber si un sitio web de aerolínea es real?",
      answer: `Verifica estos elementos clave:\n• La URL debe coincidir exactamente con el sitio oficial (ej: avianca.com, no aviancaa.com)\n• Debe tener certificado SSL (https:// y candado verde)\n• Información de contacto verificable con números de teléfono reales\n• Métodos de pago seguros y reconocidos\n• Reseñas positivas en sitios independientes como Google o TripAdvisor`
    },
    {
      id: 2,
      question: "¿Qué debo hacer si creo que he sido víctima de fraude?",
      answer: `Actúa inmediatamente:\n• Contacta a tu banco para bloquear tarjetas de crédito/débito\n• Cambia todas las contraseñas de tus cuentas importantes\n• Reporta el fraude a la Superintendencia de Industria y Comercio (SIC)\n• Presenta denuncia en la Fiscalía General de la Nación\n• Guarda toda la evidencia: capturas de pantalla, correos, mensajes\n• No compartas detalles del fraude en redes sociales`
    },
    {
      id: 3,
      question: "¿Por qué los adultos mayores son más vulnerables al fraude digital?",
      answer: `Varios factores contribuyen a esta vulnerabilidad:\n• Menor familiaridad con la tecnología digital\n• Mayor confianza en las personas y menos sospecha\n• Dificultad para identificar señales visuales de sitios falsos\n• Menos experiencia con compras en línea\n• Mayor disponibilidad de tiempo para interactuar con estafadores\n• Tendencia a no verificar información con familiares jóvenes`
    },
    {
      id: 4,
      question: "¿Qué información nunca debo compartir en línea?",
      answer: `Información que NUNCA debes compartir:\n• Número completo de cédula de ciudadanía\n• Códigos de seguridad de tarjetas (CVV)\n• Contraseñas o PINs bancarios\n• Números de cuenta bancaria completos\n• Códigos de verificación SMS\n• Información sobre ingresos o patrimonio\n• Fotos de documentos oficiales\n• Ubicación exacta de tu domicilio`
    },
    {
      id: 5,
      question: "¿Cómo funcionan las simulaciones de CyberSafety Trainer?",
      answer: `Nuestras simulaciones son completamente seguras:\n• Recreamos sitios falsos en un entorno controlado\n• No se procesan pagos reales ni se almacenan datos sensibles\n• Te mostramos exactamente cómo operan los estafadores\n• Al final, revelamos que era una simulación educativa\n• Proporcionamos análisis de las técnicas de engaño utilizadas\n• Todo está diseñado para enseñar, no para engañar realmente`
    },
    {
      id: 6,
      question: "¿Qué hacer si un familiar mayor está siendo estafado?",
      answer: `Intervención inmediata y respetuosa:\n• Habla con calma, sin juzgar ni regañar\n• Ayúdales a contactar su banco inmediatamente\n• Acompáñales a hacer las denuncias correspondientes\n• Configura alertas de seguridad en sus cuentas\n• Enséñales gradualmente sobre seguridad digital\n• Considera establecer límites en sus tarjetas\n• Mantén comunicación regular sobre sus actividades en línea`
    }
  ];

  const toggleFAQ = (faqId) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-secondary mb-4">
            Preguntas Frecuentes
          </h2>
          <p className="text-lg text-text-secondary">
            Respuestas a las dudas más comunes sobre seguridad digital y prevención de fraudes
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqData?.map((faq) => {
            const isExpanded = expandedFAQ === faq?.id;
            
            return (
              <div key={faq?.id} className="bg-surface border border-border rounded-lg shadow-soft overflow-hidden">
                <button
                  onClick={() => toggleFAQ(faq?.id)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-muted/50 transition-smooth"
                >
                  <h3 className="text-lg font-medium text-secondary pr-4">
                    {faq?.question}
                  </h3>
                  <div className={`flex-shrink-0 transform transition-transform duration-200 ${
                    isExpanded ? 'rotate-180' : ''
                  }`}>
                    <Icon name="ChevronDown" size={24} color="var(--color-primary)" />
                  </div>
                </button>
                {isExpanded && (
                  <div className="px-6 pb-6 border-t border-border">
                    <div className="pt-4">
                      <div className="prose prose-sm max-w-none">
                        {faq?.answer?.split('\n')?.map((line, index) => (
                          <p key={index} className={`text-text-secondary leading-relaxed ${
                            line?.startsWith('•') ? 'ml-4 mb-1' : 'mb-3'
                          }`}>
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact Support */}
        <div className="mt-12 text-center">
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
            <Icon name="MessageCircle" size={32} color="var(--color-primary)" className="mx-auto mb-4" />
            <h3 className="text-xl font-heading font-semibold text-secondary mb-2">
              ¿Tienes más preguntas?
            </h3>
            <p className="text-text-secondary mb-4">
              Nuestro equipo de expertos está disponible para ayudarte con cualquier duda sobre seguridad digital.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="mailto:soporte@cybersafety.co"
                className="inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-button hover:bg-primary/90 transition-micro"
              >
                <Icon name="Mail" size={16} className="mr-2" />
                soporte@cybersafety.co
              </a>
              <a
                href="tel:+5716012345"
                className="inline-flex items-center justify-center px-4 py-2 bg-success text-success-foreground rounded-button hover:bg-success/90 transition-micro"
              >
                <Icon name="Phone" size={16} className="mr-2" />
                (601) 234-5678
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveFAQSection;