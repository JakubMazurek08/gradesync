import {createBrowserRouter, RouterProvider} from "react-router-dom"
import {Footer} from "./components/Footer.tsx";
import {Dashboard} from "./pages/Dashboard.tsx"
import {Navbar} from "./pages/Navbar.tsx";
import {GradesPage} from "./pages/GradesPage.tsx";
import {EasterEgg} from "./pages/EasterEgg.tsx"
import {LandingPage} from "./pages/LandingPage.tsx"

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
        path: '/EasterEgg',
        element: <EasterEgg/>
    },
    {
        path: '/LandingPage',
        element: <LandingPage/>
    },
    {
        path: '/footer',
        element: <Footer />
    }
])

export const Router = () => {
    return <RouterProvider router={router}/>
}