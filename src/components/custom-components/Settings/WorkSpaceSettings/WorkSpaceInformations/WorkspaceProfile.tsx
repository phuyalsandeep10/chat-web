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
import { useWorkspaceInformationStore } from '@/store/WorkspaceInformation/useWorkspaceInformation';

const WorkspaceProfile = () => {
  const [rawValue, setRawValue] = useState('');
  const [error, setError] = useState('');
  const [selectedTimeZone, setSelectedTimeZone] = useState<TimeZone | null>(
    null,
  );
  const { updatedData, setData } = useWorkspaceStore();
  const prevUpdatedData = useRef<Partial<WorkspaceData>>(updatedData);
  const { workspace: organization, updateWorkspace } =
    useWorkspaceInformationStore();

  const { data: TimeZones, isLoading, isError } = useGetTimeZones();
  const { mutate: updateOrganization } = useUpdateOrganization();

  const timezones = useMemo(
    () => TimeZones?.data?.timezones || [],
    [TimeZones?.data?.timezones],
  );

  // Initialize from org domain
  useEffect(() => {
    if (organization?.domain) {
      const normalized = organization.domain
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '');
      setRawValue(normalized);
    }
  }, [organization?.domain]);

  // Debounced update to API
  useDebouncedEffect(
    () => {
      if (
        updatedData &&
        Object.keys(updatedData).length > 0 &&
        JSON.stringify(updatedData) !== JSON.stringify(prevUpdatedData.current)
      ) {
        updateOrganization(updatedData);
        if (updatedData.name) {
          updateWorkspace({ name: updatedData.name });
        }
        if (updatedData.domain) {
          updateWorkspace({ domain: updatedData.domain });
        }
        if (updatedData.logo) {
          updateWorkspace({ logo: updatedData.logo });
        }

        prevUpdatedData.current = updatedData;
      }
    },
    [updatedData],
    2000,
  );

  // Debounced domain cleanup + validation
  useDebouncedEffect(
    () => {
      if (!rawValue) return;

      let normalized = rawValue.trim();

      // reject http://
      if (/^http:\/\//i.test(normalized)) {
        setError('Only https:// is supported, http:// is not allowed.');
        return;
      }

      // remove https:// and www.
      normalized = normalized
        .replace(/^https?:\/\//i, '')
        .replace(/^www\./i, '');

      // reject spaces
      if (/\s/.test(normalized)) {
        setError('Domain cannot contain spaces.');
        return;
      }

      // Regex for domain: labels + dot + TLD (>=2 chars)
      const domainRegex = /^(?!-)([a-zA-Z0-9-]{1,63}(?<!-)\.)+[a-zA-Z]{2,}$/;

      if (domainRegex.test(normalized)) {
        setData({ domain: `https://${normalized}` });
        setError('');
        setRawValue(normalized); // update input after cleanup
      } else {
        setError('Enter a valid domain.');
      }
    },
    [rawValue],
    1500, // delay cleanup
  );

  // Set timezone if org has one
  useEffect(() => {
    if (organization && timezones.length > 0 && !selectedTimeZone) {
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
            value={rawValue}
            className="h-9 rounded-l-none border-l-0"
            onChange={(e) => setRawValue(e.target.value)}
          />
        </div>
        {error && <p className="text-alert-prominent text-xs">{error}</p>}
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
