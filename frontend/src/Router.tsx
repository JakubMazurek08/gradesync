import {createBrowserRouter, RouterProvider} from "react-router-dom"
import {Home} from "./pages/Home.tsx"
import {Footer} from "./components/Footer.tsx";
import {Dashboard} from "./pages/Dashboard.tsx"
import {Navbar} from "./pages/Navbar.tsx";
import {GradesPage} from "./pages/GradesPage.tsx";
import {PricingLP} from "./pages/PricingLP.tsx";

const router = createBrowserRouter([
    {
        path: '/',
        element: <Navbar/>,
        children:[
            {
                path: '/',
                element: <Dashboard/>
            },
            {
                path: '/grades',
                element: <GradesPage/>
            }
        ]
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