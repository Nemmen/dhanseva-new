"use client";

import MainLayout from "@/components/layout/MainLayout";
import Link from "next/link";
import {
  FaArrowRight,
  FaCheckCircle,
  FaHeadset,
  FaShieldAlt,
  FaClock,
  FaUsers,
  FaAward,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { SERVICES, SERVICE_CATEGORIES } from "@/data/services";
import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";

const heroImages = [
  "/images/hero1.jpg",
  "/images/hero2.jpg",
  "/images/hero3.jpg",
];

export default function HomePage() {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? heroImages.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % heroImages.length);
  };

  const features = [
    {
      icon: FaCheckCircle,
      title: "One Stop for all Financial Services",
      description: "Complete legal and financial solutions under one roof",
    },
    {
      icon: FaClock,
      title: "Quick, easy & Hassle free",
      description: "Simple process with minimal documentation",
    },
    {
      icon: FaHeadset,
      title: "24/7 Customer Support",
      description: "Always here to help you with your queries",
    },
    {
      icon: FaShieldAlt,
      title: "100% Secure Platform",
      description: "Your data is safe and encrypted",
    },
  ];

  const stats = [
    { value: "10K+", label: "Happy Clients", icon: FaUsers },
    { value: "500+", label: "Expert Professionals", icon: FaAward },
    { value: "24/7", label: "Customer Support", icon: FaClock },
    { value: "100%", label: "Secure Platform", icon: FaShieldAlt },
  ];

  return (
    <MainLayout>
      {/* ===== HERO SLIDER SECTION ===== */}
      <section
        className="
    relative text-white overflow-hidden
    h-[35vh] sm:h-[45vh] md:h-auto
  "
      >
        {/* ================= BACKGROUND SLIDER ================= */}
        <div className="absolute inset-0">
          {heroImages.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === current ? "opacity-100" : "opacity-0"
              }`}
              style={{
                backgroundImage: `url(${img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/40 to-primary-500/40"></div>
        </div>

        {/* ================= CONTENT ================= */}
        <div className="relative container-custom h-full py-4 sm:py-10 md:py-24">
          <div className="grid md:grid-cols-2 gap-4 md:gap-8 items-center h-full">
            {/* ---------- LEFT CONTENT ---------- */}
            <div className="space-y-2 sm:space-y-5 text-center md:text-left flex flex-col justify-center">
              {/* Badge */}
              <div className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] sm:text-sm mx-auto md:mx-0">
                <span className="flex items-center gap-1.5">
                  <FaCheckCircle className="text-xs sm:text-sm" />
                  Trusted by 10,000+ customers
                </span>
              </div>

              {/* Heading */}
              <h1 className="text-lg sm:text-3xl md:text-5xl lg:text-6xl font-bold leading-snug">
                भरोसे का साथ, तुरंत लोन आपके पास
              </h1>

              {/* Sub heading */}
              <h2 className="text-xs sm:text-xl md:text-3xl font-semibold">
                DhanSeva – Your Trusted Financial Partner
              </h2>

              {/* Description (clamped on mobile) */}
              <p className="text-[11px] sm:text-base md:text-lg text-white/90 max-w-xl mx-auto md:mx-0 line-clamp-2 sm:line-clamp-none">
                Complete Financial & Legal Solutions at your fingertips. All
                services at just ₹99
              </p>

              {/* Buttons – ALWAYS VISIBLE */}
              <div className="flex flex-row gap-2 sm:gap-4 justify-center md:justify-start mt-2 sm:mt-4">
                <Link
                  href="#services"
                  className="
              bg-white text-primary-600 hover:bg-gray-100 font-semibold
              py-2 sm:py-3 px-4 sm:px-8
              rounded-md sm:rounded-lg
              inline-flex items-center justify-center gap-1.5
              text-xs sm:text-base
              whitespace-nowrap
            "
                >
                  Start Your Service{" "}
                  <FaArrowRight className="text-xs sm:text-base" />
                </Link>

                <Link
                  href="/dsa-register"
                  className="
              border-2 border-white hover:bg-white hover:text-primary-600 font-semibold
              py-2 sm:py-3 px-4 sm:px-8
              rounded-md sm:rounded-lg
              text-xs sm:text-base
              whitespace-nowrap
            "
                >
                  Join as DSA
                </Link>
              </div>
            </div>

            {/* ---------- RIGHT CARD (DESKTOP ONLY) ---------- */}
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-2xl rotate-3"></div>
                <div className="relative bg-white rounded-2xl p-6 shadow-2xl">
                  <div className="space-y-4">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <feature.icon className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {feature.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= SLIDER BUTTONS ================= */}
          <button
            onClick={prevSlide}
            className="absolute left-1 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 p-2 rounded-full"
          >
            <FaChevronLeft className="text-sm" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-1 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 p-2 rounded-full"
          >
            <FaChevronRight className="text-sm" />
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-6 sm:py-8 border-b">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-2 sm:mb-3">
                  <stat.icon className="text-primary-600 w-8 h-8 sm:w-12 sm:h-12" />
                </div>
                <div className="text-xl sm:text-3xl md:text-4xl font-bold text-primary-600 mb-1 sm:mb-2">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section id="services" className="py-10 sm:py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="section-title">Our Services</h2>
            <p className="section-subtitle max-w-2xl mx-auto px-4">
              वित्तीय और कानूनी सेवाएं - Complete Financial & Legal Solutions
            </p>
          </div>

          {/* Service Categories */}
          {SERVICE_CATEGORIES.map((category) => {
            const categoryServices = SERVICES.filter(
              (s) => s.category === category.id
            );

            return (
              <div key={category.id} className="mb-10 sm:mb-16">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 px-1">
                  <span className="text-2xl sm:text-4xl">{category.icon}</span>
                  <div>
                    <h3 className="text-lg sm:text-2xl font-bold text-gray-900">
                      {category.name}
                    </h3>
                    <p className="text-xs sm:text-base text-gray-600">
                      {category.description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                  {categoryServices.map((service) => (
                    <Link
                      key={service.id}
                      href={`/apply/${service.id}`}
                      className="bg-white rounded-lg p-3 sm:p-6 hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-primary-500 group"
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="w-10 h-10 sm:w-16 sm:h-16 bg-primary-50 rounded-full flex items-center justify-center mb-2 sm:mb-4 group-hover:bg-primary-100 transition-colors">
                          <span className="text-xl sm:text-3xl">
                            {service.icon}
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-1 sm:mb-2 line-clamp-2 min-h-[2rem] sm:min-h-[3rem] text-xs sm:text-base">
                          {service.name}
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-2 hidden sm:block">
                          {service.description.slice(0, 60)}...
                        </p>
                        <div className="mt-auto">
                          <span className="text-primary-600 font-bold text-sm sm:text-lg">
                            ₹{service.price}/-
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-10 sm:py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">
              Simple 4-step process to get your service
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            {[
              {
                step: "1",
                title: "Choose Service",
                description: "Browse and select the service you need",
              },
              {
                step: "2",
                title: "Fill Details",
                description: "Complete the form with required information",
              },
              {
                step: "3",
                title: "Make Payment",
                description: "Pay just ₹99 processing fee",
              },
              {
                step: "4",
                title: "Get Service",
                description: "Our experts will process your request",
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="w-10 h-10 sm:w-16 sm:h-16 bg-primary-500 text-white rounded-full flex items-center justify-center text-lg sm:text-2xl font-bold mx-auto mb-2 sm:mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-sm sm:text-xl font-semibold mb-1 sm:mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-base text-gray-600">
                    {item.description}
                  </p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-primary-200 -translate-x-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-10 sm:py-16">
        <div className="container-custom text-center px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-base sm:text-xl mb-6 sm:mb-8 text-white/90">
            Join thousands of satisfied customers and get expert legal services
            today
          </p>
          <Link
            href="/#services"
            className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg transition-colors inline-flex items-center gap-2 text-sm sm:text-base"
          >
            Start Your Service Now
            <FaArrowRight />
          </Link>
        </div>
      </section>

      <a
      href="https://wa.me/918510002954"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-50 bg-green-500 hover:bg-green-600 text-white p-2 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp size={38} />
    </a>

    </MainLayout>
  );
}
