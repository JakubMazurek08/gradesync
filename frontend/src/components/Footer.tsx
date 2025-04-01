import {Text} from "./Text.tsx";

export const Footer = () => {
    return (
        <footer className="bg-[#333333] text-white p-16">
            <div className="container mx-auto px-4 grid grid-cols-4 gap-4 min-h-[300px]">
                {/* Logo */}
                <div className="flex justify-start">
                    <img src="/GradeSyncLogoDarkSmall.png" alt="logo" className="h-24" />
                </div>
                <div>
                    <Text type='h3'>About</Text>
                    <ul className="mt-2 space-y-3">
                        <li className="py-2 text-lg">System</li>
                        <li className="py-2 text-lg">Features</li>
                        <li className="py-2 text-lg">Connect with Us</li>
                        <li className="py-2 text-lg">Legal</li>
                        <li className="py-2 text-lg">Privacy Policy</li>
                        <li className="py-2 text-lg">Trust Center</li>
                    </ul>
                </div>
                <div className="grid grid-cols-2 gap-8">
                    <div>
                        <Text type='h3'>Headquarters</Text>
                        <ul className="mt-2 space-y-3">
                            <li className="py-2 text-lg">1614 Santa Monica Blvd, Santa Monica, CA 90404</li>
                            <li className="py-2 text-lg">+1 (312) 555-8392</li>
                            <li className="py-2 text-lg">+1 (415) 555-7248</li>
                            <li className="py-2 text-lg">Contact Us</li>
                        </ul>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-8">
                    <div>
                        <Text type='h3'>Pricing</Text>
                        <ul>
                            <li className="py-4 text-lg">Pricing site</li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
}