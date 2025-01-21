"use client"
import {Card, CardBody} from "@nextui-org/card";
import {Avatar} from "@nextui-org/avatar";
import {ReactNode} from "react";

type AccountCardPropsType = {
    name: string
    children?: ReactNode
}

export default function AccountCard(props: AccountCardPropsType) {

    return (

        <Card className={"flex mb-4 max-h-[20%]"}>
            <CardBody>
                <div className="flex flex-wrap items-center">
                    <Avatar className={"lg:mr-4 mb-4 lg:mb-0"}/>
                    <div className="lg:w-2/3 w-full">
                        {props.name}
                    </div>
                    {props.children}
                </div>
            </CardBody>
        </Card>
    )


}
