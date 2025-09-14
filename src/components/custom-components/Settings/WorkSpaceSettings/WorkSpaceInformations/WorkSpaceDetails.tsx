import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/Icons';
import { cn } from '@/lib/utils';
import { useWorkspaceInformationStore } from '@/store/WorkspaceInformation/useWorkspaceInformation';
import { Label } from '@radix-ui/react-dropdown-menu';
import React, { useState } from 'react';

interface WorkspaceDetailsProps {
  workspace_identifier?: string | null;
}
const WorkSpaceDetails: React.FC<WorkspaceDetailsProps> = ({
  workspace_identifier,
}) => {
  const [copied, setCopied] = useState(false);
  const [identifier, setIdentifier] = useState(null);
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const { workspace } = useWorkspaceInformationStore();

  const handleOpenLink = () => {
    window.open(workspace?.domain, '_blank');
  };
  return (
    <div>
      <div className="w-full">
        <div>
          <h2
            className={cn(
              'font-outfit text-brand-dark mb-6 text-xl font-semibold',
            )}
          >
            Workspace Details
          </h2>
        </div>
        <div className={cn('space-y-4')}>
          <div className={cn('flex w-full items-center gap-3')}>
            <div className={cn('flex')}>
              <Label
                className={cn(
                  'font-outfit text-brand-dark mr-13 text-base font-medium',
                )}
              >
                Workspace ID
              </Label>
              <div className="">
                <p
                  className={cn(
                    'border-gray-light font-outfit text-gray-light h-9 w-full border pt-2 pr-52 pl-5 text-sm',
                  )}
                >
                  {workspace?.identifier || ''}
                </p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => handleCopy('wksp_01234567')}
              className={cn(
                'text-disabled-foreground font-outfit flex cursor-pointer items-center gap-2 bg-white text-xs font-normal hover:bg-white focus:bg-white active:bg-white',
              )}
            >
              {copied ? (
                <Icons.success_toast className="h-6 w-6" />
              ) : (
                <Icons.copy className="h-6 w-6" />
              )}
              {copied ? 'Copied' : 'Text copied'}
            </Button>
          </div>

          <div className={cn('flex items-center gap-3')}>
            <div className={cn('flex')}>
              <Label
                className={cn(
                  'font-outfit text-brand-dark mr-9 text-base font-medium',
                )}
              >
                Workspace URL
              </Label>
              <p
                className={cn(
                  'font-outfit text-disabled-foreground h-9 border py-1 pr-13 pl-2 text-sm font-medium',
                )}
              >
                {workspace?.domain}
              </p>
            </div>
            <Button
              size="sm"
              onClick={handleOpenLink}
              className={cn(
                'font-outfit text-brand-primary flex cursor-pointer items-center gap-2 bg-white text-xs font-normal underline hover:bg-white focus:bg-white active:bg-white',
              )}
            >
              <Icons.external_link
                className={cn('text-disabled-foreground h-6 w-6')}
              />
              Open link
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkSpaceDetails;
