import React from 'react'
import TitleSection from '@/components/ui/TitleSection'
import MusicGrid from '@/components/ui/music/MusicGrid'

function MusicPage() {

  return (
    <div className="max-w-2xl mx-auto p-4">
      <p className="text-sm text-gray-500 mb-4">Last Updated: {new Date().toLocaleDateString()}</p>
      <TitleSection />
      <MusicGrid />
    </div>
  )
}

export default MusicPage
