import navIcon from '@/public/navIcon.svg'
import navIcon2 from '@/public/navIcon2.svg'
// import navIcon3 from '@/public/navIcon3.svg'
// import navIcon4 from '@/public/navIcon4.svg'
import NavItem from './NavItem'

interface MainNavigationProps {
  org: string;
}

export default function MainNavigation({ org }: MainNavigationProps) {
  return (
    <div className="z-30 mx-4 my-2">
      <nav className="bg-custom-darkGreen border border-gray-800 rounded-3xl relative shadow-lg">
        <div className="flex justify-around items-center h-16 px-4">
          <NavItem icon={navIcon} href={`/${org}/feed/home`} />
          <NavItem icon={navIcon2} href={`/${org}/feed/music`} />
          {/* <NavItem icon={navIcon3} href={`/${org}/feed/karaoke`} />
          <NavItem icon={navIcon4} href={`/${org}/feed/dj`}/> */}
        </div>
      </nav>
    </div>
  )
}
