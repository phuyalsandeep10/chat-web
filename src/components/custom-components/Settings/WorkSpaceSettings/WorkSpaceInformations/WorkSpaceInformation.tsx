'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import CountrySelect from '@/shared/CountrySelect';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/ui/Icons';
import ContactForm from './ContractForm';
import ProfileImageModal from '@/components/modal/ChangeImage';
import ZoomImageModal from '@/components/modal/ZoomImageModal';
import { getCroppedImg } from '@/lib/cropImage';
import TerminateWorkspace from './TerminateWorkspace';
import Information from './Information';
import WorkSpaceDetails from './WorkSpaceDetails';
import WorkSpaceHeader from './WorkSpaceHeader';
import { useGetorganizationDetails } from '@/hooks/organizations/useGetorganizations';
import { useGetCountries } from '@/hooks/organizations/useGetCountries';
import ErrorText from '@/components/common/hook-form/ErrorText';
import { Country } from '@/services/organizations/types';
export default function WorkspaceInformation() {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showChangePhotoModal, setShowChangePhotoModal] = useState(false);

  const { data: organizationDetails, isPending } = useGetorganizationDetails();

  const {
    data: countriesResponse,
    isLoading: isLoadingCountries,
    error: countriesError,
  } = useGetCountries();

  const countries = countriesResponse?.data?.countries || [];

  console.log(organizationDetails);
  console.log('Countries:', countries);

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
        setImageUrl(croppedImage); // save new image
      } catch (error) {
        console.error('Cropping error:', error);
      }
    },
    [croppedAreaPixels],
  );

  return (
    <>
      <div className={cn('mx-auto w-full')}>
        {/* Header */}
        <WorkSpaceHeader />

        {/* Profile Section */}
        <div className={cn('mt-11 mb-15 ml-16 flex items-start space-x-24')}>
          <div className="relative">
            <div
              className={cn(
                'bg-gray-light relative h-[250px] w-[250px] overflow-hidden rounded-full',
              )}
            >
              <Image
                src={imageUrl || '/profile-image.png'}
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
            {/* Edit button and red underline */}
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
                <Icons.pencil
                  className=""
                  style={{ width: '36px', height: '36px' }}
                />
              </Button>
            </div>
          </div>

          <div className={cn('flex-1 space-y-5')}>
            <div className={cn('space-y-3')}>
              <Label
                htmlFor="name"
                className={cn('font-outfit text-base font-medium text-black')}
              >
                Name <span className={cn('text-alert-prominent')}>*</span>
              </Label>
              <Input
                id="name"
                defaultValue="Bramhabyfields"
                className="h-9 w-full"
              />
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="domain"
                className={cn('font-outfit text-base font-medium text-black')}
              >
                Domain<span className={cn('text-alert-prominent')}>*</span>
              </Label>
              <div className="flex w-full">
                <div
                  className={cn(
                    'bg-brand-primary font-outfit text-theme-text-light flex items-center px-3 text-xs font-normal',
                  )}
                >
                  https://
                </div>
                <Input
                  id="domain"
                  placeholder="Enter your url"
                  className="h-9 rounded-l-none border-l-0"
                />
              </div>
              <p
                className={cn(
                  'font-outfit text-gray-primary text-xs font-normal',
                )}
              >
                This will be your workspaces public URL.
              </p>
            </div>

            <div className={cn('w-full space-y-3')}>
              <Label
                htmlFor="timezone"
                className={cn('font-outfit text-base font-medium text-black')}
              >
                Time zone
              </Label>

              {isLoadingCountries && (
                <div className="text-theme-text-primary text-sm">
                  Loading countries...
                </div>
              )}

              {countriesError && (
                <ErrorText error="The data couldn't be fetched" />
              )}
              {/* 
              {!isLoadingCountries && !countriesError && (
                <CountrySelect
                  value={selectedCountry}
                  onChange={(country) => setSelectedCountry(country)}
                  buttonClassName={cn('w-full  text-black py-2')}
                  contentClassName={cn('cursor-pointer hover:bg-white')}
                  itemClassName={cn('hover:bg-gray-100 px-2 py-1')}
                  wrapperClassName={cn('w-full')}
                  countries={countries}
                />
              )} */}
            </div>
          </div>
        </div>

        {/* Workspace Details */}
        <WorkSpaceDetails />

        {/* Workspace Information */}
        <div className={cn('mt-10 mb-9')}>
          <Information />
        </div>

        {/* Contact Information */}

        <div>
          <ContactForm />
        </div>

        {/* Terminate Workspace */}
        <TerminateWorkspace />
      </div>
      <ProfileImageModal
        // title="helolo"
        // changePhotoText="Change Photo1"
        // removePhotoText="Remove Photo2"
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
}
