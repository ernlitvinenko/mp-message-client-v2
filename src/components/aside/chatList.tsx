"use client"
import {Spinner} from "@nextui-org/spinner";
import Link from "next/link";
import {Button} from "@nextui-org/button";
import {useSnapshot} from "valtio/react";
import {ChatStore, loadChats} from "@/store/chatStore";
import {useEffect, useTransition} from "react";

export default function ChatList() {

    const chatSnapshot = useSnapshot(ChatStore)
    const [isPendingLoadChats, startTransitionLoadChats] = useTransition()

    useEffect(() => {
        startTransitionLoadChats(async () => {
            loadChats()
        })
    }, []);


    return (
        <div className="[&>*]:mb-4 h-[calc(100vh-30%)] overflow-auto">
            {isPendingLoadChats && <Spinner/>}
            {!isPendingLoadChats && chatSnapshot.chats.map((value) =>
                <Link href={`/dashboard/${value.id}`} key={value.id} className={"h-[70px] w-full block"}>
                    <Button size={"md"} variant={"ghost"} className={"h-[70px] w-full"}>
                        <div className="block w-full text-wrap text-left">
                            {value.name}
                        </div>
                    </Button>
                </Link>
            )}
        </div>
    )
}