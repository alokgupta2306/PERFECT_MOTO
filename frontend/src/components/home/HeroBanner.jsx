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
      // fallback to default slides
    }
  };
  fetchBanners();
}, []);

  // Default professional Black & Gold scheduled slides
  // Retained as baseline marketing fallback copies matching PRD guidelines
  const slides = [
    {
      title: "PREMIUM RIDING GEAR",
      subtitle: "UNCOMPROMISING PROTECTION FOR THE OPEN TRAIL",
      description: "Explore ISI & ECE certified protection matrices engineered for the Indian riding condition layout thresholds.",
      btnText: "Explore Gear Catalog",
      link: "/shop?category=helmets"
    },
    {
      title: "COMPATIBLE ACCESSORIES",
      subtitle: "ALGORITHMIC GEAR FILTERING PER MOTORCYCLE",
      description: "Save your bike model to automatically hide misfitted components sitewide across your browsing window.",
      btnText: "Configure My Garage",
      link: "/account/garage"
    },
    {
      title: "COMPLETE RIDER KITS",
      subtitle: "BUNDLE YOUR GEAR STACKS & SAVE FLAT UP TO RS 500",
      description: "Lock in helmet, touch-screen glove profiles, and windproof neck gaiters together to optimize your average order value savings.",
      btnText: "Explore Bundle Deals",
      link: "/shop?filter=bundles"
    }
  ];


  const activeSlides = apiBanners.length > 0 ? apiBanners.map(b => ({
  title: b.title,
  subtitle: b.subtitle,
  description: b.subtitle,
  btnText: b.buttonText || "Shop Now",
  link: b.link || "/shop",
  image: b.image
})) : slides;

  // Auto-advance loop set to run precisely every 5 seconds as mandated
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full h-[20vh] md:h-[40vh] bg-deep-black border-b border-border-dark overflow-hidden group select-none">
      
      {/* FIXED (Issue 2): Replaced missing bg-speed-lines utility with an active inline CSS diagonal motion blur pattern gradient */}
      {/* Generated per Section 05: Left to right diagonal lines with exactly 5% opacity matching brand theme guidelines */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 mix-blend-screen opacity-5"
        style={{
          backgroundImage: "repeating-linear-gradient(45deg, #FFB800 0px, #FFB800 2px, transparent 2px, transparent 40px)"
        }}
      />

      {/* FIXED (Issue 2): Replaced missing bg-hexagon-pattern with a clean native carbon fiber simulation technique */}
      {/* Generated per Section 05: Honeycomb grid design connection layer at 3% opacity for a premium technical background feel */}
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
          backgroundPosition: "0 0, 0 0, 0 0, 12px 21px, 12px 21px, 12px 21px"
        }}
      />
      
      {/* Viewport View Wrapper Container Layer */}
      <div 
        className="w-full h-full flex transition-transform duration-700 ease-in-out" 
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {activeSlides.map((slide, index) => (
          // FIXED (Issue 2): Removed raw missing class token strings to protect layout compiling integrity
          <div key={index} className="w-full h-full shrink-0 flex items-center px-4 sm:px-8 lg:px-16 relative"
  style={slide.image ? { backgroundImage: `url(${slide.image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
            <div className="max-w-3xl z-10">
              <h3 className="text-primary-gold text-xs md:text-sm font-heading font-bold tracking-widest uppercase mb-2 animate-fade-in">
                {slide.subtitle}
              </h3>
              {/* Heading styled using Rajdhani font mapping specifications */}
              <h1 className="text-4xl md:text-6xl font-heading font-bold text-pure-white leading-none tracking-wide mb-4 uppercase">
                {slide.title}
              </h1>
              <p className="text-sm text-muted-gray max-w-xl leading-relaxed mb-6 font-body">
                {slide.description}
              </p>
              <button
                onClick={() => navigate(slide.link)}
                className="h-12 px-6 bg-primary-gold hover:bg-gold-hover text-deep-black font-heading font-bold uppercase tracking-wider text-xs rounded-lg flex items-center gap-2 transition-all shadow-md transform active:scale-95"
              >
                <Compass size={16} />
                <span>{slide.btnText}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Manual Axis Slider Navigation Controls */}
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

      {/* Slider Carousel Segment Indicators Layout */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {activeSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`h-2 transition-all rounded-full ${currentSlide === i ? "w-8 bg-primary-gold" : "w-2 bg-muted-gray"}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;