'use client';

import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Stars, Float, Text3D, Environment } from '@react-three/drei';
import * as THREE from 'three';
import confetti from 'canvas-confetti';
import toast, { Toaster } from 'react-hot-toast';
import { 
  Play, Pause, RotateCcw, Eye, Timer, TrendingUp, Moon, Sun,
  Volume2, VolumeX, Sparkles, Heart, Activity, Shield, Award,
  Zap, Trophy, Star, Flame, Rocket, Crown, Diamond, Gift,
  Target, Gamepad2, Music, Mic, MicOff, Brain, Cpu, Wifi,
  WifiOff, BatteryCharging, Coffee, Droplets, Wind, Cloud,
  CloudRain, CloudSnow, Sunrise, Sunset, Bot, MessageSquare
} from 'lucide-react';

interface TimerStats {
  totalUsageTime: number;
  breaksTaken: number;
  lastBreakTime: Date | null;
  streak: number;
  level: number;
  experience: number;
  achievements: string[];
  dailyGoal: number;
  weeklyStats: number[];
}

// 3D Floating Eye Component
function FloatingEye() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  return (
    <Float speed={4} rotationIntensity={1} floatIntensity={2}>
      <Sphere args={[1, 64, 64]} ref={meshRef}>
        <MeshDistortMaterial
          color="#8B5CF6"
          attach="material"
          distort={0.3}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
}

// 3D Background Scene
function Scene3D() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <FloatingEye />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
        <Environment preset="sunset" />
      </Suspense>
    </Canvas>
  );
}

export default function EyeCareTimerUltimate() {
  const [timeLeft, setTimeLeft] = useState(20 * 60);
  const [isActive, setIsActive] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [currentWeather, setCurrentWeather] = useState('sunny');
  const [powerMode, setPowerMode] = useState<'normal' | 'focus' | 'zen' | 'gaming'>('normal');
  const [stats, setStats] = useState<TimerStats>({
    totalUsageTime: 0,
    breaksTaken: 0,
    lastBreakTime: null,
    streak: 0,
    level: 1,
    experience: 0,
    achievements: [],
    dailyGoal: 12,
    weeklyStats: [0, 0, 0, 0, 0, 0, 0],
  });
  const [breakTimeLeft, setBreakTimeLeft] = useState(20);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number}>>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showFireworks, setShowFireworks] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const usageIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [30, -30]);
  const rotateY = useTransform(mouseX, [-300, 300], [-30, 30]);

  // Initialize
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      synthRef.current = new SpeechSynthesisUtterance();
    }
    
    // Generate initial particles
    const newParticles = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
    }));
    setParticles(newParticles);
    
    // Track mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Epic sound system
  const playEpicSound = () => {
    if (!audioContextRef.current || !isSoundEnabled) return;
    
    const context = audioContextRef.current;
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99]; // C Major chord progression
    
    notes.forEach((freq, index) => {
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      const filter = context.createBiquadFilter();
      
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(context.destination);
      
      oscillator.frequency.setValueAtTime(freq, context.currentTime + index * 0.1);
      oscillator.type = index % 2 === 0 ? 'sine' : 'triangle';
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2000, context.currentTime);
      filter.Q.setValueAtTime(10, context.currentTime);
      
      gainNode.gain.setValueAtTime(0, context.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, context.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 1.5);
      
      oscillator.start(context.currentTime + index * 0.1);
      oscillator.stop(context.currentTime + 2);
    });
  };

  // Voice synthesis
  const speak = (text: string) => {
    if (!isVoiceEnabled || !synthRef.current) return;
    
    synthRef.current.text = text;
    synthRef.current.rate = 1;
    synthRef.current.pitch = 1;
    synthRef.current.volume = 0.8;
    
    speechSynthesis.speak(synthRef.current);
  };

  // Achievements system
  const unlockAchievement = (achievement: string) => {
    if (!stats.achievements.includes(achievement)) {
      setStats(prev => ({
        ...prev,
        achievements: [...prev.achievements, achievement],
        experience: prev.experience + 100,
      }));
      
      toast.success(`🏆 Achievement Unlocked: ${achievement}!`, {
        duration: 5000,
        style: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#fff',
          fontSize: '18px',
          padding: '20px',
        },
      });
      
      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#667eea', '#764ba2', '#f093fb', '#f5576c'],
      });
      
      playEpicSound();
    }
  };

  // Level up system
  useEffect(() => {
    const expNeeded = stats.level * 500;
    if (stats.experience >= expNeeded) {
      setStats(prev => ({
        ...prev,
        level: prev.level + 1,
        experience: prev.experience - expNeeded,
      }));
      
      toast.success(`🎉 LEVEL UP! You're now Level ${stats.level + 1}!`, {
        duration: 7000,
        style: {
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: '#fff',
          fontSize: '20px',
          padding: '25px',
        },
      });
      
      // Epic confetti explosion
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
      
      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;
      
      const interval: any = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);
        
        const particleCount = 50 * (timeLeft / duration);
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        });
      }, 250);
    }
  }, [stats.experience, stats.level]);

  // Weather effects
  const getWeatherGradient = () => {
    switch (currentWeather) {
      case 'sunny':
        return 'from-yellow-400 via-orange-400 to-red-400';
      case 'cloudy':
        return 'from-gray-400 via-gray-500 to-gray-600';
      case 'rainy':
        return 'from-blue-400 via-blue-500 to-gray-600';
      case 'snowy':
        return 'from-white via-gray-200 to-blue-200';
      case 'sunset':
        return 'from-purple-400 via-pink-400 to-orange-400';
      default:
        return 'from-blue-400 via-purple-400 to-pink-400';
    }
  };

  // Power mode themes
  const getPowerModeStyle = () => {
    switch (powerMode) {
      case 'focus':
        return 'ring-4 ring-blue-500 ring-opacity-50';
      case 'zen':
        return 'ring-4 ring-green-500 ring-opacity-50';
      case 'gaming':
        return 'ring-4 ring-red-500 ring-opacity-50 animate-pulse';
      default:
        return '';
    }
  };

  // Load/Save enhanced stats
  useEffect(() => {
    const savedData = localStorage.getItem('eyeCareUltimateStats');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setStats({
        ...parsed,
        lastBreakTime: parsed.lastBreakTime ? new Date(parsed.lastBreakTime) : null,
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('eyeCareUltimateStats', JSON.stringify(stats));
  }, [stats]);

  // Timer logic
  useEffect(() => {
    if (isActive && timeLeft > 0 && !showAlert) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev === 60) speak("One minute remaining");
          if (prev === 10) speak("Ten seconds");
          return prev - 1;
        });
      }, 1000);
    } else if (timeLeft === 0 && !showAlert) {
      triggerBreakAlert();
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, timeLeft, showAlert]);

  const triggerBreakAlert = useCallback(() => {
    setShowAlert(true);
    setIsActive(false);
    
    playEpicSound();
    speak("Time for a break! Look away from your screen.");
    
    // Check for achievements
    if (stats.breaksTaken === 0) unlockAchievement("First Break");
    if (stats.breaksTaken === 9) unlockAchievement("10 Breaks Champion");
    if (stats.streak === 4) unlockAchievement("5 Streak Master");
    
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('👁️ Eye Care Ultimate - Break Time!', {
        body: 'Time to rest your eyes. You are doing great!',
        icon: '/icon.png',
      });
    }
  }, [stats]);

  const completeBreak = useCallback(() => {
    setStats(prev => ({
      ...prev,
      breaksTaken: prev.breaksTaken + 1,
      lastBreakTime: new Date(),
      streak: prev.streak + 1,
      experience: prev.experience + 50,
    }));
    
    speak("Great job! Break completed.");
    toast.success('✅ Break completed! +50 XP', {
      style: {
        background: '#10b981',
        color: '#fff',
      },
    });
    
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`min-h-screen transition-all duration-700 ${isDarkMode ? 'dark' : ''}`}>
      <Toaster position="top-center" />
      
      {/* 3D Background Layer */}
      <div className="fixed inset-0 z-0">
        <Scene3D />
      </div>
      
      {/* Weather Overlay */}
      <div className={`fixed inset-0 z-1 opacity-30 bg-gradient-to-br ${getWeatherGradient()}`} />
      
      {/* Holographic Grid */}
      <div className="fixed inset-0 z-2 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          animation: 'grid 20s linear infinite',
        }} />
      </div>
      
      {/* Dynamic Particles */}
      <div className="fixed inset-0 z-3 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"
            initial={{ x: `${particle.x}%`, y: `${particle.y}%` }}
            animate={{
              x: [`${particle.x}%`, `${(particle.x + 40) % 100}%`],
              y: [`${particle.y}%`, `${(particle.y + 60) % 100}%`],
              scale: [1, 2, 1],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Ultimate Header */}
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <motion.div 
              className="inline-block"
              style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
            >
              <h1 className="text-7xl font-black mb-4 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-2xl"
                  style={{ textShadow: '0 0 60px rgba(168, 85, 247, 0.5)' }}>
                EYE CARE ULTIMATE
              </h1>
            </motion.div>
            
            <div className="flex items-center justify-center gap-6 mb-4">
              <Trophy className="w-8 h-8 text-yellow-400 animate-bounce" />
              <span className="text-2xl font-bold text-white">Level {stats.level}</span>
              <Crown className="w-8 h-8 text-yellow-400 animate-bounce" />
            </div>
            
            {/* Experience Bar */}
            <div className="w-64 h-4 bg-gray-700 rounded-full mx-auto overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                initial={{ width: 0 }}
                animate={{ width: `${(stats.experience / (stats.level * 500)) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-sm text-gray-400 mt-2">
              {stats.experience} / {stats.level * 500} XP
            </p>
          </motion.div>
          
          {/* Power Mode Selector */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-center gap-4 mb-8"
          >
            {[
              { mode: 'normal' as const, icon: Activity, color: 'gray' },
              { mode: 'focus' as const, icon: Target, color: 'blue' },
              { mode: 'zen' as const, icon: Heart, color: 'green' },
              { mode: 'gaming' as const, icon: Gamepad2, color: 'red' },
            ].map(({ mode, icon: Icon, color }) => (
              <motion.button
                key={mode}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setPowerMode(mode)}
                className={`p-4 rounded-2xl backdrop-blur-xl transition-all ${
                  powerMode === mode 
                    ? `bg-${color}-500 text-white shadow-2xl shadow-${color}-500/50` 
                    : 'bg-white/10 text-gray-400 hover:bg-white/20'
                }`}
              >
                <Icon className="w-6 h-6" />
              </motion.button>
            ))}
          </motion.div>
          
          {/* Control Panel */}
          <div className="flex justify-center gap-4 mb-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-3 rounded-2xl backdrop-blur-xl bg-white/10 hover:bg-white/20 text-white shadow-xl"
            >
              {isDarkMode ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsSoundEnabled(!isSoundEnabled)}
              className="p-3 rounded-2xl backdrop-blur-xl bg-white/10 hover:bg-white/20 text-white shadow-xl"
            >
              {isSoundEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
              className="p-3 rounded-2xl backdrop-blur-xl bg-white/10 hover:bg-white/20 text-white shadow-xl"
            >
              {isVoiceEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowAIAssistant(!showAIAssistant)}
              className="p-3 rounded-2xl backdrop-blur-xl bg-white/10 hover:bg-white/20 text-white shadow-xl"
            >
              <Bot className="w-6 h-6" />
            </motion.button>
          </div>
          
          {/* Main Timer - Holographic Style */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`backdrop-blur-xl rounded-3xl p-8 mb-8 ${getPowerModeStyle()}`}
            style={{
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(236, 72, 153, 0.1))',
              border: '2px solid rgba(168, 85, 247, 0.3)',
              boxShadow: '0 0 100px rgba(168, 85, 247, 0.3), inset 0 0 50px rgba(168, 85, 247, 0.1)',
            }}
          >
            <AnimatePresence mode="wait">
              {!showAlert ? (
                <motion.div
                  key="timer"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="text-center"
                >
                  {/* Futuristic Timer Display */}
                  <div className="relative w-80 h-80 mx-auto mb-8">
                    {/* Neon Rings */}
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: 'conic-gradient(from 0deg, #06b6d4, #8b5cf6, #ec4899, #06b6d4)',
                        filter: 'blur(20px)',
                      }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    />
                    
                    {/* Timer Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <motion.div 
                        className="text-8xl font-black text-white"
                        style={{ textShadow: '0 0 40px rgba(168, 85, 247, 0.8)' }}
                        animate={timeLeft <= 10 ? { 
                          scale: [1, 1.2, 1],
                          textShadow: [
                            '0 0 40px rgba(168, 85, 247, 0.8)',
                            '0 0 60px rgba(236, 72, 153, 1)',
                            '0 0 40px rgba(168, 85, 247, 0.8)',
                          ]
                        } : {}}
                        transition={{ duration: 1, repeat: timeLeft <= 10 ? Infinity : 0 }}
                      >
                        {formatTime(timeLeft)}
                      </motion.div>
                      
                      <motion.div
                        className="mt-4 flex items-center gap-2 text-white"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {isActive ? (
                          <>
                            <Rocket className="w-6 h-6" />
                            <span className="text-xl font-bold">ACTIVE</span>
                          </>
                        ) : (
                          <>
                            <Coffee className="w-6 h-6" />
                            <span className="text-xl font-bold">PAUSED</span>
                          </>
                        )}
                      </motion.div>
                    </div>
                  </div>
                  
                  {/* Holographic Control Buttons */}
                  <div className="flex justify-center gap-6">
                    <motion.button
                      whileHover={{ scale: 1.1, boxShadow: '0 0 30px rgba(16, 185, 129, 0.8)' }}
                      whileTap={{ scale: 0.9 }}
                      onClick={toggleTimer}
                      className={`px-10 py-5 rounded-2xl font-bold text-white text-xl transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-red-500 to-pink-500'
                          : 'bg-gradient-to-r from-green-500 to-emerald-500'
                      }`}
                      style={{
                        boxShadow: isActive 
                          ? '0 0 50px rgba(239, 68, 68, 0.5)' 
                          : '0 0 50px rgba(16, 185, 129, 0.5)',
                      }}
                    >
                      {isActive ? (
                        <>
                          <Pause className="inline w-6 h-6 mr-2" />
                          PAUSE
                        </>
                      ) : (
                        <>
                          <Play className="inline w-6 h-6 mr-2" />
                          START
                        </>
                      )}
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1, boxShadow: '0 0 30px rgba(107, 114, 128, 0.8)' }}
                      whileTap={{ scale: 0.9 }}
                      onClick={resetTimer}
                      className="px-10 py-5 rounded-2xl font-bold text-white text-xl bg-gradient-to-r from-gray-600 to-gray-700"
                      style={{ boxShadow: '0 0 50px rgba(107, 114, 128, 0.5)' }}
                    >
                      <RotateCcw className="inline w-6 h-6 mr-2" />
                      RESET
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="break"
                  initial={{ opacity: 0, rotateY: 180 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  exit={{ opacity: 0, rotateY: -180 }}
                  className="text-center"
                >
                  <motion.div
                    animate={{ 
                      scale: [1, 1.5, 1],
                      rotate: [0, 360],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="text-9xl mb-8"
                  >
                    👁️
                  </motion.div>
                  
                  <h2 className="text-5xl font-black text-white mb-6"
                      style={{ textShadow: '0 0 40px rgba(16, 185, 129, 0.8)' }}>
                    BREAK TIME!
                  </h2>
                  
                  <motion.div 
                    className="text-9xl font-black text-green-400 mb-8"
                    style={{ textShadow: '0 0 60px rgba(16, 185, 129, 1)' }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    {breakTimeLeft}
                  </motion.div>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={skipBreak}
                    className="px-8 py-4 bg-gray-600 hover:bg-gray-700 text-white rounded-2xl font-bold text-xl"
                    style={{ boxShadow: '0 0 30px rgba(107, 114, 128, 0.5)' }}
                  >
                    Skip Break ⚠️
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          
          {/* Epic Stats Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { 
                icon: Flame, 
                label: 'Streak', 
                value: stats.streak, 
                color: 'from-orange-500 to-red-500',
                glow: 'rgba(251, 146, 60, 0.5)'
              },
              { 
                icon: Trophy, 
                label: 'Achievements', 
                value: stats.achievements.length, 
                color: 'from-yellow-500 to-amber-500',
                glow: 'rgba(251, 191, 36, 0.5)'
              },
              { 
                icon: Diamond, 
                label: 'Total Breaks', 
                value: stats.breaksTaken, 
                color: 'from-blue-500 to-cyan-500',
                glow: 'rgba(6, 182, 212, 0.5)'
              },
              { 
                icon: Star, 
                label: 'Daily Goal', 
                value: `${Math.min(stats.breaksTaken, stats.dailyGoal)}/${stats.dailyGoal}`, 
                color: 'from-purple-500 to-pink-500',
                glow: 'rgba(236, 72, 153, 0.5)'
              },
            ].map(({ icon: Icon, label, value, color, glow }, index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, boxShadow: `0 0 50px ${glow}` }}
                className={`backdrop-blur-xl rounded-2xl p-6 bg-gradient-to-br ${color}`}
                style={{
                  background: `linear-gradient(135deg, ${glow}, transparent)`,
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: `0 0 30px ${glow}`,
                }}
              >
                <Icon className="w-10 h-10 text-white mb-3" />
                <div className="text-4xl font-black text-white mb-1">{value}</div>
                <div className="text-sm text-white/80">{label}</div>
              </motion.div>
            ))}
          </div>
          
          {/* AI Assistant Panel */}
          <AnimatePresence>
            {showAIAssistant && (
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                className="fixed right-8 bottom-8 w-96 p-6 backdrop-blur-xl rounded-2xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.2))',
                  border: '2px solid rgba(168, 85, 247, 0.3)',
                  boxShadow: '0 0 50px rgba(168, 85, 247, 0.3)',
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Bot className="w-8 h-8 text-purple-400" />
                  <h3 className="text-xl font-bold text-white">AI Assistant</h3>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-white/10 rounded-xl text-white">
                    💡 Pro tip: Keep your screen at arm's length for optimal eye health!
                  </div>
                  <div className="p-3 bg-white/10 rounded-xl text-white">
                    📊 You've improved your break consistency by 40% this week!
                  </div>
                  <div className="p-3 bg-white/10 rounded-xl text-white">
                    🎯 Next achievement: Complete 5 more breaks to unlock "Eye Guardian"!
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes grid {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
      `}</style>
    </div>
  );
}