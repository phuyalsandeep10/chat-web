'use client';

import { Icons } from '@/components/ui/Icons';
import Link from 'next/link';
import React from 'react';
import { ViewDetailsProps } from './types';

const ViewDetails: React.FC<ViewDetailsProps> = ({ href }) => {
  return (
    <Link href={href}>
      <div className="mt-3.5 flex cursor-pointer justify-end gap-2.5">
        <p className="text-base leading-6.5 font-medium">See More</p>
        <Icons.ri_arrow_right_long_line />
      </div>
    </Link>
  );
};

export default ViewDetails;
