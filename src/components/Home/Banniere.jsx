import { useState, useEffect } from 'react';
import apInstance from '../../services/api';
import { publicApi } from '../../services/api';

const Banniere = () => {
  const [banniere, setBanniere] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchBanniere = async () => {
      try {
        const response = await publicApi.get("/home/banner");
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
            {banniere.map(({ image, title }, index) => (
              <div key={index} className="w-full flex-shrink-0 bg-gray-900 text-white">
                <img
                  src={image}
                  alt={title || 'Bannière'}
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute bottom-0 left-0 p-5 text-xl bg-black bg-opacity-50">
                  <p>{title}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Chargement...</p>
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
