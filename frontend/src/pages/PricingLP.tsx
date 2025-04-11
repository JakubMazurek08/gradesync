import { Text } from "../components/Text.tsx";
import { NavBar } from "../components/NavBar.tsx";
import { Link } from "react-router-dom";
import { Footer } from "../components/Footer.tsx";

export const PricingLP = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <div className="md:block">
                <NavBar />
            </div>
            <div className="container mx-auto px-4 md:px-8 pt-8 md:pt-16 text-center">
                <Text type="h1">GradeSync Plans</Text>
                <div className="mt-3 mb-8">
                    <Text type="p">Find the perfect plan for your educational needs</Text>
                </div>
            </div>
            <div className="container mx-auto flex flex-col md:flex-row items-stretch justify-center gap-6 md:gap-4 lg:gap-8 px-4 py-8">
                {/* first card */}
                <div className="w-full md:w-1/3 max-w-sm mx-auto bg-mediumgray rounded-3xl border-3 border-mediumlight-gray transform-gpu transition-all duration-300 hover:shadow-xl hover:translate-y-1 hover:bg-opacity-95">
                    <div className="p-6 md:p-8 flex flex-col h-full">
                        <div className="mb-4">
                            <Text type="h3">FREE</Text>
                        </div>
                        <div className="mb-6">
                            <Text type="h4">$0/month</Text>
                        </div>
                        <div className="mb-8 flex-grow">
                            <Text type="p">Limited platform for tracking grades</Text>
                            <ul className="mt-4 space-y-3">
                                <li className="flex items-start">
                                    <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <Text type="p">Basic grade tracking</Text>
                                </li>
                                <li className="flex items-start">
                                    <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <Text type="p">Community support</Text>
                                </li>
                            </ul>
                        </div>
                        <div className="mt-auto pt-4">
                            <Link to="/" className="block">
                                <div className="bg-mediumlight-gray w-full h-14 flex items-center justify-center rounded-xl shadow-md transition-all duration-300 hover:scale-105 hover:bg-purple-500 hover:text-white hover:shadow-lg">
                                    <Text type="p">Try Free →</Text>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-1/3 max-w-sm mx-auto bg-mediumgray rounded-3xl border-3 border-mediumlight-gray transform-gpu transition-all duration-300 hover:shadow-xl hover:translate-y-1 hover:bg-opacity-95 relative">
                    {/* second card */}
                    <div className="absolute -top-3 right-4 bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                        Popular
                    </div>

                    <div className="p-6 md:p-8 flex flex-col h-full">
                        <div className="mb-4">
                            <Text type="h3">DEDICATED</Text>
                        </div>
                        <div className="mb-6">
                            <Text type="h4">$10/month</Text>
                        </div>
                        <div className="mb-8 flex-grow">
                            <Text type="p">Enhanced platform for comprehensive tracking</Text>
                            <ul className="mt-4 space-y-3">
                                <li className="flex items-start">
                                    <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <Text type="p">Advanced grade tracking</Text>
                                </li>
                                <li className="flex items-start">
                                    <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <Text type="p">Academic progress reports</Text>
                                </li>
                                <li className="flex items-start">
                                    <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <Text type="p">Upcoming assignments tracker</Text>
                                </li>
                            </ul>
                        </div>
                        <div className="mt-auto pt-4">
                            <Link to="/" className="block">
                                <div className="bg-purple-500 w-full h-14 flex items-center justify-center rounded-xl shadow-md text-white transition-all duration-300 hover:scale-105 hover:bg-purple-600 hover:shadow-lg">
                                    <Text type="p">Get Started →</Text>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
                {/* third card*/}
                <div className="w-full md:w-1/3 max-w-sm mx-auto bg-mediumgray rounded-3xl border-3 border-mediumlight-gray transform-gpu transition-all duration-300 hover:shadow-xl hover:translate-y-1 hover:bg-opacity-95">
                    <div className="p-6 md:p-8 flex flex-col h-full">
                        <div className="mb-4">
                            <Text type="h3">FOR TEAM</Text>
                        </div>
                        <div className="mb-6">
                            <Text type="h4">$49/month</Text>
                        </div>
                        <div className="mb-8 flex-grow">
                            <Text type="p">Complete platform with team collaboration</Text>
                            <ul className="mt-4 space-y-3">
                                <li className="flex items-start">
                                    <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <Text type="p">All Dedicated features</Text>
                                </li>
                                <li className="flex items-start">
                                    <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <Text type="p">Up to 10 team members</Text>
                                </li>
                                <li className="flex items-start">
                                    <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <Text type="p">Team collaboration tools</Text>
                                </li>
                                <li className="flex items-start">
                                    <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <Text type="p">Priority support</Text>
                                </li>
                            </ul>
                        </div>
                        <div className="mt-auto pt-4">
                            <Link to="/" className="block">
                                <div className="bg-mediumlight-gray w-full h-14 flex items-center justify-center rounded-xl shadow-md transition-all duration-300 hover:scale-105 hover:bg-purple-500 hover:text-white hover:shadow-lg">
                                    <Text type="p">Get Started →</Text>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container mx-auto px-4 py-12 md:py-16 lg:pb-32">
                <div className="bg-mediumgray rounded-3xl shadow-md mx-auto max-w-4xl">
                    <div className="p-6 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex-1">
                            <div className="mb-3 md:mb-4">
                                <Text type="h3">Questions about pricing?</Text>
                            </div>
                            <div>
                                <Text type="h4">
                                    Talk to us for more information about features, sizing,
                                    <br className="hidden md:block" />
                                    support plans, and consulting.
                                </Text>
                            </div>
                        </div>
                        <div className="flex-shrink-0">
                            <Link to="/">
                                <div className="bg-purple-500 hover:bg-blue-500 text-white px-6 md:px-10 py-4 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl font-medium flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                                    </svg>
                                    <Text type="p">Contact Us</Text>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-auto">
                <Footer />
            </div>
        </div>
    );
};