import Header from "../components/Common/Hearder";
import Footer from "../components/Common/Footer";
import { useTranslation } from "react-i18next";

const AboutPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-16 relative">
          {t("about.title")}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-red-500 mt-4"></div>
        </h1>

        <section className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-transform duration-300">
            <h2 className="text-2xl font-semibold text-red-700 mb-4">
              {t("about.mission.title")}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {t("about.mission.description")}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-transform duration-300">
            <h2 className="text-2xl font-semibold text-red-700 mb-4">
              {t("about.values.title")}
            </h2>
            <ul className="space-y-3">
              {t("about.values.items", { returnObjects: true })?.map((value: string, index: number) => (
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
            {t("about.expertise.title")}
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <p className="text-gray-600 leading-relaxed">
              {t("about.expertise.description")}
            </p>
            <div className="bg-red-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-red-700 mb-2">
                {t("about.expertise.servicesTitle")}
              </h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                {t("about.expertise.services", { returnObjects: true })?.map((service: string, index: number) => (
                  <li key={index}>{service}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <div className="text-center">
          <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-full transition-colors duration-300 shadow-lg hover:shadow-xl">
            {t("about.contactUs")}
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutPage;
