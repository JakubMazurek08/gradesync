import { Text } from "../components/ui/Text";

export const Footer = () => {
    return (
        <footer className="bg-mediumgray text-white py-8 md:py-12 lg:py-16">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:hidden space-y-8 mb-8">
                    <div className="flex justify-center">
                        <img src="/GradeSyncLogoDarkSmall.png" alt="logo" className="h-16" />
                    </div>
                    <div className="text-center">
                        <Text type='h3'>About</Text>
                        <ul className="mt-3 space-y-2">
                            <li className="py-1 text-base text-lightgray hover:text-white transition-colors">System</li>
                            <li className="py-1 text-base text-lightgray hover:text-white transition-colors">Features</li>
                            <li className="py-1 text-base text-lightgray hover:text-white transition-colors">Connect with Us</li>
                            <li className="py-1 text-base text-lightgray hover:text-white transition-colors">Legal</li>
                            <li className="py-1 text-base text-lightgray hover:text-white transition-colors">Privacy Policy</li>
                            <li className="py-1 text-base text-lightgray hover:text-white transition-colors">Trust Center</li>
                        </ul>
                    </div>
                    <div className="text-center">
                        <Text type='h3'>Headquarters</Text>
                        <ul className="mt-3 space-y-2">
                            <li className="py-1 text-base text-lightgray">1614 Santa Monica Blvd, Santa Monica, CA 90404</li>
                            <li className="py-1 text-base text-lightgray">+1 (312) 555-8392</li>
                            <li className="py-1 text-base text-lightgray">+1 (415) 555-7248</li>
                            <li className="py-1 text-base text-lightgray hover:text-white transition-colors">Contact Us</li>
                        </ul>
                    </div>
                    <div className="text-center">
                        <Text type='h3'>Pricing</Text>
                        <ul className="mt-3">
                            <li className="py-1 text-base text-lightgray hover:text-white transition-colors">Pricing site</li>
                        </ul>
                    </div>
                </div>
                <div className="hidden lg:grid grid-cols-4 gap-8 xl:gap-16">
                    <div className="flex items-start">
                        <img src="/GradeSyncLogoDarkSmall.png" alt="logo" className="h-20" />
                    </div>
                    <div>
                        <Text type='h3'>About</Text>
                        <ul className="mt-4 space-y-2">
                            <li className="py-1 text-base text-lightgray hover:text-white transition-colors cursor-pointer">System</li>
                            <li className="py-1 text-base text-lightgray hover:text-white transition-colors cursor-pointer">Features</li>
                            <li className="py-1 text-base text-lightgray hover:text-white transition-colors cursor-pointer">Connect with Us</li>
                            <li className="py-1 text-base text-lightgray hover:text-white transition-colors cursor-pointer">Legal</li>
                            <li className="py-1 text-base text-lightgray hover:text-white transition-colors cursor-pointer">Privacy Policy</li>
                            <li className="py-1 text-base text-lightgray hover:text-white transition-colors cursor-pointer">Trust Center</li>
                        </ul>
                    </div>
                    <div>
                        <Text type='h3'>Headquarters</Text>
                        <ul className="mt-4 space-y-2">
                            <li className="py-1 text-base text-lightgray">1614 Santa Monica Blvd, Santa Monica, CA 90404</li>
                            <li className="py-1 text-base text-lightgray">+1 (312) 555-8392</li>
                            <li className="py-1 text-base text-lightgray">+1 (415) 555-7248</li>
                            <li className="py-1 text-base text-lightgray hover:text-white transition-colors cursor-pointer">Contact Us</li>
                        </ul>
                    </div>
                    <div>
                        <Text type='h3'>Pricing</Text>
                        <ul className="mt-4">
                            <li className="py-1 text-base text-lightgray hover:text-white transition-colors cursor-pointer">Pricing site</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 pt-6 border-t border-gray-700 text-sm text-center text-lightgray">
                    <p>© {new Date().getFullYear()} GradeSync. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}