import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/Icons';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/AuthStore/useAuthStore';
import { useGetOrganizationById } from '@/hooks/organizations/useGetorganizations';
import ProfileImageModal from '@/components/modal/ChangeImage';
import ZoomImageModal from '@/components/modal/ZoomImageModal';
import { getCroppedImg } from '@/lib/cropImage';
import { useCallback, useState } from 'react';

const WorkspaceImage = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showChangePhotoModal, setShowChangePhotoModal] = useState(false);

  const { authData } = useAuthStore();
  const orgId = authData?.data.user.attributes.organization_id;

  const { data: organizationDetails } = useGetOrganizationById(orgId ?? 0, {
    enabled: !!orgId,
  });

  const organization = organizationDetails?.organization;
  const owner = organizationDetails?.owner;

  const handleRemovePhoto = () => {
    setImageUrl(null);
    setShowProfileModal(false);
  };

  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

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

  const handleCroppedSave = useCallback(
    async (imageSrc: string) => {
      if (!croppedAreaPixels) return;
      try {
        const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
        setImageUrl(croppedImage);
      } catch (error) {
        console.error('Cropping error:', error);
      }
    },
    [croppedAreaPixels],
  );

  const logoSrc =
    imageUrl ||
    (owner?.image?.startsWith('https') ? owner.image : '/profile.jpg');

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
    </>
  );
};

export default WorkspaceImage;
