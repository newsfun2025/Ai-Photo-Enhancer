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
        ],
        [Mode.RemoveWatermark]: [
            "Analyzing image for watermarks...",
            "Reconstructing background details...",
            "Seamlessly inpainting...",
            "Erasing the final traces...",
        ],
        [Mode.Compress]: [
            "Optimizing image data...",
            "Finding the perfect balance...",
            "Shrinking pixels...",
            "Applying compression algorithm...",
        ],
        [Mode.Convert]: [
            "Reading image data...",
            "Re-encoding pixels...",
            "Changing file format...",
            "Finalizing conversion...",
        ]
    }
    const [message, setMessage] = React.useState(messages[mode][0]);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setMessage(prev => {
                const currentMessages = messages[mode] || [];
                if (currentMessages.length === 0) return '';
                const currentIndex = currentMessages.indexOf(prev);
                const nextIndex = (currentIndex + 1) % currentMessages.length;
                return currentMessages[nextIndex];
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
