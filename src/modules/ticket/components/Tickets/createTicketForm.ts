import {
  createTicketSchema,
  TicketFormData,
} from '@/modules/ticket/types/ticket.schema';
import { useTeamStore } from '@/services/teams/useTeamStore';
import { useAuthStore } from '@/store/AuthStore/useAuthStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useCreateTicket } from '../../hooks/createTicketPayload';
import { useCustomers } from '../../hooks/useCustomers';
import { usePriorities } from '../../hooks/usePriorities';
import { useTeamMembers } from '../../hooks/useTeamMembers';
import { useTeams } from '../../hooks/useTeams';

export const useCreateTicketForm = () => {
  const authData = useAuthStore((state) => state.authData);
  const organizationId =
    authData?.data?.user?.attributes?.organization_id || null;

  const [emailPopoverOpen, setEmailPopoverOpen] = useState(false);
  const [isAddingNewEmail, setIsAddingNewEmail] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // API hooks
  const { data: customers = [], isLoading: customersLoading } = useCustomers(
    organizationId as number,
  );
  const {
    data: priorities,
    isLoading: prioritiesLoading,
    error: prioritiesError,
  } = usePriorities();
  const { isLoading: teamsLoading, error: teamsError } = useTeams();
  const teams = useTeamStore((state) => state.teams);
  const { mutate: createTicket, isPending: isCreating } = useCreateTicket();

  // Form setup
  const ticketSchema = useMemo(
    () => createTicketSchema(isAddingNewEmail),
    [isAddingNewEmail],
  );
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      title: '',
      description: '',
      sender_domain: '',
      notes: '',
      attachment: [],
      priority_id: '',
      department_id: '',
      customer_email: '',
      customer_name: '',
      customer_phone: '',
      customer_location: '',
      assignees: [],
    },
  });

  // Watches
  const selectedTeam = useWatch({ control, name: 'department_id' });
  const selectedPriority = useWatch({ control, name: 'priority_id' });
  const selectedMembers = useWatch({ control, name: 'assignees' });
  const selectedEmail = useWatch({ control, name: 'customer_email' });

  // Derived data
  const selectedTeamObj = teams.find((t) => t.id.toString() === selectedTeam);
  const selectedTeamId = selectedTeamObj?.id || 0;
  const { data: teamMembers = [], isLoading: membersLoading } =
    useTeamMembers(selectedTeamId);

  const customerOptions = customers
    .filter((customer: any) => !!customer.email)
    .map((customer: any) => ({
      label: customer.email,
      value: customer.email,
      id: customer.id,
    }));

  const priorityColorMap =
    priorities?.reduce<Record<string, { bg: string; fg: string }>>(
      (acc, item) => {
        acc[item.id] = {
          bg: item.bg_color,
          fg: item.fg_color,
        };
        return acc;
      },
      {},
    ) ?? {};

  const priorityOptions =
    priorities?.map((p) => ({
      value: p.id.toString(),
      label: p.name.charAt(0).toUpperCase() + p.name.slice(1),
    })) ?? [];

  // Submit handler
  const onSubmit = (data: TicketFormData) => {
    console.log('Form data:', data); // Debug: Log form data
    const selectedCustomer = customerOptions.find(
      (opt: any) => opt.value === selectedEmail,
    );
    const priorityId = parseInt(selectedPriority);
    // Use assignees directly as memberIds (they are already user IDs)
    const memberIds: number[] = data.assignees
      ? data.assignees.map((id) => parseInt(id))
      : []; // Convert to numbers if API expects numbers

    console.log('memberIds:', memberIds); // Debug: Log memberIds

    createTicket(
      {
        data,
        teamId: selectedTeamObj?.id || 0,
        priorityId,
        memberIds,
        customerId: selectedCustomer?.id || 0,
      },
      {
        onSuccess: () => {
          reset();
          setIsAddingNewEmail(false);
          setPreviewImages([]);
          setPreviewImage(null);
        },
      },
    );
  };

  return {
    control,
    handleSubmit,
    errors,
    reset,
    setValue,
    getValues,
    watch,
    customers,
    customersLoading,
    customerOptions,
    emailPopoverOpen,
    setEmailPopoverOpen,
    isAddingNewEmail,
    setIsAddingNewEmail,
    priorities,
    prioritiesLoading,
    prioritiesError,
    priorityOptions,
    priorityColorMap,
    teams,
    teamsLoading,
    teamsError,
    teamMembers,
    membersLoading,
    previewImages,
    setPreviewImages,
    previewImage,
    setPreviewImage,
    selectedEmail,
    selectedTeamObj,
    isCreating,
    onSubmit,
  };
};
