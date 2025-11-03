import React, { useState, useRef } from 'react';
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop';
import { getCroppedImg } from '../utils/fileUtils';

interface ImageCropperProps {
  src: string;
  onCropComplete: (croppedDataUrl: string) => void;
  onCancel: () => void;
}

const ASPECT_RATIOS = [
  { value: undefined, text: 'Free' },
  { value: 1 / 1, text: '1:1' },
  { value: 4 / 3, text: '4:3' },
  { value: 16 / 9, text: '16:9' },
];

const ImageCropper: React.FC<ImageCropperProps> = ({ src, onCropComplete, onCancel }) => {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<Crop>();
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const imgRef = useRef<HTMLImageElement>(null);

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    const initialCrop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        aspect,
        width,
        height
      ),
      width,
      height
    );
    setCrop(initialCrop);
    setCompletedCrop(initialCrop);
  }

  const handleConfirmCrop = async () => {
    if (completedCrop && imgRef.current) {
      try {
        const croppedDataUrl = await getCroppedImg(imgRef.current, completedCrop);
        onCropComplete(croppedDataUrl);
      } catch (error) {
        console.error('Error cropping image:', error);
      }
    }
  };

  return (
    <div className="bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-700 flex flex-col items-center w-full">
      <h2 className="text-2xl font-bold text-slate-200 mb-4">Crop Your Image</h2>
      <p className="text-slate-400 mb-4">Adjust the selection to focus on the most important part of your photo.</p>
      
      <div className="flex justify-center w-full max-w-2xl mb-4">
        <ReactCrop
          crop={crop}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          onComplete={(c) => setCompletedCrop(c)}
          aspect={aspect}
          minWidth={50}
          minHeight={50}
        >
          <img
            ref={imgRef}
            alt="Crop me"
            src={src}
            onLoad={onImageLoad}
            className="max-h-[60vh] object-contain"
          />
        </ReactCrop>
      </div>

      <div className="mb-6">
        <span className="text-sm font-semibold text-slate-300 mr-3">Aspect Ratio:</span>
        <div className="inline-flex bg-slate-700 rounded-md p-1 shadow-inner">
          {ASPECT_RATIOS.map(ratio => (
            <button
              key={ratio.text}
              onClick={() => setAspect(ratio.value)}
              className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500 ${
                aspect === ratio.value ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-600'
              }`}
            >
              {ratio.text}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={handleConfirmCrop}
          disabled={!completedCrop?.width || !completedCrop?.height}
          className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-full hover:bg-indigo-500 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:bg-slate-500 disabled:cursor-not-allowed disabled:scale-100"
        >
          Confirm Crop
        </button>
        <button
          onClick={onCancel}
          className="bg-slate-600 text-slate-200 font-bold py-3 px-6 rounded-full hover:bg-slate-500 transition-all duration-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ImageCropper;