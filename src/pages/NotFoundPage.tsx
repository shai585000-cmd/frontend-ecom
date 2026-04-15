import { Link } from 'react-router-dom';
import { Home, Search, ShoppingBag } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Illustration 404 */}
        <div className="mb-8">
          <h1 className="text-[150px] md:text-[200px] font-bold text-blue-200 leading-none">
            404
          </h1>
        </div>

        {/* Message principal */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Page non trouvee
          </h2>
          <p className="text-lg text-gray-600 mb-2">
            Oups! La page que vous cherchez n&apos;existe pas ou a ete deplacee.
          </p>
          <p className="text-gray-500">
            Verifiez l&apos;URL ou retournez a l&apos;accueil pour continuer vos achats.
          </p>
        </div>

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg"
          >
            <Home size={20} />
            Retour a l&apos;accueil
          </Link>

          <Link
            to="/produit"
            className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-lg border-2 border-gray-200 transition-all transform hover:scale-105"
          >
            <ShoppingBag size={20} />
            Voir les produits
          </Link>
        </div>

        {/* Suggestions */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4 flex items-center justify-center gap-2">
            <Search size={16} />
            Pages populaires
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              to="/"
              className="px-4 py-2 bg-white rounded-full text-sm text-gray-600 hover:text-red-500 hover:bg-blue-50 transition-colors border border-gray-200"
            >
              Accueil
            </Link>
            <Link
              to="/produit"
              className="px-4 py-2 bg-white rounded-full text-sm text-gray-600 hover:text-red-500 hover:bg-blue-50 transition-colors border border-gray-200"
            >
              Catalogue
            </Link>
            <Link
              to="/cart"
              className="px-4 py-2 bg-white rounded-full text-sm text-gray-600 hover:text-red-500 hover:bg-blue-50 transition-colors border border-gray-200"
            >
              Panier
            </Link>
            <Link
              to="/a-propos"
              className="px-4 py-2 bg-white rounded-full text-sm text-gray-600 hover:text-red-500 hover:bg-blue-50 transition-colors border border-gray-200"
            >
              A propos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
