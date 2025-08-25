import { useState, useMemo } from 'react';
import { useForm, useWatch, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createTicketSchema,
  TicketFormData,
} from '@/modules/ticket/types/ticket.schema';
import { usePriorities } from '../../hooks/usePriorities';
import { useTeams } from '../../hooks/useTeams';
import { useTeamStore } from '@/services/teams/useTeamStore';
import { useTeamMembers } from '../../hooks/useTeamMembers';
import { useCustomers } from '../../hooks/useCustomers';
import { useCreateTicket } from '../../hooks/createTicketPayload';
import { useAuthStore } from '@/store/AuthStore/useAuthStore';

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

  const customerOptions = customers.map((customer: any) => ({
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
    const selectedCustomer = customerOptions.find(
      (opt: any) => opt.value === selectedEmail,
    );
    const priorityId = parseInt(selectedPriority);
    const memberIds = teamMembers
      .filter((member: any) =>
        selectedMembers?.includes(member.user?.name?.toLowerCase()),
      )
      .map((member: any) => member.user?.id || 0);

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
