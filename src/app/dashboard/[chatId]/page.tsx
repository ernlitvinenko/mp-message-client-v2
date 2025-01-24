"use client"


import {Button} from "@nextui-org/button";
import {Input} from "@nextui-org/input";
import {FaFileExport, FaFileUpload} from "react-icons/fa";
import {useEffect, useMemo, useRef, useState, useTransition} from "react";
import {ChatStore, loadMessages, sendMessage} from "@/store/chatStore";
import {useSnapshot} from "valtio/react";
import {Spinner} from "@nextui-org/spinner";
import {ChatData, MessageData} from "@/service/chatService";
import {Alert} from "@heroui/alert";
import {Card, CardBody} from "@nextui-org/card";
import {AuthStore} from "@/store/authStore";
import InfiniteScroll from "react-infinite-scroll-component";
import {subscribe} from "valtio";
import {Dropdown, DropdownItem, DropdownMenu, DropdownTrigger} from "@heroui/dropdown";
import {Modal, ModalBody} from "@nextui-org/react";
import {ModalContent} from "@nextui-org/modal";


type MessageComponentProps = MessageData & {selfId: number}

const MessageComponent = (props: MessageComponentProps) => {
    if (props.sender.id == props.selfId) {
        return (
            <div className={"block mb-2 w-1/3 ml-auto"}>
                <Card className={"bg-primary text-white "}>
                    <CardBody>{props.message}</CardBody>
                </Card>
            </div>
        )
    }
    return (
        <div className={"block mb-2 w-1/3 mr-auto"}>
            <Card className={""}>
                <CardBody>{props.message}</CardBody>
            </Card>
            <span className={"text-gray-400"}>{props.sender.name}</span>
        </div>
    )
}

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
    const [updates, setUpdates] = useState(0)

    const [openFileDownloadModal, setOpenFileDownloadModal] = useState(false)

    const fetchNext = async () => {
        setCurrentPage(prev => prev + 1)
        await loadMessages(chatId!, currentPage)
    }

    const currentChatMessages = useMemo(() => ChatStore.messages.filter(e => e.chat_id == currentChat?.id), [currentChat, ChatStore.messages, updates]);

    subscribe(ChatStore.messages, () => {
        setUpdates(p => p+1)
    })

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
            if (messageText.length === 0) {
                return
            }
            startTransitionSendMessage(sendMessageHandler)
        }
    }

    return <>
        <div className="header row-start-1 row-end-2 max-h-[10vh]">
            <h1 className={"text-4xl font-bold"}>{currentChat?.name}</h1>
            {errorText && <Alert color={"danger"}>{errorText}</Alert>}
        </div>

        {isPending ? <Spinner/> :
            <ul ref={scrollableUl} className={"chat flex-1 row-start-2 row-end-13 h-[80vh] overflow-y-scroll"}>
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
                        currentChatMessages.map(e => <MessageComponent {...e} selfId={authData.user!.id} key={e.id}/>)
                    }
                </InfiniteScroll>
            </ul>
        }

        <div className="flex items-center [&>*]:px-4 max-h-[10vh] row-start-13" onKeyPress={onKeyPressEnter}>
            <Dropdown trigger={"press"} backdrop={"blur"}>
                <DropdownTrigger>
                    <Button size={'lg'} isIconOnly> <FaFileUpload/> </Button>
                </DropdownTrigger>
                <DropdownMenu>
                    <DropdownItem key={"uploadFile"} startContent={<FaFileExport />} onPress={() => setOpenFileDownloadModal(true)}>Загрузить файл</DropdownItem>
                </DropdownMenu>
            </Dropdown>
            <Input value={messageText} label={"Сообщение"}
                   onChange={e => setMessageText(e.target.value)}></Input>
            <Button color={"primary"} onPress={() => startTransitionSendMessage(sendMessageHandler)}
                    isLoading={sendMessagePending}
                    isDisabled={sendMessagePending || messageText.length < 1}>Отправить</Button>
        </div>
        <Modal isOpen={openFileDownloadModal} onOpenChange={(o) => setOpenFileDownloadModal(o)} size={"xl"}>
            <ModalContent>
                <ModalBody className={"py-4"}>
                    <h2 className={"text-2xl font-bold mt-4"}>Загрузить файл</h2>

                    <div className="dropdownBlock border-primary border-1 p-4 rounded-2xl border-dashed flex items-center justify-center flex-col">
                        <h3 className={"text-lg text-center mb-6"}>Перетащите в эту область файл, который хотите загрузить</h3>

                        <span className={"text-black/50"}>Или выберите файл вручную</span>
                        <Input type={"file"} className={"w-1/2"}/>
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    </>
}