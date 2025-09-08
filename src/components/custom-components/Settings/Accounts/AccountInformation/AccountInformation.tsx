'use client';

import ProfileSection from './profile-section/ProfileSection';
import PersonalInformation from './personal-information/PersonalInformation';
import PlansSection from './plans-section/PlansSection';
import PublicProfile from './public-profile/PublicProfile';
import DiscountBanner from './discount-banner/DiscountBanner';
import { useAuthStore } from '@/store/AuthStore/useAuthStore';

const AccountInformation = () => {
  const authData = useAuthStore((state) => state.authData);
  console.log(authData);
  return (
    <div className="font-outfit max-h-40 w-full bg-white">
      <ProfileSection
        name={authData?.data?.user?.name ?? ''}
        email={authData?.data?.user?.email ?? ''}
        address={authData?.data?.user.address ?? ''}
        country={authData?.data?.user.country ?? ''}
        mobile={authData?.data?.user?.mobile ?? ''}
        image={authData?.data?.user?.image ?? ''}
        language={authData?.data?.user?.language ?? ''}
        phoneCode={authData?.data?.user?.phone_code ?? ''}
      />

      {/* <PublicProfile /> */}

      <div className="mt-[43px] grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-0">
        <PersonalInformation />
        <PlansSection />
      </div>

      <DiscountBanner />
    </div>
  );
};

export default AccountInformation;
