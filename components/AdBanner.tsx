import React, { useEffect } from 'react';

// Make adsbygoogle available on the window object
declare global {
  interface Window {
    adsbygoogle?: { [key: string]: unknown }[];
  }
}

const AdBanner: React.FC = () => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  return (
    <div className="w-full bg-slate-800 p-4 rounded-lg text-center border border-slate-700">
      {/* 
        This is your AdSense ad unit.
        IMPORTANT: 
        1. Replace 'ca-pub-YOUR_PUBLISHER_ID' with your real AdSense Publisher ID.
        2. Replace 'YOUR_AD_SLOT_ID' with the ID for this specific ad unit.
      */}
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
        data-ad-slot="YOUR_AD_SLOT_ID"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
      <p className="text-xs text-slate-500 mt-2">Advertisement</p>
    </div>
  );
};

export default AdBanner;
