'use client';

import axiosInstance from '@/apiConfigs/axiosInstance';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const customerUpdateFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(1, 'Phone is required'),
});

const CustomerUpdateForm = ({ visitor }: { visitor: any }) => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm<
    z.infer<typeof customerUpdateFormSchema>
  >({
    resolver: zodResolver(customerUpdateFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof customerUpdateFormSchema>) => {
    setLoading(true);
    const response = await axiosInstance.put(
      `/customers/${visitor.customer.id}/update`,
      data,
    );
    const result = response?.data;
    localStorage.setItem(
      'visitor',
      JSON.stringify({ ...visitor, customer: result?.data }),
    );
    console.log(response);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4 grid gap-2">
      <Input {...register('name')} placeholder="Name" />
      <Input {...register('email')} placeholder="Email Required" />
      <Input {...register('phone')} placeholder="Phone" />
      <Button disabled={loading} type="submit">
        Submit
      </Button>
    </form>
  );
};

export default CustomerUpdateForm;
