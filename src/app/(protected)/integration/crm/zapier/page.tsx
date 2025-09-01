import CoreCapabilities from '@/components/custom-components/Integration/SharedComponent/CoreCapabilities';
import Header from '@/components/custom-components/Integration/SharedComponent/Header';
import RequiredPremissions from '@/components/custom-components/Integration/SharedComponent/RequiredPremissions';
import VisualOverview from '@/components/custom-components/Integration/SharedComponent/VisualOverview';
import ZapierSection from '@/components/custom-components/Integration/Zapier/ZapierSection';
import Settings from '@/components/custom-components/Settings/Settings';
import React from 'react';

const Zapier = () => {
  return (
    <Settings>
      <ZapierSection />
    </Settings>
  );
};

export default Zapier;
