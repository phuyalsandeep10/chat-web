'use client';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import axios from 'axios';

interface Ticket {
  id: number;
  title: string;
  created_at: string;
  created_by: {
    name: string;
    email: string;
  };
  priority?: {
    name: string;
    fg_color?: string;
    bg_color?: string;
  };
  status?: {
    name: string;
    fg_color?: string;
    bg_color?: string;
  };
}

// Define options type for TypeScript
type QueryOptions = UseQueryOptions<Ticket[], Error>;

export const useTicketsByEmail = (email?: string) => {
  const queryFn = async () => {
    if (!email) return [];
    const response = await axios.get(`/api/tickets?email=${email}`);
    return response.data as Ticket[];
  };

  return useQuery<Ticket[], Error>({
    queryKey: ['tickets', email],
    queryFn,
    enabled: !!email, // only fetch if email exists
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    cacheTime: 1000 * 60 * 10, // 10 minutes
  } as QueryOptions);
};
