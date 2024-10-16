import React from 'react'
import communityData from "@/data/communityData.json"
import { notFound } from 'next/navigation'


function getCommunityData(id: string) {
  return communityData[id as keyof typeof communityData] || null
}

export default function ProjectPage({ params }: { params: { project: string } }) {

  const community = getCommunityData(params.project)

  if (!community) {
    notFound()
  }

  return (
    <div>
        {community.name}
    </div>
  )
}