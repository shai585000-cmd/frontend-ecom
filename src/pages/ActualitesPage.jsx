import Header from '../components/Common/Hearder';
import Footer from '../components/Common/Footer';

const ActualitesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Actualités</h1>
        <p className="text-gray-600">Page des actualités en construction...</p>
      </div>
      <Footer />
    </div>
  );
};

export default ActualitesPage;