import {createBrowserRouter, RouterProvider} from "react-router-dom"
import {Home} from "./pages/Home.tsx"
import {EasterEgg} from "./pages/EasterEgg.tsx"
import {LandingPage} from "./pages/LandingPage.tsx"

const router = createBrowserRouter([
    {
    path: '/',
    element: <Home/>
    },
    {
        path: '/EasterEgg',
        element: <EasterEgg/>
    },
    {
        path: '/LandingPage',
        element: <LandingPage/>
    }
])

export const Router = () => {
    return <RouterProvider router={router}/>
}