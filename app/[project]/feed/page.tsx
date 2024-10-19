import { Headphones, Music, Mic, Gift } from 'lucide-react';
import NavigationCard from '@/components/ui/NavigationCard';
import { SITE_CONFIG } from '@/config/site';
const cardData = [
  {
    icon: <Headphones />,
    title: "Decentralized Playlist",
    description: "Lorem ipsum dolor sit amet consectetur. Loboris orci malesuada nunc lobortis turpis proin lectus nibh.",
    href: "/decentralized-playlist"
  },
  {
    icon: <Music />,
    title: "Decentralized DJs",
    description: "Lorem ipsum dolor sit amet consectetur. Loboris orci malesuada nunc lobortis turpis proin lectus nibh.",
    href: "/decentralized-djs"
  },
  {
    icon: <Mic />,
    title: "Karaoke",
    description: "Lorem ipsum dolor sit amet consectetur. Loboris orci malesuada nunc lobortis turpis proin lectus nibh.",
    href: "/karaoke"
  },
  {
    icon: <Gift />,
    title: "Special Box",
    description: "Lorem ipsum dolor sit amet consectetur. Loboris orci malesuada nunc lobortis turpis proin lectus nibh.",
    href: "/special-box"
  }
];

function Page() {
  return (
    <div className=" mx-auto space-y-4 p-4 bg-custom-purple h-full">
      <div>
      <h1 className='!font-extrabold text-2xl md:text-3xl lg:text-4xl pb-2'>{SITE_CONFIG.description}</h1>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum vero quidem consequuntur hic nihil perferendis.</p>
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
