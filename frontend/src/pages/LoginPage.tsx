import {Input} from "../components/Input.tsx";
import {Button} from "../components/Button";
import {useState} from "react";
import {useUserStore} from "../stores/userStore.ts";

export const LoginPage = () => {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const { setUserId } = useUserStore();

    const handleLogin = (e : React.FormEvent) => {
        e.preventDefault();
        const URL = import.meta.env.VITE_URL + 'login'
        fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                login:login,
                password:password
            }),
        }).then(res=>
        res.json().then(data => setUserId(data.id)))

    }

    return (
        <form onSubmit={handleLogin}>
            <Input onChange={(e)=>{setLogin(e.target.value)}} placeholder={'type login...'}/>
            <Input onChange={(e)=>{setPassword(e.target.value)}} placeholder={'type password...'}/>
            <Button type="submit">Login</Button>
        </form>
    )
}