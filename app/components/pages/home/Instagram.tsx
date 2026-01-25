'use client'
import Image from "next/image";
import { useEffect, useState } from "react";
import { Instagram } from "lucide-react";

export default function InstagramFollow() {
  const [offset, setOffset] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const images = [
    { id: 1, src: "/img/instagram/1.png", alt: "Instagram post 1" },
    { id: 2, src: "/img/instagram/2.png", alt: "Instagram post 2" },
    { id: 3, src: "/img/instagram/3.png", alt: "Instagram post 3" },
    { id: 4, src: "/img/instagram/4.png", alt: "Instagram post 4" },
  ];

  // Infinite carousel animation
  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prev) => (prev - 415) % (415 * 8));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-15 py-12 sm:py-16 lg:py-20 mt-8 sm:mt-12 lg:mt-16">
      {/* Header */}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-12">
        Follow us on Instagram
      </h2>

      {/* Carousel */}
      <div className="overflow-hidden">
        <div
          className="flex gap-6 transition-transform duration-1000 ease-out"
          style={{ transform: `translateX(${offset}px)` }}
        >
          {[...images, ...images].map((image, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-full sm:w-[320px] lg:w-[415px] h-[320px] sm:h-[320px] lg:h-[394px] rounded-lg sm:rounded-xl overflow-hidden relative group cursor-pointer"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={415}
                height={394}
                className="w-full h-full object-cover"
              />

              {/* Hover Overlay */}
              <div
                className={`
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-black/70
                  to-transparent
                  flex
                  items-center
                  justify-center
                  transition-all
                  duration-500
                  ${hoveredIndex === idx ? "translate-y-0" : "translate-y-full"}
                `}
              >
                <Instagram size={48} className="text-white" strokeWidth={1.5} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}