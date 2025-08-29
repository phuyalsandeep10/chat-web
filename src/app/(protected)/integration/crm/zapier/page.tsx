import CoreCapabilities from '@/components/custom-components/Integration/Zapier/CoreCapabilities';
import Header from '@/components/custom-components/Integration/Zapier/Header';
import RequiredPremissions from '@/components/custom-components/Integration/Zapier/RequiredPremissions';
import VisualOverview from '@/components/custom-components/Integration/Zapier/VisualOverview';
import Settings from '@/components/custom-components/Settings/Settings';
import React from 'react';

const Zapier = () => {
  return (
    <Settings>
      <div>
        <div className="mb-8">
          <Header />
        </div>

        <div className="mb-10 flex gap-5">
          <CoreCapabilities />
          <RequiredPremissions />
        </div>

        <div className="mb-5">
          <VisualOverview />
        </div>
      </div>
    </Settings>
  );
};

export default Zapier;
