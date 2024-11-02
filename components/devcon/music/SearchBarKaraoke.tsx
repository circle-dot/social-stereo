"use client"
import React, { useState, useCallback } from 'react';
import { EAS_CONFIG } from '@/config/site';
import debounce from 'lodash/debounce';
import { ethers } from 'ethers';
import Link from 'next/link';

function SearchBarKaraoke() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ name: string; id: string }[]>([]);

  const fetchEnsNames = async (searchTerm: string) => {
    try {
      const response = await fetch(EAS_CONFIG.GRAPHQL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            query EnsNames($where: EnsNameWhereInput) {
              ensNames(where: $where) {
                name
                id
              }
            }
          `,
          variables: {
            where: {
              name: {
                contains: searchTerm
              }
            }
          }
        })
      });
      const data = await response.json();
      return data.data.ensNames;
    } catch (error) {
      console.error('Error fetching ENS names:', error);
      return [];
    }
  };

  const debouncedFetch = useCallback(
    debounce(async (searchTerm: string) => {
      if (!searchTerm) {
        setResults([]);
        return;
      }
      
      if (ethers.isAddress(searchTerm)) {
        setResults([{ name: searchTerm, id: searchTerm }]);
        return;
      }

      setLoading(true);
      const ensResults = await fetchEnsNames(searchTerm);
      setResults(ensResults);
      setLoading(false);
    }, 500),
    []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    debouncedFetch(value);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        placeholder="Enter ENS name or ETH address"
        className="w-full p-3 rounded-lg bg-custom-darkGreen border border-custom-lightGreen text-white"
      />
      
      {loading && (
        <div className="absolute right-3 top-3">
          <div className="animate-spin h-5 w-5 border-2 border-custom-lightGreen border-t-transparent rounded-full" />
        </div>
      )}

      {results.length > 0 && (
        <div className="absolute w-full mt-1 bg-custom-darkGreen border border-custom-lightGreen rounded-lg max-h-60 overflow-y-auto">
          {results.map((result) => (
            <Link
              key={result.id}
              href={`/address/${result.id}`}
              className="block p-3 hover:bg-custom-lightGreen/10 cursor-pointer text-white border-b border-custom-lightGreen/20 last:border-b-0"
              onClick={() => {
                setInput(result.name);
                setResults([]);
              }}
            >
              {result.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
export default SearchBarKaraoke;