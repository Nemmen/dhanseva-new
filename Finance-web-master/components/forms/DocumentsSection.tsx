'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import DocumentEditor from './DocumentEditor';
import { FileText, Save, X, Edit3 } from 'lucide-react';
import api from '@/lib/api';

interface DocumentData {
  aadhaarFrontUrl?: string;
  aadhaarBackUrl?: string;
  panFrontUrl?: string;
  panBackUrl?: string;
}

interface DocumentsSectionProps {
  requestId: string;
  documents: DocumentData;
  canEdit?: boolean;
  onDocumentsUpdate?: (docs: DocumentData) => void;
}

export default function DocumentsSection({
  requestId,
  documents,
  canEdit = false,
  onDocumentsUpdate,
}: DocumentsSectionProps) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editedDocs, setEditedDocs] = useState<DocumentData>(documents);

  // Mutation to update request with new document URLs
  const updateMutation = useMutation({
    mutationFn: async (newDocs: DocumentData) => {
      const response = await api.patch(`/requests/${requestId}/documents`, {
        documents: newDocs,
      });
      return response;
    },
    onSuccess: () => {
      toast.success('Documents updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['request', requestId] });
      queryClient.invalidateQueries({ queryKey: ['employee-request', requestId] });
      queryClient.invalidateQueries({ queryKey: ['dsa-request', requestId] });
      setIsEditing(false);
      onDocumentsUpdate?.(editedDocs);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update documents');
    },
  });

  const handleDocumentUpdate = (field: keyof DocumentData, url: string) => {
    setEditedDocs(prev => ({
      ...prev,
      [field]: url,
    }));
  };

  const handleSave = () => {
    updateMutation.mutate(editedDocs);
  };

  const handleCancel = () => {
    setEditedDocs(documents);
    setIsEditing(false);
  };

  const documentFields: { key: keyof DocumentData; label: string }[] = [
    { key: 'aadhaarFrontUrl', label: 'Aadhaar Card (Front)' },
    { key: 'aadhaarBackUrl', label: 'Aadhaar Card (Back)' },
    { key: 'panFrontUrl', label: 'PAN Card (Front)' },
    { key: 'panBackUrl', label: 'PAN Card (Back)' },
  ];

  const hasAnyDocuments = documentFields.some(f => documents[f.key]);

  return (
    <div className="bg-white rounded-xl border shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-indigo-600" />
          <h3 className="font-semibold text-gray-900">Documents</h3>
        </div>

        {canEdit && (
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                  disabled={updateMutation.isPending}
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={updateMutation.isPending}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-100 text-indigo-700 text-sm rounded-lg hover:bg-indigo-200 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                Edit Documents
              </button>
            )}
          </div>
        )}
      </div>

      {/* Documents Grid */}
      <div className="p-6">
        {hasAnyDocuments ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {documentFields.map(({ key, label }) => (
              <DocumentEditor
                key={key}
                label={label}
                currentUrl={isEditing ? editedDocs[key] : documents[key]}
                onUpdate={(url) => handleDocumentUpdate(key, url)}
                disabled={!isEditing}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No documents uploaded yet</p>
            {canEdit && (
              <button
                onClick={() => setIsEditing(true)}
                className="mt-3 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
              >
                Upload documents
              </button>
            )}
          </div>
        )}
      </div>

      {/* Info Note */}
      {isEditing && (
        <div className="px-6 pb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
            <strong>Note:</strong> You can replace existing documents by clicking the "Replace" button.
            Changes will be saved when you click "Save Changes".
          </div>
        </div>
      )}
    </div>
  );
}
