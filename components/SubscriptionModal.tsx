import React, { useState } from 'react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CheckmarkIcon: React.FC = () => (
    <svg className="h-6 w-6 text-teal-400 mr-3 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);


const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose }) => {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleSubscribeClick = async () => {
    setIsRedirecting(true);

    // Simulate an API call to a backend to create a Stripe Checkout session.
    await new Promise(resolve => setTimeout(resolve, 1500));

    // In a real app, you would get a URL from your backend and redirect.
    // Here, we simulate the redirect back to our app with a success flag.
    const successUrl = `${window.location.origin}${window.location.pathname}?success=true`;
    window.location.href = successUrl;
  };
  
  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
    >
      <div 
        className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-md transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-8">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-white mb-2">Unlock Unlimited Colorizing</h2>
                <p className="text-slate-400 mb-6">Go premium to colorize as many photos as you want, anytime.</p>
            </div>
            
            <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                    <CheckmarkIcon />
                    <span className="text-slate-300">Unlimited Photo Colorizations</span>
                </li>
                <li className="flex items-center">
                    <CheckmarkIcon />
                    <span className="text-slate-300">Background removal is always free</span>
                </li>
                 <li className="flex items-center">
                    <CheckmarkIcon />
                    <span className="text-slate-300">Priority Processing</span>
                </li>
            </ul>

            <button 
                onClick={handleSubscribeClick}
                disabled={isRedirecting}
                className="w-full bg-indigo-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-indigo-500 transition-all duration-300 transform hover:scale-105 shadow-lg text-lg flex items-center justify-center disabled:bg-indigo-400 disabled:scale-100 disabled:cursor-wait"
            >
                {isRedirecting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Redirecting to payment...
                  </>
                ) : (
                  'Subscribe for $10/month'
                )}
            </button>
            <button 
                onClick={onClose}
                disabled={isRedirecting}
                className="w-full mt-4 text-slate-400 hover:text-white transition-colors disabled:opacity-50"
            >
                Maybe later
            </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;