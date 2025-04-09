import { Text } from "../components/Text.tsx";
import { NavBar } from "../components/NavBar.tsx";
import { Link } from "react-router-dom";
import { Footer } from "../components/Footer.tsx";

export const PricingLP = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative z-20 max-w-[100vw]">
        <NavBar />
      </div>
      <div className="mx-auto px-4 md:px-8 pt-8 md:pt-16">
        <Text type="h1">GradeSync Plans</Text>
      </div>
      <div className="mr-auto ml-auto md:px-8 pt-3">
        <Text type="p">Find the perfect plan for your educational needs</Text>
      </div>

      <div className="flex flex-col md:flex-row justify-center gap-6 md:gap-8 lg:gap-16 px-4 py-8 md:py-16">
        {/* First card*/}
        <div className="bg-mediumgray w-full md:w-80 lg:w-96 rounded-3xl border-3 border-mediumlight-gray transform-gpu transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:translate-y-2 hover:bg-opacity-90">
          <div className="p-6 pt-12">
            <div>
              <Text type="h3">FREE</Text>
            </div>
            <div className="pt-4">
              <Text type="h4">$0/month</Text>
            </div>
            <div className="pt-8">
              <Text type="p">Limited platform for tracking grades</Text>
              {/* Te funkcje*/}
              <ul className="mt-5 space-y-2">
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2 mt-1.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <Text type="p">Basic grade tracking</Text>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2 mt-1.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <Text type="p">Community support</Text>
                </li>
              </ul>
            </div>
            <Link to="/">
              <div className="bg-mediumlight-gray w-full md:w-4/5 lg:w-70 h-14 mt-14 mx-auto flex items-center justify-center rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:bg-purple-500 hover:text-white hover:shadow-2xl hover:translate-y-1">
                <Text type="p">Try Free →</Text>
              </div>
            </Link>
          </div>
        </div>

        {/* Second card */}
        <div className="bg-mediumgray w-full md:w-80 lg:w-96 rounded-3xl border-3 border-mediumlight-gray transform-gpu transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:translate-y-2 hover:bg-opacity-90">
          <div className="p-6 pt-12">
            <div>
              <Text type="h3">Dedicated</Text>
            </div>
            <div className="pt-4">
              <Text type="h4">$10/month</Text>
            </div>
            <div className="pt-8">
              <Text type="p">Enhanced platform for comprehensive tracking</Text>

              {/* te funkcje */}
              <ul className="mt-4 space-y-2">
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2 mt-1.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <Text to="p">Advanced grade tracking</Text>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2 mt-1.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <Text type="p">Academic progress reports</Text>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2 mt-1.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <Text type="p">Upcoming assignments tracker</Text>
                </li>
              </ul>
            </div>
            <Link to="/">
              <div className="bg-mediumlight-gray w-full md:w-4/5 lg:w-70 h-14 mt-8 mx-auto flex items-center justify-center rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:bg-purple-500 hover:text-white hover:shadow-2xl hover:translate-y-1">
                <Text type="p">Get Started →</Text>
              </div>
            </Link>
          </div>
        </div>

        {/* Third card */}
        <div className="bg-mediumgray w-full md:w-80 lg:w-96 rounded-3xl border-3 border-mediumlight-gray transform-gpu transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:translate-y-2 hover:bg-opacity-90">
          <div className="p-6 pt-12">
            <div>
              <Text type="h3">For Team</Text>
            </div>
            <div className="pt-4">
              <Text type="h4">$49/month</Text>
            </div>
            <div className="pt-8">
              <Text type="p">Complete platform with team collaboration</Text>

              {/* te funkcje */}
              <ul className="mt-4 space-y-2">
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2 mt-1.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <Text type="p">All Dedicated features</Text>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2 mt-1.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <Text type="p">Up to 10 team members</Text>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2 mt-1.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <Text type="p">Team collaboration tools</Text>
                </li>
              </ul>
            </div>
            <Link to="/">
              <div className="bg-mediumlight-gray w-full md:w-4/5 lg:w-70 h-14 mt-8 mx-auto flex items-center justify-center rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:bg-purple-500 hover:text-white hover:shadow-2xl hover:translate-y-1">
                <Text type="p">Get Started →</Text>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Question Section */}
      <div className="container mx-auto px-4 md:px-8 py-8 md:py-16">
        <div className="bg-mediumgray w-full md:w-4/5 lg:w-370 rounded-3xl flex flex-col md:flex-row justify-between p-6 md:p-10 mb-8 md:mb-16 lg:mb-40 mx-auto">
          <div className="flex flex-col mb-6 md:mb-0">
            <div className="mb-4 md:mb-6">
              <Text type="h3">Question about pricing?</Text>
            </div>
            <div>
              <Text type="h4">
                Talk to us for more information about features, sizing,{" "}
                <br className="hidden md:block" />
                support plans, and consulting.
              </Text>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-end">
            <Link to="/">
              <div className="bg-purple-500 hover:bg-blue-500 text-white px-6 md:px-14 py-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl font-medium flex items-center gap-2">
                <Text type="p">Contact Us</Text>
              </div>
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};
