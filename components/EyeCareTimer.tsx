'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Eye, 
  Timer, 
  TrendingUp,
  Calendar,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Sparkles,
  Heart,
  Activity,
  Shield,
  Award,
  Zap
} from 'lucide-react';

interface TimerStats {
  totalUsageTime: number;
  breaksTaken: number;
  lastBreakTime: Date | null;
  streak: number;
}

export default function EyeCareTimer() {
  const [timeLeft, setTimeLeft] = useState(20 * 60);
  const [isActive, setIsActive] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [stats, setStats] = useState<TimerStats>({
    totalUsageTime: 0,
    breaksTaken: 0,
    lastBreakTime: null,
    streak: 0,
  });
  const [breakTimeLeft, setBreakTimeLeft] = useState(20);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number}>>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const usageIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize audio context
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, []);

  // Generate particles
  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
    }));
    setParticles(newParticles);
  }, []);

  const playNotificationSound = () => {
    if (!audioContextRef.current || !isSoundEnabled) return;
    
    const context = audioContextRef.current;
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    const oscillator2 = context.createOscillator();
    const gainNode2 = context.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    oscillator2.connect(gainNode2);
    gainNode2.connect(context.destination);
    
    oscillator.frequency.setValueAtTime(523.25, context.currentTime); // C5
    oscillator.frequency.setValueAtTime(659.25, context.currentTime + 0.1); // E5
    oscillator.frequency.setValueAtTime(783.99, context.currentTime + 0.2); // G5
    
    oscillator2.frequency.setValueAtTime(261.63, context.currentTime); // C4
    oscillator2.frequency.setValueAtTime(329.63, context.currentTime + 0.1); // E4
    oscillator2.frequency.setValueAtTime(392.00, context.currentTime + 0.2); // G4
    
    oscillator.type = 'sine';
    oscillator2.type = 'triangle';
    
    gainNode.gain.setValueAtTime(0.3, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);
    gainNode2.gain.setValueAtTime(0.2, context.currentTime);
    gainNode2.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);
    
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.5);
    oscillator2.start(context.currentTime);
    oscillator2.stop(context.currentTime + 0.5);
  };

  const playTickSound = () => {
    if (!audioContextRef.current || !isSoundEnabled || timeLeft > 10) return;
    
    const context = audioContextRef.current;
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    oscillator.frequency.value = 440;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.05);
    
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.05);
  };

  // Load stats from localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem('eyeCareStats');
    const savedDarkMode = localStorage.getItem('darkMode');
    const savedSound = localStorage.getItem('soundEnabled');
    
    if (savedStats) {
      const parsed = JSON.parse(savedStats);
      setStats({
        ...parsed,
        lastBreakTime: parsed.lastBreakTime ? new Date(parsed.lastBreakTime) : null,
      });
    }
    
    if (savedDarkMode) {
      setIsDarkMode(JSON.parse(savedDarkMode));
    }
    
    if (savedSound !== null) {
      setIsSoundEnabled(JSON.parse(savedSound));
    }
  }, []);

  // Save settings
  useEffect(() => {
    localStorage.setItem('eyeCareStats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('soundEnabled', JSON.stringify(isSoundEnabled));
  }, [isSoundEnabled]);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Timer countdown
  useEffect(() => {
    if (isActive && timeLeft > 0 && !showAlert) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 11 && prev > 1) {
            playTickSound();
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timeLeft === 0 && !showAlert) {
      triggerBreakAlert();
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
  }, [isActive, timeLeft, showAlert]);

  // Usage time tracking
  useEffect(() => {
    if (isActive && !showAlert) {
      usageIntervalRef.current = setInterval(() => {
        setStats(prev => ({
          ...prev,
          totalUsageTime: prev.totalUsageTime + 1,
        }));
      }, 1000);
    } else {
      if (usageIntervalRef.current) {
        clearInterval(usageIntervalRef.current);
      }
    }

    return () => {
      if (usageIntervalRef.current) {
        clearInterval(usageIntervalRef.current);
      }
    };
  }, [isActive, showAlert]);

  // Break countdown
  useEffect(() => {
    if (showAlert && breakTimeLeft > 0) {
      const breakInterval = setInterval(() => {
        setBreakTimeLeft(prev => prev - 1);
      }, 1000);

      return () => clearInterval(breakInterval);
    } else if (breakTimeLeft === 0 && showAlert) {
      completeBreak();
    }
  }, [showAlert, breakTimeLeft]);

  const triggerBreakAlert = useCallback(() => {
    setShowAlert(true);
    setIsActive(false);
    
    playNotificationSound();

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('👁️ Eye Care Alert - Time for a break!', {
        body: 'Look at something 20 feet away for 20 seconds to protect your eyes.',
        icon: '/icon.png',
        badge: '/badge.png',
      });
    }

    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }
  }, []);

  const completeBreak = useCallback(() => {
    setStats(prev => ({
      ...prev,
      breaksTaken: prev.breaksTaken + 1,
      lastBreakTime: new Date(),
      streak: prev.streak + 1,
    }));
    setShowAlert(false);
    setTimeLeft(20 * 60);
    setBreakTimeLeft(20);
    setIsActive(true);
  }, []);

  const skipBreak = useCallback(() => {
    setStats(prev => ({
      ...prev,
      streak: 0,
    }));
    setShowAlert(false);
    setTimeLeft(20 * 60);
    setBreakTimeLeft(20);
    setIsActive(true);
  }, []);

  const toggleTimer = useCallback(() => {
    setIsActive(prev => !prev);
  }, []);

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setTimeLeft(20 * 60);
    setBreakTimeLeft(20);
    setShowAlert(false);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatUsageTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${mins}m`;
  };

  const getProgressPercentage = () => {
    return ((20 * 60 - timeLeft) / (20 * 60)) * 100;
  };

  const getHealthScore = () => {
    const baseScore = Math.min(100, (stats.breaksTaken * 5) + (stats.streak * 10));
    return baseScore;
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${isDarkMode ? 'dark' : ''}`}>
      <div className={`min-h-screen relative overflow-hidden ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900' 
          : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
      }`}>
        {/* Animated Background Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className={`absolute w-1 h-1 ${isDarkMode ? 'bg-white' : 'bg-indigo-400'} rounded-full opacity-20`}
              initial={{ x: `${particle.x}%`, y: `${particle.y}%` }}
              animate={{
                x: [`${particle.x}%`, `${(particle.x + 20) % 100}%`],
                y: [`${particle.y}%`, `${(particle.y + 30) % 100}%`],
              }}
              transition={{
                duration: 20 + Math.random() * 10,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>

        {/* Gradient Orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Eye className={`w-12 h-12 ${isDarkMode ? 'text-purple-300' : 'text-indigo-600'}`} />
              </motion.div>
              <h1 className={`text-5xl font-bold bg-gradient-to-r ${
                isDarkMode 
                  ? 'from-purple-300 to-pink-300' 
                  : 'from-indigo-600 to-purple-600'
              } bg-clip-text text-transparent`}>
                Eye Care Pro
              </h1>
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className={`w-12 h-12 ${isDarkMode ? 'text-pink-300' : 'text-purple-600'}`} />
              </motion.div>
            </div>
            <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Protect your vision with smart break reminders
            </p>
          </motion.div>

          {/* Control Bar */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-center gap-4 mb-8"
          >
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-3 rounded-2xl backdrop-blur-lg ${
                isDarkMode 
                  ? 'bg-white/10 hover:bg-white/20 text-yellow-300' 
                  : 'bg-white/70 hover:bg-white/90 text-gray-700'
              } transition-all duration-300 shadow-xl`}
            >
              {isDarkMode ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
            </button>
            
            <button
              onClick={() => setIsSoundEnabled(!isSoundEnabled)}
              className={`p-3 rounded-2xl backdrop-blur-lg ${
                isDarkMode 
                  ? 'bg-white/10 hover:bg-white/20 text-white' 
                  : 'bg-white/70 hover:bg-white/90 text-gray-700'
              } transition-all duration-300 shadow-xl`}
            >
              {isSoundEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
            </button>
          </motion.div>

          {/* Main Timer Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`backdrop-blur-xl rounded-3xl p-8 mb-8 shadow-2xl ${
              isDarkMode 
                ? 'bg-white/10 border border-white/20' 
                : 'bg-white/70 border border-white/50'
            }`}
          >
            <AnimatePresence mode="wait">
              {!showAlert ? (
                <motion.div
                  key="timer"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center"
                >
                  {/* Circular Progress */}
                  <div className="relative w-64 h-64 mx-auto mb-8">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="128"
                        cy="128"
                        r="120"
                        stroke={isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(99,102,241,0.1)'}
                        strokeWidth="16"
                        fill="none"
                      />
                      <motion.circle
                        cx="128"
                        cy="128"
                        r="120"
                        stroke="url(#gradient)"
                        strokeWidth="16"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={754}
                        initial={{ strokeDashoffset: 754 }}
                        animate={{ strokeDashoffset: 754 - (754 * getProgressPercentage()) / 100 }}
                        transition={{ duration: 0.5 }}
                      />
                      <defs>
                        <linearGradient id="gradient">
                          <stop offset="0%" stopColor={isDarkMode ? '#c084fc' : '#6366f1'} />
                          <stop offset="100%" stopColor={isDarkMode ? '#f472b6' : '#a855f7'} />
                        </linearGradient>
                      </defs>
                    </svg>
                    
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <motion.div 
                        className={`text-6xl font-bold mb-2 ${
                          isDarkMode ? 'text-white' : 'text-gray-800'
                        }`}
                        animate={timeLeft <= 10 ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 1, repeat: timeLeft <= 10 ? Infinity : 0 }}
                      >
                        {formatTime(timeLeft)}
                      </motion.div>
                      
                      <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {isActive ? (
                          <motion.div
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="flex items-center gap-2"
                          >
                            <Activity className="w-4 h-4" />
                            <span>Active</span>
                          </motion.div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Timer className="w-4 h-4" />
                            <span>Paused</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Control Buttons */}
                  <div className="flex justify-center gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={toggleTimer}
                      className={`px-8 py-4 rounded-2xl font-semibold text-white shadow-xl transition-all duration-300 flex items-center gap-3 ${
                        isActive
                          ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600'
                          : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                      }`}
                    >
                      {isActive ? (
                        <>
                          <Pause className="w-5 h-5" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-5 h-5" />
                          Start
                        </>
                      )}
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={resetTimer}
                      className={`px-8 py-4 rounded-2xl font-semibold shadow-xl transition-all duration-300 flex items-center gap-3 ${
                        isDarkMode
                          ? 'bg-gray-700 hover:bg-gray-600 text-white'
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      }`}
                    >
                      <RotateCcw className="w-5 h-5" />
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
                  className="text-center"
                >
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-6xl mb-6"
                  >
                    👁️
                  </motion.div>
                  
                  <h2 className={`text-3xl font-bold mb-4 ${
                    isDarkMode ? 'text-white' : 'text-gray-800'
                  }`}>
                    Break Time!
                  </h2>
                  
                  <p className={`text-xl mb-6 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Look at something 20 feet (6 meters) away
                  </p>
                  
                  <motion.div 
                    className={`text-7xl font-bold mb-8 ${
                      isDarkMode ? 'text-green-400' : 'text-green-600'
                    }`}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    {breakTimeLeft}
                  </motion.div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={skipBreak}
                    className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-2xl font-semibold transition-all duration-300"
                  >
                    Skip Break (Not Recommended ⚠️)
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.05 }}
              className={`backdrop-blur-xl rounded-2xl p-6 shadow-xl ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-white/20' 
                  : 'bg-gradient-to-br from-blue-100 to-cyan-100'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <Timer className={`w-8 h-8 ${isDarkMode ? 'text-cyan-300' : 'text-blue-600'}`} />
                <Zap className={`w-5 h-5 ${isDarkMode ? 'text-yellow-300' : 'text-yellow-500'}`} />
              </div>
              <div className={`text-3xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                {formatUsageTime(stats.totalUsageTime)}
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Total Screen Time
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              className={`backdrop-blur-xl rounded-2xl p-6 shadow-xl ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-white/20' 
                  : 'bg-gradient-to-br from-green-100 to-emerald-100'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <Heart className={`w-8 h-8 ${isDarkMode ? 'text-emerald-300' : 'text-green-600'}`} />
                <Award className={`w-5 h-5 ${isDarkMode ? 'text-yellow-300' : 'text-yellow-500'}`} />
              </div>
              <div className={`text-3xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                {stats.breaksTaken}
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Breaks Completed
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              className={`backdrop-blur-xl rounded-2xl p-6 shadow-xl ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/20' 
                  : 'bg-gradient-to-br from-purple-100 to-pink-100'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <TrendingUp className={`w-8 h-8 ${isDarkMode ? 'text-pink-300' : 'text-purple-600'}`} />
                <Sparkles className={`w-5 h-5 ${isDarkMode ? 'text-yellow-300' : 'text-yellow-500'}`} />
              </div>
              <div className={`text-3xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                {stats.streak}
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Current Streak
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              className={`backdrop-blur-xl rounded-2xl p-6 shadow-xl ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-white/20' 
                  : 'bg-gradient-to-br from-orange-100 to-red-100'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <Shield className={`w-8 h-8 ${isDarkMode ? 'text-red-300' : 'text-orange-600'}`} />
                <Activity className={`w-5 h-5 ${isDarkMode ? 'text-green-300' : 'text-green-500'}`} />
              </div>
              <div className={`text-3xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                {getHealthScore()}%
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Eye Health Score
              </div>
            </motion.div>
          </div>

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`backdrop-blur-xl rounded-3xl p-8 shadow-xl ${
              isDarkMode 
                ? 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/20' 
                : 'bg-gradient-to-br from-indigo-50 to-purple-50'
            }`}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 rounded-2xl ${
                isDarkMode ? 'bg-indigo-500/20' : 'bg-indigo-100'
              }`}>
                <Eye className={`w-6 h-6 ${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'}`} />
              </div>
              <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                The 20-20-20 Rule
              </h3>
            </div>
            
            <p className={`text-lg leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Every <span className="font-bold text-indigo-500">20 minutes</span>, 
              take a <span className="font-bold text-green-500">20-second</span> break and 
              focus your eyes on something at least <span className="font-bold text-purple-500">20 feet</span> away. 
              This simple practice helps reduce digital eye strain, prevents computer vision syndrome, 
              and maintains healthy vision for years to come.
            </p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-4 rounded-xl ${
                isDarkMode ? 'bg-white/5' : 'bg-white/50'
              }`}>
                <div className="text-3xl mb-2">🎯</div>
                <h4 className={`font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  Reduces Eye Strain
                </h4>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Prevents fatigue and discomfort
                </p>
              </div>

              <div className={`p-4 rounded-xl ${
                isDarkMode ? 'bg-white/5' : 'bg-white/50'
              }`}>
                <div className="text-3xl mb-2">💪</div>
                <h4 className={`font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  Improves Focus
                </h4>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Enhances productivity and concentration
                </p>
              </div>

              <div className={`p-4 rounded-xl ${
                isDarkMode ? 'bg-white/5' : 'bg-white/50'
              }`}>
                <div className="text-3xl mb-2">🛡️</div>
                <h4 className={`font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  Long-term Protection
                </h4>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Preserves vision health over time
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}