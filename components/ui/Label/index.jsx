export const Label = ({ children, ...props }) => {
    return (
        <label
            className="block text-sm md:text-[1rem] mb-2 text-gray-700 font-bold"
            {...props}
        >
            {children}
        </label>
    );
}