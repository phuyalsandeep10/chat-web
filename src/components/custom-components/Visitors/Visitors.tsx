'use client';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import VisitorTable from '@/components/custom-components/Visitors/VisitorTable';
import Heading from '@/components/custom-components/Visitors/Heading';
import CurrentVisitors from '@/components/custom-components/Visitors/CurrentVisitors';
import { Icons } from '@/components/ui/Icons';
import { Skeleton } from '@/components/ui/skeleton';
import { VisitorsService } from '@/services/visitors/visitors';

const LoadingMapSkeleton = () => (
  <div className="h-[541px] w-full">
    <Skeleton className="h-full w-full rounded-md" />
  </div>
);

const VisitorMap = dynamic(
  () => import('@/components/custom-components/Visitors/VisitorMap'),
  {
    ssr: false,
    loading: () => <LoadingMapSkeleton />,
  },
);

const Visitors = () => {
  const [visitorLocations, setVisitorLocations] = useState<
    { lat: number; lng: number; count: number }[]
  >([]);

  useEffect(() => {
    const fetchVisitorLocations = async () => {
      try {
        const data = await VisitorsService.getVisitors();
        if (data?.data?.visitors_by_location) {
          const locations = data.data.visitors_by_location.map((loc: any) => ({
            lat: loc.latitude,
            lng: loc.longitude,
            count: loc.count,
          }));
          setVisitorLocations(locations);
        }
      } catch (err) {
        console.error('Error fetching visitor locations:', err);
      }
    };

    fetchVisitorLocations();
  }, []);

  return (
    <div className="font-outfit mx-28">
      <div className="mb-8">
        <Heading
          title="Visitors"
          description="Track and engage with visitors on your website in real-time."
          icon={<Icons.help className="text-theme-text-primary h-6 w-6" />}
        />
        <VisitorMap visitors={visitorLocations} />
      </div>
      <div>
        <div className="mb-10">
          <CurrentVisitors
            title="Current Visitors"
            description="See who is currently browsing your website and initiate conversations."
            highlightText="26 Active Visitors"
            buttonText="12% Increased"
            buttonIcon={<Icons.arrow_up_circle />}
          />
        </div>
        <div className="mb-20">
          <VisitorTable />
        </div>
      </div>
    </div>
  );
};

export default Visitors;
