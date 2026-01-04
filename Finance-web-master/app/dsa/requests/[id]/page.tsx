'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { dsaService } from '@/services/dsaService';
import { DsaRequestDetail, StatusUpdatePayload, RequestStatus } from '@/types/dsa.types';
import { toast } from 'sonner';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import { 
  FiArrowLeft,
  FiLoader,
  FiAlertCircle,
  FiUser,
  FiFileText,
  FiDownload,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiEdit3,
  FiEye,
  FiCalendar,
  FiMail,
  FiPhone,
  FiMapPin
} from 'react-icons/fi';

interface RequestDetailPageProps {
  params: { id: string };
}

// Status transition rules
const STATUS_TRANSITIONS: Record<string, RequestStatus[]> = {
  'UNPAID': [], // Read-only, wait for payment
  'PAID': ['IN_PROGRESS', 'CANCELLED'],
  'IN_PROGRESS': ['COMPLETED', 'CANCELLED'],
  'COMPLETED': [],
  'CANCELLED': [],
};
import { useUploadThing } from '@/lib/uploadthing';

// Status options for dropdown
const STATUS_OPTIONS: { value: RequestStatus; label: string; icon: React.ElementType; color: string }[] = [
  { value: 'UNPAID', label: 'Unpaid', icon: FiClock, color: 'gray' },
  { value: 'PAID', label: 'Paid', icon: FiCheckCircle, color: 'blue' },
  { value: 'IN_PROGRESS', label: 'In Progress', icon: FiClock, color: 'yellow' },
  { value: 'COMPLETED', label: 'Completed', icon: FiCheckCircle, color: 'green' },
  { value: 'CANCELLED', label: 'Cancelled', icon: FiXCircle, color: 'red' },
];

// Document preview component with edit capability for DSA
const DocumentPreview = ({ 
  label, 
  url,
  canEdit = false,
  onReplace,
}: { 
  label: string; 
  url?: string;
  canEdit?: boolean;
  onReplace?: (newUrl: string) => void;
}) => {
  const [isUploading, setIsUploading] = useState(false);
  
  const { startUpload } = useUploadThing('fileReplacement', {
    onClientUploadComplete: (res) => {
      if (res && res[0] && onReplace) {
        onReplace(res[0].ufsUrl || res[0].url);
        toast.success('Document updated successfully');
      }
      setIsUploading(false);
    },
    onUploadError: (error) => {
      toast.error(error.message || 'Failed to upload file');
      setIsUploading(false);
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onReplace) return;

    if (file.size > 4 * 1024 * 1024) {
      toast.error('File size must be less than 4MB');
      return;
    }

    setIsUploading(true);
    try {
      await startUpload([file]);
    } catch {
      toast.error('Failed to upload file');
      setIsUploading(false);
    }
  };

  if (!url) {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
        <div className="text-center">
          <FiFileText className="mx-auto text-gray-400 mb-2" size={32} />
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-xs text-gray-400">Not uploaded</p>
          {canEdit && onReplace && (
            <label className="mt-2 inline-block cursor-pointer">
              <input
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={handleFileChange}
              />
              <span className="text-xs text-blue-600 hover:text-blue-700">
                Upload now
              </span>
            </label>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <div className="border rounded-lg p-3 bg-gray-50">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <div className="flex items-center gap-2">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700"
            title="View document"
            aria-label="View document"
          >
            <FiEye size={18} />
          </a>
          <a
            href={url}
            download
            className="text-green-600 hover:text-green-700"
            title="Download document"
            aria-label="Download document"
          >
            <FiDownload size={18} />
          </a>
          {canEdit && onReplace && (
            <label className="cursor-pointer text-orange-600 hover:text-orange-700" title="Replace document">
              <input
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={handleFileChange}
                disabled={isUploading}
              />
              {isUploading ? (
                <FiLoader className="animate-spin" size={18} />
              ) : (
                <FiEdit3 size={18} />
              )}
            </label>
          )}
        </div>
      </div>
      <div className="aspect-video bg-white rounded border overflow-hidden">
        {url.match(/\.(jpg|jpeg|png|gif|webp)$/i) || url.includes('utfs.io') ? (
          <img
            src={url}
            alt={label}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <FiFileText size={48} />
          </div>
        )}
      </div>
    </div>
  );
};

// Audit log timeline item
const AuditLogItem = ({ log }: { log: any }) => {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
        <div className="w-0.5 h-full bg-gray-200 my-1"></div>
      </div>
      <div className="flex-1 pb-4">
        <p className="text-sm font-medium text-gray-900">{log.action.replace('_', ' ')}</p>
        <p className="text-xs text-gray-500 mt-1">
          {new Date(log.createdAt).toLocaleString('en-IN')}
        </p>
        {log.oldValue && log.newValue && (
          <p className="text-xs text-gray-600 mt-1">
            Changed from <span className="font-medium">{JSON.stringify(log.oldValue)}</span> to{' '}
            <span className="font-medium">{JSON.stringify(log.newValue)}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default function DsaRequestDetailPage({ params }: RequestDetailPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<RequestStatus | null>(null);
  const [statusNotes, setStatusNotes] = useState('');
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);

  // Fetch request details
  const { data: request, isLoading, error } = useQuery({
    queryKey: ['dsa-request', params.id],
    queryFn: () => dsaService.getRequestById(params.id),
  });

  // Status update mutation
  const statusMutation = useMutation({
    mutationFn: (payload: StatusUpdatePayload) => 
      dsaService.updateRequestStatus(params.id, payload),
    onSuccess: () => {
      toast.success('Status updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['dsa-request', params.id] });
      queryClient.invalidateQueries({ queryKey: ['dsa-requests'] });
      setShowStatusModal(false);
      setSelectedStatus(null);
      setStatusNotes('');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update status');
    },
  });

  // Document update mutation
  const documentMutation = useMutation({
    mutationFn: (documents: Record<string, string>) => 
      dsaService.updateRequestDocuments(params.id, documents),
    onSuccess: () => {
      toast.success('Document updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['dsa-request', params.id] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update document');
    },
  });

  // Handle document replacement
  const handleDocumentReplace = (fieldName: string, newUrl: string) => {
    documentMutation.mutate({ [fieldName]: newUrl });
  };

  // Available status transitions
  const availableTransitions = useMemo(() => {
    if (!request) return [];
    return STATUS_TRANSITIONS[request.status] || [];
  }, [request?.status]);

  // Status badge styling
  const statusBadge = useMemo(() => {
    if (!request) return { bg: 'bg-gray-100', text: 'text-gray-700' };
    const statusMap: Record<string, { bg: string; text: string }> = {
      'UNPAID': { bg: 'bg-gray-100', text: 'text-gray-700' },
      'PAID': { bg: 'bg-blue-100', text: 'text-blue-700' },
      'IN_PROGRESS': { bg: 'bg-yellow-100', text: 'text-yellow-700' },
      'COMPLETED': { bg: 'bg-green-100', text: 'text-green-700' },
      'CANCELLED': { bg: 'bg-red-100', text: 'text-red-700' },
    };
    return statusMap[request.status] || statusMap['UNPAID'];
  }, [request?.status]);

  const handleStatusUpdate = () => {
    if (!selectedStatus) return;
    setShowStatusConfirm(true);
  };

  const confirmStatusUpdate = () => {
    if (!selectedStatus) return;
    statusMutation.mutate({
      status: selectedStatus,
      notes: statusNotes || undefined,
    });
    setShowStatusConfirm(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <FiLoader className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="text-center py-12">
        <FiAlertCircle className="mx-auto text-red-500 mb-4" size={48} />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Request not found</h3>
        <p className="text-gray-600 mb-4">This request doesn't exist or you don't have access.</p>
        <Link
          href="/dsa/requests"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <FiArrowLeft size={18} />
          Back to Requests
        </Link>
      </div>
    );
  }

  const formData = request.formData || {};
  const baseData = formData.base || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dsa/requests"
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <FiArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              {request.service?.name || 'Service Request'}
            </h1>
            <p className="text-sm text-gray-500">ID: {request.id.slice(0, 8)}...</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1.5 text-sm rounded-full font-medium ${statusBadge.bg} ${statusBadge.text}`}>
            {request.status.replace('_', ' ')}
          </span>
          {request.paid && (
            <span className="px-3 py-1.5 text-sm rounded-full font-medium bg-green-100 text-green-700">
              ✓ Paid
            </span>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Request Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Service Info */}
          <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FiFileText className="text-blue-600" />
              Service Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Service Name</p>
                <p className="font-medium">{request.service?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-medium">{request.service?.category?.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Price</p>
                <p className="font-medium">₹{request.service?.price}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="font-medium">
                  {new Date(request.createdAt).toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FiUser className="text-blue-600" />
              Applicant Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <FiUser className="text-gray-400" size={16} />
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium">
                    {baseData.firstName} {baseData.lastName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FiMail className="text-gray-400" size={16} />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{baseData.email || request.createdBy?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FiPhone className="text-gray-400" size={16} />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{baseData.phone || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FiPhone className="text-gray-400" size={16} />
                <div>
                  <p className="text-sm text-gray-500">WhatsApp</p>
                  <p className="font-medium">{baseData.whatsapp || baseData.phone || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 sm:col-span-2">
                <FiMapPin className="text-gray-400 mt-0.5" size={16} />
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium">
                    {baseData.address && (
                      <>
                        {baseData.address}, {baseData.city}, {baseData.state} - {baseData.pincode}
                      </>
                    )}
                    {!baseData.address && 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Service-Specific Data */}
          {(formData.personal || formData.business || formData.financial || formData.govt) && (
            <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FiEdit3 className="text-blue-600" />
                Additional Information
              </h2>
              <div className="space-y-4">
                {/* Personal Legal */}
                {formData.personal && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {formData.personal.employmentStatus && (
                      <div>
                        <p className="text-sm text-gray-500">Employment Status</p>
                        <p className="font-medium">{formData.personal.employmentStatus}</p>
                      </div>
                    )}
                    {formData.personal.purposeDescription && (
                      <div className="sm:col-span-2">
                        <p className="text-sm text-gray-500">Purpose</p>
                        <p className="font-medium">{formData.personal.purposeDescription}</p>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Business Legal */}
                {formData.business && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {formData.business.businessName && (
                      <div>
                        <p className="text-sm text-gray-500">Business Name</p>
                        <p className="font-medium">{formData.business.businessName}</p>
                      </div>
                    )}
                    {formData.business.businessType && (
                      <div>
                        <p className="text-sm text-gray-500">Business Type</p>
                        <p className="font-medium">{formData.business.businessType}</p>
                      </div>
                    )}
                    {formData.business.registrationNumber && (
                      <div>
                        <p className="text-sm text-gray-500">Registration Number</p>
                        <p className="font-medium">{formData.business.registrationNumber}</p>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Financial Legal */}
                {formData.financial && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {formData.financial.bankName && (
                      <div>
                        <p className="text-sm text-gray-500">Bank Name</p>
                        <p className="font-medium">{formData.financial.bankName}</p>
                      </div>
                    )}
                    {formData.financial.loanAmount && (
                      <div>
                        <p className="text-sm text-gray-500">Loan Amount</p>
                        <p className="font-medium">₹{formData.financial.loanAmount.toLocaleString()}</p>
                      </div>
                    )}
                    {formData.financial.loanType && (
                      <div>
                        <p className="text-sm text-gray-500">Loan Type</p>
                        <p className="font-medium">{formData.financial.loanType}</p>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Govt Legal */}
                {formData.govt && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {formData.govt.departmentName && (
                      <div>
                        <p className="text-sm text-gray-500">Department</p>
                        <p className="font-medium">{formData.govt.departmentName}</p>
                      </div>
                    )}
                    {formData.govt.applicationNumber && (
                      <div>
                        <p className="text-sm text-gray-500">Application Number</p>
                        <p className="font-medium">{formData.govt.applicationNumber}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Documents */}
          <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FiFileText className="text-blue-600" />
              Uploaded Documents
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DocumentPreview 
                label="Aadhaar Front" 
                url={baseData.aadhaarFrontUrl}
                canEdit={true}
                onReplace={(url) => handleDocumentReplace('aadhaarFrontUrl', url)}
              />
              <DocumentPreview 
                label="Aadhaar Back" 
                url={baseData.aadhaarBackUrl}
                canEdit={true}
                onReplace={(url) => handleDocumentReplace('aadhaarBackUrl', url)}
              />
              <DocumentPreview 
                label="PAN Front" 
                url={baseData.panFrontUrl}
                canEdit={true}
                onReplace={(url) => handleDocumentReplace('panFrontUrl', url)}
              />
              <DocumentPreview 
                label="PAN Back" 
                url={baseData.panBackUrl}
                canEdit={true}
                onReplace={(url) => handleDocumentReplace('panBackUrl', url)}
              />
            </div>
            {!baseData.aadhaarFrontUrl && !baseData.panFrontUrl && (
              <p className="text-gray-500 text-sm text-center py-4">
                No documents uploaded
              </p>
            )}
          </div>
        </div>

        {/* Right Column - Actions & Timeline */}
        <div className="space-y-6">
          {/* Status Update */}
          <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Update Status</h2>
            
            {availableTransitions.length > 0 ? (
              <div className="space-y-3">
                {availableTransitions.map((status) => {
                  const option = STATUS_OPTIONS.find(o => o.value === status);
                  if (!option) return null;
                  
                  return (
                    <button
                      key={status}
                      onClick={() => {
                        setSelectedStatus(status);
                        setShowStatusModal(true);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-colors ${
                        status === 'COMPLETED'
                          ? 'border-green-200 hover:bg-green-50 text-green-700'
                          : status === 'CANCELLED'
                          ? 'border-red-200 hover:bg-red-50 text-red-700'
                          : 'border-blue-200 hover:bg-blue-50 text-blue-700'
                      }`}
                    >
                      <option.icon size={20} />
                      <span className="font-medium">Mark as {option.label}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 text-sm">
                  {request.status === 'UNPAID'
                    ? 'Waiting for payment'
                    : 'No further actions available'}
                </p>
              </div>
            )}
          </div>

          {/* Quick Info */}
          <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Info</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <FiCalendar className="text-gray-400" />
                <span className="text-gray-600">Created:</span>
                <span className="font-medium">
                  {new Date(request.createdAt).toLocaleDateString('en-IN')}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <FiClock className="text-gray-400" />
                <span className="text-gray-600">Updated:</span>
                <span className="font-medium">
                  {new Date(request.updatedAt).toLocaleDateString('en-IN')}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <FiUser className="text-gray-400" />
                <span className="text-gray-600">User ID:</span>
                <span className="font-medium font-mono text-xs">
                  {request.createdBy?.id?.slice(0, 8)}...
                </span>
              </div>
            </div>
          </div>

          {/* Audit Log */}
          {request.auditLogs && request.auditLogs.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity Log</h2>
              <div className="max-h-64 overflow-y-auto">
                {request.auditLogs.map((log) => (
                  <AuditLogItem key={log.id} log={log} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Update Modal */}
      {showStatusModal && selectedStatus && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Update Status to {selectedStatus.replace('_', ' ')}
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={statusNotes}
                onChange={(e) => setStatusNotes(e.target.value)}
                placeholder="Add any notes about this status change..."
                rows={3}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {selectedStatus === 'CANCELLED' && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">
                  <strong>Warning:</strong> Cancelling this request cannot be undone.
                </p>
              </div>
            )}
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setSelectedStatus(null);
                  setStatusNotes('');
                }}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                disabled={statusMutation.isPending}
                className={`flex-1 px-4 py-2 rounded-lg text-white font-medium ${
                  selectedStatus === 'CANCELLED'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                } disabled:opacity-50`}
              >
                {statusMutation.isPending ? (
                  <FiLoader className="animate-spin mx-auto" />
                ) : (
                  'Confirm'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Confirmation Modal */}
      <ConfirmationModal
        isOpen={showStatusConfirm}
        onClose={() => setShowStatusConfirm(false)}
        onConfirm={confirmStatusUpdate}
        title="Confirm Status Update"
        message={`Are you sure you want to change the status to ${selectedStatus?.replace('_', ' ')}?${selectedStatus === 'CANCELLED' ? ' This will cancel the request and you cannot undo this action.' : ''}${selectedStatus === 'COMPLETED' ? ' This will mark the request as completed and close it.' : ''}`}
        confirmText="Update Status"
        type={selectedStatus === 'CANCELLED' ? 'danger' : selectedStatus === 'COMPLETED' ? 'success' : 'warning'}
        isLoading={statusMutation.isPending}
      />
    </div>
  );
}
