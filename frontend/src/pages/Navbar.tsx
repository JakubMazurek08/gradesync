import {Outlet} from "react-router-dom";
import {Text} from "../components/ui/Text.tsx";
import {Stars, Calendar, Book, Clock, Message, Settings, Hamburger} from "../components/ui/Icons.tsx";
import {useEffect, useState} from "react";
import {NavbarButton} from "../components/ui/NavbarButton.tsx";
import {LoginPage} from "./LoginPage.tsx";
import {useUserStore} from "../stores/userStore";
import {Link} from "react-router-dom";

export const Navbar = () => {
    const {userId, setUserId, setIsTeacher} = useUserStore();
    const [hamburgerToggle, setHamburgerToggle] = useState<boolean>(false);
    useEffect(() => {
        const URL = import.meta.env.VITE_URL + "login";

        fetch(URL, {
            method: 'GET',
            credentials: 'include'
        })
            .then(res => (res.json().then(data => {setUserId(data.id); setIsTeacher(data.isTeacher);}))
            .catch(error => console.error('Error fetching user data:', error)))
    }, []);

    return (
        <>
            {hamburgerToggle ? <button onClick={() => {
                setHamburgerToggle(false)
            }} className={"bg-lightgray transition-all duration-1000 opacity-5 h-screen w-screen fixed z-20"}></button> : null}


            <nav className="lg:hidden fixed w-screen h-24 flex flex-row-reverse justify-between px-5 sm:px-10 bg-background z-10">
                <button className='text-white' onClick={() => {
                    setHamburgerToggle(true)
                }}><Hamburger/></button>
                <img src='/GradeSyncLogoDarkSmall.png' alt='GradeSync'/>
            </nav>

            <aside
                className={`z-20 w-80 flex h-screen bg-darkgray fixed p-4 flex-col justify-between ${hamburgerToggle ? 'translate-x-0' : '-translate-x-80'} lg:translate-x-0 duration-300 transition-all`}>
                <div>
                    <Link to={'/'}><img className='w-[270px] cursor-pointer' src='/GradeSyncLogoDarkMedium.png' alt='GradeSync'/></Link>
                    <div className='flex flex-col gap-2 mt-10'>
                        <NavbarButton url='/'> <Stars/> <Text type='nav'>Dashboard</Text></NavbarButton>
                        <NavbarButton url='/grades'> <Calendar/> <Text type='nav'>Grades</Text></NavbarButton>
                        <NavbarButton url='/calendar'> <Book/> <Text type='nav'>Calendar</Text></NavbarButton>
                        <NavbarButton url='/messages'> <Clock/> <Text type='nav'>Messages</Text></NavbarButton>
                        <NavbarButton url='/frequency'> <Message/> <Text type='nav'>Frequency</Text></NavbarButton>
                    </div>
                </div>
                <div className='w-full border-t-3 border-lightgray rounded-full'></div>
                <NavbarButton url='/settings'> <Settings/> <Text type='nav'>Settings</Text></NavbarButton>
            </aside>


            <main className={'lg:pl-80 lg:pt-0 pt-24'}>
                {userId ? <Outlet/> : <LoginPage/>}
            </main>
        </>
    );
};
