import {Link, useLocation} from "react-router-dom";

interface navbarButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{
    children: React.ReactNode;
    url: string;
}

export const NavbarButton = ({children, url}:navbarButtonProps) => {
    const location = useLocation().pathname;

    return(
        <Link to={url} className={`${location===url? 'bg-blue-500 text-white' : 'bg-transparent text-lightgray'} py-2 px-4 w-[250px] rounded-full cursor-pointer flex items-center gap-2 transition-all duration-500`}>{children}</Link>
)
}