"use client"

import {Card, CardBody, CardHeader} from "@nextui-org/card";
import {Form} from "@nextui-org/form";
import {Input} from "@nextui-org/input";
import {Button} from "@nextui-org/button";
import Image from "next/image";
import {FormEvent, useState} from "react";
import {loginUser} from "@/store/authStore";
import {useRouter} from "next/navigation";

export default function Authenticate() {

    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const router = useRouter()

    const submitHandler = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true)
        const {username, password} = Object.fromEntries(new FormData(e.currentTarget)) as {username: string, password: string};
        console.log(username, password)
        loginUser(username, password).then((r) => {
            setIsLoading(false)
            if (!r) {
                setErrors({
                    username: "Неправильное имя пользователя или пароль",
                    password: "Неправильное имя пользователя или пароль"
                })
                return
            }
            router.push("/dashboard")

        }).catch(
            () => setIsLoading(false)
        )
    }

    return <>
        <div className="flex w-full min-h-screen items-center justify-center bg-gray-100">
            <Card className={"w-1/2 mx-auto"}>
                <CardHeader className={"flex justify-center py-4"}>
                   <Image src={"jde-logo.svg"} alt={"#"} width={120} height={120}/>
                </CardHeader>
                <CardBody className={"pb-4"}>
                    <Form onSubmit={submitHandler} validationErrors={errors}>
                        <Input  label={"Имя пользователя"} name={"username"}/>
                        <Input label={"Пароль"} type={"password"} className={"mb-4"} name={"password"}/>
                        <Button type={"submit"} className={"w-full"} color={"primary"} isLoading={isLoading}>Войти</Button>
                    </Form>
                </CardBody>
            </Card>
        </div>
    </>
}