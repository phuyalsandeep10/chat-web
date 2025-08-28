'use client';

import React, { useCallback, useState } from 'react';
import Image from 'next/image';
import { MapPinIcon, PhoneIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/Icons';
import ProfileImageModal from '@/components/modal/ChangeImage';
import ZoomImageModal from '@/components/modal/ZoomImageModal';

import { getCroppedImg } from '@/lib/cropImage';
import { AuthService } from '@/services/auth/auth';
import { cn } from '@/lib/utils';

import type { UpdateProfileFormValues } from '../types';
import { toast } from 'sonner';
import { v4 } from 'uuid';

// Convert base64 to File object
function dataURLtoFile(dataurl: string, filename: string): File {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || '';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}

export default function ProfileSection({
  name,
  email,
  address,
  mobile,
  country,
  language,
  image,
}: UpdateProfileFormValues) {
  const [imageUrl, setImageUrl] = useState<string | null>(image);

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showChangePhotoModal, setShowChangePhotoModal] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const onCropComplete = useCallback(
    (
      _croppedArea: any,
      croppedAreaPixelsArg: {
        x: number;
        y: number;
        width: number;
        height: number;
      },
    ) => {
      setCroppedAreaPixels(croppedAreaPixelsArg);
    },
    [],
  );

  const handleCroppedSave = useCallback(
    async (imageSrc: string) => {
      if (!croppedAreaPixels) return;

      try {
        const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);

        // random uid plus timestamp to make the filename unique
        let myuid = v4();
        myuid = `${myuid}-${Date.now()}.png`;

        const file = dataURLtoFile(croppedImage, myuid);

        const cloudinaryRes = await AuthService.uploadPersonalProfile(file);
        console.log(cloudinaryRes);

        const uploadedUrl = cloudinaryRes?.data?.files?.[0]?.url;
        if (uploadedUrl) {
          setImageUrl(uploadedUrl);
        }

        const photoUpdate: UpdateProfileFormValues = {
          name: name,
          country: country,
          image: uploadedUrl,
          language: language,
          mobile: mobile,
          email: email,
          address: address,
        };

        const backendRes =
          await AuthService.updatePersonalInformation(photoUpdate);

        // toast here
        if (backendRes) toast.success('Photo uploaded successfully!');
        else toast.error('Profile Not Updated!');

        setShowChangePhotoModal(false);
      } catch (error) {
        console.error('Error cropping or uploading image:', error);
      }
    },
    [croppedAreaPixels, name, country, language, mobile, email, address],
  );

  const handleRemovePhoto = () => {
    // for ui update
    setImageUrl(null);
    setShowProfileModal(false);
    const handleRemoveProfilePicture = async () => {
      const userData: UpdateProfileFormValues = {
        name: name,
        mobile: mobile,
        address: address,
        image: '',
        country: country,
        language: language,
        email: email,
      };
      const res = await AuthService.updatePersonalInformation(userData);
      if (res) toast.success('Profile removed!');
      else toast.error('Error');
    };

    handleRemoveProfilePicture();
  };

  return (
    <>
      <div className="text-brand-dark flex items-center">
        <h1 className="text-[32px] leading-[40px] font-semibold">
          Account Information
        </h1>
        <Icons.help className="mt-0.5 ml-2 h-5 w-5" />
      </div>

      <div className="mt-11 flex items-center gap-[126px]">
        <div className="flex items-center gap-6">
          <div className="relative h-[167px] w-[167px] overflow-hidden rounded-[175px]">
            <Image
              src={imageUrl ?? '/profile-placeholder.jpeg'}
              alt="Profile Image"
              fill
              className="object-cover"
            />
            <div className="bg-gray-bg-light absolute bottom-0 flex h-12 w-full items-center justify-center">
              <Button
                onClick={() => setShowProfileModal(true)}
                className={cn(
                  'h-9 w-9 cursor-pointer rounded-full border-none bg-transparent p-0 hover:bg-[#f6ebff]',
                )}
              >
                <Icons.pencil
                  className="text-[#a43cfc]"
                  style={{ width: '36px', height: '36px' }}
                />
              </Button>
            </div>
          </div>

          <div className="text-brand-dark flex w-[314px] flex-col gap-2">
            <h2 className="text-[40px] leading-[48px] font-bold">{name}</h2>
            <p className="text-[18px] font-normal">{email}</p>
          </div>
        </div>

        <div className="flex flex-col gap-0.5">
          {address && (
            <div className="flex items-center justify-end gap-2">
              <MapPinIcon className="h-3.5 w-3.5" />
              <span className="text-right">{address}</span>
            </div>
          )}
          {mobile && (
            <div className="flex items-center gap-2">
              <PhoneIcon className="h-3.5 w-3.5" />
              <span className="text-right">{mobile}</span>
            </div>
          )}
        </div>

        <ProfileImageModal
          open={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          onRemovePhoto={handleRemovePhoto}
          onOpenChangePhoto={() => {
            setShowProfileModal(false);
            setShowChangePhotoModal(true);
          }}
        />

        <ZoomImageModal
          heading="Change Profile Picture"
          subHeading="Crop"
          cancelText="Cancel"
          actionText="Save"
          cancelButtonProps={{ variant: 'secondary', size: 'sm' }}
          actionButtonProps={{ variant: 'default', size: 'sm' }}
          onCropComplete={onCropComplete}
          onSave={handleCroppedSave}
          onClose={() => setShowChangePhotoModal(false)}
          open={showChangePhotoModal}
        />
      </div>
    </>
  );
}
