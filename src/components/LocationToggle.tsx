import { useState } from 'react';

export const LocationToggle = ({ onLocationChange }: { onLocationChange: (isBangladesh: boolean) => void }) => {
  const [isBangladesh, setIsBangladesh] = useState(false);

  const toggleLocation = () => {
    const newLocation = !isBangladesh;
    setIsBangladesh(newLocation);
    // Save to localStorage for persistent preference
    const locationData = {
      country: newLocation ? 'Bangladesh' : 'United States',
      countryCode: newLocation ? 'BD' : 'US',
      currency: newLocation ? 'BDT' : 'USD',
      isBangladesh: newLocation,
      locale: newLocation ? 'bn-BD' : 'en-US'
    };
    localStorage.setItem('userLocation', JSON.stringify(locationData));
    onLocationChange(newLocation);
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-white rounded-xl shadow-lg p-4 border border-gray-200">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700">
          {isBangladesh ? '🇧🇩 Bangladesh' : '🇺🇸 International'}
        </span>
        <button
          onClick={toggleLocation}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#9B7BB5] focus:ring-offset-2 ${
            isBangladesh ? 'bg-[#9B7BB5]' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isBangladesh ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-1">
        {isBangladesh 
          ? '৳300/pack • FREE Delivery • COD Available' 
          : '$15/pack • Intl Shipping • PayPal/Card'}
      </p>
    </div>
  );
};