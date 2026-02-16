import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Common/Hearder';
import Footer from '../components/Common/Footer';
import { getCurrentUser, updateProfile, changePassword } from '../services/userService';
import { getOrders } from '../services/orderService';
import { getMyReviews } from '../services/reviewService';
import useAuthStore from '../hooks/authStore';
import { motion } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, Building, Lock, 
  ShoppingBag, Star, Edit2, Save, X, Eye, EyeOff,
  Package, Calendar, ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const UserProfilePage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    nom_cli: '',
    email: '',
    numero_cli: '',
    adresse_cli: '',
    ville_cli: '',
    code_postal_cli: '',
    pays_cli: ''
  });
  
  // Password form states
  const [passwordForm, setPasswordForm] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  });
  const [changingPassword, setChangingPassword] = useState(false);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [userData, ordersData, reviewsData] = await Promise.all([
        getCurrentUser(),
        getOrders().catch(() => []),
        getMyReviews().catch(() => [])
      ]);
      
      setUser(userData);
      setFormData({
        nom_cli: userData.nom_cli || '',
        email: userData.email || '',
        numero_cli: userData.numero_cli || '',
        adresse_cli: userData.adresse_cli || '',
        ville_cli: userData.ville_cli || '',
        code_postal_cli: userData.code_postal_cli || '',
        pays_cli: userData.pays_cli || ''
      });
      setOrders(ordersData.slice(0, 5)); // Dernieres 5 commandes
      setReviews(reviewsData);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement du profil');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await updateProfile(formData);
      toast.success('Profil mis a jour avec succes');
      setIsEditing(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erreur lors de la mise a jour');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    
    if (passwordForm.new_password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caracteres');
      return;
    }

    setChangingPassword(true);
    try {
      await changePassword(passwordForm);
      toast.success('Mot de passe modifie avec succes');
      setPasswordForm({ old_password: '', new_password: '', confirm_password: '' });
    } catch (error) {
      toast.error(error.response?.data?.old_password?.[0] || 'Erreur lors du changement');
    } finally {
      setChangingPassword(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'En attente',
      confirmed: 'Confirmee',
      processing: 'En traitement',
      shipped: 'Expediee',
      delivered: 'Livree',
      cancelled: 'Annulee',
    };
    return labels[status] || status;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <User size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Connexion requise</h2>
          <p className="text-gray-600 mb-6">Connectez-vous pour acceder a votre profil</p>
          <Link
            to="/login"
            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Se connecter
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* En-tete du profil */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-4 sm:p-8 mb-6 sm:mb-8 text-white"
        >
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-14 h-14 sm:w-20 sm:h-20 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <User size={28} className="sm:hidden" />
              <User size={40} className="hidden sm:block" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-3xl font-bold truncate">{user?.nom_cli || user?.username}</h1>
              <p className="text-indigo-200 text-sm sm:text-base truncate">{user?.email}</p>
              <p className="text-xs sm:text-sm text-indigo-200 mt-1">
                Membre depuis {new Date(user?.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Navigation par onglets */}
        <div className="grid grid-cols-4 gap-1 sm:flex sm:gap-2 mb-6">
          {[
            { id: 'profile', label: 'Profil', labelFull: 'Mon profil', icon: User },
            { id: 'security', label: 'Securite', labelFull: 'Securite', icon: Lock },
            { id: 'orders', label: 'Commandes', labelFull: 'Commandes', icon: ShoppingBag },
            { id: 'reviews', label: 'Avis', labelFull: 'Mes avis', icon: Star },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-2 rounded-lg font-medium transition-all text-xs sm:text-base ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon size={18} className="sm:w-[18px] sm:h-[18px]" />
              <span className="sm:hidden">{tab.label}</span>
              <span className="hidden sm:inline">{tab.labelFull}</span>
            </button>
          ))}
        </div>

        {/* Contenu des onglets */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Onglet Profil */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">Informations personnelles</h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-sm sm:text-base"
                  >
                    <Edit2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                    Modifier
                  </button>
                ) : (
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base"
                    >
                      <X size={16} />
                      <span className="hidden sm:inline">Annuler</span>
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 text-sm sm:text-base"
                    >
                      <Save size={16} />
                      {saving ? 'Sauvegarde...' : 'Enregistrer'}
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nom complet */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <User size={16} />
                    Nom complet
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="nom_cli"
                      value={formData.nom_cli}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">
                      {user?.nom_cli || '-'}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Mail size={16} />
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">
                      {user?.email || '-'}
                    </p>
                  )}
                </div>

                {/* Telephone */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Phone size={16} />
                    Telephone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="numero_cli"
                      value={formData.numero_cli}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">
                      {user?.numero_cli || '-'}
                    </p>
                  )}
                </div>

                {/* Ville */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Building size={16} />
                    Ville
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="ville_cli"
                      value={formData.ville_cli}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">
                      {user?.ville_cli || '-'}
                    </p>
                  )}
                </div>

                {/* Adresse */}
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <MapPin size={16} />
                    Adresse complete
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="adresse_cli"
                      value={formData.adresse_cli}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">
                      {user?.adresse_cli || '-'}
                    </p>
                  )}
                </div>

                {/* Code postal */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <MapPin size={16} />
                    Code postal
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="code_postal_cli"
                      value={formData.code_postal_cli}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">
                      {user?.code_postal_cli || '-'}
                    </p>
                  )}
                </div>

                {/* Pays */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <MapPin size={16} />
                    Pays
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="pays_cli"
                      value={formData.pays_cli}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">
                      {user?.pays_cli || '-'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Onglet Securite */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Changer le mot de passe</h2>
              
              <form onSubmit={handleChangePassword} className="max-w-md space-y-4">
                {/* Mot de passe actuel */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe actuel
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.old ? 'text' : 'password'}
                      name="old_password"
                      value={passwordForm.old_password}
                      onChange={handlePasswordChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(p => ({ ...p, old: !p.old }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showPasswords.old ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Nouveau mot de passe */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      name="new_password"
                      value={passwordForm.new_password}
                      onChange={handlePasswordChange}
                      required
                      minLength={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(p => ({ ...p, new: !p.new }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Minimum 6 caracteres</p>
                </div>

                {/* Confirmer le mot de passe */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      name="confirm_password"
                      value={passwordForm.confirm_password}
                      onChange={handlePasswordChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(p => ({ ...p, confirm: !p.confirm }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={changingPassword}
                  className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {changingPassword ? 'Modification en cours...' : 'Changer le mot de passe'}
                </button>
              </form>
            </div>
          )}

          {/* Onglet Commandes */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Mes commandes recentes</h2>
                <Link
                  to="/orders"
                  className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                >
                  Voir tout
                  <ChevronRight size={18} />
                </Link>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">Aucune commande pour le moment</p>
                  <Link
                    to="/produit"
                    className="inline-block mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Decouvrir nos produits
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Link
                      key={order.id}
                      to={`/orders/${order.id}`}
                      className="block p-4 border border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50/30 transition-all"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-800">
                            Commande #{order.id}
                          </p>
                          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <Calendar size={14} />
                            {new Date(order.created_at).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {getStatusLabel(order.status)}
                          </span>
                          <p className="mt-2 font-bold text-gray-800">
                            {parseFloat(order.total_amount).toLocaleString()} Fcfa
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Onglet Avis */}
          {activeTab === 'reviews' && (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Mes avis</h2>

              {reviews.length === 0 ? (
                <div className="text-center py-12">
                  <Star size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">Vous n&apos;avez pas encore laisse d&apos;avis</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Partagez votre experience apres avoir achete un produit
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="p-4 border border-gray-200 rounded-xl"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-800">
                            {review.product?.name || 'Produit'}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      {review.title && (
                        <p className="font-medium text-gray-700">{review.title}</p>
                      )}
                      <p className="text-gray-600 mt-1">{review.comment}</p>
                      {review.is_verified_purchase && (
                        <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                          Achat verifie
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default UserProfilePage;
