"use client"


import {Button} from "@nextui-org/button";
import {Input} from "@nextui-org/input";
import {FaFileUpload} from "react-icons/fa";
import {useEffect, useMemo, useRef, useState, useTransition} from "react";
import {ChatStore, loadMessages, sendMessage} from "@/store/chatStore";
import {useSnapshot} from "valtio/react";
import {Spinner} from "@nextui-org/spinner";
import {ChatData} from "@/service/chatService";
import {Alert} from "@heroui/alert";
import {Card, CardBody} from "@nextui-org/card";
import {AuthStore} from "@/store/authStore";
import InfiniteScroll from "react-infinite-scroll-component";


type PagePropsType =
    {
        params: Promise<{ chatId: string }>
    }

export default function Page({params}: PagePropsType) {

    const chatState = useSnapshot(ChatStore)
    const [chatId, setChatId] = useState<number | null>(null)
    const [currentChat, setCurrentChat] = useState<ChatData | null>(null)
    const [messageText, setMessageText] = useState("")
    const [isPending, startTransition] = useTransition()
    const [sendMessagePending, startTransitionSendMessage] = useTransition()
    const [errorText, setErrorText] = useState<string | null>(null)
    const authData = useSnapshot(AuthStore)
    const [currentPage, setCurrentPage] = useState(1)
    const scrollableUl = useRef(null)

    const fetchNext = async () => {
        setCurrentPage(prev => prev + 1)
        await loadMessages(chatId!, currentPage)
    }

    const currentChatMessages = useMemo(() => ChatStore.messages.filter(e => e.chat_id == currentChat?.id), [currentChat, ChatStore.messages]);

    useEffect(() => {
        startTransition(async () => {
            const {chatId: cid} = await params
            setChatId(+cid)
            await loadMessages(+cid)
        })
    }, [params]);



    useEffect(() => {
        if (chatId != null) {
            setCurrentChat(chatState.chats.filter(e => e.id == chatId)[0] as ChatData | null)
        }
    }, [chatId, chatState]);

    const sendMessageHandler = async () => {
        if (chatId) {
            const d = await sendMessage(messageText, chatId)
            if (!d) {
                setErrorText("Что-то пошло не так, попробуйте снова")
                return
            }
            setErrorText(null)
            setMessageText("")
        }
    }
    const onKeyPressEnter = ({key}: { key: string }) => {
        if (key === "Enter") {
            startTransitionSendMessage(sendMessageHandler)
        }
    }

    return <>
        <div className="header row-start-1 row-end-2 max-h-[10vh]">
            <h1 className={"text-4xl font-bold"}>{currentChat?.name}</h1>
            {errorText && <Alert color={"danger"}>{errorText}</Alert>}
        </div>

        {isPending ? <Spinner/> :
            <ul ref={scrollableUl} className={"chat flex-1 row-start-2 row-end-12 h-[80vh] overflow-y-scroll"}>
                <InfiniteScroll
                    initialScrollY={1000}
                    next={() => {
                    fetchNext()
                }}
                                hasMore={currentChat ? currentChatMessages.length < currentChat.messages_count : true}
                                loader={<Spinner/>}
                                dataLength={currentChatMessages.length}
                                inverse={true}
                                className={"flex flex-col-reverse p-4 overflow-visible"}
                                scrollableTarget={scrollableUl.current}

                >
                    {
                        currentChatMessages.map(e => {
                                if (e.sender.id == authData.user?.id) {
                                    return (
                                        <div className={"block mb-2 w-1/3 ml-auto"} key={e.id}>
                                            <Card className={"bg-primary text-white "}>
                                                <CardBody>{e.message}</CardBody>
                                            </Card>
                                        </div>
                                    )
                                }
                                return (
                                    <div className={"block mb-2 w-1/3 mr-auto"} key={e.id}>
                                        <Card className={""}>
                                            <CardBody>{e.message}</CardBody>
                                        </Card>
                                        <span className={"text-gray-400"}>{e.sender.name}</span>
                                    </div>
                                )
                            }
                        )
                    }
                </InfiniteScroll>
            </ul>
        }

        <div className="flex items-center [&>*]:px-4 max-h-[10vh] row-start-12" onKeyPress={onKeyPressEnter}>
            <Button size={'lg'} isIconOnly> <FaFileUpload/> </Button>
            <Input value={messageText} label={"Сообщение"}
                   onChange={e => setMessageText(e.target.value)}></Input>
            <Button color={"primary"} onPress={() => startTransitionSendMessage(sendMessageHandler)}
                    isLoading={sendMessagePending}
                    isDisabled={sendMessagePending || messageText.length < 1}>Отправить</Button>
        </div>
    </>
}