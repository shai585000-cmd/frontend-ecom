import React, { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';

type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

interface UserProfile {
  nom_cli?: string;
  username?: string;
  email?: string;
  numero_cli?: string;
  adresse_cli?: string;
  ville_cli?: string;
  code_postal_cli?: string;
  pays_cli?: string;
  created_at?: string;
}

interface Order {
  id: number;
  created_at: string;
  status: OrderStatus;
  total_amount: string | number;
}

interface Review {
  id: number;
  product?: { name?: string };
  rating: number;
  title?: string;
  comment?: string;
  created_at: string;
  is_verified_purchase?: boolean;
}

import { Link } from 'react-router-dom';
import Header from '../components/Common/Hearder';
import Footer from '../components/Common/Footer';
import { getCurrentUser, updateProfile, changePassword } from '../services/userService';
import { useTranslation } from 'react-i18next';
import { getOrders } from '../services/orderService';
import { getMyReviews } from '../services/reviewService';
import useAuthStore from '../hooks/authStore';
import {
  User, Mail, Phone, MapPin, Building,
  ShoppingBag, Star, Edit2, Save, X, Eye, EyeOff,
  Package, Calendar, ChevronRight, Shield, ClipboardList,
  MessageSquare, Home
} from 'lucide-react';
import toast from 'react-hot-toast';
import logger from '../utils/logger';

const UserProfilePage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    nom_cli: '',
    email: '',
    numero_cli: '',
    adresse_cli: '',
    ville_cli: '',
    code_postal_cli: '',
    pays_cli: ''
  });

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
      setOrders(ordersData.slice(0, 5));
      setReviews(reviewsData);
    } catch (error) {
      logger.error('Erreur:', error);
      toast.error('Erreur lors du chargement du profil');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await updateProfile(formData);
      toast.success(t('profile.updateSuccess'));
      setIsEditing(false);
      fetchData();
    } catch (error) {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err.response?.data?.error || t('profile.updateError'));
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      toast.error(t('profile.passwordMismatch'));
      return;
    }

    if (passwordForm.new_password.length < 6) {
      toast.error(t('profile.passwordMin'));
      return;
    }

    setChangingPassword(true);
    try {
      await changePassword(passwordForm);
      toast.success(t('profile.passwordSuccess'));
      setPasswordForm({ old_password: '', new_password: '', confirm_password: '' });
    } catch (error) {
      const err = error as { response?: { data?: { old_password?: string[] } } };
      toast.error(err.response?.data?.old_password?.[0] || t('profile.passwordError'));
    } finally {
      setChangingPassword(false);
    }
  };

  const getStatusColor = (status: OrderStatus): string => {
    const colors: Record<OrderStatus, string> = {
      pending: 'bg-amber-50 text-amber-700 border border-amber-200',
      confirmed: 'bg-blue-50 text-blue-700 border border-blue-200',
      processing: 'bg-purple-50 text-purple-700 border border-purple-200',
      shipped: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
      delivered: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      cancelled: 'bg-red-50 text-red-700 border border-red-200',
    };
    return colors[status] || 'bg-gray-50 text-gray-700 border border-gray-200';
  };

  const getStatusLabel = (status: OrderStatus): string => {
    const labels: Record<OrderStatus, string> = {
      pending: 'En attente',
      confirmed: 'Confirmée',
      processing: 'En traitement',
      shipped: 'Expédiée',
      delivered: 'Livrée',
      cancelled: 'Annulée',
    };
    return labels[status] || status;
  };

  /* ── Nav items ── */
  const navItems = [
    { id: 'profile', label: t('profile.tabs.profile'), icon: User },
    { id: 'security', label: t('profile.tabs.security'), icon: Shield },
    { id: 'orders', label: t('profile.tabs.orders'), icon: ClipboardList },
    { id: 'reviews', label: t('profile.tabs.reviews'), icon: MessageSquare },
  ];

  /* ── Not authenticated ── */
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <User size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('profile.loginRequired')}</h2>
          <p className="text-gray-600 mb-6">{t('profile.loginRequiredMsg')}</p>
          <Link
            to="/login"
            className="inline-block px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            {t('profile.loginBtn')}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500" />
        </div>
        <Footer />
      </div>
    );
  }

  /* ── Main layout ── */
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Home size={14} />
          <Link to="/" className="hover:text-red-600 transition-colors">Accueil</Link>
          <ChevronRight size={14} />
          <span className="text-gray-800 font-medium">Mon compte</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* ════════════ SIDEBAR ════════════ */}
          <aside className="lg:w-64 flex-shrink-0">

            {/* Avatar card */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-4">
              <div className="bg-red-600 h-16" />
              <div className="px-5 pb-5 -mt-8">
                <div className="w-16 h-16 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center mb-3">
                  <User size={28} className="text-red-600" />
                </div>
                <p className="font-semibold text-gray-900 text-base leading-tight truncate">
                  {user?.nom_cli || user?.username || 'Utilisateur'}
                </p>
                <p className="text-sm text-gray-500 truncate mt-0.5">{user?.email}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Membre depuis{' '}
                  {user?.created_at
                    ? new Date(user.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
                    : '—'}
                </p>
              </div>
            </div>

            {/* Navigation */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 pt-4 pb-2">
                Mon compte
              </p>
              <nav className="pb-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all text-left border-l-4 ${
                        active
                          ? 'border-red-600 bg-red-50 text-red-700'
                          : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon size={17} className={active ? 'text-red-600' : 'text-gray-400'} />
                      {item.label}
                    </button>
                  );
                })}
              </nav>

              <div className="border-t border-gray-100 mt-1 pb-2 pt-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 pb-2 pt-1">
                  Boutique
                </p>
                <Link
                  to="/orders"
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all border-l-4 border-transparent"
                >
                  <ShoppingBag size={17} className="text-gray-400" />
                  Toutes mes commandes
                </Link>
                <Link
                  to="/produit"
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all border-l-4 border-transparent"
                >
                  <Package size={17} className="text-gray-400" />
                  Nos produits
                </Link>
              </div>
            </div>
          </aside>

          {/* ════════════ MAIN CONTENT ════════════ */}
          <main className="flex-1 min-w-0">

            {/* ── Profil ── */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-xl border border-gray-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                  <h2 className="font-semibold text-gray-900">Informations personnelles</h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Edit2 size={15} />
                      Modifier
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <X size={15} />
                        Annuler
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                      >
                        <Save size={15} />
                        {saving ? 'Sauvegarde…' : 'Sauvegarder'}
                      </button>
                    </div>
                  )}
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nom complet */}
                  <FieldBlock
                    label="Nom complet"
                    icon={<User size={15} className="text-gray-400" />}
                    isEditing={isEditing}
                    display={user?.nom_cli}
                  >
                    <input
                      type="text"
                      name="nom_cli"
                      value={formData.nom_cli}
                      onChange={handleInputChange}
                      className={inputCls}
                    />
                  </FieldBlock>

                  {/* Email */}
                  <FieldBlock
                    label="Adresse e-mail"
                    icon={<Mail size={15} className="text-gray-400" />}
                    isEditing={isEditing}
                    display={user?.email}
                  >
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={inputCls}
                    />
                  </FieldBlock>

                  {/* Téléphone */}
                  <FieldBlock
                    label="Téléphone"
                    icon={<Phone size={15} className="text-gray-400" />}
                    isEditing={isEditing}
                    display={user?.numero_cli}
                  >
                    <input
                      type="tel"
                      name="numero_cli"
                      value={formData.numero_cli}
                      onChange={handleInputChange}
                      className={inputCls}
                    />
                  </FieldBlock>

                  {/* Ville */}
                  <FieldBlock
                    label="Ville"
                    icon={<Building size={15} className="text-gray-400" />}
                    isEditing={isEditing}
                    display={user?.ville_cli}
                  >
                    <input
                      type="text"
                      name="ville_cli"
                      value={formData.ville_cli}
                      onChange={handleInputChange}
                      className={inputCls}
                    />
                  </FieldBlock>

                  {/* Adresse — full width */}
                  <div className="md:col-span-2">
                    <FieldBlock
                      label="Adresse"
                      icon={<MapPin size={15} className="text-gray-400" />}
                      isEditing={isEditing}
                      display={user?.adresse_cli}
                    >
                      <input
                        type="text"
                        name="adresse_cli"
                        value={formData.adresse_cli}
                        onChange={handleInputChange}
                        className={inputCls}
                      />
                    </FieldBlock>
                  </div>

                  {/* Code postal */}
                  <FieldBlock
                    label="Code postal"
                    icon={<MapPin size={15} className="text-gray-400" />}
                    isEditing={isEditing}
                    display={user?.code_postal_cli}
                  >
                    <input
                      type="text"
                      name="code_postal_cli"
                      value={formData.code_postal_cli}
                      onChange={handleInputChange}
                      className={inputCls}
                    />
                  </FieldBlock>

                  {/* Pays */}
                  <FieldBlock
                    label="Pays"
                    icon={<MapPin size={15} className="text-gray-400" />}
                    isEditing={isEditing}
                    display={user?.pays_cli}
                  >
                    <input
                      type="text"
                      name="pays_cli"
                      value={formData.pays_cli}
                      onChange={handleInputChange}
                      className={inputCls}
                    />
                  </FieldBlock>
                </div>
              </div>
            )}

            {/* ── Sécurité ── */}
            {activeTab === 'security' && (
              <div className="bg-white rounded-xl border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="font-semibold text-gray-900">Sécurité du compte</h2>
                  <p className="text-sm text-gray-500 mt-0.5">Modifiez votre mot de passe</p>
                </div>

                <div className="p-6">
                  <form onSubmit={handleChangePassword} className="max-w-md space-y-5">
                    <PasswordField
                      label="Mot de passe actuel"
                      name="old_password"
                      value={passwordForm.old_password}
                      show={showPasswords.old}
                      onChange={handlePasswordChange}
                      onToggle={() => setShowPasswords(p => ({ ...p, old: !p.old }))}
                    />
                    <PasswordField
                      label="Nouveau mot de passe"
                      name="new_password"
                      value={passwordForm.new_password}
                      show={showPasswords.new}
                      onChange={handlePasswordChange}
                      onToggle={() => setShowPasswords(p => ({ ...p, new: !p.new }))}
                      hint="Minimum 6 caractères"
                    />
                    <PasswordField
                      label="Confirmer le nouveau mot de passe"
                      name="confirm_password"
                      value={passwordForm.confirm_password}
                      show={showPasswords.confirm}
                      onChange={handlePasswordChange}
                      onToggle={() => setShowPasswords(p => ({ ...p, confirm: !p.confirm }))}
                    />

                    <button
                      type="submit"
                      disabled={changingPassword}
                      className="w-full py-3 bg-red-600 text-white rounded-lg font-semibold text-sm hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      {changingPassword ? 'Modification…' : 'Modifier le mot de passe'}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* ── Commandes ── */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-xl border border-gray-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                  <h2 className="font-semibold text-gray-900">Commandes récentes</h2>
                  <Link
                    to="/orders"
                    className="flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                  >
                    Voir tout
                    <ChevronRight size={16} />
                  </Link>
                </div>

                {orders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                      <Package size={28} className="text-gray-400" />
                    </div>
                    <p className="font-medium text-gray-700">{t('profile.noOrders')}</p>
                    <p className="text-sm text-gray-500 mt-1 mb-5">Vous n&apos;avez encore passé aucune commande.</p>
                    <Link
                      to="/produit"
                      className="px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Découvrir nos produits
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {orders.map((order) => (
                      <Link
                        key={order.id}
                        to={`/orders/${order.id}`}
                        className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                            <ShoppingBag size={18} className="text-red-500" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">Commande #{order.id}</p>
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                              <Calendar size={12} />
                              {new Date(order.created_at).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`hidden sm:inline-block px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {getStatusLabel(order.status)}
                          </span>
                          <p className="font-bold text-gray-900 text-sm">
                            {parseFloat(String(order.total_amount)).toLocaleString()} Fcfa
                          </p>
                          <ChevronRight size={16} className="text-gray-400 group-hover:text-red-500 transition-colors" />
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Avis ── */}
            {activeTab === 'reviews' && (
              <div className="bg-white rounded-xl border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="font-semibold text-gray-900">Mes avis</h2>
                </div>

                {reviews.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                      <Star size={28} className="text-gray-400" />
                    </div>
                    <p className="font-medium text-gray-700">{t('profile.noReviews')}</p>
                    <p className="text-sm text-gray-500 mt-1">{t('profile.noReviewsDesc')}</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {reviews.map((review) => (
                      <div key={review.id} className="px-6 py-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">
                              {review.product?.name || 'Produit'}
                            </p>
                            <div className="flex items-center gap-0.5 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={14}
                                  className={i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-gray-400 flex-shrink-0">
                            {new Date(review.created_at).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        {review.title && (
                          <p className="font-medium text-gray-700 text-sm mt-2">{review.title}</p>
                        )}
                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">{review.comment}</p>
                        {review.is_verified_purchase && (
                          <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs rounded-full border border-emerald-100">
                            ✓ {t('profile.verifiedPurchase')}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

/* ════════ Helpers ════════ */

const inputCls =
  'w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors';

function FieldBlock({
  label,
  icon,
  isEditing,
  display,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  isEditing: boolean;
  display?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
        {icon}
        {label}
      </label>
      {isEditing ? (
        <>{children}</>
      ) : (
        <p className="text-sm text-gray-800 px-3 py-2.5 bg-gray-50 rounded-lg border border-gray-100">
          {display || <span className="text-gray-400">—</span>}
        </p>
      )}
    </div>
  );
}

function PasswordField({
  label,
  name,
  value,
  show,
  onChange,
  onToggle,
  hint,
}: {
  label: string;
  name: string;
  value: string;
  show: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggle: () => void;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          required
          className={`${inputCls} pr-11`}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

export default UserProfilePage;