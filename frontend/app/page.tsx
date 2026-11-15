'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import CareSureLogo from '@/components/CareSureLogo';
import IntroPreloader from '@/components/IntroPreloader';

const cinematicSlides = [
  {
    src: '/cinematic-hands.jpg',
    alt: 'Caregiver lovingly holding an elderly patient hand with reassurance and warmth',
  },
  {
    src: '/cinematic-1.jpg',
    alt: 'Elderly patient carefully reviewing daily prescription medication',
  },
  {
    src: '/cinematic-2.jpg',
    alt: 'Organized smart pill dispenser compartments with medical supplies',
  },
  {
    src: '/cinematic-3.jpg',
    alt: 'Elderly couple consulting with their trusted geriatric doctor',
  },
  {
    src: '/cinematic-4.jpg',
    alt: 'Caregiver lovingly providing water and timely medication to senior father',
  },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showIntro, setShowIntro] = useState(true);

  // Cinematic video sequence: automatically transition every 3.5 seconds (3-4 sec per image)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % cinematicSlides.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-black text-white select-none">
      {/* Intro Preloader Screen: Exact smooth logo drawing animation & transition */}
      {showIntro && <IntroPreloader onComplete={() => setShowIntro(false)} />}
      
      {/* ========================================================================= */}
      {/* CINEMATIC VIDEO-LIKE PHOTO SEQUENCE BACKGROUND                            */}
      {/* ========================================================================= */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {cinematicSlides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.src}
              className={`absolute inset-0 transition-opacity ease-in-out ${
                isActive ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                transitionDuration: '1000ms',
              }}
            >
              <img
                src={slide.src}
                alt={slide.alt}
                className={`w-full h-full object-cover object-center transition-transform duration-[4500ms] ease-out ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
              />
            </div>
          );
        })}

        {/* ======================================================================= */}
        {/* CRISP CINEMATIC OVERLAY (Clear background photos, zero blurry haze)    */}
        {/* ======================================================================= */}
        {/* 1. Transparent gradient: subtle dark tint for high legibility without haze */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/85 pointer-events-none" />

        {/* 2. Soft perimeter vignette for cinematic focus */}
        <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.65)] pointer-events-none" />
      </div>

      {/* ========================================================================= */}
      {/* TOP HEADER: Absolute Top-Left Corner (No Center Pull)                     */}
      {/* ========================================================================= */}
      <div className="absolute top-5 left-5 sm:top-7 sm:left-8 lg:left-12 z-30">
        <CareSureLogo variant="light" size="md" href="/" />
      </div>

      {/* ========================================================================= */}
      {/* FOREGROUND CONTENT (Hero, Navigation, Actions, and Feature Cards)         */}
      {/* ========================================================================= */}
      <div className="relative z-10 min-h-screen flex flex-col justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        
        {/* Top spacer for header clearance */}
        <div className="h-10 sm:h-12" />

        {/* Hero Content Section */}
        <div className="text-center my-auto py-10 sm:py-16 max-w-3xl mx-auto flex flex-col items-center">
          {/* Editorial Headline: Exact Typography Match */}
          <h1 className="font-editorial text-4xl sm:text-6xl md:text-[68px] font-normal text-white mb-8 sm:mb-10 tracking-[-0.025em] leading-[1.12] drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)] px-4">
            Because care<br />
            should always feel<br />
            <span className="italic font-normal">personal</span>
          </h1>

          {/* User's Exact 3 Buttons: Beige, White, and Brown Palette */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4 w-full max-w-md sm:max-w-none mx-auto">
            {/* Bar 1: Brown */}
            <Link
              href="/login"
              className="w-full sm:w-auto bg-[#8c4a35] hover:bg-[#783e2c] text-white px-7 sm:px-9 py-3.5 rounded-xl font-bold transition-all shadow-[0_4px_20px_rgba(140,74,53,0.35)] hover:shadow-[0_6px_25px_rgba(140,74,53,0.5)] min-h-[48px] flex items-center justify-center touch-manipulation active:scale-95"
            >
              Caregiver Login
            </Link>
            {/* Bar 2: White */}
            <Link
              href="/signup"
              className="w-full sm:w-auto bg-white/95 hover:bg-white text-[#5a3825] px-7 sm:px-9 py-3.5 rounded-xl font-bold border-2 border-[#8c4a35] transition-all shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:shadow-[0_6px_25px_rgba(0,0,0,0.35)] min-h-[48px] flex items-center justify-center touch-manipulation active:scale-95"
            >
              Sign Up
            </Link>
            {/* Bar 3: Beige */}
            <Link
              href="/patient/login"
              className="w-full sm:w-auto bg-[#ede0d0] hover:bg-[#dfd0be] text-[#4a2e1e] px-7 sm:px-9 py-3.5 rounded-xl font-bold transition-all shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:shadow-[0_6px_25px_rgba(237,224,208,0.4)] min-h-[48px] flex items-center justify-center touch-manipulation active:scale-95"
            >
              Patient Login
            </Link>
          </div>
        </div>

        {/* Features Glassmorphism Cards Section (Beige, White, and Brown Accents) */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Feature 1 */}
          <div 
            className="group p-6 sm:p-8 rounded-2xl transition-all duration-500 hover:scale-105 bg-white/10 hover:bg-white/15 backdrop-blur-md cursor-pointer border border-white/20 hover:border-[#ede0d0]/60 shadow-xl touch-manipulation active:scale-95"
            style={{ 
              transformStyle: 'preserve-3d',
              transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <div className="mb-4 sm:mb-6 transform transition-transform duration-500 group-hover:scale-125 group-hover:rotate-6 w-12 h-12 sm:w-16 sm:h-16 mx-auto">
              <svg className="w-full h-full text-white group-hover:text-[#ede0d0] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-white group-hover:text-[#ede0d0] transition-colors duration-300 text-center">
              Smart Reminders
            </h3>
            <p className="text-sm sm:text-base text-white/90 leading-relaxed text-center group-hover:text-white transition-colors duration-300 font-medium">
              Automated medication reminders with device integration and real-time mobile notifications.
            </p>
            <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center">
              <div className="w-12 h-1 bg-[#ede0d0] rounded-full"></div>
            </div>
          </div>
          
          {/* Feature 2 */}
          <div 
            className="group p-6 sm:p-8 rounded-2xl transition-all duration-500 hover:scale-105 bg-white/10 hover:bg-white/15 backdrop-blur-md cursor-pointer border border-white/20 hover:border-[#ede0d0]/60 shadow-xl touch-manipulation active:scale-95"
            style={{ 
              transformStyle: 'preserve-3d',
              transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <div className="mb-4 sm:mb-6 transform transition-transform duration-500 group-hover:scale-125 group-hover:rotate-6 w-12 h-12 sm:w-16 sm:h-16 mx-auto">
              <svg className="w-full h-full text-white group-hover:text-[#ede0d0] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-white group-hover:text-[#ede0d0] transition-colors duration-300 text-center">
              Real-Time Monitoring
            </h3>
            <p className="text-sm sm:text-base text-white/90 leading-relaxed text-center group-hover:text-white transition-colors duration-300 font-medium">
              Track medication adherence in real-time with comprehensive reports and doctor analytics.
            </p>
            <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center">
              <div className="w-12 h-1 bg-[#ede0d0] rounded-full"></div>
            </div>
          </div>
          
          {/* Feature 3 */}
          <div 
            className="group p-6 sm:p-8 rounded-2xl transition-all duration-500 hover:scale-105 bg-white/10 hover:bg-white/15 backdrop-blur-md cursor-pointer border border-white/20 hover:border-[#ede0d0]/60 shadow-xl touch-manipulation active:scale-95"
            style={{ 
              transformStyle: 'preserve-3d',
              transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <div className="mb-4 sm:mb-6 transform transition-transform duration-500 group-hover:scale-125 group-hover:rotate-6 w-12 h-12 sm:w-16 sm:h-16 mx-auto">
              <svg className="w-full h-full text-white group-hover:text-[#ede0d0] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-white group-hover:text-[#ede0d0] transition-colors duration-300 text-center">
              Adherence Tracking
            </h3>
            <p className="text-sm sm:text-base text-white/90 leading-relaxed text-center group-hover:text-white transition-colors duration-300 font-medium">
              Monitor compliance streaks, missed doses, and generate emergency QR passes instantly.
            </p>
            <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center">
              <div className="w-12 h-1 bg-[#ede0d0] rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="py-6 mt-12 text-center text-white/70 text-sm border-t border-white/15">
          <p className="font-semibold">&copy; 2026 CareSure. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link href="/about" className="hover:text-[#ede0d0] transition-colors font-medium">About</Link>
            <Link href="/hardware" className="hover:text-[#ede0d0] transition-colors font-medium">3D Hardware</Link>
            <Link href="/login" className="hover:text-[#ede0d0] transition-colors font-medium">Caregiver Portal</Link>
          </div>
        </footer>

      </div>
    </div>
  );
}
