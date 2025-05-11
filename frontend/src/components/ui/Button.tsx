import { Text } from "./Text.tsx";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    size?: "large" | "medium" | "small";
    variant?: "important" | "default";
    color?: "default" | "warning";
}

export const Button = ({
                           children,
                           size = "medium",
                           variant = "default",
                           color = "default",
                           ...props
                       }: ButtonProps) => {
    const colorClassMap = {
        default: {
            background: "bg-blue-500",
            border: "border-blue-500",
            hoverBackground: "hover:bg-blue-500",
            hoverBorder: "hover:border-blue-500",
        },
        warning: {
            background: "bg-red-500",
            border: "border-red-500",
            hoverBackground: "hover:bg-red-500",
            hoverBorder: "hover:border-red-500",
        },
    };

    const colors = colorClassMap[color];

    const baseClasses =
        "w-fit px-4 py-1 border-2 rounded-lg cursor-pointer active:scale-95 transition-all duration-200";

    const variantClasses =
        variant === "important"
            ? `${colors.background} hover:bg-transparent ${colors.border}`
            : `bg-transparent ${colors.hoverBackground} ${colors.hoverBorder} border-lightgray`;

    return (
        <button className={`${variantClasses} ${baseClasses}`} {...props}>
            {size === "large" ? (
                <Text type="h3">{children}</Text>
            ) : size === "small" ? (
                <Text type="p">
                    <span className="text-white">{children}</span>
                </Text>
            ) : (
                <Text type="h4">{children}</Text>
            )}
        </button>
    );
};
