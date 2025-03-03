"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

export default function SessionProviderWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            <SessionProvider>{children}</SessionProvider>
        </>
    );
}

