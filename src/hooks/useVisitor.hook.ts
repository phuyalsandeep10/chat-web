'use client';

import axiosInstance from '@/apiConfigs/axiosInstance';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
export const useVisitor = () => {
  const [visitor, setVisitor] = useState<any>();
  const searchParams = useSearchParams();
  const orgId = searchParams.get('orgId');

  const [loading, setLoading] = useState(false);

  const createVisitor = useCallback(async () => {
    console.log('create customer');
    setLoading(true);
    try {
      const res = await axiosInstance.post(`/customers`);

      setVisitor(res.data?.data);
      localStorage.setItem('visitor', JSON.stringify(res.data?.data));
    } catch (error) {
      console.error('Failed to create visitor:', error);
    } finally {
      setLoading(false);
    }
    console.log('Creating visitor...');
  }, []);
  const customerVisit = useCallback(async (customerId: number) => {
    if (!customerId) return;
    setLoading(true);
    try {
      await axiosInstance.post(`/customers/${customerId}/visit`);
    } catch (error) {
      console.error('Failed to create visitor:', error);
    } finally {
      setLoading(false);
    }
    console.log('Fetching visitor...');
  }, []);

  const initVisitor = useCallback(() => {
    const visitor = localStorage.getItem('visitor');
    console.log({ visitor });
    if (visitor) {
      const data = JSON.parse(visitor);

      setVisitor(data);
      customerVisit(data.customer.id);
      return;
    }
    if (!visitor) {
      createVisitor();
      return;
    }
  }, [createVisitor, customerVisit]);
  useEffect(() => {
    if (typeof window !== 'undefined' && orgId) {
      localStorage.setItem('X-Org-Id', orgId);

      initVisitor();
    }
  }, [initVisitor, orgId]);

  return { visitor, loading, setVisitor };
};
