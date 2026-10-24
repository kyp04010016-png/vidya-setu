import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Pause,
  Play,
  ImagePlus,
  MapPin,
  Video,
  UserPlus,
} from 'lucide-react';
import { BannerItem } from '../data/seedData';

interface HomePhotoSliderProps {
  banners: BannerItem[];
  isAdmin: boolean;
  onFindTutorClick: () => void;
  onJoinTutorClick: () => void;
  onOnlineTuitionClick: () => void;
  onPostRequirementClick: () => void;
  onOpenAdminBannerManager: () => void;
}

export const HomePhotoSlider: React.FC<HomePhotoSliderProps> = ({
  banners,
  isAdmin,
  onFindTutorClick,
  onJoinTutorClick,
  onOnlineTuitionClick,
  onPostRequirementClick,
  onOpenAdminBannerManager,
}) => {
  const activeSlides = banners
    .filter((b) => b.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isPaused, setIsPaused] = useState(false);

  // Keep index valid when slides are added/removed from Admin Panel
  useEffect(() => {
    if (currentIndex >= activeSlides.length && activeSlides.length > 0) {
      setCurrentIndex(0);
    }
  }, [activeSlides.length, currentIndex]);

  // Auto-advance timer with pause-on-hover
  useEffect(() => {
    if (activeSlides.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
    }, 4800);
    return () => clearInterval(timer);
  }, [activeSlides.length, isPaused]);

  if (activeSlides.length === 0) {
    return null;
  }

  const currentSlide = activeSlides[currentIndex] || activeSlides[0];
  const animStyle = currentSlide.animationStyle || 'ken-burns';

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  const handleCtaAction = (action?: BannerItem['ctaAction']) => {
    if (action === 'join-tutor') {
      onJoinTutorClick();
    } else if (action === 'online-tuition') {
      onOnlineTuitionClick();
    } else if (action === 'post-requirement') {
      onPostRequirementClick();
    } else {
      onFindTutorClick();
    }
  };

  return (
    <section
      aria-label="Featured Home Tutor Photo Slider"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full bg-[#06253b] overflow-hidden border-b border-slate-300 dark:border-slate-800 select-none"
    >
      <div className="relative min-h-[390px] sm:h-[390px] md:h-[420px] w-full overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="sync">
          <motion.div
            key={currentSlide.id + '-' + currentIndex}
            custom={direction}
            initial={
              animStyle === 'slide'
                ? { x: direction > 0 ? '100%' : '-100%', opacity: 0.4 }
                : animStyle === 'fade-zoom'
                ? { opacity: 0, scale: 1.08 }
                : { opacity: 0, scale: 1.02 }
            }
            animate={
              animStyle === 'ken-burns'
                ? { x: 0, opacity: 1, scale: [1.0, 1.05] }
                : { x: 0, opacity: 1, scale: 1 }
            }
            exit={
              animStyle === 'slide'
                ? { x: direction > 0 ? '-100%' : '100%', opacity: 0.2 }
                : { opacity: 0, scale: 0.98 }
            }
            transition={{
              duration: animStyle === 'ken-burns' ? 0.75 : 0.6,
              scale:
                animStyle === 'ken-burns'
                  ? { duration: 5.2, ease: 'linear' }
                  : { duration: 0.6, ease: 'easeOut' },
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Slide Background Photo */}
            {currentSlide.imageUrl ? (
              <img
                src={currentSlide.imageUrl}
                alt={currentSlide.title}
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-[#062c47] via-[#084d75] to-[#135e8a]" />
            )}

            {/* Directional Readability Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-[#041827]/95 via-[#06253b]/80 to-[#06253b]/25" />

            {/* Foreground Content Container */}
            <div className="relative z-10 max-w-7xl mx-auto h-full px-4 sm:px-10 py-6 sm:py-0 flex flex-col lg:flex-row items-start lg:items-center justify-center lg:justify-between gap-4 lg:gap-8">
              {/* Mobile Framed Image Preview for Admin-Uploaded Custom Photos */}
              {currentSlide.imageUrl && !currentSlide.imageUrl.startsWith('data:image/svg+xml') && (
                <div className="block lg:hidden w-full h-36 sm:h-44 rounded-lg overflow-hidden border border-white/30 shadow-lg shrink-0 bg-slate-900">
                  <img
                    src={currentSlide.imageUrl}
                    alt={currentSlide.title}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              )}

              <div className="max-w-2xl space-y-2.5 sm:space-y-3.5">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12, duration: 0.4 }}
                  className="flex items-center gap-2 text-[11px] sm:text-xs font-bold tracking-wider uppercase text-amber-300"
                >
                  <span>{currentSlide.badgeText || 'VERIFIED HOME & ONLINE TUTORS'}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-sky-200 font-mono">
                    Slide {String(currentIndex + 1).padStart(2, '0')}/
                    {String(activeSlides.length).padStart(2, '0')}
                  </span>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18, duration: 0.45 }}
                  className="font-display text-xl sm:text-3xl md:text-4xl font-bold text-white leading-tight drop-shadow-xs"
                >
                  {currentSlide.title}
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.45 }}
                  className="text-xs sm:text-sm md:text-base text-slate-200 leading-relaxed max-w-xl line-clamp-2 sm:line-clamp-none"
                >
                  {currentSlide.subtitle}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.32, duration: 0.45 }}
                  className="pt-1 sm:pt-2 flex flex-wrap items-center gap-2 sm:gap-3 pb-6 sm:pb-0"
                >
                  <button
                    type="button"
                    onClick={() => handleCtaAction(currentSlide.ctaAction)}
                    className="px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wide text-white bg-[#ff6600] hover:bg-[#e05500] rounded-md shadow-md inline-flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer"
                  >
                    <span>{currentSlide.ctaText || 'Find Home Tutor Now'}</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={onJoinTutorClick}
                    className="px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white bg-white/15 hover:bg-white/25 border border-white/30 rounded-md inline-flex items-center gap-1.5 backdrop-blur-xs transition-all cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
                    <span>Join As Tutor</span>
                  </button>

                  <button
                    type="button"
                    onClick={onOnlineTuitionClick}
                    className="inline-flex px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-emerald-200 bg-emerald-950/60 hover:bg-emerald-900/70 border border-emerald-400/40 rounded-md items-center gap-1.5 backdrop-blur-xs transition-all cursor-pointer"
                  >
                    <Video className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                    <span>Online Classes</span>
                  </button>
                </motion.div>
              </div>

              {/* Framed Preview Card for Admin-Uploaded Custom Photos on Desktop */}
              {currentSlide.imageUrl && !currentSlide.imageUrl.startsWith('data:image/svg+xml') && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, x: 24 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ delay: 0.22, duration: 0.5 }}
                  className="hidden lg:block w-[370px] h-[250px] rounded-xl overflow-hidden border-2 border-white/30 shadow-2xl shrink-0 bg-slate-900"
                >
                  <img
                    src={currentSlide.imageUrl}
                    alt={currentSlide.title}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Left / Right Slide Controls */}
        {activeSlides.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous Slide"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-950/55 hover:bg-[#ff6600] text-white border border-white/25 flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next Slide"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-950/55 hover:bg-[#ff6600] text-white border border-white/25 flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Bottom Control Bar: Dots + Play/Pause + Admin Quick Upload */}
        <div className="absolute bottom-3 inset-x-0 z-20 max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {activeSlides.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => {
                  setDirection(idx > currentIndex ? 1 : -1);
                  setCurrentIndex(idx);
                }}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === currentIndex
                    ? 'w-8 bg-[#ff6600]'
                    : 'w-2.5 bg-white/45 hover:bg-white/80'
                }`}
              />
            ))}
            <button
              type="button"
              onClick={() => setIsPaused((p) => !p)}
              aria-label={isPaused ? 'Play Slider' : 'Pause Slider'}
              className="ml-2 p-1.5 rounded-full bg-slate-950/50 text-white/85 hover:text-white border border-white/20 cursor-pointer"
              title={isPaused ? 'Resume Auto-Slide' : 'Pause Auto-Slide'}
            >
              {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
            </button>
          </div>

          {isAdmin && (
            <button
              type="button"
              onClick={onOpenAdminBannerManager}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold shadow-md transition-colors cursor-pointer"
            >
              <ImagePlus className="w-3.5 h-3.5" />
              <span>Admin: Upload / Change Slider Photos</span>
            </button>
          )}
        </div>

        {/* Animated Auto-Advance Progress Line */}
        {!isPaused && activeSlides.length > 1 && (
          <motion.div
            key={`progress-${currentIndex}`}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 4.8, ease: 'linear' }}
            className="absolute bottom-0 left-0 h-1 bg-[#ff6600] z-20"
          />
        )}
      </div>
    </section>
  );
};
