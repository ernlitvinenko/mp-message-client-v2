"use client"
import {Spinner} from "@nextui-org/spinner";
import {useEffect} from "react";
import {checkAuthorization, logout} from "@/store/authStore";
import {useRouter} from "next/navigation";

export default function Home() {
    const router = useRouter()

    useEffect(() => {
            const token = localStorage.getItem("token")
            if (token === null) {
                logout().then(
                    () => router.push("/auth")
                )
            }
            checkAuthorization().then(
                (d) => {
                    if (!d) {
                        router.push("/auth")
                        return
                    }
                    router.replace("/dashboard")
                }
            )
        }
    )
    return (
        <>
            <div className="flex justify-center items-center min-h-screen">
                <Spinner/>
            </div>
        </>

    );
}