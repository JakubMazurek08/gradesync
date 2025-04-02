interface InputsProps extends React.InputHTMLAttributes<HTMLInputElement>{
    placeholder?: string,
    type?: 'large' | 'medium',
};

export const Input = ({type, placeholder, ...rest}:InputsProps) => {
    if(type === 'large'){
        return (
            <input {...rest} placeholder={placeholder}
                   className={'w-full border-1 border-lightgray text-[20px] sm:text-[20px] text-lightgray font-open-sans py-2 px-2 rounded-lg focus:outline-none'}
                   type="text"/>
        )
    }
    return (
        <input {...rest}  placeholder={placeholder}
               className={'w-full border-1 border-lightgray text-[20px] sm:text-[20px] text-lightgray font-open-sans py-1 px-2 rounded-lg focus:outline-none'} type="text"/>
    )
}