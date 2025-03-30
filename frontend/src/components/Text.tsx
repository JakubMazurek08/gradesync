interface TextProps {
    children: React.ReactNode;
    type?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'small';
}

export const Text = ({children, type}:TextProps) => {
    if (type === 'h1') {
        return <h1 className={"text-[40px] sm:text-[48px] text-white font-bold font-open-sans"}>{children}</h1>;
    }else if (type === 'h2'){
        return <h2 className={"text-[32px] sm:text-[40px] text-white font-bold font-open-sans"}>{children}</h2>;
    }else if (type === 'h3'){
        return <h3 className={"text-[24px] sm:text-[32px] text-white font-semibold font-open-sans"}>{children}</h3>;
    }else if (type === 'h4'){
        return <h4 className={"text-[20px] sm:text-[24px] text-white font-semibold font-open-sans"}>{children}</h4>;
    }else if (type === 'small'){
        return <small className={"text-[16px] sm:text-[16px] text-lightgray font-open-sans"}>{children}</small>;
    }
    return <p className={`text-[20px] sm:text-[20px] text-lightgray font-open-sans`}>{children}</p>;
}
