'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { getServiceFormConfig, ServiceFormConfig } from '@/config/serviceForms';
import { ServiceDetail } from '@/data/services';
import BaseFormFields from './BaseFormFields';
import ServiceSpecificFields from './ServiceSpecificFields';
import FileUploadFields from './FileUploadFields';
import api from '@/lib/api';
import { ArrowLeft, ArrowRight, CheckCircle, Loader2, AlertCircle } from 'lucide-react';

interface DynamicServiceFormProps {
  service: ServiceDetail;
}

type FormStep = 'personal' | 'service' | 'documents' | 'review';

export default function DynamicServiceForm({ service }: DynamicServiceFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<FormStep>('personal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const formConfig = getServiceFormConfig(service.id);
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    trigger,
  } = useForm({
    mode: 'onChange',
  });

  const formData = watch();

  const steps: { id: FormStep; label: string }[] = [
    { id: 'personal', label: 'Personal Details' },
    { id: 'service', label: 'Service Details' },
    { id: 'documents', label: 'Documents' },
    { id: 'review', label: 'Review & Submit' },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  const validateCurrentStep = async (): Promise<boolean> => {
    let fieldsToValidate: string[] = [];

    switch (currentStep) {
      case 'personal':
        fieldsToValidate = ['firstName', 'lastName', 'email', 'phone', 'employmentType', 'address', 'state', 'city', 'pincode'];
        break;
      case 'service':
        fieldsToValidate = formConfig?.extraFields
          .filter(f => f.required)
          .map(f => f.name) || [];
        break;
      case 'documents':
        fieldsToValidate = ['aadhaarFront', 'aadhaarBack', 'panFront'];
        break;
    }

    const result = await trigger(fieldsToValidate);
    return result;
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (!isValid) return;

    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id);
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id);
    }
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Prepare form data (excluding file objects for now)
      // In production, you'd upload files separately or use base64
      const applicationData: Record<string, any> = {};
      Object.keys(data).forEach(key => {
        if (!(data[key] instanceof File)) {
          applicationData[key] = data[key];
        }
      });

      // File references (names only for now - implement file upload separately)
      const files: Record<string, string> = {};
      if (data.aadhaarFront instanceof File) {
        files.aadhaarFront = data.aadhaarFront.name;
      }
      if (data.aadhaarBack instanceof File) {
        files.aadhaarBack = data.aadhaarBack.name;
      }
      if (data.panFront instanceof File) {
        files.panFront = data.panFront.name;
      }
      if (data.panBack instanceof File) {
        files.panBack = data.panBack.name;
      }

      // Submit to backend as JSON
      const response: any = await api.post('/requests', {
        serviceId: service.id,
        formData: {
          ...applicationData,
          uploadedFiles: files,
        },
      });

      // Response is already unwrapped by axios interceptor
      // Structure: { success: true, data: { id: '...' }, message: '...' }
      const requestId = response?.data?.id || response?.id;
      
      if (requestId) {
        // Redirect to payment page with the request ID
        router.push(`/payment/${requestId}`);
      } else {
        throw new Error(response?.message || 'Failed to submit application - no request ID returned');
      }
    } catch (err: any) {
      //console.error('Submission error:', err);
      setError(err.message || 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'personal':
        return <BaseFormFields register={register} errors={errors} />;
      
      case 'service':
        return formConfig ? (
          <ServiceSpecificFields 
            config={formConfig} 
            register={register} 
            errors={errors} 
          />
        ) : (
          <div className="text-center py-8 text-gray-500">
            No additional details required for this service.
          </div>
        );
      
      case 'documents':
        return <FileUploadFields register={register} errors={errors} setValue={setValue} />;
      
      case 'review':
        return (
          <ReviewStep 
            formData={formData} 
            service={service} 
            formConfig={formConfig}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-0">
      {/* Progress Steps */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-colors ${
                index < currentStepIndex 
                  ? 'bg-green-500 border-green-500 text-white'
                  : index === currentStepIndex
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-white border-gray-300 text-gray-500'
              }`}>
                {index < currentStepIndex ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-semibold">{index + 1}</span>
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-2 ${
                  index < currentStepIndex ? 'bg-green-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="hidden sm:flex justify-between mt-2">
          {steps.map((step, index) => (
            <span key={step.id} className={`text-xs font-medium ${
              index === currentStepIndex ? 'text-blue-600' : 'text-gray-500'
            }`}>
              {step.label}
            </span>
          ))}
        </div>
      </div>

      {/* Service Summary Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 border border-blue-100">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="text-2xl sm:text-3xl">{service.icon}</div>
          <div>
            <h2 className="font-semibold text-gray-800 text-sm sm:text-base">{service.name}</h2>
            <p className="text-xs sm:text-sm text-gray-600">Processing Fee: ₹{service.price}</p>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-800 font-medium">Error</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Form Content */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border p-4 sm:p-6 md:p-8 mb-4 sm:mb-6">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-3">
          {currentStepIndex > 0 ? (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep === 'review' ? (
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-8 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="hidden sm:inline">Submitting...</span>
                  <span className="sm:hidden">Wait...</span>
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">Submit & Pay ₹{service.price}</span>
                  <span className="sm:hidden">Pay ₹{service.price}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-8 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              <span className="hidden sm:inline">Continue</span>
              <span className="sm:hidden">Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

// Review Step Component
function ReviewStep({ 
  formData, 
  service, 
  formConfig 
}: { 
  formData: any; 
  service: ServiceDetail;
  formConfig: ServiceFormConfig | null;
}) {
  const excludeFields = ['aadhaarFront', 'aadhaarBack', 'panFront', 'panBack'];
  
  const formatFieldName = (name: string): string => {
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  const formatFieldValue = (value: any): string => {
    if (value === null || value === undefined || value === '') return '-';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (value instanceof File) return value.name;
    return String(value);
  };

  const filledFields = Object.entries(formData).filter(
    ([key, value]) => !excludeFields.includes(key) && value !== '' && value !== undefined
  );

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
        Review Your Application
      </h3>

      {/* Service Info */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">Service Details</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <span className="text-gray-600">Service:</span>
          <span className="font-medium">{service.name}</span>
          <span className="text-gray-600">Processing Fee:</span>
          <span className="font-medium text-green-600">₹{service.price}</span>
          <span className="text-gray-600">Delivery Time:</span>
          <span className="font-medium">{service.deliveryTime}</span>
        </div>
      </div>

      {/* Form Data */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-800">Application Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filledFields.map(([key, value]) => (
            <div key={key} className="bg-gray-50 rounded-lg p-3">
              <span className="text-xs text-gray-500 block">{formatFieldName(key)}</span>
              <span className="text-sm font-medium text-gray-800">{formatFieldValue(value)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Documents Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-800 mb-2">Uploaded Documents</h4>
        <ul className="text-sm space-y-1">
          {formData.aadhaarFront && (
            <li className="text-green-600">✓ Aadhaar Front uploaded</li>
          )}
          {formData.aadhaarBack && (
            <li className="text-green-600">✓ Aadhaar Back uploaded</li>
          )}
          {formData.panFront && (
            <li className="text-green-600">✓ PAN Card uploaded</li>
          )}
          {formData.panBack && (
            <li className="text-green-600">✓ PAN Back uploaded</li>
          )}
        </ul>
      </div>

      {/* Terms */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> By clicking "Submit & Pay", you agree to our Terms of Service and 
          Privacy Policy. The processing fee of ₹{service.price} is non-refundable once the 
          application review has begun.
        </p>
      </div>
    </div>
  );
}
