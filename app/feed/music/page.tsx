import React from 'react'
import TitleSection from '@/components/ui/TitleSection'
import MusicGrid from '@/components/ui/music/MusicGrid'

function MusicPage() {

  return (
    <div className="max-w-2xl mx-auto p-4">
      <TitleSection />
      <MusicGrid />
    </div>
  )
}

export default MusicPage
