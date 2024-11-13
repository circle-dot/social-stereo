import React from 'react'
import { MoveRight } from 'lucide-react';
import Link from 'next/link';

interface NavigationCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}

const NavigationCard: React.FC<NavigationCardProps> = ({ icon, title, description, href }) => {
  return (
    <div className="bg-custom-darkGreen rounded-xl p-4 flex flex-col space-y-2 max-w-lg">
      <div className="text-2xl text-custom-lightGreen">{icon}</div>
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <p className="text-xs text-gray-300">{description}</p>
      <Link
        href={href}
        className="mt-4 py-2 px-8 rounded-full gap-3 
          inline-flex items-center justify-center
          bg-custom-lightGreen text-black text-base md:text-lg 
          hover:bg-custom-lightGreen/50 hover:text-custom-white
          transition-colors duration-200"
        prefetch={true}
      >
        Play <MoveRight className='w-3 h-3 ml-2' />
      </Link>
    </div>
  );
};

export default NavigationCard;
