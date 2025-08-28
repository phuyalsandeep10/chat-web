'use client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/Icons';
import { cn } from '@/lib/utils';
import ProfileImageModal from '@/components/modal/ChangeImage';
import ZoomImageModal from '@/components/modal/ZoomImageModal';
import { getCroppedImg } from '@/lib/cropImage';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { v4 } from 'uuid';
import { AuthService } from '@/services/auth/auth';
import WorkspaceData, {
  useWorkspaceStore,
} from '@/store/WorkspaceStore/useWorkspaceStore';

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

const WorkspaceImage = ({ organization }: any) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showChangePhotoModal, setShowChangePhotoModal] = useState(false);

  const { setData } = useWorkspaceStore();

  const token = AuthService.getAuthTokens();

  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const onCropComplete = useCallback(
    (
      _: any,
      croppedPixels: { x: number; y: number; width: number; height: number },
    ) => {
      setCroppedAreaPixels(croppedPixels);
    },
    [],
  );

  // --- Upload logic
  const handleCroppedSave = useCallback(
    async (imageSrc: string) => {
      if (!croppedAreaPixels) return;
      try {
        const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);

        // generate unique filename
        let myuid = v4();
        myuid = `${myuid}-${Date.now()}.png`;

        const file = dataURLtoFile(croppedImage, myuid);

        // Upload to backend / cloud
        const cloudinaryRes = await AuthService.uploadPersonalProfile(file);
        const uploadedUrl = cloudinaryRes?.data?.files?.[0]?.url;

        if (uploadedUrl) {
          setImageUrl(uploadedUrl);
          setData({ profile_picture: uploadedUrl });
        }
        setShowChangePhotoModal(false);
      } catch (error) {
        console.error('Error cropping or uploading image:', error);
        toast.error('Error uploading image!');
      }
    },
    [croppedAreaPixels],
  );

  // --- Remove logo
  const handleRemovePhoto = () => {
    setImageUrl(null);
    setShowProfileModal(false);
    setData({ profile_picture: null });
  };

  const logoSrc =
    imageUrl ||
    (organization?.workspace_owner_image?.startsWith('https')
      ? organization.workspace_owner_image
      : '/profile.jpg');

  return (
    <>
      <div className="relative">
        <div
          className={cn(
            'bg-gray-light relative h-[250px] w-[250px] overflow-hidden rounded-full',
          )}
        >
          <Image
            src={logoSrc}
            alt="Profile"
            width={250}
            height={250}
            className="h-full w-full object-cover"
          />
          <div
            className={cn(
              'bg-gray-light absolute bottom-0 left-0 h-1/4 w-full rounded-b-full opacity-50',
            )}
          />
        </div>
        <div
          className={cn(
            'absolute bottom-7 left-28 flex h-auto w-auto flex-col items-center',
          )}
        >
          <Button
            size="lg"
            variant="secondary"
            onClick={() => setShowProfileModal(true)}
            className={cn(
              'h-9 w-9 cursor-pointer rounded-full border-none p-0',
            )}
          >
            <Icons.pencil style={{ width: '36px', height: '36px' }} />
          </Button>
        </div>
      </div>
      {/* Modals */}
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
        heading="Change Organization Logo"
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
    </>
  );
};

export default WorkspaceImage;
