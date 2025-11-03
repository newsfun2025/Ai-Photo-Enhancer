import React, { useState, useCallback } from 'react';
import { Mode } from '../types';
import { processImage } from '../services/geminiService';
import { fileToDataUrl, dataUrlToBase64, getMimeTypeFromDataUrl, compressImage, convertImage, ImageFormat } from '../utils/fileUtils';
import ImageUploader from './ImageUploader';
import ImageComparisonSlider from './ImageComparisonSlider';
import DownloadIcon from './icons/DownloadIcon';
import Spinner from './Spinner';
import LockIcon from './icons/LockIcon';
import UnlockIcon from './icons/UnlockIcon';

interface ImageStudioProps {
  mode: Mode;
}

interface ImageInfo {
    size: string;
    type: string;
}

const ImageStudio: React.FC<ImageStudioProps> = ({ mode }) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [originalInfo, setOriginalInfo] = useState<ImageInfo | null>(null);
  
  // State for compression
  const [quality, setQuality] = useState<number>(80);
  const [targetWidth, setTargetWidth] = useState<number>(0);
  const [targetHeight, setTargetHeight] = useState<number>(0);
  const [aspectRatio, setAspectRatio] = useState<number>(1);
  const [isAspectRatioLocked, setIsAspectRatioLocked] = useState<boolean>(true);

  // State for conversion
  const [targetFormat, setTargetFormat] = useState<ImageFormat>('png');


  const prompts = {
    [Mode.Colorize]: `You are a world-leading digital photo archivist and restoration master. You have been tasked with restoring a precious, severely aged photograph. Your goal is not just to colorize it, but to bring it back to life with the utmost care, precision, and historical accuracy, as if it were a museum piece.

Your process must be meticulous. Execute the following steps in order:

1.  **Comprehensive Damage Assessment & Repair:**
    *   **Initial Analysis:** First, perform a deep analysis of the entire image to identify all forms of degradation. This includes, but is not limited to: major scratches, tears, creases, folds, severe fading, water damage, chemical stains, silvering-out in dark areas, dust, and mold spots.
    *   **Structural Reconstruction:** For areas with significant damage or missing information, intelligently reconstruct the details based on the surrounding context. For example, if a part of a face is obscured, rebuild it seamlessly using the visible features as a guide.
    *   **Texture and Tone Restoration:** Correct the tonal range. Balance the contrast and exposure to recover lost details in both the deep shadows and the bright highlights before proceeding. The goal is a full, rich tonal foundation.

2.  **Masterful & Historically-Accurate Colorization:**
    *   **Research & Palette:** Apply colors that are not only realistic but also historically and contextually accurate for the era the photo was taken.
    *   **Subtle Tonality:** Pay extreme attention to the subtleties of color. Skin tones should have multiple hues and gradations, reflecting blood flow and light. Avoid flat, artificial-looking skin. Clothing should show texture and fabric type through color variations.
    *   **Atmospheric Realism:** The colors should reflect the lighting conditions of the original scene (e.g., warm sunlight, cool indoor light). Create a sense of depth and atmosphere.

3.  **Final Enhancement to Archival Quality:**
    *   **Intelligent Sharpening & Noise Reduction:** Enhance the image to a crisp, high-definition state. Apply intelligent, content-aware sharpening that clarifies details without creating artificial halos or exaggerating grain. If noise is present, reduce it carefully, preserving essential texture.
    *   **Final Polish:** Perform a final check to ensure all elements are harmonious. The final result should be a pristine, high-resolution digital photograph that looks completely natural and honors the original subject. It should not look overly processed or 'AI-generated'.`,
    [Mode.RemoveBackground]: 'Remove the background from this image. The subject should be perfectly isolated. Make the new background transparent.',
    [Mode.RemoveWatermark]: `You are an expert digital image restoration specialist with a focus on inpainting and object removal. Your task is to completely remove any and all watermarks from this image.

1.  **Identify the Watermark(s):** Carefully scan the image to locate all watermarks. They could be text, logos, or patterns, and might be transparent, opaque, or tiled across the image.
2.  **Analyze the Surrounding Area:** For each part of the watermark, analyze the pixels immediately surrounding it. Understand the textures, colors, gradients, and patterns of the background that the watermark is covering.
3.  **Seamless Inpainting:** Intelligently fill in the area where the watermark was. Reconstruct the background perfectly, making it look as if the watermark was never there. The final image should have no artifacts, blurs, or discolored patches where the watermark used to be. The result must be seamless and completely natural.`,
  };

  const getFileInfo = (dataUrl: string): ImageInfo => {
    const sizeInBytes = Math.round(dataUrl.length * (3 / 4));
    const size = sizeInBytes > 1024 * 1024 ? `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB` : `${(sizeInBytes / 1024).toFixed(2)} KB`;
    const type = getMimeTypeFromDataUrl(dataUrl).split('/')[1]?.toUpperCase() || 'UNKNOWN';
    return { size, type };
  };

  const handleImageUpload = async (file: File) => {
    setError(null);
    setProcessedImage(null);
    try {
      const dataUrl = await fileToDataUrl(file);
      setUploadedImage(dataUrl);
      setOriginalInfo(getFileInfo(dataUrl));

      if (mode === Mode.Compress) {
        const image = new Image();
        image.onload = () => {
          setTargetWidth(image.naturalWidth);
          setTargetHeight(image.naturalHeight);
          setAspectRatio(image.naturalWidth / image.naturalHeight);
        };
        image.src = dataUrl;
      }

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
      if (mode === Mode.Compress) {
        const compressedDataUrl = await compressImage(uploadedImage, {
          quality,
          width: targetWidth,
          height: targetHeight
        });
        setProcessedImage(compressedDataUrl);
      } else if (mode === Mode.Convert) {
        const convertedDataUrl = await convertImage(uploadedImage, targetFormat);
        setProcessedImage(convertedDataUrl);
      }
      else {
        const base64 = dataUrlToBase64(uploadedImage);
        const mimeType = getMimeTypeFromDataUrl(uploadedImage);
        const prompt = prompts[mode as Mode.Colorize | Mode.RemoveBackground | Mode.RemoveWatermark];
        
        const resultBase64 = await processImage(base64, mimeType, prompt);
        
        const resultMimeType = resultBase64.startsWith('/9j/') ? 'image/jpeg' : 'image/png';
        setProcessedImage(`data:${resultMimeType};base64,${resultBase64}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [uploadedImage, mode, prompts, quality, targetWidth, targetHeight, targetFormat]);
  
  const handleReset = () => {
    setUploadedImage(null);
    setProcessedImage(null);
    setError(null);
    setIsLoading(false);
    setOriginalInfo(null);
    // Reset compression state
    setQuality(80);
    setTargetWidth(0);
    setTargetHeight(0);
    setAspectRatio(1);
    setIsAspectRatioLocked(true);
    // Reset conversion state
    setTargetFormat('png');
  };

  const handleDownload = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    let extension: ImageFormat | 'png' = 'png';
    
    if (mode === Mode.Compress) {
      extension = 'jpeg';
    } else if (mode === Mode.Convert) {
      extension = targetFormat;
    } else {
      extension = (getMimeTypeFromDataUrl(processedImage).split('/')[1] as ImageFormat) || 'png';
    }

    link.download = `processed-image.${extension}`;
    link.href = processedImage;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newWidth = parseInt(e.target.value, 10) || 0;
      setTargetWidth(newWidth);
      if(isAspectRatioLocked) {
          setTargetHeight(Math.round(newWidth / aspectRatio));
      }
  }

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newHeight = parseInt(e.target.value, 10) || 0;
      setTargetHeight(newHeight);
      if(isAspectRatioLocked) {
          setTargetWidth(Math.round(newHeight * aspectRatio));
      }
  }


  if (!uploadedImage) {
    return <ImageUploader onImageUpload={handleImageUpload} mode={mode} />;
  }
  
  const getButtonText = () => {
    switch(mode) {
        case Mode.Colorize: return 'Start Colorizing';
        case Mode.RemoveBackground: return 'Remove Background';
        case Mode.RemoveWatermark: return 'Remove Watermark';
        case Mode.Compress: return 'Compress Image';
        case Mode.Convert: return `Convert to ${targetFormat.toUpperCase()}`;
    }
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

      {(mode === Mode.Colorize || mode === Mode.RemoveBackground || mode === Mode.RemoveWatermark) && !isLoading && processedImage && uploadedImage && (
        <ImageComparisonSlider 
          beforeImage={uploadedImage} 
          afterImage={processedImage} 
        />
      )}

      {(mode === Mode.Compress || mode === Mode.Convert) && !isLoading && processedImage && uploadedImage && (
        <div className="w-full text-center">
          <h3 className="text-2xl font-bold mb-4">{mode === Mode.Compress ? 'Compression' : 'Conversion'} Result</h3>
          <div className="flex flex-col md:flex-row gap-8 items-start justify-center">
              <div className="flex-1">
                  <h4 className="text-lg font-semibold text-slate-300 mb-2">Original</h4>
                  <img src={uploadedImage} alt="Original" className="max-w-full max-h-[40vh] rounded-lg shadow-md mx-auto" />
                  <p className="mt-2 text-slate-400 font-mono">{originalInfo?.size} ({originalInfo?.type})</p>
              </div>
              <div className="flex-1">
                  <h4 className="text-lg font-semibold text-teal-300 mb-2">{mode === Mode.Compress ? 'Compressed' : 'Converted'}</h4>
                  <img src={processedImage} alt="Processed" className="max-w-full max-h-[40vh] rounded-lg shadow-md mx-auto" />
                  <p className="mt-2 text-teal-400 font-mono">{getFileInfo(processedImage).size} ({getFileInfo(processedImage).type})</p>
              </div>
          </div>
        </div>
      )}
      
      {!isLoading && !processedImage && uploadedImage && (
        <div className="w-full flex justify-center mb-6">
            <div className="relative inline-block">
              <img 
                src={uploadedImage} 
                alt={'Original upload'} 
                className="max-w-full max-h-[60vh] rounded-lg shadow-md" 
              />
            </div>
        </div>
      )}

      <div className="mt-6 flex flex-col items-center gap-6 w-full">
        {mode === Mode.Compress && !isLoading && !processedImage && (
          <div className="w-full max-w-lg bg-slate-700/50 p-4 rounded-lg space-y-4">
            <div>
              <label htmlFor="quality" className="block text-sm font-medium text-slate-300 mb-2">
                Quality <span className="font-bold text-white">{quality}</span> (Lower value = smaller file)
              </label>
              <input
                id="quality"
                type="range"
                min="1"
                max="100"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
            <div>
               <label className="block text-sm font-medium text-slate-300 mb-2">
                Dimensions (Width x Height)
              </label>
              <div className="flex items-center gap-2">
                <input 
                  type="number"
                  value={targetWidth}
                  onChange={handleWidthChange}
                  className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 text-center text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  aria-label="Image width"
                />
                 <span className="text-slate-400">x</span>
                 <input 
                  type="number"
                  value={targetHeight}
                  onChange={handleHeightChange}
                  className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 text-center text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  aria-label="Image height"
                />
                <button 
                    onClick={() => setIsAspectRatioLocked(prev => !prev)}
                    className="p-2 bg-slate-600 hover:bg-slate-500 rounded-md transition-colors"
                    aria-label={isAspectRatioLocked ? 'Unlock aspect ratio' : 'Lock aspect ratio'}
                    title={isAspectRatioLocked ? 'Unlock aspect ratio' : 'Lock aspect ratio'}
                >
                    {isAspectRatioLocked ? <LockIcon /> : <UnlockIcon />}
                </button>
              </div>
            </div>
          </div>
        )}

        {mode === Mode.Convert && !isLoading && !processedImage && (
            <div className="w-full max-w-md bg-slate-700/50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-center text-slate-300 mb-3">
                    Choose an output format:
                </label>
                <div className="flex justify-center bg-slate-800 rounded-full p-1 shadow-inner">
                    {(['png', 'jpeg', 'webp'] as ImageFormat[]).map(format => (
                        <button
                            key={format}
                            onClick={() => setTargetFormat(format)}
                            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 ${
                                targetFormat === format ? 'bg-indigo-600 text-white shadow' : 'text-slate-300 hover:bg-slate-700'
                            }`}
                        >
                            {format.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>
        )}

        <div className="flex flex-wrap justify-center gap-4">
          {!isLoading && !processedImage && (
            <button
                onClick={handleProcessImage}
                className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-full hover:bg-indigo-500 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
            >
                {getButtonText()}
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
    </div>
  );
};

export default ImageStudio;
