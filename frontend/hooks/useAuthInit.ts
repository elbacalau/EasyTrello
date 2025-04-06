"use client"

import { useEffect } from "react"
import { useAuth } from "./useAuth";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/types/hooks";
import { setUser } from "@/store/slices/userSlice";


export const useAuthInit = () => {
    const { userData } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const init = async () => {
            const user = await userData();
            if (!user) {
                router.replace("/login")
            }
        };

        init();
    }, [])
}