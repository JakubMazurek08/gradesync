import {Text} from "../components/Text.tsx";
import {Navbar} from "./Navbar.tsx";
import {NavBar} from "../components/NavBar.tsx";

export const PricingLP = () => {


    return (
        <>
            <NavBar />
            <div className="pt-20 pl-40">
                <Text type="h1">GradeSync Plans</Text>
            </div>
            <div className="flex jusify-center flex-row justify-around w-[100vw] pt-50">
                <div className="bg-mediumgray w-100 h-120"></div>
                <div className="bg-mediumgray w-100 h-120"></div>
                <div className="bg-mediumgray w-100 h-120"></div>

            </div>
        </>
    )
}