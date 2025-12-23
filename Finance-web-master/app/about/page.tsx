import { Metadata } from 'next';
import MainLayout from '@/components/layout/MainLayout';
import { FiTarget, FiUsers, FiAward, FiHeart } from 'react-icons/fi';

export const metadata: Metadata = {
  title: 'About Us | DhanSeva',
  description: 'Learn about DhanSeva - Your trusted financial services partner',
};

export default function AboutPage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-10 sm:py-16">
        <div className="container-custom px-4">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">About DhanSeva</h1>
          <p className="text-base sm:text-xl text-blue-100 max-w-3xl">
            Your Trusted Partner for All Financial Services - Making Financial Solutions Accessible to Everyone
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-10 sm:py-16 px-4">
        {/* Mission Section */}
        <div className="max-w-4xl mx-auto mb-10 sm:mb-16">
          <div className="bg-white rounded-lg shadow-md p-5 sm:p-8">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <FiTarget className="text-blue-600" size={24} />
              <h2 className="text-xl sm:text-3xl font-bold text-gray-900">Our Mission</h2>
            </div>
            <p className="text-sm sm:text-lg text-gray-700 leading-relaxed mb-3 sm:mb-4">
              At DhanSeva, our mission is to democratize access to financial services across India. 
              We believe that everyone deserves access to quality financial products and services, 
              regardless of their location or background.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              We strive to simplify complex financial processes, provide transparent pricing, 
              and deliver exceptional customer service at every step of your financial journey.
            </p>
          </div>
        </div>

        {/* Vision Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center gap-3 mb-6">
              <FiAward className="text-blue-600" size={32} />
              <h2 className="text-3xl font-bold text-gray-900">Our Vision</h2>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed">
              To become India's most trusted and customer-centric financial services platform, 
              empowering millions of individuals and businesses to achieve their financial goals 
              through innovative, accessible, and affordable solutions.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiHeart className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Customer First</h3>
              <p className="text-gray-600">
                We put our customers at the heart of everything we do, ensuring their satisfaction and success.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiTarget className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Transparency</h3>
              <p className="text-gray-600">
                Clear pricing, honest communication, and no hidden charges. What you see is what you get.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiAward className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Excellence</h3>
              <p className="text-gray-600">
                We strive for excellence in service delivery, ensuring quality at every touchpoint.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiUsers className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Integrity</h3>
              <p className="text-gray-600">
                We conduct our business with the highest standards of ethics and integrity.
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose DhanSeva?</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-blue-600 text-2xl">✓</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Wide Range of Services</h3>
                  <p className="text-gray-700">
                    From loans to insurance, credit cards to bank accounts - all under one roof.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-blue-600 text-2xl">✓</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Quick & Easy Process</h3>
                  <p className="text-gray-700">
                    Simple online application process with minimal documentation and fast approval.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-blue-600 text-2xl">✓</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Competitive Pricing</h3>
                  <p className="text-gray-700">
                    Transparent pricing at just ₹99 per service - no hidden charges.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-blue-600 text-2xl">✓</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Expert Support</h3>
                  <p className="text-gray-700">
                    Dedicated support team to guide you through every step of the process.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-blue-600 text-2xl">✓</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Secure & Reliable</h3>
                  <p className="text-gray-700">
                    Your data is protected with industry-standard security measures.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
