import {Outlet} from "react-router-dom";
import {Text} from "../components/ui/Text.tsx";
import {Stars, Calendar, Book, Clock, Message, Settings, Hamburger} from "../components/ui/Icons.tsx";
import {useEffect, useState} from "react";
import {NavbarButton} from "../components/ui/NavbarButton.tsx";
import {LoginPage} from "./LoginPage.tsx";
import {useUserStore} from "../stores/userStore";

export const Navbar = () => {
    const {userId, setUserId, setIsTeacher} = useUserStore();
    const [hamburgerToggle, setHamburgerToggle] = useState<boolean>(false);

    useEffect(() => {
        fetch('http://localhost:3000/login', {
            method: 'GET',
            credentials: 'include'
        })
            .then(res => (res.json().then(data => {setUserId(data.id); setIsTeacher(data.isTeacher);
                console.log(data.isTeacher);}))
            .catch(error => console.error('Error fetching user data:', error)))
    }, []);

    return (
        <>
            {hamburgerToggle ? <button onClick={() => {
                setHamburgerToggle(false)
            }} className={"bg-lightgray transition-all duration-1000 opacity-5 h-screen w-screen fixed"}></button> : null}


            <nav className="lg:hidden fixed w-screen h-20 flex flex-row-reverse justify-between px-5 sm:px-10">
                <button className='text-white' onClick={() => {
                    setHamburgerToggle(true)
                }}><Hamburger/></button>
                <img className='' src='/GradeSyncLogoDarkSmall.png' alt='GradeSync'/>
            </nav>

            <aside
                className={` w-80 flex h-screen bg-darkgray fixed p-4 flex-col justify-between ${hamburgerToggle ? 'translate-x-0' : '-translate-x-80'} lg:translate-x-0 duration-300 transition-all`}>
                <div>
                    <img className='w-[270px]' src='/GradeSyncLogoDarkMedium.png' alt='GradeSync'/>
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


            <main className={'lg:pl-80 lg:pt-0 pt-20'}>
                {userId ? <Outlet/> : <LoginPage/>}
            </main>
        </>
    );
};
