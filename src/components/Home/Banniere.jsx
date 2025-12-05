import { useState, useEffect } from 'react';
import { publicApi } from '../../services/api';

const Banniere = () => {
  const [banniere, setBanniere] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchBanniere = async () => {
      try {
        const response = await publicApi.get("/home/banner");
        console.log("Bannières reçues:", response.data);
        setBanniere(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération de la bannière :", error);
      }
    };

    fetchBanniere();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banniere.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + banniere.length) % banniere.length);
  };

  return (
    <div className="relative">
      <section className="relative overflow-hidden">
        {banniere.length > 0 ? (
          <div
            className="flex transition-transform duration-1000 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {banniere.map((banner, index) => (
              <div key={index} className="w-full flex-shrink-0 bg-gray-900 text-white relative">
                <img
                  src={banner.image}
                  alt={banner.title || 'Bannière'}
                  className="w-full h-[400px] object-cover"
                  onError={(e) => {
                    console.error("Erreur chargement image:", banner.image);
                    e.target.style.display = 'none';
                  }}
                />
                {banner.title && (
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-xl bg-black bg-opacity-50">
                    <p>{banner.title}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-[400px] bg-gray-100">
            <p className="text-gray-500">Chargement des bannières...</p>
          </div>
        )}
      </section>

      {/* Contrôles de navigation */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-0 transform -translate-y-1/2 px-4 py-2 bg-gray-800 text-white rounded-full hover:bg-gray-700"
      >
        &#60;
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-0 transform -translate-y-1/2 px-4 py-2 bg-gray-800 text-white rounded-full hover:bg-gray-700"
      >
        &#62;
      </button>
    </div>
  );
}

export default Banniere;
