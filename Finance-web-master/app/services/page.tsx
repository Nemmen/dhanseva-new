'use client';

import { useState, useMemo } from 'react';
import { useServices } from '@/hooks/useServices';
import { ServiceCategory } from '@/types/service.types';
import MainLayout from '@/components/layout/MainLayout';
import ServiceSearch from '@/components/services/ServiceSearch';
import CategoryFilter from '@/components/services/CategoryFilter';
import ServiceGrid from '@/components/services/ServiceGrid';

export default function ServicesPage() {
  const { data: services, isLoading } = useServices();
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter services based on category and search
  const filteredServices = useMemo(() => {
    if (!services) return [];

    let filtered = services.data || [];

    // Filter by category
    if (selectedCategory !== 'ALL') {
      filtered = filtered.filter((service) => service.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (service) =>
          service.name.toLowerCase().includes(query) ||
          (service.description && service.description.toLowerCase().includes(query))
      );
    }

    // Only show active services
    return filtered.filter((service) => service.isActive);
  }, [services, selectedCategory, searchQuery]);

  return (
    <MainLayout>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
        <div className="container-custom">
          <h1 className="text-4xl font-bold mb-4">Our Services</h1>
          <p className="text-xl text-blue-100">
            Explore our wide range of financial services designed to meet your needs
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <CategoryFilter
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* Search Bar */}
            <div className="mb-6">
              <ServiceSearch
                onSearch={setSearchQuery}
                placeholder="Search by service name or description..."
              />
            </div>

            {/* Results Count */}
            {!isLoading && (
              <div className="mb-6">
                <p className="text-gray-600">
                  Showing <span className="font-semibold">{filteredServices.length}</span> service
                  {filteredServices.length !== 1 ? 's' : ''}
                  {selectedCategory !== 'ALL' && (
                    <span> in <span className="font-semibold">{selectedCategory}</span></span>
                  )}
                  {searchQuery && (
                    <span> matching "<span className="font-semibold">{searchQuery}</span>"</span>
                  )}
                </p>
              </div>
            )}

            {/* Services Grid */}
            <ServiceGrid services={filteredServices} isLoading={isLoading} />
          </main>
        </div>
      </div>
    </MainLayout>
  );
}
