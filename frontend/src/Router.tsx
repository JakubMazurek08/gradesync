import {createBrowserRouter, RouterProvider} from "react-router-dom"
import {Footer} from "./components/Footer.tsx";
import {PricingLP} from "./pages/PricingLP.tsx";
import {LandingPage} from "./pages/LandingPage.tsx"
import {Dashboard} from "./pages/Dashboard.tsx"
import {Navbar} from "./pages/Navbar.tsx";
import {GradesPage} from "./pages/GradesPage.tsx";
import {Settings} from "./pages/Settings.tsx";
import {CalendarPage} from "./pages/CalendarPage.tsx";

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
    {
      path: '/dashboard',
      element: <Navbar/>,
      children:[
          {
              path: '/',
              element: <Dashboard/>
          },
          {
              path: '/grades',
              element: <GradesPage />
          },
          {
              path: '/grades/:course',
              element: <GradesPage />
          },
          {
              path: '/settings',
              element: <Settings/>
          },
          {
              path: '/calendar',
              element: <CalendarPage/>
          }
      ]
    },
])

export const Router = () => {
    return <RouterProvider router={router}/>
}