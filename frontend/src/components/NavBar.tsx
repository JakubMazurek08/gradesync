import { Text } from "./Text"

export const NavBar = () => {
    return (
        <div className="bg-gray-950 h-20 max-w-[100vw] border-b-2 border-white flex flex-row justify-between items-center px-5">
            <img src="/GradeSyncLogoDarkSmall.png" alt="LOGO" className="h-10"/>
            <div className="w-150 flex flex-row justify-around">
                <Text type="h4">PRICING</Text>
                <Text type="h4">LOGIN/SIGN UP</Text>
            </div>
        </div>
    )
}