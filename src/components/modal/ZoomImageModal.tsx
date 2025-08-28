'use client';

import React, { useState, ReactNode, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Button, type ButtonProps } from '../ui/button';
import Image from 'next/image';
import { Slider } from '../ui/slider';
import { Icons } from '../ui/Icons';
import ImageUploader from '../ImageUploader/imageUploader';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '../ui/dialog';

interface ZoomImageModalProps {
  heading: ReactNode;
  cancelText: string;
  actionText: string;
  cancelButtonProps?: ButtonProps;
  actionButtonProps?: ButtonProps;
  subHeading?: string;
  onCropComplete: (
    croppedArea: any,
    croppedAreaPixels: { x: number; y: number; width: number; height: number },
  ) => void;
  onSave: (imageSrc: string) => void;
  triggerButton?: ReactNode;
  labelClickText?: string;
  labelRestText?: string;
  descriptionText?: string;
  onClose: () => void;
  open: boolean;
}

const ZoomImageModal = ({
  heading,
  cancelText,
  actionText,
  cancelButtonProps,
  actionButtonProps,
  subHeading,
  onCropComplete,
  onSave,
  onClose,
  open,
  labelClickText = 'Click to upload',
  labelRestText = ' or drag and drop SVG,PNG,JPG.',
  descriptionText = 'Upload a PNG and JPG, up to 10 MB.',
}: ZoomImageModalProps) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // helper function: convert File to base64 data URL
  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject('Failed to convert file');
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  };

  // handle image file from child
  const handleImageUpload = useCallback(async (file: File) => {
    try {
      const dataUrl = await fileToDataUrl(file);
      setUploadedImage(dataUrl);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    } catch (err) {
      console.error('Error converting file:', err);
    }
  }, []);

  const handleCancel = () => {
    setUploadedImage(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    onClose();
  };

  const handleSave = () => {
    if (uploadedImage) {
      onSave(uploadedImage);
      onClose();
      setUploadedImage(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogTrigger asChild></DialogTrigger>

      <DialogContent className="p-[24px] sm:max-w-[431px]">
        <DialogHeader>
          <DialogTitle className="font-outfit text-[16px] leading-[26px] font-medium text-black">
            {heading}
          </DialogTitle>
        </DialogHeader>

        {!uploadedImage ? (
          <div className="flex justify-center">
            <ImageUploader
              onImageSelect={handleImageUpload}
              labelClickText={labelClickText}
              labelRestText={labelRestText}
              descriptionText={descriptionText}
            />
          </div>
        ) : (
          <>
            <div className="border-grey-light bg-light-blue relative flex h-[181px] w-[383px] items-center justify-center overflow-hidden rounded-[8px] border">
              <Image
                src={uploadedImage}
                alt="blurred background"
                fill
                style={{ objectFit: 'cover' }}
                priority
                className="absolute inset-0 z-0 opacity-60 blur-md"
              />

              <div className="relative z-10 h-[181px] w-[383px]">
                <Cropper
                  image={uploadedImage}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                  restrictPosition={true}
                  cropSize={{ width: 147, height: 147 }}
                  showGrid={false}
                  style={{
                    containerStyle: {
                      borderRadius: '8px',
                      overflow: 'hidden',
                      width: '100%',
                      height: '100%',
                    },
                    cropAreaStyle: {
                      border: '2px solid #ffffff',
                      boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
                    },
                  }}
                />
              </div>
            </div>

            {subHeading && (
              <p className="pt-[14px] pb-[8px] text-[14px] leading-[21px] font-medium">
                {subHeading}
              </p>
            )}
            <div className="flex items-center gap-2">
              <Icons.crop className="text-brand-primary h-5 w-5" />
              <Slider
                min={1}
                max={2}
                step={0.01}
                value={[zoom]}
                onValueChange={(value) => setZoom(value[0])}
                className="[&_[data-slot=slider-range]]:bg-brand-primary [&_[data-slot=slider-thumb]]:border-brand-dark [&_[data-slot=slider-thumb]]:bg-brand-primary [&_[data-slot=slider-thumb]]:hover:ring-brand-primary/50 [&_[data-slot=slider-track]]:bg-light-blue w-full [&_[data-slot=slider-thumb]]:focus-visible:ring-0"
              />
              <Icons.maximize className="text-brand-primary h-5 w-5" />
            </div>
          </>
        )}

        <DialogFooter className="mt-4">
          <Button {...cancelButtonProps} onClick={handleCancel}>
            {cancelText}
          </Button>
          <Button
            {...actionButtonProps}
            onClick={handleSave}
            disabled={!uploadedImage}
          >
            {actionText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ZoomImageModal;
