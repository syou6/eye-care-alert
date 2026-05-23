'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Script from 'next/script';

export default function EyeCareFree() {
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 本番: 20分
  const [isActive, setIsActive] = useState(false);
  const [showBreak, setShowBreak] = useState(false);
  const [breakTimeLeft, setBreakTimeLeft] = useState(20);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showDonation, setShowDonation] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load saved preferences
  useEffect(() => {
    const saved = localStorage.getItem('eyeCarePreferences');
    if (saved) {
      const prefs = JSON.parse(saved);
      setTheme(prefs.theme || 'light');
      setSessionsCompleted(prefs.sessionsCompleted || 0);
    }
  }, []);

  // Save preferences
  useEffect(() => {
    localStorage.setItem('eyeCarePreferences', JSON.stringify({
      theme,
      sessionsCompleted,
    }));
  }, [theme, sessionsCompleted]);

  // Timer countdown
  useEffect(() => {
    if (isActive && timeLeft > 0 && !showBreak) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !showBreak) {
      setShowBreak(true);
      setIsActive(false);
      setSessionsCompleted(prev => prev + 1);
      
      // Show donation prompt every 10 sessions
      if ((sessionsCompleted + 1) % 10 === 0) {
        setShowDonation(true);
      }
      
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Time for a break! 👁️', {
          body: 'Look away from your screen for 20 seconds.',
        });
      }
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft, showBreak, sessionsCompleted]);

  // Break countdown
  useEffect(() => {
    if (showBreak && breakTimeLeft > 0) {
      const breakInterval = setInterval(() => {
        setBreakTimeLeft(prev => prev - 1);
      }, 1000);

      return () => clearInterval(breakInterval);
    } else if (breakTimeLeft === 0 && showBreak) {
      setShowBreak(false);
      setTimeLeft(20 * 60);
      setBreakTimeLeft(20);
      setIsActive(true);
    }
  }, [showBreak, breakTimeLeft]);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const toggleTimer = useCallback(() => {
    setIsActive(prev => !prev);
  }, []);

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setTimeLeft(20 * 60);
    setBreakTimeLeft(20);
    setShowBreak(false);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((20 * 60 - timeLeft) / (20 * 60)) * 100;

  const isDark = theme === 'dark';

  return (
    <>
      {/* Google AdSense */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6158728857323077"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />

      {/* Google Analytics */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-5EEDHCB7VD"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-5EEDHCB7VD');
        `}
      </Script>

      <div className={`min-h-screen ${
        isDark 
          ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
          : 'bg-gradient-to-br from-gray-50 to-gray-100'
      } flex items-center justify-center p-8 transition-colors duration-500`}>
        
        {/* Top Ad Banner - Smaller and more subtle */}
        <div className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-gray-50/80 to-gray-100/80 backdrop-blur-sm flex items-center justify-center border-b border-gray-200/30">
          <div className="flex items-center gap-2 text-gray-500 text-xs">
            <span className="opacity-60">📢</span>
            <span className="font-medium">スポンサー募集中</span>
            <span className="opacity-60">•</span>
            <a href="mailto:shokawamoto@gmail.com" className="text-blue-500 hover:underline">
              お問い合わせ
            </a>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md mt-20"
        >
          {/* Logo */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className={`text-3xl font-light tracking-widest ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}>
              EYE CARE
            </h1>
            <p className={`text-xs mt-2 tracking-wide ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              20-20-20 RULE • PROTECT YOUR VISION
            </p>
          </motion.div>

          {/* Main Card */}
          <motion.div 
            className={`${
              isDark ? 'bg-gray-800/50' : 'bg-white'
            } backdrop-blur-lg rounded-3xl shadow-2xl p-12`}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <AnimatePresence mode="wait">
              {!showBreak ? (
                <motion.div
                  key="timer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Timer Display */}
                  <div className="relative mb-12">
                    <svg className="w-48 h-48 mx-auto transform -rotate-90">
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke={isDark ? '#374151' : '#e5e7eb'}
                        strokeWidth="8"
                        fill="none"
                      />
                      <motion.circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke={isDark ? '#60a5fa' : '#3b82f6'}
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={553}
                        initial={{ strokeDashoffset: 553 }}
                        animate={{ strokeDashoffset: 553 - (553 * progress) / 100 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                    </svg>
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div 
                        className={`text-5xl font-light tabular-nums ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}
                        animate={timeLeft <= 60 ? { 
                          scale: [1, 1.05, 1],
                          color: isDark 
                            ? ['#ffffff', '#fca5a5', '#ffffff']
                            : ['#111827', '#ef4444', '#111827']
                        } : {}}
                        transition={{ duration: 1, repeat: timeLeft <= 60 ? Infinity : 0 }}
                      >
                        {formatTime(timeLeft)}
                      </motion.div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="text-center mb-8">
                    <motion.div 
                      className={`text-sm tracking-wider ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}
                      animate={{ opacity: isActive ? [0.5, 1, 0.5] : 1 }}
                      transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
                    >
                      {isActive ? '● TRACKING YOUR SCREEN TIME' : '⏸ PAUSED'}
                    </motion.div>
                    <div className={`text-xs mt-2 ${
                      isDark ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      Total sessions: {sessionsCompleted}
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={toggleTimer}
                      className={`flex-1 py-4 rounded-2xl font-medium transition-all duration-300 ${
                        isDark
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      {isActive ? 'Pause' : 'Start'}
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={resetTimer}
                      className={`px-6 py-4 rounded-2xl font-medium transition-all duration-300 ${
                        isDark
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      Reset
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="break"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  <motion.div 
                    className="mb-8 text-6xl"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    👁️
                  </motion.div>

                  <h2 className={`text-2xl font-light mb-4 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    Rest your eyes
                  </h2>
                  
                  <p className={`mb-8 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Look at something 20 feet away
                  </p>
                  
                  <motion.div 
                    className={`text-6xl font-light mb-8 tabular-nums ${
                      isDark ? 'text-blue-400' : 'text-blue-600'
                    }`}
                    animate={{ 
                      opacity: [1, 0.5, 1],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    {breakTimeLeft}
                  </motion.div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowBreak(false);
                      setTimeLeft(20 * 60);
                      setBreakTimeLeft(20);
                      setIsActive(true);
                    }}
                    className={`px-8 py-3 rounded-2xl font-medium transition-all duration-300 ${
                      isDark
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                    }`}
                  >
                    Skip Break
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Theme Toggle */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className={`p-3 rounded-full transition-all ${
                isDark 
                  ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
                  : 'bg-white hover:bg-gray-100 text-gray-700 shadow-lg'
              }`}
            >
              {isDark ? '☀️' : '🌙'}
            </button>
          </div>

          {/* Support Section */}
          <div className="mt-8 text-center">
            <p className={`text-xs mb-3 ${
              isDark ? 'text-gray-500' : 'text-gray-400'
            }`}>
              This app is free forever. If it helps you, consider:
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="https://buymeacoffee.com/shokawamoto"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg font-medium hover:bg-yellow-500 transition-all"
              >
                ☕ Buy Coffee
              </a>
              <button
                onClick={async () => {
                  if (navigator.share) {
                    try {
                      await navigator.share({
                        title: 'Eye Care Timer',
                        text: 'Protect your eyes with the 20-20-20 rule!',
                        url: window.location.href,
                      });
                    } catch (err) {
                      // User cancelled or error occurred - ignore
                      console.log('Share cancelled or failed');
                    }
                  } else {
                    // Fallback: copy to clipboard
                    navigator.clipboard.writeText(window.location.href);
                  }
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  isDark
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                📤 Share
              </button>
            </div>
          </div>

          {/* Helpful Links */}
          <div className={`mt-8 p-4 rounded-lg text-center ${
            isDark ? 'bg-gray-800/50' : 'bg-gray-50'
          }`}>
            <p className={`text-xs mb-2 ${
              isDark ? 'text-gray-500' : 'text-gray-400'
            }`}>
              Recommended for your eyes:
            </p>
            <div className="flex justify-center gap-3 text-xs">
              <a 
                href="https://amzn.to/blulight-glasses" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Blue Light Glasses
              </a>
              <span className={isDark ? 'text-gray-600' : 'text-gray-400'}>•</span>
              <a 
                href="https://amzn.to/eye-drops" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Eye Drops
              </a>
              <span className={isDark ? 'text-gray-600' : 'text-gray-400'}>•</span>
              <a 
                href="https://amzn.to/monitor-light" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Monitor Light
              </a>
            </div>
            <p className={`text-xs mt-2 italic ${
              isDark ? 'text-gray-600' : 'text-gray-400'
            }`}>
              * Affiliate links - supports app development
            </p>
          </div>
        </motion.div>

        {/* Donation Popup */}
        <AnimatePresence>
          {showDonation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-8 z-50"
              onClick={() => setShowDonation(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className={`${
                  isDark ? 'bg-gray-800' : 'bg-white'
                } rounded-2xl p-8 max-w-md shadow-2xl`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center mb-4 text-4xl">🎉</div>
                <h3 className={`text-2xl font-bold mb-4 text-center ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Amazing Progress!
                </h3>
                <p className={`mb-6 text-center ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  You've completed {sessionsCompleted} eye care sessions! 
                  Your dedication to eye health is inspiring.
                </p>
                <p className={`mb-6 text-sm text-center ${
                  isDark ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  If this free app helps you, consider supporting its development 
                  so we can keep it free for everyone.
                </p>
                <div className="flex gap-4">
                  <a
                    href="https://buymeacoffee.com/shokawamoto"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-lg font-bold text-center hover:from-yellow-500 hover:to-yellow-600 transition-all"
                  >
                    ☕ Support with Coffee
                  </a>
                  <button
                    onClick={() => setShowDonation(false)}
                    className={`flex-1 px-4 py-3 rounded-lg font-bold transition-all ${
                      isDark
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                  >
                    Maybe Later
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}