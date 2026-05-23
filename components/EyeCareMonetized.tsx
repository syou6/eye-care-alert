'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Script from 'next/script';

export default function EyeCareMonetized() {
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 本番: 20分
  const [isActive, setIsActive] = useState(false);
  const [showBreak, setShowBreak] = useState(false);
  const [breakTimeLeft, setBreakTimeLeft] = useState(20);
  const [isPremium, setIsPremium] = useState(false);
  const [customMinutes, setCustomMinutes] = useState(20);
  const [theme, setTheme] = useState<'light' | 'dark' | 'blue'>('light');
  const [showDonation, setShowDonation] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load saved preferences
  useEffect(() => {
    const saved = localStorage.getItem('eyeCarePreferences');
    if (saved) {
      const prefs = JSON.parse(saved);
      setIsPremium(prefs.isPremium || false);
      setCustomMinutes(prefs.customMinutes || 20);
      setTheme(prefs.theme || 'light');
      setSessionsCompleted(prefs.sessionsCompleted || 0);
    }
  }, []);

  // Save preferences
  useEffect(() => {
    localStorage.setItem('eyeCarePreferences', JSON.stringify({
      isPremium,
      customMinutes,
      theme,
      sessionsCompleted,
    }));
  }, [isPremium, customMinutes, theme, sessionsCompleted]);

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
      
      // Show donation prompt every 5 sessions
      if ((sessionsCompleted + 1) % 5 === 0) {
        setShowDonation(true);
      }
      
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Time for a break', {
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
      setTimeLeft(customMinutes * 60);
      setBreakTimeLeft(20);
      setIsActive(true);
    }
  }, [showBreak, breakTimeLeft, customMinutes]);

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
    setTimeLeft(customMinutes * 60);
    setBreakTimeLeft(20);
    setShowBreak(false);
  }, [customMinutes]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((customMinutes * 60 - timeLeft) / (customMinutes * 60)) * 100;

  const getThemeColors = () => {
    switch (theme) {
      case 'dark':
        return {
          bg: 'bg-gradient-to-br from-gray-900 to-gray-800',
          card: 'bg-gray-800',
          text: 'text-white',
          subtext: 'text-gray-400',
          button: 'bg-white text-gray-900 hover:bg-gray-100',
          secondary: 'bg-gray-700 text-gray-300 hover:bg-gray-600',
        };
      case 'blue':
        return {
          bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
          card: 'bg-white',
          text: 'text-blue-900',
          subtext: 'text-blue-600',
          button: 'bg-blue-600 text-white hover:bg-blue-700',
          secondary: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-gray-50 to-gray-100',
          card: 'bg-white',
          text: 'text-gray-900',
          subtext: 'text-gray-500',
          button: 'bg-gray-900 text-white hover:bg-gray-800',
          secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
        };
    }
  };

  const colors = getThemeColors();

  return (
    <>
      {/* Google AdSense */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR-ID"
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

      <div className={`min-h-screen ${colors.bg} flex items-center justify-center p-8`}>
        {/* Top Ad Banner */}
        {!isPremium && (
          <div className="fixed top-0 left-0 right-0 h-20 bg-gray-100 flex items-center justify-center border-b">
            <div className="text-gray-400 text-sm">
              [広告スペース - 728x90]
            </div>
          </div>
        )}

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`w-full max-w-md ${!isPremium ? 'mt-24' : ''}`}
        >
          {/* Logo with Premium Badge */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-center gap-3">
              <h1 className={`text-2xl font-light tracking-widest ${colors.text}`}>
                EYE CARE
              </h1>
              {isPremium && (
                <span className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs rounded-full font-bold">
                  PRO
                </span>
              )}
            </div>
            <p className={`text-xs ${colors.subtext} mt-2 tracking-wide`}>
              20-20-20 RULE
            </p>
          </motion.div>

          {/* Main Card */}
          <motion.div 
            className={`${colors.card} rounded-3xl shadow-2xl p-12`}
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
                        stroke={theme === 'dark' ? '#374151' : '#e5e7eb'}
                        strokeWidth="8"
                        fill="none"
                      />
                      <motion.circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke={theme === 'blue' ? '#2563eb' : theme === 'dark' ? '#ffffff' : '#111827'}
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
                        className={`text-5xl font-light ${colors.text} tabular-nums`}
                        animate={timeLeft <= 60 ? { 
                          color: theme === 'dark' ? ['#ffffff', '#ef4444', '#ffffff'] : ['#111827', '#ef4444', '#111827']
                        } : {}}
                        transition={{ duration: 1, repeat: timeLeft <= 60 ? Infinity : 0 }}
                      >
                        {formatTime(timeLeft)}
                      </motion.div>
                    </div>
                  </div>

                  {/* Premium Features */}
                  {isPremium && (
                    <div className="mb-6 flex justify-center gap-4">
                      <input
                        type="number"
                        min="1"
                        max="60"
                        value={customMinutes}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 20;
                          setCustomMinutes(val);
                          if (!isActive) {
                            setTimeLeft(val * 60);
                          }
                        }}
                        className={`w-20 px-3 py-2 rounded-lg border ${
                          theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                        }`}
                      />
                      <span className={`${colors.subtext} py-2`}>minutes</span>
                    </div>
                  )}

                  {/* Status */}
                  <div className="text-center mb-8">
                    <motion.div 
                      className={`text-sm ${colors.subtext} tracking-wider`}
                      animate={{ opacity: isActive ? [0.5, 1, 0.5] : 1 }}
                      transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
                    >
                      {isActive ? 'ACTIVE' : 'PAUSED'}
                    </motion.div>
                    <div className={`text-xs ${colors.subtext} mt-2`}>
                      Sessions completed: {sessionsCompleted}
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={toggleTimer}
                      className={`flex-1 py-4 rounded-2xl font-medium transition-all duration-300 ${colors.button}`}
                    >
                      {isActive ? 'Pause' : 'Start'}
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={resetTimer}
                      className={`px-6 py-4 rounded-2xl font-medium transition-all duration-300 ${colors.secondary}`}
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
                    className="mb-8"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <svg className={`w-24 h-24 mx-auto ${colors.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </motion.div>

                  <h2 className={`text-2xl font-light ${colors.text} mb-4`}>
                    Rest your eyes
                  </h2>
                  
                  <p className={`${colors.subtext} mb-8`}>
                    Look at something 20 feet away
                  </p>
                  
                  <motion.div 
                    className={`text-6xl font-light ${colors.text} mb-8 tabular-nums`}
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    {breakTimeLeft}
                  </motion.div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowBreak(false);
                      setTimeLeft(customMinutes * 60);
                      setBreakTimeLeft(20);
                      setIsActive(true);
                    }}
                    className={`px-8 py-3 rounded-2xl font-medium transition-all duration-300 ${colors.secondary}`}
                  >
                    Skip Break
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Theme Selector */}
          <div className="mt-8 flex justify-center gap-2">
            {(['light', 'dark', 'blue'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  theme === t 
                    ? t === 'dark' ? 'bg-gray-700 text-white' : t === 'blue' ? 'bg-blue-600 text-white' : 'bg-gray-900 text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* Premium/Donation Section */}
          <div className="mt-8 text-center">
            {!isPremium ? (
              <div>
                <button
                  onClick={() => setIsPremium(true)} // 実際の実装では決済処理
                  className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-lg font-bold hover:from-yellow-500 hover:to-yellow-700 transition-all"
                >
                  🚀 Upgrade to Premium - $2.99
                </button>
                <p className={`text-xs ${colors.subtext} mt-2`}>
                  • No ads • Custom timer • All themes • Priority support
                </p>
              </div>
            ) : (
              <a
                href="https://www.buymeacoffee.com/yourname"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 text-gray-900 rounded-lg font-bold hover:bg-yellow-500 transition-all"
              >
                ☕ Buy me a coffee
              </a>
            )}
          </div>

          {/* Affiliate Links */}
          <div className={`mt-8 p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <p className={`text-xs ${colors.subtext} mb-2`}>Recommended for eye health:</p>
            <div className="flex gap-2 text-xs">
              <a href="#" className="text-blue-600 hover:underline">Blue Light Glasses</a>
              <span className={colors.subtext}>•</span>
              <a href="#" className="text-blue-600 hover:underline">Eye Drops</a>
              <span className={colors.subtext}>•</span>
              <a href="#" className="text-blue-600 hover:underline">Monitor Light Bar</a>
            </div>
          </div>
        </motion.div>

        {/* Side Ad */}
        {!isPremium && (
          <div className="fixed right-4 top-1/2 transform -translate-y-1/2 w-40 h-96 bg-gray-100 flex items-center justify-center rounded-lg">
            <div className="text-gray-400 text-sm rotate-90">
              [広告 160x600]
            </div>
          </div>
        )}

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
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white rounded-2xl p-8 max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-2xl font-bold mb-4">You're doing great! 🎉</h3>
                <p className="text-gray-600 mb-6">
                  You've completed {sessionsCompleted} sessions! Your eyes thank you.
                  If this app helps you, consider supporting its development.
                </p>
                <div className="flex gap-4">
                  <a
                    href="https://www.buymeacoffee.com/yourname"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-3 bg-yellow-400 text-gray-900 rounded-lg font-bold text-center hover:bg-yellow-500"
                  >
                    ☕ Buy Coffee
                  </a>
                  <button
                    onClick={() => setShowDonation(false)}
                    className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300"
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