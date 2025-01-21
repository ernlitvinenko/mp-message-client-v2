import {useRouter} from "next/navigation";
import {useEffect} from "react";
import {checkAuthorization, logout} from "@/store/authStore";

export const useAuth = () => {
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
                }
            }
        )

    }, []);

}