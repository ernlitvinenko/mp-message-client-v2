import $api from "@/service/default";

type LoginResponse = {
    access_token: string,
    token_type: string
}

export type UserResponse = {
    id: number,
    name: string,
    username: string
}

export default class AuthService {
    static async login(username: string, password: string) {
        return await $api.postForm<LoginResponse>("/token", {
            username,
            password
        })
    }

    static async getUserInfo() {
        return await $api.get<UserResponse>("/profile")
    }


    static async searchProfiles(search: string) {
        return await $api.get<UserResponse[]>("/profiles", {
            params: {
                search
            }
        })
    }

    static async getUserById(id: string) {
        return await $api.get<UserResponse>(`/profiles/${id}`)
    }
}