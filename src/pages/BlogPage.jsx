import { motion } from "framer-motion";
import Header from "../components/Common/Hearder";
import Footer from "../components/Common/Footer";

const BlogPage = () => {
  const blogPosts = [
    {
      titre: "Les Smartphones en 2024 : Tendances et Innovations",
      date: "20 Mars 2024",
      description:
        "Explorez les dernières innovations en matière de smartphones : processeurs plus puissants, écrans pliables, et technologies d&apos;IA embarquées pour une expérience utilisateur révolutionnaire...",
      categorie: "Technologie",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02ff9?q=80&w=1480&auto=format&fit=crop"
    },
    {
      titre: "Guide d&apos;achat : Comment choisir son prochain smartphone?",
      date: "15 Mars 2024",
      description:
        "Découvrez nos conseils d&apos;experts pour choisir le smartphone qui correspond parfaitement à vos besoins et votre budget. Critères essentiels et erreurs à éviter...",
      categorie: "Guide d&apos;achat",
      image: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1481&auto=format&fit=crop"
    },
    {
      titre: "Les meilleurs accessoires pour protéger votre téléphone",
      date: "10 Mars 2024",
      description:
        "Protégez votre investissement avec notre sélection des meilleures coques, protections d&apos;écran et autres accessoires indispensables pour votre smartphone...",
      categorie: "Accessoires",
      image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?q=80&w=1567&auto=format&fit=crop"
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      {/* Hero Section modernisé */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 py-20"
      >
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
            Notre Blog
          </h1>
          <p className="text-xl text-blue-100 backdrop-blur-sm">
            Découvrez nos derniers articles et actualités
          </p>
        </div>
      </motion.div>

      {/* Articles Grid avec animations */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {blogPosts.map((post, index) => (
            <motion.article
              key={index}
              variants={cardVariants}
              whileHover={{ scale: 1.03 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 backdrop-blur-md bg-white/90"
            >
              <div className="relative overflow-hidden">
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  src={post.image}
                  alt={post.titre}
                  className="w-full h-56 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-8">
                <span className="px-4 py-1 bg-indigo-100 text-indigo-600 rounded-full text-sm font-semibold">
                  {post.categorie}
                </span>
                <h2 className="text-2xl font-bold mt-4 mb-3 text-gray-800">
                  {post.titre}
                </h2>
                <p className="text-gray-600 mb-6 line-clamp-3">
                  {post.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">{post.date}</span>
                  <motion.button
                    whileHover={{ x: 5 }}
                    className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-2"
                  >
                    Lire plus
                    <span className="transform transition-transform">→</span>
                  </motion.button>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default BlogPage;
