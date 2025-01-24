"use client"
import {Spinner} from "@nextui-org/spinner";
import {Button} from "@nextui-org/button";
import {useSnapshot} from "valtio/react";
import {ChatStore, loadChats} from "@/store/chatStore";
import {ReactNode, useEffect, useState, useTransition} from "react";
import {Badge} from "@heroui/badge";
import {useRouter} from "next/navigation";
import {AiFillDelete} from "react-icons/ai";
import {Listbox} from "@nextui-org/listbox";
import {ListboxItem} from "@heroui/listbox";


type ChatItemProps = {
    badgeContent?: number
    chatId: number
    chatName: string

}

const DropdownWrapper = ({children, isVisible, onRightClick}: {
    children: ReactNode,
    isVisible: boolean,
    onRightClick: () => void
}) => {
    return (
        <>
            <div className="relative">
                <div onContextMenu={(e) => {
                    e.preventDefault()
                    onRightClick()
                }}>
                    {children}
                </div>
                <Listbox
                    className={`transition-opacity ${isVisible ? "absolute bottom-[-65px] left-0 bg-gray-50 z-20 rounded-2xl shadow-2xl" : "opacity-0 -z-10 absolute"}`}>
                    <ListboxItem startContent={<AiFillDelete size={20}/>} key={'exit'} className={"text-danger p-4"}>Выйти
                        из канала</ListboxItem>
                </Listbox>
            </div>

        </>
    )
}


function ChatItem(props: ChatItemProps) {

    const router = useRouter()
    const [showMenu, setShowMenu] = useState(false)


    const base = <Button size={"md"} variant={"ghost"} className={"min-h-[70px] w-full"}
                         onPress={() => router.push(`/dashboard/${props.chatId}`)}>
        <div className="block w-full text-wrap text-left">
            {props.chatName}
        </div>
    </Button>


    if (!props.badgeContent) {
        return (
            <>
                <DropdownWrapper onRightClick={() => setShowMenu(true)} isVisible={showMenu}>
                    {base}
                </DropdownWrapper>
                <div className={`transition-opacity absolute top-0 left-0 h-full w-full  ${showMenu ? "z-10 bg-black/20 backdrop-blur-sm opacity-100" : "-z-10 opacity-0"}`} onClick={() => setShowMenu(false)}></div>
            </>
        )
    }

    return (
        <DropdownWrapper onRightClick={() => setShowMenu(true)} isVisible={showMenu}>
            <Badge color={"primary"} content={props.badgeContent}>
                {base}
            </Badge>
        </DropdownWrapper>
    )
}

export default function ChatList() {

    const chatSnapshot = useSnapshot(ChatStore)
    const [isPendingLoadChats, startTransitionLoadChats] = useTransition()


    const getNewMessages = (chatId: number) => {
        return chatSnapshot.messages.filter(e => e.chat_id === chatId && e.isNew)
    }

    useEffect(() => {
        startTransitionLoadChats(async () => {
            loadChats()
        })
    }, []);


    return (
        <div onClick={() => {

        }} className="[&>*]:mb-4 h-[calc(100vh-30%)] overflow-auto py-4">
            {isPendingLoadChats && <Spinner/>}
            {!isPendingLoadChats && chatSnapshot.chats.map((value) =>
                <ChatItem chatId={value.id} chatName={value.name!} badgeContent={getNewMessages(value.id).length}
                          key={value.id}/>)
            }
        </div>
    )
}