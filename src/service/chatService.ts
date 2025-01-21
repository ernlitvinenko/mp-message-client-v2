import $api from "@/service/default";
import {UserResponse} from "@/service/authService";

export type CreateChatProps = {
    name: string | null,
    profile_ids: number[]
}

export type MessageData = {
    id: number
    chat_id: number
    sender: UserResponse
    message: string
    created_at: string
}

export type ChatData = {
    id: number,
    name: string | null
    profiles: UserResponse[]
    lastMessageData: MessageData
    messages_count: number
}

export default class ChatService{
    static async listChats() {
        return await $api.get<ChatData[]>("/chats")
    }

    static async listMessages(chatId: number, page: number = 1) {
        return await $api.get<MessageData[]>(`/chats/${chatId}/messages`, {
            params: {
                page
            }
        })
    }

    static async createChat(props: CreateChatProps) {
        return await $api.post("/chats", props)
    }

    static async exitChat(chatId: number) {
        return await $api.delete(`/chats/${chatId}`)
    }

    static async sendMessage(message: string, chatId: number) {
        return await $api.post<MessageData>(`/chats/${chatId}/messages`, {
            message
        })
    }

    static async deleteMessage(messageId: number) {
        return await $api.post(`/chats/messages/${messageId}`)
    }

}