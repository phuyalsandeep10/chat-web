'use client';

import React, { useRef, useState } from 'react';
import { Icons } from '@/components/ui/Icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { showToast } from '@/shared/toast';
import { useUpdateTicket } from '../ticketOverview/view/apiCalls/updateAssign/useUpdateTicket';
import { UpdateTicketPayload } from '../ticketOverview/view/apiCalls/updateAssign/ticketApi';
import { z } from 'zod';

// ================== Debounce Hook ==================
function useDebounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debounced = (...args: Parameters<T>) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => fn(...args), delay);
  };

  return debounced as T;
}

// ================== Zod validation schemas ==================
const emailSchema = z
  .string()
  .email('Invalid email format')
  .min(1, 'Email is required');

const phoneSchemaRequired = z
  .string()
  .min(10, 'Phone number is required')
  .refine(
    (val) => /^[0-9+() -]+$/.test(val),
    'Phone number can only contain numbers, +, spaces, parentheses, and -',
  );

const phoneSchemaOptional = z
  .string()
  .optional()
  .refine(
    (val) => !val || /^[0-9+() -]+$/.test(val),
    'Phone number can only contain numbers, +, spaces, parentheses, and -',
  );

// ================== Editable Field ==================
interface EditableFieldProps {
  label: string;
  value: string;
  type?: string;
  ticketId: number | string;
  fieldKey: keyof UpdateTicketPayload;
  isRequired?: boolean; // handle required phone/name/location
}

export const EditableField = ({
  label,
  value,
  type = 'text',
  ticketId,
  fieldKey,
  isRequired = true,
}: EditableFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [fieldValue, setFieldValue] = useState(value || '');
  const [error, setError] = useState('');

  const { mutate } = useUpdateTicket();

  const debouncedUpdate = useDebounce((newValue: string) => {
    let validationError = '';

    // Email validation
    if (fieldKey === 'customer_email') {
      const result = emailSchema.safeParse(newValue);
      if (!result.success) validationError = result.error.issues[0].message;
    }
    // Phone validation
    else if (fieldKey === 'customer_phone') {
      const schema = isRequired ? phoneSchemaRequired : phoneSchemaOptional;
      const result = schema.safeParse(newValue);
      if (!result.success) validationError = result.error.issues[0].message;
    }
    // Other fields minimum 2 characters
    else if (isRequired && newValue.trim().length < 2) {
      validationError = 'Minimum 2 characters required';
    }

    if (validationError) {
      setError(validationError);
      return;
    }

    // Clear error and call API
    setError('');
    mutate(
      { ticketId, data: { [fieldKey]: newValue } },
      {
        onSuccess: () => {
          setIsEditing(false);
          setFieldValue(newValue);
          showToast({
            title: 'Updated',
            description: `${label} updated successfully.`,
            variant: 'success',
            position: 'top-right',
            duration: 3000,
          });
        },
        onError: () => {
          showToast({
            title: 'Error',
            description: `Failed to update ${label}.`,
            variant: 'error',
            position: 'top-right',
            duration: 3000,
          });
        },
      },
    );
  }, 1500);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setFieldValue(newValue);
    debouncedUpdate(newValue);
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(fieldValue)
      .then(() => {
        showToast({
          title: 'Copied!',
          description: `${label} copied to clipboard.`,
          variant: 'success',
          position: 'top-right',
          duration: 3000,
        });
      })
      .catch(() => {
        showToast({
          title: 'Error',
          description: `Failed to copy ${label}.`,
          variant: 'error',
          position: 'top-right',
          duration: 3000,
        });
      });
  };

  return (
    <div className="flex w-full flex-col gap-1">
      <div className="flex w-full items-center gap-2">
        <p className="text-brand-dark w-[81px] text-base font-semibold">
          {label}:
        </p>
        {isEditing ? (
          <input
            type={type}
            value={fieldValue}
            onChange={handleChange}
            className="border-gray-primary w-[150px] rounded border px-2 py-1"
          />
        ) : (
          <p
            className="text-brand-dark flex-1 overflow-hidden text-sm font-normal text-ellipsis whitespace-nowrap"
            title={fieldValue}
          >
            {fieldValue || 'N/A'}
          </p>
        )}

        <div className="flex flex-shrink-0 gap-2">
          <button
            onClick={handleCopy}
            className="text-brand-dark cursor-pointer"
          >
            <Icons.copy className="h-4 w-4" />
          </button>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-brand-dark cursor-pointer"
          >
            <Icons.ri_edit2_fill className="h-4 w-4" />
          </button>
        </div>
      </div>
      {error && <p className="text-alert-prominent text-xs">{error}</p>}
    </div>
  );
};

// ================== Ticket General Info ==================
interface Assignee {
  id: number | string;
  name: string;
  image?: string | null;
}

interface TicketGeneralInfoProps {
  ticketId: number | string;
  data: any; // Pass raw API data
  isAddingNewEmail?: boolean;
}

export const TicketGeneralInfo = ({
  ticketId,
  data,
}: TicketGeneralInfoProps) => {
  const customer_name = data.customer_name || data.customer?.name || 'N/A';
  const customer_email = data.customer_email || data.customer?.email || 'N/A';
  const customer_phone = data.customer_phone || data.customer?.phone || 'N/A';
  const customer_location =
    data.customer_location || data.customer?.location || 'N/A';
  const assignees = data.assignees || [];

  return (
    <div className="border-0.5 border-gray-primary flex flex-col gap-2 border p-2">
      <h4 className="font-outfit text-brand-dark flex items-center gap-2 text-xl font-semibold">
        <Icons.client className="h-5 w-5" />
        General Information
      </h4>

      <EditableField
        label="Name"
        value={customer_name}
        ticketId={ticketId}
        fieldKey="customer_name"
      />
      <EditableField
        label="Email"
        value={customer_email}
        type="email"
        ticketId={ticketId}
        fieldKey="customer_email"
      />
      <EditableField
        label="Phone"
        value={customer_phone}
        type="tel"
        ticketId={ticketId}
        fieldKey="customer_phone"
      />
      <EditableField
        label="Location"
        value={customer_location}
        ticketId={ticketId}
        fieldKey="customer_location"
      />

      <div className="flex items-center gap-6">
        <p className="font-outfit text-brand-dark text-sm font-semibold">
          Assigned Agent:
        </p>
        {assignees.length > 0 ? (
          <div className="flex -space-x-4">
            {assignees.map((assignee: any) => (
              <Tooltip key={assignee.id}>
                <TooltipTrigger asChild>
                  <Avatar className="h-10 w-10 cursor-pointer border-2 border-white">
                    {assignee.image ? (
                      <AvatarImage src={assignee.image} alt={assignee.name} />
                    ) : (
                      <AvatarFallback>
                        {assignee.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent side="top" className="font-outfit text-xs">
                  {assignee.name}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        ) : (
          <p className="text-gray-light text-sm">None</p>
        )}
      </div>
    </div>
  );
};
