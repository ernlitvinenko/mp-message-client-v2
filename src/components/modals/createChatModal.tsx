import {ModalContent, ModalProps} from "@nextui-org/modal";
import {Modal, ModalBody} from "@nextui-org/react";
import {Alert} from "@heroui/alert";
import {Form} from "@nextui-org/form";
import {Input} from "@nextui-org/input";
import {Spinner} from "@nextui-org/spinner";
import {Checkbox, CheckboxGroup} from "@heroui/checkbox";
import {IoFolderOpenOutline} from "react-icons/io5";
import {Divider} from "antd";
import {Button} from "@nextui-org/button";
import {ChangeEvent, FormEvent, useEffect, useState} from "react";
import AuthService, {UserResponse} from "@/service/authService";
import {useDebounceFn} from "@reactuses/core";
import {createChat} from "@/store/chatStore";
import {useSnapshot} from "valtio/react";
import {AuthStore} from "@/store/authStore";


type CreateChatModalProps = Pick<ModalProps, 'isOpen' | 'onOpenChange'>

export default function CreateChatModal({isOpen, onOpenChange}: CreateChatModalProps) {
    const [searchProfile, setSearchProfile] = useState("")
    const [isSearchProfileLoading, setIsSearchProfileLoading] = useState(false)

    const [usersData, setUsersData] = useState<UserResponse[]>([])
    const [selectedAccounts, setSelectedAccounts] = useState<string[]>([])
    const [selectedAccountsWithNames, setSelectedAccountsWithNames] = useState<UserResponse[]>([])

    const [chatName, setChatName] = useState("")
    const [createChatLoading, setCreateChatLoading] = useState(false)
    const [createChatErrorAlert, setCreateChatErrorAlert] = useState<string | null>(null)
    const accountData = useSnapshot(AuthStore)

    const {run: searchProfileOnChangeHandler} = useDebounceFn((data: string) => {
        setIsSearchProfileLoading(true)

        if (data.length < 5) {
            setIsSearchProfileLoading(false)
            setUsersData([])
            return
        }

        AuthService.searchProfiles(data).then(({data}) => {
                setIsSearchProfileLoading(false)
                setUsersData(data)
            }
        ).catch(e =>
            console.log(e)
        )

    }, 500)


    const searchInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchProfile(e.target.value)
        searchProfileOnChangeHandler(e.target.value)
    }

    const createChatSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setCreateChatLoading(true)

        const curChatName = selectedAccounts.length === 1 ? null : chatName

        createChat({
            profile_ids: [...selectedAccounts.map(e => +e), accountData.user!.id],
            name: curChatName
        }).then((d) => {
            if (!d) {
                setCreateChatErrorAlert("Что-то пошло не так! Попробуйте снова")
            } else {
                onOpenChange!(false)
            }
            setCreateChatLoading(false)
        })
            .catch((e) => {
                console.log(e)
                setCreateChatErrorAlert("Что-то пошло не так! Попробуйте снова")
                setCreateChatLoading(false)
            })
    }


    useEffect(() => {
        setSelectedAccountsWithNames([])
        selectedAccounts.map(id => {
            AuthService.getUserById(id).then(account =>
                setSelectedAccountsWithNames((prevState) => [...prevState, account.data])
            )
        })
    }, [selectedAccounts]);


    return <Modal isOpen={isOpen} size={"xl"} onOpenChange={onOpenChange}>
        <ModalContent>
            <ModalBody className={"py-5"}>
                <h2 className={"text-2xl font-bold mb-4"}>Создать чат</h2>
                {createChatErrorAlert && <Alert color={"danger"}>{createChatErrorAlert}</Alert>}


                <Form onSubmit={createChatSubmitHandler}>
                    <h3 className={"text-xl font-bold"}>Поиск участников</h3>
                    <Input className={"mb-2"} value={searchProfile} label={"ФИО сотрудника"}
                           onChange={searchInputHandler}/>
                    {isSearchProfileLoading ? <Spinner/> :
                        <CheckboxGroup className={"max-h-[100px] overflow-y-scroll w-full"} value={selectedAccounts}
                                       onChange={v => setSelectedAccounts(v)}>
                            {usersData.length == 0 ? <>
                                    <div className="flex items-center">
                                        <IoFolderOpenOutline size={40} className={"text-primary mr-2"}/>
                                        <p>Начните вводить данные...</p>
                                    </div>

                                </>
                                : usersData.map(elem => <Checkbox key={elem.id}
                                                                  value={`${elem.id}`}>{elem.name}</Checkbox>)}
                        </CheckboxGroup>
                    }
                    <Divider/>

                    <h3 className={"text-xl font-bold"}>Введите название чата: </h3>
                    <ul>
                        {selectedAccountsWithNames.map(e => <li key={e.id}>{e.name}</li>)}
                    </ul>

                    <Checkbox isSelected={selectedAccounts.length === 1} isDisabled>Личный Чат</Checkbox>
                    <Input value={chatName} onChange={event => setChatName(event.target.value)}
                           label={"Название чата"} size={"sm"} isDisabled={selectedAccounts.length === 1}/>

                    <Divider/>

                    <Button color={"primary"} isDisabled={selectedAccounts.length < 1} type={"submit"}
                            isLoading={createChatLoading}>Создать</Button>
                </Form>
            </ModalBody>
        </ModalContent>

    </Modal>
}