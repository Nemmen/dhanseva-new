import Link from 'next/link';
import { FiArrowLeft, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
import type { Metadata } from 'next';
import MainLayout from '@/components/layout/MainLayout';

export const metadata: Metadata = {
  title: 'Customer Consent & Disclaimer | Dhan Seva India',
  description:
    'Customer consent and disclaimer for Dhan Seva India in accordance with IT Act 2000 and RBI Digital Lending Guidelines 2022.',
};

export default function ConsentPage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-700 text-white py-16">
        <div className="container-custom">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-4"
          >
            <FiArrowLeft size={20} />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Customer Consent & Disclaimer
          </h1>
          <p className="text-lg text-blue-100">
            Digital Consent – App / Website Version
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 md:p-12">

          {/* Section 1 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Digital Customer Consent
            </h2>
            <p className="text-gray-700">
              This Digital Customer Consent is obtained electronically in
              accordance with the <strong>Information Technology Act, 2000</strong>{' '}
              and the <strong>RBI Digital Lending Guidelines, 2022</strong>.
            </p>
            <p className="text-gray-700 mt-3">
              By ticking a checkbox, clicking “I Agree”, or completing
              OTP-based authentication, the customer provides
              <strong> free, informed, specific, and explicit consent</strong>.
            </p>
          </section>

          {/* Section 2 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Role of Dhan Seva India
            </h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>
                Dhan Sewaaa India Private Limited is <strong>not a Bank or NBFC</strong>
              </li>
              <li>
                It does <strong>not provide loans or credit</strong>
              </li>
              <li>
                It acts only as a <strong>loan facilitation and technology platform</strong>
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. Lending Decisions
            </h2>
            <p className="text-gray-700">
              All loan-related decisions including sanction, rejection,
              interest rates, tenure, disbursement, and recovery are decided
              solely by <strong>RBI-regulated Banks and NBFCs</strong>.
            </p>
          </section>

          {/* Section 4 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. KYC & Data Processing
            </h2>
            <p className="text-gray-700">
              KYC verification and storage of customer documents shall be
              undertaken only by the regulated lender or its authorised
              Direct Selling Agent (DSA).
            </p>
            <p className="text-gray-700 mt-2">
              Dhan Sewaaa India acts only as a <strong>data processor</strong>{' '}
              and does not store or independently verify KYC documents.
            </p>
          </section>

          {/* Section 5 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. No Guarantee of Loan Approval
            </h2>
            <div className="bg-amber-50 border-l-4 border-amber-500 p-6">
              <div className="flex items-start gap-3">
                <FiAlertTriangle className="text-amber-600 mt-1 shrink-0" size={22} />
                <div>
                  <p className="text-gray-800 font-semibold mb-2">
                    Important Disclaimer
                  </p>
                  <p className="text-gray-700">
                    No guarantee of loan approval is provided. Rejection,
                    delay, or modification of loan terms shall not create
                    any liability on Dhan Sewaaa India.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Limitation of Liability
            </h2>
            <p className="text-gray-700 mb-3">
              Dhan Sewaaa India shall not be liable for:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Lender decisions or internal credit policies</li>
              <li>Delays in processing or disbursement</li>
              <li>Interest rate variations or recovery actions</li>
              <li>Third-party or government system delays</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Validity of Consent
            </h2>
            <div className="bg-green-50 border-l-4 border-green-600 p-6">
              <div className="flex items-start gap-3">
                <FiCheckCircle className="text-green-600 mt-1 shrink-0" size={22} />
                <p className="text-gray-700">
                  This electronic consent shall be valid and enforceable
                  under Indian law.
                </p>
              </div>
            </div>
          </section>

          {/* Links */}
          <section className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-700 mb-4">
              Please also review:
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <Link
                href="/terms"
                className="p-4 border rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
              >
                <h3 className="font-semibold text-gray-900 mb-2">
                  Terms & Conditions
                </h3>
                <p className="text-sm text-gray-600">
                  Platform usage rules
                </p>
              </Link>

              <Link
                href="/privacy"
                className="p-4 border rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
              >
                <h3 className="font-semibold text-gray-900 mb-2">
                  Privacy Policy
                </h3>
                <p className="text-sm text-gray-600">
                  Data handling & protection
                </p>
              </Link>

              <Link
                href="/contact"
                className="p-4 border rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
              >
                <h3 className="font-semibold text-gray-900 mb-2">
                  Contact Us
                </h3>
                <p className="text-sm text-gray-600">
                  Get support
                </p>
              </Link>
            </div>
          </section>

        </div>
      </div>
    </MainLayout>
  );
}
