import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Truck, MapPin, Phone, CreditCard, Star } from 'lucide-react';
import { getOrderById, cancelOrder } from '../services/orderService';
import Header from '../components/Common/Hearder';
import logger from '../utils/logger';

interface OrderItem {
  product: number | null;
  product_name: string;
  quantity: number;
  unit_price: string;
  total_price: string;
}

interface Payment {
  payment_method_display: string;
  status_display: string;
  phone_number?: string;
}

interface OrderDetail {
  id: number;
  order_number: string;
  status: string;
  status_display: string;
  total_amount: string;
  shipping_address: string;
  shipping_city: string;
  shipping_phone: string;
  notes?: string;
  created_at: string;
  items: OrderItem[];
  payments?: Payment[];
}

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(id);
        setOrder(data);
      } catch (err) {
        logger.error('Erreur:', err);
        setError('Commande introuvable');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Voulez-vous vraiment annuler cette commande ?')) return;
    
    setCancelling(true);
    try {
      await cancelOrder(id);
      const data = await getOrderById(id);
      setOrder(data);
    } catch (err) {
      logger.error('Erreur annulation:', err);
      setError('Impossible d\'annuler la commande');
    } finally {
      setCancelling(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto p-6 mt-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 mb-4">{error || 'Commande introuvable'}</p>
            <Link to="/orders" className="text-red-500 hover:underline">
              Retour aux commandes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto p-4 sm:p-6 mt-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/orders')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={20} />
            <span>Retour</span>
          </button>
          <h1 className="text-xl font-bold">Commande {order.order_number}</h1>
        </div>

        {/* Statut */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="text-red-500" size={24} />
              <div>
                <p className="text-sm text-gray-500">Statut de la commande</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {order.status_display}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-medium">{new Date(order.created_at).toLocaleDateString('fr-FR')}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Adresse de livraison */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="text-green-500" size={20} />
              <h2 className="font-semibold">Adresse de livraison</h2>
            </div>
            <div className="space-y-2 text-gray-600">
              <p>{order.shipping_address}</p>
              <p>{order.shipping_city}</p>
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <span>{order.shipping_phone}</span>
              </div>
              {order.notes && (
                <p className="text-sm italic mt-2">Note: {order.notes}</p>
              )}
            </div>
          </div>

          {/* Paiement */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="text-purple-500" size={20} />
              <h2 className="font-semibold">Paiement</h2>
            </div>
            {order.payments && order.payments.length > 0 ? (
              <div className="space-y-2 text-gray-600">
                <p>Mode: {order.payments[0].payment_method_display}</p>
                <p>Statut: {order.payments[0].status_display}</p>
                {order.payments[0].phone_number && (
                  <p>Tel: {order.payments[0].phone_number}</p>
                )}
              </div>
            ) : (
              <p className="text-gray-500">Aucun paiement enregistre</p>
            )}
          </div>
        </div>

        {/* Articles */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Truck className="text-red-500" size={20} />
            <h2 className="font-semibold">Articles commandes</h2>
          </div>
          <div className="divide-y">
            {order.items && order.items.map((item, index) => (
              <div key={index} className="py-4 flex justify-between items-center gap-4">
                <div className="flex-1">
                  <p className="font-medium">{item.product_name}</p>
                  <p className="text-sm text-gray-500">Quantite: {item.quantity}</p>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <p className="font-medium">{parseFloat(item.total_price).toLocaleString()} Fcfa</p>
                  <p className="text-sm text-gray-500">{parseFloat(item.unit_price).toLocaleString()} Fcfa/unite</p>
                  {order.status === 'delivered' && item.product && (
                    <Link
                      to={`/products/${item.product}#reviews`}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 text-yellow-700 border border-yellow-300 rounded-lg text-xs font-semibold hover:bg-yellow-100 transition-colors"
                    >
                      <Star size={13} className="fill-yellow-400 text-yellow-400" />
                      Laisser un avis
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Total */}
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total</span>
              <span className="text-red-600">{parseFloat(order.total_amount).toLocaleString()} Fcfa</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        {order.status === 'pending' && (
          <div className="bg-white rounded-lg shadow p-6">
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50"
            >
              {cancelling ? 'Annulation en cours...' : 'Annuler la commande'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailPage;
