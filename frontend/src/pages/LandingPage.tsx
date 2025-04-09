import { Text } from "../components/Text";
import { NavBar } from "../components/NavBar";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { FeaturesSection } from "../components/FeaturesSection";
import { Footer } from "../components/Footer";

export const LandingPage = () => {
  const [typewriterText, setTypewriterText] = useState("TRACK");
  const typewriterWords = ["TRACK", "SYNC", "SUCCEED!"];
  const typewriterIndex = useRef(0);
  const charIndex = useRef(0);
  const isDeleting = useRef(false);
  const typingSpeed = useRef(150);

  const descriptionRef = useRef<HTMLSpanElement | null>(null);
  const headingRef = useRef<HTMLSpanElement | null>(null);
  const typewriterRef = useRef<HTMLSpanElement | null>(null);

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
    if (headingRef.current) {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
      );
    }

    const descElement = descriptionRef.current;
    if (descElement) {
      const originalText = descElement.innerText;

      const wrapper = document.createElement("div");
      wrapper.style.width = "100%";

      const words = originalText.split(/(\s+)/);

      descElement.innerHTML = "";
      descElement.appendChild(wrapper);

      let animatedElements: any = [];
      words.forEach((text) => {
        if (text.trim() === "") {
          const spaceSpan = document.createElement("span");
          spaceSpan.innerHTML = "&nbsp;";
          wrapper.appendChild(spaceSpan);
        } else {
          const wordSpan = document.createElement("span");
          wordSpan.textContent = text;
          wordSpan.style.display = "inline-block";
          wordSpan.style.opacity = "0";
          wordSpan.style.transform = "translateY(20px)";
          wrapper.appendChild(wordSpan);
          animatedElements.push(wordSpan);
        }
      });

      gsap.to(animatedElements, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
        delay: 0.8,
      });
    }
  }, []);

  return (
    <div className="max-w-[100vw] overflow-hidden">
      <div className="bg-[url(/LandingPageBgImage.png)] bg-center h-screen max-w-[100vw] bg-cover lg:bg-[length:115%] flex flex-col relative">
        <div className="block bg-black opacity-70 absolute inset-0 z-0 h-screen"></div>

        <div className="relative z-20 max-w-[100vw]">
          <NavBar />
        </div>

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
                  <span
                    ref={typewriterRef}
                    className="ml-2 min-w-24 inline-block"
                  >
                    {typewriterText}
                  </span>
                </span>
              </Text>
            </div>

            <div className="hidden lg:block">
              <Text type="h1">
                <span className="flex flex-row items-center">
                  <span ref={headingRef}>GradeSync -</span>
                  <span
                    ref={typewriterRef}
                    className="ml-2 min-w-40 inline-block"
                  >
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
              <button className="bg-lightgray hover:scale-105 transition-all duration-250 text-xs p-3 md:p-4 md:text-base lg:p-5 lg:text-lg md:text-bas rounded-xl md:rounded-xl lg:rounded-2xl font-semibold opacity-100">
                GET STARTED ➜
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="h-[210vh] w-[100vw] flex items-center justify-center bg-background md:h-[100vh] lg:h-[100vh]">
        <div className="text-center px-4">
          <FeaturesSection />
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};