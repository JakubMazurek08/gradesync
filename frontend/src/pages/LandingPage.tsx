import { Text } from "../components/Text";
import Typewriter from "typewriter-effect";
import { NavBar } from "../components/NavBar";

export const LandingPage = () => {
  return (
    <div className="bg-[url(/LandingPageBgImage.png)] bg-center h-screen w-screen bg-[length:115%] flex flex-col">
      <div className="relative z-10">
        <NavBar />
      </div>
      <div className="relative z-20 h-[100vh] w-screen flex flex-row">
        <div className="w-[50vw] flex flex-row justify-center items-center pr-50 pb-60">
          <Text type="h1">
            <span className="flex flex-wrap items-center gap-2">
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
        <div className="w-[50vw] flex flex-col justify-center items-center pt-40 gap-4">
          <div className="w-[27vw] flex flex-wrap">
            <Text>
              GradesSync is a smart and intuitive platform for tracking grades,
              upcoming assignments, and academic progress.
            </Text>
          </div>
          <div className="flex flex-row justify-center pl-25">
                  <button className="bg-white p-5 rounded-2xl font-semibold">GET STARTED ➜</button>
          </div>
        </div>
      </div>
      <div className="bg-black opacity-70 absolute inset-0 z-0"></div>
    </div>
  );
};
