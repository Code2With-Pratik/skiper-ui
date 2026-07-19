"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence, type Transition } from "framer-motion"
import { useBatteryMonitor } from "../hooks/useBatteryMonitor"
import { 
  BellOff, Pause, Play, X, Radio, Circle, Square, 
  Phone, FastForward, Rewind, ScanFace, Unlock, CreditCard, 
  CheckCircle2, Loader2 
} from "lucide-react"

type IslandState = "idle" | "silent" | "music" | "phone" | "lowBattery" | "timer" | "airdrop" | "screenRecord" | "findMy" | "faceId" | "applePay"

// TIGHTENED PHYSICS: Removed the crazy bounce, increased damping to stop the "stretching"
const islandTransition: Transition = { type: "spring", stiffness: 350, damping: 32, mass: 1 }

// Smoother fade-in/out for the contents
const bouncyAnimation: { initial: any; animate: any; exit: any; transition: Transition } = {
  initial: { opacity: 0, scale: 0.95, filter: "blur(2px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, scale: 0.95, filter: "blur(2px)" },
  transition: { type: "spring", stiffness: 400, damping: 30 }
}

// Helper for formatting mm:ss
const formatTime = (totalSeconds: number) => {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s < 10 ? "0" : ""}${s}`;
};

export default function DynamicIsland() {
  const [islandState, setIslandState] = useState<IslandState>("idle")

  useBatteryMonitor()

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center gap-4 font-sans pointer-events-none">
      
      {/* THE ISLAND */}
      <motion.div
        layout
        transition={islandTransition}
        className="bg-black overflow-hidden shadow-2xl flex items-center justify-center border border-zinc-800/50 pointer-events-auto"
        style={{ borderRadius: 32 }}
      >
        <AnimatePresence mode="popLayout">
          {islandState === "idle" && <IdleState key="idle" />}
          {islandState === "silent" && <SilentState key="silent" />}
          {islandState === "music" && <MusicState key="music" />}
          {islandState === "phone" && <PhoneState key="phone" />}
          {islandState === "lowBattery" && <LowBatteryState key="lowBattery" />}
          {islandState === "findMy" && <FindMyState key="findMy" />}
          {islandState === "timer" && <TimerState key="timer" setIslandState={setIslandState} />}
          {islandState === "airdrop" && <AirDropState key="airdrop" setIslandState={setIslandState} />}
          {islandState === "screenRecord" && <ScreenRecordState key="screenRecord" setIslandState={setIslandState} />}
          {islandState === "faceId" && <FaceIdState key="faceId" setIslandState={setIslandState} />}
          {islandState === "applePay" && <ApplePayState key="applePay" setIslandState={setIslandState} />}
        </AnimatePresence>
      </motion.div>

      {/* TEST CONTROLS - (Make sure pointer-events-auto is on this wrapper so you can click it!) */}
      <div className="flex gap-2 flex-wrap justify-center max-w-[80vw] bg-black/50 backdrop-blur-md p-2 rounded-xl mt-4 pointer-events-auto">
        {["idle", "silent", "music", "phone", "lowBattery", "timer", "airdrop", "screenRecord", "findMy", "faceId", "applePay"].map((state) => (
          <button 
            key={state}
            onClick={() => setIslandState(state as IslandState)} 
            className={`px-3 py-1.5 text-xs text-white rounded-lg hover:bg-zinc-700 hover:scale-105 active:scale-95 transition-all cursor-pointer capitalize ${islandState === state ? "bg-zinc-600" : "bg-zinc-800/80"}`}
          >
            {state}
          </button>
        ))}
      </div>
    </div>
  )
}

// ==========================================
// FULLY UPGRADED ISLAND STATES
// ==========================================

function IdleState() {
  return <motion.div {...bouncyAnimation} className="w-[120px] h-[35px]" />
}

function SilentState() {
  return (
    <motion.div {...bouncyAnimation} className="w-[300px] h-[40px] flex items-center justify-between px-2 cursor-pointer">
      <div className="bg-[#FF453A] rounded-full px-3 py-1 flex items-center justify-center">
        {/* Added shaking animation to the bell */}
        <motion.div 
          animate={{ rotate: [0, -20, 20, -15, 15, 0] }} 
          transition={{ duration: 0.6, ease: "easeInOut", delay: 0.1 }}
        >
          <BellOff size={16} className="text-white" strokeWidth={2.5} />
        </motion.div>
      </div>
      <span className="text-[#FF453A] font-medium pr-3 tracking-wide">Silent</span>
    </motion.div>
  )
}

function MusicState() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(15); // Start at 15%

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      // Moves the timeline progress bar forward
      interval = setInterval(() => setProgress(p => (p < 100 ? p + 0.5 : 0)), 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <motion.div {...bouncyAnimation} className="w-[350px] p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center cursor-pointer">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#FF7A7A] to-[#8FA8FF] shadow-inner" />
          <div className="flex flex-col">
            <span className="text-white font-medium leading-tight">Glow</span>
            <span className="text-white font-medium leading-tight">Echo</span>
          </div>
        </div>
        <div className="flex gap-[2px] items-center h-4">
          {[1, 3, 2, 4, 2].map((height, i) => (
            <motion.div
              key={i}
              animate={isPlaying ? { height: [`${height * 20}%`, "100%", `${height * 20}%`] } : { height: "20%" }}
              transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.1 }}
              className="w-1 bg-[#4A90E2] rounded-full"
            />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs text-zinc-400 font-medium">
        <span>0:07</span>
        {/* Animated Music Timeline */}
        <div className="flex-1 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-white rounded-full" 
            animate={{ width: `${progress}%` }} 
            transition={{ ease: "linear", duration: 1 }}
          />
        </div>
        <span>-01:53</span>
      </div>

      <div className="flex justify-center gap-8 items-center text-white pb-1">
        <Rewind size={24} className="fill-white cursor-pointer hover:opacity-80 active:scale-90 transition-all" />
        <button onClick={() => setIsPlaying(!isPlaying)} className="focus:outline-none">
          {isPlaying ? (
            <Pause size={28} className="fill-white cursor-pointer hover:opacity-80 active:scale-90 transition-all" />
          ) : (
            <Play size={28} className="fill-white cursor-pointer hover:opacity-80 active:scale-90 transition-all" />
          )}
        </button>
        <FastForward size={24} className="fill-white cursor-pointer hover:opacity-80 active:scale-90 transition-all" />
      </div>
    </motion.div>
  )
}

function LowBatteryState() {
  return (
    <motion.div {...bouncyAnimation} className="w-[300px] h-[40px] flex items-center justify-between px-4 cursor-pointer">
      <span className="text-white font-medium tracking-wide">Low Battery</span>
      <div className="flex items-center gap-2">
        <span className="text-[#FF453A] font-medium">20%</span>
        {/* Custom Built Battery to show exact 20% fill perfectly */}
        <div className="relative flex items-center">
          <div className="w-7 h-[14px] border border-zinc-500 rounded-[4px] p-[1.5px] flex items-center">
            <div className="bg-[#FF453A] w-[20%] h-full rounded-[1px]" />
          </div>
          <div className="w-[2px] h-[5px] bg-zinc-500 rounded-r-sm -ml-[1px] z-0" />
        </div>
      </div>
    </motion.div>
  )
}

function FindMyState() {
  return (
    <motion.div {...bouncyAnimation} className="w-[300px] h-[40px] flex items-center px-2 gap-3 cursor-pointer">
      {/* Radar Animation Setup */}
      <div className="w-8 h-8 flex items-center justify-center relative">
        <motion.div 
          animate={{ scale: [1, 2.5], opacity: [0.6, 0] }} 
          transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }} 
          className="absolute w-full h-full bg-[#34C759] rounded-full" 
        />
        <motion.div 
          animate={{ scale: [1, 2.5], opacity: [0.6, 0] }} 
          transition={{ repeat: Infinity, duration: 2, ease: "easeOut", delay: 1 }} 
          className="absolute w-full h-full bg-[#34C759] rounded-full" 
        />
        <div className="w-8 h-8 rounded-full bg-[#34C759] flex items-center justify-center relative z-10 shadow-[0_0_10px_rgba(52,199,89,0.5)]">
          <div className="w-3 h-3 rounded-full bg-[#A4F2B8]"></div>
        </div>
      </div>
      <span className="text-white font-medium text-sm">Find My iphone gxuri</span>
    </motion.div>
  )
}

function PhoneState() {
  const [seconds, setSeconds] = useState(2);
  
  useEffect(() => {
    const interval = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div {...bouncyAnimation} className="w-[300px] h-[40px] flex items-center justify-between px-4 cursor-pointer">
      <div className="flex items-center gap-2">
        <Phone size={16} className="text-[#34C759] fill-[#34C759]" />
        <span className="text-[#34C759] font-medium tracking-wide">{formatTime(seconds)}</span>
      </div>
      <div className="flex gap-[2px] items-center h-4">
        {[1, 3, 2, 4, 3, 2, 1].map((height, i) => (
          <motion.div
            key={i}
            animate={{ height: [`${height * 20}%`, "100%", `${height * 20}%`] }}
            transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
            className="w-[2.5px] bg-[#34C759] rounded-full"
          />
        ))}
      </div>
    </motion.div>
  )
}

function TimerState({ setIslandState }: { setIslandState: (s: IslandState) => void }) {
  const [seconds, setSeconds] = useState(59);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval: any;
    if (isActive && seconds > 0) {
      interval = setInterval(() => setSeconds(s => s - 1), 1000);
    } else if (seconds === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  return (
    <motion.div {...bouncyAnimation} className="w-[300px] h-[40px] flex items-center justify-between px-2">
      <div className="flex gap-2">
        <button 
          onClick={() => setIsActive(!isActive)}
          className="w-8 h-8 rounded-full bg-[#3B2C00] flex items-center justify-center cursor-pointer hover:bg-[#4A3700] active:scale-90 transition-all"
        >
          {isActive ? <Pause size={16} className="text-[#F9A825] fill-[#F9A825]" /> : <Play size={16} className="text-[#F9A825] fill-[#F9A825]" />}
        </button>
        <button 
          onClick={() => setIslandState("idle")}
          className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center cursor-pointer hover:bg-zinc-700 active:scale-90 transition-all"
        >
          <X size={16} className="text-zinc-300" />
        </button>
      </div>
      <div className="flex items-center gap-2 pr-2 cursor-pointer">
        <span className="text-[#F9A825] text-sm font-medium">Timer</span>
        <span className="text-[#F9A825] text-xl font-light tracking-tight">{formatTime(seconds)}</span>
      </div>
    </motion.div>
  )
}

function ScreenRecordState({ setIslandState }: { setIslandState: (s: IslandState) => void }) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div {...bouncyAnimation} className="w-[300px] h-[45px] flex items-center justify-between px-4">
      <div className="flex flex-col cursor-pointer">
        <div className="flex items-center gap-1.5">
          <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
            <Circle size={8} className="fill-[#FF453A] text-[#FF453A]" />
          </motion.div>
          <span className="text-[#FF453A] text-xs font-medium">{formatTime(seconds)}</span>
        </div>
        <span className="text-white text-sm font-medium leading-tight whitespace-nowrap">Screen Recording</span>
      </div>
      <button 
        onClick={() => setIslandState("idle")}
        className="w-8 h-8 rounded-full border-2 border-zinc-400 flex items-center justify-center cursor-pointer hover:border-white active:scale-90 transition-all"
      >
        <Square size={12} className="fill-[#FF453A] text-[#FF453A]" />
      </button>
    </motion.div>
  )
}

function AirDropState({ setIslandState }: { setIslandState: (s: IslandState) => void }) {
  return (
    <motion.div {...bouncyAnimation} className="w-[380px] p-4 flex gap-4 items-center justify-between">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Radio size={24} className="text-[#0A84FF]" />
          <span className="text-white font-semibold text-lg">AirDrop</span>
        </div>
        <span className="text-zinc-300 text-sm">Gxuri would like to share<br/>23 photos</span>
        <div className="flex gap-2 mt-2">
          <button onClick={() => setIslandState("idle")} className="px-5 py-2 bg-zinc-800 hover:bg-zinc-700 active:scale-95 transition-all rounded-full text-white text-sm font-medium cursor-pointer">Decline</button>
          <button onClick={() => setIslandState("idle")} className="px-5 py-2 bg-[#0A84FF] hover:bg-[#1C8FFF] active:scale-95 transition-all rounded-full text-white text-sm font-medium cursor-pointer">Accept</button>
        </div>
      </div>
      <div className="w-24 h-24 rounded-2xl bg-zinc-800 overflow-hidden relative cursor-pointer">
        <img src="https://images.unsplash.com/photo-1548192746-dd526f154ed9?q=80&w=200&auto=format" alt="Airdrop preview" className="object-cover w-full h-full" />
      </div>
    </motion.div>
  )
}

function FaceIdState({ setIslandState }: { setIslandState: (s: IslandState) => void }) {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const unlockTimer = setTimeout(() => setUnlocked(true), 1500);
    const closeTimer = setTimeout(() => setIslandState("idle"), 3000);
    return () => { clearTimeout(unlockTimer); clearTimeout(closeTimer); };
  }, [setIslandState]);

  return (
    <motion.div {...bouncyAnimation} className="w-[150px] h-[150px] flex flex-col items-center justify-center relative">
      <AnimatePresence mode="popLayout">
        {!unlocked ? (
          <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.5 }} className="flex flex-col items-center relative">
            <ScanFace size={56} className="text-[#0A84FF]" strokeWidth={1.5} />
            <motion.div
              animate={{ top: ["10%", "90%", "10%"] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="absolute w-[60px] h-[2px] bg-[#0A84FF] shadow-[0_0_8px_#0A84FF] z-10"
            />
            <span className="text-white mt-3 text-sm font-medium tracking-wide">Face ID</span>
          </motion.div>
        ) : (
          <motion.div key="unlocked" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center">
            <Unlock size={56} className="text-[#34C759]" strokeWidth={1.5} />
            <span className="text-[#34C759] mt-3 text-sm font-medium tracking-wide">Unlocked</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function ApplePayState({ setIslandState }: { setIslandState: (s: IslandState) => void }) {
  const [status, setStatus] = useState<"processing" | "done">("processing");

  useEffect(() => {
    const processTimer = setTimeout(() => setStatus("done"), 1500);
    const closeTimer = setTimeout(() => setIslandState("idle"), 3500);
    return () => { clearTimeout(processTimer); clearTimeout(closeTimer); };
  }, [setIslandState]);

  return (
    <motion.div {...bouncyAnimation} className="w-[300px] h-[65px] flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        {status === "processing" ? (
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
            <Loader2 size={28} className="text-white" />
          </motion.div>
        ) : (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.6 }}>
            <CheckCircle2 size={28} className="text-[#34C759] fill-[#34C759]/20" />
          </motion.div>
        )}
        <div className="flex flex-col">
          <span className="text-white font-medium text-lg leading-none">Apple Pay</span>
          {status === "done" && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-zinc-400 text-xs mt-1">Done</motion.span>}
        </div>
      </div>
      <motion.div animate={status === "done" ? { y: -5, opacity: 0.5 } : { y: 0, opacity: 1 }} transition={{ duration: 0.3 }}>
        <CreditCard size={32} className="text-[#0A84FF]" />
      </motion.div>
    </motion.div>
  )
}