/// <reference types="vite/client" />
import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import {
  CheckCircle, Truck, ChevronRight, Smartphone,
  Banknote, Trash2, MessageCircle, LogIn, Info,
} from 'lucide-react';
import useCartStore from '../hooks/useCartStore';
import useAuthStore from '../hooks/authStore';
import { Link } from 'react-router-dom';
import { createOrder } from '../services/orderService';
import { createPayment } from '../services/paymentService';
import { getShippingZones, getShippingFeeByCity } from '../services/shippingService';
import { getCurrentUser } from '../services/userService';
import Header from '../components/Common/Hearder';
import { useTranslation } from 'react-i18next';
import logger from '../utils/logger';

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '2250170629746';

interface ShippingZone {
  id: number;
  name: string;
  shipping_fee: string | number;
  estimated_days?: number;
}

interface OrderResponse {
  id: number;
  order_number: string;
  total_amount: string | number;
  status_display: string;
  items?: { product_name?: string; name?: string; quantity: number; subtotal?: string | number; price?: number }[];
  shipping_address?: string;
  shipping_city?: string;
  shipping_phone?: string;
  notes?: string;
}

interface PaymentResponse {
  payment?: { payment_method: string };
}

const CheckoutPage = () => {
  const { t } = useTranslation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const authUser = useAuthStore((state) => state.user);

  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<OrderResponse | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentResponse | null>(null);
  const [mobileMoneyPhone, setMobileMoneyPhone] = useState('');
  const [shippingZones, setShippingZones] = useState<ShippingZone[]>([]);
  const [selectedZone, setSelectedZone] = useState<ShippingZone | null>(null);
  const [shippingFee, setShippingFee] = useState(0);

  // Champs communs (livraison)
  const [shippingForm, setShippingForm] = useState({
    shipping_address: '',
    shipping_city: '',
    shipping_phone: '',
    notes: '',
  });

  // Champs supplémentaires pour guest (ou pré-remplis pour connecté)
  const [customerForm, setCustomerForm] = useState({
    customer_name: '',
    customer_email: '',
  });

  const cart = useCartStore((state) => state.getCart());
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const clearCart = useCartStore((state) => state.clearCart);

  const subtotal = getTotalPrice();
  const total = subtotal + shippingFee;

  // Charger les zones de livraison
  useEffect(() => {
    const loadZones = async () => {
      try {
        const zones: ShippingZone[] = await getShippingZones();
        setShippingZones(zones);
        if (zones.length > 0) {
          const defaultZone = zones.find((z) => z.name === 'Autre') || zones[0];
          setSelectedZone(defaultZone);
          setShippingFee(parseFloat(String(defaultZone.shipping_fee)));
        }
      } catch (err) {
        logger.error('Erreur chargement zones:', err);
      }
    };
    loadZones();
  }, []);

  // Pré-remplir depuis le profil si connecté
  useEffect(() => {
    if (isAuthenticated) {
      getCurrentUser()
        .then((user) => {
          setCustomerForm({
            customer_name: user.nom_cli || '',
            customer_email: user.email || '',
          });
          setShippingForm((prev) => ({
            ...prev,
            shipping_address: user.adresse_cli || '',
            shipping_city: user.ville_cli || '',
            shipping_phone: user.numero_cli || '',
          }));
        })
        .catch(() => {});
    }
  }, [isAuthenticated]);

  // Mettre à jour les frais selon la ville
  useEffect(() => {
    const updateFee = async () => {
      if (!shippingForm.shipping_city.trim()) return;
      try {
        const result: ShippingZone = await getShippingFeeByCity(shippingForm.shipping_city);
        if (result.shipping_fee !== undefined) {
          setSelectedZone(result);
          setShippingFee(parseFloat(String(result.shipping_fee)));
        }
      } catch {
        const autreZone = shippingZones.find((z) => z.name === 'Autre');
        if (autreZone) {
          setSelectedZone(autreZone);
          setShippingFee(parseFloat(String(autreZone.shipping_fee)));
        }
      }
    };
    const timeout = setTimeout(updateFee, 500);
    return () => clearTimeout(timeout);
  }, [shippingForm.shipping_city, shippingZones]);

  const handleShippingChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShippingForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCustomerChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    if (!customerForm.customer_name.trim()) { setError(t('checkout.fullName').replace(' *', '') + ' requis'); return false; }
    if (!customerForm.customer_email.trim()) { setError(t('checkout.email').replace(' *', '') + ' requis'); return false; }
    if (!shippingForm.shipping_address.trim()) { setError(t('checkout.address').replace(' *', '') + ' requise'); return false; }
    if (!shippingForm.shipping_city.trim()) { setError(t('checkout.city').replace(' *', '') + ' requise'); return false; }
    if (!shippingForm.shipping_phone.trim()) { setError(t('checkout.phone').replace(' *', '') + ' requis'); return false; }
    return true;
  };

  const buildWhatsAppMessage = (order: OrderResponse): string => {
    const items =
      order.items
        ?.map((item) => {
          const price = parseFloat(String(item.subtotal ?? (item.price ?? 0) * item.quantity));
          return `- ${item.product_name || item.name} x${item.quantity} = ${price.toLocaleString()} Fcfa`;
        })
        .join('\n') ?? '';

    return encodeURIComponent(
      `*NOUVELLE COMMANDE*\n\n` +
      `*Référence:* ${order.order_number}\n` +
      `*Client:* ${customerForm.customer_name}\n` +
      `*Email:* ${customerForm.customer_email}\n\n` +
      `*Articles:*\n${items}\n\n` +
      `*Total:* ${parseFloat(String(order.total_amount)).toLocaleString()} Fcfa\n\n` +
      `*Livraison:*\n` +
      `Adresse: ${order.shipping_address || shippingForm.shipping_address}\n` +
      `Ville: ${order.shipping_city || shippingForm.shipping_city}\n` +
      `Téléphone: ${order.shipping_phone || shippingForm.shipping_phone}\n` +
      (order.notes || shippingForm.notes ? `Notes: ${order.notes || shippingForm.notes}\n` : '') +
      `\n*Paiement:* ${paymentMethod === 'cash' ? 'À la livraison' : 'Mobile Money'}\n\n` +
      `Merci de confirmer ma commande !`
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validateForm()) return;
    if (cart.length === 0) { setError(t('checkout.emptyCart')); return; }
    if (paymentMethod === 'mobile_money' && !mobileMoneyPhone.trim()) {
      setError(t('checkout.mobileMoneyNum').replace(' *', '') + ' requis');
      return;
    }

    setIsProcessing(true);
    try {
      const orderPayload = {
        ...shippingForm,
        ...customerForm,
        items: cart.map((item) => ({ product_id: item.id, quantity: item.quantity, price: item.price })),
      };
      const orderResponse: OrderResponse = await createOrder(orderPayload);
      const paymentResponse: PaymentResponse = await createPayment({
        order_id: orderResponse.id,
        payment_method: paymentMethod,
        phone_number: paymentMethod === 'mobile_money' ? mobileMoneyPhone : '',
      });
      setOrderData(orderResponse);
      setPaymentData(paymentResponse);
      setIsComplete(true);
      clearCart();
      window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${buildWhatsAppMessage(orderResponse)}`;
    } catch (err: unknown) {
      logger.error('Erreur commande:', err);
      const axiosErr = err as { response?: { data?: { error?: string } } };
      setError(axiosErr.response?.data?.error || t('common.error'));
    } finally {
      setIsProcessing(false);
    }
  };

  // ── Page de confirmation ──────────────────────────────────────────────────
  if (isComplete && orderData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-lg mx-auto px-4 py-10">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">{t('checkout.confirmed')}</h2>
            <p className="text-gray-500 mb-6">{t('checkout.thankYou')}</p>

            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left space-y-3">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">{t('checkout.reference')}</span>
                <span className="font-bold text-red-600">{orderData.order_number}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">{t('checkout.total')}</span>
                <span className="font-bold">{parseFloat(String(orderData.total_amount)).toLocaleString()} Fcfa</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">{t('checkout.status')}</span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-sm">{orderData.status_display}</span>
              </div>
            </div>

            {paymentData?.payment?.payment_method === 'cash' && (
              <p className="text-sm text-red-600 mb-4">
                Payez {parseFloat(String(orderData.total_amount)).toLocaleString()} Fcfa à la livraison
              </p>
            )}

            <button
              onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${buildWhatsAppMessage(orderData)}`, '_blank')}
              className="w-full py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 flex items-center justify-center gap-2 mb-3"
            >
              <MessageCircle size={20} />
              {t('checkout.contactWhatsApp')}
            </button>
            <p className="text-xs text-gray-400 mb-6">{t('checkout.whatsAppInfo')}</p>

            <div className="flex gap-3">
              <Link to="/orders" className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 text-center">
                {t('checkout.myOrders')}
              </Link>
              <Link to="/" className="flex-1 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 text-center">
                {t('checkout.home')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Formulaire principal ──────────────────────────────────────────────────
  const inputCls = 'w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">{t('checkout.title')}</h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* ── Récapitulatif panier ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-800 mb-4">{t('checkout.cart')}</h2>
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-4">{t('checkout.emptyCart')}</p>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.name}</p>
                      <p className="text-xs text-gray-400">{item.quantity} × {Number(item.price).toLocaleString()} Fcfa</p>
                    </div>
                    <div className="flex items-center gap-3 ml-3">
                      <span className="font-semibold text-sm text-gray-800">{(Number(item.price) * item.quantity).toLocaleString()} Fcfa</span>
                      <button type="button" onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 p-1">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
                <div className="pt-3 space-y-1.5 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>{t('checkout.subtotal')}</span>
                    <span>{subtotal.toLocaleString()} Fcfa</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>{t('checkout.shipping')}</span>
                    <span>{shippingFee > 0 ? `${shippingFee.toLocaleString()} Fcfa` : t('checkout.free')}</span>
                  </div>
                  {selectedZone && (
                    <p className="text-xs text-gray-400">Zone : {selectedZone.name} — {selectedZone.estimated_days}j</p>
                  )}
                  <div className="flex justify-between font-bold text-base pt-2 border-t text-gray-900">
                    <span>{t('checkout.total')}</span>
                    <span className="text-red-600">{total.toLocaleString()} Fcfa</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Infos client ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800">{t('checkout.customerInfo')}</h2>
              {isAuthenticated ? (
                <span className="flex items-center gap-1.5 text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-200">
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                  {t('checkout.connectedAs')} {authUser?.nom_cli || authUser?.email}
                </span>
              ) : (
                <Link to="/login" className="flex items-center gap-1 text-xs text-red-600 hover:underline font-medium">
                  <LogIn size={13} />
                  {t('checkout.loginBtn')}
                </Link>
              )}
            </div>

            {isAuthenticated && (
              <div className="flex items-start gap-2 mb-4 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                <Info size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-600">{t('checkout.autoFilled')}</p>
              </div>
            )}

            {!isAuthenticated && (
              <div className="flex items-start gap-2 mb-4 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                <Info size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-700">{t('checkout.guestBanner')}</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input type="text" name="customer_name" value={customerForm.customer_name}
                onChange={handleCustomerChange} placeholder={t('checkout.fullName')}
                className={inputCls} />
              <input type="email" name="customer_email" value={customerForm.customer_email}
                onChange={handleCustomerChange} placeholder={t('checkout.email')}
                className={inputCls} />
            </div>
          </div>

          {/* ── Livraison ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-800 mb-4">{t('checkout.deliveryInfo')}</h2>
            <div className="space-y-3">
              <input type="text" name="shipping_address" value={shippingForm.shipping_address}
                onChange={handleShippingChange} placeholder={t('checkout.address')}
                className={inputCls} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input type="text" name="shipping_city" value={shippingForm.shipping_city}
                  onChange={handleShippingChange} placeholder={t('checkout.city')}
                  className={inputCls} />
                <input type="tel" name="shipping_phone" value={shippingForm.shipping_phone}
                  onChange={handleShippingChange} placeholder={t('checkout.phone')}
                  className={inputCls} />
              </div>
              <textarea name="notes" value={shippingForm.notes} onChange={handleShippingChange}
                placeholder={t('checkout.notes')} rows={2}
                className={inputCls + ' resize-none'} />
            </div>
          </div>

          {/* ── Paiement ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-800 mb-4">{t('checkout.payment')}</h2>
            <div className="space-y-2">
              {[
                { id: 'cash', icon: <Banknote className="text-green-600" size={20} />, label: t('checkout.cashOnDelivery'), desc: t('checkout.cashDesc') },
                { id: 'mobile_money', icon: <Smartphone className="text-orange-500" size={20} />, label: t('checkout.mobileMoney'), desc: t('checkout.mobileMoneyDesc') },
              ].map((method) => (
                <div key={method.id} onClick={() => setPaymentMethod(method.id)}
                  className={`flex items-center gap-3 p-3.5 border rounded-xl cursor-pointer transition-all ${
                    paymentMethod === method.id ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {method.icon}
                  <div className="flex-1">
                    <p className="font-medium text-sm text-gray-800">{method.label}</p>
                    <p className="text-xs text-gray-400">{method.desc}</p>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 transition-all ${
                    paymentMethod === method.id ? 'border-red-500 bg-red-500' : 'border-gray-300'
                  }`} />
                </div>
              ))}
              {paymentMethod === 'mobile_money' && (
                <input type="tel" value={mobileMoneyPhone} onChange={(e) => setMobileMoneyPhone(e.target.value)}
                  placeholder={t('checkout.mobileMoneyNum')} className={inputCls + ' mt-2'} />
              )}
            </div>
          </div>

          {/* ── Livraison standard ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-3">
            <Truck className="text-red-500 flex-shrink-0" size={22} />
            <div className="flex-1">
              <p className="font-medium text-sm text-gray-800">{t('checkout.standardDelivery')}</p>
              <p className="text-xs text-gray-400">{t('checkout.deliveryTime')}</p>
            </div>
            <ChevronRight className="text-gray-300" size={18} />
          </div>

          {/* ── Erreur ── */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* ── Bouton soumettre ── */}
          <button type="submit" disabled={isProcessing || cart.length === 0}
            className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            {isProcessing && (
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {isProcessing ? t('checkout.processing') : `${t('checkout.pay')} ${total.toLocaleString()} Fcfa`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
