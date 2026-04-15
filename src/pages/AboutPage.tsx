import Header from "../components/Common/Hearder";
import Footer from "../components/Common/Footer";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-blue-800 mb-16 relative">
          Notre Excellence Technologique
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-red-500 mt-4"></div>
        </h1>

        <section className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-transform duration-300">
            <h2 className="text-2xl font-semibold text-red-700 mb-4">
              Notre Mission
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Nous nous engageons à proposer les meilleurs smartphones et accessoires 
              du marché, avec un service client exceptionnel et des conseils d&apos;experts 
              pour vous accompagner dans votre expérience technologique.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-transform duration-300">
            <h2 className="text-2xl font-semibold text-red-700 mb-4">
              Nos Valeurs
            </h2>
            <ul className="space-y-3">
              {[
                "Innovation et qualité",
                "Satisfaction client garantie",
                "Prix compétitifs",
                "Service après-vente réactif",
              ].map((value, index) => (
                <li key={index} className="flex items-center text-gray-600">
                  <svg
                    className="w-5 h-5 text-red-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {value}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <h2 className="text-2xl font-semibold text-red-700 mb-4">
            Notre Expertise
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <p className="text-gray-600 leading-relaxed">
              Notre équipe de spécialistes suit en permanence les dernières 
              tendances technologiques pour vous offrir les produits les plus 
              innovants et performants du marché, avec des conseils personnalisés.
            </p>
            <div className="bg-blue-100 rounded-lg p-6">
              <h3 className="text-lg font-medium text-blue-800 mb-2">
                Nos Services Premium
              </h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Protection d&apos;écran offerte à l&apos;achat</li>
                <li>Garantie étendue disponible</li>
                <li>Configuration personnalisée de votre appareil</li>
                <li>Programme de fidélité avantageux</li>
              </ul>
            </div>
          </div>
        </section>

        <div className="text-center">
          <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-full transition-colors duration-300 shadow-lg hover:shadow-xl">
            Contactez-nous
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutPage;
