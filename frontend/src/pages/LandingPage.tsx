import { Text } from "../components/Text";
import Typewriter from "typewriter-effect";
import { NavBar } from "../components/NavBar";

export const LandingPage = () => {
  return (
    <div className="max-w-[100vw] overflow-hidden">
      <div className="bg-[url(/LandingPageBgImage.png)] bg-center h-screen max-w-[100vw] bg-cover lg:bg-[length:115%] flex flex-col relative">
        <div className="bg-black opacity-70 absolute inset-0 z-0 h-screen"></div>

        <div className="hidden lg:block relative z-10 max-w-[100vw]">
          <NavBar />
        </div>

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
                GradesSync is a smart and intuitive platform for tracking
                grades, upcoming assignments, and academic progress.
              </Text>
            </div>
            <div className="flex justify-center lg:justify-start mt-6 lg:pl-50 w-full md:w-auto lg:w-[27vw]">
              {/* To gowno trza bedzie zlinkowac z logowaniem tylko nie mam tutaj komponentu */}
              <button className="bg-white p-3 md:p-4 lg:p-5 rounded-xl md:rounded-xl lg:rounded-2xl font-semibold">
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
