import {Text} from "../components/Text.tsx";
import {NavBar} from "../components/NavBar.tsx";
import {Link} from "react-router-dom";
import {Button} from "../components/Button.tsx";
import {Footer} from "../components/Footer.tsx";

export const PricingLP = () => {


    return (
        <>
            <NavBar />
            <div className="container mt-20 ml-30 pt-10 pl-10">
                <Text type="h1">GradeSync Plans</Text>
            </div>
            <div className="flex flex-row justify-center gap-16 pt-40">
                <div className="bg-mediumgray w-100 h-140 rounded-3xl border-3 border-mediumlight-gray transform-gpu transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:translate-y-2 hover:bg-opacity-90">
                    <div className='p-6 pt-12'>
                        <div>
                        <Text type='h3'>FREE</Text>
                        </div>
                        <div className='pt-4'><Text type='h4'>$0/month</Text> </div>
                        <div className='pt-30'> <Text type='p'>Limited platform for tracking grades</Text></div>
                        <Link to="/">
                            <div className="bg-mediumlight-gray w-70 h-14 mt-35 mx-auto flex items-center justify-center rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:bg-purple-500 hover:text-white hover:shadow-2xl hover:translate-y-1">
                                <Text type="p">Try Free →</Text>
                            </div>
                        </Link>
                    </div>
                </div>
                {/*Tutaj mamy 2 karte*/}
                <div className="bg-mediumgray w-100 h-140 rounded-3xl border-3 border-mediumlight-gray transform-gpu transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:translate-y-2 hover:bg-opacity-90">
                    <div className='p-6 pt-12'>
                        <div>
                            <Text type='h3'>Dedicated</Text>
                        </div>
                        <div className='pt-4'><Text type='h4'>$10/month</Text> </div>
                        <div className='pt-30'> <Text type='p'>Limited platform for tracking grades, academic progress, upcoming assignments</Text></div>
                        <Link to="/">
                            <div className="bg-mediumlight-gray w-70 h-14 mt-20 mx-auto flex items-center justify-center rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:bg-purple-500 hover:text-white hover:shadow-2xl hover:translate-y-1">
                                <Text type="p">Get Started →</Text>
                            </div>
                        </Link>
                    </div>
                </div>
                {/*Tutaj mamy 3 karte*/}
                <div className="bg-mediumgray w-100 h-140 rounded-3xl border-3 border-mediumlight-gray transform-gpu transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:translate-y-2 hover:bg-opacity-90">
                    <div className='p-6 pt-12'>
                        <div>
                            <Text type='h3'>For Team</Text>
                        </div>
                        <div className='pt-4'><Text type='h4'>$49/month</Text> </div>
                        <div className='pt-30'> <Text type='p'>Access to all features of the platform with team collaboration. Suitable for teams of up to 10 members.</Text></div>
                        <Link to="/">
                            <div className="bg-mediumlight-gray w-70 h-14 mt-20 mx-auto flex items-center justify-center rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:bg-purple-500 hover:text-white hover:shadow-2xl hover:translate-y-1">
                                <Text type="p">Get Started →</Text>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="bg-mediumgray w-370 h-70 mx-auto mt-45 rounded-3xl flex flex-row justify-between p-10 mb-40 ">
                <div className="flex flex-col">
                    <div className="mb-6">
                        <Text type="h3">Question about pricing?</Text>
                    </div>
                    <div>
                        <Text type="h4">Talk to us for more information about features, sizing, <br/> support plans, and consulting.</Text>
                    </div>
                </div>
                <div className="flex items-center">
                    <Link to="/">
                        <div className="bg-purple-500 hover:bg-blue-500 mr-16 text-white px-14 py-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl font-medium flex items-center gap-2">
                            <Text type="p">Contact Us</Text>
                        </div>
                    </Link>
                </div>
            </div>
            <Footer />
        </>
    )
}