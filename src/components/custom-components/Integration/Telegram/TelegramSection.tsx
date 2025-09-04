'use client';

import React from 'react';
import Header from '../SharedComponent/Header';
import CoreCapabilities from '../SharedComponent/CoreCapabilities';
import RequiredPermissions from '../SharedComponent/RequiredPremissions';
import VisualOverview from '../SharedComponent/VisualOverview';
import { Icons } from '@/components/ui/Icons';
import Image from 'next/image';
import telegram from '@/assets/images/integration/telegram.svg';
import InstallChannelModal from './InstallChannelModal';

const TelegramSection = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

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
    { title: '1. Open Telegram', description: 'Search for BotFather' },
    { title: '2. Start a chat', description: 'Type /newbot in BotFather' },
    {
      title: '3. Choose a name',
      description: 'for your bot (example: ABC Company).',
    },
    {
      title: '4. Choose a username',
      description: 'It must end with bot, example:',
    },
    {
      title: '5. Copy the generated token',
      description: 'After this, BotFather will give you a bot token',
    },
    {
      title: '6. Input the Bot display name',
      description: 'It must end with bot, example:',
    },
    {
      title: '7. Input the token in Field',
      description: 'Paste the token in the above field.',
    },
  ];

  return (
    <div className="space-y-6">
      <Header
        navigation="Go Back"
        planType="Free"
        name="Telegram"
        desc="Telegram is a cloud-based, cross-platform social media and instant messaging service."
        installButton="Install Telegram"
        onInstallClick={() => setIsModalOpen(true)}
        videoButton="Watch Demo Video"
        image={<Image src={telegram} alt="Telegram" className="h-12 w-12" />}
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
        headingText="How Telegram Flow Works: A Visual Overview"
        subText="Telegram is a cloud-based, cross-platform social media and instant messaging service."
        steps={visualSteps}
        headingIcon={Icons.ri_pie_chart_2_fill}
      />

      <InstallChannelModal open={isModalOpen} setOpen={setIsModalOpen} />
    </div>
  );
};

export default TelegramSection;
