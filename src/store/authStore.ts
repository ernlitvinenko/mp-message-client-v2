import {proxy} from "valtio/vanilla";
import AuthService from "@/service/authService";

type UserType = {
    id : number,
    name: string,
    username: string
}

type AuthStoreInterface = {
    token: string,
    user: UserType | null,
    isAuthenticated: boolean
}

export const AuthStore = proxy<AuthStoreInterface>({
    token: "",
    user: null,
    isAuthenticated: false
})


export const loginUser = async  (username: string, password: string): Promise<boolean> => {
    try {
        const resp = await AuthService.login(username, password)
        if (resp.status != 200) {
            AuthStore.isAuthenticated = false
            AuthStore.token = ""
            AuthStore.user = null
            return false
        }
        localStorage.setItem("token", resp.data.access_token)
        AuthStore.isAuthenticated = true

        const profileResp = await AuthService.getUserInfo()

        if (profileResp.status != 200) {
            AuthStore.isAuthenticated = false
            AuthStore.token = ""
            AuthStore.user = null
            return false
        }

        AuthStore.user = profileResp.data
        return true
    }
    catch (e) {
        console.log(e)
        return false
    }
}

export const logout = async () => {
    localStorage.removeItem("token")
    AuthStore.isAuthenticated = false
    AuthStore.token = ""
    AuthStore.user = null
}

export const checkAuthorization = async () => {
    try {
    const token = localStorage.getItem("token")
    if (token === null) {
        await logout()
        return false
    }

    const profileResp = await AuthService.getUserInfo()

    if (profileResp.status != 200) {
        await logout()
        return false
    }

    AuthStore.isAuthenticated = true
    AuthStore.user = profileResp.data
    return true}
    catch (e) {
        console.log(e)
        return false
    }

}