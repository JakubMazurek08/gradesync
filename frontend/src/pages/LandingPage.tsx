import { Text } from "../components/Text";
import { NavBar } from "../components/NavBar";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { FeaturesSection } from "../components/FeaturesSection";
import { Footer } from "../components/Footer";

export const LandingPage = () => {
  const [typewriterText, setTypewriterText] = useState("TRACK");
  const typewriterWords = ["TRACK", "SYNC", "SUCCEED"];
  const typewriterIndex = useRef(0);
  const charIndex = useRef(0);
  const isDeleting = useRef(false);
  const typingSpeed = useRef(150);

  const descriptionRef = useRef<HTMLSpanElement | null>(null);
  const headingRef = useRef<HTMLDivElement | null>(null);
  const typewriterRef = useRef<HTMLSpanElement | null>(null);
  const ctaButtonRef = useRef<HTMLButtonElement | null>(null);
  const productImageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const typewriterInterval = setInterval(() => {
      const currentWord = typewriterWords[typewriterIndex.current];

      if (isDeleting.current) {
        setTypewriterText((current) =>
          current.substring(0, current.length - 1)
        );
        typingSpeed.current = 80;

        if (typewriterText.length === 0) {
          isDeleting.current = false;
          typewriterIndex.current =
            (typewriterIndex.current + 1) % typewriterWords.length;
          typingSpeed.current = 150;
        }
      } else {
        setTypewriterText(currentWord.substring(0, charIndex.current + 1));
        typingSpeed.current = 150;

        charIndex.current += 1;

        if (charIndex.current === currentWord.length + 1) {
          typingSpeed.current = 1500;
          charIndex.current = 0;
          isDeleting.current = true;
        }
      }
    }, typingSpeed.current);

    return () => clearInterval(typewriterInterval);
  }, [typewriterText]);

  useEffect(() => {
    const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });

    if (headingRef.current) {
      heroTimeline.fromTo(
        headingRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1 }
      );
    }

    if (typewriterRef.current) {
      heroTimeline.fromTo(
        typewriterRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.5"
      );
    }

    const descElement = descriptionRef.current;
    if (descElement) {
      heroTimeline.fromTo(
        descElement,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.3"
      );
    }

    if (ctaButtonRef.current) {
      heroTimeline.fromTo(
        ctaButtonRef.current,
        { opacity: 0, y: 30, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8 },
        "-=0.5"
      );
    }

    if (productImageRef.current) {
      heroTimeline.fromTo(
        productImageRef.current,
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 1 },
        "-=0.8"
      );
    }
  }, []);

  return (
    <div className="max-w-[100vw] overflow-hidden">
      <div className="bg-black min-h-screen max-w-[100vw] flex flex-col relative">
        <div className="relative z-20 max-w-[100vw]">
          <NavBar />
        </div>

        <div className="relative z-10 flex-grow w-full flex flex-col md:flex-row items-center px-6 md:px-12 lg:px-16 py-12">
          <div className="w-full md:w-full lg:w-1/2 flex flex-col justify-center mb-12 md:mb-0 md:pr-8 md:items-center lg:items-start">
            <div className="mb-6">
              <Text type="h1">
                <div className="text-white font-bold" ref={headingRef}>
                  <div className="md:flex md:flex-row lg:flex lg:flex-row lg:gap-2 md:gap-2 items-center">
                    GradeSync - <span className="text-purple-400 hidden md:block lg:block">{typewriterText}</span>
                  </div>
                  
                  <div className="block md:hidden lg:hidden h-12">
                    <span className="text-purple-400" ref={typewriterRef}>{typewriterText}</span>
                  </div>
                </div>
              </Text>
            </div>
            
            <div className="mb-8 md:text-center lg:text-left">
              <Text>
                <span
                  ref={descriptionRef}
                  className="text-gray-300 text-lg block"
                >
                  GradeSync is a smart and intuitive platform for tracking grades, upcoming assignments, and academic progress.
                </span>
              </Text>
            </div>
            
            <div>
              <button 
                ref={ctaButtonRef}
                className="bg-purple-500 hover:bg-purple-400 text-white font-medium rounded-md px-8 py-4 text-lg transition-all duration-300 flex items-center"
              >
                GET STARTED <span className="ml-2">→</span>
              </button>
            </div>
          </div>
          
          <div className="hidden lg:flex lg:w-[50vw] justify-center" ref={productImageRef}>
            <img src="/LandingPageSideImage.png" alt="PREVIEW" className="lg:h-165 rounded-lg"/>
          </div>
          
        </div>
      </div>

      <div className="w-[100vw] bg-background py-16 md:py-24 lg:py-32">
        <FeaturesSection />
      </div>

      <div>
        <Footer />
      </div>
    </div>
  );
};