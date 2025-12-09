    import React from "react";
    import { useNavigate } from "react-router-dom";
    import Button from "../components/ui/Button";
    import Footer from "./Footer";
    import Background from "./Background"


    export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <>
        
        <div className="font-[Poppins] bg-[#fafafa] min-h-screen flex flex-col items-center justify-center px-4 py-12">
            <div className="max-w-md text-center">
            {/* Ikon */}
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#f0f7ff] rounded-full mb-6">
                <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="#1E3A8A"
                className="w-10 h-10"
                >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 5.604a7.5 7.5 0 1115.606 0A7.5 7.5 0 0112 21.75c-1.5 0-2.93-.25-4.255-.738L6.5 20l-.5-1.5L5 19l-.5 1-1.5.5a7.5 7.5 0 01-.738-1.245z" />
                </svg>
            </div>

            {/* Judul */}
            <h1 className="text-3xl font-bold text-[#111111] mb-3">Ups! Halaman Tidak Ditemukan</h1>

            {/* Deskripsi */}
            <p className="text-[#6F6F6F] text-lg mb-8">
                Halaman yang Anda cari sedang dalam pengembangan atau tidak tersedia.
            </p>

            
            </div>
        </div>
        
        </>
    );
    }