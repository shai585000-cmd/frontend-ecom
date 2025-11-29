import { Link } from 'react-router-dom';
import { FaFacebook, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { FaInstagram, FaXTwitter } from "react-icons/fa6";
import { Mail, Phone, MapPin, CreditCard, Truck, ShieldCheck, Headphones } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Section avantages */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500/10 rounded-full">
                <Truck className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="font-medium text-white">Livraison rapide</p>
                <p className="text-sm text-gray-400">Partout en Afrique</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500/10 rounded-full">
                <ShieldCheck className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="font-medium text-white">Paiement securise</p>
                <p className="text-sm text-gray-400">100% securise</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500/10 rounded-full">
                <CreditCard className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="font-medium text-white">Mobile Money</p>
                <p className="text-sm text-gray-400">MTN, Orange, Wave</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500/10 rounded-full">
                <Headphones className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="font-medium text-white">Support 24/7</p>
                <p className="text-sm text-gray-400">A votre ecoute</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section principale */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span className="text-2xl font-bold">
                <span className="text-green-500">IVOIRE</span> MARKET
              </span>
            </Link>
            <p className="text-gray-400 mb-6">
              Votre marketplace de confiance pour des produits de qualite. 
              Achetez en toute securite avec livraison rapide.
            </p>
            {/* Reseaux sociaux */}
            <div className="flex gap-3">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-full hover:bg-green-500 transition-colors"
              >
                <FaFacebook size={20} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-full hover:bg-green-500 transition-colors"
              >
                <FaInstagram size={20} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-full hover:bg-green-500 transition-colors"
              >
                <FaXTwitter size={20} />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-full hover:bg-green-500 transition-colors"
              >
                <FaLinkedin size={20} />
              </a>
              <a 
                href="https://wa.me/22507XXXXXXXX" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-full hover:bg-green-500 transition-colors"
              >
                <FaWhatsapp size={20} />
              </a>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="text-white font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="hover:text-green-500 transition-colors">Accueil</Link>
              </li>
              <li>
                <Link to="/produit" className="hover:text-green-500 transition-colors">Catalogue</Link>
              </li>
              <li>
                <Link to="/a-propos" className="hover:text-green-500 transition-colors">A propos</Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-green-500 transition-colors">Blog</Link>
              </li>
              <li>
                <Link to="/actualites" className="hover:text-green-500 transition-colors">Actualites</Link>
              </li>
            </ul>
          </div>

          {/* Mon compte */}
          <div>
            <h3 className="text-white font-semibold mb-4">Mon compte</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/login" className="hover:text-green-500 transition-colors">Connexion</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-green-500 transition-colors">Inscription</Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-green-500 transition-colors">Mes commandes</Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-green-500 transition-colors">Mon panier</Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-green-500 transition-colors">Mon profil</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Abidjan, Cocody<br />Cote d Ivoire</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-green-500 flex-shrink-0" />
                <a href="tel:+22507XXXXXXXX" className="hover:text-green-500 transition-colors">
                  +225 07 XX XX XX XX
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-green-500 flex-shrink-0" />
                <a href="mailto:contact@ivoiremarket.com" className="hover:text-green-500 transition-colors">
                  contact@ivoiremarket.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              {currentYear} IVOIRE MARKET. Tous droits reserves.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">
                Conditions generales
              </a>
              <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">
                Politique de confidentialite
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
