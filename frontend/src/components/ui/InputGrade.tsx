import { useState } from "react";
import { getGradientColor } from "../../lib/gradientColors.ts";

interface InputGradeProps extends React.InputHTMLAttributes<HTMLInputElement> {
    defaultValue?: number;
    inputSize?: "small" | "medium" | "large";
}

export const InputGrade = ({
                               inputSize = "medium",
                               defaultValue = 50,
                               ...rest
                           }: InputGradeProps) => {
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

    const fontSizeMap = {
        small: "text-[10px]",
        medium: "text-[16px]",
        large: "text-[24px]",
    };

    return (
        <div
            className={`flex items-center justify-center shrink-0 ${sizeMap[inputSize]} rounded-full`}
            style={{
                background: `conic-gradient(from 0deg, ${getGradientColor(value)} ${gradientPercentage}, #3C3C3C ${gradientPercentage})`,
            }}
        >
            <div
                className={`flex items-center justify-center ${innerSizeMap[inputSize]} rounded-full bg-mediumgray`}
            >
                <input
                    {...rest}
                    type="text"
                    inputMode="numeric"
                    placeholder={`${value}`}
                    value={value}
                    onInput={(e) => {
                        const val = e.currentTarget.value;
                        if (/^\d*$/.test(val)) {
                            const num = parseInt(val || "0", 10);
                            if (num >= 0 && num <= 100) {
                                setValue(num);
                            } else if (val === "") {
                                setValue(0);
                            }
                        }
                    }}
                    className={`${fontSizeMap[inputSize]} text-white font-semibold font-open-sans text-center outline-none`}
                    style={{
                        width: `min(${value.toString().length + 1}ch, 4ch)`,
                        minWidth: "2ch",
                    }}
                />
            </div>
        </div>
    );
};
