'use client';

import Link from 'next/link';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Services', href: '/services' },
      { name: 'Contact Us', href: '/contact' },
    ],
    legal: [
      { name: 'Terms & Conditions', href: '/terms' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Refund Policy', href: '/refund' },
    ],
    services: [
      { name: 'Loan Services', href: '/services?category=FINANCIAL_LEGAL' },
      { name: 'Legal Services', href: '/services?category=PERSONAL_LEGAL' },
      { name: 'CA Services', href: '/services?category=GOVT_COMPLIANCE' },
    ],
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom py-8 sm:py-12 px-4">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Company Info */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm sm:text-lg">DS</span>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold">DhanSeva</h3>
                <p className="text-xs sm:text-sm text-gray-400 hidden sm:block">भरोसे का साथ, तुरंत लोन आपके पास</p>
              </div>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 hidden sm:block">
              Your trusted financial partner providing comprehensive legal and financial solutions.
            </p>
            <div className="flex space-x-2 sm:space-x-3">
              <a href="#" title="Facebook" aria-label="Visit our Facebook page" className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-800 hover:bg-primary-500 rounded-full flex items-center justify-center transition-colors">
                <FaFacebook className="w-3 h-3 sm:w-4 sm:h-4" />
              </a>
              <a href="#" title="Twitter" aria-label="Visit our Twitter page" className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-800 hover:bg-primary-500 rounded-full flex items-center justify-center transition-colors">
                <FaTwitter className="w-3 h-3 sm:w-4 sm:h-4" />
              </a>
              <a href="#" title="LinkedIn" aria-label="Visit our LinkedIn page" className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-800 hover:bg-primary-500 rounded-full flex items-center justify-center transition-colors">
                <FaLinkedin className="w-3 h-3 sm:w-4 sm:h-4" />
              </a>
              <a href="#" title="Instagram" aria-label="Visit our Instagram page" className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-800 hover:bg-primary-500 rounded-full flex items-center justify-center transition-colors">
                <FaInstagram className="w-3 h-3 sm:w-4 sm:h-4" />
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-sm sm:text-lg font-semibold mb-3 sm:mb-4">Company</h4>
            <ul className="space-y-1.5 sm:space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-sm sm:text-lg font-semibold mb-3 sm:mb-4">Legal</h4>
            <ul className="space-y-1.5 sm:space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-sm sm:text-lg font-semibold mb-3 sm:mb-4">Contact Us</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li className="flex items-start space-x-2 sm:space-x-3 text-xs sm:text-sm text-gray-400">
                <FaMapMarkerAlt className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0" />
                <span>Mumbai, Maharashtra, India</span>
              </li>
              <li className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm text-gray-400">
                <FaPhone className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span>+91 XXXXX XXXXX</span>
              </li>
              <li className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm text-gray-400">
                <FaEnvelope className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span>support@dhanseva.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
          <p className="text-gray-400 text-xs sm:text-sm">
            © {currentYear} DhanSeva. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Made with ❤️ in India
          </p>
        </div>
      </div>
    </footer>
  );
}
