import {createBrowserRouter, RouterProvider} from "react-router-dom"
import {Footer} from "./components/Footer.tsx";
import {PricingLP} from "./pages/PricingLP.tsx";
import {LandingPage} from "./pages/LandingPage.tsx"

const router = createBrowserRouter([
    {
        path: '/',
        element: <LandingPage/>
    },
    {
        path: '/footer',
        element: <Footer />
    },
    {
        path: '/pricing',
        element: <PricingLP />
    },
])

export const Router = () => {
    return <RouterProvider router={router}/>
}