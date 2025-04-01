import {Outlet} from "react-router-dom";
import {Text} from "../components/Text.tsx";
import {Stars, Calendar, Book, Clock, Message} from "../components/Icons.tsx";
import {useLocation, Link} from 'react-router-dom';


export const Navbar = () => {
    return(
        <>
            <aside className='hidden sm:block w-80 h-screen bg-darkgray fixed p-4'>
                <img className='w-[270px] text-red-500' src='/GradeSyncLogoDarkMedium.png' alt='GradeSync'/>
                <div className='flex flex-col gap-2 mt-10'>
                    <NavbarButton url='/'> <Stars/> <Text type='nav'>Dashboard</Text></NavbarButton>
                    <NavbarButton url='/grades'> <Calendar/> <Text type='nav'>Grades</Text></NavbarButton>
                    <NavbarButton url='/calendar'> <Book/> <Text type='nav'>Calendar</Text></NavbarButton>
                    <NavbarButton url='/messages'> <Clock/> <Text type='nav'>Messages</Text></NavbarButton>
                    <NavbarButton url='/frequency'> <Message/> <Text type='nav'>Frequency</Text></NavbarButton>
                </div>
            </aside>
            <main className={'sm:pl-80'}><Outlet/></main>
        </>
    )
}

interface navbarButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{
    children: React.ReactNode;
    url: string;
}

const NavbarButton = ({children, url}:navbarButtonProps) => {
    const location = useLocation().pathname;

    return(
        <Link to={url} className={`${location===url? 'bg-blue-500 text-white' : 'bg-transparent text-lightgray'} py-2 px-4 w-[250px] rounded-full cursor-pointer flex items-center gap-2 transition-all duration-500`}>{children}</Link>
    )
}