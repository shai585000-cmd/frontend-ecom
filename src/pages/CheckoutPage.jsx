import { useState, useEffect } from 'react';
import { CheckCircle, Truck, ChevronRight, Smartphone, Banknote, Trash2 } from 'lucide-react';
import useCartStore from "../hooks/useCartStore";
import useAuthStore from "../hooks/authStore";
import { Link, useNavigate } from 'react-router-dom';
import { createOrder } from '../services/orderService';
import { createPayment } from '../services/paymentService';
import { getShippingZones, getShippingFeeByCity } from '../services/shippingService';
import Header from '../components/Common/Hearder';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [mobileMoneyPhone, setMobileMoneyPhone] = useState('');
  
  const [shippingZones, setShippingZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);
  const [shippingFee, setShippingFee] = useState(0);
  
  const [shippingForm, setShippingForm] = useState({
    shipping_address: '',
    shipping_city: '',
    shipping_phone: '',
    notes: '',
  });

  const cart = useCartStore((state) => state.getCart());
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const clearCart = useCartStore((state) => state.clearCart);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const subtotal = getTotalPrice();
  const total = subtotal + shippingFee;

  useEffect(() => {
    const loadZones = async () => {
      try {
        const zones = await getShippingZones();
        setShippingZones(zones);
        if (zones.length > 0) {
          const defaultZone = zones.find(z => z.name === 'Autre') || zones[0];
          setSelectedZone(defaultZone);
          setShippingFee(parseFloat(defaultZone.shipping_fee));
        }
      } catch (err) {
        console.error('Erreur chargement zones:', err);
      }
    };
    loadZones();
  }, []);

  useEffect(() => {
    const updateFee = async () => {
      if (!shippingForm.shipping_city.trim()) return;
      try {
        const result = await getShippingFeeByCity(shippingForm.shipping_city);
        if (result.shipping_fee !== undefined) {
          setSelectedZone(result);
          setShippingFee(parseFloat(result.shipping_fee));
        }
      } catch {
        const autreZone = shippingZones.find(z => z.name === 'Autre');
        if (autreZone) {
          setSelectedZone(autreZone);
          setShippingFee(parseFloat(autreZone.shipping_fee));
        }
      }
    };
    const timeout = setTimeout(updateFee, 500);
    return () => clearTimeout(timeout);
  }, [shippingForm.shipping_city, shippingZones]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingForm(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!shippingForm.shipping_address.trim()) {
      setError("Adresse requise");
      return false;
    }
    if (!shippingForm.shipping_city.trim()) {
      setError("Ville requise");
      return false;
    }
    if (!shippingForm.shipping_phone.trim()) {
      setError("Telephone requis");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    if (!validateForm()) return;
    if (cart.length === 0) {
      setError("Panier vide");
      return;
    }
    if (paymentMethod === 'mobile_money' && !mobileMoneyPhone.trim()) {
      setError("Numero Mobile Money requis");
      return;
    }

    setIsProcessing(true);
    try {
      const orderPayload = {
        ...shippingForm,
        items: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      };
      const orderResponse = await createOrder(orderPayload);
      const paymentPayload = {
        order_id: orderResponse.id,
        payment_method: paymentMethod,
        phone_number: paymentMethod === 'mobile_money' ? mobileMoneyPhone : ''
      };
      const paymentResponse = await createPayment(paymentPayload);
      setOrderData(orderResponse);
      setPaymentData(paymentResponse);
      setIsComplete(true);
      clearCart();
    } catch (err) {
      console.error('Erreur:', err);
      setError(err.response?.data?.error || "Erreur lors de la commande");
    } finally {
      setIsProcessing(false);
    }
  };

  // Page de confirmation
  if (isComplete && orderData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-lg mx-auto px-4 py-6">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Commande confirmee!</h2>
            <p className="text-gray-500 mb-6">Merci pour votre achat</p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Reference</span>
                <span className="font-bold text-green-600">{orderData.order_number}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Total</span>
                <span className="font-bold">{parseFloat(orderData.total_amount).toLocaleString()} Fcfa</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Statut</span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-sm">{orderData.status_display}</span>
              </div>
            </div>

            {paymentData?.payment?.payment_method === 'cash' && (
              <p className="text-sm text-blue-600 mb-4">
                Payez {parseFloat(orderData.total_amount).toLocaleString()} Fcfa a la livraison
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/orders" className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200">
                Mes commandes
              </Link>
              <Link to="/" className="flex-1 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600">
                Accueil
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-lg mx-auto px-4 py-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-6">Checkout</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Panier */}
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="font-semibold mb-3">Votre panier</h2>
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Panier vide</p>
            ) : (
              <div className="space-y-3">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.quantity} x {item.price.toLocaleString()} Fcfa</p>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <span className="font-semibold text-sm">{(item.price * item.quantity).toLocaleString()}</span>
                      <button type="button" onClick={() => removeFromCart(item.id)} className="text-red-500 p-1">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                <div className="pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Sous-total</span>
                    <span>{subtotal.toLocaleString()} Fcfa</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Livraison</span>
                    <span>{shippingFee > 0 ? `${shippingFee.toLocaleString()} Fcfa` : 'Gratuit'}</span>
                  </div>
                  {selectedZone && (
                    <p className="text-xs text-gray-500">Zone: {selectedZone.name} ({selectedZone.estimated_days}j)</p>
                  )}
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span className="text-green-600">{total.toLocaleString()} Fcfa</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Adresse */}
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="font-semibold mb-3">Livraison</h2>
            <div className="space-y-3">
              <input
                type="text"
                name="shipping_address"
                value={shippingForm.shipping_address}
                onChange={handleInputChange}
                placeholder="Adresse complete *"
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <input
                type="text"
                name="shipping_city"
                value={shippingForm.shipping_city}
                onChange={handleInputChange}
                placeholder="Ville *"
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <input
                type="tel"
                name="shipping_phone"
                value={shippingForm.shipping_phone}
                onChange={handleInputChange}
                placeholder="Telephone *"
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <textarea
                name="notes"
                value={shippingForm.notes}
                onChange={handleInputChange}
                placeholder="Notes (optionnel)"
                rows={2}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Paiement */}
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="font-semibold mb-3">Paiement</h2>
            <div className="space-y-2">
              <div 
                onClick={() => setPaymentMethod('cash')}
                className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer ${paymentMethod === 'cash' ? 'border-green-500 bg-green-50' : ''}`}
              >
                <Banknote className="text-green-600" size={20} />
                <div className="flex-1">
                  <p className="font-medium text-sm">A la livraison</p>
                  <p className="text-xs text-gray-500">Payez en especes</p>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 ${paymentMethod === 'cash' ? 'border-green-500 bg-green-500' : 'border-gray-300'}`} />
              </div>
              
              <div 
                onClick={() => setPaymentMethod('mobile_money')}
                className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer ${paymentMethod === 'mobile_money' ? 'border-green-500 bg-green-50' : ''}`}
              >
                <Smartphone className="text-orange-500" size={20} />
                <div className="flex-1">
                  <p className="font-medium text-sm">Mobile Money</p>
                  <p className="text-xs text-gray-500">MTN, Orange, Wave</p>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 ${paymentMethod === 'mobile_money' ? 'border-green-500 bg-green-500' : 'border-gray-300'}`} />
              </div>

              {paymentMethod === 'mobile_money' && (
                <input
                  type="tel"
                  value={mobileMoneyPhone}
                  onChange={(e) => setMobileMoneyPhone(e.target.value)}
                  placeholder="Numero Mobile Money *"
                  className="w-full px-3 py-2 border rounded-lg text-sm mt-2 focus:ring-2 focus:ring-green-500"
                />
              )}
            </div>
          </div>

          {/* Mode livraison */}
          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex items-center gap-3">
              <Truck className="text-blue-500" size={24} />
              <div className="flex-1">
                <p className="font-medium">Livraison standard</p>
                <p className="text-xs text-gray-500">24-48h</p>
              </div>
              <ChevronRight className="text-gray-400" size={20} />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isProcessing || cart.length === 0}
            className="w-full py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing && (
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {isProcessing ? 'Traitement...' : `Payer ${total.toLocaleString()} Fcfa`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
