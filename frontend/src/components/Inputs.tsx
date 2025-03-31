interface InputsProps {
    placeholder?: string,
    size?: 'large' | 'medium',
};

export const Inputs = ({size, placeholder}:InputsProps) => {
    if(size === 'large'){
        return (
            <input placeholder={placeholder}
                   className={'w-full border-1 border-gray text-[20px] sm:text-[24px] text-white font-semibold font-open-sans px-2 rounded-lg focus:outline-none'}
                   type="text"/>
        )
    }
    return (
        <input placeholder={placeholder}
               className={'w-full border-1 border-gray text-[16px] sm:text-[16px] text-white font-open-sans py-1 px-2 rounded-lg focus:outline-none'} type="text"/>
    )
}