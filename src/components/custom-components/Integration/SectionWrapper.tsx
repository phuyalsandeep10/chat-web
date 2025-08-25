'use client';

import React from 'react';
import { SectionWrapperProps } from './types';

const SectionWrapper: React.FC<SectionWrapperProps> = ({
  isVisible,
  children,
}) => {
  if (!isVisible) return null;

  return (
    <>
      <div className="mb-4">{children}</div>
      <hr className="bg-theme-text-light mb-6 h-[1px] border-0" />
    </>
  );
};

export default SectionWrapper;
