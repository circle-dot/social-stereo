import React from 'react'
import { MoveRight } from 'lucide-react';
import StyledButton from '@/components/ui/StyledButton';

interface CardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}

const NavigationCard: React.FC<CardProps> = ({ icon, title, description, href }) => {
  return (
    <div className="bg-custom-darkGreen rounded-xl p-4 flex flex-col space-y-2 max-w-lg ">
      <div className="text-2xl text-custom-lightGreen">{icon}</div>
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <p className="text-xs text-gray-300">{description}</p>
      <StyledButton href={href} className='mt-4'>
        Play <MoveRight className='w-3 h-3' />
      </StyledButton>
    </div>
  );
};

export default NavigationCard;
