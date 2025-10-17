import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const FeedbackSection = () => {
  const [feedback, setFeedback] = useState({
    name: '',
    email: '',
    experienceType: '',
    rating: '',
    comments: '',
    wouldRecommend: '',
    improvements: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const experienceOptions = [
  { value: 'simulation', label: 'Completé la simulación de fraude' },
  { value: 'education', label: 'Solo revisé el contenido educativo' },
  { value: 'both', label: 'Ambos: simulación y educación' },
  { value: 'other', label: 'Otro' }];


  const ratingOptions = [
  { value: '5', label: '⭐⭐⭐⭐⭐ Excelente' },
  { value: '4', label: '⭐⭐⭐⭐ Muy bueno' },
  { value: '3', label: '⭐⭐⭐ Bueno' },
  { value: '2', label: '⭐⭐ Regular' },
  { value: '1', label: '⭐ Necesita mejorar' }];


  const recommendOptions = [
  { value: 'definitely', label: 'Definitivamente sí' },
  { value: 'probably', label: 'Probablemente sí' },
  { value: 'maybe', label: 'Tal vez' },
  { value: 'probably-not', label: 'Probablemente no' },
  { value: 'definitely-not', label: 'Definitivamente no' }];


  const handleInputChange = (field, value) => {
    setFeedback((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log('Feedback submitted:', feedback);
    setSubmitted(true);
    setIsSubmitting(false);
  };

  const testimonials = [
  {
    id: 1,
    name: "María Elena Rodríguez",
    age: "67 años",
    location: "Bogotá",
    avatar: "https://images.unsplash.com/photo-1616286608358-0e1b143f7d2f",
    avatarAlt: "Elderly Hispanic woman with gray hair and warm smile wearing blue cardigan",
    rating: 5,
    comment: "Esta plataforma me abrió los ojos. Casi caigo en una estafa similar hace un mes. Ahora sé exactamente qué buscar y cómo protegerme. Se lo recomiendo a todos mis amigos.",
    experience: "Simulación completa"
  },
  {
    id: 2,
    name: "Carlos Mendoza",
    age: "72 años",
    location: "Medellín",
    avatar: "https://images.unsplash.com/photo-1698465281093-9f09159733b9",
    avatarAlt: "Senior Hispanic man with white mustache and glasses wearing light blue shirt",
    rating: 5,
    comment: "Excelente herramienta educativa. Los videos son muy claros y las guías descargables me han servido mucho. Mi familia también las está usando.",
    experience: "Contenido educativo"
  },
  {
    id: 3,
    name: "Ana Lucía Vargas",
    age: "58 años",
    location: "Cali",
    avatar: "https://images.unsplash.com/photo-1714207427861-9b411beca97e",
    avatarAlt: "Middle-aged Hispanic woman with shoulder-length brown hair smiling confidently",
    rating: 4,
    comment: "Me gustó mucho la simulación, se sintió muy real. Ahora entiendo cómo funcionan estas estafas y puedo enseñarle a mi madre a protegerse también.",
    experience: "Simulación y educación"
  }];


  if (submitted) {
    return (
      <section className="py-16 bg-success/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-surface border border-success/20 rounded-xl p-8 shadow-soft">
            <Icon name="CheckCircle" size={64} color="var(--color-success)" className="mx-auto mb-4" />
            <h2 className="text-2xl font-heading font-bold text-secondary mb-3">
              ¡Gracias por tu Retroalimentación!
            </h2>
            <p className="text-text-secondary mb-6">
              Tu opinión es muy valiosa para nosotros. Nos ayuda a mejorar continuamente 
              nuestra plataforma educativa y proteger a más personas del fraude digital.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSubmitted(false);
                setFeedback({
                  name: '',
                  email: '',
                  experienceType: '',
                  rating: '',
                  comments: '',
                  wouldRecommend: '',
                  improvements: ''
                });
              }}>

              Enviar Otra Opinión
            </Button>
          </div>
        </div>
      </section>);

  }

  return (
    <section className="py-16 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-secondary mb-4">
            Comparte tu Experiencia
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            Tu opinión nos ayuda a mejorar y a proteger a más personas. 
            Cuéntanos qué te pareció la plataforma y cómo podemos hacerla mejor.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Feedback Form */}
          <div className="bg-card border border-border rounded-xl p-8 shadow-soft">
            <h3 className="text-xl font-heading font-semibold text-secondary mb-6 flex items-center">
              <Icon name="MessageSquare" size={24} className="mr-2" />
              Tu Opinión
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Nombre completo"
                  type="text"
                  placeholder="Tu nombre"
                  value={feedback?.name}
                  onChange={(e) => handleInputChange('name', e?.target?.value)}
                  required />

                
                <Input
                  label="Correo electrónico"
                  type="email"
                  placeholder="tu@email.com"
                  value={feedback?.email}
                  onChange={(e) => handleInputChange('email', e?.target?.value)}
                  required />

              </div>

              <Select
                label="¿Qué experiencia tuviste?"
                options={experienceOptions}
                value={feedback?.experienceType}
                onChange={(value) => handleInputChange('experienceType', value)}
                placeholder="Selecciona tu experiencia"
                required />


              <Select
                label="¿Cómo calificarías tu experiencia?"
                options={ratingOptions}
                value={feedback?.rating}
                onChange={(value) => handleInputChange('rating', value)}
                placeholder="Selecciona una calificación"
                required />


              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Comentarios sobre tu experiencia
                </label>
                <textarea
                  value={feedback?.comments}
                  onChange={(e) => handleInputChange('comments', e?.target?.value)}
                  placeholder="Cuéntanos qué te pareció, qué aprendiste, o cualquier comentario que quieras compartir..."
                  rows={4}
                  className="w-full px-3 py-2 border border-border rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  required />

              </div>

              <Select
                label="¿Recomendarías esta plataforma a otros?"
                options={recommendOptions}
                value={feedback?.wouldRecommend}
                onChange={(value) => handleInputChange('wouldRecommend', value)}
                placeholder="Selecciona una opción"
                required />


              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  ¿Qué podríamos mejorar? (Opcional)
                </label>
                <textarea
                  value={feedback?.improvements}
                  onChange={(e) => handleInputChange('improvements', e?.target?.value)}
                  placeholder="Sugerencias para mejorar la plataforma, contenido adicional que te gustaría ver, etc."
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none" />

              </div>

              <Button
                type="submit"
                variant="default"
                size="lg"
                fullWidth
                loading={isSubmitting}
                iconName="Send"
                iconPosition="left">

                {isSubmitting ? 'Enviando...' : 'Enviar Retroalimentación'}
              </Button>
            </form>
          </div>

          {/* Testimonials */}
          <div>
            <h3 className="text-xl font-heading font-semibold text-secondary mb-6 flex items-center">
              <Icon name="Users" size={24} className="mr-2" />
              Lo que Dicen Otros Usuarios
            </h3>

            <div className="space-y-6">
              {testimonials?.map((testimonial) =>
              <div key={testimonial?.id} className="bg-muted/50 border border-border rounded-lg p-6">
                  <div className="flex items-start space-x-4">
                    <img
                    src={testimonial?.avatar}
                    alt={testimonial?.avatarAlt}
                    className="w-12 h-12 rounded-full object-cover" />

                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-secondary">
                            {testimonial?.name}
                          </h4>
                          <p className="text-sm text-text-secondary">
                            {testimonial?.age} • {testimonial?.location}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          {[...Array(testimonial?.rating)]?.map((_, i) =>
                        <Icon key={i} name="Star" size={16} color="var(--color-warning)" />
                        )}
                        </div>
                      </div>
                      
                      <p className="text-text-secondary text-sm leading-relaxed mb-2">
                        "{testimonial?.comment}"
                      </p>
                      
                      <div className="text-xs text-text-secondary">
                        Experiencia: {testimonial?.experience}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="mt-8 bg-primary/10 border border-primary/20 rounded-lg p-6">
              <h4 className="font-medium text-secondary mb-4">Estadísticas de Satisfacción</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">4.8/5</div>
                  <div className="text-sm text-text-secondary">Calificación promedio</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">94%</div>
                  <div className="text-sm text-text-secondary">Recomendarían</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>);

};

export default FeedbackSection;