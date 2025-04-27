import {getGradientColor} from "../../lib/gradientColors.ts";

interface GradeProps {
    value: number;
    size?: 'small' | 'medium' | 'large'
}


export const Grade = ({value, size = 'medium'}:GradeProps) => {
    const gradientPercentage = `${Math.min(Math.max(value, 0), 100)}%`; // Ensure value is between 0-100

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
            className={`flex items-center justify-center shrink-0 ${sizeMap[size]} rounded-full`}
            style={{
                background: `conic-gradient(from 0deg, ${getGradientColor(value)} ${gradientPercentage}, #3C3C3C ${gradientPercentage})`,
            }}
        >
            <div className={`flex items-center justify-center ${innerSizeMap[size]} rounded-full bg-mediumgray`}>
                <h1
                    className={`${
                        size === "large"
                            ? "text-[24px]"
                            : size === "small"
                                ? "text-[10px]"
                                : "text-[16px]"
                    } text-white font-semibold font-open-sans`}
                >
                    {value}
                </h1>
            </div>
        </div>
    );
}