    // src/components/GradientLayout.js
    import React from "react";

    export default function GradientLayout({ children }) {
    return (
        <div className="font-[Poppins] min-h-screen p-0">
        <div
            className="min-h-screen"
            style={{
            background: 'linear-gradient(135deg, #e2e9fd 0%, #fef9f3 50%, #e2e9fd 100%)',
            animation: 'pulse 8s ease-in-out infinite'
            }}
        >
            <style jsx>{`
            @keyframes pulse {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            `}</style>
            {children}
        </div>
        </div>
    )
    }