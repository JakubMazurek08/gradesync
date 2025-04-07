import { Text } from "../components/Text";
import Typewriter from "typewriter-effect";
import { NavBar } from "../components/NavBar";
import { useState } from "react";

export const LandingPage = () => {
  // Add state to track menu open/closed
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Toggle function for the menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

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
                  GradeSync -
                  <span className="mt-2">
                    <Typewriter
                      options={{
                        strings: ["TRACK", "SYNC", "SUCCEED!"],
                        autoStart: true,
                        loop: true,
                      }}
                    />
                  </span>
                </span>
              </Text>
            </div>

            <div className="hidden md:block lg:hidden text-center">
              <Text type="h3">
                <span className="flex flex-row items-center justify-center">
                  GradeSync -
                  <span className="ml-2">
                    <Typewriter
                      options={{
                        strings: ["TRACK", "SYNC", "SUCCEED!"],
                        autoStart: true,
                        loop: true,
                      }}
                    />
                  </span>
                </span>
              </Text>
            </div>

            <div className="hidden lg:block">
              <Text type="h1">
                <span className="flex flex-row items-center">
                  GradeSync -
                  <span className="ml-2">
                    <Typewriter
                      options={{
                        strings: ["TRACK", "SYNC", "SUCCEED!"],
                        autoStart: true,
                        loop: true,
                      }}
                    />
                  </span>
                </span>
              </Text>
            </div>
          </div>

          <div className="w-full md:w-full lg:w-1/2 flex flex-col justify-center items-center lg:items-center lg:pt-40">
            <div className="w-full md:max-w-lg lg:w-[27vw] text-center lg:text-left">
              <Text>
                <span className="text-sm md:text-lg lg:text-xl">
                  GradesSync is a smart and intuitive platform for tracking
                  grades, upcoming assignments, and academic progress.
                </span>
              </Text>
            </div>
            <div className="flex justify-center lg:justify-start mt-8 lg:pl-50 w-full md:w-auto lg:w-[27vw]">
              <button className="bg-white text-xs p-3 md:p-4 md:text-base lg:p-5 lg:text-lg md:text-bas rounded-xl md:rounded-xl lg:rounded-2xl font-semibold">
                GET STARTED ➜
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-green-400 h-[100vh] w-[100vw] flex items-center justify-center">
        <div className="text-center px-4">
          <Text>Sigma</Text>
        </div>
      </div>
    </div>
  );
};