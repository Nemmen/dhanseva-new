import Link from "next/link";
import { FiArrowLeft, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import type { Metadata } from "next";
import MainLayout from "@/components/layout/MainLayout";

export const metadata: Metadata = {
  title: "Terms & Conditions | Dhan Seva India",
  description:
    "Terms and conditions for using Dhan Seva India legal services platform. Processing fee, service policies, and user responsibilities.",
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Terms & Conditions
          </h1>
          <p className="text-xl text-blue-100">
            Effective Date: January 1, 2025
          </p>
          <p className="text-lg text-blue-100">
            Platform: धन सेवा इंडिया (Dhan Seva India)
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 md:p-12">
          <div className="prose prose-blue max-w-none">
            {/* Section 1 */}
            <section className="mb-8">
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing or using the Dhan Seva India platform, website, or
                mobile application, the user agrees to be bound by these Terms &
                Conditions, Privacy Policy, and the applicable Customer Consent
                & Disclaimer.
              </p>
              <p>
                If the user does not agree, they must discontinue use of the
                platform immediately.
              </p>
            </section>

            {/* Section 2 */}
            <section className="mb-8">
              <h2>2. Nature of Platform</h2>
              <p>
                Dhan Sewaaa India Private Limited (“Dhan Seva India”) is a
                <strong> loan facilitation and technology platform</strong>.
              </p>
              <ul>
                <li>
                  Dhan Seva India is <strong>not a Bank or NBFC</strong>
                </li>
                <li>
                  It does <strong>not provide loans or credit</strong>
                </li>
                <li>
                  It does{" "}
                  <strong>
                    not decide loan sanction, interest rate, tenure, or recovery
                  </strong>
                </li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="mb-8">
              <h2>3. Role of Lenders</h2>
              <p>
                All loan-related decisions including sanction, rejection,
                interest rate, tenure, disbursement, and recovery are taken
                solely by
                <strong> RBI-regulated Banks and NBFCs</strong>.
              </p>
              <p>
                Dhan Seva India has no control over lender decisions and
                outcomes.
              </p>
            </section>

            {/* Section 4 */}
            <section className="mb-8">
              <h2>4. KYC & Data Handling</h2>
              <p>
                KYC verification and storage of customer documents shall be
                undertaken only by the regulated lender or its authorised Direct
                Selling Agent (DSA).
              </p>
              <p>
                Dhan Seva India acts only as a <strong>data processor</strong>{" "}
                and does not store or verify KYC documents.
              </p>
            </section>

            {/* Section 5 */}
            <section className="mb-8">
              <h2>5. User Responsibilities</h2>
              <ul>
                <li>Provide accurate and complete information</li>
                <li>Submit valid documents belonging to the user</li>
                <li>Maintain confidentiality of login credentials and OTPs</li>
              </ul>
              <p>
                Any incorrect, misleading, or false information may result in
                rejection of the loan application.
              </p>
            </section>

            {/* Section 6 */}
            <section className="mb-8">
              <h2>6. No Guarantee of Loan Approval</h2>
              <p>
                Dhan Seva India does{" "}
                <strong>not guarantee loan approval</strong>.
              </p>
              <p>
                Rejection, delay, or modification of loan terms shall not create
                any liability on Dhan Seva India.
              </p>
            </section>

            {/* Section 7 */}
            <section className="mb-8">
              <h2>7. Limitation of Liability</h2>
              <p>Dhan Seva India shall not be liable for:</p>
              <ul>
                <li>Lender decisions or internal policies</li>
                <li>Processing delays by banks or NBFCs</li>
                <li>Interest rate changes or recovery actions</li>
                <li>Technical or third-party system failures</li>
              </ul>
            </section>

            {/* Section 8 */}
            <section className="mb-8">
              <h2>8. Privacy & Consent</h2>
              <p>
                Collection and use of personal data is governed by the
                <Link href="/privacy" className="text-blue-600">
                  {" "}
                  Privacy Policy
                </Link>
                .
              </p>
              <p>
                User consent is obtained electronically in accordance with the
                Information Technology Act, 2000 and RBI Digital Lending
                Guidelines, 2022.
              </p>
            </section>

            {/* Section 9 */}
            <section className="mb-8">
              <h2>9. Modification of Terms</h2>
              <p>
                Dhan Seva India reserves the right to update or modify these
                Terms & Conditions at any time. Continued use of the platform
                constitutes acceptance of the updated terms.
              </p>
            </section>

            {/* Section 10 */}
            <section className="mb-8">
              <h2>10. Governing Law & Jurisdiction</h2>
              <p>
                These Terms shall be governed by the laws of India. Jurisdiction
                shall lie exclusively with courts at
                <strong> Bhopal, Madhya Pradesh</strong>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
