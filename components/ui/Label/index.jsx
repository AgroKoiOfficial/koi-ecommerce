import { useTheme } from "next-themes";
export const Label = ({ children, ...props }) => {
    const { theme } = useTheme();
    return (
        <label
            className={`block text-sm md:text-[1rem] mb-2 ${theme === "dark" ? "text-white" : "text-gray-700"} font-bold`}
            {...props}
        >
            {children}
        </label>
    );
}