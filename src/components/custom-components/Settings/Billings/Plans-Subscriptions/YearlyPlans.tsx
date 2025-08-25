import React from 'react';
import PlansComponent from './PlansComponent';
import FireFlame from '@/assets/images/fire-flame.svg';
import PlanComparisonTable from './PlanComparisonTable';
import PricingAndFeatures from './PricingAndFeatures';
import ManagePlansComponent from './ManagePlans';

const YearlyPlans = () => {
  return (
    <>
      <div className="flex gap-6 pt-6">
        <PlansComponent
          title="Starter"
          price="$0"
          subtitle="Best to check out features"
          buttonText="Current plan"
          description="This plan is perfect for individuals who want to explore AI capabilities without any commitment."
          features={[
            'Access to basic AI chat features',
            'Limited message history',
            'Standard response speed',
            'Community support',
            'Try before you upgrade',
          ]}
          bgColor="custom-gradient"
          className="flex-1"
          buttonOnClick={() => console.log('Starter plan clicked')}
          buttonVariant="disabled"
          size="sm"
        />

        <PlansComponent
          title="Business"
          prevPrice="$30"
          price="$28"
          subtitle="Per agent / billed yearly"
          buttonText="Upgrade plan"
          description="Perfect for exploring AI features risk‑free and without commitment."
          features={[
            'Unlimited chat history',
            'Priority response speed',
            'Access to productivity tools',
            'Email support',
            'Monthly usage analytics',
          ]}
          showImage={true}
          imageSrc={FireFlame}
          bgColor="bg-white"
          className="flex-1"
          buttonOnClick={() => console.log('Business plan clicked')}
          buttonVariant="default"
          size="sm"
        />

        <PlansComponent
          title="Enterprise Plan"
          price="Custom"
          subtitle="Per agent / billed yearly"
          buttonText="Contact us"
          description="Ideal for teams using AI to boost teamwork and accelerate growth"
          features={[
            'Team workspace with admin controls',
            'Role-based access',
            'API access and integrations',
            'SLA-backed support (email + live chat)',
            'Advanced analytics & usage insights',
          ]}
          bgColor="bg-white"
          className="flex-1"
          buttonOnClick={() => console.log('Enterprise plan clicked')}
          buttonVariant="outline"
          size="sm"
        />
      </div>

      <div className="mt-8 mb-6">
        <PlanComparisonTable />
      </div>
      <div className="mb-8">
        <PricingAndFeatures />
      </div>
      <div className="mb-6">
        <p className="text-brand-dark mb-3 text-xl leading-7.5 font-semibold">
          Manage all Workspace Plans
        </p>
        <p className="text-theme-text-primary font-regular text-[16px] leading-6.5">
          Manage plans for all your Workspaces in one place.
        </p>
      </div>
      <div>
        <ManagePlansComponent />
      </div>
    </>
  );
};

export default YearlyPlans;
