import React from 'react'
import communityData from "@/data/communityData.json"
import { notFound } from 'next/navigation'
import Home from '@/components/devcon/home/Home'

function getCommunityData(id: string) {
  return communityData[id as keyof typeof communityData] || null
}

export default function ProjectPage({ params }: { params: { project: string } }) {
  const community = getCommunityData(params.project)

  if (!community) {
    notFound()
  }

  if (params.project === 'devcon') {
    return <Home />
  }

  return (
    <div>
      {community.name}
    </div>
  )
}
