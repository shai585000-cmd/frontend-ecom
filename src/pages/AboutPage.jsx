import React from "react";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-green-800 mb-16 relative">
          Notre Vision de l'Agriculture Durable
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-green-500 mt-4"></div>
        </h1>

        <section className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-transform duration-300">
            <h2 className="text-2xl font-semibold text-green-700 mb-4">
              Notre Mission
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Nous nous engageons à promouvoir une agriculture responsable et
              durable, en harmonie avec la nature et les besoins des
              agriculteurs modernes.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-transform duration-300">
            <h2 className="text-2xl font-semibold text-green-700 mb-4">
              Nos Valeurs
            </h2>
            <ul className="space-y-3">
              {[
                "Respect de l'environnement",
                "Innovation agricole",
                "Soutien aux agriculteurs locaux",
                "Qualité et traçabilité des produits",
              ].map((value, index) => (
                <li key={index} className="flex items-center text-gray-600">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
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
          <h2 className="text-2xl font-semibold text-green-700 mb-4">
            Notre Approche
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <p className="text-gray-600 leading-relaxed">
              Nous combinons les pratiques agricoles traditionnelles avec les
              technologies modernes pour optimiser la production tout en
              préservant les ressources naturelles.
            </p>
            <div className="bg-green-100 rounded-lg p-6">
              <h3 className="text-lg font-medium text-green-800 mb-2">
                Nos Innovations
              </h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Agriculture de précision</li>
                <li>Systèmes d'irrigation intelligents</li>
                <li>Monitoring des cultures par drone</li>
                <li>Solutions de traçabilité blockchain</li>
              </ul>
            </div>
          </div>
        </section>

        <div className="text-center">
          <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-full transition-colors duration-300 shadow-lg hover:shadow-xl">
            Contactez-nous
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
