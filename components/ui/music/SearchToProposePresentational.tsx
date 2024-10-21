import React from 'react'
import MusicGrid from './MusicGrid'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

interface SearchToProposePresentationalProps {
  searchTerm: string
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSearchSubmit: (e: React.FormEvent) => void
  searchResults: any[] | undefined
}

function SearchToProposePresentational({
  searchTerm,
  handleSearchChange,
  handleSearchSubmit,
  searchResults,
}: SearchToProposePresentationalProps) {
  return (
    <div className="max-w-2xl mx-auto w-full">
      <form onSubmit={handleSearchSubmit} className="mb-6">
        <div className="relative">
          <Input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 rounded-full bg-custom-purple text-white placeholder-custom-lightGreen focus:outline-none focus:ring-2 focus:ring-custom-darkGreen"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-custom-lightGreen" size={20} />
        </div>
      </form>
      {searchResults && searchResults.length > 0 && (
        <MusicGrid tracks={searchResults} />
      )}
    </div>
  )
}

export default SearchToProposePresentational
