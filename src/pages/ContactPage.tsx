import { useState, type FormEvent, type ChangeEvent } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from 'lucide-react';
import Header from '../components/Common/Hearder';
import Footer from '../components/Common/Footer';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const ContactPage = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!form.name || !form.email || !form.message) {
      toast.error(t('contact.errors.required'));
      return;
    }

    setLoading(true);
    
    // Simuler l'envoi (à remplacer par un vrai appel API)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(t('contact.success'));
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      toast.error(t('contact.errors.failed'));
    } finally {
      setLoading(false);
    }
  };

  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "2250170629746";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(t('contact.whatsappMessage'))}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{t('contact.title')}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">{t('contact.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informations de contact */}
          <div className="lg:col-span-1 space-y-6">
            {/* Carte infos */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">{t('contact.info.title')}</h2>
              
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-red-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{t('contact.info.address')}</h3>
                    <p className="text-gray-600 text-sm">Abidjan, Côte d'Ivoire<br />Cocody, Riviera Palmeraie</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="text-red-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{t('contact.info.phone')}</h3>
                    <p className="text-gray-600 text-sm">+225 01 70 62 97 46</p>
                    <p className="text-gray-600 text-sm">+225 07 07 07 07 07</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="text-red-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{t('contact.info.email')}</h3>
                    <p className="text-gray-600 text-sm">contact@votresite.com</p>
                    <p className="text-gray-600 text-sm">support@votresite.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="text-red-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{t('contact.info.hours')}</h3>
                    <p className="text-gray-600 text-sm">{t('contact.info.weekdays')}: 8h - 18h</p>
                    <p className="text-gray-600 text-sm">{t('contact.info.saturday')}: 9h - 15h</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bouton WhatsApp */}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors"
            >
              <MessageCircle size={24} />
              {t('contact.whatsapp')}
            </a>
          </div>

          {/* Formulaire */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">{t('contact.form.title')}</h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.form.name')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                      placeholder={t('contact.form.namePlaceholder')}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.form.email')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                      placeholder={t('contact.form.emailPlaceholder')}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.form.phone')}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                      placeholder={t('contact.form.phonePlaceholder')}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.form.subject')}
                    </label>
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                    >
                      <option value="">{t('contact.form.subjectPlaceholder')}</option>
                      <option value="order">{t('contact.form.subjects.order')}</option>
                      <option value="product">{t('contact.form.subjects.product')}</option>
                      <option value="delivery">{t('contact.form.subjects.delivery')}</option>
                      <option value="return">{t('contact.form.subjects.return')}</option>
                      <option value="other">{t('contact.form.subjects.other')}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('contact.form.message')} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all resize-none"
                    placeholder={t('contact.form.messagePlaceholder')}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send size={20} />
                      {t('contact.form.submit')}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Carte Google Maps */}
        <div className="mt-12">
          <div className="bg-white rounded-2xl shadow-sm p-4 overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3972.0!2d-3.9!3d5.35!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNcKwMjEnMDAuMCJOIDPCsDU0JzAwLjAiVw!5e0!3m2!1sfr!2sci!4v1600000000000!5m2!1sfr!2sci"
              width="100%"
              height="350"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-xl"
              title="Localisation"
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactPage;
