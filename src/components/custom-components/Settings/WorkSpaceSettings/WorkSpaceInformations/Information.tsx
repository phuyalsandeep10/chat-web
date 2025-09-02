import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/Icons';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import TransferOwnershipModal from '@/components/modal/TransferOwnership';

interface InformationProps {
  workspace_owner?: string | null;
  creation_date?: string | null;
  currentOwnerId?: string | null;
  setCurrentOwnerId?: any;
}

const Information: React.FC<InformationProps> = ({
  workspace_owner,
  creation_date,
  currentOwnerId,
  setCurrentOwnerId,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formattedDate = creation_date
    ? new Date(creation_date).toLocaleDateString('en-US')
    : '';

  return (
    <div>
      <div>
        <h2
          className={cn(
            'font-outfit text-brand-dark text-xl leading-[30px] font-semibold',
          )}
        >
          Workspace Information
        </h2>
        <p
          className={cn('font-outfit mt-3 mb-6 text-xs font-normal text-black')}
        >
          Set your public contact information so that visitors have other ways
          to directly contact you.
        </p>
      </div>

      <div className={cn('space-y-4')}>
        <div className={cn('flex gap-10')}>
          <div className={cn('flex items-center')}>
            <Label
              className={cn(
                'font-outfit text-brand-dark mb-2 text-base font-medium',
              )}
            >
              Workspace Owner
            </Label>
            <div className={cn('mt-1 ml-4')}>
              <p
                className={cn(
                  'font-outfit text-disabled-foreground h-9 w-[330px] items-center border py-2 pl-2 text-sm',
                )}
              >
                {workspace_owner || ''}
              </p>
              <Button
                variant={'link'}
                size={'sm'}
                className={cn(
                  'text-brand-primary font-outfit flex cursor-pointer items-center gap-1.5 text-xs font-normal underline',
                )}
                onClick={() => setIsModalOpen(true)}
              >
                Transfer ownership
                <Icons.external_link
                  className={cn('text-brand-primary mt-1 h-2.5 w-2.5')}
                />
              </Button>
            </div>
          </div>

          {/* <div className="">
            <p
              className={cn('font-outfit text-brand-dark text-sm font-medium')}
            >
              Ownership transfer pending,
            </p>
            <p
              className={cn(
                'font-outfit text-brand-dark text-sm leading-[21px] font-medium',
              )}
            >
              acceptance by &ldquo;
              <span className={cn('text-alert-prominent')}>
                {invitedMember || 'N/A'}
              </span>
              &rdquo;
            </p>
          </div> */}
        </div>

        <div className={cn('mt-7 flex items-center justify-between')}>
          <div className={cn('flex gap-13')}>
            <Label
              className={cn(
                'font-outfit text-brand-dark text-base font-medium',
              )}
            >
              Current Plan
            </Label>
            <p
              className={cn(
                'font-outfit text-disabled-foreground text-sm font-normal',
              )}
            >
              Organizational Plan
            </p>
          </div>
          <div className={cn('flex gap-8')}>
            <Label
              className={cn(
                'font-outfit text-brand-dark text-base font-medium',
              )}
            >
              Creation Date
            </Label>
            <p
              className={cn(
                'font-outfit text-disabled-foreground text-sm font-normal',
              )}
            >
              {formattedDate || ''}
            </p>
          </div>
        </div>
      </div>

      {/* Modal */}
      <TransferOwnershipModal
        currentOwnerId={currentOwnerId}
        setCurrentOwnerId={setCurrentOwnerId}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Information;
