import React from 'react';
import { SocialLinkItem } from '../data/seedData';

export type SocialPlatformName = SocialLinkItem['platform'];

export const SOCIAL_PLATFORM_META: Record<
  SocialPlatformName,
  { label: string; brandColor: string; hoverBgClass: string }
> = {
  whatsapp: {
    label: 'WhatsApp',
    brandColor: '#25D366',
    hoverBgClass: 'hover:bg-[#25D366] hover:text-white hover:border-[#25D366]',
  },
  facebook: {
    label: 'Facebook',
    brandColor: '#1877F2',
    hoverBgClass: 'hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]',
  },
  instagram: {
    label: 'Instagram',
    brandColor: '#E4405F',
    hoverBgClass: 'hover:bg-[#E4405F] hover:text-white hover:border-[#E4405F]',
  },
  twitter: {
    label: 'Twitter / X',
    brandColor: '#1DA1F2',
    hoverBgClass: 'hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2]',
  },
  youtube: {
    label: 'YouTube',
    brandColor: '#FF0000',
    hoverBgClass: 'hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000]',
  },
  linkedin: {
    label: 'LinkedIn',
    brandColor: '#0A66C2',
    hoverBgClass: 'hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2]',
  },
  telegram: {
    label: 'Telegram',
    brandColor: '#26A5E4',
    hoverBgClass: 'hover:bg-[#26A5E4] hover:text-white hover:border-[#26A5E4]',
  },
};

export const SocialPlatformIcon: React.FC<{
  platform: SocialPlatformName | string;
  className?: string;
}> = ({ platform, className = 'w-4 h-4' }) => {
  const key = platform.toLowerCase();

  switch (key) {
    case 'whatsapp':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          className={className}
        >
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm5.82 14.01c-.24.68-1.41 1.3-1.95 1.38-.5.08-1.13.11-1.83-.11-.42-.13-.97-.31-1.67-.61-2.94-1.27-4.86-4.23-5.01-4.43-.15-.2-1.2-1.59-1.2-3.04 0-1.45.76-2.16 1.03-2.45.27-.29.59-.37.79-.37.2 0 .4.01.57.01.18 0 .43-.07.67.51.24.59.83 2.03.9 2.18.07.15.12.32.02.52-.1.2-.15.32-.3.49-.15.17-.31.38-.44.51-.15.15-.3.31-.13.61.17.29.76 1.25 1.63 2.03 1.12 1 2.06 1.31 2.36 1.46.29.15.46.12.64-.07.18-.2.74-.86.93-1.15.2-.29.39-.24.66-.15.27.1 1.71.81 2.01.96.29.15.49.22.56.34.08.12.08.71-.16 1.39z" />
        </svg>
      );
    case 'facebook':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          className={className}
        >
          <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
        </svg>
      );
    case 'instagram':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          className={className}
        >
          <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6zm9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
        </svg>
      );
    case 'twitter':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          className={className}
        >
          <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
        </svg>
      );
    case 'youtube':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          className={className}
        >
          <path d="M21.58 7.19a2.51 2.51 0 0 0-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42a2.51 2.51 0 0 0-1.77 1.77C2 8.75 2 12 2 12s0 3.25.42 4.81a2.51 2.51 0 0 0 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42a2.51 2.51 0 0 0 1.77-1.77C22 15.25 22 12 22 12s0-3.25-.42-4.81zM10 15V9l5.2 3-5.2 3z" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          className={className}
        >
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68zm1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
      );
    case 'telegram':
    default:
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          className={className}
        >
          <path d="M11.94 2C6.45 2 2 6.45 2 11.94s4.45 9.94 9.94 9.94 9.94-4.45 9.94-9.94S17.43 2 11.94 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.67-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.37-.49 1.02-.74 3.99-1.74 6.65-2.89 7.99-3.45 3.8-1.58 4.59-1.86 5.1-1.87.11 0 .37.03.53.16.14.11.18.26.2.37.02.08.04.29.02.43z" />
        </svg>
      );
  }
};

/**
 * Helper to read an image File from <input type="file" accept="image/*" />
 * and compress/resize it into a crisp Data URL suitable for localStorage persistence.
 */
export function readAndCompressImageFile(
  file: File,
  maxSizePx = 360,
  preserveTransparency = false
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = () => {
      const dataUrl = String(reader.result || '');
      if (file.type === 'image/svg+xml') {
        resolve(dataUrl);
        return;
      }
      const img = new Image();
      img.onerror = () => resolve(dataUrl);
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          if (width > height && width > maxSizePx) {
            height = Math.round((height * maxSizePx) / width);
            width = maxSizePx;
          } else if (height >= width && height > maxSizePx) {
            width = Math.round((width * maxSizePx) / height);
            height = maxSizePx;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            if (preserveTransparency && (file.type === 'image/png' || file.type === 'image/webp')) {
              resolve(canvas.toDataURL('image/png'));
            } else {
              resolve(canvas.toDataURL('image/jpeg', 0.85));
            }
          } else {
            resolve(dataUrl);
          }
        } catch {
          resolve(dataUrl);
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  });
}

