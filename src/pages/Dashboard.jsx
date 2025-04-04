import { useEffect, useState } from "react";
import { publicApi } from "../services/api";
import { useParams } from "react-router-dom";
import useAuthStore from "../hooks/authStore";
import Hearder from "../components/Common/Hearder";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [products, setProducts] = useState(null);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const { user } = useAuthStore();
  console.log(user.nom_cli);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await publicApi.get(`users/dashboard/${id}`);

        console.log(res.data);
        setData(res.data);
      } catch (error) {
        setError(error.message);
        console.error("Erreur lors de la récupération des données:", error);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (error) {
    return <div className="text-red-500">Erreur: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Hearder />

      <div className="flex-grow container max-w-full bg-[#60a5fa] mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Panneau de gauche */}
          <div className="">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-4 text-white shadow-lg">
              <h2 className="text-xl font-bold">Administration</h2>
            </div>

            <div className="bg-white p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <img
                    src={
                      data?.logo_vendeur?.startsWith("http")
                        ? data?.logo_vendeur
                        : `${import.meta.env.VITE_API_URL}${data?.logo_vendeur}`
                    }
                    alt="Logo Vendeur"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {data?.nom_cli}
                  </h3>
                  <p className="text-gray-600">Vendeur</p>
                </div>
              </div>
            </div>

            <div className="grid grid-rows-3">
              <div className="bg-white p-6 shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold mb-2">Statistiques</h3>
                {/* Contenu statistiques */}
              </div>

              <div className="bg-white p-6 shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold mb-2">
                  Activités récentes
                </h3>
                {/* Contenu activités */}
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold mb-2">Performance</h3>
                {/* Contenu performance */}
              </div>
            </div>
          </div>

          {/* Panneau de droite */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Tableau de bord
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="text-blue-600 font-semibold">
                    Métrique {item}
                  </div>
                  <div className="text-2xl font-bold mt-2">0</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold mb-2">Graphique 1</h3>
                {/* Contenu graphique */}
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold mb-2">Graphique 2</h3>
                {/* Contenu graphique */}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-lg font-semibold mb-2">Section {item}</h3>
                  {/* Contenu section */}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
