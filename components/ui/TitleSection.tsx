"use client"
import React from 'react'
import { useParams } from 'next/navigation'

function TitleSection() {
    const params = useParams();
    const projectName = params.project as string;
  return (
    <h1 className="text-3xl font-bold mb-6">{projectName} Music</h1>
  )
}

export default TitleSection