import { Metadata } from 'next';
import MainLayout from '@/components/layout/MainLayout';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Refund Policy | DhanSeva',
  description: 'Refund and cancellation policy for DhanSeva services',
};

export default function RefundPage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Refund Policy</h1>
          <p className="text-xl text-blue-100">
            Last updated: December 22, 2025
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-16">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="prose prose-blue max-w-none">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
              <p className="text-yellow-800">
                <strong>Important:</strong> Please read this policy carefully before making a payment for any service.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. General Policy</h2>
            <p className="text-gray-700 mb-6">
              At DhanSeva, we strive to provide excellent service to all our customers. However, due to the nature 
              of our services and the processing involved, our refund policy has specific conditions that must be 
              understood before making a payment.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Service Fee</h2>
            <p className="text-gray-700 mb-4">
              All services on DhanSeva are charged at a flat rate of ₹99 per service. This fee covers:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
              <li>Document verification and processing</li>
              <li>Application submission to relevant institutions</li>
              <li>Follow-up and status tracking</li>
              <li>Customer support throughout the process</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Non-Refundable Situations</h2>
            <p className="text-gray-700 mb-4">
              The service fee is <strong>non-refundable</strong> in the following situations:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
              <li>After the application has been submitted for processing</li>
              <li>If your application is rejected by the financial institution or service provider</li>
              <li>If you provided incorrect or incomplete information</li>
              <li>If you submitted false or fraudulent documents</li>
              <li>If you choose to cancel after processing has begun</li>
              <li>If the third-party service provider rejects your application for any reason</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Refundable Situations</h2>
            <p className="text-gray-700 mb-4">
              You may be eligible for a refund in the following cases:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
              <li>
                <strong>Before Processing:</strong> If you request cancellation within 24 hours of payment and 
                before we have started processing your application
              </li>
              <li>
                <strong>Technical Errors:</strong> If you were charged multiple times for the same service due 
                to a technical error
              </li>
              <li>
                <strong>Service Not Delivered:</strong> If we are unable to deliver the service due to reasons 
                within our control
              </li>
              <li>
                <strong>Duplicate Payment:</strong> If duplicate payment was made for the same service
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Refund Request Process</h2>
            <p className="text-gray-700 mb-4">
              To request a refund, you must:
            </p>
            <ol className="list-decimal pl-6 text-gray-700 mb-6 space-y-2">
              <li>
                Send an email to{' '}
                <a href="mailto:refunds@dhanseva.com" className="text-blue-600 hover:text-blue-700">
                  refunds@dhanseva.com
                </a>
              </li>
              <li>Include your Request ID and payment transaction ID</li>
              <li>Provide a detailed reason for the refund request</li>
              <li>Include any supporting documentation if applicable</li>
            </ol>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Refund Processing Timeline</h2>
            <p className="text-gray-700 mb-4">
              If your refund request is approved:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
              <li>We will review your request within 3-5 business days</li>
              <li>Upon approval, the refund will be initiated within 7-10 business days</li>
              <li>The refund will be credited to your original payment method</li>
              <li>Bank processing time may add an additional 5-7 business days</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Partial Refunds</h2>
            <p className="text-gray-700 mb-6">
              In some cases, we may offer a partial refund at our discretion. This will be evaluated on a 
              case-by-case basis depending on the stage of processing and resources already utilized.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Payment Gateway Charges</h2>
            <p className="text-gray-700 mb-6">
              Please note that payment gateway charges (if any) are non-refundable and will be deducted from 
              the refund amount if applicable.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Chargebacks</h2>
            <p className="text-gray-700 mb-6">
              If you initiate a chargeback or payment dispute without first contacting us, we reserve the right 
              to suspend your account and deny future service requests. Please contact us directly to resolve 
              any payment concerns.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Service Outcome</h2>
            <p className="text-gray-700 mb-6">
              <strong>Important:</strong> DhanSeva acts as a facilitator and service provider. We cannot 
              guarantee approval of your application by third-party financial institutions or service providers. 
              The service fee is charged for our processing services, not for the guarantee of approval.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Modifications to Refund Policy</h2>
            <p className="text-gray-700 mb-6">
              We reserve the right to modify this refund policy at any time. Changes will be effective immediately 
              upon posting on our website. Your continued use of our services after changes constitutes acceptance 
              of the modified policy.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Us</h2>
            <p className="text-gray-700">
              For refund-related queries or to request a refund, please contact:
            </p>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-gray-700">
                <strong>Email:</strong>{' '}
                <a href="mailto:refunds@dhanseva.com" className="text-blue-600 hover:text-blue-700">
                  refunds@dhanseva.com
                </a>
              </p>
              <p className="text-gray-700 mt-2">
                <strong>Phone:</strong> +91 123-456-7890 (Mon-Sat: 9 AM - 6 PM IST)
              </p>
              <p className="text-gray-700 mt-2">
                <strong>Response Time:</strong> Within 24-48 hours
              </p>
            </div>

            <div className="mt-8 p-4 bg-green-50 border-l-4 border-green-400">
              <p className="text-green-800">
                <strong>Tip:</strong> To avoid refund situations, please ensure all information and documents 
                provided are accurate and complete before making payment. If you have any questions about the 
                service, feel free to{' '}
                <Link href="/contact" className="text-green-700 font-medium underline">
                  contact us
                </Link>
                {' '}before proceeding with payment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
