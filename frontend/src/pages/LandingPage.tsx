import { Text } from "../components/Text";
import { NavBar } from "../components/NavBar";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { FeaturesSection } from "../components/FeaturesSection"

export const LandingPage = () => {
  // Add state to track menu open/closed
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // State for typewriter effect
  const [typewriterText, setTypewriterText] = useState("TRACK");
  const typewriterWords = ["TRACK", "SYNC", "SUCCEED!"];
  const typewriterIndex = useRef(0);
  const charIndex = useRef(0);
  const isDeleting = useRef(false);
  const typingSpeed = useRef(150); // milliseconds

  // Refs for text animations with proper TypeScript typing
  const descriptionRef = useRef<HTMLSpanElement | null>(null);
  const headingRef = useRef<HTMLSpanElement | null>(null);
  const typewriterRef = useRef<HTMLSpanElement | null>(null);

  // Toggle function for the menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Custom typewriter effect
  useEffect(() => {
    const typewriterInterval = setInterval(() => {
      const currentWord = typewriterWords[typewriterIndex.current];
      
      if (isDeleting.current) {
        setTypewriterText(current => current.substring(0, current.length - 1));
        typingSpeed.current = 80; // faster when deleting
        
        if (typewriterText.length === 0) {
          isDeleting.current = false;
          typewriterIndex.current = (typewriterIndex.current + 1) % typewriterWords.length;
          typingSpeed.current = 150; // reset speed for typing
        }
      } else {
        setTypewriterText(currentWord.substring(0, charIndex.current + 1));
        typingSpeed.current = 150; // normal speed when typing
        
        charIndex.current += 1;
        
        if (charIndex.current === currentWord.length + 1) {
          // Pause at the end of the word
          typingSpeed.current = 1500; // pause duration
          charIndex.current = 0;
          isDeleting.current = true;
        }
      }
    }, typingSpeed.current);
    
    return () => clearInterval(typewriterInterval);
  }, [typewriterText]);

  // GSAP animations for text
  useEffect(() => {
    // Animate the heading
    if (headingRef.current) {
      gsap.fromTo(
        headingRef.current, 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
      );
    }

    // Completely new approach for text animation with proper spacing
    const descElement = descriptionRef.current;
    if (descElement) {
      // Store the original text and clear the element
      const originalText = descElement.innerText;
      
      // Create a wrapper for better control
      const wrapper = document.createElement('div');
      wrapper.style.width = '100%';
      
      // Split into words while preserving original spacing
      const words = originalText.split(/(\s+)/); // This captures spaces as separate items
      
      // Clear the element's content
      descElement.innerHTML = '';
      descElement.appendChild(wrapper);
      
      // Process each word and space
      let animatedElements : any = [];
      words.forEach((text) => {
        if (text.trim() === '') {
          // It's whitespace - add a non-breaking space span
          const spaceSpan = document.createElement('span');
          spaceSpan.innerHTML = '&nbsp;';
          wrapper.appendChild(spaceSpan);
        } else {
          // It's a word - create animated span
          const wordSpan = document.createElement('span');
          wordSpan.textContent = text;
          wordSpan.style.display = 'inline-block';
          wordSpan.style.opacity = '0';
          wordSpan.style.transform = 'translateY(20px)';
          wrapper.appendChild(wordSpan);
          animatedElements.push(wordSpan);
        }
      });
      
      // Animate only the word elements
      gsap.to(animatedElements, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
        delay: 0.8
      });
    }

    // Button animation
    const button = document.querySelector('.gsap-button');
    if (button) {
      gsap.fromTo(
        button,
        { opacity: 0, scale: 0.9 },
        { 
          opacity: 1, 
          scale: 1, 
          duration: 0.8, 
          delay: 2,
          ease: "elastic.out(1, 0.5)"
        }
      );
    }
  }, []);

  return (
    <div className="max-w-[100vw] overflow-hidden">
      <div className="bg-[url(/LandingPageBgImage.png)] bg-center h-screen max-w-[100vw] bg-cover lg:bg-[length:115%] flex flex-col relative">
        <div className="block bg-black opacity-70 absolute inset-0 z-0 h-screen"></div>

        <div className="hidden lg:block relative z-10 max-w-[100vw]">
          <NavBar />
        </div>

        <div className="flex flex-row justify-between px-4 pt-4 lg:hidden relative z-10 max-w-[100vw] md:pt-7 md:px-7">
          <img
            src="/GradeSyncLogoDarkSmall.png"
            alt="LOGO"
            className="h-8 md:h-12"
          />
          <img
            src="/menu.png"
            alt="MENU"
            className="h-8 md:h-12 cursor-pointer"
            onClick={toggleMobileMenu}
          />
        </div>

        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-black z-20 flex flex-col items-center pt-20">
            <div className="absolute top-4 right-4 md:top-7 md:right-7">
              <button
                onClick={toggleMobileMenu}
                className="text-white text-3xl font-bold"
              >
                ✕
              </button>
            </div>
            <div>
              <div className="flex flex-col items-center space-y-6 md:hidden">
                <Text>Pricing</Text>
                <Text>Login/sign up</Text>
              </div>
              <div className="hidden md:flex md:flex-col md:items-center md:space-y-9 ">
                <Text type="h3">Pricing</Text>
                <Text type="h3">Login/sign up</Text>
              </div>
            </div>
          </div>
        )}

        <div className="relative z-10 h-full w-full flex flex-col md:flex-col lg:flex-row justify-center px-6 md:px-8">
          <div className="w-full md:w-full lg:w-1/2 flex justify-center items-center mb-8 md:mb-8 lg:pb-50">
            <div className="md:hidden text-center">
              <Text type="h4">
                <span className="flex flex-col items-center">
                  <span ref={headingRef}>GradeSync -</span>
                  <span ref={typewriterRef} className="mt-2 min-h-8 block">
                    {typewriterText}
                  </span>
                </span>
              </Text>
            </div>

            <div className="hidden md:block lg:hidden text-center">
              <Text type="h3">
                <span className="flex flex-row items-center justify-center">
                  <span ref={headingRef}>GradeSync -</span>
                  <span ref={typewriterRef} className="ml-2 min-w-24 inline-block">
                    {typewriterText}
                  </span>
                </span>
              </Text>
            </div>

            <div className="hidden lg:block">
              <Text type="h1">
                <span className="flex flex-row items-center">
                  <span ref={headingRef}>GradeSync -</span>
                  <span ref={typewriterRef} className="ml-2 min-w-40 inline-block">
                    {typewriterText}
                  </span>
                </span>
              </Text>
            </div>
          </div>

          <div className="w-full md:w-full lg:w-1/2 flex flex-col justify-center items-center lg:items-center lg:pt-40">
            <div className="w-full md:max-w-lg lg:w-120 text-center lg:text-left">
              <Text>
                <span 
                  ref={descriptionRef} 
                  className="text-sm md:text-lg lg:text-xl"
                >
                  GradesSync is a smart and intuitive platform for tracking
                  grades, upcoming assignments, and academic progress.
                </span>
              </Text>
            </div>
            <div className="flex justify-center lg:justify-start mt-8 lg:pl-50 w-full md:w-auto lg:w-[27vw]">
              <button className="bg-white text-xs p-3 md:p-4 md:text-base lg:p-5 lg:text-lg md:text-bas rounded-xl md:rounded-xl lg:rounded-2xl font-semibold gsap-button opacity-0">
                GET STARTED ➜
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="h-[150vh] w-[100vw] flex items-center justify-center bg-black opacity-100 md:h-[100vh] lg:h-[100vh]">
        <div className="text-center px-4">
          <FeaturesSection />
        </div>
      </div>
    </div>
  );
};