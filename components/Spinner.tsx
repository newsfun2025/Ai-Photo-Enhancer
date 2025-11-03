
import React from 'react';
import { Mode } from '../types';

interface SpinnerProps {
    mode: Mode;
}

const Spinner: React.FC<SpinnerProps> = ({ mode }) => {
    const messages = {
        [Mode.Colorize]: [
            "Analyzing photo structure...",
            "Applying historical color palettes...",
            "Rendering vibrant details...",
            "Bringing memories to life...",
        ],
        [Mode.RemoveBackground]: [
            "Scanning for the main subject...",
            "Creating a precision mask...",
            "Isolating pixels...",
            "Finalizing transparent background...",
        ]
    }
    const [message, setMessage] = React.useState(messages[mode][0]);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setMessage(prev => {
                const currentIndex = messages[mode].indexOf(prev);
                const nextIndex = (currentIndex + 1) % messages[mode].length;
                return messages[mode][nextIndex];
            });
        }, 2500);
        return () => clearInterval(interval);
    }, [mode, messages]);


  return (
    <div className="absolute inset-0 bg-slate-800/80 backdrop-blur-sm flex flex-col items-center justify-center z-20 rounded-2xl">
      <div className="w-16 h-16 border-4 border-t-indigo-400 border-slate-600 rounded-full animate-spin"></div>
      <p className="mt-4 text-slate-300 text-lg font-semibold animate-pulse">{message}</p>
    </div>
  );
};

export default Spinner;
