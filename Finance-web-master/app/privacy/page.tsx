import Link from 'next/link';
import { FiArrowLeft, FiShield, FiLock, FiEye, FiCheck } from 'react-icons/fi';
import type { Metadata } from 'next';
import MainLayout from '@/components/layout/MainLayout';

export const metadata: Metadata = {
  title: 'Privacy Policy | Dhan Seva India',
  description: 'Privacy policy for Dhan Seva India - how we collect, use, and protect your personal data and documents.',
};

export default function PrivacyPage() {
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl text-blue-100">Effective Date: January 1, 2025</p>
          <p className="text-lg text-blue-100">Your data security is our priority</p>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 md:p-12">
          
          {/* Section 1 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Data Collection</h2>
            <p className="text-gray-700 mb-4">We collect user data including:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Personal details (name, email, phone, address)</li>
              <li>Contact information</li>
              <li>Identity documents (Aadhaar, PAN)</li>
              <li>Uploaded files and service-related documents</li>
              <li>Service-related information</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Purpose of Data Usage</h2>
            <p className="text-gray-700 mb-4">
              User data is collected <strong>strictly and exclusively</strong> for:
            </p>
            
            <div className="bg-green-50 border-l-4 border-green-600 p-6 mb-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <FiCheck className="text-green-600 mt-1 shrink-0" size={20} />
                  <p className="text-gray-700">Processing the selected legal service</p>
                </div>
                <div className="flex items-start gap-3">
                  <FiCheck className="text-green-600 mt-1 shrink-0" size={20} />
                  <p className="text-gray-700">Compliance and documentation assistance</p>
                </div>
                <div className="flex items-start gap-3">
                  <FiCheck className="text-green-600 mt-1 shrink-0" size={20} />
                  <p className="text-gray-700">Internal verification and audit</p>
                </div>
                <div className="flex items-start gap-3">
                  <FiCheck className="text-green-600 mt-1 shrink-0" size={20} />
                  <p className="text-gray-700">Communication related to the request</p>
                </div>
              </div>
            </div>

            <div className="bg-red-50 border-l-4 border-red-600 p-6 mb-4">
              <p className="font-semibold text-red-900 mb-2">🚫 Data is NOT used for:</p>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                <li>Marketing without consent</li>
                <li>Selling to third parties</li>
                <li>Unauthorized profiling</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Data Sharing</h2>
            <p className="text-gray-700 mb-4">
              User data may be shared only with:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Authorized internal employees or DSAs (Direct Selling Agents)</li>
              <li>Government portals (if service requires)</li>
              <li>Payment gateways (Razorpay) for transaction processing</li>
            </ul>
            <p className="text-gray-700 mt-4">
              All sharing is <strong>purpose-limited and secure</strong>.
            </p>
          </section>

          {/* Section 4 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security</h2>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <FiLock className="text-blue-600 mb-2" size={24} />
                <h3 className="font-semibold text-gray-900 mb-1">Secure Servers</h3>
                <p className="text-sm text-gray-600">Enterprise-grade hosting</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <FiShield className="text-blue-600 mb-2" size={24} />
                <h3 className="font-semibold text-gray-900 mb-1">Encrypted Storage</h3>
                <p className="text-sm text-gray-600">Data encryption at rest</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <FiEye className="text-blue-600 mb-2" size={24} />
                <h3 className="font-semibold text-gray-900 mb-1">Access Control</h3>
                <p className="text-sm text-gray-600">Role-based permissions</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              Despite best practices, no system is 100% secure; users acknowledge this risk.
            </p>
          </section>

          {/* Section 5 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Retention</h2>
            <p className="text-gray-700 mb-2">
              Data is retained only as long as required for legal, audit, or compliance reasons.
            </p>
            <p className="text-gray-700">
              Users may request data deletion where legally permissible.
            </p>
          </section>

          {/* Section 6 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. User Rights</h2>
            <p className="text-gray-700 mb-3">Users can:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>View their data</li>
              <li>Track service status</li>
              <li>Request corrections</li>
              <li>Request data deletion (subject to legal requirements)</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies & Tracking</h2>
            <p className="text-gray-700">
              We use essential cookies for authentication and session management. 
              No third-party tracking cookies are used without consent.
            </p>
          </section>

          {/* Section 8 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Third-Party Services</h2>
            <p className="text-gray-700 mb-3">
              We use trusted third-party services:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Razorpay</strong> - Payment processing (complies with PCI-DSS)</li>
              <li><strong>Cloud Storage</strong> - Secure document storage</li>
            </ul>
            <p className="text-gray-700 mt-3">
              These services have their own privacy policies and comply with data protection regulations.
            </p>
          </section>

          {/* Section 9 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Policy Updates</h2>
            <p className="text-gray-700">
              We may update this policy from time to time. Users will be notified of significant changes 
              via email or platform notifications.
            </p>
          </section>

          {/* Contact Section */}
          <section className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Privacy Questions?</h2>
            <p className="text-gray-700">
              For privacy-related inquiries, contact us at{' '}
              <a href="mailto:privacy@dhanseva.in" className="text-blue-600 hover:underline font-medium">
                privacy@dhanseva.in
              </a>
            </p>
          </section>

          {/* Related Links */}
          <section className="mt-8 pt-8 border-t border-gray-200">
            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/terms" className="p-4 border rounded-lg hover:border-blue-500 hover:shadow-md transition-all">
                <h3 className="font-semibold text-gray-900 mb-2">Terms & Conditions</h3>
                <p className="text-sm text-gray-600">Usage terms & policies</p>
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
    </MainLayout>
  );
}
