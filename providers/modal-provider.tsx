"use client";

import {use, useEffect, useState} from "react";

import { RenameModal } from "@/components/modal/rename-modal";

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);
    
    if (!isMounted) {
        return null;
    }

    
    
    return (
        <>
            <RenameModal />
        </>
    );
}