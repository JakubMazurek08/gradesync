interface InputsProps extends React.InputHTMLAttributes<HTMLInputElement>{
    placeholder?: string,
    inputSize?: 'large' | 'medium',
};

export const Input = ({inputSize, placeholder, ...rest}:InputsProps) => {
    if(inputSize === 'large'){
        return (
            <input {...rest} placeholder={placeholder}
                   className={'w-full border-1 border-lightgray text-[20px] sm:text-[20px] text-lightgray font-open-sans py-2 px-2 rounded-lg focus:outline-none'}
                   />
        )
    }
    return (
        <input {...rest}  placeholder={placeholder}
               className={'w-full border-1 border-lightgray text-[16px] sm:text-[16px] text-lightgray font-open-sans py-[6px] px-2 rounded-sm focus:outline-none'}/>
    )
}