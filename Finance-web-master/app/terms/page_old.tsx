import { Metadata } from 'next';
import MainLayout from '@/components/layout/MainLayout';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms & Conditions | DhanSeva',
  description: 'Terms and conditions for using DhanSeva services',
};

export default function TermsPage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms & Conditions</h1>
          <p className="text-xl text-blue-100">
            Last updated: December 22, 2025
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-16">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="prose prose-blue max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-6">
              By accessing and using DhanSeva's services, you accept and agree to be bound by the terms and provision 
              of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Use License</h2>
            <p className="text-gray-700 mb-4">
              Permission is granted to temporarily access the services on DhanSeva's platform for personal, 
              non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and 
              under this license you may not:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or public display</li>
              <li>Attempt to decompile or reverse engineer any software contained on DhanSeva's platform</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Account</h2>
            <p className="text-gray-700 mb-4">
              To access certain features of our service, you must register for an account. You agree to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain and promptly update your account information</li>
              <li>Maintain the security of your password and accept all risks of unauthorized access</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Service Fee</h2>
            <p className="text-gray-700 mb-6">
              All services on DhanSeva are charged at ₹99 per service. The service fee is non-refundable once 
              processing begins. Payment must be completed before we can process your application.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Document Submission</h2>
            <p className="text-gray-700 mb-4">
              You agree to provide accurate and genuine documents as required for service processing. You understand that:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
              <li>Submission of false or fraudulent documents may result in account termination</li>
              <li>We reserve the right to verify all submitted documents</li>
              <li>Applications with incomplete or unclear documents may be rejected</li>
              <li>You are responsible for ensuring all documents are valid and up-to-date</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Service Processing</h2>
            <p className="text-gray-700 mb-6">
              We strive to process all applications within 3-5 business days. However, processing times may vary 
              based on service type, document verification, and external factors beyond our control. We are not 
              liable for delays caused by third-party service providers or government agencies.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Disclaimer</h2>
            <p className="text-gray-700 mb-6">
              The materials on DhanSeva's platform are provided on an 'as is' basis. DhanSeva makes no warranties, 
              expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, 
              implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement 
              of intellectual property or other violation of rights.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitations</h2>
            <p className="text-gray-700 mb-6">
              In no event shall DhanSeva or its suppliers be liable for any damages (including, without limitation, 
              damages for loss of data or profit, or due to business interruption) arising out of the use or inability 
              to use the materials on DhanSeva's platform, even if DhanSeva or a DhanSeva authorized representative has 
              been notified orally or in writing of the possibility of such damage.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Privacy</h2>
            <p className="text-gray-700 mb-4">
              Your use of DhanSeva's services is also governed by our{' '}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-700 font-medium">
                Privacy Policy
              </Link>
              . Please review our Privacy Policy to understand our practices.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Modifications</h2>
            <p className="text-gray-700 mb-6">
              DhanSeva may revise these terms of service at any time without notice. By using this platform you are 
              agreeing to be bound by the then current version of these terms of service.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Governing Law</h2>
            <p className="text-gray-700 mb-6">
              These terms and conditions are governed by and construed in accordance with the laws of India and you 
              irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Us</h2>
            <p className="text-gray-700">
              If you have any questions about these Terms & Conditions, please contact us at{' '}
              <a href="mailto:legal@dhanseva.com" className="text-blue-600 hover:text-blue-700">
                legal@dhanseva.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
