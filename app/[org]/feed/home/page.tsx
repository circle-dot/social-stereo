import { Headphones, Gift } from 'lucide-react';
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
  {
    icon: <Gift />,
    title: "DevCon Pack",
    description: "Coming soon...",
    path: "special-box"
  }
];

const stamps = [
  { id: '1', title: 'Devcon Resident', icon: '/StampIt.png' },
  { id: '2', title: 'First Upvote', icon: '/StampIt.png', isLocked: true },
  { id: '3', title: 'Early Adopter', icon: '/StampIt.png', isLocked: true },
  { id: '4', title: 'Top Contributor', icon: '/StampIt.png', isLocked: true },
]

export default function HomePage({ params }: PageProps) {
  const orgName = params.org
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  return (
    <div className="mx-auto space-y-4 p-4 h-full pb-24">
      <div className="max-w-4xl">
        <h1 className='!font-extrabold text-2xl md:text-3xl lg:text-4xl pb-2'>
          Welcome to {orgName}
        </h1>
        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nisi sit distinctio vel, ut facilis labore maxime nemo aliquid similique accusantium.</p>
        <StampCollection stamps={stamps} />
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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
