'use client';

import { useState, useEffect, useCallback, useRef, memo, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring, useAnimation } from 'framer-motion';
// import * as tf from '@tensorflow/tfjs';  // Temporarily disabled for performance
// import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';  // Temporarily disabled for performance
import * as Tone from 'tone';
import confetti from 'canvas-confetti';
import { 
  Zap, Brain, Cpu, Wifi, Activity, HeartHandshake, Dna, Binary,
  GitBranch, Layers, Network, Sparkles, Orbit, Atom, Fingerprint,
  ThermometerSun, Wind, Gauge, BrainCircuit, CircuitBoard, Eye,
  Skull, Flame, Radio, Satellite, Gamepad2, Medal, Trophy,
  Crown, Diamond, Gem, Star, Heart, Shield, Swords, Bomb,
  Rocket, Zap as Lightning, Power, Battery, BatteryCharging, Signal,
  WifiOff, Globe, Map, Navigation, Compass, Target, Crosshair
} from 'lucide-react';

// WebGL Fragment Shader for Ultimate Background
const SHADER_FRAGMENT = `
  precision highp float;
  uniform float time;
  uniform vec2 resolution;
  uniform vec2 mouse;
  
  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }
  
  float noise(vec2 p) {
    return sin(p.x * 10.0) * sin(p.y * 10.0);
  }
  
  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
    
    float t = time * 0.5;
    
    // Quantum field distortion
    for(int i = 0; i < 5; i++) {
      float fi = float(i);
      p = abs(p) / dot(p, p) - vec2(cos(t + fi), sin(t + fi * 0.5));
    }
    
    vec3 col = hsv2rgb(vec3(
      atan(p.y, p.x) / 6.28 + t * 0.1,
      length(p) * 0.5,
      1.0 - length(p) * 0.2
    ));
    
    // Neural network overlay
    col += vec3(noise(p * 10.0 + t)) * 0.2;
    
    // Glitch effect
    if (mod(time, 10.0) > 9.5) {
      col = 1.0 - col;
    }
    
    gl_FragColor = vec4(col, 1.0);
  }
`;

// WebGL Shader Renderer
const ShaderCanvas = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const gl = canvas.getContext('webgl2', {
      antialias: false,
      powerPreference: 'high-performance',
    });
    if (!gl) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Vertex shader
    const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vertexShader, `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `);
    gl.compileShader(vertexShader);
    
    // Fragment shader
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fragmentShader, SHADER_FRAGMENT);
    gl.compileShader(fragmentShader);
    
    // Program
    const program = gl.createProgram()!;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);
    
    // Geometry
    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    
    const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    
    // Uniforms
    const timeLocation = gl.getUniformLocation(program, 'time');
    const resolutionLocation = gl.getUniformLocation(program, 'resolution');
    const mouseLocation = gl.getUniformLocation(program, 'mouse');
    
    let mouseX = 0, mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX / window.innerWidth;
      mouseY = 1 - e.clientY / window.innerHeight;
    };
    window.addEventListener('mousemove', handleMouseMove);
    
    const render = (time: number) => {
      gl.viewport(0, 0, canvas.width, canvas.height);
      
      gl.uniform1f(timeLocation, time * 0.001);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform2f(mouseLocation, mouseX, mouseY);
      
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      
      animationRef.current = requestAnimationFrame(render);
    };
    
    render(0);
    
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return <canvas ref={canvasRef} className="fixed inset-0 z-0" />;
});

ShaderCanvas.displayName = 'ShaderCanvas';

// AI Face Detection System (Simplified)
const FaceDetector = memo(({ onBlink }: { onBlink: () => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    const setupCamera = async () => {
      try {
        const video = videoRef.current;
        if (!video) return;
        
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
          audio: false,
        });
        
        video.srcObject = stream;
        await video.play();
        
        // Simulate blink detection with random intervals
        const blinkInterval = setInterval(() => {
          if (Math.random() > 0.8) {
            onBlink();
          }
        }, 3000);
        
        return () => clearInterval(blinkInterval);
      } catch (error) {
        console.log('Camera access denied or not available');
      }
    };
    
    setupCamera();
    
    return () => {
      const video = videoRef.current;
      if (video && video.srcObject) {
        (video.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
    };
  }, [onBlink]);
  
  return (
    <video 
      ref={videoRef} 
      className="fixed top-4 right-4 w-32 h-24 rounded-xl border-2 border-cyan-500 z-50 object-cover"
      style={{ transform: 'scaleX(-1)' }}
    />
  );
});

FaceDetector.displayName = 'FaceDetector';

// Quantum Audio Synthesizer
class QuantumSynth {
  private synth: Tone.PolySynth;
  private reverb: Tone.Reverb;
  private delay: Tone.FeedbackDelay;
  private distortion: Tone.Distortion;
  
  constructor() {
    this.synth = new Tone.PolySynth(Tone.Synth).toDestination();
    this.reverb = new Tone.Reverb(4).toDestination();
    this.delay = new Tone.FeedbackDelay(0.25, 0.5).toDestination();
    this.distortion = new Tone.Distortion(0.8).toDestination();
    
    this.synth.connect(this.reverb);
    this.synth.connect(this.delay);
    
    this.synth.set({
      oscillator: { type: 'sawtooth' },
      envelope: {
        attack: 0.005,
        decay: 0.1,
        sustain: 0.3,
        release: 1,
      },
    });
  }
  
  playQuantumChord() {
    const now = Tone.now();
    const notes = ['C4', 'E4', 'G4', 'B4', 'D5', 'F#5'];
    
    notes.forEach((note, i) => {
      this.synth.triggerAttackRelease(note, '8n', now + i * 0.1);
    });
  }
  
  playGlitchSequence() {
    const pattern = new Tone.Pattern((time, note) => {
      this.synth.triggerAttackRelease(note, 0.1, time);
    }, ['C2', 'E2', 'G2', 'C3', 'G2', 'E2'], 'random');
    
    pattern.start(0);
    Tone.Transport.start();
    
    setTimeout(() => {
      pattern.stop();
      Tone.Transport.stop();
    }, 2000);
  }
  
  playBinaural(frequency: number) {
    const oscL = new Tone.Oscillator(frequency, 'sine').toDestination();
    const oscR = new Tone.Oscillator(frequency + 7.83, 'sine').toDestination(); // Schumann resonance
    
    oscL.volume.value = -20;
    oscR.volume.value = -20;
    
    const pannerL = new Tone.Panner(-1).toDestination();
    const pannerR = new Tone.Panner(1).toDestination();
    
    oscL.connect(pannerL);
    oscR.connect(pannerR);
    
    oscL.start();
    oscR.start();
    
    setTimeout(() => {
      oscL.stop();
      oscR.stop();
    }, 5000);
  }
}

// Main Component
export default function EyeCareApocalypse() {
  const [timeLeft, setTimeLeft] = useState(20 * 60);
  const [isActive, setIsActive] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [breakTimeLeft, setBreakTimeLeft] = useState(20);
  const [dimension, setDimension] = useState(3);
  const [realityLevel, setRealityLevel] = useState(100);
  const [quantumEntanglement, setQuantumEntanglement] = useState(0);
  const [apocalypseMode, setApocalypseMode] = useState(false);
  const [blinkCount, setBlinkCount] = useState(0);
  const [showFaceDetection, setShowFaceDetection] = useState(false);
  
  const synthRef = useRef<QuantumSynth | null>(null);
  const controls = useAnimation();
  
  // 3D Mouse Parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const mouseZ = useMotionValue(0);
  
  const rotateX = useTransform(mouseY, [-500, 500], [60, -60]);
  const rotateY = useTransform(mouseX, [-500, 500], [-60, 60]);
  const rotateZ = useTransform(mouseZ, [0, 100], [0, 360]);
  
  const springConfig = { stiffness: 100, damping: 10 };
  const springX = useSpring(rotateX, springConfig);
  const springY = useSpring(rotateY, springConfig);
  const springZ = useSpring(rotateZ, springConfig);
  
  // Initialize Quantum Audio
  useEffect(() => {
    synthRef.current = new QuantumSynth();
    
    return () => {
      Tone.Transport.stop();
      Tone.Transport.cancel();
    };
  }, []);
  
  // Mouse tracking in 3D space
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
      mouseZ.set(Math.sqrt(Math.pow(e.clientX - window.innerWidth / 2, 2) + 
                           Math.pow(e.clientY - window.innerHeight / 2, 2)) / 10);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY, mouseZ]);
  
  // Reality Distortion Field
  useEffect(() => {
    const interval = setInterval(() => {
      setRealityLevel(prev => {
        const next = prev + (Math.random() - 0.5) * 10;
        return Math.max(0, Math.min(100, next));
      });
      
      setQuantumEntanglement(prev => {
        const next = prev + (Math.random() - 0.3) * 20;
        return Math.max(0, Math.min(100, next));
      });
      
      if (Math.random() > 0.95) {
        setDimension(prev => prev === 3 ? 4 : prev === 4 ? 5 : 3);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Apocalypse Timer
  useEffect(() => {
    if (isActive && timeLeft > 0 && !showAlert) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            triggerApocalypse();
            return 0;
          }
          
          // Quantum time dilation
          const timeDilation = apocalypseMode ? 2 : 1;
          return prev - timeDilation;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [isActive, timeLeft, showAlert, apocalypseMode]);
  
  const triggerApocalypse = useCallback(() => {
    setShowAlert(true);
    setIsActive(false);
    setApocalypseMode(true);
    
    // Epic sound explosion
    if (synthRef.current) {
      synthRef.current.playGlitchSequence();
      synthRef.current.playQuantumChord();
      synthRef.current.playBinaural(432);
    }
    
    // Screen shake
    controls.start({
      x: [0, -20, 20, -20, 20, 0],
      y: [0, -20, 20, -20, 20, 0],
      rotate: [0, -5, 5, -5, 5, 0],
      transition: { duration: 0.5 },
    });
    
    // Confetti nuclear explosion
    const end = Date.now() + 5000;
    const colors = ['#00ffff', '#ff00ff', '#ffff00', '#ff0000', '#00ff00'];
    
    (function frame() {
      confetti({
        particleCount: 10,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 10,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });
      
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
    
    // Trigger browser notifications
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('⚠️ REALITY BREACH DETECTED ⚠️', {
        body: 'Your eyes have transcended space-time. Look away from all screens immediately.',
        icon: '/icon.png',
        requireInteraction: true,
      });
    }
  }, [controls]);
  
  const handleBlink = useCallback(() => {
    setBlinkCount(prev => prev + 1);
    
    if (blinkCount > 10) {
      // Reward for healthy blinking
      confetti({
        particleCount: 30,
        spread: 360,
        origin: { x: 0.5, y: 0.5 },
        colors: ['#00ff00'],
      });
    }
  }, [blinkCount]);
  
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (apocalypseMode) {
      // Glitch text
      return `${String(hours).padStart(2, '0').split('').map(c => 
        Math.random() > 0.7 ? '█' : c
      ).join('')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };
  
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* WebGL Shader Background */}
      <ShaderCanvas />
      
      {/* AI Face Detection */}
      {showFaceDetection && <FaceDetector onBlink={handleBlink} />}
      
      {/* Reality Distortion Overlay */}
      <div 
        className="fixed inset-0 z-1 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, 
            transparent ${realityLevel}%, 
            rgba(255,0,255,0.3) ${realityLevel + 20}%,
            rgba(0,255,255,0.3) 100%)`,
          filter: `hue-rotate(${quantumEntanglement * 3.6}deg)`,
        }}
      />
      
      {/* Glitch Lines */}
      <div className="fixed inset-0 z-2 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-full h-px bg-cyan-500"
            style={{ top: `${i * 5}%` }}
            animate={{
              opacity: [0, 1, 0],
              scaleX: [0, 1, 0],
              x: [-100, 100],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      
      {/* Main Interface */}
      <motion.div 
        animate={controls}
        className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8"
      >
        {/* Apocalypse Status Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-black">
          <motion.div
            className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-cyan-500"
            animate={{
              width: `${(timeLeft / (20 * 60)) * 100}%`,
              opacity: [1, 0.5, 1],
            }}
            transition={{ opacity: { duration: 1, repeat: Infinity } }}
          />
        </div>
        
        {/* Multi-Dimensional Control Panel */}
        <div className="absolute top-8 left-8 space-y-4">
          <motion.div
            className="backdrop-blur-xl bg-black/70 rounded-xl p-4 border border-cyan-500"
            animate={{
              borderColor: ['#00ffff', '#ff00ff', '#ffff00', '#00ffff'],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <h3 className="text-xs uppercase tracking-widest mb-2 text-cyan-400">
              Dimension Controller
            </h3>
            <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              {dimension}D
            </div>
            <div className="mt-2 flex gap-1">
              {[3, 4, 5, 6, 7].map(d => (
                <button
                  key={d}
                  onClick={() => setDimension(d)}
                  className={`w-8 h-8 rounded ${
                    dimension === d ? 'bg-cyan-500' : 'bg-gray-800'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            className="backdrop-blur-xl bg-black/70 rounded-xl p-4 border border-magenta-500"
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 1, -1, 0],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <h3 className="text-xs uppercase tracking-widest mb-2 text-magenta-400">
              Reality Stability
            </h3>
            <div className="relative h-32 w-32">
              <svg className="absolute inset-0" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="rgba(255,0,255,0.2)"
                  strokeWidth="2"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="url(#reality-gradient)"
                  strokeWidth="4"
                  strokeDasharray={`${realityLevel * 2.83} 283`}
                  strokeLinecap="round"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                />
                <defs>
                  <linearGradient id="reality-gradient">
                    <stop offset="0%" stopColor="#ff00ff" />
                    <stop offset="50%" stopColor="#00ffff" />
                    <stop offset="100%" stopColor="#ffff00" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">{realityLevel}%</span>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Right Side - Biometric Apocalypse Panel */}
        <div className="absolute top-8 right-8 space-y-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowFaceDetection(!showFaceDetection)}
            className="p-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold"
          >
            {showFaceDetection ? 'DISABLE' : 'ENABLE'} AI VISION
          </motion.button>
          
          {showFaceDetection && (
            <div className="backdrop-blur-xl bg-black/70 rounded-xl p-4 border border-green-500">
              <h3 className="text-xs uppercase tracking-widest mb-2 text-green-400">
                Blink Counter
              </h3>
              <div className="text-3xl font-bold text-green-400">
                {blinkCount} blinks
              </div>
            </div>
          )}
          
          <motion.div
            className="backdrop-blur-xl bg-black/70 rounded-xl p-4 border border-yellow-500"
            animate={{
              boxShadow: [
                '0 0 20px rgba(255,255,0,0.5)',
                '0 0 40px rgba(255,0,0,0.5)',
                '0 0 20px rgba(0,255,0,0.5)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <h3 className="text-xs uppercase tracking-widest mb-2 text-yellow-400">
              Quantum Entanglement
            </h3>
            <div className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-red-400 bg-clip-text text-transparent">
              {quantumEntanglement.toFixed(1)}%
            </div>
          </motion.div>
        </div>
        
        {/* MAIN TIMER - THE APOCALYPSE CLOCK */}
        <AnimatePresence mode="wait">
          {!showAlert ? (
            <motion.div
              key="timer"
              initial={{ scale: 0, rotate: -720 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 720 }}
              style={{
                perspective: 2000,
                transformStyle: 'preserve-3d',
                rotateX: springX,
                rotateY: springY,
                rotateZ: springZ,
              }}
              className="relative"
            >
              <div className="relative w-[500px] h-[500px]">
                {/* Multiple rotating rings */}
                {[0, 1, 2, 3].map(ring => (
                  <motion.div
                    key={ring}
                    className="absolute inset-0 rounded-full border-4"
                    style={{
                      borderColor: ['#00ffff', '#ff00ff', '#ffff00', '#00ff00'][ring],
                      borderStyle: 'dashed',
                      transform: `scale(${1 - ring * 0.15})`,
                    }}
                    animate={{
                      rotate: ring % 2 === 0 ? 360 : -360,
                    }}
                    transition={{
                      duration: 10 + ring * 5,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                ))}
                
                {/* Central Timer Display */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <motion.div
                      className="text-9xl font-black"
                      style={{
                        textShadow: `
                          0 0 20px rgba(0,255,255,0.8),
                          0 0 40px rgba(255,0,255,0.8),
                          0 0 60px rgba(255,255,0,0.8),
                          0 0 80px rgba(255,0,0,0.8)
                        `,
                        background: apocalypseMode 
                          ? 'linear-gradient(45deg, #ff0000, #ff00ff, #0000ff, #00ffff, #00ff00, #ffff00, #ff0000)'
                          : 'linear-gradient(45deg, #00ffff, #ff00ff, #ffff00)',
                        backgroundSize: apocalypseMode ? '400% 400%' : '200% 200%',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                        animation: apocalypseMode ? 'rainbow 1s linear infinite' : 'gradient 3s ease infinite',
                      }}
                      animate={timeLeft <= 30 ? {
                        scale: [1, 1.1, 1],
                        filter: [
                          'blur(0px)',
                          'blur(2px)',
                          'blur(0px)',
                        ],
                      } : {}}
                      transition={{ duration: 0.5, repeat: timeLeft <= 30 ? Infinity : 0 }}
                    >
                      {formatTime(timeLeft)}
                    </motion.div>
                    
                    <motion.div
                      className="mt-4 text-xl uppercase tracking-[0.3em] font-bold"
                      animate={{
                        opacity: [0.5, 1, 0.5],
                        letterSpacing: ['0.3em', '0.5em', '0.3em'],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {isActive ? (
                        <span className="text-red-500">
                          <Flame className="inline w-6 h-6 animate-pulse" />
                          {' '}REALITY BURNING{' '}
                          <Flame className="inline w-6 h-6 animate-pulse" />
                        </span>
                      ) : (
                        <span className="text-cyan-400">
                          <Skull className="inline w-6 h-6" />
                          {' '}TEMPORAL FREEZE{' '}
                          <Skull className="inline w-6 h-6" />
                        </span>
                      )}
                    </motion.div>
                  </div>
                </div>
                
                {/* Orbiting Icons */}
                {[Atom, Brain, Rocket, Diamond, Lightning, Star].map((Icon, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-12 h-12 flex items-center justify-center"
                    style={{
                      top: '50%',
                      left: '50%',
                      marginTop: -24,
                      marginLeft: -24,
                    }}
                    animate={{
                      x: [
                        0,
                        200 * Math.cos(i * Math.PI / 3),
                        200 * Math.cos(i * Math.PI / 3 + Math.PI),
                        0,
                      ],
                      y: [
                        0,
                        200 * Math.sin(i * Math.PI / 3),
                        200 * Math.sin(i * Math.PI / 3 + Math.PI),
                        0,
                      ],
                    }}
                    transition={{
                      duration: 5 + i,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  >
                    <Icon className="w-8 h-8 text-cyan-400" />
                  </motion.div>
                ))}
              </div>
              
              {/* ULTIMATE CONTROL PANEL */}
              <div className="flex justify-center gap-6 mt-12">
                <motion.button
                  whileHover={{ 
                    scale: 1.1,
                    boxShadow: '0 0 50px rgba(0,255,255,0.8)',
                  }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setIsActive(!isActive);
                    if (synthRef.current) {
                      synthRef.current.playQuantumChord();
                    }
                  }}
                  className={`px-12 py-6 rounded-full font-black text-2xl backdrop-blur-xl border-4 ${
                    isActive
                      ? 'bg-red-900/50 border-red-500 text-red-300'
                      : 'bg-green-900/50 border-green-500 text-green-300'
                  }`}
                  style={{
                    boxShadow: isActive 
                      ? '0 0 30px rgba(255,0,0,0.5), inset 0 0 30px rgba(255,0,0,0.3)'
                      : '0 0 30px rgba(0,255,0,0.5), inset 0 0 30px rgba(0,255,0,0.3)',
                  }}
                >
                  {isActive ? 'CEASE REALITY' : 'IGNITE COSMOS'}
                </motion.button>
                
                <motion.button
                  whileHover={{ 
                    scale: 1.1,
                    boxShadow: '0 0 50px rgba(255,255,255,0.8)',
                  }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setTimeLeft(20 * 60);
                    setIsActive(false);
                    setShowAlert(false);
                    setApocalypseMode(false);
                    setDimension(3);
                    setRealityLevel(100);
                    setQuantumEntanglement(0);
                  }}
                  className="px-12 py-6 rounded-full font-black text-2xl backdrop-blur-xl bg-purple-900/50 border-4 border-purple-500 text-purple-300"
                  style={{
                    boxShadow: '0 0 30px rgba(147,51,234,0.5), inset 0 0 30px rgba(147,51,234,0.3)',
                  }}
                >
                  RESET UNIVERSE
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="break"
              initial={{ scale: 0, filter: 'blur(20px)' }}
              animate={{ scale: 1, filter: 'blur(0px)' }}
              exit={{ scale: 0, filter: 'blur(20px)' }}
              className="text-center"
            >
              <motion.div
                className="text-[200px] mb-8"
                animate={{
                  scale: [1, 2, 1],
                  rotate: [0, 360, 720],
                  filter: [
                    'hue-rotate(0deg) saturate(100%)',
                    'hue-rotate(180deg) saturate(200%)',
                    'hue-rotate(360deg) saturate(100%)',
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                💀
              </motion.div>
              
              <motion.h2 
                className="text-8xl font-black mb-8"
                style={{
                  background: 'linear-gradient(45deg, #ff0000, #ff00ff, #0000ff, #00ffff, #00ff00, #ffff00, #ff0000)',
                  backgroundSize: '400% 400%',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  animation: 'rainbow 1s linear infinite',
                  textShadow: '0 0 100px rgba(255,0,0,0.8)',
                }}
              >
                APOCALYPSE BREAK
              </motion.h2>
              
              <motion.div
                className="text-[150px] font-black mb-12"
                style={{
                  color: '#00ff00',
                  textShadow: `
                    0 0 30px rgba(0,255,0,0.8),
                    0 0 60px rgba(0,255,0,0.6),
                    0 0 90px rgba(0,255,0,0.4),
                    0 0 120px rgba(0,255,0,0.2)
                  `,
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [1, 0.5, 1],
                }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {breakTimeLeft}
              </motion.div>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setShowAlert(false);
                  setTimeLeft(20 * 60);
                  setBreakTimeLeft(20);
                  setIsActive(true);
                  setApocalypseMode(false);
                }}
                className="px-12 py-6 rounded-full font-black text-2xl backdrop-blur-xl bg-red-900/50 border-4 border-red-500 text-red-300"
                style={{
                  boxShadow: '0 0 50px rgba(255,0,0,0.8)',
                }}
              >
                REJECT SALVATION ☠️
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Bottom Status Bar */}
        <div className="absolute bottom-8 left-8 right-8 flex justify-between items-center">
          <div className="flex gap-4">
            {[
              { icon: Trophy, label: 'KILLS', value: Math.floor(Math.random() * 9999) },
              { icon: Diamond, label: 'GEMS', value: Math.floor(Math.random() * 999) },
              { icon: Flame, label: 'STREAK', value: Math.floor(Math.random() * 99) },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="backdrop-blur-xl bg-black/70 rounded-lg px-4 py-2 border border-cyan-500/50">
                <div className="flex items-center gap-2">
                  <Icon className="w-5 h-5 text-cyan-400" />
                  <span className="text-xs uppercase tracking-wider text-gray-400">{label}</span>
                  <span className="text-xl font-bold text-cyan-400">{value}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-xs uppercase tracking-[0.3em] text-gray-500">
            DIMENSION: {dimension}D | REALITY: {realityLevel}% | ENTANGLEMENT: {quantumEntanglement.toFixed(1)}%
          </div>
        </div>
      </motion.div>
      
      <style jsx>{`
        @keyframes rainbow {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}