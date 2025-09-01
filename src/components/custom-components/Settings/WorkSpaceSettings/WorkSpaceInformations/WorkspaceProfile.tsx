import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useEffect, useMemo, useRef, useState } from 'react';
import ErrorText from '@/components/common/hook-form/ErrorText';
import { TimeZone } from '@/services/organizations/types';
import WorkspaceData, {
  useWorkspaceStore,
} from '@/store/WorkspaceStore/useWorkspaceStore';
import { useUpdateOrganization } from '@/hooks/organizations/useUpdateOrganization';
import useDebouncedEffect from '@/hooks/useDebounceEffect';
import { useGetTimeZones } from '@/hooks/organizations/useGetTimeZones';
import WorkspaceCountrySelect from './WorkspaceCountrySelect';

const validTLDs = [
  'com',
  'org',
  'net',
  'io',
  'edu',
  'gov',
  'co',
  'uk',
  'np',
  'in',
  'info',
  'xyz',
  'dev',
  'app',
  'me',
  'biz',
  'online',
  'shop',
  'us',
  'ca',
  'de',
  'jp',
];

const WorkspaceProfile = ({ organization }: any) => {
  const { updatedData, setData } = useWorkspaceStore();
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [selectedTimeZone, setSelectedTimeZone] = useState<TimeZone | null>(
    null,
  );
  const prevUpdatedData = useRef<Partial<WorkspaceData>>(updatedData);

  const { data: TimeZones, isLoading, isError } = useGetTimeZones();

  const { mutate: updateOrganization } = useUpdateOrganization();

  const timezones = useMemo(
    () => TimeZones?.data?.timezones || [],
    [TimeZones?.data?.timezones],
  );

  useEffect(() => {
    if (organization?.domain) {
      setValue(
        organization.domain.replace(/^https?:\/\//, '').replace(/^www\./, ''),
      );
    }
  }, [organization?.domain]);

  useDebouncedEffect(
    () => {
      if (
        updatedData &&
        Object.keys(updatedData).length > 0 &&
        JSON.stringify(updatedData) !== JSON.stringify(prevUpdatedData.current)
      ) {
        updateOrganization(updatedData);
        prevUpdatedData.current = updatedData;
      }
    },
    [updatedData],
    2000,
  );

  useEffect(() => {
    if (organization && timezones.length > 0) {
      const ownerCountry =
        timezones.find((c) => c.id === organization?.timezone_id) || null;
      setSelectedTimeZone(ownerCountry);
    }
  }, [organization, timezones]);

  return (
    <div className={cn('flex-1 space-y-5')}>
      {/* Organization Name */}
      <div className={cn('space-y-3')}>
        <Label
          htmlFor="name"
          className="font-outfit text-base font-medium text-black"
        >
          Name <span className="text-alert-prominent">*</span>
        </Label>
        <Input
          id="name"
          defaultValue={organization?.name || ''}
          className="h-9 w-full"
          onChange={(e) => setData({ name: e.target.value })}
        />
      </div>

      {/* Domain */}
      <div className="space-y-3">
        <Label
          htmlFor="domain"
          className="font-outfit text-base font-medium text-black"
        >
          Domain<span className="text-alert-prominent">*</span>
        </Label>
        <div className="flex w-full">
          <div className="bg-brand-primary font-outfit text-theme-text-light flex items-center px-3 text-xs font-normal">
            https://
          </div>

          <Input
            id="domain"
            placeholder="Enter your URL"
            value={value}
            className="h-9 rounded-l-none border-l-0"
            onChange={(e) => {
              let value = e.target.value.trim();
              setValue(value);
              // http error
              if (/^http:\/\//i.test(value)) {
                setError('Only https:// is supported, http:// is not allowed.');
                return;
              }

              // Normalize value (remove https:// and www.)
              value = value.replace(/^https?:\/\//i, '').replace(/^www\./i, '');

              // Regex for domain + subdomains
              const domainRegex =
                /^(?!-)([a-zA-Z0-9-]{1,63}(?<!-)\.)+([a-zA-Z]{2,63})$/;

              if (domainRegex.test(value)) {
                const tld = value.split('.').pop()?.toLowerCase();

                if (tld && validTLDs.includes(tld)) {
                  setData({ domain: `https://${value}` });
                  setError('');
                  setValue(value);
                } else {
                  setError('Invalid or unsupported TLD.');
                }
              } else {
                setError('Enter a valid domain with a proper TLD.');
              }
            }}
          />
        </div>
        {error && (
          <p className="text-alert-prominent text-xs">
            {typeof error === 'string' ? error : 'Enter a valid domain!'}
          </p>
        )}
        <p className="font-outfit text-gray-primary text-xs font-normal">
          This will be your workspace’s public URL.
        </p>
      </div>

      {/* Country / Timezone */}
      <div className="w-full space-y-3">
        <Label
          htmlFor="timezone"
          className="font-outfit text-base font-medium text-black"
        >
          Time zone
        </Label>

        {isLoading && (
          <div className="text-theme-text-primary text-sm">
            Loading timezones...
          </div>
        )}
        {isError && <ErrorText error="The data couldn't be fetched" />}
        {!isLoading && !isError && (
          <WorkspaceCountrySelect
            value={selectedTimeZone}
            onChange={(timezone) => {
              setSelectedTimeZone(timezone);
              setData({ timezone_id: timezone.id });
            }}
            buttonClassName="w-full text-black py-2"
            contentClassName="cursor-pointer hover:bg-white"
            itemClassName="hover:bg-gray-100 px-2 py-1"
            wrapperClassName="w-full"
            timezones={timezones}
          />
        )}
      </div>
    </div>
  );
};

export default WorkspaceProfile;
