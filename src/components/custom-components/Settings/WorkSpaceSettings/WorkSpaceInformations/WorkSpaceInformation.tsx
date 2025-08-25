'use client';

import { cn } from '@/lib/utils';
import ContactForm from './ContractForm';
import TerminateWorkspace from './TerminateWorkspace';
import Information from './Information';
import WorkSpaceDetails from './WorkSpaceDetails';
import WorkSpaceHeader from './WorkSpaceHeader';
import { useAuthStore } from '@/store/AuthStore/useAuthStore';
import { useGetOrganizationById } from '@/hooks/organizations/useGetorganizations';
import WorkspaceImage from './WorkspaceImage';
import WorkspaceProfile from './WorkspaceProfile';
export default function WorkspaceInformation() {
  const { authData } = useAuthStore();
  const orgId = authData?.data.user.attributes.organization_id;

  const { data: organizationDetails } = useGetOrganizationById(orgId ?? 0, {
    enabled: !!orgId,
  });

  const organization = organizationDetails?.organization;
  const owner = organizationDetails?.owner;

  return (
    <>
      <div className={cn('mx-auto w-full')}>
        {/* Header */}
        <WorkSpaceHeader />
        {/* Profile Section */}
        <div className={cn('mt-11 mb-15 ml-16 flex items-start space-x-24')}>
          <WorkspaceImage />

          <WorkspaceProfile />
        </div>
        {/* Workspace Details */}
        <WorkSpaceDetails workspace_identifier={organization?.identifier} />
        {/* Workspace Information */}
        <div className={cn('mt-10 mb-9')}>
          <Information
            workspace_owner={owner?.name}
            creation_date={organization?.created_at}
          />
        </div>
        {/* Contact Information */}
        <ContactForm
          contactEmail={organization?.contact_email}
          contactPhone={organization?.contact_phone}
          twitterUsername={organization?.twitter_username}
          facebookUsername={organization?.facebook_username}
          whatsappNumber={organization?.whatsapp_number}
          telegramUsername={organization?.telegram_username}
        />
        {/* Terminate Workspace */}
        <TerminateWorkspace />
      </div>
    </>
  );
}
