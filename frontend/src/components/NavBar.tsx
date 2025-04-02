import { Text } from "./Text"
import {Link} from "react-router-dom";
import {LandingPage} from "../pages/LandingPage.tsx";

export const NavBar = () => {
    return (
        <div className="bg-gray-950 h-20 border-b-2 border-white flex flex-row justify-between items-center px-5">
            <Link to='/landingpage'>
            <img src="/GradeSyncLogoDarkSmall.png" alt="LOGO" className="h-14"/>
            </Link>
            <div className="w-150 flex flex-row justify-around">
                <Link to='/pricing'>
                    <Text type="h4">PRICING</Text>
                </Link>
                <Text type="h4">LOGIN/SIGN UP</Text>
            </div>
        </div>
    )
}
