'use client';

import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

interface ServiceSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function ServiceSearch({ onSearch, placeholder = 'Search services...' }: ServiceSearchProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onSearch(e.target.value);
        }}
        placeholder={placeholder}
        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
    </form>
  );
}
