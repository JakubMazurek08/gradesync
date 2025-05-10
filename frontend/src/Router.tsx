import {createBrowserRouter, RouterProvider} from "react-router-dom"
import {Dashboard} from "./pages/Dashboard.tsx"
import {Navbar} from "./pages/Navbar.tsx";
import {GradesPage} from "./pages/GradesPage.tsx";
import {Settings} from "./pages/Settings.tsx";
import {WheelPage} from "./pages/WheelOfNames/WheelPage.tsx";


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
            },
            {
                path: '/settings',
                element: <Settings/>
            }
        ]
    },{
        path: '/wheel',
        element: <WheelPage/>
    }
])

export const Router = () => {
    return <RouterProvider router={router}/>
}