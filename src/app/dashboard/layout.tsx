"use client"

import {Input} from "@nextui-org/input";
import {ReactNode, useEffect, useState} from "react";
import {Button} from "@nextui-org/button";
import {CiCirclePlus, CiSearch, CiSettings} from "react-icons/ci";
import {AuthStore, logout} from "@/store/authStore";
import  {useRouter} from "next/navigation";
import {useAuth} from "@/hooks/authHooks";
import AccountCard from "../../components/account/account";
import {useSnapshot} from "valtio/react";
import CreateChatModal from "@/components/modals/createChatModal";
import MainDrawer from "@/components/drawers/mainDrawer";
import ChatList from "@/components/aside/chatList";
import $socket, {connect} from "@/service/socket/socketService";
import {addMessageViaSocket} from "@/store/chatStore";

export default function Dashboard({children}: { children: ReactNode }) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const accountData = useSnapshot(AuthStore)
    const router = useRouter()
    useAuth()

    // Handlers
    const logoutHandler = () => {
        logout().then(
            () => router.replace("/auth")
        )
    }

    useEffect(() => {
        $socket.connect()
        $socket.on("connect", () => {
            console.log("SOCKET IS CONNECTED: ", $socket.connected)
            connect()
        })

        $socket.on("new_message", (args) => {
            addMessageViaSocket(JSON.parse(args))
        })
    }, []);


    return <>
        <div className="grid grid-cols-12 max-h-screen min-h-screen">
            <div
                className={"col-start-1 col-end-4 pt-4 px-4 shadow-lg rounded-br-xl rounded-tr-xl bg-gray-200 max-h-screen"}>

                <AccountCard name={accountData.user ? accountData.user.name : ""}>
                    <Button isIconOnly variant={"light"} onPress={() => setIsDrawerOpen(true)}><CiSettings
                        size={30}/></Button>
                </AccountCard>

                <div className="flex items-center mb-8 max-h-[10%]">
                    <Input className={"mr-2"} label={"Поиск"} startContent={
                        <CiSearch/>
                    }/>

                    <Button isIconOnly size={"lg"} onPress={() => setIsModalOpen(true)}>
                        <CiCirclePlus size={20}/>
                    </Button>
                </div>

                <ChatList />


            </div>
            <section className={"col-start-4 col-end-13 px-5 py-5 grid grid-rows-12"}>
                {children}
            </section>
        </div>

        <MainDrawer logoutHandler={() => logoutHandler()} onOpenChange={(o) => setIsDrawerOpen(o)}
                    isOpen={isDrawerOpen}/>

        <CreateChatModal isOpen={isModalOpen} onOpenChange={(o) => setIsModalOpen(o)}/>
    </>
}