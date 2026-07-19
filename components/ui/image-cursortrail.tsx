"use client"

import { createRef, useRef, ReactNode } from "react"
import { cn } from "@/lib/utils"

// Assuming ImageItem is a string based on your src={item} usage
type ImageItem = string;

interface ImageMouseTrailProps {
  items: ImageItem[]
  children?: ReactNode
  className?: string
  imgClass?: string
  distance?: number
  maxNumberOfImages?: number
  fadeAnimation?: boolean
}

export default function ImageCursorTrail({
  items,
  children,
  className,
  maxNumberOfImages = 5,
  imgClass = "w-40 h-48",
  distance = 20,
  fadeAnimation = false,
}: ImageMouseTrailProps) {
  const containerRef = useRef<HTMLElement>(null)
  const refs = useRef(items.map(() => createRef<HTMLImageElement>()))
  const currentZIndexRef = useRef(1)

  // FIX: Converted standard variables to refs so they don't reset on re-renders
  const globalIndex = useRef(0)
  const last = useRef({ x: 0, y: 0 })

  const activate = (image: HTMLImageElement, x: number, y: number) => {
    const containerRect = containerRef.current?.getBoundingClientRect()
    if (!containerRect) return;

    const relativeX = x - containerRect.left
    const relativeY = y - containerRect.top
    image.style.left = `${relativeX}px`
    image.style.top = `${relativeY}px`

    if (currentZIndexRef.current > 40) {
      currentZIndexRef.current = 1
    }
    image.style.zIndex = String(currentZIndexRef.current)
    currentZIndexRef.current++

    image.dataset.status = "active"
    if (fadeAnimation) {
      setTimeout(() => {
        image.dataset.status = "inactive"
      }, 1500)
    }
    
    // Update the ref
    last.current = { x, y }
  }

  const distanceFromLast = (x: number, y: number) => {
    // Read from the ref
    return Math.hypot(x - last.current.x, y - last.current.y)
  }
  
  const deactivate = (image: HTMLImageElement) => {
    image.dataset.status = "inactive"
  }

  const handleOnMove = (e: any) => {
    if (distanceFromLast(e.clientX, e.clientY) > window.innerWidth / distance) {
      const lead = refs.current[globalIndex.current % refs.current.length].current
      
      // FIX: Wait until we actually have enough trailing images to avoid negative array indexes
      if (globalIndex.current >= maxNumberOfImages) {
        const tailIndex = (globalIndex.current - maxNumberOfImages) % refs.current.length
        const tail = refs.current[tailIndex]?.current
        if (tail) deactivate(tail)
      }

      if (lead) activate(lead, e.clientX, e.clientY)
      
      // Update the ref
      globalIndex.current++
    }
  }

  return (
    <section
      onMouseMove={handleOnMove}
      onTouchMove={(e) => handleOnMove(e.touches[0])}
      ref={containerRef as React.RefObject<HTMLSelectElement>}
      className={cn(
        "relative grid h-[600px] w-full place-content-center overflow-hidden rounded-lg ",
        className
      )}
    >
      {items.map((item, index) => (
        /* FIX: Removed the empty fragment <> so the key is on the actual outermost mapped element */
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          key={index}
          className={cn(
            "opacity:0 data-[status='active']:ease-out-expo absolute -translate-x-[50%] -translate-y-[50%]  scale-0 rounded-3xl object-cover transition-transform duration-300  data-[status='active']:scale-100   data-[status='active']:opacity-100 data-[status='active']:duration-500 ",
            imgClass
          )}
          data-index={index}
          data-status="inactive"
          src={item}
          alt={`image-${index}`}
          ref={refs.current[index]}
        />
      ))}
      {children}
    </section>
  )
}