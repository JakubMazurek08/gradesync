interface InputsProps{
    placeholder?: string,
};

export const Inputs = ({placeholder}:InputsProps) => {
    return (
        <input placeholder={placeholder} className={'w-full border-1 border-gray text-[20px] sm:text-[24px] text-white font-semibold font-open-sans p-2 rounded-lg'} type="text"/>
    )
}