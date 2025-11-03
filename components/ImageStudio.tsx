import React, { useState, useCallback } from 'react';
import { Mode } from '../types';
import { processImage } from '../services/geminiService';
import { fileToDataUrl, dataUrlToBase64, getMimeTypeFromDataUrl } from '../utils/fileUtils';
import ImageUploader from './ImageUploader';
import ImageComparisonSlider from './ImageComparisonSlider';
import DownloadIcon from './icons/DownloadIcon';
import Spinner from './Spinner';

interface ImageStudioProps {
  mode: Mode;
}

const ImageStudio: React.FC<ImageStudioProps> = ({ mode }) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const prompts = {
    [Mode.Colorize]: 'Colorize this black and white photograph. Enhance the colors to be realistic and natural, preserving the original details.',
    [Mode.RemoveBackground]: 'Remove the background from this image. The subject should be perfectly isolated. Make the new background transparent.',
  };

  const handleImageUpload = async (file: File) => {
    setError(null);
    setProcessedImage(null);
    try {
      const dataUrl = await fileToDataUrl(file);
      setUploadedImage(dataUrl);
    } catch (err) {
      setError('Failed to read the image file.');
      console.error(err);
    }
  };
  
  const handleProcessImage = useCallback(async () => {
    if (!uploadedImage) return;

    setIsLoading(true);
    setError(null);
    try {
      const base64 = dataUrlToBase64(uploadedImage);
      const mimeType = getMimeTypeFromDataUrl(uploadedImage);
      const prompt = prompts[mode];
      
      const resultBase64 = await processImage(base64, mimeType, prompt);
      
      const resultMimeType = resultBase64.startsWith('/9j/') ? 'image/jpeg' : 'image/png';
      setProcessedImage(`data:${resultMimeType};base64,${resultBase64}`);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [uploadedImage, mode, prompts]);
  
  const handleReset = () => {
    setUploadedImage(null);
    setProcessedImage(null);
    setError(null);
    setIsLoading(false);
  };

  const handleDownload = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    const extension = getMimeTypeFromDataUrl(processedImage).split('/')[1] || 'png';
    link.download = `enhanced-image.${extension}`;
    link.href = processedImage;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!uploadedImage) {
    return <ImageUploader onImageUpload={handleImageUpload} mode={mode} />;
  }

  return (
    <div className="bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-700 flex flex-col items-center">
      {isLoading && <Spinner mode={mode}/>}
      
      {error && !isLoading && (
        <div className="mb-4 text-center bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg">
          <p className="font-bold">An error occurred</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {!isLoading && processedImage && uploadedImage && (
        <ImageComparisonSlider beforeImage={uploadedImage} afterImage={processedImage} />
      )}
      
      {!isLoading && !processedImage && uploadedImage && (
        <div className="w-full flex justify-center mb-6">
            <div className="relative inline-block">
              <img src={uploadedImage} alt="Ready to process" className="max-w-full max-h-[60vh] rounded-lg shadow-md" />
            </div>
        </div>
      )}

      <div className="mt-6 flex flex-wrap justify-center gap-4">
        {!isLoading && !processedImage && (
          <button
              onClick={handleProcessImage}
              className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-full hover:bg-indigo-500 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
          >
              {mode === Mode.Colorize ? 'Start Colorizing' : 'Remove Background'}
          </button>
        )}
        
        {processedImage && !isLoading && (
            <button
                onClick={handleDownload}
                className="bg-teal-500 text-white font-bold py-3 px-6 rounded-full hover:bg-teal-400 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
            >
                <DownloadIcon />
                Download Image
            </button>
        )}
        
        <button
            onClick={handleReset}
            className="bg-slate-700 text-slate-300 font-bold py-3 px-6 rounded-full hover:bg-slate-600 transition-all duration-300"
        >
            Upload New Image
        </button>
      </div>
    </div>
  );
};

export default ImageStudio;