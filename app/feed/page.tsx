import { Headphones, Music, Mic, Gift } from 'lucide-react';
import NavigationCard from '@/components/ui/NavigationCard';
import { SITE_CONFIG } from '@/config/site';
const cardData = [
  {
    icon: <Headphones />,
    title: "Decentralized Playlist",
    description: "Vote for the music you like to contribute to the playlist.",
    href: "/feed/music"
  },
  {
    icon: <Music />,
    title: "Decentralized DJs",
    description: "Vouch for your favorite DJs.",
    href: "/feed/dj"
  },
  {
    icon: <Mic />,
    title: "Karaoke",
    description: "Vouch for friends, so they can cut the line and have their moment of fame.",
    href: "/feed/karaoke"
  },
  {
    icon: <Gift />,
    title: "DevCon Pack",
    description: "Coming soon...",
    href: "/feed/special-box"
  }
];

function Page() {
  return (
    <div className=" mx-auto space-y-4 p-4 bg-custom-purple h-full pb-24">
      <div>
        <h1 className='!font-extrabold text-2xl md:text-3xl lg:text-4xl pb-2'>{SITE_CONFIG.description}</h1>
        <p>Select a category to start</p>
      </div>
      {cardData.map((card, index) => (
        <NavigationCard
          key={index}
          icon={card.icon}
          title={card.title}
          description={card.description}
          href={card.href}
        />
      ))}
    </div>
  );
}

export default Page
