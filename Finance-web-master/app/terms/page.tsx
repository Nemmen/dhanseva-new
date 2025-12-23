import Link from 'next/link';
import { FiArrowLeft, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import type { Metadata } from 'next';
import MainLayout from '@/components/layout/MainLayout';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Dhan Seva India',
  description: 'Terms and conditions for using Dhan Seva India legal services platform. Processing fee, service policies, and user responsibilities.',
};

export default function TermsPage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="container-custom">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-4"
          >
            <FiArrowLeft size={20} />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms & Conditions</h1>
          <p className="text-xl text-blue-100">Effective Date: January 1, 2025</p>
          <p className="text-lg text-blue-100">Platform: धन सेवा इंडिया (Dhan Seva India)</p>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 md:p-12">
          <div className="prose prose-blue max-w-none">
            
            {/* Section 1 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700">
                By accessing or using the Dhan Seva India platform, you agree to be bound by these Terms & Conditions. 
                If you do not agree, please do not use our services.
              </p>
            </section>

            {/* Section 2 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Nature of Services</h2>
              <p className="text-gray-700 mb-4">
                Dhan Seva India provides <strong>online legal and documentation assistance services</strong> through 
                digital consultation, drafting guidance, and compliance support.
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>We are <strong>not a law firm</strong></li>
                <li>We do <strong>not represent clients in courts</strong></li>
                <li>Services are provided on a <strong>best-effort advisory and facilitation basis</strong></li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Service Application & Processing Fee</h2>
              <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-4">
                <div className="flex items-start gap-3">
                  <FiCheckCircle className="text-blue-600 mt-1 shrink-0" size={24} />
                  <div>
                    <p className="font-semibold text-blue-900 mb-2">₹99 Processing Fee</p>
                    <p className="text-gray-700 mb-3">Each service carries a <strong>non-refundable processing fee of ₹99</strong></p>
                    <p className="text-gray-700 font-medium mb-2">The fee covers:</p>
                    <ul className="list-disc pl-5 text-gray-700 space-y-1">
                      <li>Request intake</li>
                      <li>Initial review</li>
                      <li>Allocation of internal resources</li>
                    </ul>
                    <p className="text-gray-700 mt-3">
                      Payment is required <strong>after form submission</strong> and <strong>before service processing begins</strong>
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. No Duplicate Service Requests</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>A user <strong>cannot apply for the same service more than once at the same time</strong></li>
                <li>A new request for the same service is allowed <strong>only after the previous request is marked as completed or cancelled</strong></li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Service Initiation & Non-Refundability</h2>
              <div className="bg-amber-50 border-l-4 border-amber-500 p-6 mb-4">
                <div className="flex items-start gap-3">
                  <FiAlertCircle className="text-amber-600 mt-1 shrink-0" size={24} />
                  <div>
                    <p className="font-semibold text-amber-900 mb-2">Important: Strictly Non-Refundable</p>
                    <p className="text-gray-700 mb-3">Once a service request:</p>
                    <ul className="list-disc pl-5 text-gray-700 space-y-1 mb-3">
                      <li>Is submitted</li>
                      <li>And payment is successfully completed</li>
                      <li>And processing is initiated</li>
                    </ul>
                    <p className="text-gray-900 font-semibold">➡ The processing fee becomes strictly non-refundable</p>
                    <p className="text-gray-700 mt-3">This applies even if:</p>
                    <ul className="list-disc pl-5 text-gray-700 space-y-1">
                      <li>The user changes their mind</li>
                      <li>The user provides incomplete or incorrect information</li>
                      <li>The user does not respond further</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. User Responsibilities</h2>
              <p className="text-gray-700 mb-3">Users agree to:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Provide <strong>accurate and truthful information</strong></li>
                <li>Upload <strong>valid and readable documents</strong></li>
                <li>Ensure documents belong to them or they are authorized to submit them</li>
              </ul>
              <p className="text-gray-700">
                Dhan Seva India is <strong>not liable</strong> for delays or rejections caused by incorrect or false data.
              </p>
            </section>

            {/* Section 7 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Request Tracking</h2>
              <p className="text-gray-700 mb-3">Users can:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>View their submitted requests</li>
                <li>Track request status</li>
                <li>Complete pending payments</li>
                <li>Review submitted information</li>
              </ul>
              <p className="text-gray-600 mt-3 text-sm">via their authenticated account pages.</p>
            </section>

            {/* Section 8 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitation of Liability</h2>
              <p className="text-gray-700 mb-3">Dhan Seva India shall not be liable for:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Any indirect or consequential damages</li>
                <li>Legal outcomes beyond advisory scope</li>
                <li>Government or third-party processing delays</li>
              </ul>
            </section>

            {/* Section 9 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Service Modifications</h2>
              <p className="text-gray-700 mb-3">We reserve the right to:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Modify service pricing</li>
                <li>Add or remove services</li>
                <li>Update these terms at any time</li>
              </ul>
            </section>

            {/* Section 10 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Governing Law</h2>
              <p className="text-gray-700">
                These terms are governed by the laws of <strong>India</strong>. 
                Jurisdiction shall lie with courts of India.
              </p>
            </section>

            {/* Contact Section */}
            <section className="mt-12 pt-8 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions?</h2>
              <p className="text-gray-700">
                For questions about these terms, please contact us at{' '}
                <a href="mailto:support@dhanseva.in" className="text-blue-600 hover:underline font-medium">
                  support@dhanseva.in
                </a>
              </p>
            </section>

            {/* Related Links */}
            <section className="mt-8 pt-8 border-t border-gray-200">
              <div className="grid md:grid-cols-3 gap-4">
                <Link href="/privacy" className="p-4 border rounded-lg hover:border-blue-500 hover:shadow-md transition-all">
                  <h3 className="font-semibold text-gray-900 mb-2">Privacy Policy</h3>
                  <p className="text-sm text-gray-600">How we handle your data</p>
                </Link>
                <Link href="/refund" className="p-4 border rounded-lg hover:border-blue-500 hover:shadow-md transition-all">
                  <h3 className="font-semibold text-gray-900 mb-2">Refund Policy</h3>
                  <p className="text-sm text-gray-600">Cancellation & refunds</p>
                </Link>
                <Link href="/contact" className="p-4 border rounded-lg hover:border-blue-500 hover:shadow-md transition-all">
                  <h3 className="font-semibold text-gray-900 mb-2">Contact Us</h3>
                  <p className="text-sm text-gray-600">Get in touch</p>
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
