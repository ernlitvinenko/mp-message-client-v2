import {proxy} from "valtio/vanilla";
import ChatService, {ChatData, CreateChatProps, MessageData,} from "@/service/chatService";
import _ from "lodash";
import {AuthStore} from "@/store/authStore";

type MessageStoreData = MessageData & {
    isNew: boolean
}

type ChatStoreType = {
    chats: ChatData[]
    messages: MessageStoreData[]
}

export const ChatStore = proxy<ChatStoreType>({
    chats: [],
    messages: []
})

export const loadChats = async () => {
    try {
        const respList = await ChatService.listChats()
        if (respList.status !== 200) {
            return false
        }
        ChatStore.chats = respList.data
        return true
    }
    catch (e) {
        console.log(e)
        return false
    }
}

export const loadMessages = async (chatId: number, page: number = 1) => {
    try {
        const respList = await ChatService.listMessages(chatId, page)
        if (respList.status !== 200 ) {
            return false
        }
        ChatStore.messages.length = 0
        ChatStore.messages = [...ChatStore.messages, ...respList.data.map(e => ({...e, isNew: false}) )
        ]
        ChatStore.messages = _.sortBy(ChatStore.messages, (o) => -o.id)
    }
    catch (e) {
        console.log(e)
        return false
    }
}


export const createChat = async (props: CreateChatProps) => {
    try {
        const respCreate = await ChatService.createChat(props)
        if (respCreate.status > 300 && respCreate.status < 200) {
            return false
        }
        return await loadChats()
    }
    catch (e) {
        console.log(e)
        return false
    }
}

export const sendMessage = async (message: string, chatId: number) => {
    try {
        const resp = await ChatService.sendMessage(message, chatId)
        if (resp.status > 300 && resp.status < 200) {
            return false
        }
        return true
    }
    catch (e) {
        console.log(e)
        return false
    }
}


export const addMessageViaSocket = (d: MessageData) => {
    if (_.find(ChatStore.messages, (o) => {return o.id == d.id}) != undefined) {
        return
    }
    ChatStore.messages.push({...d, isNew: d.sender.id !== AuthStore.user?.id})
    ChatStore.messages = _.sortBy(ChatStore.messages, (o) => -o.id)
}