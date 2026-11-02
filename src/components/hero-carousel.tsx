"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ArrowRightIcon, Building2Icon } from "lucide-react"
import SwiperClass, { type Swiper as SwiperInstance } from "swiper"
import { Autoplay, Keyboard } from "swiper/modules"
import "swiper/css"

import { buttonVariants } from "@/components/ui/button"

const slides = [
  {
    image: "/images/hero/daylight-studio.jpg",
    imageAlt: "Daylight photography studio with a white cyclorama and lighting rigs",
    headline: ["Find your frame.", "Create your story."],
    description:
      "Book professional photo cyc walls, film sound stages, podcast rooms, and audio suites with transparent hourly rates and instant booking.",
    counter: "DAYLIGHT & CYC WALL LOFTS",
  },
  {
    image: "/images/hero/soundstage-set.jpg",
    imageAlt: "Film crew, cinema cameras, and lighting equipment on a production set",
    headline: ["Every shoot deserves", "the right space."],
    description:
      "Browse verified sound stages, film sets, and production studios with transparent hourly pricing and real-time availability.",
    counter: "SOUND STAGES & FILM SETS",
  },
  {
    image: "/images/hero/music-suite.jpg",
    imageAlt: "Warmly lit music recording suite with guitars, mixing console, and acoustic equipment",
    headline: ["Turn your studio into", "someone's next set."],
    description:
      "List your space, set your own rate, and start welcoming creators to your studio in minutes.",
    counter: "MUSIC SUITES & PODCAST ROOMS",
  },
]

const trustBadge = "Over 2,400 Verified Sound Stages & Lofts."

export function HeroCarousel() {
  const [activeSlide, setActiveSlide] = useState(0)
  const swiperRef = useRef<SwiperInstance | null>(null)
  const slide = slides[activeSlide]
  const swiperContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const container = swiperContainerRef.current
    if (!container) return

    const swiper = new SwiperClass(container, {
      modules: [Autoplay, Keyboard],
      autoplay: { delay: 5000, disableOnInteraction: false },
      keyboard: { enabled: true, onlyInViewport: true },
      rewind: true,
      on: {
        slideChange: (instance) => setActiveSlide(instance.realIndex),
      },
    })
    swiperRef.current = swiper

    return () => {
      swiper.destroy(true, true)
      swiperRef.current = null
    }
  }, [])

  return (
    <section
      aria-label="Featured creative studios"
      aria-roledescription="carousel"
      className="relative isolate mx-auto h-[min(72vh,560px)] min-h-[420px] w-full max-w-7xl overflow-hidden bg-[#071521] text-white"
    >
      <div
        ref={swiperContainerRef}
        className="swiper absolute inset-0 z-0 h-full w-full"
        aria-live="off"
      >
        <div className="swiper-wrapper">
          {slides.map((item, index) => (
            <div
              key={item.counter}
              className="swiper-slide"
              aria-hidden={activeSlide !== index}
              inert={activeSlide !== index}
            >
              <div
                className="relative flex h-full w-full items-center"
                role="group"
                aria-roledescription="slide"
                aria-label={`${String(index + 1).padStart(2, "0")} of ${slides.length}`}
              >
                <div className="absolute inset-0" aria-hidden="true">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    priority={index === 0}
                    sizes="100vw"
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#071521]/95 via-[#071521]/75 to-[#071521]/20" />
                  <div className="absolute inset-0 bg-[#071521]/15" />
                </div>

                <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl items-center px-5 pb-20 pt-5 sm:px-8 lg:px-10">
                  <div className="w-full max-w-[36rem]">
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#071521]/55 px-3 py-1.5 text-[0.62rem] font-semibold tracking-[0.08em] text-white/90 uppercase backdrop-blur-sm sm:mb-6">
                      <span
                        className="size-1.5 rounded-full bg-[#19a7ce]"
                        aria-hidden="true"
                      />
                      {trustBadge}
                    </div>

                    <h1 className="font-heading text-[clamp(2rem,4.3vw,3.55rem)] leading-[1.08] font-semibold tracking-tight">
                      <span className="block">{item.headline[0]}</span>
                      <span className="block text-[#19a7ce]">
                        {item.headline[1]}
                      </span>
                    </h1>

                    <p className="mt-4 max-w-[34rem] text-sm leading-relaxed text-white/75 sm:mt-5 sm:text-[0.95rem]">
                      {item.description}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center gap-2.5 sm:mt-6">
                      <a
                        href="#studios"
                        className={buttonVariants({
                          size: "sm",
                          className:
                            "h-9 gap-2 rounded-md bg-[#146c94] px-4 text-xs text-white hover:bg-[#105675]",
                        })}
                      >
                        Explore Studios
                        <ArrowRightIcon
                          className="size-3.5"
                          aria-hidden="true"
                        />
                      </a>
                      <a
                        href="#for-studios"
                        className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-white/25 bg-white/10 px-4 text-xs font-medium text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-white/40"
                      >
                        <Building2Icon
                          className="size-3.5"
                          aria-hidden="true"
                        />
                        Host Your Space
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute right-5 bottom-12 left-5 z-10 flex items-center gap-4 sm:right-8 sm:left-8 lg:right-10 lg:left-10">
        <div className="flex items-center gap-2" aria-label="Choose a slide">
          {slides.map((item, index) => (
            <button
              key={item.counter}
              type="button"
              onClick={() => swiperRef.current?.slideTo(index)}
              aria-label={`Show slide ${index + 1}: ${item.counter}`}
              aria-pressed={activeSlide === index}
              className={`h-1.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#19a7ce] focus-visible:ring-offset-2 focus-visible:ring-offset-[#071521] ${
                activeSlide === index
                  ? "w-5 bg-white"
                  : "w-1.5 bg-white/45 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
        <p
          aria-live="polite"
          className="text-[0.58rem] font-semibold tracking-[0.08em] text-white/65 uppercase"
        >
          <span className="text-white/90">
            {String(activeSlide + 1).padStart(2, "0")}
          </span>
          <span className="mx-1.5">/</span>
          {slide.counter}
        </p>
      </div>
    </section>
  )
}
