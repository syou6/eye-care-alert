'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EyeCareMinimal() {
  const [timeLeft, setTimeLeft] = useState(20); // デバッグ用: 20秒でテスト
  const [isActive, setIsActive] = useState(false);
  const [showBreak, setShowBreak] = useState(false);
  const [breakTimeLeft, setBreakTimeLeft] = useState(20);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Timer countdown
  useEffect(() => {
    if (isActive && timeLeft > 0 && !showBreak) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !showBreak) {
      setShowBreak(true);
      setIsActive(false);
      // Simple notification
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
  }, [isActive, timeLeft, showBreak]);

  // Break countdown
  useEffect(() => {
    if (showBreak && breakTimeLeft > 0) {
      const breakInterval = setInterval(() => {
        setBreakTimeLeft(prev => prev - 1);
      }, 1000);

      return () => clearInterval(breakInterval);
    } else if (breakTimeLeft === 0 && showBreak) {
      setShowBreak(false);
      setTimeLeft(20); // デバッグ用: 20秒でテスト
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

  const progress = ((20 - timeLeft) / 20) * 100; // デバッグ用: 20秒でテスト

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-2xl font-light tracking-widest text-gray-800">
            EYE CARE
          </h1>
          <p className="text-xs text-gray-500 mt-2 tracking-wide">
            20-20-20 RULE
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div 
          className="bg-white rounded-3xl shadow-2xl p-12"
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
                  {/* Progress Ring */}
                  <svg className="w-48 h-48 mx-auto transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                      fill="none"
                    />
                    <motion.circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="#111827"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={553}
                      initial={{ strokeDashoffset: 553 }}
                      animate={{ strokeDashoffset: 553 - (553 * progress) / 100 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </svg>
                  
                  {/* Time Text */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div 
                      className="text-5xl font-light text-gray-900 tabular-nums"
                      animate={timeLeft <= 60 ? { 
                        color: ['#111827', '#ef4444', '#111827'] 
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
                    className="text-sm text-gray-500 tracking-wider"
                    animate={{ opacity: isActive ? [0.5, 1, 0.5] : 1 }}
                    transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
                  >
                    {isActive ? 'ACTIVE' : 'PAUSED'}
                  </motion.div>
                </div>

                {/* Controls */}
                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={toggleTimer}
                    className={`flex-1 py-4 rounded-2xl font-medium transition-all duration-300 ${
                      isActive
                        ? 'bg-gray-900 text-white hover:bg-gray-800'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                  >
                    {isActive ? 'Pause' : 'Start'}
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={resetTimer}
                    className="px-6 py-4 rounded-2xl font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300"
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
                {/* Break Icon */}
                <motion.div 
                  className="mb-8"
                  animate={{ 
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <svg className="w-24 h-24 mx-auto text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </motion.div>

                {/* Break Text */}
                <h2 className="text-2xl font-light text-gray-900 mb-4">
                  Rest your eyes
                </h2>
                
                <p className="text-gray-600 mb-8">
                  Look at something 20 feet away
                </p>
                
                {/* Break Timer */}
                <motion.div 
                  className="text-6xl font-light text-gray-900 mb-8 tabular-nums"
                  animate={{ 
                    opacity: [1, 0.5, 1],
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  {breakTimeLeft}
                </motion.div>
                
                {/* Skip Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowBreak(false);
                    setTimeLeft(20 * 60);
                    setBreakTimeLeft(20);
                    setIsActive(true);
                  }}
                  className="px-8 py-3 rounded-2xl font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-300"
                >
                  Skip Break
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer Info */}
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-xs text-gray-500">
            Every 20 minutes, look at something 20 feet away for 20 seconds
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}