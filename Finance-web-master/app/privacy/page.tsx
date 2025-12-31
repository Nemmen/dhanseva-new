import Link from "next/link";
import { FiArrowLeft, FiShield, FiLock, FiEye, FiCheck } from "react-icons/fi";
import type { Metadata } from "next";
import MainLayout from "@/components/layout/MainLayout";

export const metadata: Metadata = {
  title: "Privacy Policy | Dhan Seva India",
  description:
    "Privacy policy for Dhan Seva India - how we collect, use, and protect your personal data and documents.",
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-blue-100">
            Effective Date: January 1, 2025
          </p>
          <p className="text-lg text-blue-100">
            Your data security is our priority
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 md:p-12">
          {/* Section 1 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Introduction
            </h2>
            <p className="text-gray-700">
              This Privacy Policy governs the collection, use, processing, and
              protection of personal data on the Dhan Sewaaa India platform.
            </p>
            <p className="text-gray-700 mt-2">
              Dhan Sewaaa India acts only as a{" "}
              <strong>loan facilitation platform</strong>
              and does not undertake lending or credit decisions.
            </p>
          </section>

          {/* Section 2 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Data Collected
            </h2>
            <p className="text-gray-700 mb-3">
              Personal data may be collected in connection with loan
              facilitation, including:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Name, mobile number, email address</li>
              <li>Basic demographic and contact details</li>
              <li>Loan-related information submitted by the user</li>
            </ul>
            <p className="text-gray-700 mt-3">
              <strong>
                KYC documents are collected, verified, and stored only by the
                RBI-regulated lender or its authorised DSA.
              </strong>
            </p>
          </section>

          {/* Section 3 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. Purpose of Data Usage
            </h2>
            <p className="text-gray-700 mb-3">
              Personal data is collected solely for:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Loan facilitation and application processing</li>
              <li>Sharing with RBI-regulated Banks / NBFCs</li>
              <li>Customer communication and service updates</li>
              <li>Regulatory and audit compliance</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Data Sharing
            </h2>
            <p className="text-gray-700 mb-3">User data is shared only with:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>RBI-regulated Banks and NBFCs</li>
              <li>Authorised lending partners and DSAs</li>
              <li>Payment gateways for transaction processing</li>
            </ul>
            <p className="text-gray-700 mt-3">
              Data is <strong>never sold, rented, or monetised</strong>.
            </p>
          </section>

          {/* Section 5 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Data Controller & Processor
            </h2>
            <p className="text-gray-700">
              The RBI-regulated lender shall act as the{" "}
              <strong>Data Controller</strong>.
            </p>
            <p className="text-gray-700 mt-2">
              Dhan Sewaaa India acts only as a <strong>Data Processor</strong>
              in accordance with applicable data protection laws.
            </p>
          </section>

          {/* Section 6 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Data Retention
            </h2>
            <p className="text-gray-700">
              Data is retained only for the duration required to fulfil loan
              facilitation, regulatory, or legal obligations.
            </p>
          </section>

          {/* Section 7 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. User Consent
            </h2>
            <p className="text-gray-700">
              User consent is obtained electronically through checkbox
              selection, “I Agree” actions, or OTP-based authentication.
            </p>
            <p className="text-gray-700 mt-2">
              Such consent is valid under the Information Technology Act, 2000
              and RBI Digital Lending Guidelines, 2022.
            </p>
          </section>

          {/* Section 8 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Data Security
            </h2>
            <p className="text-gray-700">
              Reasonable technical and organisational safeguards are implemented
              to protect user data. However, no system can guarantee absolute
              security.
            </p>
          </section>

          {/* Section 9 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. Governing Law
            </h2>
            <p className="text-gray-700">
              This Privacy Policy shall be governed by the laws of India.
            </p>
          </section>

          {/* Contact */}
          <section className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact</h2>
            <p className="text-gray-700">
              For privacy-related concerns, contact us at{" "}
              <a
                href="mailto:privacy@dhanseva.in"
                className="text-blue-600 hover:underline font-medium"
              >
                privacy@dhanseva.in
              </a>
            </p>
          </section>
        </div>
      </div>
    </MainLayout>
  );
}
