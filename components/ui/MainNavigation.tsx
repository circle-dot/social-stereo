import navIcon from '@/public/navIcon.svg'
import navIcon2 from '@/public/navIcon2.svg'
import navIcon3 from '@/public/navIcon3.svg'
import navIcon4 from '@/public/navIcon4.svg'
import NavItem from './NavItem'

export default function MainNavigation() {
  return (
    <div className="fixed bottom-4 left-4 right-4 ">
      <nav className="bg-custom-darkGreen border border-gray-800 rounded-3xl relative shadow-lg">
        <div className="flex justify-around items-center h-16 px-4">
          <NavItem icon={navIcon} href="/feed" />
          <NavItem icon={navIcon2} href="/feed/music" />
          <NavItem icon={navIcon3} href="/feed/karaoke" />
          <NavItem icon={navIcon4} href="/feed/dj"/>
        </div>
      </nav>
    </div>
  )
}
