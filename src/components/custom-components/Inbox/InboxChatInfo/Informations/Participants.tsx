import React from 'react';
import InformationsWrapper from './InformationsWrapper';
import { User } from 'lucide-react';
import { Icons } from '@/components/ui/Icons';
import Image from 'next/image';
import { Parisienne, Patrick_Hand } from 'next/font/google';

const participants = [
  {
    id: 1,
    name: 'Alison',
    photo: '/inbox/participants.png',
  },
  {
    id: 2,
    name: 'Alison',
    photo: '/inbox/participants.png',
  },
  {
    id: 3,
    name: 'Alison',
    photo: '/inbox/participants.png',
  },
  {
    id: 4,
    name: 'Alison',
    photo: '/inbox/participants.png',
  },
];
const Participants = () => {
  return (
    <InformationsWrapper>
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User />
            <h2 className="font-semibold">Participants</h2>
          </div>
          <Icons.plus_circle className="text-theme-text-dark h-5 w-5 cursor-pointer" />
        </div>

        <div className="mt-3 flex gap-4 px-2">
          {participants.map((participant) => (
            <Image
              key={participant.id}
              src={participant.photo}
              alt={participant.name}
              className="h-10 w-10"
              height={1000}
              width={1000}
            />
          ))}
        </div>
      </div>
    </InformationsWrapper>
  );
};

export default Participants;
