import React, { memo } from 'react'
import { MoveRight } from 'lucide-react';
import Link from 'next/link';

interface NavigationCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}

const NavigationCard = memo(function NavigationCard({ icon, title, description, href }: NavigationCardProps) {
  return (
    <Link
      href={href}
      prefetch={true}
      className="bg-custom-darkGreen rounded-xl p-4 flex flex-col space-y-2 max-w-lg 
        hover:bg-custom-darkGreen/90 transition-colors duration-200"
    >
      <div className="text-2xl text-custom-lightGreen">{icon}</div>
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <p className="text-xs text-gray-300">{description}</p>
      <div
        className="mt-4 py-2 px-8 rounded-full gap-3 
          inline-flex items-center justify-center
          bg-custom-lightGreen text-black text-base md:text-lg 
          hover:bg-custom-lightGreen/50 hover:text-custom-white
          transition-colors duration-200"
      >
        Play <MoveRight className='w-3 h-3 ml-2' />
      </div>
    </Link>
  );
});

export default NavigationCard;
