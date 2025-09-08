'use client';

import React, { useState } from 'react';

import { ROUTES } from '@/routes/routes';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/ui/Icons';
import { usePathname } from 'next/navigation';
import SidebarSection, { SidebarItem } from '../SharedSidebar/SettingSidebar';
import Link from 'next/link';

const sidebarSectionsData: {
  title: string;
  items: SidebarItem[];
}[] = [
  {
    title: 'Accounts',
    items: [
      {
        label: 'Account Information',
        href: ROUTES.SETTINGS.ACCOUNT_INFORMATION,
        icon: <Icons.client className="h-5 w-5" />,
      },
      {
        label: 'Notification',
        href: ROUTES.SETTINGS.NOTIFICATIONS,
        icon: <Icons.notification className="h-5 w-5" />,
      },
      {
        label: 'Availability',
        href: ROUTES.SETTINGS.AVAILABILITY,
        icon: <Icons.clock className="h-5 w-5" />,
      },
      {
        label: 'Security',
        href: ROUTES.SETTINGS.SECURITY,
        icon: <Icons.help className="h-5 w-5" />,
      },
      {
        label: 'Personalization',
        href: ROUTES.SETTINGS.PERSONALIZATION,
        icon: <Icons.screen className="h-5 w-5" />,
      },
    ],
  },
  {
    title: 'Billing',
    items: [
      {
        label: 'Security',
        href: ROUTES.SETTINGS.SECURITY,
        icon: <Icons.help className="h-5 w-5" />,
      },
      {
        label: 'Personalization',
        href: ROUTES.SETTINGS.PERSONALIZATION,
        icon: <Icons.search_eye className="h-5 w-5" />,
      },
    ],
  },
  {
    title: 'Workspace Setting',
    items: [
      {
        label: 'Workspace Information',
        href: ROUTES.SETTINGS.INFORMATION,
        icon: <Icons.danger className="h-5 w-5" />,
      },
      {
        label: 'Transparency Logs',
        href: ROUTES.SETTINGS.TRANSPARENCY_LOGS,
        icon: <Icons.search_eye className="h-5 w-5" />,
      },
      {
        label: 'Operator & Teams',
        href: ROUTES.SETTINGS.OPERATOR_TEAMS,
        icon: <Icons.client className="h-5 w-5" />,
      },
      {
        label: 'Advance Configuration',
        href: ROUTES.SETTINGS.ADVANCE_CONFIGURATION,
        icon: <Icons.rocket className="h-5 w-5" />,
      },
      {
        label: 'Invite Agents',
        href: ROUTES.SETTINGS.INVITE_AGENTS,
        icon: <Icons.screen className="h-5 w-5" />,
      },
    ],
  },
  {
    title: 'Chatbox Setting',
    items: [
      {
        label: 'Security',
        href: ROUTES.SETTINGS.SECURITY,
        icon: <Icons.help className="h-5 w-5" />,
      },
      {
        label: 'Personalization',
        href: ROUTES.SETTINGS.PERSONALIZATION,
        icon: <Icons.screen className="h-5 w-5" />,
      },
    ],
  },
  {
    title: 'Inbox Setting',
    items: [
      {
        label: 'Security',
        href: ROUTES.SETTINGS.SECURITY,
        icon: <Icons.help className="h-5 w-5" />,
      },
      {
        label: 'Personalization',
        href: ROUTES.SETTINGS.PERSONALIZATION,
        icon: <Icons.screen className="h-5 w-5" />,
      },
    ],
  },
  {
    title: 'Email Setting',
    items: [
      {
        label: 'Security',
        href: ROUTES.SETTINGS.SECURITY,
        icon: <Icons.help className="h-5 w-5" />,
      },
      {
        label: 'Personalization',
        href: ROUTES.SETTINGS.PERSONALIZATION,
        icon: <Icons.screen className="h-5 w-5" />,
      },
    ],
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  // Function to find the section that contains the current pathname
  const findInitialOpenSection = (): string => {
    for (const section of sidebarSectionsData) {
      if (section.items.some((item) => item.href === pathname)) {
        return section.title;
      }
    }
    return ''; // fallback if no match
  };
  const [openSection, setOpenSection] = useState<string>(
    findInitialOpenSection(),
  );
  const handleToggle = (title: string) => {
    setOpenSection((prev) => (prev === title ? '' : title));
  };
  const isActive = pathname === ROUTES.SETTINGS.Ticket_Setting;

  return (
    <div className={cn('text-brand-dark w-full pt-2 pr-4 pl-4 text-sm')}>
      {sidebarSectionsData.map((section) => (
        <SidebarSection
          key={section.title}
          title={section.title}
          items={section.items}
          isOpen={openSection === section.title}
          onToggle={handleToggle}
        />
      ))}
      {/* <Link to>Ticket Setting</Link> */}
      <Link
        href={ROUTES.SETTINGS.Ticket_Setting}
        className={cn(
          `hover:text-brand-primary font-outfit flex w-full cursor-pointer items-center justify-between gap-5 pb-4 text-sm font-normal ${
            isActive ? 'text-brand-primary' : 'text-brand-dark'
          } hover:text-brand-primary`,
        )}
      >
        <span>Ticket Setting</span>
      </Link>
    </div>
  );
};

export default Sidebar;
