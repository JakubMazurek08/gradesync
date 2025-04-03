import {Button} from "../components/ui/Button.tsx";
import {useUserStore} from "../stores/userStore.ts";

export const Settings = () => {
    const { logout } = useUserStore();

    const logoutUser = () => {
        logout();
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }

    return <Button onClick={logoutUser}>Logout</Button>
}