import {Drawer, DrawerBody, DrawerContent} from "@nextui-org/drawer";
import AccountCard from "@/components/account/account";
import {Button} from "@nextui-org/button";
import {DrawerProps} from "@nextui-org/drawer";
import {useSnapshot} from "valtio/react";
import {AuthStore} from "@/store/authStore";


type MainDrawerProps = Required<Pick<DrawerProps, 'isOpen' | 'onOpenChange'>> & {
    logoutHandler: () => void
}

export default function MainDrawer(props: MainDrawerProps) {

    const accountData = useSnapshot(AuthStore)

    return (
        <Drawer isOpen={props.isOpen} onOpenChange={props.onOpenChange}>
            <DrawerContent>
                <DrawerBody className={"py-8"}>
                    <h1 className={"text-2xl font-bold"}>Настройки</h1>
                    <AccountCard name={accountData.user ? accountData.user.name : ""}/>
                    <Button color={"primary"} variant={"bordered"} onPress={props.logoutHandler}>Выйти</Button>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    )
}