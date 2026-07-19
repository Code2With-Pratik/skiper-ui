"use client"

import { useEffect, useState } from "react"
import { useIslandStore } from "../lib/useIslandStore"

export function useBatteryMonitor() {
  const setIslandState = useIslandStore((state) => state.setIslandState)
  
  // We use this so the Island doesn't spam the user every single second it's at 20%
  const [hasWarned, setHasWarned] = useState(false) 

  useEffect(() => {
    // 1. Check if the browser actually supports the Battery API 
    // (Note: Chrome/Edge/Opera support this. Safari/Firefox block it for privacy)
    if ('getBattery' in navigator) {
      
      // TypeScript needs a little coaxing for the Battery API since it's not standard on all browsers
      ;(navigator as any).getBattery().then((battery: any) => {

        const checkBattery = () => {
          const batteryPercentage = Math.round(battery.level * 100)
          const isCharging = battery.charging

          // Trigger the Island if battery hits 20% or less AND it's not plugged in
          if (batteryPercentage <= 20 && !isCharging && !hasWarned) {
            setIslandState("lowBattery")
            setHasWarned(true) // Mark as warned so it doesn't loop
            
            // Auto-dismiss the warning after 5 seconds like a real iPhone
            setTimeout(() => {
              setIslandState("idle")
            }, 5000)
          } 
          // Reset the warning if they plug it in or charge it back up
          else if (batteryPercentage > 20 || isCharging) {
            setHasWarned(false)
          }
        }

        // Run the check instantly on load
        checkBattery()

        // Set up listeners so it checks automatically if the battery drains or they plug it in
        battery.addEventListener('levelchange', checkBattery)
        battery.addEventListener('chargingchange', checkBattery)

        // Cleanup listeners when component unmounts
        return () => {
          battery.removeEventListener('levelchange', checkBattery)
          battery.removeEventListener('chargingchange', checkBattery)
        }
      })
    }
  }, [setIslandState, hasWarned])
}