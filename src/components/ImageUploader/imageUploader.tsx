'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Icons } from '../ui/Icons';
import ErrorText from '../common/hook-form/ErrorText';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  wrapperClassName?: string;
  labelClickText?: string;
  labelRestText?: string;
  descriptionText?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelect,
  wrapperClassName = 'flex h-[181px] w-[383px] flex-col items-center justify-center rounded-md border',
  labelClickText = 'Click to upload',
  labelRestText = 'or drag and drop SVG, PNG, JPG.',
  descriptionText = 'Upload a PNG and JPG, up to 10 MB.',
}) => {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const isValidType = ['image/jpeg', 'image/png'].includes(file.type);
      const isValidSize = file.size <= 10 * 1024 * 1024;

      if (!isValidType) {
        setError('Only PNG and JPG formats are allowed.');
        return;
      }

      if (!isValidSize) {
        setError('Image size should not exceed 10 MB.');
        return;
      }

      setError(null);
      onImageSelect(file); // 🔁 Pass File instead of base64
    },
    [onImageSelect],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  return (
    <div className="flex flex-col">
      <div {...getRootProps({ className: wrapperClassName })}>
        <div className="text-theme-text-dark flex flex-col items-center gap-3 rounded-[8px] bg-white px-4 py-3">
          <Icons.download_cloud className="text-brand-primary h-7 w-8" />
          <div className="text-center">
            <span className="text-brand-primary text-lg leading-7 font-semibold underline">
              {labelClickText}
            </span>{' '}
            <span>{labelRestText}</span>
          </div>
        </div>
        <input {...getInputProps()} className="hidden" />
      </div>

      {descriptionText && (
        <p className="pt-[11px] text-[12px] leading-[17px]">
          {descriptionText}
        </p>
      )}

      {error && <ErrorText error={error} />}
    </div>
  );
};

export default ImageUploader;
