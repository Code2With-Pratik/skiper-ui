"use client" // <-- Added this so we can use state and onClick events!

import { CardCarousel } from '@/components/ui/card-carousel'
import { CardSwipe } from '@/components/ui/card-swipe'
import ImageCursorTrail from '@/components/ui/image-cursortrail'
import FlipLink from '@/components/ui/text-effect-flipper'
import { TextScroll } from '@/components/ui/text-scroll'
import ThemeToggleButton from '@/components/ui/theme-toggle-button'
import WrapButton from '@/components/ui/wrap-button'
import { Soup } from 'lucide-react'
import React from 'react'

// 1. Import your new global store
import { useIslandStore } from "../lib/useIslandStore" 

const page = () => {
    // 2. Grab the function that changes the island's state
    const setIslandState = useIslandStore((state) => state.setIslandState)

    const images = [
        {src:"/card1.jpg", alt: "Image 1"},
        {src:"/card2.jpg", alt: "Image 2"},
        {src:"/card3.jpg", alt: "Image 3"},
        {src:"/card4.jpg", alt: "Image 4"},
        {src:"/card5.jpg", alt: "Image 5"},
        {src:"/card6.jpg", alt: "Image 6"},
        {src:"/card7.jpg", alt: "Image 7"},
        {src:"/card8.jpg", alt: "Image 8"},
    ]

    const ImagesCoursor = [
        "https://images.pexels.com/photos/30082445/pexels-photo-30082445.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        "https://images.unsplash.com/photo-1692606743169-e1ae2f0a960f?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1709949908058-a08659bfa922?q=80&w=1200&auto=format",
        "https://images.unsplash.com/photo-1548192746-dd526f154ed9?q=80&w=1200&auto=format",
        "https://images.unsplash.com/photo-1644141655284-2961181d5a02?q=80&w=3000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.pexels.com/photos/30082445/pexels-photo-30082445.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        "https://assets.lummi.ai/assets/QmNfwUDpehZyLWzE8to7QzgbJ164S6fQy8JyUWemHtmShj?auto=format&w=1500",
        "https://images.unsplash.com/photo-1706049379414-437ec3a54e93?q=80&w=1200&auto=format",
        "https://assets.lummi.ai/assets/Qmb2P6tF2qUaFXnXpnnp2sk9HdVHNYXUv6MtoiSq7jjVhQ?auto=format&w=1500",
        "https://images.unsplash.com/photo-1508873881324-c92a3fc536ba?q=80&w=1200&auto=format",
    ]

  return (
    <div className="flex flex-col items-center gap-10 py-10">
      <h1 className='text-red-500'>Hello</h1>
      <WrapButton href='https://pratikdhandare.vercel.app/'>
        <Soup className='animate-bounce' />
         Get Started
      </WrapButton>
      
      <ThemeToggleButton variant="gif" url="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMWI1ZmNvMGZyemhpN3VsdWp4azYzcWUxcXIzNGF0enp0eW1ybjF0ZyZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/Fa6uUw8jgJHFVS6x1t/giphy.gif"></ThemeToggleButton>

      {/* 🚀 NEW: DYNAMIC ISLAND REMOTE CONTROLS 🚀 */}
      <div className="p-6 border border-zinc-800 rounded-3xl bg-zinc-900/50 backdrop-blur-md max-w-2xl w-full text-center">
        <h2 className="text-xl font-bold mb-4 text-white">Test The Island</h2>
        <div className="flex flex-wrap justify-center gap-3">
          <button onClick={() => setIslandState('faceId')} className="px-5 py-2.5 bg-zinc-800 text-white rounded-xl hover:bg-zinc-700 active:scale-95 transition-all">
            Scan Face ID
          </button>
          <button onClick={() => setIslandState('applePay')} className="px-5 py-2.5 bg-[#0A84FF] text-white rounded-xl hover:bg-[#1C8FFF] active:scale-95 transition-all">
            Pay with Apple
          </button>
          <button onClick={() => setIslandState('music')} className="px-5 py-2.5 bg-[#FF2D55] text-white rounded-xl hover:bg-[#FF4A6D] active:scale-95 transition-all">
            Play Music
          </button>
          <button onClick={() => setIslandState('timer')} className="px-5 py-2.5 bg-[#F9A825] text-black font-medium rounded-xl hover:bg-[#FFB74D] active:scale-95 transition-all">
            Start Timer
          </button>
          <button onClick={() => setIslandState('idle')} className="px-5 py-2.5 bg-transparent border border-zinc-600 text-zinc-300 rounded-xl hover:bg-zinc-800 active:scale-95 transition-all">
            Close Island
          </button>
        </div>
      </div>

      <div className="w-full mt-10">
          <CardCarousel images={images} autoplayDelay={2000} showPagination={true} showNavigation={true} />
      </div>

      <div className="w-full">
          <CardSwipe images={images} autoplayDelay={2000} slideShadows={false} />
      </div>

      <div className='h-screen flex items-center justify-center'>
          <ImageCursorTrail items={ImagesCoursor}
              maxNumberOfImages={5}
              distance={25}
              imgClass="sm:w-40 w-28 sm:h-48 h-36"
              className="max-w-4xl rounded-3xl">
          </ImageCursorTrail> 
      </div>

      <div className='h-screen flex items-center justify-center'>
          <FlipLink href='https://pratikdhandare.vercel.app/'>My Portfolio</FlipLink> 
      </div>

      <div className='h-screen flex items-center justify-center w-full'>
          <TextScroll default_velocity={-5} text='Hey I am Pratik' className='text-6xl'></TextScroll>
      </div>
    </div>
  )
}

export default page