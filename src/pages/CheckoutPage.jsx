import React, { useState } from 'react';
import { CheckCircle, CreditCard, Truck, ChevronRight } from 'lucide-react';
import useCartStore from "../hooks/useCartStore";
import { Link } from 'react-router-dom';
// Supprimé l'import de framer-motion qui n'est pas utilisé dans le code

const CheckoutPage = () => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  // Récupérer les données du panier depuis le store Zustand
  const cart = useCartStore((state) => state.getCart());
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const clearCart = useCartStore((state) => state.clearCart); // Ajouté pour vider le panier après achat

  console.log(cart);
  console.log(cart);
  console.log(cart);
  console.log(cart);
  console.log(cart);
  console.log(cart);
  console.log(cart);
  console.log(cart);
  console.log(cart);
  console.log(cart);
  console.log(cart);
  console.log(cart);
  console.log(cart);
  console.log(cart);
  console.log(cart);
  console.log(cart);
  console.log(cart);
  console.log(cart);
  console.log(cart);
  console.log(cart);
  console.log(cart);
  console.log(cart);
  console.log(cart);

  
  // Utiliser le total du store au lieu de calculer à nouveau
  const total = getTotalPrice();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
      clearCart(); // Vider le panier après un paiement réussi
    }, 2000);
  };
  
  if (isComplete) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
        <div className="flex flex-col items-center justify-center py-8">
          <CheckCircle className="text-green-500 w-16 h-16 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Paiement réussi</h2>
          <p className="text-gray-600 mb-6">Votre commande a été traitée avec succès</p>
          <div className="w-full p-4 bg-green-50 rounded-lg mb-6">
            <div className="flex justify-between mb-2">
              <span className="font-medium">Référence:</span>
              <span>CMD-{Math.floor(100000 + Math.random() * 900000)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-medium">Montant total:</span>
              <span>{total.toLocaleString()} Fcfa</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Date:</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex gap-4 w-full">
            <button className="w-1/2 py-3 bg-gray-100 text-gray-800 rounded font-medium">
              Voir les détails
            </button>
            <button className="w-1/2 py-3 bg-blue-500 text-white rounded font-medium">
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow">
      <div className="border-b p-6">
        <h2 className="text-xl font-bold text-gray-800">Finalisez votre commande</h2>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="p-6 border-b">
          <h3 className="font-medium mb-4">Récapitulatif de la commande</h3>
          <div className="space-y-3 mb-4">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-gray-700">{item.quantity}x</span>
                  <span>{item.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium">{(item.price * item.quantity).toLocaleString()} Fcfa</span>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
          {cart.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              Votre panier est vide
            </div>
          )}
          <div className="flex justify-between pt-3 border-t font-bold">
            <span>Total</span>
            <span className="text-blue-600">{total.toLocaleString()} Fcfa</span>
          </div>
        </div>
        
        <div className="p-6 border-b">
          <h3 className="font-medium mb-4">Mode de paiement</h3>
          <div className="space-y-3">
            <div 
              className={`border rounded-lg p-4 cursor-pointer flex justify-between items-center ${paymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : ''}`}
              onClick={() => setPaymentMethod('card')}
            >
              <div className="flex items-center gap-3">
                <CreditCard className="text-blue-500" />
                <span>Carte bancaire</span>
              </div>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'card' ? 'border-blue-500' : 'border-gray-300'}`}>
                {paymentMethod === 'card' && <div className="w-3 h-3 bg-blue-500 rounded-full"></div>}
              </div>
            </div>
            
            <div 
              className={`border rounded-lg p-4 cursor-pointer flex justify-between items-center ${paymentMethod === 'mobile' ? 'border-blue-500 bg-blue-50' : ''}`}
              onClick={() => setPaymentMethod('mobile')}
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="5" y="2" width="14" height="20" rx="2" stroke="currentColor" strokeWidth="2" />
                  <path d="M12 18H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span>Mobile Money</span>
              </div>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'mobile' ? 'border-blue-500' : 'border-gray-300'}`}>
                {paymentMethod === 'mobile' && <div className="w-3 h-3 bg-blue-500 rounded-full"></div>}
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6 border-b">
          <h3 className="font-medium mb-4">Mode de livraison</h3>
          <div className="border rounded-lg p-4 flex justify-between items-center border-blue-500 bg-blue-50">
            <div className="flex items-center gap-3">
              <Truck className="text-blue-500" />
              <div>
                <p className="font-medium">Livraison standard</p>
                <p className="text-sm text-gray-600">Livraison sous 24-48h</p>
              </div>
            </div>
            <ChevronRight className="text-gray-400" />
          </div>
        </div>
        
        <div className="p-6">
          <button 
            type="submit" 
            className="w-full py-3 bg-blue-500 text-white rounded font-medium flex items-center justify-center"
            disabled={isProcessing || cart.length === 0}
          >
            {isProcessing ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : null}
            {isProcessing ? 'Traitement en cours...' : 'Procéder au paiement'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;