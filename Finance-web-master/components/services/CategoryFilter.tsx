'use client';

import { ServiceCategory } from '@/types/service.types';

interface CategoryFilterProps {
  selectedCategory: ServiceCategory | 'ALL';
  onCategoryChange: (category: ServiceCategory | 'ALL') => void;
}

const categories: Array<{ value: ServiceCategory | 'ALL'; label: string }> = [
  { value: 'ALL', label: 'All Services' },
  { value: 'LOAN', label: 'Loans' },
  { value: 'INSURANCE', label: 'Insurance' },
  { value: 'CREDIT_CARD', label: 'Credit Cards' },
  { value: 'BANK_ACCOUNT', label: 'Bank Accounts' },
  { value: 'INVESTMENT', label: 'Investments' },
  { value: 'TAX', label: 'Tax Services' },
  { value: 'OTHER', label: 'Other' },
];

export default function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
      <div className="space-y-1">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => onCategoryChange(category.value)}
            className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
              selectedCategory === category.value
                ? 'bg-blue-600 text-white font-medium'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
}
