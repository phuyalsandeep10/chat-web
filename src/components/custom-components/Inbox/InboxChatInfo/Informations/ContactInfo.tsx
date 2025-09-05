'use client';

import { Icons } from '@/components/ui/Icons';
import React, { useState } from 'react';
import InformationsWrapper from './InformationsWrapper';
import { useAgentConversationStore } from '@/store/inbox/agentConversationStore';
import { useCopyToClipboard } from '@/hooks/utils/useCopyToClipboard';
import axiosInstance from '@/apiConfigs/axiosInstance';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';

type FormValues = {
  email?: string;
  phone?: string;
};

const ContactInfo = () => {
  const { customer, updateCustomerDetails } = useAgentConversationStore();
  const { copyToClipboard, isCopied } = useCopyToClipboard();

  const [editingField, setEditingField] = useState<null | 'email' | 'phone'>(
    null,
  );
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const startEditing = (field: 'email' | 'phone', initialValue: string) => {
    setEditingField(field);
    reset({ [field]: initialValue });
  };

  const cancelEditing = () => {
    setEditingField(null);
    reset();
  };

  const saveChanges = handleSubmit(async (data) => {
    if (!editingField) return;
    setLoading(true);
    try {
      const payload: any = { [editingField]: data[editingField] };
      const res = await axiosInstance.put(
        `/agent-chat/${customer?.id}/customer-update`,
        {
          ...customer,
          ...payload,
        },
      );

      // Update customer details in store
      updateCustomerDetails({
        ...customer,
        [editingField]: data[editingField],
      });

      setEditingField(null);
      reset();
      console.log('Updated successfully:', res.data);
    } catch (err) {
      console.error('Update failed', err);
    } finally {
      setLoading(false);
    }
  });

  return (
    <InformationsWrapper>
      <div>
        <h5 className="text-theme-text-dark flex items-center gap-2 font-medium">
          <Icons.contact_line className="h-6 w-6" />
          Contact Information
        </h5>

        <div className="space-y-2">
          {/* Email Section */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Icons.mail className="h-4 w-4" />
              {editingField === 'email' ? (
                <form onSubmit={saveChanges}>
                  <input
                    type="email"
                    className={clsx(
                      'rounded border px-2 py-1 text-sm',
                      errors.email && 'border-error',
                    )}
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Invalid email format',
                      },
                    })}
                  />
                  {errors.email && (
                    <span className="text-error text-xs">
                      {errors.email.message}
                    </span>
                  )}
                </form>
              ) : (
                <span className="text-sm text-gray-600 underline">
                  {customer?.email}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {editingField === 'email' ? (
                <>
                  <button
                    type="button"
                    onClick={saveChanges}
                    disabled={loading}
                    className="cursor-pointer"
                  >
                    {loading ? (
                      <Icons.loader className="text-brand-primary h-4 w-4 animate-spin" />
                    ) : (
                      <Icons.check className="h-4 w-4 text-green-500" />
                    )}
                  </button>
                  <button type="button" onClick={cancelEditing}>
                    <Icons.x className="text-error h-4 w-4" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => copyToClipboard(customer?.email ?? '')}
                    className="cursor-pointer"
                  >
                    {isCopied(customer?.email ?? '') ? (
                      <Icons.check className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Icons.copy className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                  <button
                    onClick={() => startEditing('email', customer?.email ?? '')}
                  >
                    <Icons.pencil className="h-4 w-4 text-gray-400" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Phone Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Icons.phone className="h-4 w-4" />
              {editingField === 'phone' ? (
                <form onSubmit={saveChanges} className="flex flex-col gap-1">
                  <input
                    type="text"
                    className={clsx(
                      'rounded border px-2 py-1 text-sm',
                      errors.phone && 'border-error',
                    )}
                    {...register('phone', {
                      required: 'Phone is required',
                      pattern: {
                        value: /^[0-9]{7,15}$/,
                        message: 'Invalid phone number',
                      },
                    })}
                  />
                  {errors.phone && (
                    <span className="text-error text-xs">
                      {errors.phone.message}
                    </span>
                  )}
                </form>
              ) : (
                <span className="text-sm text-gray-600 underline">
                  {customer?.phone}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {editingField === 'phone' ? (
                <>
                  <button
                    type="button"
                    onClick={saveChanges}
                    disabled={loading}
                    className="cursor-pointer"
                  >
                    {loading ? (
                      <Icons.loader className="text-brand-primary h-4 w-4 animate-spin" />
                    ) : (
                      <Icons.check className="h-4 w-4 text-green-500" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="cursor-pointer"
                  >
                    <Icons.x className="text-error h-4 w-4" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => copyToClipboard(customer?.phone ?? '')}
                    className="cursor-pointer"
                  >
                    {isCopied(customer?.phone ?? '') ? (
                      <Icons.check className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Icons.copy className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                  <button
                    onClick={() => startEditing('phone', customer?.phone ?? '')}
                    className="cursor-pointer"
                  >
                    <Icons.pencil className="h-4 w-4 text-gray-400" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </InformationsWrapper>
  );
};

export default ContactInfo;
