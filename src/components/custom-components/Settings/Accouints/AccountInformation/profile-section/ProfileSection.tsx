import { Icons } from '@/components/ui/Icons';
import { MapPinIcon, PhoneIcon } from 'lucide-react';
import Image from 'next/image';
import { ProfileSectionProps } from '../types';
import { useCallback, useState } from 'react';
import { getCroppedImg } from '@/lib/cropImage';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import ProfileImageModal from '@/components/modal/ChangeImage';
import ZoomImageModal from '@/components/modal/ZoomImageModal';

export default function ProfileSection({
  name,
  email,
  address,
  mobile,
  profileImage,
}: ProfileSectionProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [showProfileModel, setShowProfileModal] = useState(false);
  const [showChangePhotoModal, setShowChangePhotoModal] = useState(false);

  const handleRemovePhoto = () => {
    setImageUrl(null);
    setShowProfileModal(false);
  };

  const onCropComplete = useCallback(
    (
      _croppedArea: any,
      croppedAreaPixels: {
        x: number;
        y: number;
        width: number;
        height: number;
      },
    ) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );

  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const handleCroppedSave = useCallback(
    async (imageSrc: string) => {
      if (!croppedAreaPixels) return;
      try {
        const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
        setImageUrl(croppedImage);
        localStorage.setItem('imageURL', croppedImage);

        // logging data
        console.log('image set to localstorage');
      } catch (error) {
        console.error('Cropping error:', error);
      }
    },
    [croppedAreaPixels],
  );

  return (
    <>
      {/* Page title */}
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
              src={
                profileImage
                  ? profileImage
                  : imageUrl
                    ? imageUrl
                    : '/profile-placeholder.  jpeg'
              }
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
          open={showProfileModel}
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
