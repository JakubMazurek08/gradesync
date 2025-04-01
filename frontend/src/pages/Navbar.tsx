import { Outlet } from "react-router-dom";
import { Text } from "../components/Text.tsx";
import { Stars, Calendar, Book, Clock, Message, Settings} from "../components/Icons.tsx";
import { useEffect} from "react";
import { NavbarButton } from "../components/NavbarButton.tsx";
import { LoginPage } from "./LoginPage.tsx";
import { useUserStore } from "../stores/userStore";

export const Navbar = () => {
    const { userId, setUserId } = useUserStore();

    useEffect(() => {
        fetch('http://localhost:3000/login', {
            method: 'GET',
            credentials: 'include'
        })
            .then(res => (res.json().then(data=>setUserId(data.id))))
            .catch(error => console.error('Error fetching user data:', error));
    }, []);

    return (
        <>
            <aside className='hidden sm:flex w-80 h-screen bg-darkgray fixed p-4 flex-col justify-between'>
                <div>
                    <img className='w-[270px] text-red-500' src='/GradeSyncLogoDarkMedium.png' alt='GradeSync' />
                    <div className='flex flex-col gap-2 mt-10'>
                        <NavbarButton url='/'> <Stars /> <Text type='nav'>Dashboard</Text></NavbarButton>
                        <NavbarButton url='/grades'> <Calendar /> <Text type='nav'>Grades</Text></NavbarButton>
                        <NavbarButton url='/calendar'> <Book /> <Text type='nav'>Calendar</Text></NavbarButton>
                        <NavbarButton url='/messages'> <Clock /> <Text type='nav'>Messages</Text></NavbarButton>
                        <NavbarButton url='/frequency'> <Message /> <Text type='nav'>Frequency</Text></NavbarButton>
                    </div>
                </div>
                <div className='w-full border-t-3 border-lightgray rounded-full'></div>
                <NavbarButton url='/settings'> <Settings/> <Text type='nav'>Settings</Text></NavbarButton>
            </aside>
            <main className={'sm:pl-80'}>
                {userId ? <Outlet /> : <LoginPage />}
            </main>
        </>
    );
};
