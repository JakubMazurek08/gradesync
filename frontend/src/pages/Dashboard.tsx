import {Text} from "../components/Text.tsx";
import {useEffect, useState} from "react";
import {useUserStore} from "../stores/userStore.ts";
// import {Button} from "../components/Button.tsx";
// import {Input} from "../components/Input.tsx";


export const Dashboard = () => {

    const { userId } = useUserStore();
    const [firstName, setFirstName] = useState('');

    useEffect(() => {
        fetch(`http://localhost:3000/user/firstName/${userId}`).then((res) => res.json()).then((data) => setFirstName(data.firstName));
    }, []);
    return(
        <>
            <Text type={'h2'}>{firstName}</Text>
        </>
    )
}