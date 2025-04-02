import {Text} from "./Text.tsx";

export const Footer = () => {
    return (
        <footer className="bg-mediumgray text-white p-16">
            <div className="container mx-auto px-4 grid grid-cols-4 gap-32 min-h-[300px]">
                {/* Logo - adjusted to expand leftward */}
                <div className="flex justify-start items-start -ml-38">
                    <img src="/GradeSyncLogoDarkSmall.png" alt="logo" className="h-24" />
                </div>

                <div>
                    <Text type='h3'>About</Text>
                    <ul className="mt-4 space-y-3">
                        <li className="py-2 text-lg text-lightgray">System</li>
                        <li className="py-2 text-lg text-lightgray">Features</li>
                        <li className="py-2 text-lg text-lightgray">Connect with Us</li>
                        <li className="py-2 text-lg text-lightgray">Legal</li>
                        <li className="py-2 text-lg text-lightgray">Privacy Policy</li>
                        <li className="py-2 text-lg text-lightgray">Trust Center</li>
                    </ul>
                </div>

                <div>
                    <Text type='h3'>Headquarters</Text>
                    <ul className="mt-4 space-y-3">
                        <li className="py-2 text-lg text-lightgray">1614 Santa Monica Blvd, Santa Monica, CA 90404</li>
                        <li className="py-2 text-lg text-lightgray">+1 (312) 555-8392</li>
                        <li className="py-2 text-lg text-lightgray">+1 (415) 555-7248</li>
                        <li className="py-2 text-lg text-lightgray">Contact Us</li>
                    </ul>
                </div>

                <div>
                    <Text type='h3'>Pricing</Text>
                    <ul className="mt-4 space-y-3">
                        <li className="py-2 text-lg text-lightgray">Pricing site</li>
                    </ul>
                </div>
            </div>
        </footer>
    );
}