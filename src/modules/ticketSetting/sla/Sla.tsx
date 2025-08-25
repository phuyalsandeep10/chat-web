'use client';
import React from 'react';
import SlaTable from './SlaTable';

interface SlaProps {
  slaList: any[];
}

export default function SLA({ slaList }: SlaProps) {
  return (
    <>
      <div>
        <SlaTable slaList={slaList} />
      </div>
    </>
  );
}
