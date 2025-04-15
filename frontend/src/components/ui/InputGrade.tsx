import {useState} from "react";
import {getGradientColor} from "../../lib/gradientColors.ts";

interface InputGradeProps extends React.InputHTMLAttributes<HTMLInputElement>{
    defaultValue?: number,
    inputSize?: 'small' | 'medium' | 'large'
}

export const InputGrade = ({inputSize = 'medium', defaultValue = 50, ...rest}: InputGradeProps) => {
    const [value, setValue] = useState(defaultValue);

    const gradientPercentage = `${Math.min(Math.max(value, 0), 100)}%`;

    const sizeMap = {
        small: "size-[24px]",
        medium: "size-[48px]",
        large: "size-[64px]",
    };

    const innerSizeMap = {
        small: "size-[18px]",
        medium: "size-[36px]",
        large: "size-[48px]",
    };

    return (
        <div
            className={`flex items-center justify-center shrink-0 ${sizeMap[inputSize]} rounded-full`}
            style={{
                background: `conic-gradient(from 0deg, ${getGradientColor(value)} ${gradientPercentage}, #3C3C3C ${gradientPercentage})`,
            }}
        >
            <div className={`flex items-center justify-center ${innerSizeMap[inputSize]} rounded-full bg-mediumgray`}>
                <input
                    {...rest}
                    type='text'
                    inputMode='numeric'
                    placeholder={`${value}`}
                    onInput={(e) => {
                        const value = e.currentTarget.value;

                        if (/^\d*$/.test(value)) {
                            const num = parseInt(value || "0", 10);
                            if (num >= 0 && num <= 100) {
                                setValue(num);
                            } else if (value === "") {
                                setValue(0);
                            }
                        }
                    }}
                    className={`${
                        inputSize === "large"
                            ? "text-[24px]"
                            : inputSize === "small"
                                ? "text-[10px]"
                                : "text-[16px]"
                    } text-white font-semibold font-open-sans max-w-full w-5 text-center outline-none`}
                />
            </div>
        </div>
    );
}