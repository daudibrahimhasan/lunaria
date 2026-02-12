// Geo-detection utility for Bangladesh market
export interface UserLocation {
  country: string;
  countryCode: string;
  currency: string;
  isBangladesh: boolean;
  locale: string;
}

// Mock geo-detection for development (in production, use a real service)
export const detectUserLocation = async (): Promise<UserLocation> => {
  try {
    // In production, you would use a service like:
    // - ipapi.co
    // - ipgeolocation.io
    // - maxmind.com
    // - cloudflare workers
    
    // For demo purposes, we'll check if the user has set a preference
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      return JSON.parse(savedLocation);
    }

    // Fallback detection methods
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const language = navigator.language;
    
    // Bangladesh indicators
    const isLikelyBangladesh = 
      timezone.includes('Dhaka') || 
      language.includes('bn') ||
      // You can add more detection logic here
      false;

    const location: UserLocation = isLikelyBangladesh 
      ? {
          country: 'Bangladesh',
          countryCode: 'BD',
          currency: 'BDT',
          isBangladesh: true,
          locale: 'en-US'  // Changed from 'bn-BD' to 'en-US' to ensure English text
        }
      : {
          country: 'United States',
          countryCode: 'US',
          currency: 'USD',
          isBangladesh: false,
          locale: 'en-US'
        };

    localStorage.setItem('userLocation', JSON.stringify(location));
    return location;
  } catch (error) {
    console.warn('Geo-detection failed, defaulting to international:', error);
    return {
      country: 'United States',
      countryCode: 'US',
      currency: 'USD',
      isBangladesh: false,
      locale: 'en-US'
    };
  }
};

// Format currency based on location
export const formatPrice = (amount: number, currency: string): string => {
  if (currency === 'BDT') {
    return `৳${amount.toLocaleString('bn-BD')}`;
  } else {
    return `$${amount.toFixed(2)}`;
  }
};

// Get pricing structure based on location
export const getPricingStructure = (isBangladesh: boolean) => {
  if (isBangladesh) {
    return {
      currency: 'BDT',
      currencySymbol: '৳',
      packs: [
        { quantity: 1, price: 300, savings: 0, label: 'Single Pack' },
        { quantity: 3, price: 900, savings: 0, label: '3 Packs' },
        { quantity: 5, price: 1500, savings: 0, label: '5 Packs - BEST VALUE' }
      ],
      delivery: {
        cost: 0,
        time: '2-3 business days',
        freeDelivery: true
      },
      paymentMethods: [
        { id: 'cod', name: 'Cash on Delivery', popular: true },
        { id: 'bkash', name: 'bKash' },
        { id: 'bank', name: 'Bank Transfer' }
      ]
    };
  } else {
    return {
      currency: 'USD',
      currencySymbol: '$',
      packs: [
        { quantity: 1, price: 15, savings: 0, label: 'Single Pack' },
        { quantity: 3, price: 40, savings: 5, label: '3 Packs - Save $5' },
        { quantity: 5, price: 60, savings: 15, label: '5 Packs - Save $15 (BEST VALUE)' }
      ],
      delivery: {
        cost: 'calculated',
        time: '7-14 business days',
        freeDelivery: false
      },
      paymentMethods: [
        { id: 'paypal', name: 'PayPal' },
        { id: 'card', name: 'Credit/Debit Card' },
        { id: 'international-bank', name: 'International Bank Transfer' }
      ]
    };
  }
};