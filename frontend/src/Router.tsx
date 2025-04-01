import {createBrowserRouter, RouterProvider} from "react-router-dom"
import {Home} from "./pages/Home.tsx"
import {Footer} from "./components/Footer.tsx";

const router = createBrowserRouter([
    {
    path: '/',
    element: <Home/>
    },
    {
        path: '/footer',
        element: <Footer />
    }
])

export const Router = () => {
    return <RouterProvider router={router}/>
}