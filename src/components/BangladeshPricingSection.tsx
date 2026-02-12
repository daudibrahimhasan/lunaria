import { useState, useEffect } from 'react';
import { Check, Truck, Shield, Phone, MessageCircle } from 'lucide-react';
import { detectUserLocation, getPricingStructure, formatPrice, UserLocation } from '../utils/geoDetection';

interface PricingPack {
  quantity: number;
  price: number;
  savings: number;
  label: string;
}

interface PricingStructure {
  currency: string;
  currencySymbol: string;
  packs: PricingPack[];
  delivery: {
    cost: number | string; // Can be number or 'calculated'
    time: string;
    freeDelivery: boolean;
  };
  paymentMethods: Array<{ id: string; name: string; popular?: boolean }>;
}

export const BangladeshPricingSection = () => {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [pricing, setPricing] = useState<PricingStructure | null>(null);
  const [selectedPack, setSelectedPack] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeLocation = async () => {
      try {
        const location = await detectUserLocation();
        setUserLocation(location);
        const structure = getPricingStructure(location.isBangladesh);
        setPricing(structure);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to detect location:', error);
        setIsLoading(false);
      }
    };

    initializeLocation();
  }, []);

  const handleAddToCart = (pack: PricingPack) => {
    // Add to cart logic here
    console.log('Adding to cart:', pack);
    // You would integrate this with your existing cart system
  };

  if (isLoading) {
    return (
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!userLocation || !pricing) {
    return null;
  }

  const selectedPackData = pricing.packs.find(p => p.quantity === selectedPack) || pricing.packs[0];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Location Banner */}
        {userLocation.isBangladesh && (
          <div className="mb-8 bg-gradient-to-r from-[#9B7BB5] to-[#5A8A6E] rounded-2xl p-6 text-white text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl">🇧🇩</span>
              <h3 className="text-xl font-medium">Welcome from Bangladesh!</h3>
            </div>
            <p className="text-[#D4C8E8]">
              Enjoy FREE delivery and local payment options
            </p>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Product Image */}
          <div className="order-2 lg:order-1">
            <div className="bg-gradient-to-br from-[#FAF9F7] to-[#D4C8E8]/20 rounded-3xl p-8 lg:p-12">
              <div className="w-full h-96 bg-white rounded-2xl shadow-lg shadow-[#9B7BB5]/10 flex items-center justify-center border border-[#D4C8E8]/20 mb-6 overflow-hidden">
                <img 
                  src={
                    selectedPack === 3 
                      ? "/1770855058050-019c4f2f-068a-7154-8afb-c0d41c18ab88.jpeg" 
                      : selectedPack === 5
                      ? "/gemini-3-pro-image-preview-2k_b_make_the_product_5_p.png"
                      : "/Gemini_Generated_Image_clo5tmclo5tmclo5.png"
                  } 
                  alt="Lunaria 7-in-1 Capsule Routine" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex justify-center gap-4">
                {pricing.packs.map((pack) => (
                  <button
                    key={pack.quantity}
                    onClick={() => setSelectedPack(pack.quantity)}
                    className={`w-16 h-16 rounded-lg border-2 flex items-center justify-center transition-all ${
                      selectedPack === pack.quantity
                        ? 'border-[#9B7BB5] bg-[#9B7BB5]/10 text-[#9B7BB5]'
                        : 'border-gray-200 hover:border-[#9B7BB5]/50'
                    }`}
                  >
                    <span className="text-sm font-medium">{pack.quantity}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing Details */}
          <div className="order-1 lg:order-2">
            <span className="text-[#9B7BB5] font-medium text-sm tracking-widest uppercase">
              Complete Routine
            </span>
            <h2 className="font-display text-4xl lg:text-5xl font-light text-gray-900 mt-4 mb-4">
              Lunaria 7-in-1<br />Capsule Routine
            </h2>
            
            {/* Price Display */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-light text-gray-900">
                {formatPrice(selectedPackData.price, pricing.currency)}
              </span>
              {selectedPackData.savings > 0 && (
                <>
                  <span className="text-gray-400 line-through">
                    {formatPrice(selectedPack * (pricing.packs[0].price / pricing.packs[0].quantity), pricing.currency)}
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                    Save {formatPrice(selectedPackData.savings, pricing.currency)}
                  </span>
                </>
              )}
            </div>

            <p className="text-gray-600 mb-8">
              {selectedPack} pack{selectedPack > 1 ? 's' : ''} containing {selectedPack * 7} single-use capsules—
              your complete skincare ritual for {selectedPack} week{selectedPack > 1 ? 's' : ''}.
            </p>

            {/* Features */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-gray-700">
                <Check className="w-5 h-5 text-[#5A8A6E]" />
                <span>{selectedPack * 7} precisely dosed capsules</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Check className="w-5 h-5 text-[#5A8A6E]" />
                <span>Full AM/PM routine</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Check className="w-5 h-5 text-[#5A8A6E]" />
                <span>Suitable for all skin types</span>
              </div>
              {pricing.delivery.freeDelivery ? (
                <div className="flex items-center gap-3 text-gray-700">
                  <Truck className="w-5 h-5 text-[#9B7BB5]" />
                  <span className="font-medium text-[#9B7BB5]">FREE Delivery Nationwide</span>
                </div>
              ) : (
                <div className="flex items-center gap-3 text-gray-700">
                  <Truck className="w-5 h-5 text-gray-500" />
                  <span>International shipping calculated at checkout</span>
                </div>
              )}
            </div>

            {/* Delivery Info */}
            <div className="bg-[#FAF9F7] rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Truck className="w-4 h-4" />
                <span>Delivery: {pricing.delivery.time}</span>
              </div>
              {userLocation.isBangladesh && (
                <div className="flex items-center gap-2 text-sm text-[#5A8A6E] mt-1">
                  <Shield className="w-4 h-4" />
                  <span>Tracking via SMS & WhatsApp</span>
                </div>
              )}
            </div>

            {/* Add to Cart Button */}
            <button 
              onClick={() => handleAddToCart(selectedPackData)}
              className="w-full px-8 py-4 bg-[#9B7BB5] text-white rounded-full font-medium hover:bg-[#8A6AA4] transition-all hover:shadow-lg hover:shadow-[#9B7BB5]/30 flex items-center justify-center gap-2 mb-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5h4" />
              </svg>
              Add to Cart — {formatPrice(selectedPackData.price, pricing.currency)}
            </button>

            {/* Payment Methods for Bangladesh */}
            {userLocation.isBangladesh && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="w-4 h-4" />
                  <span>Secure Payment Options</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {pricing.paymentMethods.map((method) => (
                    <div 
                      key={method.id}
                      className={`px-3 py-2 rounded-lg text-sm text-center border ${
                        method.popular 
                          ? 'bg-[#9B7BB5]/10 border-[#9B7BB5] text-[#9B7BB5] font-medium'
                          : 'bg-gray-50 border-gray-200 text-gray-600'
                      }`}
                    >
                      {method.name}
                      {method.popular && (
                        <span className="block text-xs opacity-75">Most Popular</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Support Info for Bangladesh */}
            {userLocation.isBangladesh && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    <span>+880 1787-853308</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Support</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};