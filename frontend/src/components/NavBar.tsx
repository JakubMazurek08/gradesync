import {Text} from "../components/Text.tsx";

export const NavBar = () => {
    return (
        <div className="text-white flex bg-gray-950 px-5 h-20 w-screen border-b-2 flex-row justify-between items-center z-10">
            <img src="/GradeSyncLogoDarkSmall.png" alt="LOGO" className="h-12"/>
            <div className=" flex w-150 h-min flex-row justify-around">
                <Text type="h4"> ENG </Text>
                <Text type="h4"> PRICING </Text>
                <Text type="h4"> LOGIN/SING UP </Text>
            </div>
        </div>  
    )
}   