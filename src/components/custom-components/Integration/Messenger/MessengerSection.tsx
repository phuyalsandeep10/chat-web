'use client';
import React from 'react';
import Header from '../SharedComponent/Header';
import CoreCapabilities from '../SharedComponent/CoreCapabilities';
import RequiredPermissions from '../SharedComponent/RequiredPremissions';
import VisualOverview from '../SharedComponent/VisualOverview';
import { Icons } from '@/components/ui/Icons';
import Image from 'next/image';
import messenger from '@/assets/images/integration/messenger.svg';
import { getFacebookIntegrationUrl } from '@/services/integration/getIntegrationUrl';

const MessengerSection = () => {
  const capabilities = [
    {
      icon: Icons.ri_magic_line,
      title: 'Automated Messaging',
      description:
        'Engage customer instantly with pre-defined responses and dynamic content.',
    },
    {
      icon: Icons.ri_base_station_line,
      title: 'Intelligent Routing',
      description:
        'Direct queries to the right agent or department based on conversation context.',
    },
    {
      icon: Icons.ri_magic_line,
      title: 'Customizable Workflows',
      description:
        'Design complex scenarios with conditional logic for diverse user intents.',
    },
    {
      icon: Icons.ri_stack_fill,
      title: 'Data Collection & Forms',
      description:
        'Gather essential user information directly within the chat interface.',
    },
  ];

  const permissions = [
    'Read & Write Session',
    'Read & Write Session',
    'Read & Write Session',
    'Read & Write Session',
    'Read & Write Session',
    'Read & Write Session',
  ];

  const developerInfo = [
    { label: 'Developer', value: 'Innovative Solution Inc.' },
    { label: 'Website', value: 'Innovative Solution Inc.' },
    { label: 'Support', value: 'Support@innovativesolution.com' },
    { label: 'Terms of Use', value: 'View Terms' },
    { label: 'Privacy Policy', value: 'View Policy' },
  ];

  const visualSteps = [
    {
      title: '1. Customer Initiates Chat',
      description: 'User types a question or request.',
    },
    {
      title: '2. Analyzes Intent',
      description: 'Smartflow identifies the user’s need.',
    },
    {
      title: '3. Condition logic applied.',
      description: 'If “billing inquiry” then ask for account details.',
    },
    {
      title: '4. Resolution or handoff',
      description: 'User types a question or request.',
    },
  ];

  const handleInstallClick = async () => {
    try {
      const data = await getFacebookIntegrationUrl();
      if (data?.redirect_url) {
        window.location.href = data.redirect_url;
      } else {
        console.error('No redirect URL returned from server');
      }
    } catch (error) {
      console.error('Failed to fetch integration URL:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Header
        navigation="Go Back"
        planType="Free"
        name="Messenger"
        desc="Automate customer interactions, streamline workflows, and enhance support efficiency."
        installButton=" Install Messenger"
        onInstallClick={handleInstallClick}
        videoButton="Watch Demo Video"
        image={<Image src={messenger} alt="Zapier" className="h-12 w-12" />}
      />

      <div className="mb-10 flex gap-5">
        <CoreCapabilities capabilities={capabilities} />

        <RequiredPermissions
          title="Required Permissions"
          description="These permissions are necessary for Zapier to work properly."
          permissions={permissions}
          developerTitle="Developer Information"
          developerInfo={developerInfo}
          checkIcon={Icons.check}
        />
      </div>

      <VisualOverview
        headingText="How Zipper Flow Works: A Visual Overview"
        subText="Zippy AI automates your customer support with intuitive, customizable workflows. Here’s a simplified example."
        steps={visualSteps}
        headingIcon={Icons.ri_pie_chart_2_fill}
      />
    </div>
  );
};

export default MessengerSection;
