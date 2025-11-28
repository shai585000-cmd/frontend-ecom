import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, ChevronRight, Clock, CheckCircle, Truck, XCircle, RefreshCw } from 'lucide-react';
import { getOrders, cancelOrder } from '../services/orderService';
import useAuthStore from '../hooks/authStore';
import Header from '../components/Common/Hearder';

const OrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/orders' } });
      return;
    }
    fetchOrders();
  }, [isAuthenticated, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      console.error('Erreur lors du chargement des commandes:', err);
      setError('Impossible de charger vos commandes');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
      return;
    }

    try {
      setCancellingId(orderId);
      await cancelOrder(orderId);
      // Rafraîchir la liste
      fetchOrders();
    } catch (err) {
      console.error('Erreur lors de l\'annulation:', err);
      alert(err.response?.data?.error || 'Impossible d\'annuler la commande');
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'confirmed':
      case 'processing':
        return <RefreshCw className="w-5 h-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
      case 'refunded':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
      case 'refunded':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50">
      <Header />
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Mes Commandes</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Aucune commande</h2>
            <p className="text-gray-500 mb-6">Vous n&apos;avez pas encore passé de commande</p>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Découvrir nos produits
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                {/* Header de la commande */}
                <div className="p-4 border-b bg-gray-50 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Commande</p>
                    <p className="font-bold text-gray-800">{order.order_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium text-gray-700">
                      {new Date(order.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="font-bold text-blue-600">
                      {parseFloat(order.total_amount).toLocaleString()} Fcfa
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status_display}
                    </span>
                  </div>
                </div>

                {/* Articles de la commande */}
                <div className="p-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Articles</h4>
                  <div className="space-y-2">
                    {order.items && order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-sm">
                        <span className="text-gray-700">
                          {item.quantity}x {item.product_name}
                        </span>
                        <span className="font-medium text-gray-800">
                          {parseFloat(item.total_price).toLocaleString()} Fcfa
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Adresse de livraison */}
                <div className="px-4 pb-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Livraison</h4>
                  <p className="text-sm text-gray-700">
                    {order.shipping_address}, {order.shipping_city}
                  </p>
                  <p className="text-sm text-gray-600">{order.shipping_phone}</p>
                </div>

                {/* Actions */}
                <div className="px-4 pb-4 flex gap-3">
                  {(order.status === 'pending' || order.status === 'confirmed') && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      disabled={cancellingId === order.id}
                      className="px-4 py-2 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition disabled:opacity-50"
                    >
                      {cancellingId === order.id ? 'Annulation...' : 'Annuler'}
                    </button>
                  )}
                  <Link
                    to={`/orders/${order.id}`}
                    className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-1"
                  >
                    Détails <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
