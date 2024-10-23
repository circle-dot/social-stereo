import React from 'react'
import TitleSection from '@/components/ui/TitleSection'
import MusicGrid from '@/components/ui/music/MusicGrid'
import { SITE_CONFIG } from '@/config/site'
import SearchToPropose from '@/components/ui/music/SearchToPropose'
import { Button } from '@/components/ui/button'
/* eslint-disable @typescript-eslint/no-explicit-any */
const mockTracks: any = {
  "tracks": [
      {
          "id": "7ouMYWpwJ422jRcDASZB7P",
          "name": "Knights of Cydonia",
          "rank": 1,
          "artists": [{ "name": "Muse" }],
          "album": {
              "name": "Black Holes and Revelations",
              "images": [
                  {
                      "url": "https://i.scdn.co/image/ab67616d0000b27328933b808bfb4cbbd0385400",
                      "height": 640,
                      "width": 640
                  }
              ]
          }
      },
      {
          "id": "4VqPOruhp5EdPBeR92t6lQ",
          "name": "Uprising",
          "rank": 2,
          "artists": [{ "name": "Muse" }],
          "album": {
              "name": "The Resistance",
              "images": [
                  {
                      "url": "https://i.scdn.co/image/ab67616d0000b273b6d4566db0d12894a1a3b7a2",
                      "height": 640,
                      "width": 640
                  }
              ]
          }
      },
      {
          "id": "2takcwOaAZWiXQijPHIx7B",
          "name": "Time is Running Out",
          "rank": 3,
          "artists": [{ "name": "Muse" }],
          "album": {
              "name": "Absolution",
              "images": [
                  {
                      "url": "https://i.scdn.co/image/ab67616d0000b2738cb690f962092fd44bbe2bf4",
                      "height": 640,
                      "width": 640
                  }
              ]
          }
      },
      {
          "id": "3WMj8moIAXJhHsyLaqIIHI",
          "name": "Starlight",
          "rank": 4,
          "artists": [{ "name": "Muse" }],
          "album": {
              "name": "Black Holes and Revelations",
              "images": [
                  {
                      "url": "https://i.scdn.co/image/ab67616d0000b27328933b808bfb4cbbd0385400",
                      "height": 640,
                      "width": 640
                  }
              ]
          }
      },
      {
          "id": "3skn2lauGk7Dx6bVIt5DVj",
          "name": "Supermassive Black Hole",
          "rank": 5,
          "artists": [{ "name": "Muse" }],
          "album": {
              "name": "Black Holes and Revelations",
              "images": [
                  {
                      "url": "https://i.scdn.co/image/ab67616d0000b27328933b808bfb4cbbd0385400",
                      "height": 640,
                      "width": 640
                  }
              ]
          }
      },
      {
          "id": "7xyYsOvq5Ec3P4fr6mM9fD",
          "name": "Hysteria",
          "rank": 6,
          "artists": [{ "name": "Muse" }],
          "album": {
              "name": "Absolution",
              "images": [
                  {
                      "url": "https://i.scdn.co/image/ab67616d0000b2738cb690f962092fd44bbe2bf4",
                      "height": 640,
                      "width": 640
                  }
              ]
          }
      },
      {
          "id": "0c4IEciLCDdXEhhKxj4ThA",
          "name": "Madness",
          "rank": 7,
          "artists": [{ "name": "Muse" }],
          "album": {
              "name": "The 2nd Law",
              "images": [
                  {
                      "url": "https://i.scdn.co/image/ab67616d0000b2738cb690f962092fd44bbe2bf4",
                      "height": 640,
                      "width": 640
                  }
              ]
          }
      },
      {
          "id": "4rPkN1FMzQyFNP9cLUGIIB",
          "name": "Resistance",
          "rank": 8,
          "artists": [{ "name": "Muse" }],
          "album": {
              "name": "The Resistance",
              "images": [
                  {
                      "url": "https://i.scdn.co/image/ab67616d0000b273b6d4566db0d12894a1a3b7a2",
                      "height": 640,
                      "width": 640
                  }
              ]
          }
      },
      {
          "id": "1Q8e1lf1uYV6HEZ911ZMbq",
          "name": "Plug In Baby",
          "rank": 9,
          "artists": [{ "name": "Muse" }],
          "album": {
              "name": "Origin of Symmetry",
              "images": [
                  {
                      "url": "https://i.scdn.co/image/ab67616d0000b2738cb690f962092fd44bbe2bf4",
                      "height": 640,
                      "width": 640
                  }
              ]
          }
      },
      {
          "id": "2UqGLVPYUxWkIzQatBKLJG",
          "name": "Psycho",
          "rank": 10,
          "artists": [{ "name": "Muse" }],
          "album": {
              "name": "Drones",
              "images": [
                  {
                      "url": "https://i.scdn.co/image/ab67616d0000b2738cb690f962092fd44bbe2bf4",
                      "height": 640,
                      "width": 640
                  }
              ]
          }
      },
      {
          "id": "383QXk8nb2YrARMUwDdjQS",
          "name": "Pressure",
          "rank": 11,
          "artists": [{ "name": "Muse" }],
          "album": {
              "name": "Simulation Theory",
              "images": [
                  {
                      "url": "https://i.scdn.co/image/ab67616d0000b2738cb690f962092fd44bbe2bf4",
                      "height": 640,
                      "width": 640
                  }
              ]
          }
      },
      {
          "id": "3lPr8ghNDBLc2uZovNyLs9",
          "name": "Supermassive Black Hole",
          "rank": 12,
          "artists": [{ "name": "Muse" }],
          "album": {
              "name": "Black Holes and Revelations",
              "images": [
                  {
                      "url": "https://i.scdn.co/image/ab67616d0000b27328933b808bfb4cbbd0385400",
                      "height": 640,
                      "width": 640
                  }
              ]
          }
      },
      {
          "id": "5YtypBTQCjbujLqDV8SZd3",
          "name": "Won't Stand Down",
          "rank": 13,
          "artists": [{ "name": "Muse" }],
          "album": {
              "name": "Will of the People",
              "images": [
                  {
                      "url": "https://i.scdn.co/image/ab67616d0000b27328933b808bfb4cbbd0385400",
                      "height": 640,
                      "width": 640
                  }
              ]
          }
      }
  ]
}

function MusicPage() {
  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4 pb-32">
      <div className="mb-4">
        <TitleSection>{SITE_CONFIG.description}</TitleSection>
        <p className='text-sm text-white mb-4'>Playlist Last Updated: {new Date().toLocaleDateString()}</p>
        <SearchToPropose />
      </div>
      <div className="flex-grow overflow-y-auto">
        <MusicGrid tracks={mockTracks.tracks} />
      </div>
      <Button className="bg-custom-lightGreen text-custom-black h-10 py-4 px-6 rounded-full w-full mt-4 mb-10">
        Propose your song
      </Button>
    </div>
  )
}

export default MusicPage
