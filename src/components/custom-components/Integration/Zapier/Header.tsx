import React from 'react';
import Image from 'next/image';
import zapier from '@/assets/images/integration/zapier.svg';
import { Icons } from '@/components/ui/Icons';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <div>
      <div
        className="relative flex flex-col items-center overflow-hidden rounded-b-lg p-6 text-white"
        style={{
          background:
            'linear-gradient(110deg, #210832 1.27%, #A054D7 48.11%, #590099 48.12%)',
        }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.05) 55%, transparent 60%)',
          }}
        />

        <div className="absolute top-4 left-4 z-10 flex cursor-pointer items-center">
          <Icons.arrow_left size={24} />
          <span className="text-sm leading-5 font-medium underline">
            Go Back
          </span>
        </div>

        <div className="absolute top-4 right-4 z-10">
          <span className="rounded-sm bg-black px-3 py-1 text-sm leading-5 font-medium text-white">
            Paid
          </span>
        </div>

        <div className="relative z-10 mt-8 flex flex-col items-center">
          <div className="bg-opacity-20 bg-brand-light rounded-full p-3.5 backdrop-blur-sm">
            <Image src={zapier} alt="Zapier" className="h-12 w-12" />
          </div>
          <h1 className="text-5xl leading-13 font-bold">Zapier</h1>
          <p className="mt-8 max-w-xl text-center text-sm leading-5 font-normal">
            Automate customer interactions, streamline workflows, and enhance
            support efficiency.
          </p>
        </div>
      </div>

      <div className="mt-7.5 flex justify-center gap-6">
        <Button size="sm" className="px-3 py-4">
          Install Zapier
        </Button>

        <Button variant="outline" size="sm" className="px-3 py-4">
          Watch Demo Video
        </Button>
      </div>
    </div>
  );
};

export default Header;
