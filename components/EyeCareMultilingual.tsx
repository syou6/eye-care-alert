'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Script from 'next/script';

// Translations
const translations = {
  en: {
    title: 'EYE CARE',
    subtitle: '20-20-20 RULE • PROTECT YOUR VISION',
    sponsorMessage: 'Sponsor Wanted',
    contactUs: 'Contact Us',
    tracking: 'TRACKING YOUR SCREEN TIME',
    paused: 'PAUSED',
    totalSessions: 'Total sessions',
    start: 'Start',
    pause: 'Pause',
    reset: 'Reset',
    restYourEyes: 'Rest your eyes',
    lookAway: 'Look at something 20 feet away',
    skipBreak: 'Skip Break',
    freeForever: 'This app is free forever. If it helps you, consider:',
    buyCoffee: 'Buy Coffee',
    share: 'Share',
    recommendedProducts: 'Recommended for your eyes:',
    blueLightGlasses: 'Blue Light Glasses',
    eyeDrops: 'Eye Drops',
    monitorLight: 'Monitor Light',
    affiliateNote: '* Affiliate links - supports app development',
    amazingProgress: 'Amazing Progress!',
    sessionsCompleted: 'You\'ve completed {count} eye care sessions!',
    dedication: 'Your dedication to eye health is inspiring.',
    supportDevelopment: 'If this free app helps you, consider supporting its development so we can keep it free for everyone.',
    supportWithCoffee: 'Support with Coffee',
    maybeLater: 'Maybe Later',
    notification: {
      title: 'Time for a break! 👁️',
      body: 'Look away from your screen for 20 seconds.'
    }
  },
  ja: {
    title: 'アイケア',
    subtitle: '20-20-20ルール • 視力を守る',
    sponsorMessage: 'スポンサー募集中',
    contactUs: 'お問い合わせ',
    tracking: '画面使用時間を記録中',
    paused: '一時停止中',
    totalSessions: '合計セッション',
    start: '開始',
    pause: '一時停止',
    reset: 'リセット',
    restYourEyes: '目を休めましょう',
    lookAway: '6メートル先を見てください',
    skipBreak: '休憩をスキップ',
    freeForever: 'このアプリは永久無料です。役立った場合はご支援を:',
    buyCoffee: 'コーヒーを買う',
    share: 'シェア',
    recommendedProducts: '目の健康におすすめ:',
    blueLightGlasses: 'ブルーライトメガネ',
    eyeDrops: '目薬',
    monitorLight: 'モニターライト',
    affiliateNote: '※ アフィリエイトリンク - アプリ開発をサポート',
    amazingProgress: '素晴らしい進歩！',
    sessionsCompleted: '{count}回のアイケアセッションを完了しました！',
    dedication: 'あなたの目の健康への取り組みは素晴らしいです。',
    supportDevelopment: 'この無料アプリが役立っている場合、みんなが無料で使い続けられるよう開発をご支援ください。',
    supportWithCoffee: 'コーヒーでサポート',
    maybeLater: '後で',
    notification: {
      title: '休憩の時間です！ 👁️',
      body: '20秒間画面から目を離してください。'
    }
  }
};

type Language = 'en' | 'ja';

export default function EyeCareMultilingual() {
  const [timeLeft, setTimeLeft] = useState(20 * 60); // Production: 20 minutes
  const [isActive, setIsActive] = useState(false);
  const [showBreak, setShowBreak] = useState(false);
  const [breakTimeLeft, setBreakTimeLeft] = useState(20);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showDonation, setShowDonation] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [language, setLanguage] = useState<Language>('en');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const t = translations[language];

  // Load saved preferences
  useEffect(() => {
    const saved = localStorage.getItem('eyeCarePreferences');
    if (saved) {
      const prefs = JSON.parse(saved);
      setTheme(prefs.theme || 'light');
      setSessionsCompleted(prefs.sessionsCompleted || 0);
      setLanguage(prefs.language || 'en');
    }
    
    // Detect browser language
    if (!saved) {
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('ja')) {
        setLanguage('ja');
      }
    }
  }, []);

  // Save preferences
  useEffect(() => {
    localStorage.setItem('eyeCarePreferences', JSON.stringify({
      theme,
      sessionsCompleted,
      language,
    }));
  }, [theme, sessionsCompleted, language]);

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
        new Notification(t.notification.title, {
          body: t.notification.body,
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
  }, [isActive, timeLeft, showBreak, sessionsCompleted, t.notification]);

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
        
        {/* Top Ad Banner */}
        <div className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-gray-50/80 to-gray-100/80 backdrop-blur-sm flex items-center justify-between px-6 border-b border-gray-200/30">
          <div className="flex items-center gap-2 text-gray-500 text-xs">
            <span className="opacity-60">📢</span>
            <span className="font-medium">{t.sponsorMessage}</span>
            <span className="opacity-60">•</span>
            <a href="https://twitter.com/K8292288065827" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              {t.contactUs}
            </a>
          </div>
          
          {/* Language Switcher */}
          <div className="flex gap-1">
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                language === 'en' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              <span className="text-base">🇺🇸</span>
              <span className="text-xs font-medium">EN</span>
            </button>
            <button
              onClick={() => setLanguage('ja')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                language === 'ja' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              <span className="text-base">🇯🇵</span>
              <span className="text-xs font-medium">JP</span>
            </button>
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
              {t.title}
            </h1>
            <p className={`text-xs mt-2 tracking-wide ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {t.subtitle}
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
                      {isActive ? `● ${t.tracking}` : `⏸ ${t.paused}`}
                    </motion.div>
                    <div className={`text-xs mt-2 ${
                      isDark ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      {t.totalSessions}: {sessionsCompleted}
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
                      {isActive ? t.pause : t.start}
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
                      {t.reset}
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
                    {t.restYourEyes}
                  </h2>
                  
                  <p className={`mb-8 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {t.lookAway}
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
                    {t.skipBreak}
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
              {t.freeForever}
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="https://buymeacoffee.com/shokawamoto"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg font-medium hover:bg-yellow-500 transition-all"
              >
                ☕ {t.buyCoffee}
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
                      console.log('Share cancelled or failed');
                    }
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                  }
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  isDark
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                📤 {t.share}
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
              {t.recommendedProducts}
            </p>
            <div className="flex justify-center gap-3 text-xs">
              <a 
                href="https://amzn.to/blulight-glasses" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {t.blueLightGlasses}
              </a>
              <span className={isDark ? 'text-gray-600' : 'text-gray-400'}>•</span>
              <a 
                href="https://amzn.to/eye-drops" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {t.eyeDrops}
              </a>
              <span className={isDark ? 'text-gray-600' : 'text-gray-400'}>•</span>
              <a 
                href="https://amzn.to/monitor-light" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {t.monitorLight}
              </a>
            </div>
            <p className={`text-xs mt-2 italic ${
              isDark ? 'text-gray-600' : 'text-gray-400'
            }`}>
              {t.affiliateNote}
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
                  {t.amazingProgress}
                </h3>
                <p className={`mb-6 text-center ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {t.sessionsCompleted.replace('{count}', sessionsCompleted.toString())} {t.dedication}
                </p>
                <p className={`mb-6 text-sm text-center ${
                  isDark ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  {t.supportDevelopment}
                </p>
                <div className="flex gap-4">
                  <a
                    href="https://buymeacoffee.com/shokawamoto"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-lg font-bold text-center hover:from-yellow-500 hover:to-yellow-600 transition-all"
                  >
                    ☕ {t.supportWithCoffee}
                  </a>
                  <button
                    onClick={() => setShowDonation(false)}
                    className={`flex-1 px-4 py-3 rounded-lg font-bold transition-all ${
                      isDark
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                  >
                    {t.maybeLater}
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