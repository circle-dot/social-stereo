import React from 'react'

function TitleSection({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="text-3xl font-bold mb-2">{children}</h1>
  )
}

export default TitleSection