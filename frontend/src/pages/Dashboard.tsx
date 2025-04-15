import {Text} from "../components/ui/Text.tsx";
import {useEffect, useState} from "react";
import {InputGrade} from "../components/ui/InputGrade.tsx";
// import {Button} from "../components/Button.tsx";
// import {Input} from "../components/Input.tsx";


export const Dashboard = () => {

    const [firstName, setFirstName] = useState('');

    useEffect(() => {
        fetch(`http://localhost:3000/user/firstName`,{
            method: "GET",
            credentials: "include",
        }).then((res) => res.json()).then((data) => setFirstName(data.firstName));
    }, []);

    return(
        <>
            <Text type={'h2'}>{firstName}</Text>
            <InputGrade/>
        </>
    )
}