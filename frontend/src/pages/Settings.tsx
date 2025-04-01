import {Button} from "../components/Button.tsx";
import {useUserStore} from "../stores/userStore.ts";

export const Settings = () => {
    const { logout } = useUserStore();

    return <Button onClick={logout}>Logout</Button>
}