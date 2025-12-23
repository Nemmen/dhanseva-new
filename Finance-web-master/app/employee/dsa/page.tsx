'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeService } from '@/services/employeeService';
import { EmployeeDsa, InviteDsaPayload } from '@/types/employee.types';
import { toast } from 'sonner';
import {
  FiSearch,
  FiLoader,
  FiAlertCircle,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCheckCircle,
  FiXCircle,
  FiUserPlus,
  FiX,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';

// DSA Card Component
const DsaCard = ({ dsa }: { dsa: EmployeeDsa }) => {
  return (
    <div className="bg-white rounded-xl border p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
          <FiUser className="text-indigo-600" size={24} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-gray-900 truncate">
              {dsa.dsaProfile.fullName}
            </h3>
            {dsa.dsaProfile.isActive ? (
              <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full font-medium">
                Active
              </span>
            ) : (
              <span className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-full font-medium">
                Inactive
              </span>
            )}
          </div>

          <p className="text-sm text-gray-500 mt-1">{dsa.email}</p>

          <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <FiPhone size={14} className="text-gray-400" />
              {dsa.dsaProfile.phone}
            </span>
            <span className="flex items-center gap-1">
              <FiMapPin size={14} className="text-gray-400" />
              {dsa.dsaProfile.city}, {dsa.dsaProfile.state}
            </span>
          </div>

          <div className="flex gap-4 mt-3 text-sm">
            <div className="bg-blue-50 px-3 py-1 rounded-lg">
              <span className="font-semibold text-blue-700">{dsa.assignedCount}</span>
              <span className="text-blue-600 ml-1">Assigned</span>
            </div>
            <div className="bg-green-50 px-3 py-1 rounded-lg">
              <span className="font-semibold text-green-700">{dsa.completedCount}</span>
              <span className="text-green-600 ml-1">Completed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// DSA Table Row
const DsaRow = ({ dsa }: { dsa: EmployeeDsa }) => {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
            <FiUser className="text-indigo-600" size={18} />
          </div>
          <div>
            <p className="font-medium text-gray-900">{dsa.dsaProfile.fullName}</p>
            <p className="text-xs text-gray-500">{dsa.email}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 hidden md:table-cell">
        <span className="text-sm text-gray-700">{dsa.dsaProfile.phone}</span>
      </td>
      <td className="px-4 py-3 hidden lg:table-cell">
        <span className="text-sm text-gray-700">
          {dsa.dsaProfile.city}, {dsa.dsaProfile.state}
        </span>
      </td>
      <td className="px-4 py-3">
        {dsa.dsaProfile.isActive ? (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full font-medium">
            <FiCheckCircle size={12} /> Active
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full font-medium">
            <FiXCircle size={12} /> Inactive
          </span>
        )}
      </td>
      <td className="px-4 py-3 text-center">
        <span className="text-sm font-medium text-indigo-600">{dsa.assignedCount}</span>
      </td>
      <td className="px-4 py-3 text-center hidden md:table-cell">
        <span className="text-sm font-medium text-green-600">{dsa.completedCount}</span>
      </td>
    </tr>
  );
};

export default function EmployeeDsaDirectoryPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 20;

  // Invite form state
  const [inviteForm, setInviteForm] = useState<InviteDsaPayload>({
    email: '',
    firstName: '',
    lastName: '',
    regions: [],
    message: '',
  });
  const [regionInput, setRegionInput] = useState('');

  // Fetch DSAs
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['employee-dsas', page, showActiveOnly],
    queryFn: () =>
      employeeService.getDsas({
        page,
        limit,
        isActive: showActiveOnly ? true : undefined,
      }),
  });

  // Invite DSA mutation
  const inviteMutation = useMutation({
    mutationFn: (payload: InviteDsaPayload) => employeeService.inviteDsa(payload),
    onSuccess: (data) => {
      toast.success(`Invitation sent to ${data.sentTo}`);
      queryClient.invalidateQueries({ queryKey: ['employee-dsas'] });
      setShowInviteModal(false);
      setInviteForm({ email: '', firstName: '', lastName: '', regions: [], message: '' });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send invitation');
    },
  });

  // Filter DSAs by search term
  const filteredDsas = useMemo(() => {
    if (!data?.dsas) return [];
    if (!searchTerm) return data.dsas;

    const term = searchTerm.toLowerCase();
    return data.dsas.filter(
      (dsa) =>
        dsa.dsaProfile.fullName.toLowerCase().includes(term) ||
        dsa.email.toLowerCase().includes(term) ||
        dsa.dsaProfile.city.toLowerCase().includes(term) ||
        dsa.dsaProfile.phone.includes(term)
    );
  }, [data?.dsas, searchTerm]);

  const handleAddRegion = () => {
    if (regionInput.trim() && !inviteForm.regions.includes(regionInput.trim())) {
      setInviteForm({
        ...inviteForm,
        regions: [...inviteForm.regions, regionInput.trim()],
      });
      setRegionInput('');
    }
  };

  const handleRemoveRegion = (region: string) => {
    setInviteForm({
      ...inviteForm,
      regions: inviteForm.regions.filter((r) => r !== region),
    });
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteForm.email || !inviteForm.firstName || !inviteForm.lastName || inviteForm.regions.length === 0) {
      toast.error('Please fill all required fields');
      return;
    }
    inviteMutation.mutate(inviteForm);
  };

  const pagination = data?.pagination;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <FiLoader className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <FiAlertCircle className="mx-auto text-red-500 mb-4" size={48} />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load DSAs</h3>
        <p className="text-gray-600 mb-4">Please try again.</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">DSA Directory</h1>
          <p className="text-gray-600 text-sm mt-1">
            {pagination?.total || 0} DSA agents
          </p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium"
        >
          <FiUserPlus size={18} />
          Invite DSA
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, email, city, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </div>

          {/* Active Only Toggle */}
          <label className="flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="checkbox"
              checked={showActiveOnly}
              onChange={(e) => {
                setShowActiveOnly(e.target.checked);
                setPage(1);
              }}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">Active only</span>
          </label>
        </div>
      </div>

      {/* Results */}
      {filteredDsas.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
          <FiUser className="mx-auto text-gray-300 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No DSAs found</h3>
          <p className="text-gray-500 text-sm">
            {searchTerm ? 'Try adjusting your search.' : 'No DSA agents registered yet.'}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden hidden lg:block">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    DSA
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Location
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Completed
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDsas.map((dsa) => (
                  <DsaRow key={dsa.id} dsa={dsa} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile/Tablet Cards */}
          <div className="lg:hidden grid gap-4 sm:grid-cols-2">
            {filteredDsas.map((dsa) => (
              <DsaCard key={dsa.id} dsa={dsa} />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border p-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiChevronLeft size={18} />
                <span className="hidden sm:inline">Previous</span>
              </button>

              <span className="text-sm text-gray-600">
                Page {pagination.page} of {pagination.pages}
              </span>

              <button
                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                disabled={page >= pagination.pages}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="hidden sm:inline">Next</span>
                <FiChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      )}

      {/* Invite DSA Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Invite New DSA</h3>
              <div
                onClick={() => setShowInviteModal(false)}
                className="p-1 rounded hover:bg-gray-100"
              >
                <FiX size={20} />
              </div>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="firstName">
                    First Name *
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={inviteForm.firstName}
                    onChange={(e) => setInviteForm({ ...inviteForm, firstName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="lastName">
                    Last Name *
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={inviteForm.lastName}
                    onChange={(e) => setInviteForm({ ...inviteForm, lastName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Regions *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={regionInput}
                    onChange={(e) => setRegionInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddRegion();
                      }
                    }}
                    placeholder="Add region (e.g., Mumbai)"
                    className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddRegion}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    Add
                  </button>
                </div>
                {inviteForm.regions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {inviteForm.regions.map((region) => (
                      <span
                        key={region}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                      >
                        {region}
                        <button
                          type="button"
                          onClick={() => handleRemoveRegion(region)}
                          className="hover:text-indigo-900"
                          aria-label={`Remove ${region}`}
                        >
                          <FiX size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Personal Message (Optional)
                </label>
                <textarea
                  value={inviteForm.message}
                  onChange={(e) => setInviteForm({ ...inviteForm, message: e.target.value })}
                  rows={3}
                  placeholder="Add a personal message to the invitation..."
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={inviteMutation.isPending}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {inviteMutation.isPending ? (
                    <FiLoader className="animate-spin" />
                  ) : (
                    <>
                      <FiMail size={18} />
                      Send Invite
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
