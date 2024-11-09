import { Headphones } from 'lucide-react';
import NavigationCard from '@/components/ui/NavigationCard';
import StampCollection from '@/components/devcon/stamps/StampCollection';

interface PageProps {
  params: {
    org: string
  }
}

const cardData = [
  {
    icon: <Headphones />,
    title: "Decentralized Playlist",
    description: "Vote for the music you like to contribute to the playlist.",
    path: "music"
  },
  // {
  //   icon: <Gift />,
  //   title: "DevCon Pack",
  //   description: "Coming soon...",
  //   path: "special-box"
  // }
];

export default function HomePage({ params }: PageProps) {
  const orgName = params.org
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  return (
    <div className="flex flex-col flex-grow w-full h-full max-w-2xl mx-auto px-4">
      <div className="max-w-4xl">
        <h1 className='!font-extrabold text-2xl md:text-3xl lg:text-4xl pb-2'>
          Welcome to {orgName}
        </h1>
        <p>This app lets you vote for your favorite music and collect stamps. An artifact with all the decentralized playlist will be minted once the event is over.</p>
        <StampCollection />
      </div>
      <div className="flex flex-col gap-4">
        {cardData.map((card, index) => (
          <NavigationCard
            key={index}
            icon={card.icon}
            title={card.title}
            description={card.description}
            href={`/${params.org}/feed/${card.path}`}
          />
        ))}
      </div>
    </div>
  );
}
