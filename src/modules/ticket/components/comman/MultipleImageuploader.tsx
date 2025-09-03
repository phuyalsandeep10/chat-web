'use client';

import React, { useState } from 'react';
import ErrorText from '@/components/common/hook-form/ErrorText';
import { Icons } from '@/components/ui/Icons';
import Image from 'next/image';

interface UploadedImage {
  url: string;
  name: string;
  size: string;
}

interface ImageUploaderProps {
  onImagesSelect: (images: string[]) => void;
  previewImages?: string[];
  wrapperClassName?: string;
  labelClickText?: string;
  labelRestText?: string;
  descriptionText?: string;
  label?: string;
}

const MultiImageUploader: React.FC<ImageUploaderProps> = ({
  onImagesSelect,
  previewImages = [],
  wrapperClassName = 'relative flex h-[300px] w-[383px] flex-col items-center justify-center rounded-md border',
  labelClickText = 'Click to upload',
  labelRestText = 'or drag and drop SVG, PNG, JPG.',
  descriptionText = 'Upload PNG or JPG files, up to 10 MB each.',
  label,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<UploadedImage[]>([]);

  const formatFileSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const acceptedTypes = ['image/jpeg', 'image/png'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    const validFiles: File[] = [];
    const errors: string[] = [];

    Array.from(files).forEach((file) => {
      if (!acceptedTypes.includes(file.type)) {
        errors.push(`${file.name}: Invalid format.`);
        return;
      }
      if (file.size > maxSize) {
        errors.push(`${file.name}: Exceeds 10MB.`);
        return;
      }
      validFiles.push(file);
    });

    if (errors.length > 0) {
      setError(errors.join(' '));
      return;
    }

    setError(null);

    const readers = validFiles.map(
      (file) =>
        new Promise<UploadedImage>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () =>
            resolve({
              url: reader.result as string,
              name: file.name,
              size: formatFileSize(file.size),
            });
          reader.readAsDataURL(file);
        }),
    );

    Promise.all(readers).then((uploadedImages) => {
      const updatedImages = [...images, ...uploadedImages];
      setImages(updatedImages);
      onImagesSelect(updatedImages.map((img) => img.url));
    });
  };

  const removeImage = (idx: number) => {
    const updatedImages = images.filter((_, i) => i !== idx);
    setImages(updatedImages);
    onImagesSelect(updatedImages.map((img) => img.url));
  };

  const triggerFileInput = () => {
    document.getElementById('imageUploadInput')?.click();
  };

  return (
    <>
      {label && (
        <label className="text-brand-dark font-outfit text-sm leading-[21px] font-semibold">
          {label}
        </label>
      )}

      <div className="mt-2 flex flex-col">
        <div className={`${wrapperClassName} relative`}>
          {/* Show "Change" icon only after images are uploaded */}
          {images.length > 0 && (
            <button
              type="button"
              onClick={triggerFileInput}
              className="absolute top-2 right-2 z-10 cursor-pointer rounded-full bg-white p-1 shadow"
              title="Change images"
            >
              <Icons.folderPlus className="text-brand-primary h-5 w-5" />
            </button>
          )}

          {images.length === 0 ? (
            <label
              htmlFor="imageUploadInput"
              className="text-theme-text-dark flex h-full cursor-pointer flex-col items-center justify-center gap-2 rounded-[8px] bg-white px-4 py-2.5"
              style={{ userSelect: 'none' }}
            >
              <Icons.download_cloud className="text-brand-primary h-7 w-8" />
              <div className="text-center">
                <span className="text-brand-primary text-lg leading-7 font-semibold underline">
                  {labelClickText}
                </span>{' '}
                <span>{labelRestText}</span>
              </div>
            </label>
          ) : (
            // Scrollable image list
            <div className="flex h-full flex-col gap-3 overflow-auto p-2">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative flex items-center gap-3 rounded-md border p-2"
                >
                  <Image
                    width={36}
                    height={36}
                    src={img.url}
                    alt={`Preview ${idx}`}
                    className="h-[36px] w-[36px] rounded-md border object-cover"
                  />

                  <div className="flex flex-col text-sm">
                    <span className="font-medium">{img.name}</span>
                    <span className="text-gray-500">{img.size}</span>
                  </div>

                  {/* Cross Button */}
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 cursor-pointer rounded-full bg-black p-1 text-xs text-white"
                  >
                    <Icons.x className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <input
            id="imageUploadInput"
            type="file"
            accept="image/png, image/jpeg"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {descriptionText && (
          <p className="pt-[11px] text-[12px] leading-[17px]">
            {descriptionText}
          </p>
        )}

        {error && <ErrorText error={error} />}
      </div>
    </>
  );
};

export default MultiImageUploader;
