export const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

export const dataUrlToBase64 = (dataUrl: string): string => {
  return dataUrl.split(',')[1];
};

export const getMimeTypeFromDataUrl = (dataUrl: string): string => {
  return dataUrl.substring(dataUrl.indexOf(':') + 1, dataUrl.indexOf(';'));
};

// FIX: Add missing getCroppedImg function.
// This function takes an image element and crop parameters to return a new cropped image as a data URL.
export const getCroppedImg = (
  image: HTMLImageElement,
  crop: { x: number; y: number; width: number; height: number }
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width;
    canvas.height = crop.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return reject(new Error('Could not get canvas context.'));
    }

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    // Get the data URL. The default format is 'image/png'.
    resolve(canvas.toDataURL());
  });
};

interface CompressOptions {
  quality: number; // 0-100
  width?: number;
  height?: number;
}

export const compressImage = (
  dataUrl: string,
  options: CompressOptions
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      
      const targetWidth = options.width || image.naturalWidth;
      const targetHeight = options.height || image.naturalHeight;
      
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(new Error('Could not get canvas context.'));
      }

      ctx.drawImage(image, 0, 0, targetWidth, targetHeight);

      // Using image/jpeg for effective, quality-based compression.
      const compressedDataUrl = canvas.toDataURL('image/jpeg', options.quality / 100);
      resolve(compressedDataUrl);
    };
    image.onerror = (error) => {
      reject(new Error('Failed to load image for compression.'));
    };
    image.src = dataUrl;
  });
};

export type ImageFormat = 'png' | 'jpeg' | 'webp';

export const convertImage = (
  dataUrl: string,
  format: ImageFormat,
  quality: number = 92 // default quality for jpeg/webp
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(new Error('Could not get canvas context.'));
      }
      ctx.drawImage(image, 0, 0);
      const mimeType = `image/${format}`;
      // Note: toDataURL for 'image/png' ignores the quality parameter.
      const convertedDataUrl = canvas.toDataURL(mimeType, quality / 100);
      resolve(convertedDataUrl);
    };
    image.onerror = (error) => {
      reject(new Error('Failed to load image for conversion.'));
    };
    image.src = dataUrl;
  });
};