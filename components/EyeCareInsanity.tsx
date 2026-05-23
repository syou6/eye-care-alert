'use client';

import { useState, useEffect, useCallback, useRef, memo, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  Zap, Brain, Cpu, Wifi, Activity, HeartHandshake, Dna, 
  Binary, GitBranch, Layers, Network, Sparkles, Orbit,
  Atom, Zap as RadioActive, Fingerprint, Wifi as WifiHigh, WifiOff as WifiLow,
  ThermometerSun, Wind, Gauge, BrainCircuit, CircuitBoard
} from 'lucide-react';

// Optimized Matrix Rain Component
const MatrixRain = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charArray = chars.split('');
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];
    
    for (let i = 0; i < columns; i++) {
      drops[i] = 1;
    }
    
    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#0F0';
      ctx.font = fontSize + 'px monospace';
      
      for (let i = 0; i < drops.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };
    
    const interval = setInterval(draw, 33);
    return () => clearInterval(interval);
  }, []);
  
  return <canvas ref={canvasRef} className="fixed inset-0 z-0 opacity-20 pointer-events-none" />;
});

MatrixRain.displayName = 'MatrixRain';

// Quantum Particle System
const QuantumField = memo(() => {
  const [particles] = useState(() => 
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      z: Math.random() * 100,
    }))
  );
  
  return (
    <div className="fixed inset-0 z-1 pointer-events-none">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute w-1 h-1 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0,255,255,1) 0%, rgba(0,255,255,0) 100%)',
            boxShadow: '0 0 10px cyan',
          }}
          animate={{
            x: [`${p.x}vw`, `${(p.x + 50) % 100}vw`],
            y: [`${p.y}vh`, `${(p.y + 50) % 100}vh`],
            scale: [1, 2, 1],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 10 + Math.random() * 5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
});

QuantumField.displayName = 'QuantumField';

// Neural Network Visualization
const NeuralNetwork = memo(() => {
  const [connections] = useState(() => 
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x1: Math.random() * 100,
      y1: Math.random() * 100,
      x2: Math.random() * 100,
      y2: Math.random() * 100,
    }))
  );
  
  return (
    <svg className="fixed inset-0 z-2 pointer-events-none opacity-30">
      {connections.map(c => (
        <motion.line
          key={c.id}
          x1={`${c.x1}%`}
          y1={`${c.y1}%`}
          x2={`${c.x2}%`}
          y2={`${c.y2}%`}
          stroke="url(#neural-gradient)"
          strokeWidth="0.5"
          animate={{
            opacity: [0.2, 1, 0.2],
            strokeWidth: [0.5, 2, 0.5],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
      <defs>
        <linearGradient id="neural-gradient">
          <stop offset="0%" stopColor="#00ffff" />
          <stop offset="50%" stopColor="#ff00ff" />
          <stop offset="100%" stopColor="#ffff00" />
        </linearGradient>
      </defs>
    </svg>
  );
});

NeuralNetwork.displayName = 'NeuralNetwork';

interface TimerStats {
  totalUsageTime: number;
  breaksTaken: number;
  lastBreakTime: Date | null;
  streak: number;
  level: number;
  experience: number;
  achievements: string[];
  heartRate: number;
  focusLevel: number;
  eyeStrain: number;
  productivity: number;
  quantumState: 'superposition' | 'entangled' | 'collapsed';
  dimension: number;
  timeline: 'past' | 'present' | 'future';
}

export default function EyeCareInsanity() {
  const [timeLeft, setTimeLeft] = useState(20 * 60);
  const [isActive, setIsActive] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [breakTimeLeft, setBreakTimeLeft] = useState(20);
  const [mode, setMode] = useState<'quantum' | 'neural' | 'matrix' | 'hyperdrive'>('quantum');
  const [stats, setStats] = useState<TimerStats>({
    totalUsageTime: 0,
    breaksTaken: 0,
    lastBreakTime: null,
    streak: 0,
    level: 1,
    experience: 0,
    achievements: [],
    heartRate: 72,
    focusLevel: 85,
    eyeStrain: 15,
    productivity: 92,
    quantumState: 'superposition',
    dimension: 3,
    timeline: 'present',
  });
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationFrameRef = useRef<number>(0);
  
  // Mouse tracking with spring physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 10 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 10 });
  const rotateX = useTransform(springY, [-300, 300], [45, -45]);
  const rotateY = useTransform(springX, [-300, 300], [-45, 45]);
  
  // Initialize audio with optimized context
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    const handleMouseMove = (e: MouseEvent) => {
      requestAnimationFrame(() => {
        mouseX.set(e.clientX - window.innerWidth / 2);
        mouseY.set(e.clientY - window.innerHeight / 2);
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);
  
  // Biometric simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        heartRate: 60 + Math.random() * 40,
        focusLevel: Math.max(0, Math.min(100, prev.focusLevel + (Math.random() - 0.5) * 10)),
        eyeStrain: Math.max(0, Math.min(100, prev.eyeStrain + (isActive ? 0.5 : -1))),
        productivity: Math.max(0, Math.min(100, prev.productivity + (Math.random() - 0.5) * 5)),
      }));
    }, 2000);
    
    return () => clearInterval(interval);
  }, [isActive]);
  
  // Quantum sound generation
  const playQuantumSound = useCallback(() => {
    if (!audioContextRef.current) return;
    
    const context = audioContextRef.current;
    const oscillators: OscillatorNode[] = [];
    const baseFreq = 432; // The "universal" frequency
    
    for (let i = 0; i < 5; i++) {
      const osc = context.createOscillator();
      const gain = context.createGain();
      const panner = context.createStereoPanner();
      
      osc.frequency.value = baseFreq * Math.pow(1.618, i); // Golden ratio harmonics
      osc.type = ['sine', 'triangle', 'square', 'sawtooth'][i % 4] as OscillatorType;
      
      gain.gain.setValueAtTime(0, context.currentTime);
      gain.gain.linearRampToValueAtTime(0.1, context.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 2);
      
      panner.pan.setValueAtTime(Math.sin(i * Math.PI / 3), context.currentTime);
      
      osc.connect(gain);
      gain.connect(panner);
      panner.connect(context.destination);
      
      osc.start(context.currentTime);
      osc.stop(context.currentTime + 2);
      
      oscillators.push(osc);
    }
  }, []);
  
  // Timer logic with RequestAnimationFrame for smooth updates
  useEffect(() => {
    if (isActive && timeLeft > 0 && !showAlert) {
      let lastTime = performance.now();
      
      const animate = (currentTime: number) => {
        const deltaTime = currentTime - lastTime;
        
        if (deltaTime >= 1000) {
          setTimeLeft(prev => {
            if (prev <= 1) {
              triggerBreakAlert();
              return 0;
            }
            return prev - 1;
          });
          lastTime = currentTime;
        }
        
        animationFrameRef.current = requestAnimationFrame(animate);
      };
      
      animationFrameRef.current = requestAnimationFrame(animate);
      
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, [isActive, timeLeft, showAlert]);
  
  const triggerBreakAlert = useCallback(() => {
    setShowAlert(true);
    setIsActive(false);
    playQuantumSound();
    
    // Epic confetti with custom physics
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      colors: ['#00FFFF', '#FF00FF', '#FFFF00', '#00FF00', '#FF00FF'],
    };
    
    function fire(particleRatio: number, opts: any) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
        spread: 26,
        startVelocity: 55,
      });
    }
    
    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  }, [playQuantumSound]);
  
  const completeBreak = useCallback(() => {
    setStats(prev => ({
      ...prev,
      breaksTaken: prev.breaksTaken + 1,
      lastBreakTime: new Date(),
      streak: prev.streak + 1,
      experience: prev.experience + 100,
      level: Math.floor((prev.experience + 100) / 500) + 1,
      quantumState: 'collapsed',
    }));
    
    setShowAlert(false);
    setTimeLeft(20 * 60);
    setBreakTimeLeft(20);
    setIsActive(true);
  }, []);
  
  const toggleTimer = useCallback(() => setIsActive(prev => !prev), []);
  const resetTimer = useCallback(() => {
    setIsActive(false);
    setTimeLeft(20 * 60);
    setBreakTimeLeft(20);
    setShowAlert(false);
  }, []);
  
  const skipBreak = useCallback(() => {
    setStats(prev => ({ ...prev, streak: 0, quantumState: 'entangled' }));
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
  
  // Memoized gradient calculations
  const progressGradient = useMemo(() => {
    const progress = ((20 * 60 - timeLeft) / (20 * 60)) * 100;
    return `conic-gradient(from 0deg at 50% 50%, 
      #00ffff 0deg, 
      #ff00ff ${progress * 3.6}deg, 
      #111111 ${progress * 3.6}deg)`;
  }, [timeLeft]);
  
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Optimized Background Layers */}
      <MatrixRain />
      <QuantumField />
      <NeuralNetwork />
      
      {/* Holographic Scanlines */}
      <div className="fixed inset-0 z-3 pointer-events-none opacity-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500 to-transparent h-px animate-scan" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-magenta-500 to-transparent w-px animate-scan-horizontal" />
      </div>
      
      {/* Main Interface */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8">
        {/* Quantum Mode Selector */}
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-8 left-1/2 transform -translate-x-1/2 flex gap-2"
        >
          {(['quantum', 'neural', 'matrix', 'hyperdrive'] as const).map((m) => (
            <motion.button
              key={m}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setMode(m)}
              className={`px-4 py-2 rounded-full backdrop-blur-xl transition-all ${
                mode === m 
                  ? 'bg-cyan-500/30 border-2 border-cyan-400 shadow-[0_0_30px_rgba(0,255,255,0.5)]' 
                  : 'bg-white/5 border border-white/10 hover:bg-white/10'
              }`}
            >
              {m.toUpperCase()}
            </motion.button>
          ))}
        </motion.div>
        
        {/* Biometric Dashboard */}
        <div className="absolute top-24 left-8 space-y-4">
          <motion.div 
            className="backdrop-blur-xl bg-black/50 rounded-lg p-4 border border-cyan-500/30"
            animate={{ borderColor: ['rgba(0,255,255,0.3)', 'rgba(255,0,255,0.3)', 'rgba(0,255,255,0.3)'] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="flex items-center gap-3 mb-3">
              <Brain className="w-5 h-5 text-cyan-400" />
              <span className="text-xs uppercase tracking-wider">Neural Activity</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Focus</span>
                <span>{stats.focusLevel.toFixed(0)}%</span>
              </div>
              <div className="h-1 bg-black rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
                  animate={{ width: `${stats.focusLevel}%` }}
                />
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="backdrop-blur-xl bg-black/50 rounded-lg p-4 border border-magenta-500/30"
            animate={{ borderColor: ['rgba(255,0,255,0.3)', 'rgba(255,255,0,0.3)', 'rgba(255,0,255,0.3)'] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <Activity className="w-5 h-5 text-magenta-400" />
              <span className="text-xs uppercase tracking-wider">Vitals</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-400">Heart</span>
                <motion.div 
                  className="text-lg font-mono text-red-400"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 60 / stats.heartRate, repeat: Infinity }}
                >
                  {Math.round(stats.heartRate)}
                </motion.div>
              </div>
              <div>
                <span className="text-gray-400">Strain</span>
                <div className="text-lg font-mono text-yellow-400">
                  {stats.eyeStrain.toFixed(0)}%
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Quantum State Indicator */}
        <div className="absolute top-24 right-8">
          <motion.div 
            className="backdrop-blur-xl bg-black/50 rounded-lg p-4 border border-yellow-500/30"
            animate={{ 
              borderColor: ['rgba(255,255,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(255,255,0,0.3)'],
              boxShadow: [
                '0 0 20px rgba(255,255,0,0.3)',
                '0 0 40px rgba(0,255,0,0.5)',
                '0 0 20px rgba(255,255,0,0.3)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="flex items-center gap-3 mb-3">
              <Atom className="w-5 h-5 text-yellow-400 animate-spin-slow" />
              <span className="text-xs uppercase tracking-wider">Quantum State</span>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-green-400 bg-clip-text text-transparent">
                {stats.quantumState.toUpperCase()}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Dimension: {stats.dimension}D
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Main Timer - Ultra Futuristic */}
        <AnimatePresence mode="wait">
          {!showAlert ? (
            <motion.div
              key="timer"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              style={{ 
                perspective: 1000,
                transformStyle: 'preserve-3d',
                rotateX,
                rotateY,
              }}
              className="relative"
            >
              {/* Quantum Timer Ring */}
              <div className="relative w-96 h-96">
                <div 
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: progressGradient,
                    filter: 'blur(2px)',
                  }}
                />
                
                <motion.div 
                  className="absolute inset-2 rounded-full bg-black flex items-center justify-center"
                  animate={{
                    boxShadow: [
                      '0 0 50px rgba(0,255,255,0.5), inset 0 0 50px rgba(255,0,255,0.2)',
                      '0 0 100px rgba(255,0,255,0.5), inset 0 0 100px rgba(0,255,255,0.2)',
                      '0 0 50px rgba(0,255,255,0.5), inset 0 0 50px rgba(255,0,255,0.2)',
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <div className="text-center">
                    <motion.div 
                      className="text-8xl font-mono font-black"
                      style={{
                        textShadow: '0 0 40px currentColor',
                        background: 'linear-gradient(45deg, #00ffff, #ff00ff, #ffff00)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                      }}
                      animate={timeLeft <= 10 ? {
                        scale: [1, 1.2, 1],
                        filter: ['hue-rotate(0deg)', 'hue-rotate(360deg)'],
                      } : {}}
                      transition={{ duration: 1, repeat: timeLeft <= 10 ? Infinity : 0 }}
                    >
                      {formatTime(timeLeft)}
                    </motion.div>
                    
                    <motion.div 
                      className="mt-4 text-sm uppercase tracking-widest"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {isActive ? (
                        <span className="flex items-center justify-center gap-2 text-cyan-400">
                          <RadioActive className="w-5 h-5 animate-spin" />
                          QUANTUM ACTIVE
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2 text-gray-400">
                          <Orbit className="w-5 h-5" />
                          PAUSED IN TIME
                        </span>
                      )}
                    </motion.div>
                  </div>
                </motion.div>
                
                {/* Orbiting particles */}
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute w-4 h-4 rounded-full"
                    style={{
                      top: '50%',
                      left: '50%',
                      background: `radial-gradient(circle, ${['cyan', 'magenta', 'yellow'][i]} 0%, transparent 70%)`,
                      boxShadow: `0 0 20px ${['cyan', 'magenta', 'yellow'][i]}`,
                    }}
                    animate={{
                      x: [0, 150 * Math.cos(i * Math.PI * 2 / 3), 0],
                      y: [0, 150 * Math.sin(i * Math.PI * 2 / 3), 0],
                    }}
                    transition={{
                      duration: 3 + i,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                ))}
              </div>
              
              {/* Control Panel */}
              <div className="flex justify-center gap-4 mt-8">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(0,255,255,0.8)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleTimer}
                  className={`px-8 py-4 rounded-full font-bold text-lg backdrop-blur-xl border-2 transition-all ${
                    isActive
                      ? 'bg-red-500/20 border-red-400 text-red-400 shadow-[0_0_30px_rgba(255,0,0,0.5)]'
                      : 'bg-green-500/20 border-green-400 text-green-400 shadow-[0_0_30px_rgba(0,255,0,0.5)]'
                  }`}
                >
                  {isActive ? 'PAUSE REALITY' : 'START QUANTUM'}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(255,255,255,0.8)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetTimer}
                  className="px-8 py-4 rounded-full font-bold text-lg backdrop-blur-xl bg-white/10 border-2 border-white/30 text-white/80"
                >
                  RESET TIMELINE
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="break"
              initial={{ scale: 0, rotate: 720 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: -720 }}
              className="text-center"
            >
              <motion.div
                className="text-9xl mb-8"
                animate={{ 
                  scale: [1, 1.5, 1],
                  rotate: [0, 180, 360],
                  filter: ['hue-rotate(0deg)', 'hue-rotate(180deg)', 'hue-rotate(360deg)']
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                👁️‍🗨️
              </motion.div>
              
              <h2 className="text-6xl font-black mb-6 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent"
                  style={{ textShadow: '0 0 60px rgba(0,255,0,0.5)' }}>
                QUANTUM BREAK
              </h2>
              
              <motion.div 
                className="text-9xl font-mono font-black mb-8"
                style={{
                  textShadow: '0 0 80px rgba(0,255,0,0.8)',
                  color: '#00ff00',
                }}
                animate={{ 
                  scale: [1, 1.3, 1],
                  textShadow: [
                    '0 0 80px rgba(0,255,0,0.8)',
                    '0 0 120px rgba(0,255,255,1)',
                    '0 0 80px rgba(0,255,0,0.8)',
                  ]
                }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {breakTimeLeft}
              </motion.div>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={skipBreak}
                className="px-8 py-4 rounded-full font-bold text-lg backdrop-blur-xl bg-red-500/20 border-2 border-red-400 text-red-400"
              >
                SKIP QUANTUM STATE ⚠️
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* XP and Level Display */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-96"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="backdrop-blur-xl bg-black/50 rounded-lg p-4 border border-purple-500/30">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm uppercase tracking-wider text-purple-400">
                Level {stats.level} Quantum Master
              </span>
              <span className="text-xs text-gray-400">
                {stats.experience} / {stats.level * 500} XP
              </span>
            </div>
            <div className="h-2 bg-black/50 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                animate={{ width: `${(stats.experience / (stats.level * 500)) * 100}%` }}
                transition={{ type: 'spring', stiffness: 100 }}
              />
            </div>
          </div>
        </motion.div>
      </div>
      
      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(-100vh); }
          100% { transform: translateY(100vh); }
        }
        @keyframes scan-horizontal {
          0% { transform: translateX(-100vw); }
          100% { transform: translateX(100vw); }
        }
        .animate-scan {
          animation: scan 4s linear infinite;
        }
        .animate-scan-horizontal {
          animation: scan-horizontal 6s linear infinite;
        }
        .animate-spin-slow {
          animation: spin 4s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}