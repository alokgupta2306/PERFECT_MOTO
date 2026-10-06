import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Compass } from "lucide-react";
import api from "../../utils/api";

const HeroBanner = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [apiBanners, setApiBanners] = useState([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await api.get("/homepage");
        const banners = res.data?.content?.heroBanners || [];
        if (banners.length > 0) setApiBanners(banners);
      } catch {
        // Handled silently
      }
    };
    fetchBanners();
  }, []);

  // Map and filter active banners dynamically from API (Hardcoded fallback removed)
  const activeSlides = apiBanners
    .filter((b) => b.isActive !== false)
    .map((b) => ({
      title: b.title,
      subtitle: b.subtitle,
      description: b.subtitle,
      btnText: b.buttonText || "Shop Now",
      link: b.link || "/shop",
      image: b.image,
    }));

  // Auto-advance loop set to run every 5 seconds (Only runs if more than 1 banner exists)
  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === activeSlides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? activeSlides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === activeSlides.length - 1 ? 0 : prev + 1));
  };

  // Hide component entirely if no active banners exist
  if (activeSlides.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full h-[35vh] md:h-[55vh] lg:h-[65vh] bg-deep-black border-b border-border-dark overflow-hidden group select-none">
      {/* Brand Background Pattern: Speed lines at 5% opacity */}
      <div
        className="absolute inset-0 pointer-events-none z-0 mix-blend-screen opacity-5"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #FFB800 0px, #FFB800 2px, transparent 2px, transparent 40px)",
        }}
      />

      {/* Brand Background Pattern: Carbon Fiber / Hexagon Grid at 3% opacity */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(30deg, #FFB800 12%, transparent 12.5%, transparent 87%, #FFB800 87%, #FFB800),
            linear-gradient(150deg, #FFB800 12%, transparent 12.5%, transparent 87%, #FFB800 87%, #FFB800),
            linear-gradient(270deg, #FFB800 11%, transparent 11.5%, transparent 88.5%, #FFB800 88.5%, #FFB800),
            linear-gradient(30deg, #FFB800 12%, transparent 12.5%, transparent 87%, #FFB800 87%, #FFB800),
            linear-gradient(150deg, #FFB800 12%, transparent 12.5%, transparent 87%, #FFB800 87%, #FFB800),
            linear-gradient(270deg, #FFB800 11%, transparent 11.5%, transparent 88.5%, #FFB800 88.5%, #FFB800)
          `,
          backgroundSize: "24px 42px",
          backgroundPosition: "0 0, 0 0, 0 0, 12px 21px, 12px 21px, 12px 21px",
        }}
      />

      {/* Viewport Carousel Wrapper */}
      <div
        className="w-full h-full flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {activeSlides.map((slide, index) => (
          <div
            key={index}
            className="w-full h-full shrink-0 flex items-center px-6 sm:px-12 lg:px-20 relative bg-cover bg-center"
            style={slide.image ? { backgroundImage: `url(${slide.image})` } : {}}
          >
            {/* Dark Gradient Overlay for text readability over uploaded image */}
            {slide.image && (
              <div className="absolute inset-0 bg-gradient-to-r from-deep-black via-deep-black/80 to-transparent z-0 pointer-events-none" />
            )}

            {/* Banner Text Content */}
            <div className="max-w-3xl z-10">
              <h3 className="text-primary-gold text-xs md:text-sm font-heading font-bold tracking-widest uppercase mb-2 animate-fade-in">
                {slide.subtitle}
              </h3>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-bold text-pure-white leading-tight tracking-wide mb-4 uppercase">
                {slide.title}
              </h1>

              <p className="text-xs sm:text-sm text-muted-gray max-w-xl leading-relaxed mb-6 font-body">
                {slide.description}
              </p>

              <button
                onClick={() => navigate(slide.link)}
                className="h-11 md:h-12 px-6 bg-primary-gold hover:bg-gold-hover text-deep-black font-heading font-bold uppercase tracking-wider text-xs rounded-lg flex items-center gap-2 transition-all shadow-md transform active:scale-95"
              >
                <Compass size={16} />
                <span>{slide.btnText}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Manual Controls (Only rendered when 2 or more slides exist) */}
      {activeSlides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-card-dark/60 border border-border-dark text-pure-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-primary-gold hover:text-deep-black hover:shadow-gold-glow z-20"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-card-dark/60 border border-border-dark text-pure-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-primary-gold hover:text-deep-black hover:shadow-gold-glow z-20"
          >
            <ChevronRight size={20} />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {activeSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-2 transition-all rounded-full ${
                  currentSlide === i ? "w-8 bg-primary-gold" : "w-2 bg-muted-gray"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HeroBanner;