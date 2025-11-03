import React, { useState, useCallback } from 'react';
import { Mode } from '../types';
import PhotoIcon from './icons/PhotoIcon';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  mode: Mode;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, mode }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  }, [onImageUpload]);

  const uploaderText = {
    [Mode.Colorize]: {
        title: "Upload a Black & White Photo",
        description: "Drag and drop or click to select a file"
    },
    [Mode.RemoveBackground]: {
        title: "Upload an Image",
        description: "Drag and drop or click to remove its background"
    },
    [Mode.RemoveWatermark]: {
        title: "Upload an Image with a Watermark",
        description: "Drag and drop or click to select a file to remove the watermark"
    },
    [Mode.Compress]: {
        title: "Upload an Image to Compress",
        description: "Reduce file size while preserving quality"
    },
    [Mode.Convert]: {
        title: "Upload an Image to Convert",
        description: "Change image format to PNG, JPEG, or WEBP"
    }
  }

  return (
    <div
      className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-colors duration-300 ${
        isDragging ? 'border-indigo-400 bg-slate-800/50' : 'border-slate-600 hover:border-slate-500 bg-slate-800/20'
      }`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        type="file"
        id="file-upload"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
      />
      <div className="flex flex-col items-center justify-center space-y-4 text-slate-400">
        <PhotoIcon className="w-16 h-16" />
        <p className="text-xl font-semibold text-slate-200">{uploaderText[mode].title}</p>
        <p>{uploaderText[mode].description}</p>
        <label
          htmlFor="file-upload"
          className="mt-4 cursor-pointer inline-block bg-indigo-600 text-white font-semibold py-2 px-5 rounded-full hover:bg-indigo-500 transition-colors"
        >
          Choose File
        </label>
      </div>
    </div>
  );
};

export default ImageUploader;
