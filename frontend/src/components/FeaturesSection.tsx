//
import { Text } from "../components/Text";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FeatureCard = ({ title, description, icon }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={cardRef}
      className="feature-card bg-[#1e293b] rounded-xl p-6 shadow-lg flex flex-col h-full overflow-hidden"
    >
      <div className="text-purple-500 mb-4">{icon}</div>
      <Text type="h4">{title}</Text>
      <Text>
        <span className="text-sm"></span>
        {description}
      </Text>
    </div>
  );
};

const TrackIcon = () => (
  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
      clipRule="evenodd"
    />
  </svg>
);

const SyncIcon = () => (
  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
      clipRule="evenodd"
    />
  </svg>
);

const SucceedIcon = () => (
  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);

export const FeaturesSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  const features = [
    {
      title: "Track Your Progress",
      description:
        "Monitor your academic journey with our intuitive grade tracking system that provides real-time updates and comprehensive overviews.",
      icon: <TrackIcon />,
    },
    {
      title: "Sync Across Devices",
      description:
        "Access your academic information anytime, anywhere with seamless synchronization across all your devices - desktop, tablet, and mobile.",
      icon: <SyncIcon />,
    },
    {
      title: "Succeed in Your Studies",
      description:
        "Leverage our analytical tools and insights to identify strengths and areas for improvement, helping you achieve your academic goals.",
      icon: <SucceedIcon />,
    },
  ];

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 70%",
        end: "bottom 20%",
        toggleActions: "play none none reset",
      },
    });

    if (titleRef.current) {
      tl.fromTo(
        titleRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "back.out(1.7)" }
      );
    }

    if (subtitleRef.current) {
      tl.fromTo(
        subtitleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "back.out(1.7)" },
        "-=0.6"
      );
    }

    const cards = document.querySelectorAll<HTMLDivElement>(".feature-card");

    if (cards.length > 0) {
      tl.fromTo(
        cards,
        {
          y: 100,
          opacity: 0,
          scale: 0.9,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "back.out(1.7)",
        },
        "-=0.4"
      );

      cards.forEach((card) => {
        const enterHandler = () => {
          gsap.to(card, {
            y: -15,
            boxShadow: "0 15px 30px rgba(0,0,0,0.2)",
            duration: 0.3,
            ease: "power2.out",
          });
        };

        const leaveHandler = () => {
          gsap.to(card, {
            y: 0,
            boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
            duration: 0.3,
            ease: "power2.out",
          });
        };

        card.addEventListener("mouseenter", enterHandler);
        card.addEventListener("mouseleave", leaveHandler);

        return () => {
          card.removeEventListener("mouseenter", enterHandler);
          card.removeEventListener("mouseleave", leaveHandler);
        };
      });
    }
  }, []);

  return (
    <div
      ref={sectionRef}
      className="min-h-screen w-full flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="text-center mb-12 md:mb-16 max-w-xl">
        <h2
          ref={titleRef}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
        >
          Why Choose GradeSync?
        </h2>
        <p
          ref={subtitleRef}
          className="text-base md:text-lg text-gray-300 px-4"
        >
          Our platform provides everything you need to excel in your academic
          journey
        </p>
      </div>

      <div ref={cardsContainerRef} className="w-full max-w-6xl px-4">
        <div className=" grid grid-cols-1 gap-6 md:hidden">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </div>

        <div className="hidden md:block lg:hidden">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <FeatureCard
              title={features[0].title}
              description={features[0].description}
              icon={features[0].icon}
            />
            <FeatureCard
              title={features[1].title}
              description={features[1].description}
              icon={features[1].icon}
            />
          </div>
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <FeatureCard
                title={features[2].title}
                description={features[2].description}
                icon={features[2].icon}
              />
            </div>
          </div>
        </div>

        <div className="hidden lg:grid lg:grid-cols-3 lg:gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
