import { NavBar } from "../components/NavBar";
import { Text } from "../components/Text";

export const LandingPage = () => {
  return (
    <div className="bg-[url(/LandingPageBgImage.png)] bg-center h-screen w-screen bg-[length:115%] flex flex-col">
      <div className="relative z-10">
        <NavBar />
      </div>
      <div className="relative z-20 h-[100vh] w-screen flex flex-row">
        <div className="w-[50vw]">
            <Text type="h1">KUTAS -
                KUTAS KUTAS
            </Text>
        </div>
        <div className="w-[50vw]">
        </div>
      </div>
      <div className="bg-black opacity-70 absolute inset-0 z-0"></div>
    </div>
  );
};
