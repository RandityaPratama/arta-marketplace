    // src/components/ui/Button.js
    import React from "react";

    const Button = ({
    variant = "primary",
    size = "md",
    icon = null,
    onClick,
    children,
    className = "",
    type = "button",
    disabled = false,
    ...props
    }) => {
    const baseStyles = "font-[Poppins] font-[500] rounded-[10px] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed";

    // 🔸 Perbarui variantStyles: tambahkan 'custom' atau biarkan className mengatur bg
    const getVariantClass = () => {
        if (variant === "primary") {
        return "bg-[#1E3A8A] text-white hover:bg-[#162e68]";
        } else if (variant === "secondary") {
        return "bg-[#FED7AA] text-[#1E3A8A] hover:bg-[#ffca7a]";
        } else if (variant === "outline") {
        return "border border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white";
        } else if (variant === "danger") {
        return "border border-red-600 text-red-600 hover:bg-red-600 hover:text-white" ;
        } else {
        // Jika variant bukan yang dikenal, biarkan className yang atur semuanya
        return "";
        }
    };

    const sizeStyles = {
        sm: "px-3 py-1.5 text-[13px]",
        md: "px-4 py-2.5 text-[15px]",
        lg: "px-6 py-3 text-[16px]",
    };

    // 🔸 Gabungkan: base + variant + size + custom className
    const combinedClassName = `${baseStyles} ${getVariantClass()} ${sizeStyles[size]} ${className}`.trim();

    return (
        <button
        type={type}
        className={combinedClassName}
        onClick={onClick}
        disabled={disabled}
        {...props}
        >
        {icon}
        {children}
        </button>
    );
    };

    export default Button;