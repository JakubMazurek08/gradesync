
import {Text} from "./Text.tsx"

interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    size?: 'large' | 'medium' | 'small';
    variant?: 'important' | 'default';
}

export const Button = ({children, size, variant, ...props}: ButtonProps) => {
    return (
        <button className={`${variant == 'important' ? 'bg-blue-500 hover:bg-transparent'  : 'bg-transparent hover:bg-blue-500'} w-fit px-4 py-1 border-blue-500 border-2  rounded-lg cursor-pointer active:scale-95 transition-all duration-200`} {...props}>
            {size === 'large' ? (
                <Text type="h3">{children}</Text>
            ) : size === 'small' ? (
                <Text type="p"><span className='text-white'>{children}</span></Text>
            ) : (
                <Text type="h4">{children}</Text>
            )}
        </button>
    )
}