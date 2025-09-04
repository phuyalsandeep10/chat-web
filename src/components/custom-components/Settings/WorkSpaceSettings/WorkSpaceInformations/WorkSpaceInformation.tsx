'use client';
import { cn } from '@/lib/utils';
import ContactForm from './ContractForm';
import TerminateWorkspace from './TerminateWorkspace';
import Information from './Information';
import WorkSpaceDetails from './WorkSpaceDetails';
import WorkSpaceHeader from './WorkSpaceHeader';
import WorkspaceImage from './WorkspaceImage';
import WorkspaceProfile from './WorkspaceProfile';
import { useWorkspaceInformationStore } from '@/store/WorkspaceInformation/useWorkspaceInformation';

export default function WorkspaceInformation() {
  const organization = useWorkspaceInformationStore((state) => state.workspace);

  return (
    <>
      <div className={cn('mx-auto w-full')}>
        {/* Header */}
        <WorkSpaceHeader />
        {/* Profile Section */}
        <div className={cn('mt-11 mb-15 ml-16 flex items-start space-x-24')}>
          <WorkspaceImage organization={organization} />

          <WorkspaceProfile organization={organization} />
        </div>
        {/* Workspace Details */}
        <WorkSpaceDetails workspace_identifier={organization?.identifier} />
        {/* Workspace Information */}
        <div className={cn('mt-10 mb-9')}>
          <Information
            workspace_owner={organization?.owner?.name}
            creation_date={organization?.created_at}
          />
        </div>
        {/* Contact Information */}
        <ContactForm
          contactEmail={organization?.contact_email}
          contactPhone={organization?.contact_phone}
          contactDialCode={organization?.contact_dial_code}
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
